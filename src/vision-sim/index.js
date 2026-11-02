// Vision simulator — public entry point (lazy-loaded chunk).
// API: mount(host, { lang, theme, reducedMotion, debug }) → controller
//   { destroy, setLang, setTheme, getState, setLens, setDistance, setLighting, setCompare, setRefraction, setSplit, on }
// Educational illustration — not a prediction of anyone's vision. See
// docs/implementation/clinical-visual-reconstruction/VISION_SIMULATOR_REBUILD.md
import './styles.css';
import { computeView, clamp, normalizeRefraction } from './optics/model.js';
import { DISTANCES, LENS_IDS, LIGHTING_IDS } from './optics/params.js';
import { createUI } from './ui.js';
import { STRINGS, formatDistance } from './i18n.js';

export * as optics from './optics/index.js';

// Global debug counters (exposed on window only in debug mode) used by tests to prove clean teardown.
export const counters = { mounts: 0, destroys: 0, live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0, renderTargets: 0 };
const instances = new WeakMap();
const QUALITY = [{ scale: 1, taps: 12 }, { scale: 0.75, taps: 10 }, { scale: 0.55, taps: 8 }];

export async function mount(host, options = {}) {
  if (!host || host.nodeType !== 1) throw new TypeError('vision-sim mount(host): host must be an element');
  const prev = instances.get(host);
  if (prev) prev.destroy();
  const sim = new VisionSimulator(host, options);
  instances.set(host, sim.controller);
  await sim.init();
  return sim.controller;
}

