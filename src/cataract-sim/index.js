// Cataract surgery 3D explainer — public entry point (lazy-loaded chunk).
// API: mount(host, options) -> controller. See docs/implementation/master-redesign-phase-2-3/PHASE_2_ENGINEERING.md
import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createScene, hasWebGL, maxDpr } from './scene.js';
import { createMaterials } from './materials.js';
import { buildEye } from './eye-model.js';
import { STAGES, STRUCTURES, paramsAt } from './stages.js';
import { createTimeline } from './timeline.js';
import { createStateMachine } from './state.js';
import { createUI } from './ui.js';
import { createAdaptiveQuality, observeVisibility } from './perf.js';
import { createReviewPanel, LAYERS } from './review.js';
import { MODEL_VERSION } from './anatomy.js';

export { STAGES, STRUCTURES } from './stages.js';
export { MODEL_VERSION } from './anatomy.js';

// Global debug counters (exposed on window only in debug mode) used by tests to prove clean teardown.
export const counters = { mounts: 0, destroys: 0, live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0 };
const instances = new WeakMap();

const tick = () => new Promise((r) => setTimeout(r, 0));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ORBIT = { minDistance: 11, maxDistance: 80, minPolar: 0.4, maxPolar: Math.PI - 0.4, minAz: -1.5, maxAz: 1.5 };
const TARGET_MIN = new THREE.Vector3(-6, -6, -10), TARGET_MAX = new THREE.Vector3(6, 6, 5);

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
      this.jumpCamera(STAGES[0].camera);
      const { renderer, scene, camera } = this.three;
      if (renderer.compileAsync) await renderer.compileAsync(scene, camera); else renderer.compile(scene, camera);
      if (this.destroyed) return;
      ui.setLoadingProgress(100);
      renderer.render(scene, camera);
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
      const ro = new ResizeObserver(() => this.resize());
      ro.observe(ui.ref.viewport);
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
  }
  cameraPreset(name) {
    if (!this.ready3D) return;
    const sph = (target, az, polar, dist) => ({ target, position: [target[0] + dist * Math.sin(polar) * Math.sin(az), target[1] + dist * Math.cos(polar), target[2] + dist * Math.sin(polar) * Math.cos(az)] });
    const P = { surgeon: sph([0, 0, 0], 0, Math.PI / 2, 30), side: sph([0, 0, -1.5], 1.45, Math.PI / 2, 34) }[name];
    this.flyTo(P || STAGES[this.stageIndex].camera, 0.6);
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
      screenSpacePanning: true, minDistance: ORBIT.minDistance, maxDistance: ORBIT.maxDistance,
      minPolarAngle: ORBIT.minPolar, maxPolarAngle: ORBIT.maxPolar, minAzimuthAngle: ORBIT.minAz, maxAzimuthAngle: ORBIT.maxAz
    });
    // Touch policy: one-finger page scroll keeps working; touch only drives the 3D view in "Explore 3D" mode.
    canvas.style.removeProperty('touch-action');
    this.listen(canvas, 'pointerdown', (e) => { if (e.pointerType === 'touch' && !this.touch) e.stopImmediatePropagation(); }, { capture: true });
    this.listen(c, 'start', () => {
      if (this.fly) { this.fly = null; if (this.state === 'transitioning') this.sm.to(this.resume); }
    });
    this.listen(c, 'change', () => { this.dirty = true; });
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
      this.ui.announce(`${this.ui.stageLabel(i)}: ${STAGES[i].title[this.lang]}`);
      this.emit('stagechange', { index: i, id: STAGES[i].id });
      if (this.review) this.review.refresh();
    }
    if (fly && this.three) this.flyTo(STAGES[i].camera);
    this.dirty = true;
  }

  // ---------- camera ----------
  jumpCamera(preset) {
    const { camera } = this.three;
    camera.position.set(...preset.position);
    this.controls.target.set(...preset.target);
    this.controls.update();
    this.fly = null;
    this.dirty = true;
  }
  flyTo(preset, duration = 1.1) {
    if (!this.three) return;
    if (this.reduced || duration <= 0) { this.jumpCamera(preset); return; }
    const { camera } = this.three;
    const t0 = this.controls.target.clone();
    const s0 = new THREE.Spherical().setFromVector3(camera.position.clone().sub(t0));
    const t1 = new THREE.Vector3(...preset.target);
    const s1 = new THREE.Spherical().setFromVector3(new THREE.Vector3(...preset.position).sub(t1));
    let dTheta = s1.theta - s0.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
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
      if (this.state === 'transitioning') this.sm.to(this.resume);
    }
  }
  zoom(dir) {
    if (!this.ready3D) return;
    const { camera } = this.three;
    const target = this.controls.target;
    const off = camera.position.clone().sub(target);
    // consecutive clicks accumulate from the pending zoom target rather than the mid-flight distance
    const base = this.fly && this.fly.zoom ? this.fly.s1.radius : off.length();
    const d = THREE.MathUtils.clamp(base * (dir > 0 ? 0.8 : 1.25), ORBIT.minDistance, ORBIT.maxDistance);
    off.setLength(d);
    this.flyTo({ target: target.toArray(), position: target.clone().add(off).toArray() }, 0.35);
    if (this.fly) this.fly.zoom = true;
  }
  resetView() {
    if (!this.ready3D) return;
    this.focusId = null;
    this.ui.setFocus(null);
    this.flyTo(STAGES[this.stageIndex].camera, 0.9);
  }
  focusStructure(id) {
    const s = STRUCTURES.find((x) => x.id === id);
    if (!s) return;
    this.focusId = id;
    this.ui.setFocus(id);
    if (this.ready3D) this.flyTo(s.camera, 0.9);
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
    // keep the horizontal field of view on narrow (portrait) screens so the eye is never cropped
    const baseHalf = Math.tan(THREE.MathUtils.degToRad(16));
    camera.fov = camera.aspect >= 1.15 ? 32 : THREE.MathUtils.radToDeg(2 * Math.atan((baseHalf * 1.15) / camera.aspect));
    camera.updateProjectionMatrix();
    this.dirty = true;
    if (this.raf === null && this.state !== 'error' && this.state !== 'fallback' && this.state !== 'loading') {
      try { renderer.render(this.three.scene, camera); } catch { /* ignore */ }
    }
  }

  // ---------- playback ----------
  isPlaying() { return this.state === 'playing' || (this.state === 'transitioning' && this.resume === 'playing'); }
  play() {
    if (this.destroyed || !this.ready3D) return;
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
    this.timeline.set(0);
    this.setStageIndex(0, true);
    this.ui.showStart(false);
    this.sm.to('playing');
    this.applyTimeline(0);
  }
  replayStage() {
    if (!this.ready3D) return;
    this.timeline.set(this.timeline.stageStart(this.stageIndex));
    this.flyTo(STAGES[this.stageIndex].camera, 0.8);
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
    this.timeline.set(this.timeline.stageStart(idx));
    this.setStageIndex(idx, false);
    this.ui.showStart(false);
    this.applyTimeline(0);
    if (this.reduced) {
      this.jumpCamera(STAGES[idx].camera);
      if (this.state === 'transitioning') this.sm.to(wasPlaying ? 'playing' : 'paused');
      else if (!wasPlaying) this.sm.to('paused');
      return;
    }
    this.resume = wasPlaying ? 'playing' : 'paused';
    this.flyTo(STAGES[idx].camera);
    this.sm.to('transitioning');
  }
  seek(t01) {
    if (this.destroyed || !this.ready3D) return;
    const t = Math.max(0, Math.min(1, Number(t01) || 0));
    this.ui.showStart(false);
    this.timeline.seek(t);
    if (this.state === 'transitioning') this.resume = 'paused';
    if (t >= 1) this.sm.to('completed'); else this.sm.to('paused');
    this.applyTimeline(0);
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
      target: this.controls.target.toArray()
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
