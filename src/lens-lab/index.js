// Vision & Lens Lab — public entry point (lazy-loadable chunk).
// API: mount(host, { lang: 'ar'|'en', theme: 'light'|'dark', reducedMotion?, debug?, simulator?: 'auto'|'lazy'|'eager'|'off',
//                    lensA?, lensB?, scenario? }) → Promise<controller>
// controller: { destroy, setLang, setTheme, getState, on, setLenses, setScenario }
//
// (a) comparison table of five lens categories (stacked cards on narrow containers), (b) "compare two" with key
// differences, an everyday-situation selector and an embedded vision-simulator split view, (c) key information
// first with model assumptions in <details>, (d) a persistent "educational illustration" label linked to the
// model limitations. Educational content only — pending review by Dr. Maan. See docs/phase-1/IOL_COMPARISON_REVIEW.md.
// simulator 'auto' (the public page): phones and tablets get no embedded picture, so the page runs one WebGL context,
// the full simulator above this module, and the long sections fold away; wider screens behave like 'lazy'.
import './styles.css';
import { CONTENT, LENS_ORDER, SIM_LENS, DIMENSIONS, LEVELS, SCENARIO_ORDER, SCENARIO_ROWS, SOURCES } from './content.js';
import { computeView } from '../vision-sim/optics/model.js';
import { SCENARIOS } from '../vision-sim/optics/params.js';

/** Debug counters (exposed on window only with { debug: true }) used by tests to prove clean teardown. */
export const counters = { mounts: 0, destroys: 0, live: 0, listeners: 0, observers: 0, sims: 0 };
const instances = new WeakMap();
let uid = 0;
const COMPACT_QUERY = '(max-width: 1023.98px)';
/** Corneal astigmatism assumed in the picture whenever a toric lens is compared (minus-cylinder, D). */
export const TORIC_DEMO_CYL = -1.5;

