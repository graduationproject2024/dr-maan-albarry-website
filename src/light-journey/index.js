// How Vision Works: Interactive Light Journey (lightweight SVG module, no dependencies).
//
// API: mount(host, { lang: 'ar' | 'en', theme: 'light' | 'dark', reducedMotion?, step?, light?, focus?,
//                    linkFor?(slug) => href, basePath? })
//   → { destroy, setLang, setTheme, getState, on, goTo, next, prev, setLight, setFocus }
// Events (on(name, fn) returns an unsubscribe function): 'step', 'change', 'langchange', 'themechange', 'destroy'.
//
// Educational illustration: the rays are illustrative, not an optical simulation. Medical review: pending.
import './styles.css';
import { STEPS, UI, describe } from './content.js';
import { svgMarkup } from './diagram.js';

export { STEPS, UI };

// Debug counters used by the tests to prove clean teardown.
export const counters = { mounts: 0, destroys: 0, live: 0, listeners: 0 };
const instances = new WeakMap();
let uid = 0;

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
      goTo: (i) => this.goTo(i),
      next: () => this.goTo(this.state.step + 1),
      prev: () => this.goTo(this.state.step - 1),
      setLight: (v) => this.set({ light: v === 'dim' ? 'dim' : 'bright' }),
      setFocus: (v) => this.set({ focus: v === 'near' ? 'near' : 'far' })
    };
    this.build();
    if (this.mq && this.reducedOpt === null) this.listen(this.mq, 'change', () => this.applyMotion(), true);
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
    return { step: this.state.step, stepId: s.id, total: STEPS.length, light: this.state.light, focus: this.state.focus, lang: this.lang, theme: this.theme, reducedMotion: this.reduced };
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
  <p class="lj-note"><span class="lj-note-dot" aria-hidden="true"></span>${esc(t.illustrativeNote)}</p>
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
    this.renderFigure();
    this.wire();
    this.applyMotion();
    this.update({ announce: false });
  }

  renderFigure() {
    const t = UI[this.lang];
    const fig = this.$('.lj-figure');
    const markup = svgMarkup({ id: this.id, state: this.state, lang: this.lang, illustrative: esc(t.illustrative), labelFor: (part) => esc(STEPS.find((s) => s.part === part)[this.lang].name) });
    const old = fig.firstElementChild;
    if (!old) { fig.innerHTML = markup; return; }
    // morph geometry in place so pupil and lens changes can transition
    const tpl = document.createElement('div'); tpl.innerHTML = markup;
    morph(old, tpl.firstElementChild);
  }

  wire() {
    const r = this.root;
    this.listen(r, 'click', (e) => {
      const b = e.target.closest('button, [data-hit]');
      if (!b || !r.contains(b)) return;
      if (b.matches('.lj-stop')) this.goTo(+b.dataset.step, { focusPanel: false });
      else if (b.matches('.lj-prev')) this.goTo(this.state.step - 1);
      else if (b.matches('.lj-next')) this.goTo(this.state.step + 1);
      else if (b.dataset.light) this.set({ light: b.dataset.light });
      else if (b.dataset.focus) this.set({ focus: b.dataset.focus });
      else if (b.dataset.hit) { const i = STEPS.findIndex((s) => s.part === b.dataset.hit); if (i >= 0) this.goTo(i); }
    });
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
      this.goTo(to);
      // keep keyboard focus on the matching step stop so the rail stays the reading position
      if (e.target.closest('.lj-rail')) this.$(`.lj-stop[data-step="${this.state.step}"]`)?.focus();
    });
  }

  goTo(i, { focusPanel = false } = {}) {
    const n = Math.max(0, Math.min(STEPS.length - 1, Math.round(Number(i) || 0)));
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

  applyMotion() { if (this.root) this.root.dataset.motion = this.reduced ? 'reduce' : 'full'; }

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
    this.emit('destroy', this.getState());
    this.teardownDom();
    for (const d of this.persistent.splice(0)) d();
    this.events.clear();
    this.destroyed = true;
    instances.delete(this.host);
    counters.destroys++; counters.live--;
  }
}

// Copy geometry attributes from a freshly rendered SVG onto the live one (same structure), so CSS transitions on
// `d` and positions can animate between states.
const GEOM = ['d', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'transform', 'text-anchor'];
function morph(a, b) {
  if (!a || !b || a.tagName !== b.tagName) return;
  for (const k of GEOM) { const v = b.getAttribute(k); if (v !== null && a.getAttribute(k) !== v) a.setAttribute(k, v); }
  if (a.tagName === 'text') a.textContent = b.textContent;
  const ac = a.children, bc = b.children;
  for (let i = 0; i < Math.min(ac.length, bc.length); i++) morph(ac[i], bc[i]);
}