class VisionSimulator {
  constructor(host, o) {
    this.host = host;
    this.lang = o.lang === 'en' ? 'en' : 'ar';
    this.theme = o.theme === 'dark' ? 'dark' : 'light';
    this.debug = !!o.debug;
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    this.reduced = typeof o.reducedMotion === 'boolean' ? o.reducedMotion : !!(mq && mq.matches);
    this.state = {
      lens: LENS_IDS.includes(o.lens) ? o.lens : 'monofocal',
      lensB: LENS_IDS.includes(o.lensB) ? o.lensB : 'trifocal',
      compare: !!o.compare,
      distanceM: clamp(o.distanceM, DISTANCES.sliderMin, DISTANCES.sliderMax, DISTANCES.distance),
      lighting: LIGHTING_IDS.includes(o.lighting) ? o.lighting : 'day',
      refraction: normalizeRefraction(o.refraction),
      split: 0.5,
    };
    this.status = 'idle';
    this.disposers = [];
    this.events = new Map();
    this.timers = new Set();
    this.destroyed = false;
    this.raf = null;
    this.visible = true;
    this.dirty = true;
    this.frames = 0;
    this.reblurs = 0;
    this.sourceVersion = 0;
    this.quality = 0;
    this.perf = { last: 0, samples: [] };
    counters.mounts++; counters.live++;
    this.frame = this.frame.bind(this);
    const self = this;
    this.controller = {
      destroy: () => self.destroy(),
      setLang: (l) => self.setLang(l),
      setTheme: (t) => self.setTheme(t),
      getState: () => self.getState(),
      setLens: (id, slot) => self.setLens(id, slot),
      setDistance: (m) => self.setDistance(m),
      setLighting: (l) => self.setLighting(l),
      setCompare: (on, lensB) => self.setCompare(on, lensB),
      setRefraction: (r) => self.setRefraction(r),
      setSplit: (x) => self.setSplit(x),
      on: (ev, cb) => self.on(ev, cb),
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
  clearTimer(id) { if (id != null) { clearTimeout(id); this.timers.delete(id); } }
  on(ev, cb) {
    if (!this.events.has(ev)) this.events.set(ev, new Set());
    this.events.get(ev).add(cb);
    return () => this.events.get(ev)?.delete(cb);
  }
  emit(ev, payload) {
    const set = this.events.get(ev);
    if (!set) return;
    for (const cb of [...set]) { try { cb(payload); } catch (err) { console.warn('[vision-sim] listener error', err); } }
  }

  views() {
    const s = this.state;
    const base = { distanceM: s.distanceM, lighting: s.lighting, refraction: s.refraction };
    return { A: computeView({ ...base, lens: s.lens }), B: s.compare ? computeView({ ...base, lens: s.lensB }) : null };
  }

  // ---------- lifecycle ----------
  async init() {
    this.ui = createUI(this.host, {
      lang: this.lang, theme: this.theme,
      listen: (t, e, f, o) => this.listen(t, e, f, o),
      handlers: {
        lens: (id) => this.setLens(id, 'A', true),
        lensB: (id) => this.setLens(id, 'B', true),
        compare: (on) => this.setCompare(on, undefined, true),
        distance: (m, src) => this.setDistance(m, src),
        lighting: (l) => this.setLighting(l, true),
        refraction: (r) => this.setRefraction(r, true),
        split: (x) => this.setSplit(x),
      },
    });
    this.ui.build(this.state);
    this.ui.root.dataset.reducedMotion = this.reduced ? 'true' : 'false';
    this.refreshUI();
    if (this.debug) window.__visionSimCounters = counters;
    this.status = 'loading';
    let pipelineMod, scenesMod;
    try {
      [pipelineMod, scenesMod] = await Promise.all([import('./pipeline.js'), import('./scenes.js')]);
    } catch (err) {
      if (this.destroyed) return;
      console.warn('[vision-sim] could not load the 3D modules', err);
      this.enterFallback('load-error');
      return;
    }
    if (this.destroyed) return;
    this.scenesMod = scenesMod;
    if (!pipelineMod.hasWebGL2()) { this.enterFallback('no-webgl'); return; }
    try {
      const canvas = document.createElement('canvas');
      canvas.className = 'vsim-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      this.ui.attachCanvas(canvas);
      this.pipe = pipelineMod.createPipeline({ canvas, debug: this.debug });
      counters.renderers++;
      const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
      this.quality = coarse || this.ui.ref.viewport.clientWidth < 520 ? 1 : 0;
      this.resize(true);
      this.renderNow();
    } catch (err) {
      if (this.destroyed) return;
      console.warn('[vision-sim] 3D initialisation failed, using the static comparison', err);
      this.enterFallback('init-error');
      return;
    }
    const canvas = this.pipe.renderer.domElement;
    this.listen(canvas, 'webglcontextlost', (e) => this.onContextLost(e));
    this.listen(canvas, 'webglcontextrestored', () => this.onContextRestored());
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => { this.dirty = true; this.resizePending = true; if (this.raf === null) this.resize(); });
      ro.observe(this.ui.ref.viewport);
      counters.observers++;
      this.disposers.push(() => { ro.disconnect(); counters.observers--; });
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) this.inView = e.isIntersecting;
        this.updateVisibility();
      }, { threshold: 0 });
      io.observe(this.ui.ref.viewport);
      counters.observers++;
      this.disposers.push(() => { io.disconnect(); counters.observers--; });
    }
    this.inView = true;
    this.listen(document, 'visibilitychange', () => this.updateVisibility());
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!this.destroyed && this.pipe) { this.rebuildScenes(); this.dirty = true; } });
    }
    this.status = 'ready';
    this.startLoop();
    if (this.debug) this.exposeDebug();
    this.emit('ready', this.getState());
  }

  updateVisibility() {
    this.visible = this.inView !== false && document.visibilityState !== 'hidden';
    if (this.visible) this.startLoop(); else this.stopLoop();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stopLoop();
    for (const id of this.timers) clearTimeout(id);
    this.timers.clear();
    for (const off of this.disposers.splice(0).reverse()) { try { off(); } catch { /* ignore */ } }
    if (this.scenes) { this.scenes.dispose(); this.scenes = null; }
    if (this.pipe) {
      counters.renderTargets -= this.lastRT || 0; this.lastRT = 0;
      const r = this.pipe.renderer;
      this.pipe.dispose();
      try { r.forceContextLoss(); } catch { /* ignore */ }
      this.pipe = null;
      counters.renderers--;
    }
    if (this.ui) { this.ui.detachCanvas(); this.ui.destroy(); this.ui = null; }
    this.events.clear();
    if (instances.get(this.host) === this.controller) instances.delete(this.host);
    if (this.debug && window.__visionSim && window.__visionSim.controller === this.controller) delete window.__visionSim;
    counters.live--; counters.destroys++;
  }

  enterFallback(reason) {
    this.fallbackReason = reason;
    this.stopLoop();
    if (this.scenes) { this.scenes.dispose(); this.scenes = null; }
    if (this.pipe) {
      counters.renderTargets -= this.lastRT || 0; this.lastRT = 0;
      try { this.pipe.dispose(); } catch { /* ignore */ }
      this.pipe = null; counters.renderers--;
      this.ui.detachCanvas();
    }
    this.status = 'fallback';
    this.ui.showNote(null);
    this.ui.showFallback(true);
    this.emit('error', { type: 'fallback', reason });
    if (this.debug) this.exposeDebug();
  }

  // ---------- rendering ----------
  startLoop() {
    if (this.raf !== null || this.destroyed || !this.pipe || !this.visible || this.status !== 'ready') return;
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
    if (this.resizePending) this.resize();
    if (!this.dirty) { this.perf.last = 0; return; }
    const reblurred = this.renderNow();
    // adaptive quality: sustained slow re-blur frames lower the internal resolution / tap count
    if (reblurred && this.perf.last) {
      const s = this.perf.samples;
      s.push(now - this.perf.last);
      if (s.length > 12) s.shift();
      if (s.length >= 8 && s.reduce((a, b) => a + b, 0) / s.length > 34 && this.quality < QUALITY.length - 1) {
        this.quality++; s.length = 0; this.resize(true);
      }
    }
    this.perf.last = reblurred ? now : 0;
  }
  renderNow() {
    if (!this.pipe || !this.scenes || this.status === 'error') return false;
    this.dirty = false;
    const v = this.views();
    const stats = this.pipe.render({ views: v, scenes: this.scenes, camera: this.camera, split: this.state.split, taps: QUALITY[this.quality].taps, sourceVersion: this.sourceVersion });
    counters.renderTargets += this.pipe.renderTargets - (this.lastRT || 0);
    this.lastRT = this.pipe.renderTargets;
    this.frames++;
    if (stats.reblurred) this.reblurs += stats.reblurred;
    return stats.reblurred > 0;
  }
  resize(force = false) {
    this.resizePending = false;
    if (!this.pipe || !this.ui) return;
    const vp = this.ui.ref.viewport;
    const w = Math.max(1, vp.clientWidth), h = Math.max(1, vp.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const q = QUALITY[this.quality];
    const changed = this.pipe.setSize(w, h, dpr, q.scale);
    const aspect = w / h;
    if (!this.camera) this.camera = this.scenesMod.createCamera(aspect);
    if (Math.abs(this.camera.aspect - aspect) > 1e-3) { this.camera.aspect = aspect; this.camera.updateProjectionMatrix(); }
    const k = Math.min(1, aspect / 1.6);
    if (!this.scenes || Math.abs((this.sceneK ?? -1) - k) > 0.02) this.rebuildScenes();
    else if (changed || force) this.sourceVersion++;
    this.dirty = true;
  }
  rebuildScenes() {
    if (!this.scenesMod || !this.pipe) return;
    const vp = this.ui.ref.viewport;
    const aspect = Math.max(1, vp.clientWidth) / Math.max(1, vp.clientHeight);
    if (this.scenes) this.scenes.dispose();
    this.scenes = this.scenesMod.buildScenes({ lighting: this.state.lighting, lang: this.lang, aspect });
    this.sceneK = Math.min(1, aspect / 1.6);
    if (!this.camera) this.camera = this.scenesMod.createCamera(aspect);
    this.sourceVersion++;
    this.dirty = true;
  }

  // ---------- state changes ----------
  refreshUI() {
    if (!this.ui) return;
    const v = this.views();
    this.ui.update(this.state, v.A, v.B);
    this.lastView = v;
  }
  changed(what, announce) {
    this.refreshUI();
    this.dirty = true;
    this.emit('change', { what, state: this.getState() });
    if (announce) this.announce(announce === 'debounce');
  }
  announce(debounce) {
    this.clearTimer(this.announceTimer);
    const go = () => {
      if (!this.ui) return;
      const s = STRINGS[this.lang], st = this.state, v = this.lastView.A;
      const band = `${s.presets[v.subject]} · ${s.objects[v.subject]}`;
      this.ui.announce(s.announce(s.lenses[st.lens].name, formatDistance(this.lang, st.distanceM), band, s.lights[st.lighting], st.compare ? s.lenses[st.lensB].name : null));
    };
    if (debounce) this.announceTimer = this.timeout(go, 450); else go();
  }
  setLens(id, slot = 'A', fromUI = false) {
    if (this.destroyed || !LENS_IDS.includes(id)) return;
    const key = slot === 'B' ? 'lensB' : 'lens';
    if (this.state[key] === id && !fromUI) return;
    this.state[key] = id;
    this.changed(key, true);
  }
  setCompare(on, lensB, fromUI = false) {
    if (this.destroyed) return;
    this.state.compare = !!on;
    if (LENS_IDS.includes(lensB)) this.state.lensB = lensB;
    this.changed('compare', fromUI || true);
  }
  setDistance(m, src) {
    if (this.destroyed) return;
    const d = clamp(Number(m), DISTANCES.sliderMin, DISTANCES.sliderMax, this.state.distanceM);
    if (Math.abs(d - this.state.distanceM) < 1e-9 && src !== 'preset') return;
    this.state.distanceM = d;
    this.changed('distance', src === 'slider' ? 'debounce' : true);
  }
  setLighting(l, fromUI = false) {
    if (this.destroyed || !LIGHTING_IDS.includes(l)) return;
    if (l === this.state.lighting && !fromUI) return;
    const rebuild = l !== this.state.lighting;
    this.state.lighting = l;
    if (rebuild) this.rebuildScenes();
    this.changed('lighting', true);
  }
  setRefraction(r = {}, fromUI = false) {
    if (this.destroyed) return;
    this.state.refraction = normalizeRefraction({ ...this.state.refraction, ...r });
    this.changed('refraction', fromUI);
  }
  setSplit(x) {
    if (this.destroyed) return;
    this.state.split = clamp(Number(x), 0, 1, 0.5);
    this.ui.update(this.state, this.lastView.A, this.lastView.B);
    this.dirty = true;
  }

  // ---------- i18n / theme ----------
  setLang(lang) {
    if (this.destroyed) return;
    const l = lang === 'en' ? 'en' : 'ar';
    if (l === this.lang) return;
    this.lang = l;
    this.ui.setLang(l, this.state);
    this.ui.root.dataset.reducedMotion = this.reduced ? 'true' : 'false';
    if (this.status === 'fallback') this.ui.showFallback(true);
    this.refreshUI();
    this.rebuildScenes(); // canvas text (road sign, screens) is localised
    this.emit('langchange', { lang: l });
  }
  setTheme(theme) {
    if (this.destroyed) return;
    this.theme = theme === 'dark' ? 'dark' : 'light';
    this.ui.setTheme(this.theme);
    this.emit('themechange', { theme: this.theme });
  }

  // ---------- WebGL context loss ----------
  onContextLost(e) {
    e.preventDefault();
    if (this.status !== 'ready') return;
    this.stopLoop();
    this.status = 'error';
    this.ui.showNote('restoring');
    this.emit('error', { type: 'context-lost' });
    this.lossTimer = this.timeout(() => { if (this.status === 'error') this.enterFallback('context-not-restored'); }, 10000);
  }
  onContextRestored() {
    if (this.status !== 'error' || !this.pipe) return;
    this.clearTimer(this.lossTimer);
    // three.js re-creates its GL state lazily; re-upload our textures and re-render every layer
    for (const sc of Object.values(this.scenes ? this.scenes.scenes : {})) {
      sc.traverse((o) => { const m = o.material; if (m) { m.needsUpdate = true; if (m.map) m.map.needsUpdate = true; } });
    }
    this.pipe.invalidateSources();
    this.sourceVersion++;
    this.status = 'ready';
    this.ui.showNote(null);
    this.ui.announce(STRINGS[this.lang].restored);
    this.dirty = true;
    this.resize(true);
    this.startLoop();
    this.emit('restored');
  }

  getState() {
    const v = this.lastView || this.views();
    const sum = (view) => view && {
      lens: view.lens,
      subject: view.subject,
      pupilMm: view.pupilMm,
      haloIndex: view.halo.haloIndex,
      contrastIndex: view.contrast.contrastIndex,
      layers: Object.fromEntries(Object.entries(view.layers).map(([k, l]) => [k, { distanceM: l.distanceM, defocusD: l.defocusD, blurArcmin: l.blurArcmin, sharpness: l.sharpness }])),
    };
    return {
      state: this.status,
      lens: this.state.lens,
      lensB: this.state.lensB,
      compare: this.state.compare,
      split: this.state.split,
      distanceM: this.state.distanceM,
      subject: v.A.subject,
      lighting: this.state.lighting,
      pupilMm: v.A.pupilMm,
      refraction: { ...this.state.refraction },
      lang: this.lang,
      theme: this.theme,
      reducedMotion: this.reduced,
      webgl: !!this.pipe,
      fallbackReason: this.fallbackReason || null,
      quality: this.pipe ? { level: this.quality, ...QUALITY[this.quality], internal: this.pipe.size, halfFloat: this.pipe.halfFloat } : null,
      frames: this.frames,
      reblurs: this.reblurs,
      optics: { A: sum(v.A), B: sum(v.B) },
    };
  }

  exposeDebug() {
    const self = this;
    window.__visionSim = {
      controller: this.controller,
      counters,
      get renderer() { return self.pipe && self.pipe.renderer; },
      get frames() { return self.frames; },
      renderNow() { self.dirty = true; return self.renderNow(); },
      // Render now and summarise the frame buffer (proves the canvas is not blank).
      sample(region) {
        if (!self.pipe) return null;
        self.dirty = true; self.renderNow();
        const gl = self.pipe.renderer.getContext();
        const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
        const r = region || { x: 0, y: 0, w: 1, h: 1 };
        const x0 = Math.floor(r.x * w), y0 = Math.floor(r.y * h), ww = Math.max(1, Math.floor(r.w * w)), hh = Math.max(1, Math.floor(r.h * h));
        const px = new Uint8Array(ww * hh * 4);
        gl.readPixels(x0, y0, ww, hh, gl.RGBA, gl.UNSIGNED_BYTE, px);
        const colors = new Set();
        let sum = 0, sum2 = 0, n = 0, edge = 0;
        for (let i = 0; i < px.length; i += 4) {
          const l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
          sum += l; sum2 += l * l; n++;
          colors.add(((px[i] >> 3) << 10) | ((px[i + 1] >> 3) << 5) | (px[i + 2] >> 3));
          if (i >= 4 && (i / 4) % ww !== 0) edge += Math.abs(l - (0.2126 * px[i - 4] + 0.7152 * px[i - 3] + 0.0722 * px[i - 2]));
        }
        const mean = sum / n;
        return { width: w, height: h, uniqueColors: colors.size, mean, std: Math.sqrt(Math.max(0, sum2 / n - mean * mean)), edgeEnergy: edge / n };
      },
      info() { return self.pipe ? { calls: self.pipe.renderer.info.render.calls, geometries: self.pipe.renderer.info.memory.geometries, textures: self.pipe.renderer.info.memory.textures, renderTargets: self.pipe.renderTargets } : null; },
    };
  }
}