export async function mount(host, options = {}) {
  if (!host || host.nodeType !== 1) throw new TypeError('lens-lab mount(host): host must be an element');
  const prev = instances.get(host);
  if (prev) prev.destroy();
  const lab = new LensLab(host, options);
  instances.set(host, lab.controller);
  lab.init();
  return lab.controller;
}

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (lang, n, d = 0) => {
  try { return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-GB', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n); } catch { return n.toFixed(d); }
};

class LensLab {
  constructor(host, o) {
    this.host = host;
    this.n = ++uid;
    this.lang = o.lang === 'en' ? 'en' : 'ar';
    this.theme = o.theme === 'dark' ? 'dark' : 'light';
    this.debug = !!o.debug;
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    this.reduced = typeof o.reducedMotion === 'boolean' ? o.reducedMotion : !!(mq && mq.matches);
    this.simMode = ['eager', 'off', 'auto'].includes(o.simulator) ? o.simulator : 'lazy';
    this.compactMq = this.simMode === 'auto' && typeof matchMedia === 'function' ? matchMedia(COMPACT_QUERY) : null;
    this.compact = !!(this.compactMq && this.compactMq.matches);
    this.folds = {}; // which sections the visitor opened (survives a language change)
    this.lensA = LENS_ORDER.includes(o.lensA) ? o.lensA : 'monofocal';
    this.lensB = LENS_ORDER.includes(o.lensB) && o.lensB !== this.lensA ? o.lensB : (this.lensA === 'trifocal' ? 'edof' : 'trifocal');
    this.scenario = SCENARIO_ORDER.includes(o.scenario) ? o.scenario : 'night-driving';
    this.glance = 'monofocal'; // the card shown on narrow screens (one card at a time instead of five stacked)
    this.sim = null;
    this.simState = this.simMode === 'off' ? 'off' : this.compact ? 'none' : 'idle';
    this.disposers = [];
    this.events = new Map();
    this.destroyed = false;
    this.swapNote = false;
    counters.mounts++; counters.live++;
    const self = this;
    this.controller = {
      destroy: () => self.destroy(),
      setLang: (l) => self.setLang(l),
      setTheme: (t) => self.setTheme(t),
      getState: () => self.getState(),
      on: (ev, cb) => self.on(ev, cb),
      setLenses: (a, b) => self.setLenses(a, b),
      setScenario: (id) => self.setScenario(id),
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
  on(ev, cb) {
    if (!this.events.has(ev)) this.events.set(ev, new Set());
    this.events.get(ev).add(cb);
    return () => this.events.get(ev)?.delete(cb);
  }
  emit(ev, payload) {
    const set = this.events.get(ev);
    if (!set) return;
    for (const cb of [...set]) { try { cb(payload); } catch (err) { console.warn('[lens-lab] listener error', err); } }
  }

  // ---------- lifecycle ----------
  init() {
    this.root = document.createElement('section');
    this.root.className = 'llab';
    this.host.appendChild(this.root);
    this.simHost = document.createElement('div'); // survives re-renders (language change)
    this.simHost.className = 'llab-sim-mount';
    this.build();
    this.bindEvents();
    if (this.simMode === 'eager') this.loadSim();
    else if (this.simMode === 'lazy' || (this.simMode === 'auto' && !this.compact)) this.observeSim();
    if (this.compactMq) this.listen(this.compactMq, 'change', (e) => this.setCompact(e.matches));
    if (this.debug) { window.__lensLabCounters = counters; window.__lensLab = this.controller; }
    this.emit('ready', this.getState());
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    for (const off of this.disposers.splice(0).reverse()) { try { off(); } catch { /* ignore */ } }
    if (this.sim) { try { this.sim.destroy(); } catch { /* ignore */ } this.sim = null; counters.sims--; }
    if (this.root) { this.root.remove(); this.root = null; }
    this.events.clear();
    if (instances.get(this.host) === this.controller) instances.delete(this.host);
    if (this.debug && window.__lensLab === this.controller) delete window.__lensLab;
    counters.live--; counters.destroys++;
  }

  // A rotated tablet can cross the threshold: the embedded picture and its WebGL context must follow.
  setCompact(on) {
    if (this.destroyed || on === this.compact) return;
    this.saveFolds();
    this.compact = on;
    if (on && this.stopObserving) { this.stopObserving(); this.stopObserving = null; }
    if (on && this.sim) { try { this.sim.destroy(); } catch { /* ignore */ } this.sim = null; counters.sims--; }
    this.simState = on ? 'none' : 'idle';
    this.build();
    if (!on) this.observeSim();
    this.emit('change', { what: 'compact', state: this.getState() });
  }
  saveFolds() {
    if (!this.root) return;
    this.root.querySelectorAll('details[data-fold]').forEach((d) => { this.folds[d.dataset.fold] = d.open; });
  }

  observeSim() {
    if (!('IntersectionObserver' in window)) { this.loadSim(); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      stop();
      this.loadSim();
    }, { rootMargin: '300px 0px' });
    io.observe(this.simSlot());
    counters.observers++;
    let live = true;
    const stop = () => { if (!live) return; live = false; io.disconnect(); counters.observers--; };
    this.stopObserving = stop;
    this.disposers.push(stop);
  }
  simSlot() { return this.root.querySelector('[data-lens-lab-sim]'); }

  async loadSim() {
    if (this.destroyed || this.sim || this.simState === 'loading' || this.simMode === 'off' || this.compact) return;
    this.simState = 'loading';
    this.renderSimStatus();
    try {
      const mod = await import('../vision-sim/index.js');
      if (this.destroyed || this.compact) { this.simState = this.destroyed ? this.simState : 'none'; return; }
      const sim = await mod.mount(this.simHost, {
        ui: 'viewer', lang: this.lang, theme: this.theme, reducedMotion: this.reduced, debug: this.debug,
        compare: true, lens: SIM_LENS[this.left()], lensB: SIM_LENS[this.right()], scenario: this.scenario,
        refraction: this.refraction(),
      });
      if (this.destroyed || this.compact) { sim.destroy(); if (!this.destroyed) this.simState = 'none'; return; }
      this.sim = sim; counters.sims++;
      const st = sim.getState().state;
      this.simState = st === 'fallback' ? 'failed' : 'ready';
      sim.setLang(this.lang); sim.setTheme(this.theme); // in case they changed while loading
      this.syncSim();
      this.emit('simready', this.getState());
    } catch (err) {
      if (this.destroyed) return;
      console.warn('[lens-lab] vision simulator failed to load', err);
      this.simState = 'failed';
      this.emit('simerror', { error: String(err && err.message || err) });
    }
    this.renderSimStatus();
  }

  refraction() {
    return this.lensA === 'toric' || this.lensB === 'toric' ? { cylD: TORIC_DEMO_CYL, axisDeg: 180, sphereD: 0 } : { cylD: 0, axisDeg: 180, sphereD: 0 };
  }
  // Reading order: lens A is on the LEFT of the picture in English and on the RIGHT in Arabic, matching the pickers
  // (the simulator's own left/right tags are relabelled A/B by the lab's CSS accordingly).
  left() { return this.lang === 'ar' ? this.lensB : this.lensA; }
  right() { return this.lang === 'ar' ? this.lensA : this.lensB; }
  syncSim() {
    if (!this.sim) return;
    this.sim.setLens(SIM_LENS[this.left()], 'A');
    this.sim.setCompare(true, SIM_LENS[this.right()]);
    this.sim.setScenario(this.scenario);
    this.sim.setRefraction(this.refraction());
  }

  // ---------- rendering ----------
  t() { return CONTENT[this.lang]; }

  level(lens, dim) {
    const c = this.t();
    const lv = LEVELS[lens][dim];
    return `<span class="llab-lvl" data-level="${lv}"><span class="llab-lvl-bar" aria-hidden="true"><i></i><i></i><i></i></span><span class="llab-lvl-text"><span class="llab-sr">${esc(c.legend[lv])}: </span>${esc(c.lenses[lens].levels[dim])}</span></span>`;
  }
  list(items) { return `<ul class="llab-list">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`; }

  tableHTML() {
    const c = this.t();
    const head = LENS_ORDER.map((l) => `<th scope="col" data-lens="${l}"><span class="llab-th-name">${esc(c.lenses[l].name)}</span><bdi class="llab-code" dir="ltr">${esc(c.lenses[l].code)}</bdi></th>`).join('');
    const dimRow = (d) => `<tr data-row="${d}"><th scope="row"><span>${esc(c.dims[d].label)}</span>${c.dims[d].hint ? `<small>${esc(c.dims[d].hint)}</small>` : ''}</th>${LENS_ORDER.map((l) => `<td data-lens="${l}">${this.level(l, d)}</td>`).join('')}</tr>`;
    const textRow = (key, fn) => `<tr data-row="${key}" class="llab-row-text"><th scope="row">${esc(c.rows[key])}</th>${LENS_ORDER.map((l) => `<td data-lens="${l}">${fn(l)}</td>`).join('')}</tr>`;
    return `<div class="llab-table-wrap" role="region" tabindex="0" aria-labelledby="llab${this.n}-cap">
      <table class="llab-table">
        <caption id="llab${this.n}-cap" class="llab-sr">${esc(c.tableCaption)}</caption>
        <thead><tr><th scope="col" class="llab-corner">${esc(c.rowHead)}</th>${head}</tr></thead>
        <tbody>
          ${textRow('what', (l) => `<p>${esc(c.lenses[l].what)}</p>`)}
          ${DIMENSIONS.map(dimRow).join('')}
          ${textRow('pros', (l) => this.list(c.lenses[l].pros))}
          ${textRow('cons', (l) => this.list(c.lenses[l].cons))}
          ${textRow('ask', (l) => this.list(c.lenses[l].ask))}
        </tbody>
      </table>
    </div>`;
  }

  cardHTML(l, { tag = '', diffWith = null, headingLevel = 4, foldDetails = false } = {}) {
    const c = this.t();
    const h = `h${headingLevel}`;
    const dims = DIMENSIONS.map((d) => {
      const diff = diffWith ? LEVELS[l][d] !== LEVELS[diffWith][d] : null;
      return `<div class="llab-dim${diff ? ' is-diff' : ''}" data-row="${d}"><dt>${esc(c.dims[d].label)}${c.dims[d].hint ? ` <small>${esc(c.dims[d].hint)}</small>` : ''}${diff === null ? '' : `<span class="llab-flag">${esc(diff ? c.differs : c.same)}</span>`}</dt><dd>${this.level(l, d)}</dd></div>`;
    }).join('');
    return `<article class="llab-card" data-lens="${l}">
      <${h} class="llab-card-title">${tag ? `<span class="llab-badge" aria-hidden="true">${tag}</span>` : ''}<span>${esc(c.lenses[l].name)}</span></${h}>
      <p class="llab-what">${esc(c.lenses[l].what)}</p>
      <dl class="llab-dims">${dims}</dl>
      ${foldDetails ? `<details class="llab-more"><summary>${esc(c.rows.pros)} · ${esc(c.rows.cons)} · ${esc(c.rows.ask)}</summary><div class="llab-fold-body">` : ''}
      <div class="llab-procon">
        <div class="llab-pros"><p class="llab-subhead">${esc(c.rows.pros)}</p>${this.list(c.lenses[l].pros)}</div>
        <div class="llab-cons"><p class="llab-subhead">${esc(c.rows.cons)}</p>${this.list(c.lenses[l].cons)}</div>
      </div>
      <div class="llab-ask"><p class="llab-subhead">${esc(c.rows.ask)}</p>${this.list(c.lenses[l].ask)}</div>
      ${foldDetails ? '</div></details>' : ''}
    </article>`;
  }

  pickHTML(slot) {
    const c = this.t();
    const cur = slot === 'A' ? this.lensA : this.lensB;
    const radios = LENS_ORDER.map((l) => {
      const id = `llab${this.n}-${slot}-${l}`;
      return `<input class="llab-radio" type="radio" name="llab${this.n}-${slot}" id="${id}" value="${l}" data-pick="${slot}" ${l === cur ? 'checked' : ''}><label for="${id}" class="llab-chip">${esc(c.lenses[l].short)}</label>`;
    }).join('');
    return `<fieldset class="llab-pick" data-slot="${slot}"><legend><span class="llab-badge" aria-hidden="true">${slot}</span>${esc(slot === 'A' ? c.pickA : c.pickB)}</legend><div class="llab-chips">${radios}</div></fieldset>`;
  }

  scenarioHTML() {
    const c = this.t();
    const radios = SCENARIO_ORDER.map((k) => {
      const id = `llab${this.n}-scn-${k}`;
      return `<input class="llab-radio" type="radio" name="llab${this.n}-scn" id="${id}" value="${k}" data-scn ${k === this.scenario ? 'checked' : ''}><label for="${id}" class="llab-chip llab-chip-scn"><span>${esc(c.scenarios[k].label)}</span><small>${esc(c.scenarios[k].sub)}</small></label>`;
    }).join('');
    return `<fieldset class="llab-scn"><legend>${esc(c.scenarioTitle)}</legend><div class="llab-chips llab-chips-scn">${radios}</div></fieldset>`;
  }

  /** On phones a long section folds behind its own title; elsewhere the same section is simply open. */
  fold(key, head, body) {
    if (!this.compact) return `${head}${body}`;
    return `<details class="llab-fold" data-fold="${key}"${this.folds[key] ? ' open' : ''}><summary>${head}</summary><div class="llab-fold-body">${body}</div></details>`;
  }

  build() {
    this.saveFolds();
    const c = this.t();
    const r = this.root;
    const n = this.n;
    r.lang = this.lang;
    r.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    r.dataset.theme = this.theme;
    r.dataset.reducedMotion = this.reduced ? 'true' : 'false';
    r.dataset.compact = this.compact ? 'true' : 'false';
    r.setAttribute('aria-labelledby', `llab${n}-title`);
    const label = `<p class="llab-label" role="note"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span><span class="llab-label-text">${esc(c.label)}</span> <a href="#llab${n}-limits" class="llab-link" data-act="limits">${esc(c.limitsLink)}</a></span></p>`;
    r.innerHTML = `
  <header class="llab-head">
    <p class="llab-kicker">${esc(c.kicker)}</p>
    <h2 class="llab-title" id="llab${n}-title">${esc(c.title)}</h2>
    <p class="llab-lede">${esc(c.lede)}</p>
    ${label}
    <p class="llab-review">${esc(c.reviewStatus)}</p>
  </header>

  <section class="llab-sec llab-glance" aria-labelledby="llab${n}-glance">
    <h3 class="llab-h" id="llab${n}-glance">${esc(c.tableTitle)}</h3>
    <p class="llab-intro">${esc(c.tableIntro)}</p>
    <p class="llab-toric">${esc(c.toricNote)}</p>
    ${this.tableHTML()}
    <div class="llab-cards">
      <fieldset class="llab-glance-pick"><legend>${esc(c.showLens)}</legend><div class="llab-chips llab-chips-glance">${LENS_ORDER.map((l) => `<input class="llab-radio" type="radio" name="llab${n}-glance" id="llab${n}-glance-${l}" value="${l}" data-glance ${l === this.glance ? 'checked' : ''}><label for="llab${n}-glance-${l}" class="llab-chip">${esc(c.lenses[l].short)}</label>`).join('')}</div></fieldset>
      ${LENS_ORDER.map((l) => this.cardHTML(l, { headingLevel: 4, foldDetails: this.compact }).replace('<article class="llab-card"', `<article class="llab-card${l === this.glance ? ' is-shown' : ''}"`)).join('')}
    </div>
  </section>

  <section class="llab-sec llab-compare" aria-labelledby="llab${n}-compare">
    ${this.fold('compare', `<h3 class="llab-h" id="llab${n}-compare">${esc(c.compareTitle)}</h3>`, `
    <p class="llab-intro">${esc(c.compareIntro)}</p>
    <div class="llab-pickers">${this.pickHTML('A')}${this.pickHTML('B')}</div>
    <p class="llab-swap" data-ref="swap" role="status"></p>
    ${this.scenarioHTML()}
    ${this.compact ? '' : `<div class="llab-sim">
      <h4 class="llab-h4">${esc(c.simTitle)}</h4>
      <p class="llab-help">${esc(c.simHelp)}</p>
      <p class="llab-assume" data-ref="assume" hidden>${esc(c.toricAssumption)}</p>
      <div class="llab-sim-slot" data-lens-lab-sim><p class="llab-sim-status" data-ref="simStatus"></p></div>
      ${label.replace('class="llab-label"', 'class="llab-label llab-label-sim"')}
    </div>`}
    <div class="llab-situation" data-ref="situation"></div>
    <div class="llab-diff" data-ref="diff"></div>
    <div class="llab-side" data-ref="side"></div>
    <details class="llab-adv" data-ref="adv"><summary>${esc(c.advanced)}</summary><div data-ref="advBody"></div></details>`)}
  </section>

  <section class="llab-sec llab-limits" id="llab${n}-limits" tabindex="-1" aria-labelledby="llab${n}-limits-h">
    ${this.fold('limits', `<h3 class="llab-h" id="llab${n}-limits-h">${esc(c.limitsTitle)}</h3>`, `
    ${this.list(c.limits)}
    <h4 class="llab-h4">${esc(c.generalQuestionsTitle)}</h4>
    ${this.list(c.generalQuestions)}`)}
  </section>

  <details class="llab-sources">
    <summary>${esc(c.sourcesTitle)} (${num(this.lang, SOURCES.length)})</summary>
    <p class="llab-fine">${esc(c.sourcesNote)}</p>
    <ol>${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">${esc(s.label)}</a>${s.kind === 'study' ? ` <span class="llab-kind">${this.lang === 'ar' ? 'دراسة' : 'study'}</span>` : ''}</li>`).join('')}</ol>
  </details>
  <p class="llab-sr" data-ref="live" aria-live="polite" aria-atomic="true"></p>`;
    this.ref = {};
    r.querySelectorAll('[data-ref]').forEach((el) => { this.ref[el.dataset.ref] = el; });
    const slot = this.simSlot();
    if (slot) slot.appendChild(this.simHost);
    this.update();
    this.renderSimStatus();
  }

  renderSimStatus() {
    if (!this.ref || !this.ref.simStatus) { if (this.root) this.root.dataset.sim = this.simState; return; }
    const c = this.t();
    const msg = { idle: c.simLater, loading: c.simLoading, failed: c.simFailed, off: c.simFailed }[this.simState] || '';
    this.ref.simStatus.textContent = msg;
    this.ref.simStatus.hidden = this.simState === 'ready';
    if (this.root) this.root.dataset.sim = this.simState;
  }

  update() {
    const c = this.t();
    const A = this.lensA, B = this.lensB;
    this.root.querySelectorAll('input[data-pick]').forEach((el) => { el.checked = el.value === (el.dataset.pick === 'A' ? A : B); });
    this.root.querySelectorAll('input[data-scn]').forEach((el) => { el.checked = el.value === this.scenario; });
    this.ref.swap.textContent = this.swapNote ? c.sameLens : '';
    // situation: what each lens means for the chosen everyday task
    const rows = SCENARIO_ROWS[this.scenario];
    const sc = c.scenarios[this.scenario];
    const lensLine = (l, tag) => `<li><p class="llab-sit-lens"><span class="llab-badge" aria-hidden="true">${tag}</span><b>${esc(c.lenses[l].name)}</b></p><dl class="llab-dims llab-dims-tight">${rows.map((d) => `<div class="llab-dim" data-row="${d}"><dt>${esc(c.dims[d].label)}</dt><dd>${this.level(l, d)}</dd></div>`).join('')}</dl></li>`;
    this.ref.situation.innerHTML = `<p class="llab-subhead">${esc(c.inThisSituation)}: ${esc(sc.label)}</p><p class="llab-sit-detail">${esc(sc.detail)}</p><ul class="llab-sit-list">${lensLine(A, 'A')}${lensLine(B, 'B')}</ul>`;
    // key differences: rows that matter for this situation first
    const order = [...rows, ...DIMENSIONS.filter((d) => !rows.includes(d))];
    const diffs = order.filter((d) => LEVELS[A][d] !== LEVELS[B][d]);
    this.ref.diff.innerHTML = `<h4 class="llab-h4">${esc(c.differences)}</h4>${diffs.length ? `<ul class="llab-difflist">${diffs.map((d) => `<li data-row="${d}"><b>${esc(c.dims[d].label)}</b><span><span class="llab-badge" aria-hidden="true">A</span><span><b>${esc(c.lenses[A].short)}:</b> ${esc(c.lenses[A].levels[d])}</span></span><span><span class="llab-badge" aria-hidden="true">B</span><span><b>${esc(c.lenses[B].short)}:</b> ${esc(c.lenses[B].levels[d])}</span></span></li>`).join('')}</ul>` : `<p>${esc(c.noDifference)}</p>`}`;
    this.ref.side.innerHTML = `${this.cardHTML(A, { tag: 'A', diffWith: B, headingLevel: 4 })}${this.cardHTML(B, { tag: 'B', diffWith: A, headingLevel: 4 })}`;
    if (this.ref.assume) this.ref.assume.hidden = !(A === 'toric' || B === 'toric');
    this.root.dataset.lensA = A; this.root.dataset.lensB = B; this.root.dataset.scenario = this.scenario;
    this.renderAdvanced();
  }

  renderAdvanced() {
    const c = this.t();
    const L = this.lang;
    const sc = SCENARIOS[this.scenario];
    const view = (l) => computeView({ lens: SIM_LENS[l], distanceM: sc.distanceM, lighting: sc.lighting, refraction: this.refraction() });
    const va = view(this.lensA), vb = view(this.lensB);
    const dist = sc.distanceM >= 1 ? `${num(L, sc.distanceM)} ${L === 'ar' ? 'م' : 'm'}` : `${num(L, Math.round(sc.distanceM * 100))} ${L === 'ar' ? 'سم' : 'cm'}`;
    const D = L === 'ar' ? 'ديوبتر' : 'D';
    const row = (label, a, b) => `<tr><th scope="row">${esc(label)}</th><td>${a}</td><td>${b}</td></tr>`;
    const lay = (v) => v.layers[v.subject];
    this.ref.advBody.innerHTML = `<p class="llab-fine">${esc(c.advIntro)}</p>
      <div class="llab-adv-wrap"><table class="llab-adv-table">
        <thead><tr><td></td><th scope="col"><span class="llab-badge" aria-hidden="true">A</span> ${esc(c.lenses[this.lensA].short)}</th><th scope="col"><span class="llab-badge" aria-hidden="true">B</span> ${esc(c.lenses[this.lensB].short)}</th></tr></thead>
        <tbody>
          ${row(c.advDistance, dist, dist)}
          ${row(c.advPupil, `<bdi>${num(L, va.pupilMm, 1)} ${L === 'ar' ? 'مم' : 'mm'}</bdi>`, `<bdi>${num(L, vb.pupilMm, 1)} ${L === 'ar' ? 'مم' : 'mm'}</bdi>`)}
          ${row(c.advDefocus, `<bdi dir="ltr">${num(L, Math.abs(lay(va).defocusD), 2)} ${D}</bdi>`, `<bdi dir="ltr">${num(L, Math.abs(lay(vb).defocusD), 2)} ${D}</bdi>`)}
        </tbody></table></div>
      <p class="llab-fine">${esc(c.advDefocusNote)}</p>
      ${this.list(c.advAssumptions)}`;
  }

  bindEvents() {
    this.listen(this.root, 'change', (e) => {
      const t = e.target;
      if (t.dataset.pick) this.pick(t.dataset.pick, t.value, true);
      else if ('glance' in t.dataset) this.showGlance(t.value);
      else if ('scn' in t.dataset) this.setScenario(t.value, true);
    });
    this.listen(this.root, 'click', (e) => {
      const a = e.target.closest('[data-act="limits"]');
      if (!a) return;
      e.preventDefault();
      const sec = this.root.querySelector('.llab-limits');
      const folded = sec.querySelector('details[data-fold]');
      if (folded) folded.open = true;
      sec.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth', block: 'start' });
      sec.focus({ preventScroll: true });
    });
  }

  // ---------- state changes ----------
  showGlance(lens) {
    if (!LENS_ORDER.includes(lens)) return;
    this.glance = lens;
    this.root.querySelectorAll('.llab-cards > .llab-card').forEach((el) => el.classList.toggle('is-shown', el.dataset.lens === lens));
    this.emit('change', { what: 'glance', state: this.getState() });
  }
  pick(slot, lens, fromUI = false) {
    if (this.destroyed || !LENS_ORDER.includes(lens)) return;
    const other = slot === 'A' ? this.lensB : this.lensA;
    const prev = slot === 'A' ? this.lensA : this.lensB;
    this.swapNote = false;
    if (lens === other) { // keep the pair distinct: swap instead of comparing a lens with itself
      if (slot === 'A') this.lensB = prev; else this.lensA = prev;
      this.swapNote = fromUI;
    }
    if (slot === 'A') this.lensA = lens; else this.lensB = lens;
    this.changed('lenses');
  }
  setLenses(a, b) {
    if (this.destroyed || !LENS_ORDER.includes(a) || !LENS_ORDER.includes(b) || a === b) return;
    this.lensA = a; this.lensB = b; this.swapNote = false;
    this.changed('lenses');
  }
  setScenario(id) {
    if (this.destroyed || !SCENARIO_ORDER.includes(id)) return;
    this.scenario = id;
    this.changed('scenario');
  }
  changed(what) {
    this.update();
    this.syncSim();
    const c = this.t();
    if (this.ref.live) this.ref.live.textContent = `${c.lenses[this.lensA].name} · ${c.lenses[this.lensB].name}. ${c.scenarios[this.scenario].label}.`;
    this.emit('change', { what, state: this.getState() });
  }

  setLang(lang) {
    if (this.destroyed) return;
    const l = lang === 'en' ? 'en' : 'ar';
    if (l === this.lang) return;
    const active = document.activeElement;
    const focusId = active && this.root.contains(active) ? active.id : null;
    const advOpen = this.ref.adv.open;
    this.lang = l;
    this.build();
    this.ref.adv.open = advOpen;
    if (focusId) { const el = this.root.querySelector(`#${CSS.escape(focusId)}`); if (el) el.focus({ preventScroll: true }); }
    if (this.sim) { this.sim.setLang(l); this.syncSim(); }
    this.emit('langchange', { lang: l });
  }
  setTheme(theme) {
    if (this.destroyed) return;
    this.theme = theme === 'dark' ? 'dark' : 'light';
    this.root.dataset.theme = this.theme;
    if (this.sim) this.sim.setTheme(this.theme);
    this.emit('themechange', { theme: this.theme });
  }

  getState() {
    const s = this.sim ? this.sim.getState() : null;
    return {
      lang: this.lang,
      theme: this.theme,
      reducedMotion: this.reduced,
      lensA: this.lensA,
      lensB: this.lensB,
      scenario: this.scenario,
      glance: this.glance,
      picture: { left: this.left(), right: this.right() },
      toricAssumption: this.lensA === 'toric' || this.lensB === 'toric',
      destroyed: this.destroyed,
      sim: {
        status: this.simState,
        ...(s ? { state: s.state, lens: s.lens, lensB: s.lensB, compare: s.compare, distanceM: s.distanceM, lighting: s.lighting, scenario: s.scenario, pupilMm: s.pupilMm, refraction: s.refraction, ui: s.ui } : {}),
      },
    };
  }
}
