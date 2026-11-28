// Cataract surgery 3D explainer — public entry point (lazy-loaded chunk).
// API: mount(host, options) -> controller. See docs/implementation/master-redesign-phase-2-3/PHASE_2_ENGINEERING.md
import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createScene, hasWebGL, maxDpr, precompileScene } from './scene.js';
import { createMaterials } from './materials.js';
import { buildEye } from './eye-model.js';
import { STAGES, STRUCTURES, paramsAt } from './stages.js';
import { createTimeline } from './timeline.js';
import { createStateMachine } from './state.js';
import { createUI } from './ui.js';
import { createAdaptiveQuality, observeVisibility } from './perf.js';
import { createReviewPanel, LAYERS } from './review.js';
import { MODEL_VERSION, EYE } from './anatomy.js';
import { fitDistance } from '../surgical-sim/core/orbit.js';

export { STAGES, STRUCTURES } from './stages.js';
export { MODEL_VERSION } from './anatomy.js';

// Global debug counters (exposed on window only in debug mode) used by tests to prove clean teardown.
export const counters = { mounts: 0, destroys: 0, live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0 };
const instances = new WeakMap();

const tick = () => new Promise((r) => setTimeout(r, 0));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ORBIT = { minPolar: 0.4, maxPolar: Math.PI - 0.4, minAz: -1.5, maxAz: 1.5 };
const TARGET_MIN = new THREE.Vector3(-6, -6, -10), TARGET_MAX = new THREE.Vector3(6, 6, 5);
// Camera framing (2026-11 camera pass, same approach as src/surgical-sim/core/orbit.js + engine.js): every preset
// declares `fit` = the half width and half height (mm) of its subject in the view plane through the target. The
// distance is fitted to the canvas size, the (fixed, vertical) field of view and the part of the canvas left free by
// the overlaid controls; the projection centre is shifted to the middle of that free area. The preset position gives
// the viewing direction only.
export const FOV = 32;
/**
 * Zoom range around the fitted distance `base` of the current preset: 0.2–1.45 × base, but never narrower than the
 * former fixed range 11–80 mm (so desktop behaviour is unchanged) and never wider than 160 mm. The 11 mm floor also
 * keeps the camera outside the globe: every target lies at least 4 mm in front of the globe centre.
 */
export const ZOOM = { min: 0.2, max: 1.45, absMin: 11, floorMax: 80, absMax: 160 };
export const zoomLimits = (base) => ({
  minR: Math.max(ZOOM.absMin, base * ZOOM.min),
  maxR: Math.min(ZOOM.absMax, Math.max(ZOOM.floorMax, base * ZOOM.max))
});
// Stages that draw light rays: their caption ("illustrative light path") is reserved as part of the covered area for
// the whole stage, so the camera does not move when the caption appears part-way through.
const RAY_STAGES = STAGES.map((_, i) => { const P = paramsAt(i, 1); return P.scatterRays > 0 || P.focusRays > 0; });
const COMPARE_STAGE = { before: 0, after: STAGES.length - 1 };
// Globe (sclera sphere, anatomy.js) and the clearance the camera keeps from it at any zoom, orbit or pan.
export const GLOBE = { centre: [0, 0, EYE.scleraCenterZ], r: EYE.scleraR, clearance: 1.5 };

export async function mount(host, options = {}) {
  if (!host || host.nodeType !== 1) throw new TypeError('cataract-sim mount(host): host must be an element');
  const prev = instances.get(host);
  if (prev) prev.destroy();
  const sim = new Simulator(host, options);
  instances.set(host, sim.controller);
  await sim.init();
  return sim.controller;
}

class Simulator {
  constructor(host, o) {
    this.host = host;
    this.lang = o.lang === 'en' ? 'en' : 'ar';
    this.theme = o.theme === 'dark' ? 'dark' : 'light';
    this.debug = !!o.debug;
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    this.reduced = typeof o.reducedMotion === 'boolean' ? o.reducedMotion : !!(mq && mq.matches);
    this.autoplay = o.autoplay === true;
    this.reviewMode = o.review === true;
    this.rate = this.reduced ? 0.6 : 1;
    this.speed = 1; // review-mode slow playback multiplier (0.25 / 0.5 / 1)
    this.disposers = [];
    this.events = new Map();
    this.timers = new Set();
    this.destroyed = false;
    this.raf = null;
    this.visible = true;
    this.time = 0;
    this.last = 0;
    this.dirty = true;
    this.fly = null;
    this.resume = 'paused';
    this.focusId = null;
    this.labels = false;
    this.touch = false;
    this.scrubUntil = 0;
    this.params = null;
    this.cam = null;        // { key, preset }: the camera preset the view is on (or flying to)
    this.base = 40;         // fitted distance of that preset in the current view
    this.limits = zoomLimits(40);
    this.userMoved = false; // the visitor turned or zoomed the view since the last preset
    this.safe = { w: 1, h: 1, safe: { l: 0, r: 0, t: 0, b: 0 } };
    this.compareMode = null; // 'before' | 'after' | null
    this.timeline = createTimeline(STAGES.map((s) => s.duration));
    this.stageIndex = 0;
    this.stageP = 0;
    this.sm = createStateMachine({ debug: this.debug, onChange: (s, p) => this.onState(s, p) });
    counters.mounts++; counters.live++;
    this.frame = this.frame.bind(this);
    const self = this;
    this.controller = {
      destroy: () => self.destroy(),
      setLang: (l) => self.setLang(l),
      setTheme: (t) => self.setTheme(t),
      getState: () => self.getState(),
      play: () => self.play(),
      pause: () => self.pause(),
      restart: () => self.restart(),
      goToStage: (i) => self.goToStage(i),
      next: () => self.goToStage(self.stageIndex + 1),
      prev: () => self.goToStage(self.stageIndex - 1),
      seek: (t) => { self.scrubUntil = 0; self.seek(t); },
      resetView: () => self.resetView(),
      compare: (which) => self.compare(which),
      on: (ev, cb) => self.on(ev, cb)
    };
  }

