// How Vision Works: Interactive Light Journey (lightweight SVG module, no dependencies).
//
// API: mount(host, { lang: 'ar' | 'en', theme: 'light' | 'dark', reducedMotion?, step?, light?, focus?,
//                    linkFor?(slug) => href, basePath? })
//   → { destroy, setLang, setTheme, getState, on, goTo, next, prev, setLight, setFocus }
// Events (on(name, fn) returns an unsubscribe function): 'step', 'change', 'langchange', 'themechange', 'destroy'.
//
// Playback (2026-11-23): the journey plays by itself once it is on screen — each step holds for STEP_MS (÷ speed),
// with a progress bar that can be scrubbed, Play / Pause / Replay and a speed choice. It pauses while the page is
// hidden or the module is off screen, and never starts by itself under reduced motion (manual steps only).
// Extra API: play(), pause(), replay(), seek(0..1), setSpeed(1 | 1.5 | 0.75). getState() adds playing, progress, speed.
//
// Continuous motion (2026-11-24): while the journey plays, the same requestAnimationFrame loop that drives the
// timeline also advances the photon pulses along the rays (.lj-flow stroke-dashoffset), the signal pulses along the
// optic nerve and the focus glow. Paused, hidden, off screen or under reduced motion, the drawing holds still.
// While playing, each step also moves a gentle camera (.lj-cam, CSS transition); paused, under reduced motion
// and in small containers the whole plate holds still, so nothing moves under the pointer.
//
// Educational illustration: the rays are illustrative, not an optical simulation. Medical review: pending.
import './styles.css';
import { STEPS, UI, describe } from './content.js';
import { svgMarkup, cameraTransform, FLOW } from './diagram.js';

export { STEPS, UI };

// Debug counters used by the tests to prove clean teardown.
export const counters = { mounts: 0, destroys: 0, live: 0, listeners: 0 };
const instances = new WeakMap();
let uid = 0;
/** How long one step is shown during playback at speed 1 (ms): long enough to read the caption. */
export const STEP_MS = 7000;
const SPEEDS = [0.75, 1, 1.5];

