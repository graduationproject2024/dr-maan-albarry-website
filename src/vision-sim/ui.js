// Vision simulator — DOM / accessibility layer. Native radio groups (keyboard + screen-reader semantics for
// free), a native range input for distance, a role="slider" divider for the lens comparison, and a polite
// live region. All listeners are delegated to the persistent root so a language re-render keeps them.
import { STRINGS, LENS_INFO, fmt, formatDistance } from './i18n.js';
import { curveChart, fallbackHTML } from './fallback.js';
import { DISTANCES, LENS_IDS, LIGHTING_IDS } from './optics/params.js';
import { distanceToSlider, sliderToDistance } from './optics/model.js';

let instance = 0;
const BANDS = ['distance', 'intermediate', 'near'];

export function createUI(host, { lang, theme, listen, handlers }) {
  const n = ++instance;
  const root = document.createElement('section');
  root.className = 'vsim';
  root.dataset.vsimInstance = String(n);
  host.appendChild(root);
  let L = lang, canvas = null, fallbackShown = false, noteKey = null;
  const ref = {};

  const radios = (name, values, labelFn, checked, cls = '') => values.map((v) => {
    const id = `vsim${n}-${name}-${String(v).replace(/[^a-z0-9-]/gi, '_')}`;
    return `<input class="vsim-radio" type="radio" name="vsim${n}-${name}" id="${id}" value="${v}" data-group="${name}" ${String(v) === String(checked) ? 'checked' : ''}><label for="${id}" class="vsim-seg-btn ${cls}">${labelFn(v)}</label>`;
  }).join('');

  function build(state) {
    const s = STRINGS[L];
    root.lang = L;
    root.dir = L === 'ar' ? 'rtl' : 'ltr';
    root.dataset.theme = theme;
    root.setAttribute('aria-label', s.region);
    const presetLabel = (k) => `<span class="vsim-seg-main">${s.presets[k]}</span><span class="vsim-seg-sub">${s.presetDist[k]}</span>`;
    const lensLabel = (k) => `<span class="vsim-seg-main">${s.lenses[k].short}</span>`;
    root.innerHTML = `
  <div class="vsim-stage">
    <div class="vsim-viewport" dir="ltr" data-ref="viewport">
      <div class="vsim-canvas-host" data-ref="canvasHost"></div>
      <span class="vsim-tag vsim-tag-a" data-ref="tagA" dir="${root.dir}"></span>
      <span class="vsim-tag vsim-tag-b" data-ref="tagB" dir="${root.dir}" hidden></span>
      <div class="vsim-divider" data-ref="divider" role="slider" tabindex="0" aria-label="${s.divider}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-orientation="horizontal" hidden><span class="vsim-divider-line"></span><span class="vsim-divider-knob" aria-hidden="true"></span></div>
      <p class="vsim-note" data-ref="note" role="status" hidden></p>
      <div class="vsim-fallback" data-ref="fallback" dir="${root.dir}" hidden></div>
    </div>
    <p class="vsim-disclaimer" data-ref="disclaimer"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>${s.disclaimer}</span></p>
  </div>
  <div class="vsim-controls">
    <fieldset class="vsim-field vsim-field-lens">
      <legend class="vsim-legend-title">${s.lens}</legend>
      <div class="vsim-seg vsim-seg-lens" data-ref="lensA">${radios('lensA', LENS_IDS, lensLabel, state.lens)}</div>
      <label class="vsim-switch"><input type="checkbox" data-ref="compare" ${state.compare ? 'checked' : ''}><span class="vsim-switch-track" aria-hidden="true"></span><span>${s.compare}</span></label>
    </fieldset>
    <fieldset class="vsim-field vsim-field-lens" data-ref="lensBField" ${state.compare ? '' : 'hidden'}>
      <legend class="vsim-legend-title">${s.compareWith}</legend>
      <div class="vsim-seg vsim-seg-lens" data-ref="lensB">${radios('lensB', LENS_IDS, lensLabel, state.lensB)}</div>
    </fieldset>
    <div class="vsim-field vsim-field-distance">
      <fieldset class="vsim-field-sub">
        <legend class="vsim-legend-title">${s.distance}</legend>
        <div class="vsim-seg vsim-seg-3">${radios('preset', ['near', 'intermediate', 'distance'], presetLabel, '')}</div>
      </fieldset>
      <div class="vsim-range-row">
        <input type="range" class="vsim-range" data-ref="range" min="0" max="1000" step="1" value="${distanceToSlider(state.distanceM)}" aria-label="${s.distance}">
        <output class="vsim-range-out" data-ref="rangeOut" aria-hidden="true"></output>
      </div>
    </div>
    <fieldset class="vsim-field vsim-field-light">
      <legend class="vsim-legend-title">${s.lighting}</legend>
      <div class="vsim-seg vsim-seg-3">${radios('lighting', LIGHTING_IDS, (k) => `<span class="vsim-seg-main">${s.lights[k]}</span>`, state.lighting)}</div>
    </fieldset>
    <details class="vsim-eye" data-ref="eye">
      <summary>${s.eye}</summary>
      <fieldset class="vsim-field-sub"><legend class="vsim-legend-title">${s.astig}</legend>
        <div class="vsim-seg vsim-seg-3">${radios('cyl', [0, 1, 2], (v) => (v ? `${fmt(L, v, 1)} ${s.D}` : s.none), Math.abs(state.refraction.cylD))}</div></fieldset>
      <fieldset class="vsim-field-sub"><legend class="vsim-legend-title">${s.axis}</legend>
        <div class="vsim-seg vsim-seg-2">${radios('axis', [180, 90], (v) => `${fmt(L, v)}°`, state.refraction.axisDeg)}</div></fieldset>
      <fieldset class="vsim-field-sub"><legend class="vsim-legend-title">${s.sphere}</legend>
        <div class="vsim-seg vsim-seg-3">${radios('sphere', [-1, 0, 1], (v) => (v ? `<bdi dir="ltr">${v > 0 ? '+' : '−'}${fmt(L, Math.abs(v), 2)}</bdi> ${s.D}` : s.none), state.refraction.sphereD)}</div></fieldset>
    </details>
  </div>
  <div class="vsim-info">
    <div class="vsim-lensinfo" data-ref="lensInfo"></div>
    <div class="vsim-meters" data-ref="meters"></div>
  </div>
  <details class="vsim-how"><summary>${s.how}</summary><div data-ref="how"></div></details>
  <p class="vsim-sr" data-ref="live" aria-live="polite" aria-atomic="true"></p>`;
    root.querySelectorAll('[data-ref]').forEach((el) => { ref[el.dataset.ref] = el; });
    if (canvas) ref.canvasHost.appendChild(canvas);
    if (fallbackShown) showFallback(true);
    if (noteKey) showNote(noteKey);
  }

  // ---------- delegated listeners ----------
  listen(root, 'change', (e) => {
    const t = e.target;
    if (t.dataset.group === 'lensA') handlers.lens(t.value);
    else if (t.dataset.group === 'lensB') handlers.lensB(t.value);
    else if (t.dataset.group === 'preset') handlers.distance(DISTANCES[t.value], 'preset');
    else if (t.dataset.group === 'lighting') handlers.lighting(t.value);
    else if (t.dataset.group === 'cyl') handlers.refraction({ cylD: -Number(t.value) });
    else if (t.dataset.group === 'axis') handlers.refraction({ axisDeg: Number(t.value) });
    else if (t.dataset.group === 'sphere') handlers.refraction({ sphereD: Number(t.value) });
    else if (t === ref.compare) handlers.compare(t.checked);
    else if (t === ref.range) handlers.distance(sliderToDistance(Number(t.value)), 'slider-commit');
  });
  listen(root, 'input', (e) => { if (e.target === ref.range) handlers.distance(sliderToDistance(Number(e.target.value)), 'slider'); });
  // divider: pointer + keyboard
  let drag = null;
  const splitFrom = (e) => { const r = ref.viewport.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };
  listen(root, 'pointerdown', (e) => {
    if (!ref.divider || ref.divider.hidden || !e.target.closest('.vsim-divider')) return;
    drag = e.pointerId;
    try { ref.divider.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    e.preventDefault();
    handlers.split(splitFrom(e));
  });
  listen(root, 'pointermove', (e) => { if (drag === e.pointerId) handlers.split(splitFrom(e)); });
  const end = (e) => { if (drag === e.pointerId) drag = null; };
  listen(root, 'pointerup', end);
  listen(root, 'pointercancel', end);
  listen(root, 'keydown', (e) => {
    if (e.target !== ref.divider) return;
    const cur = Number(ref.divider.getAttribute('aria-valuenow')) / 100;
    const step = { ArrowLeft: -0.05, ArrowDown: -0.05, ArrowRight: 0.05, ArrowUp: 0.05, PageDown: -0.2, PageUp: 0.2 }[e.key];
    let v = null;
    if (step !== undefined) v = cur + step;
    else if (e.key === 'Home') v = 0;
    else if (e.key === 'End') v = 1;
    if (v === null) return;
    e.preventDefault();
    handlers.split(Math.min(1, Math.max(0, v)));
  });

  function update(state, view, viewB) {
    const s = STRINGS[L];
    const set = (group, value) => root.querySelectorAll(`input[data-group="${group}"]`).forEach((r) => { r.checked = String(r.value) === String(value); });
    set('lensA', state.lens); set('lensB', state.lensB); set('lighting', state.lighting);
    set('cyl', Math.abs(state.refraction.cylD)); set('axis', state.refraction.axisDeg); set('sphere', state.refraction.sphereD);
    const preset = ['near', 'intermediate', 'distance'].find((k) => Math.abs(DISTANCES[k] - state.distanceM) < 0.005) || '';
    set('preset', preset);
    ref.compare.checked = state.compare;
    ref.lensBField.hidden = !state.compare;
    const sv = distanceToSlider(state.distanceM);
    if (Number(ref.range.value) !== sv && document.activeElement !== ref.range) ref.range.value = String(sv);
    const distText = formatDistance(L, state.distanceM);
    const obj = s.objects[view.subject];
    ref.range.setAttribute('aria-valuetext', `${distText} — ${obj}`);
    ref.rangeOut.textContent = `${distText} · ${obj}`;
    ref.tagA.textContent = s.lenses[state.lens].short;
    ref.tagB.textContent = s.lenses[state.lensB].short;
    ref.tagB.hidden = !state.compare;
    ref.divider.hidden = !state.compare;
    ref.divider.style.left = `${state.split * 100}%`;
    ref.divider.setAttribute('aria-valuenow', String(Math.round(state.split * 100)));
    ref.divider.setAttribute('aria-valuetext', `${s.lenses[state.lens].short} ${fmt(L, Math.round(state.split * 100))}% · ${s.lenses[state.lensB].short} ${fmt(L, 100 - Math.round(state.split * 100))}%`);
    ref.viewport.setAttribute('role', 'img');
    ref.viewport.setAttribute('aria-label', s.viewerLabel(s.lenses[state.lens].name, state.compare ? s.lenses[state.lensB].name : null));
    // lens info cards (neutral)
    const card = (lens, tag) => `<article class="vsim-card"><h3>${tag ? `<span class="vsim-card-tag">${tag}</span>` : ''}${s.lenses[lens].name}</h3>
      <p><b>${s.intended}:</b> ${LENS_INFO[L][lens].intended}</p><p><b>${s.tradeoffs}:</b> ${LENS_INFO[L][lens].tradeoffs}</p></article>`;
    ref.lensInfo.innerHTML = card(state.lens, state.compare ? 'A' : '') + (state.compare ? card(state.lensB, 'B') : '');
    // per-layer sharpness meters + model values
    const row = (band) => {
      const a = view.layers[band], b = viewB ? viewB.layers[band] : null;
      const bar = (layer, tag) => `<span class="vsim-bar" role="img" aria-label="${tag ? `${tag} ` : ''}${s.sharpness} ${fmt(L, layer.sharpness, 2)}"><span style="width:${Math.round(Math.min(1, layer.sharpness) * 100)}%"></span></span><span class="vsim-bar-val" aria-hidden="true">${tag ? `${tag} ` : ''}${fmt(L, layer.sharpness, 2)}</span>`;
      return `<li class="${band === view.subject ? 'is-subject' : ''}"><span class="vsim-meter-label">${s.presets[band]} · ${s.objects[band]} · ${formatDistance(L, a.distanceM)}</span>
        <span class="vsim-meter-bars">${bar(a, b ? 'A' : '')}${b ? bar(b, 'B') : ''}</span></li>`;
    };
    const dl = (v, tag) => `<dl class="vsim-model">${tag ? `<div class="vsim-model-tag">${tag}</div>` : ''}
      <div><dt>${s.pupil}</dt><dd><bdi>${fmt(L, v.pupilMm, 1)} ${s.mm}</bdi></dd></div>
      <div><dt>${s.defocus}</dt><dd><bdi dir="ltr">${fmt(L, v.layers[v.subject].defocusD, 2)} ${s.D}</bdi></dd></div>
      <div><dt>${s.blur}</dt><dd><bdi>${fmt(L, v.layers[v.subject].blurArcmin, 0)} ${s.arcmin}</bdi></dd></div>
      <div><dt>${s.halo}</dt><dd>${fmt(L, v.halo.haloIndex, 2)}</dd></div>
      <div><dt>${s.contrast}</dt><dd>${fmt(L, v.contrast.contrastIndex, 2)}</dd></div></dl>`;
    ref.meters.innerHTML = `<h3 class="vsim-meters-title">${s.sharpness}</h3><ul>${BANDS.map(row).join('')}</ul><p class="vsim-fine">${s.sharpnessNote}</p>
      <details class="vsim-modelbox"><summary>${s.model}</summary>${dl(view, viewB ? 'A' : '')}${viewB ? dl(viewB, 'B') : ''}</details>`;
    const lensesForChart = [...new Set([state.lens, ...(state.compare ? [state.lensB] : []), 'monofocal', 'edof', 'trifocal'])].filter((l) => l !== 'toric');
    const howKey = `${L}|${lensesForChart.join()}|${view.pupilMm}|${state.lens}|${state.lensB}`;
    if (ref.how.dataset.key !== howKey) {
      ref.how.dataset.key = howKey;
      ref.how.innerHTML = `${s.howBody.map((p) => `<p>${p}</p>`).join('')}${curveChart(L, lensesForChart, { pupilMm: view.pupilMm, highlight: [state.lens, state.lensB].filter(Boolean) })}`;
    }
  }

  function announce(text) {
    if (!ref.live) return;
    ref.live.textContent = '';
    // a fresh text node after clearing makes screen readers re-announce identical messages
    ref.live.textContent = text;
  }
  function showNote(key) {
    noteKey = key;
    if (!ref.note) return;
    ref.note.hidden = !key;
    ref.note.textContent = key ? STRINGS[L][key] : '';
  }
  function showFallback(on) {
    fallbackShown = on;
    if (!ref.fallback) return;
    ref.fallback.hidden = !on;
    ref.fallback.innerHTML = on ? fallbackHTML(L) : '';
    root.classList.toggle('vsim--fallback', on);
  }

  return {
    root, ref,
    build,
    update,
    announce,
    showNote,
    showFallback,
    attachCanvas(c) { canvas = c; if (ref.canvasHost) ref.canvasHost.appendChild(c); },
    detachCanvas() { if (canvas) canvas.remove(); canvas = null; },
    setLang(l, state) {
      const active = document.activeElement;
      const key = active && root.contains(active) ? (active.id || active.dataset.ref) : null;
      L = l; build(state);
      if (key) { const el = root.querySelector(`#${CSS.escape(key)}`) || ref[key]; if (el) el.focus({ preventScroll: true }); }
    },
    setTheme(t) { theme = t; root.dataset.theme = t; },
    get lang() { return L; },
    destroy() { root.remove(); },
  };
}