  // ---------- infrastructure ----------
  listen(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    counters.listeners++;
    let done = false;
    const off = () => { if (done) return; done = true; target.removeEventListener(type, fn, opts); counters.listeners--; };
    this.disposers.push(off);
    return off;
  }
  timeout(fn, ms) {
    const id = setTimeout(() => { this.timers.delete(id); fn(); }, ms);
    this.timers.add(id);
    return id;
  }
  on(ev, cb) {
    if (!this.events.has(ev)) this.events.set(ev, new Set());
    this.events.get(ev).add(cb);
    return () => this.events.get(ev)?.delete(cb);
  }
  emit(ev, payload) {
    const set = this.events.get(ev);
    if (!set) return;
    for (const cb of [...set]) { try { cb(payload); } catch (err) { console.warn('[cataract-sim] listener error', err); } }
  }
  get state() { return this.sm.state; }
  get ready3D() { return !!this.three && !['fallback', 'loading', 'idle'].includes(this.state); }

  // ---------- lifecycle ----------
  async init() {
    const ui = (this.ui = createUI(this.host, {
      lang: this.lang, theme: this.theme,
      listen: (t, e, f, o) => this.listen(t, e, f, o),
      isScrubbing: () => performance.now() < this.scrubUntil,
      handlers: {
        close: () => { this.emit('close'); this.host.dispatchEvent(new CustomEvent('cataract-sim:close', { bubbles: true })); },
        start: () => this.play(),
        playPause: () => (this.isPlaying() ? this.pause() : this.play()),
        prev: () => this.goToStage(this.stageIndex - 1),
        next: () => this.goToStage(this.stageIndex + 1),
        replayStage: () => this.replayStage(),
        restart: () => this.restart(),
        zoom: (d) => this.zoom(d),
        resetView: () => this.resetView(),
        toggleLabels: () => this.setLabels(!this.labels),
        toggleCutaway: () => this.toggleCutaway(),
        toggleTouch: () => this.setTouch(!this.touch),
        scrub: (t) => { this.scrubUntil = performance.now() + 300; this.seek(t); },
        goTo: (i) => this.goToStage(i),
        focusStructure: (id) => this.focusStructure(id),
        compare: (which) => this.compare(which),
        keydown: (e) => this.onKey(e)
      }
    }));
    if (this.debug) { window.__cataractSimCounters = counters; }
    this.sm.to('loading');
    ui.setLoadingProgress(5);
    const touchCapable = (navigator.maxTouchPoints || 0) > 0 || (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches);
    ui.setTouchCapable(touchCapable);
    if (!hasWebGL()) { this.enterFallback('no-webgl'); return; }
    await tick();
    if (this.destroyed) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      ui.ref.canvasHost.appendChild(canvas);
      this.three = createScene({ canvas, debug: this.debug, theme: this.theme });
      counters.renderers++;
      ui.setLoadingProgress(25);
      await tick();
      if (this.destroyed) return;
      this.mats = createMaterials();
      ui.setLoadingProgress(55);
      await tick();
      if (this.destroyed) return;
      this.eye = buildEye(this.mats);
      this.three.scene.add(this.eye.root);
      ui.setLoadingProgress(75);
      this.setupControls(canvas);
      this.quality = createAdaptiveQuality({ initialDpr: maxDpr(), onChange: () => { this.resize(); } });
      this.resize();
      this.applyTimeline(0);
      this.goCamera('stage:0', STAGES[0].camera, 0);
      const { renderer, scene, camera } = this.three;
      await precompileScene(renderer, scene, camera, { alive: () => !this.destroyed }); // what the first frame draws, built in parallel (scene.js)
      if (this.destroyed) return;
      ui.setLoadingProgress(100);
      renderer.render(scene, camera);
      // the parts later stages show (instruments, IOL, fragments), built in the background so no stage stalls on them
      const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
      idle(() => {
        if (this.destroyed || !this.three) return;
        if (this.eye && this.eye.prepareDeferred) this.eye.prepareDeferred();
        precompileScene(this.three.renderer, this.three.scene, this.three.camera, { hidden: true, alive: () => !this.destroyed && !!this.three }).catch(() => {});
      }, { timeout: 3000 });
    } catch (err) {
      if (this.destroyed) return;
      console.warn('[cataract-sim] 3D initialisation failed, using fallback', err);
      this.enterFallback('init-error');
      return;
    }
    const canvas = this.three.renderer.domElement;
    this.listen(canvas, 'webglcontextlost', (e) => this.onContextLost(e));
    this.listen(canvas, 'webglcontextrestored', () => this.onContextRestored());
    if ('ResizeObserver' in window) {
      // the viewport: resize the canvas; the overlaid controls (web fonts arriving late, the touch button appearing,
      // a stage title changing the chip): re-measure the free area only
      const ro = new ResizeObserver((entries) => { if (entries.some((e) => e.target === ui.ref.viewport)) this.resize(); else this.applySafe(); });
      ro.observe(ui.ref.viewport);
      for (const el of [ui.ref.viewtools, ui.root.querySelector('.csim-chip')]) if (el) ro.observe(el);
      counters.observers++;
      this.disposers.push(() => { ro.disconnect(); counters.observers--; });
    }
    this.disposers.push(observeVisibility(ui.ref.viewport, (v) => {
      this.visible = v;
      if (v) this.startLoop(); else this.stopLoop();
    }, { listen: (t, e, f, o) => this.listen(t, e, f, o), observer: (d) => { counters.observers += d; } }));
    if (this.reviewMode) this.setupReview();
    this.sm.to('ready');
    ui.showStart(true);
    this.applySafe(); // the chip and the view tools are shown from 'ready' on: frame the first stage around them
    this.startLoop();
    if (this.autoplay && !this.reduced) this.play();
    if (this.debug) this.exposeDebug();
  }

  setupReview() {
    this.review = createReviewPanel(this.ui.root, {
      getLang: () => this.lang,
      getState: () => this.getState(),
      getSpeed: () => this.speed,
      getLayers: () => (this.eye ? this.eye.layers : {}),
      goToStage: (i) => this.goToStage(i),
      setSpeed: (v) => this.setSpeed(v),
      step: (n) => this.stepFrames(n),
      camera: (name) => this.cameraPreset(name),
      setLayer: (id, on) => this.setLayer(id, on),
      screenshot: () => this.screenshot(),
      listen: (t, e, f, o) => this.listen(t, e, f, o)
    });
    this.ui.root.classList.add('csim--review');
  }
  setSpeed(v) {
    const allowed = [0.25, 0.5, 1];
    this.speed = allowed.includes(Number(v)) ? Number(v) : 1;
  }
  // Frame stepping (review): pauses and moves the timeline by n frames of 1/30 s of animation time.
  stepFrames(n) {
    if (!this.ready3D) return;
    if (this.isPlaying()) this.pause();
    if (this.state === 'transitioning') { this.fly = null; this.sm.to('paused'); }
    this.timeline.set(this.timeline.elapsed + (Number(n) || 0) / 30);
    if (this.state !== 'paused') this.sm.to('paused');
    this.ui.showStart(false);
    this.applyTimeline(0);
    this.dirty = true;
  }
  cameraPreset(name) {
    if (!this.ready3D) return;
    const sph = (target, az, polar, dist) => ({ target, position: [target[0] + dist * Math.sin(polar) * Math.sin(az), target[1] + dist * Math.cos(polar), target[2] + dist * Math.sin(polar) * Math.cos(az)] });
    const P = { surgeon: { ...sph([0, 0, 0], 0, Math.PI / 2, 30), fit: [9.4, 7.7] }, side: { ...sph([0, 0, -1.5], 1.45, Math.PI / 2, 34), fit: [10.7, 8.7] } }[name];
    if (P) this.goCamera(`review:${name}`, P, 0.6);
    else this.toStageCamera(0.6);
  }
  setLayer(id, on) {
    if (!this.eye || !LAYERS.includes(id)) return;
    this.eye.setLayers({ [id]: !!on });
    this.applyTimeline(0);
    this.dirty = true;
  }
  screenshot() {
    if (!this.three || !this.ready3D) return null;
    const { renderer, scene, camera } = this.three;
    renderer.render(scene, camera); // same task as toDataURL, so the drawing buffer is still intact
    return renderer.domElement.toDataURL('image/png');
  }

  setupControls(canvas) {
    const { camera } = this.three;
    const c = (this.controls = new OrbitControls(camera, canvas));
    Object.assign(c, {
      enableDamping: true, dampingFactor: 0.09, rotateSpeed: 0.55, zoomSpeed: 0.7, panSpeed: 0.6,
      screenSpacePanning: true, minDistance: this.limits.minR, maxDistance: this.limits.maxR,
      minPolarAngle: ORBIT.minPolar, maxPolarAngle: ORBIT.maxPolar, minAzimuthAngle: ORBIT.minAz, maxAzimuthAngle: ORBIT.maxAz
    });
    // Touch policy: one-finger page scroll keeps working; touch only drives the 3D view in "Explore 3D" mode.
    canvas.style.removeProperty('touch-action');
    this.listen(canvas, 'pointerdown', (e) => { if (e.pointerType === 'touch' && !this.touch) e.stopImmediatePropagation(); }, { capture: true });
    // Wheel policy (Phase 2 refinement, same rule as the procedure simulators): a plain wheel over the viewer scrolls the
    // page instead of being captured; Ctrl/⌘ + wheel (and a trackpad pinch, which arrives as Ctrl + wheel) zooms.
    // Full screen has no page to scroll, so there the plain wheel zooms as before.
    this.listen(canvas, 'wheel', (e) => {
      if (e.ctrlKey || e.metaKey || this.host.querySelector('.csim--expanded')) return;
      e.stopImmediatePropagation();
    }, { capture: true });
    this.listen(c, 'start', () => {
      this.userInput = true; // a pointer, pinch or Ctrl + wheel gesture began (it may still be a plain click)
      if (this.fly) { this.fly = null; this.setLimits(this.limits); if (this.state === 'transitioning') this.sm.to(this.resume); }
    });
    this.listen(c, 'change', () => {
      this.dirty = true;
      // only an actual movement caused by the visitor makes the view theirs (kept on resize, left on seek); camera
      // moves made by the simulator itself (flights, jumps, re-fits) never count
      if (this.userInput && !this.fly && !this.programmatic) this.userMoved = true;
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stopLoop();
    for (const id of this.timers) clearTimeout(id);
    this.timers.clear();
    for (const off of this.disposers.splice(0).reverse()) { try { off(); } catch { /* ignore */ } }
    if (this.controls) { this.controls.dispose(); this.controls = null; }
    if (this.three) {
      const r = this.three.renderer;
      this.three.dispose();
      try { r.forceContextLoss(); } catch { /* ignore */ }
      this.three = null;
      counters.renderers--;
    }
    if (this.review) { this.review.destroy(); this.review = null; }
    if (this.ui) { this.ui.destroy(); this.ui = null; }
    this.events.clear();
    if (instances.get(this.host) === this.controller) instances.delete(this.host);
    if (this.debug && window.__cataractSim && window.__cataractSim.controller === this.controller) delete window.__cataractSim;
    counters.live--; counters.destroys++;
  }

  enterFallback(reason) {
    this.fallbackReason = reason;
    if (this.three) {
      this.stopLoop();
      if (this.controls) { this.controls.dispose(); this.controls = null; }
      try { this.three.dispose(); } catch { /* ignore */ }
      this.three = null; counters.renderers--;
      this.ui.ref.canvasHost.innerHTML = '';
    }
    this.sm.to('fallback');
    this.ui.showNote(null);
    this.ui.showStart(false);
    this.ui.showFallback(true);
    this.ui.setStage(this.stageIndex);
    if (this.debug) this.exposeDebug();
  }

  // ---------- render loop (exactly one) ----------
  startLoop() {
    if (this.raf !== null || this.destroyed || !this.three || !this.visible) return;
    if (['error', 'fallback', 'loading', 'idle'].includes(this.state)) return;
    this.last = performance.now();
    this.quality.reset();
    this.raf = requestAnimationFrame(this.frame);
    counters.rafLoops++;
  }
  stopLoop() {
    if (this.raf === null) return;
    cancelAnimationFrame(this.raf);
    this.raf = null;
    counters.rafLoops--;
  }

  frame(now) {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.time += dt;
    const playing = this.state === 'playing';
    if (playing) {
      const done = this.timeline.advance(dt * this.rate * this.speed);
      this.applyTimeline(dt);
      if (done) this.complete();
    } else {
      this.applyTimeline(dt);
    }
    this.updateFly(dt);
    this.controls.target.clamp(TARGET_MIN, TARGET_MAX);
    this.controls.update();
    this.keepOutsideGlobe();
    const needs = playing || this.fly || this.dirty || this.state === 'transitioning' || this.eye.isAnimating() || this.labels;
    if (!needs) { this.quality.reset(); return; }
    this.dirty = false;
    const { renderer, scene, camera } = this.three;
    renderer.render(scene, camera);
    this.frames = (this.frames || 0) + 1;
    if (this.labels) this.updateHotspots();
    this.quality.tick(now);
  }

  applyTimeline(dt) {
    const { index, p } = this.timeline.locate();
    if (index !== this.stageIndex) this.setStageIndex(index, true);
    this.stageP = p;
    this.params = paramsAt(index, p);
    if (this.compareMode) this.params.highlight = []; // Before / After: the two lenses without a highlight glow
    if (this.eye) this.eye.apply(this.params, { time: this.time, dt, reduced: this.reduced, focusId: this.focusId });
    const cut = this.eye ? (this.eye.userCutaway === null ? this.params.cutaway : this.eye.userCutaway) : false;
    this.ui.setCutaway(cut);
    this.ui.setProgress(this.timeline.progress, index, p);
    const layersOn = !this.eye || this.eye.layers.rays;
    this.ui.setRayNote(layersOn && (this.params.scatterRays > 0.001 || this.params.focusRays > 0.001));
    if (this.review) this.review.updatePosition();
  }

  setStageIndex(i, fly) {
    const changed = i !== this.stageIndex;
    this.stageIndex = i;
    if (changed) {
      if (this.eye) this.eye.setUserCutaway(null);
      this.focusId = null;
      this.ui.setFocus(null);
      this.ui.setStage(i);
      if (!this.compareMode) this.ui.announce(`${this.ui.stageLabel(i)}: ${STAGES[i].title[this.lang]}`); // Before / After announces once, itself
      this.emit('stagechange', { index: i, id: STAGES[i].id });
      if (this.review) this.review.refresh();
      // the covered area depends on the stage (ray caption); every caller moves to a preset right after
      this.applySafe(false);
    }
    if (fly && this.three) this.goCamera(`stage:${i}`, STAGES[i].camera);
    this.dirty = true;
  }

  // ---------- camera ----------
  /** Preset -> { target, position, r } in the current view: the distance is fitted to the free area when it has `fit`. */
  resolve(preset) {
    const t = new THREE.Vector3(...preset.target);
    const off = new THREE.Vector3(...preset.position).sub(t);
    let r = off.length();
    if (preset.fit && this.three && this.safe.w > 1 && this.safe.h > 1) r = fitDistance(preset.fit, this.three.camera.fov, this.safe);
    off.setLength(r);
    return { target: preset.target.slice(), position: t.add(off).toArray(), r };
  }
  /** The one path to a camera preset (stage camera, structure, review view, Before / After, reset). */
  goCamera(key, preset, duration = 1.1) {
    if (!this.three || !preset) return;
    this.cam = { key, preset };
    this.userMoved = false;
    this.userInput = false;
    const res = this.resolve(preset);
    this.base = res.r;
    this.limits = zoomLimits(res.r);
    this.flyTo(res, duration);
    if (this.fly) this.fly.preset = true;
  }
  stageCameraKey() { return this.compareMode ? 'compare' : `stage:${this.stageIndex}`; }
  toStageCamera(duration = 1.1) {
    if (this.compareMode) this.goCamera('compare', STAGES[COMPARE_STAGE.before].camera, duration);
    else this.goCamera(`stage:${this.stageIndex}`, STAGES[this.stageIndex].camera, duration);
  }
  /**
   * The camera never comes closer than GLOBE.clearance to the outside of the globe, whatever the zoom, orbit or pan
   * (the target may be panned towards the globe centre). It is moved back along its line of sight to the target.
   */
  keepOutsideGlobe() {
    if (!this.three || !this.controls) return;
    const cam = this.three.camera.position, T = this.controls.target;
    const C = new THREE.Vector3(...GLOBE.centre), R = GLOBE.r + GLOBE.clearance;
    if (cam.distanceTo(C) >= R) return;
    const d = cam.clone().sub(T);
    if (d.lengthSq() < 1e-9) d.set(0, 0, 1);
    d.normalize();
    const tc = T.clone().sub(C);
    const b = d.dot(tc), c = tc.lengthSq() - R * R;
    const t = -b + Math.sqrt(Math.max(0, b * b - c)); // exit of the ray T + t·d from the clearance sphere
    cam.copy(T).addScaledVector(d, t);
    this.programmatic = true;
    this.controls.update();
    this.programmatic = false;
    this.dirty = true;
  }
  setLimits(l) { if (!this.controls) return; this.controls.minDistance = l.minR; this.controls.maxDistance = l.maxR; }
  /** Drop OrbitControls' leftover damping motion, so a preset is reached exactly (deterministic camera). */
  settleControls() {
    const c = this.controls;
    if (!c) return;
    if (c._sphericalDelta) c._sphericalDelta.set(0, 0, 0);
    if (c._panOffset) c._panOffset.set(0, 0, 0);
    if ('_scale' in c) c._scale = 1;
  }
  jumpCamera(preset) {
    const { camera } = this.three;
    this.settleControls();
    this.setLimits(this.limits);
    camera.position.set(...preset.position);
    this.controls.target.set(...preset.target);
    this.programmatic = true;
    this.controls.update();
    this.programmatic = false;
    this.fly = null;
    this.dirty = true;
  }
  flyTo(preset, duration = 1.1) {
    if (!this.three) return;
    if (this.reduced || duration <= 0) { this.jumpCamera(preset); return; }
    const { camera } = this.three;
    this.settleControls();
    const t0 = this.controls.target.clone();
    const s0 = new THREE.Spherical().setFromVector3(camera.position.clone().sub(t0));
    const t1 = new THREE.Vector3(...preset.target);
    const s1 = new THREE.Spherical().setFromVector3(new THREE.Vector3(...preset.position).sub(t1));
    let dTheta = s1.theta - s0.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    // while flying, the distance limits cover both ends (OrbitControls would otherwise clamp the path)
    this.setLimits({ minR: Math.min(this.limits.minR, s0.radius, s1.radius), maxR: Math.max(this.limits.maxR, s0.radius, s1.radius) });
    this.fly = { t: 0, dur: duration, t0, t1, s0, s1, dTheta };
    this.dirty = true;
  }
  updateFly(dt) {
    const f = this.fly;
    if (!f) return;
    f.t = Math.min(1, f.t + dt / f.dur);
    const e = easeInOut(f.t);
    const tgt = f.t0.clone().lerp(f.t1, e);
    const s = new THREE.Spherical(
      f.s0.radius + (f.s1.radius - f.s0.radius) * e,
      f.s0.phi + (f.s1.phi - f.s0.phi) * e,
      f.s0.theta + f.dTheta * e
    );
    this.controls.target.copy(tgt);
    this.three.camera.position.copy(tgt).add(new THREE.Vector3().setFromSpherical(s));
    if (f.t >= 1) {
      this.fly = null;
      this.setLimits(this.limits);
      if (this.state === 'transitioning') this.sm.to(this.resume);
    }
  }
  /** After a resize or a change of the covered area: a camera still on its preset is re-fitted; a visitor's own view keeps its distance (within the new limits). */
  refit() {
    if (!this.cam || !this.controls || !this.three) return;
    const res = this.resolve(this.cam.preset);
    this.base = res.r;
    this.limits = zoomLimits(res.r);
    if (this.userMoved) { this.setLimits(this.limits); this.controls.update(); this.dirty = true; return; }
    if (this.fly && this.fly.preset) {
      this.fly.s1.radius = res.r;
      this.setLimits({ minR: Math.min(this.limits.minR, this.fly.s0.radius, res.r), maxR: Math.max(this.limits.maxR, this.fly.s0.radius, res.r) });
      return;
    }
    this.jumpCamera(res);
  }
  zoom(dir) {
    if (!this.ready3D) return;
    const { camera } = this.three;
    const target = this.controls.target;
    const off = camera.position.clone().sub(target);
    // consecutive clicks accumulate from the pending zoom target rather than the mid-flight distance
    const base = this.fly && this.fly.zoom ? this.fly.s1.radius : off.length();
    const d = THREE.MathUtils.clamp(base * (dir > 0 ? 0.8 : 1.25), this.limits.minR, this.limits.maxR);
    off.setLength(d);
    this.userMoved = true;
    this.flyTo({ target: target.toArray(), position: target.clone().add(off).toArray() }, 0.35);
    if (this.fly) this.fly.zoom = true;
  }
  resetView() {
    if (!this.ready3D) return;
    this.focusId = null;
    this.ui.setFocus(null);
    this.toStageCamera(0.9);
  }
  focusStructure(id) {
    const s = STRUCTURES.find((x) => x.id === id);
    if (!s) return;
    this.leaveCompare(); // a structure view is not the comparison view
    this.focusId = id;
    this.ui.setFocus(id);
    if (this.ready3D) this.goCamera(`structure:${id}`, s.camera, 0.9);
    this.dirty = true;
  }
  updateHotspots() {
    const { camera, renderer } = this.three;
    const el = renderer.domElement;
    const w = el.clientWidth, h = el.clientHeight;
    const v = new THREE.Vector3();
    const list = this.eye.anchors().map((a) => {
      v.set(...a.pos).project(camera);
      const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
      return { id: a.id, x, y, visible: !a.hidden && v.z < 1 && x > 8 && x < w - 8 && y > 8 && y < h - 8 };
    });
    // simple collision avoidance so labels never stack on top of each other
    const shown = list.filter((h) => h.visible).sort((a, b) => a.y - b.y);
    for (let k = 1; k < shown.length; k++) {
      for (let j = 0; j < k; j++) {
        const a = shown[j], b = shown[k];
        if (Math.abs(a.x - b.x) < 130 && b.y - a.y < 34) b.y = a.y + 34;
      }
    }
    this.ui.updateHotspots(list);
  }

  resize() {
    if (!this.three || !this.ui) return;
    const vp = this.ui.ref.viewport;
    const w = Math.max(1, vp.clientWidth), h = Math.max(1, vp.clientHeight);
    const { renderer, camera } = this.three;
    renderer.setPixelRatio(this.quality ? this.quality.dpr : maxDpr());
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // one vertical field of view at every size: the fitted distance (not a wider lens) keeps the subject whole on a
    // narrow phone, as in the procedure simulators
    camera.fov = FOV;
    this.applySafe();
    if (this.raf === null && this.state !== 'error' && this.state !== 'fallback' && this.state !== 'loading') {
      try { renderer.render(this.three.scene, camera); } catch { /* ignore */ }
    }
  }
  /**
   * Re-measure the part of the canvas the overlaid controls leave free and shift the projection centre to its middle,
   * so a stage's target is never under the controls (in Arabic the tools sit on the other side). refit = false when
   * the caller moves to a preset right after.
   */
  applySafe(refit = true) {
    if (!this.three || !this.ui) return;
    const vp = this.ui.ref.viewport;
    const w = Math.max(1, vp.clientWidth), h = Math.max(1, vp.clientHeight);
    const next = this.measureSafe(w, h);
    const prev = this.safe;
    const same = prev.w === next.w && prev.h === next.h && ['l', 'r', 't', 'b'].every((k) => Math.abs(prev.safe[k] - next.safe[k]) < 0.5);
    this.safe = next;
    const { camera } = this.three;
    const cx = (next.safe.l + w - next.safe.r) / 2, cy = (next.safe.t + h - next.safe.b) / 2;
    camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
    camera.updateProjectionMatrix();
    if (!same && refit) this.refit();
    this.dirty = true;
  }
  /** Insets (CSS px) covered by the view tools (inline-end column, or a bottom row on phones), the stage chip (top band) and, on stages with light rays, their caption (bottom band). */
  measureSafe(w, h) {
    const ref = this.ui.ref;
    const box = ref.canvasHost.getBoundingClientRect();
    const vis = (el) => { if (!el || el.hidden) return null; const r = el.getBoundingClientRect(); return r.width && r.height ? r : null; };
    const out = { l: 8, r: 8, t: 8, b: 8 };
    const tools = vis(ref.viewtools);
    if (tools) {
      if (tools.top - box.top > h / 2) out.b = Math.max(out.b, box.bottom - tools.top + 6);
      else if (tools.left - box.left > w / 2) out.r = Math.max(out.r, box.right - tools.left + 6);
      else out.l = Math.max(out.l, tools.right - box.left + 6);
    }
    const chip = vis(this.ui.root.querySelector('.csim-chip'));
    if (chip) out.t = Math.max(out.t, chip.bottom - box.top + 4);
    const note = ref.rayNote;
    if (note && RAY_STAGES[this.stageIndex] && (tools || chip)) {
      const was = note.hidden;
      note.hidden = false; // measured even before it appears, so the camera does not move when it does
      const r = note.getBoundingClientRect();
      note.hidden = was;
      if (r.height && r.top - box.top > h / 2) out.b = Math.max(out.b, box.bottom - r.top + 4);
    }
    return { w, h, safe: out };
  }

  // ---------- playback ----------
  isPlaying() { return this.state === 'playing' || (this.state === 'transitioning' && this.resume === 'playing'); }
  play() {
    if (this.destroyed || !this.ready3D) return;
    this.leaveCompare();
    const s = this.state;
    if (s === 'completed') { this.restart(); return; }
    if (s === 'transitioning') { this.resume = 'playing'; this.ui.setState(s, true); return; }
    this.ui.showStart(false);
    if (this.sm.to('playing')) this.ui.announce(this.ui.t('announcePlaying'));
  }
  pause() {
    if (this.destroyed || !this.ready3D) return;
    if (this.state !== 'playing' && this.state !== 'transitioning') return;
    if (this.state === 'transitioning') { this.resume = 'paused'; this.ui.setState('transitioning', false); return; }
    if (this.sm.to('paused')) this.ui.announce(this.ui.t('announcePaused'));
  }
  restart() {
    if (this.destroyed) return;
    if (!this.ready3D) { this.goToStage(0); return; }
    this.leaveCompare();
    this.timeline.set(0);
    this.setStageIndex(0, true);
    this.ui.showStart(false);
    this.sm.to('playing');
    this.applyTimeline(0);
  }
  replayStage() {
    if (!this.ready3D) return;
    this.leaveCompare();
    this.timeline.set(this.timeline.stageStart(this.stageIndex));
    this.goCamera(`stage:${this.stageIndex}`, STAGES[this.stageIndex].camera, 0.8);
    this.ui.showStart(false);
    this.sm.to('playing');
    this.applyTimeline(0);
  }
  goToStage(i) {
    if (this.destroyed) return;
    const idx = Math.max(0, Math.min(STAGES.length - 1, Math.round(Number(i) || 0)));
    if (!this.ready3D) {
      // fallback (or still loading): navigate the illustrated stages only
      this.stageIndex = idx;
      this.ui.setStage(idx);
      this.ui.announce(`${this.ui.stageLabel(idx)}: ${STAGES[idx].title[this.lang]}`);
      this.emit('stagechange', { index: idx, id: STAGES[idx].id });
      return;
    }
    const wasPlaying = this.isPlaying();
    this.leaveCompare();
    this.timeline.set(this.timeline.stageStart(idx));
    this.setStageIndex(idx, false);
    this.ui.showStart(false);
    this.applyTimeline(0);
    if (this.reduced) {
      this.goCamera(`stage:${idx}`, STAGES[idx].camera, 0);
      if (this.state === 'transitioning') this.sm.to(wasPlaying ? 'playing' : 'paused');
      else if (!wasPlaying) this.sm.to('paused');
      return;
    }
    this.resume = wasPlaying ? 'playing' : 'paused';
    this.goCamera(`stage:${idx}`, STAGES[idx].camera);
    this.sm.to('transitioning');
  }
  seek(t01) {
    if (this.destroyed || !this.ready3D) return;
    const t = Math.max(0, Math.min(1, Number(t01) || 0));
    this.ui.showStart(false);
    const wasCompare = !!this.compareMode;
    this.leaveCompare();
    const from = this.stageIndex;
    this.timeline.seek(t);
    if (this.state === 'transitioning') this.resume = 'paused';
    if (t >= 1) this.sm.to('completed'); else this.sm.to('paused');
    this.applyTimeline(0);
    this.dirty = true; // the paused scene changed: draw it (nothing else may be animating)
    // A seek (which always pauses) ends on the camera of the stage it lands in, whatever the view was before — a
    // turned or zoomed view, a focused structure or the Before / After view (deterministic, as in the procedure
    // simulators). Landing in another stage already took that stage's camera in applyTimeline.
    if (this.stageIndex === from && (wasCompare || this.userMoved || !this.cam || this.cam.key !== `stage:${this.stageIndex}`)) {
      if (this.focusId) { this.focusId = null; this.ui.setFocus(null); }
      this.toStageCamera();
    }
  }
  /**
   * Before / After (owner brief §13, same rule as src/surgical-sim): "before" is the end of the first stage (the clouded
   * natural lens), "after" the end of the last stage (the clear artificial lens in the capsular bag). Both are seen from
   * the first stage's camera, playback paused, so the only difference on screen is the lens (and the illustrative light
   * path through it). Play, a seek, a stage choice, Replay stage or Restart leave the comparison.
   */
  compare(which) {
    if (this.destroyed || !this.ready3D || !(which in COMPARE_STAGE)) return;
    if (this.fly) this.fly = null;
    const i = COMPARE_STAGE[which];
    this.compareMode = which;
    this.timeline.set(this.timeline.stageStart(i) + STAGES[i].duration * 0.999);
    this.ui.showStart(false);
    if (this.eye) this.eye.setUserCutaway(null);
    this.focusId = null;
    this.ui.setFocus(null);
    this.applyTimeline(0);
    if (this.state === 'transitioning') this.resume = 'paused';
    this.sm.to('paused');
    this.applySafe(false);
    this.goCamera('compare', STAGES[COMPARE_STAGE.before].camera, 0.9);
    this.ui.setCompare(which);
    this.ui.announce(this.ui.t(which === 'before' ? 'compareBefore' : 'compareAfter'));
    this.emit('comparechange', { compare: which });
    this.dirty = true;
  }
  leaveCompare() {
    if (!this.compareMode) return;
    this.compareMode = null;
    if (this.ui) this.ui.setCompare(null);
    this.emit('comparechange', { compare: null });
  }
  complete() {
    if (this.sm.to('completed')) {
      this.ui.announce(this.ui.t('announceCompleted'));
      this.emit('complete');
    }
  }

  // ---------- view toggles ----------
  setLabels(v) { this.labels = v; this.ui.setLabels(v); this.dirty = true; }
  setTouch(v) { this.touch = v; this.ui.setTouch(v); }
  toggleCutaway() {
    if (!this.eye) return;
    const cur = this.eye.userCutaway === null ? !!(this.params && this.params.cutaway) : this.eye.userCutaway;
    this.eye.setUserCutaway(!cur);
    this.applyTimeline(0);
    this.dirty = true;
  }

  // ---------- i18n / theme ----------
  setLang(lang) {
    if (this.destroyed) return;
    const l = lang === 'en' ? 'en' : 'ar';
    if (l === this.lang) return;
    this.lang = l;
    this.ui.setLang(l);
    if (this.review) this.review.refresh();
    this.dirty = true;
    this.emit('langchange', { lang: l });
  }
  setTheme(theme) {
    if (this.destroyed) return;
    this.theme = theme === 'dark' ? 'dark' : 'light';
    this.ui.setTheme(this.theme);
    if (this.three) this.three.setTheme(this.theme);
    this.dirty = true;
    this.emit('themechange', { theme: this.theme });
  }

  // ---------- keyboard ----------
  onKey(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = e.target && e.target.tagName;
    const isField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (e.key === ' ' || e.code === 'Space') {
      if (isField || tag === 'BUTTON' || tag === 'SUMMARY' || tag === 'A') return; // native activation
      e.preventDefault();
      if (this.isPlaying()) this.pause(); else this.play();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (isField) return;
      e.preventDefault();
      const forward = (e.key === 'ArrowRight') !== (this.lang === 'ar'); // mirrored in RTL
      this.goToStage(this.stageIndex + (forward ? 1 : -1));
    }
  }

  // ---------- WebGL context loss ----------
  onContextLost(e) {
    e.preventDefault();
    if (this.state === 'error' || this.state === 'fallback') return;
    this.preLoss = this.state === 'transitioning' ? this.resume : this.state;
    this.fly = null;
    this.stopLoop();
    this.sm.to('error');
    this.ui.showFallback(true);
    this.ui.showNote('restoring');
    this.emit('error', { type: 'context-lost' });
    this.lossTimer = this.timeout(() => { if (this.state === 'error') this.enterFallback('context-not-restored'); }, 10000);
  }
  onContextRestored() {
    if (this.state !== 'error' || !this.three) return;
    clearTimeout(this.lossTimer);
    this.timers.delete(this.lossTimer);
    this.three.buildEnvironment();
    this.three.scene.traverse((o) => {
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        m.needsUpdate = true;
        for (const v of Object.values(m)) if (v && v.isTexture) v.needsUpdate = true;
      }
    });
    this.ui.showFallback(false);
    this.ui.showNote(null);
    const back = ['ready', 'playing', 'paused', 'completed'].includes(this.preLoss) ? this.preLoss : 'paused';
    this.sm.to(back);
    this.resize();
    this.dirty = true;
    this.startLoop();
    this.ui.announce(this.ui.t('announceRestored'));
  }

  onState(state, prev) {
    if (!this.ui) return;
    this.ui.setState(state, this.isPlaying());
    if (state === 'playing' || state === 'transitioning') this.ui.showStart(false);
    this.emit('statechange', { state, prev });
  }

  getState() {
    const cam = this.three && this.controls ? {
      distance: this.three.camera.position.distanceTo(this.controls.target),
      azimuth: this.controls.getAzimuthalAngle(),
      polar: this.controls.getPolarAngle(),
      target: this.controls.target.toArray(),
      preset: this.cam ? this.cam.key : null,
      stagePreset: this.stageCameraKey(),
      fit: this.cam && this.cam.preset.fit ? this.cam.preset.fit.slice() : null,
      base: this.base,
      userMoved: this.userMoved,
      moving: !!this.fly,
      fov: this.three.camera.fov,
      minR: this.limits.minR, maxR: this.limits.maxR,
      safe: { ...this.safe.safe }, view: [this.safe.w, this.safe.h]
    } : null;
    return {
      state: this.state,
      playing: this.isPlaying(),
      stageIndex: this.stageIndex,
      stageId: STAGES[this.stageIndex].id,
      stageCount: STAGES.length,
      stageProgress: this.stageP,
      progress: this.timeline.progress,
      lang: this.lang,
      theme: this.theme,
      reducedMotion: this.reduced,
      webgl: !!this.three,
      fallbackReason: this.fallbackReason || null,
      labels: this.labels,
      cutaway: this.ui ? this.ui.ref.cutaway.getAttribute('aria-pressed') === 'true' : false,
      focus: this.focusId,
      dpr: this.three ? this.three.renderer.getPixelRatio() : null,
      fps: this.quality ? this.quality.fps : null,
      review: this.reviewMode,
      compare: this.compareMode,
      speed: this.speed,
      layers: this.eye ? this.eye.layers : null,
      modelVersion: MODEL_VERSION,
      camera: cam
    };
  }

  exposeDebug() {
    const self = this;
    window.__cataractSim = {
      controller: this.controller,
      counters,
      get renderer() { return self.three && self.three.renderer; },
      get camera() { return self.three && self.three.camera; },
      get controls() { return self.controls; },
      get params() { return self.params; },
      get frames() { return self.frames || 0; },
      setFocus: (id) => self.focusStructure(id),
      setLayer: (id, on) => self.setLayer(id, on),
      screenshot: () => self.screenshot(),
      step: (n) => self.stepFrames(n),
      get review() { return self.review ? self.review.data : null; },
      transition: (to) => self.sm.to(to),
      // Render now and summarise the frame buffer (proves the canvas is not blank).
      sample() {
        if (!self.three) return null;
        const { renderer, scene, camera } = self.three;
        renderer.render(scene, camera);
        const gl = renderer.getContext();
        const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
        const px = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
        const bg = [px[0], px[1], px[2]];
        const colors = new Set();
        let differ = 0, n = 0;
        for (let i = 0; i < px.length; i += 4 * 37) {
          n++;
          colors.add(((px[i] >> 3) << 10) | ((px[i + 1] >> 3) << 5) | (px[i + 2] >> 3));
          if (Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 24) differ++;
        }
        return { width: w, height: h, uniqueColors: colors.size, nonBackground: differ / n, corner: bg };
      },
      gpu() {
        if (!self.three) return null;
        const gl = self.three.renderer.getContext();
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        return {
          vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
          renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
          webgl2: typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
        };
      },
      info() { return self.three ? { calls: self.three.renderer.info.render.calls, triangles: self.three.renderer.info.render.triangles, geometries: self.three.renderer.info.memory.geometries, textures: self.three.renderer.info.memory.textures } : null; }
    };
  }
}