export function mount(host, options = {}) {
  if (!host || host.nodeType !== 1) throw new TypeError('light-journey mount(host): host must be an element');
  instances.get(host)?.destroy();
  const j = new LightJourney(host, options);
  instances.set(host, j.controller);
  return j.controller;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

class LightJourney {
  constructor(host, o) {
    this.host = host;
    this.id = `lj${++uid}`;
    this.lang = o.lang === 'en' ? 'en' : 'ar';
    this.theme = o.theme === 'dark' ? 'dark' : 'light';
    this.mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    this.reducedOpt = typeof o.reducedMotion === 'boolean' ? o.reducedMotion : null;
    this.basePath = typeof o.basePath === 'string' ? o.basePath : '/';
    this.linkFor = typeof o.linkFor === 'function' ? o.linkFor : null;
    this.state = {
      step: Number.isInteger(o.step) ? Math.max(0, Math.min(STEPS.length - 1, o.step)) : 0,
      light: o.light === 'dim' ? 'dim' : 'bright',
      focus: o.focus === 'near' ? 'near' : 'far'
    };
    this.play_ = { playing: false, elapsed: 0, speed: 1, raf: 0, last: 0, onScreen: false, userPaused: false, done: false, io: null };
    this.events = new Map();
    this.disposers = []; // DOM-bound listeners (rebuilt with the DOM)
    this.persistent = []; // listeners that live as long as the instance
    this.destroyed = false;
    counters.mounts++; counters.live++;
    this.controller = {
      destroy: () => this.destroy(),
      setLang: (l) => this.setLang(l),
      setTheme: (t) => this.setTheme(t),
      getState: () => this.getState(),
      on: (ev, fn) => this.on(ev, fn),
      goTo: (i) => { this.pause(true); return this.goTo(i); },
      next: () => { this.pause(true); return this.goTo(this.state.step + 1); },
      prev: () => { this.pause(true); return this.goTo(this.state.step - 1); },
      setLight: (v) => this.set({ light: v === 'dim' ? 'dim' : 'bright' }),
      setFocus: (v) => this.set({ focus: v === 'near' ? 'near' : 'far' }),
      play: () => this.play(), pause: () => this.pause(true), replay: () => this.replay(),
      seek: (x) => this.seek(x), setSpeed: (v) => this.setSpeed(v)
    };
    this.build();
    if (this.mq && this.reducedOpt === null) this.listen(this.mq, 'change', () => this.applyMotion(), true);
    // autoplay when on screen; pause when off screen or when the tab is hidden
    if (typeof IntersectionObserver === 'function') {
      this.play_.io = new IntersectionObserver(([e]) => {
        this.play_.onScreen = e.isIntersecting && e.intersectionRatio >= 0.35;
        if (this.play_.onScreen && !this.play_.userPaused && !this.play_.done && !this.reduced) this.play(false);
        else if (!this.play_.onScreen) this.halt();
      }, { threshold: [0, 0.35, 0.6] });
      this.play_.io.observe(host);
    }
    this.listen(document, 'visibilitychange', () => { if (document.hidden) this.halt(); else if (this.play_.onScreen && !this.play_.userPaused && !this.play_.done && !this.reduced && this.play_.wasPlaying) this.play(false); }, true);
  }

  get reduced() { return this.reducedOpt !== null ? this.reducedOpt : !!(this.mq && this.mq.matches); }

  listen(target, type, fn, persistent = false) {
    target.addEventListener(type, fn);
    counters.listeners++;
    (persistent ? this.persistent : this.disposers).push(() => { target.removeEventListener(type, fn); counters.listeners--; });
  }

  on(ev, fn) {
    if (!this.events.has(ev)) this.events.set(ev, new Set());
    this.events.get(ev).add(fn);
    return () => this.events.get(ev)?.delete(fn);
  }
  emit(ev, payload) { for (const fn of this.events.get(ev) || []) { try { fn(payload); } catch (e) { console.error(e); } } }

  getState() {
    const s = STEPS[this.state.step];
    return { step: this.state.step, stepId: s.id, total: STEPS.length, light: this.state.light, focus: this.state.focus, lang: this.lang, theme: this.theme, reducedMotion: this.reduced,
      playing: this.play_.playing, progress: this.progress(), speed: this.play_.speed, done: this.play_.done };
  }

  // ---------- playback ----------
  progress() { return Math.min(1, (this.state.step + Math.min(1, this.play_.elapsed / STEP_MS)) / STEPS.length); }
  play(user = true) {
    const P = this.play_;
    if (this.destroyed || P.playing) return;
    if (user) P.userPaused = false;
    if (P.done || (this.state.step === STEPS.length - 1 && P.elapsed >= STEP_MS)) { P.done = false; P.elapsed = 0; this.goTo(0, { keepTime: true }); }
    P.playing = true; P.wasPlaying = true; P.last = performance.now();
    this.syncCamera();
    const tick = (now) => {
      if (!P.playing) return;
      const dt = Math.min(250, now - P.last) * P.speed;
      P.elapsed += dt; P.last = now;
      this.motionFrame(dt);
      if (P.elapsed >= STEP_MS) {
        if (this.state.step >= STEPS.length - 1) { P.elapsed = STEP_MS; P.playing = false; P.done = true; this.syncPlayback(); this.emit('change', this.getState()); return; }
        P.elapsed = 0; this.goTo(this.state.step + 1, { keepTime: true });
      }
      this.syncProgress();
      P.raf = requestAnimationFrame(tick);
    };
    P.raf = requestAnimationFrame(tick);
    this.syncPlayback(); this.emit('change', this.getState());
  }
  /** Pause. `user` = the visitor pressed Pause (autoplay then waits for Play). */
  pause(user = true) {
    const P = this.play_;
    if (user) { P.userPaused = true; P.wasPlaying = false; }
    if (!P.playing) { this.syncPlayback(); return; }
    P.playing = false; cancelAnimationFrame(P.raf); P.raf = 0;
    this.syncCamera();
    this.syncPlayback(); this.emit('change', this.getState());
  }
  /** Camera: eases between steps while playing; paused, it holds exactly where it is (no drift, no transition). */
  syncCamera() {
    const cam = this.root && this.$('.lj-cam');
    if (!cam) return;
    if (this.play_.playing) {
      cam.style.removeProperty('transition');
      cam.style.setProperty('--lj-cam', cameraTransform(this.state.step, this.lang));
    } else {
      const now = getComputedStyle(cam).transform;
      cam.style.transition = 'none';
      cam.style.setProperty('--lj-cam', now && now !== 'none' ? now : 'none');
    }
  }
  /** Stop for a reason that is not the visitor's (off screen, hidden tab); resumes when it is back. */
  halt() { const was = this.play_.playing; this.pause(false); this.play_.wasPlaying = was || this.play_.wasPlaying; }
  replay() { this.play_.done = false; this.play_.elapsed = 0; this.goTo(0, { keepTime: true }); this.play(true); }
  seek(x) {
    const v = Math.max(0, Math.min(1, Number(x) || 0)) * STEPS.length;
    const step = Math.min(STEPS.length - 1, Math.floor(v));
    this.play_.elapsed = Math.min(STEP_MS, (v - step) * STEP_MS);
    this.play_.done = false;
    this.goTo(step, { keepTime: true });
    this.syncProgress(); this.syncPlayback();
  }
  /** Advance the continuous motion by dt ms of journey time (only while playing, never under reduced motion). */
  motionFrame(dt) {
    if (this.reduced || !this.motion) return;
    const M = this.motion;
    M.t += dt / 1000;
    const period = FLOW.dash + FLOW.gap;
    const shift = (M.t * 110) % period; // photons: 110 drawing units per second
    // only the elements shown on the current step are written (refreshMotion keeps the lists current)
    for (const x of M.flowsOn) x.el.setAttribute('stroke-dashoffset', (x.base - shift).toFixed(1));
    const sp = (M.t * 0.45) % 1; // nerve signal: one pattern length per ~2 s
    for (const x of M.pulsesOn) x.el.setAttribute('stroke-dashoffset', (x.base - sp).toFixed(3));
    // the blurred focus glow breathes through fill-opacity (cheap), never through its geometry
    if (M.glowOn) M.glow.setAttribute('fill-opacity', (0.78 + 0.22 * Math.sin(M.t * 4)).toFixed(3));
  }
  cacheMotion() {
    const fig = this.$('.lj-figure');
    const list = (sel) => [...fig.querySelectorAll(sel)].map((el) => ({ el, base: Number(el.dataset.base) || 0 }));
    this.motion = { t: this.motion ? this.motion.t : 0, flows: list('.lj-flow'), pulses: list('.lj-signal, .lj-pulse'), glow: fig.querySelector('.lj-focus-glow'), flowsOn: [], pulsesOn: [], glowOn: false };
    this.refreshMotion();
  }
  refreshMotion() {
    const M = this.motion;
    if (!M) return;
    const on = (x) => x.el.classList.contains('is-on');
    M.flowsOn = M.flows.filter(on); M.pulsesOn = M.pulses.filter(on);
    M.glowOn = !!(M.glow && M.glow.classList.contains('is-on'));
    if (M.t) this.motionFrame(0); // newly shown pulses join the stream where it is
  }

  setSpeed(v) { const n = Number(v); if (SPEEDS.includes(n)) { this.play_.speed = n; this.syncPlayback(); this.emit('change', this.getState()); } }
  syncProgress() {
    if (!this.root) return;
    const p = this.progress();
    const r = this.$('.lj-range');
    if (r && document.activeElement !== r) r.value = String(Math.round(p * 1000));
    const f = this.$('.lj-bar-fill'); if (f) f.style.transform = `scaleX(${p})`;
  }
  syncPlayback() {
    if (!this.root) return;
    const t = UI[this.lang], P = this.play_;
    const b = this.$('.lj-playbtn');
    const label = P.playing ? t.pause : P.done ? t.replay : t.play;
    b.setAttribute('aria-label', label); b.querySelector('.lj-play-t').textContent = label;
    b.dataset.mode = P.playing ? 'pause' : P.done ? 'replay' : 'play';
    this.root.dataset.playing = P.playing ? 'true' : 'false';
    this.root.querySelectorAll('.lj-speed-b').forEach((x) => x.setAttribute('aria-pressed', String(Number(x.dataset.speed) === P.speed)));
    this.syncProgress();
  }

  href(slug) {
    if (this.linkFor) return this.linkFor(slug);
    const base = this.basePath.endsWith('/') ? this.basePath : this.basePath + '/';
    return `${base}${this.lang === 'en' ? 'en/' : ''}procedures/${slug}/`;
  }

  // ---------------------------------------------------------------------------------------------
  build() {
    const t = UI[this.lang], id = this.id;
    const root = document.createElement('section');
    root.className = 'lj';
    root.lang = this.lang; root.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    root.dataset.theme = this.theme;
    root.setAttribute('aria-labelledby', `${id}-title`);
    const rail = STEPS.map((s, i) => `<li><button type="button" class="lj-stop" data-step="${i}"><span class="lj-sr">${esc(t.step)} </span><span class="lj-stop-n">${i + 1}</span><span class="lj-stop-l"> ${esc(s[this.lang].name)}</span></button></li>`).join('');
    const all = STEPS.map((s) => `<li><strong>${esc(s[this.lang].title)}.</strong> ${esc(s[this.lang].body)}${s.wrong.length ? ' ' + s.wrong.map((w) => `<a href="${esc(this.href(w.slug))}">${esc(w[this.lang])}</a>`).join(' · ') : ''}</li>`).join('');
    root.innerHTML = `
<header class="lj-head">
  <p class="lj-kicker">${esc(t.kicker)}</p>
  <h2 class="lj-title" id="${id}-title">${esc(t.title)}</h2>
  <p class="lj-lede">${esc(t.lede)}</p>
</header>
<div class="lj-stage">
  <div class="lj-figure"></div>
  <div class="lj-player">
    <button type="button" class="lj-btn lj-btn--primary lj-playbtn" data-mode="play"><span class="lj-play-i" aria-hidden="true"></span><span class="lj-play-t"></span></button>
    <div class="lj-bar">
      <div class="lj-bar-track" aria-hidden="true"><span class="lj-bar-fill"></span>${STEPS.map((_, i) => `<span class="lj-bar-mark" style="inset-inline-start:${(i / STEPS.length) * 100}%"></span>`).join('')}</div>
      <input class="lj-range" type="range" min="0" max="1000" step="1" value="0" aria-label="${esc(t.timeline)}">
    </div>
    <div class="lj-speed" role="group" aria-label="${esc(t.speed)}">${SPEEDS.map((v) => `<button type="button" class="lj-speed-b" data-speed="${v}" aria-pressed="false"><bdi dir="ltr">${v}×</bdi></button>`).join('')}</div>
  </div>
  <p class="lj-note"><span class="lj-note-dot" aria-hidden="true"></span>${esc(t.illustrativeNote)} ${esc(t.autoplayNote)}</p>
</div>
<div class="lj-deck">
  <div class="lj-panel" tabindex="-1">
    <p class="lj-count"><span class="lj-count-n"></span><span class="lj-count-t"></span></p>
    <h3 class="lj-step-title"></h3>
    <p class="lj-body"></p>
    <p class="lj-role"><span class="lj-role-k"></span> <span class="lj-role-v"></span></p>
    <div class="lj-wrong"></div>
    <p class="lj-sources"></p>
  </div>
  <div class="lj-side">
    <nav class="lj-nav" aria-label="${esc(t.steps)}">
      <ol class="lj-rail">${rail}</ol>
      <div class="lj-pn">
        <button type="button" class="lj-btn lj-prev"><span class="lj-arrow" aria-hidden="true"></span><span>${esc(t.prev)}</span></button>
        <button type="button" class="lj-btn lj-btn--primary lj-next"><span>${esc(t.next)}</span><span class="lj-arrow" aria-hidden="true"></span></button>
      </div>
    </nav>
    <div class="lj-controls">
      <div class="lj-toggle" role="group" aria-labelledby="${id}-lt"><span class="lj-toggle-k" id="${id}-lt">${esc(t.light)}</span>
        <button type="button" class="lj-seg" data-light="dim">${esc(t.dim)}</button><button type="button" class="lj-seg" data-light="bright">${esc(t.bright)}</button></div>
      <div class="lj-toggle" role="group" aria-labelledby="${id}-ft"><span class="lj-toggle-k" id="${id}-ft">${esc(t.focus)}</span>
        <button type="button" class="lj-seg" data-focus="far">${esc(t.far)}</button><button type="button" class="lj-seg" data-focus="near">${esc(t.near)}</button></div>
    </div>
  </div>
</div>
<details class="lj-text"><summary>${esc(t.readAll)}</summary><ol>${all}</ol><p class="lj-disclaimer">${esc(t.disclaimer)}</p></details>
<p class="lj-sr lj-live" aria-live="polite" aria-atomic="true"></p>`;
    this.root = root;
    this.$ = (sel) => root.querySelector(sel);
    this.host.appendChild(root);
    this.compact = this.isCompact();
    this.renderFigure();
    // phone layout (2026-11-25): a tighter, taller crop below a 560 px container, switched live on resize
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(() => {
        const c = this.isCompact();
        if (c === this.compact || !this.root) return;
        this.compact = c; this.renderFigure(); this.update({ announce: false });
      });
      ro.observe(root);
      this.disposers.push(() => ro.disconnect());
    }
    this.wire();
    this.applyMotion();
    this.update({ announce: false });
    this.syncPlayback();
  }

  /** Same breakpoint as the stylesheet's small-container rules: the .lj content box under 560 px. */
  isCompact() {
    const r = this.root, cs = getComputedStyle(r);
    return r.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0) < 560;
  }

  renderFigure() {
    const t = UI[this.lang];
    const fig = this.$('.lj-figure');
    const markup = svgMarkup({ id: this.id, state: this.state, lang: this.lang, illustrative: esc(t.illustrative), compact: !!this.compact, labelFor: (part) => esc(STEPS.find((s) => s.part === part)[this.lang].name) });
    const old = fig.firstElementChild;
    if (!old) { fig.innerHTML = markup; this.cacheMotion(); return; }
    // morph geometry in place so pupil and lens changes can transition
    const tpl = document.createElement('div'); tpl.innerHTML = markup;
    morph(old, tpl.firstElementChild);
    this.cacheMotion();
  }

  wire() {
    const r = this.root;
    this.listen(r, 'click', (e) => {
      const b = e.target.closest('button, [data-hit]');
      if (!b || !r.contains(b)) return;
      if (b.matches('.lj-playbtn')) { if (this.play_.playing) this.pause(true); else if (this.play_.done) this.replay(); else this.play(true); }
      else if (b.matches('.lj-speed-b')) this.setSpeed(b.dataset.speed);
      // taking the steps by hand hands control to the visitor: autoplay stops until Play
      else if (b.matches('.lj-stop')) { this.pause(true); this.goTo(+b.dataset.step, { focusPanel: false }); }
      else if (b.matches('.lj-prev')) { this.pause(true); this.goTo(this.state.step - 1); }
      else if (b.matches('.lj-next')) { this.pause(true); this.goTo(this.state.step + 1); }
      else if (b.dataset.light) this.set({ light: b.dataset.light });
      else if (b.dataset.focus) this.set({ focus: b.dataset.focus });
      else if (b.dataset.hit) { const i = STEPS.findIndex((s) => s.part === b.dataset.hit); if (i >= 0) { this.pause(true); this.goTo(i); } }
    });
    this.listen(this.$('.lj-range'), 'input', (e) => this.seek(Number(e.target.value) / 1000));
    this.listen(r, 'keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target.closest('summary, a, .lj-text')) return;
      const rtl = this.lang === 'ar';
      const fwd = rtl ? 'ArrowLeft' : 'ArrowRight', back = rtl ? 'ArrowRight' : 'ArrowLeft';
      let to = null;
      if (e.key === fwd) to = this.state.step + 1;
      else if (e.key === back) to = this.state.step - 1;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = STEPS.length - 1;
      if (to === null) return;
      e.preventDefault();
      this.pause(true);
      this.goTo(to);
      // keep keyboard focus on the matching step stop so the rail stays the reading position
      if (e.target.closest('.lj-rail')) this.$(`.lj-stop[data-step="${this.state.step}"]`)?.focus();
    });
  }

  goTo(i, { focusPanel = false, keepTime = false } = {}) {
    const n = Math.max(0, Math.min(STEPS.length - 1, Math.round(Number(i) || 0)));
    if (!keepTime && !this.destroyed) { this.play_.elapsed = 0; this.play_.done = false; this.syncProgress(); this.syncPlayback(); }
    if (this.destroyed || n === this.state.step) return this.getState();
    this.state.step = n;
    this.update();
    if (focusPanel) this.$('.lj-panel').focus({ preventScroll: true });
    this.emit('step', this.getState());
    this.emit('change', this.getState());
    return this.getState();
  }

  set(patch) {
    if (this.destroyed) return;
    let changed = false;
    for (const k of Object.keys(patch)) if (this.state[k] !== patch[k]) { this.state[k] = patch[k]; changed = true; }
    if (!changed) return;
    this.renderFigure();
    this.update({ announce: false });
    this.emit('change', this.getState());
  }

  update({ announce = true } = {}) {
    const t = UI[this.lang], s = STEPS[this.state.step], c = s[this.lang], step = this.state.step, total = STEPS.length;
    const r = this.root;
    r.dataset.step = s.id; r.dataset.light = this.state.light; r.dataset.focus = this.state.focus;
    // diagram
    r.querySelectorAll('.lj-part, .lj-label').forEach((el) => el.classList.toggle('is-active', el.dataset.part === s.part));
    r.querySelectorAll('[data-stage]').forEach((el) => {
      const on = el.dataset.only ? +el.dataset.only === step : +el.dataset.stage <= step;
      el.classList.toggle('is-on', on);
    });
    this.refreshMotion();
    if (this.play_.playing) this.syncCamera();
    r.querySelectorAll('.lj-obj').forEach((el) => el.classList.toggle('is-on', el.dataset.focus === this.state.focus));
    r.querySelectorAll('.lj-sun, .lj-moon').forEach((el) => el.classList.toggle('is-on', el.dataset.light === this.state.light));
    this.$(`#${this.id}-t`).textContent = t.diagram;
    this.$(`#${this.id}-d`).textContent = describe(this.state, this.lang);
    // panel
    this.$('.lj-count-n').textContent = String(step + 1).padStart(2, '0');
    this.$('.lj-count-t').textContent = ` / ${String(total).padStart(2, '0')}`;
    this.$('.lj-count').setAttribute('aria-label', `${t.step} ${step + 1} ${t.of} ${total}`);
    this.$('.lj-step-title').textContent = c.title;
    this.$('.lj-body').textContent = c.body;
    this.$('.lj-role-k').textContent = t.role + ':';
    this.$('.lj-role-v').textContent = c.role;
    const wrong = this.$('.lj-wrong');
    wrong.innerHTML = s.wrong.length ? `<p class="lj-wrong-k">${esc(t.wrong)}</p><ul>${s.wrong.map((w) => `<li><a class="lj-link" href="${esc(this.href(w.slug))}" data-slug="${w.slug}">${esc(w[this.lang])}<span class="lj-arrow" aria-hidden="true"></span></a></li>`).join('')}</ul>` : '';
    this.$('.lj-sources').innerHTML = `<span>${esc(t.sources)}:</span> ` + s.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>`).join(' · ');
    // controls
    r.querySelectorAll('.lj-stop').forEach((b, i) => {
      if (i === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('is-done', i < step);
    });
    this.$('.lj-prev').disabled = step === 0;
    this.$('.lj-next').disabled = step === total - 1;
    r.querySelectorAll('[data-light].lj-seg').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.light === this.state.light)));
    r.querySelectorAll('[data-focus].lj-seg').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.focus === this.state.focus)));
    if (announce) this.$('.lj-live').textContent = t.announce(step + 1, total, c);
  }

  applyMotion() { if (this.root) this.root.dataset.motion = this.reduced ? 'reduce' : 'full'; if (this.reduced && this.play_ && this.play_.playing && !this.play_.userStarted) this.pause(false); }

  setLang(l) {
    const lang = l === 'en' ? 'en' : 'ar';
    if (this.destroyed || lang === this.lang) return;
    this.lang = lang;
    const focusedStep = this.root.contains(document.activeElement) ? document.activeElement.closest('.lj-stop')?.dataset.step : null;
    this.teardownDom();
    this.build();
    if (focusedStep != null) this.$(`.lj-stop[data-step="${focusedStep}"]`)?.focus();
    this.emit('langchange', this.getState());
    this.emit('change', this.getState());
  }

  setTheme(th) {
    const theme = th === 'dark' ? 'dark' : 'light';
    if (this.destroyed || theme === this.theme) return;
    this.theme = theme;
    this.root.dataset.theme = theme;
    this.emit('themechange', this.getState());
    this.emit('change', this.getState());
  }

  teardownDom() {
    for (const d of this.disposers.splice(0)) d();
    this.root?.remove();
    this.root = null;
  }

  destroy() {
    if (this.destroyed) return;
    this.pause(false);
    if (this.play_.io) { this.play_.io.disconnect(); this.play_.io = null; }
    this.emit('destroy', this.getState());
    this.teardownDom();
    for (const d of this.persistent.splice(0)) d();
    this.events.clear();
    this.motion = null;
    this.destroyed = true;
    instances.delete(this.host);
    counters.destroys++; counters.live--;
  }
}

// Copy geometry attributes from a freshly rendered SVG onto the live one (same structure), so CSS transitions on
// `d` and positions can animate between states.
const GEOM = ['viewBox', 'data-layout', 'data-base', 'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'transform', 'text-anchor'];
function morph(a, b) {
  if (!a || !b || a.tagName !== b.tagName) return;
  for (const k of GEOM) { const v = b.getAttribute(k); if (v !== null && a.getAttribute(k) !== v) a.setAttribute(k, v); }
  if (a.tagName === 'text' && !b.children.length) a.textContent = b.textContent; // keep the numbered <tspan>
  const ac = a.children, bc = b.children;
  for (let i = 0; i < Math.min(ac.length, bc.length); i++) morph(ac[i], bc[i]);
}
