// Vision simulator — DOM / accessibility layer. Native radio groups (keyboard + screen-reader semantics for
// free), a native range input for distance, a role="slider" divider for the lens comparison, and a polite
// live region. All listeners are delegated to the persistent root so a language re-render keeps them.
//
// Workbench (2026-11 mobile reconstruction): one wrapper holds the picture and the essential controls so they stay on
// screen together: viewer, distance presets attached under it, three lens types, lighting, More settings and Reset.
// More settings (Advanced mode) holds the everyday situations, the other lens types (same radio group), compare, the
// exact distance slider, astigmatism / axis / sphere and the model numbers. Below the workbench: one plain-language
// explanation of the chosen lens; clarity bars, limits, questions and the method are expandable.
// mode 'viewer' renders only the picture (+ disclaimer, comparison divider): used when another module (the
// Vision & Lens Lab) provides its own controls.
import { STRINGS, LENS_INFO, fmt, formatDistance } from './i18n.js';
import { curveChart, fallbackHTML } from './fallback.js';
import { DISTANCES, LENS_IDS, LIGHTING_IDS, SCENARIO_IDS } from './optics/params.js';
import { distanceToSlider, sliderToDistance, scenarioFor } from './optics/model.js';
import { CONTENT as LAB } from '../lens-lab/content.js';

let instance = 0;
const BANDS = ['distance', 'intermediate', 'near'];
const PRIMARY_LENSES = ['monofocal', 'edof', 'trifocal'];
const OTHER_LENSES = LENS_IDS.filter((l) => !PRIMARY_LENSES.includes(l));
const LAB_LENSES = ['monofocal', 'toric', 'edof', 'multifocal', 'trifocal'];
const SCENARIO_ROW = { signs: 'distance', laptop: 'intermediate', phone: 'near', book: 'near', 'night-driving': 'halos' };

export function createUI(host, { lang, theme, listen, handlers, mode = 'full' }) {
  const n = ++instance;
  const viewerOnly = mode === 'viewer';
  const root = document.createElement('section');
  root.className = `vsim${viewerOnly ? ' vsim--viewer' : ''}`;
  root.dataset.vsimInstance = String(n);
  host.appendChild(root);
  let L = lang, canvas = null, fallbackShown = false, fallbackRetry = false, noteKey = null, expanded = false, more = false, loading = false, targetBox = null;
  const ref = {};

  const radios = (name, values, labelFn, checked, cls = '') => values.map((v) => {
    const id = `vsim${n}-${name}-${String(v).replace(/[^a-z0-9-]/gi, '_')}`;
    return `<input class="vsim-radio" type="radio" name="vsim${n}-${name}" id="${id}" value="${v}" data-group="${name}" ${String(v) === String(checked) ? 'checked' : ''}><label for="${id}" class="vsim-seg-btn ${cls}">${labelFn(v)}</label>`;
  }).join('');
  const step = (k) => `<span class="vsim-step" aria-hidden="true">${fmt(L, k)}</span>`;

  function stageHTML(s) {
    const notice = `<p class="vsim-disclaimer" data-ref="disclaimer"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>${s.disclaimer}</span></p>`;
    return `
  <div class="vsim-stage" data-ref="stage">
    ${viewerOnly ? '' : notice}
    <div class="vsim-viewport" dir="ltr" data-ref="viewport">
      <div class="vsim-canvas-host" data-ref="canvasHost"></div>
      ${viewerOnly ? '' : '<span class="vsim-target" data-ref="target" aria-hidden="true" hidden></span>'}
      <span class="vsim-tag vsim-tag-a" data-ref="tagA" dir="${root.dir}"></span>
      <span class="vsim-tag vsim-tag-b" data-ref="tagB" dir="${root.dir}" hidden></span>
      ${viewerOnly ? '' : `<span class="vsim-caption" data-ref="caption" dir="${root.dir}"></span><p class="vsim-loading" data-ref="loading" role="status" dir="${root.dir}" hidden></p>`}
      <div class="vsim-divider" data-ref="divider" role="slider" tabindex="0" aria-label="${s.divider}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-orientation="horizontal" hidden><span class="vsim-divider-line"></span><span class="vsim-divider-knob" aria-hidden="true"></span></div>
      <button type="button" class="vsim-expand" data-ref="expand" aria-pressed="false" aria-label="${s.enlarge}" title="${s.enlarge}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path data-ref="expandIcon" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <p class="vsim-note" data-ref="note" role="status" hidden></p>
      <p class="vsim-rotate" dir="${root.dir}">${s.rotateHint}</p>
      <div class="vsim-fallback" data-ref="fallback" dir="${root.dir}" hidden></div>
    </div>
    ${viewerOnly ? notice : ''}
  </div>`;
  }

  function build(state) {
    const s = STRINGS[L];
    const lab = LAB[L];
    root.lang = L;
    root.dir = L === 'ar' ? 'rtl' : 'ltr';
    root.dataset.theme = theme;
    root.setAttribute('aria-label', s.region);
    if (viewerOnly) {
      root.innerHTML = `${stageHTML(s)}<p class="vsim-sr" data-ref="live" aria-live="polite" aria-atomic="true"></p>`;
    } else {
      const presetLabel = (k) => `<span class="vsim-seg-main">${s.presets[k]}</span><span class="vsim-seg-sub">${s.presetDist[k]}</span>`;
      const scnLabel = (k) => `<span class="vsim-seg-main">${lab.scenarios[k].label}</span><span class="vsim-seg-sub">${lab.scenarios[k].sub}</span>`;
      const lensLabel = (k) => `<span class="vsim-seg-main">${s.lenses[k].short}</span>`;
      // "Extended range" with the abbreviation directly under it: the plain words explain EDOF where it first appears
      const primaryLabel = (k) => (k === 'edof' ? `<span class="vsim-seg-main">${s.edofPlain}</span><span class="vsim-seg-sub" lang="en" dir="ltr">EDOF</span>` : lensLabel(k));
      const scenario = scenarioFor(state.distanceM, state.lighting) || '';
      root.innerHTML = `
  <div class="vsim-bench" data-ref="bench">
    <div class="vsim-bench-view">
      ${stageHTML(s)}
      <fieldset class="vsim-field vsim-field-presets" data-ref="presets">
        <legend class="vsim-legend-title">${s.distance}</legend>
        <div class="vsim-seg vsim-seg-3">${radios('preset', ['near', 'intermediate', 'distance'], presetLabel, '')}</div>
      </fieldset>
    </div>
    <div class="vsim-bench-side">
      <div class="vsim-bench-controls" data-ref="benchControls">
        <fieldset class="vsim-field vsim-field-lens">
          <legend class="vsim-legend-title">${s.lens}</legend>
          <div class="vsim-seg vsim-seg-3" data-ref="lensA">${radios('lensA', PRIMARY_LENSES, primaryLabel, state.lens)}</div>
        </fieldset>
        <fieldset class="vsim-field vsim-field-light">
          <legend class="vsim-legend-title">${s.lighting}</legend>
          <div class="vsim-seg vsim-seg-3">${radios('lighting', LIGHTING_IDS, (k) => `<span class="vsim-seg-main">${s.lights[k]}</span>`, state.lighting)}</div>
        </fieldset>
        <div class="vsim-bench-actions">
          <button type="button" class="vsim-action vsim-more" data-ref="more" aria-expanded="${more ? 'true' : 'false'}" aria-controls="vsim${n}-adv"><span>${s.more}</span><span class="vsim-more-now" data-ref="moreNow" hidden></span><svg class="vsim-more-chev" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button type="button" class="vsim-action vsim-reset" data-ref="reset">${s.reset}</button>
        </div>
      </div>
      <div class="vsim-adv" id="vsim${n}-adv" data-ref="adv" ${more ? '' : 'hidden'}>
        <fieldset class="vsim-field vsim-field-otherlens">
          <legend class="vsim-legend-title">${s.otherLenses}</legend>
          <div class="vsim-seg vsim-seg-3">${radios('lensA', OTHER_LENSES, lensLabel, state.lens)}</div>
        </fieldset>
        <fieldset class="vsim-field vsim-field-scenario">
          <legend class="vsim-legend-title">${s.scenario}</legend>
          <div class="vsim-seg vsim-seg-scn">${radios('scenario', SCENARIO_IDS, scnLabel, scenario)}</div>
          <p class="vsim-custom" data-ref="custom" hidden>${s.customView}</p>
        </fieldset>
        <div class="vsim-field vsim-field-compare">
          <label class="vsim-switch"><input type="checkbox" data-ref="compare" ${state.compare ? 'checked' : ''}><span class="vsim-switch-track" aria-hidden="true"></span><span>${s.compare}</span></label>
          <fieldset class="vsim-field" data-ref="lensBField" ${state.compare ? '' : 'hidden'}>
            <legend class="vsim-legend-title">${s.compareWith}</legend>
            <div class="vsim-seg vsim-seg-lens" data-ref="lensB">${radios('lensB', LENS_IDS, lensLabel, state.lensB)}</div>
          </fieldset>
        </div>
        <div class="vsim-field-sub vsim-range-field">
          <p class="vsim-legend-title">${s.exactDistance}</p>
          <div class="vsim-range-row">
            <input type="range" class="vsim-range" data-ref="range" min="0" max="1000" step="1" value="${distanceToSlider(state.distanceM)}" aria-label="${s.distance}">
            <output class="vsim-range-out" data-ref="rangeOut" aria-hidden="true"></output>
          </div>
        </div>
        <p class="vsim-fine">${s.eye}</p>
        <fieldset class="vsim-field-sub"><legend class="vsim-legend-title">${s.astig}</legend>
          <div class="vsim-seg vsim-seg-3">${radios('cyl', [0, 1, 2], (v) => (v ? `${fmt(L, v, 1)} ${s.D}` : s.none), Math.abs(state.refraction.cylD))}</div></fieldset>
        <fieldset class="vsim-field-sub"><legend class="vsim-legend-title">${s.axis}</legend>
          <div class="vsim-seg vsim-seg-2">${radios('axis', [180, 90], (v) => `${fmt(L, v)}°`, state.refraction.axisDeg)}</div></fieldset>
        <fieldset class="vsim-field-sub"><legend class="vsim-legend-title">${s.sphere}</legend>
          <div class="vsim-seg vsim-seg-3">${radios('sphere', [-1, 0, 1], (v) => (v ? `<bdi dir="ltr">${v > 0 ? '+' : '−'}${fmt(L, Math.abs(v), 2)}</bdi> ${s.D}` : s.none), state.refraction.sphereD)}</div></fieldset>
        <div class="vsim-modelbox" data-ref="model"></div>
      </div>
    </div>
  </div>
  <section class="vsim-explain" aria-labelledby="vsim${n}-seeing">
    <h3 id="vsim${n}-seeing">${s.seeing}</h3>
    <p class="vsim-seeing" data-ref="seeing"></p>
    <div class="vsim-lensinfo" data-ref="lensInfo"></div>
    <p class="vsim-exam">${s.exam}</p>
  </section>
  <div class="vsim-help">
    <details class="vsim-clarity" data-ref="clarityBox">
      <summary>${s.clarity}</summary>
      <div class="vsim-meters" data-ref="meters"></div>
    </details>
    <details class="vsim-limits" data-ref="limits">
      <summary>${s.limitsTitle}</summary>
      <ul>${lab.limits.map((x) => `<li>${x}</li>`).join('')}</ul>
    </details>
    <details class="vsim-questions" data-ref="qbox">
      <summary>${s.questionsTitle}</summary>
      <ul data-ref="questions"></ul>
    </details>
    <details class="vsim-how" data-ref="howBox"><summary>${s.how}</summary><div data-ref="how"></div></details>
  </div>
  <p class="vsim-sr" data-ref="live" aria-live="polite" aria-atomic="true"></p>`;
    }
    for (const k of Object.keys(ref)) delete ref[k];
    root.querySelectorAll('[data-ref]').forEach((el) => { ref[el.dataset.ref] = el; });
    if (canvas) ref.canvasHost.appendChild(canvas);
    if (fallbackShown) showFallback(true);
    if (noteKey) showNote(noteKey);
    if (loading) showLoading(true);
    if (targetBox) setTarget(targetBox);
    applyExpanded();
    applyMore();
  }

  // ---------- Simple / Advanced ----------
  function applyMore() {
    root.dataset.mode = more ? 'advanced' : 'simple';
    if (!ref.adv) return;
    ref.adv.hidden = !more;
    ref.more.setAttribute('aria-expanded', more ? 'true' : 'false');
  }
  function setMore(on) {
    more = !!on;
    applyMore();
    measureBench();
    if (handlers.more) handlers.more(more);
  }

  // ---------- workbench fit (phones) ----------
  // The viewer takes the height the controls leave between the site header and the booking bar. Heights are measured
  // so that translated labels and enlarged text keep working; the viewer only sticks when the controls do not fit
  // with it, or while More settings is open (see the workbench rules in styles.css).
  function measureBench() {
    if (!ref.bench || fallbackShown) return;
    const height = (el) => (el ? el.getBoundingClientRect().height : 0);
    const setVar = (name, v) => { const px = `${Math.ceil(v)}px`; if (ref.bench.style.getPropertyValue(name) !== px) ref.bench.style.setProperty(name, px); };
    const stage = height(ref.stage), presets = height(ref.presets), side = height(ref.benchControls);
    setVar('--vsim-strip-h', height(ref.disclaimer));
    setVar('--vsim-presets-h', presets);
    setVar('--vsim-side-h', side);
    setVar('--vsim-stage-h', stage);
    const cs = getComputedStyle(ref.bench);
    const px = (name) => parseFloat(cs.getPropertyValue(name)) || 0;
    const room = window.innerHeight - px('--vsim-chrome-top') - px('--vsim-chrome-bottom');
    const fits = stage + presets + side <= room + 0.5;
    // only the stacked layout sticks the picture alone; the two-column layout keeps its whole left column in place
    const stacked = getComputedStyle(ref.stage.parentElement).display === 'contents';
    if (stacked && (more || !fits)) ref.bench.dataset.sticky = ''; else delete ref.bench.dataset.sticky;
  }

  // ---------- expanded (large) view ----------
  function applyExpanded() {
    root.classList.toggle('vsim--expanded', expanded);
    if (!ref.expand) return;
    const s = STRINGS[L];
    ref.expand.setAttribute('aria-pressed', expanded ? 'true' : 'false');
    ref.expand.setAttribute('aria-label', expanded ? s.shrink : s.enlarge);
    ref.expand.title = expanded ? s.shrink : s.enlarge;
    if (ref.expandIcon) ref.expandIcon.setAttribute('d', expanded ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5');
  }
  // Real full screen where the browser allows it (escapes any transformed host ancestor); otherwise a fixed overlay.
  function setExpanded(on) {
    if (expanded === on) return;
    expanded = on;
    applyExpanded();
    const fsEl = document.fullscreenElement;
    if (on && ref.stage && ref.stage.requestFullscreen && !fsEl) {
      try { const p = ref.stage.requestFullscreen({ navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* overlay only */ }
    } else if (!on && fsEl && root.contains(fsEl) && document.exitFullscreen) {
      try { const p = document.exitFullscreen(); if (p && p.catch) p.catch(() => {}); } catch { /* ignore */ }
    }
    if (ref.expand) ref.expand.focus({ preventScroll: true });
    if (handlers.expand) handlers.expand(on);
  }
  // leaving browser full screen (Esc / back gesture) also closes the enlarged view
  listen(document, 'fullscreenchange', () => { if (expanded && !document.fullscreenElement) setExpanded(false); });

  // ---------- delegated listeners ----------
  listen(root, 'change', (e) => {
    const t = e.target;
    if (t.dataset.group === 'lensA') handlers.lens(t.value);
    else if (t.dataset.group === 'lensB') handlers.lensB(t.value);
    else if (t.dataset.group === 'scenario') handlers.scenario(t.value);
    else if (t.dataset.group === 'preset') handlers.distance(DISTANCES[t.value], 'preset');
    else if (t.dataset.group === 'lighting') handlers.lighting(t.value);
    else if (t.dataset.group === 'cyl') handlers.refraction({ cylD: -Number(t.value) });
    else if (t.dataset.group === 'axis') handlers.refraction({ axisDeg: Number(t.value) });
    else if (t.dataset.group === 'sphere') handlers.refraction({ sphereD: Number(t.value) });
    else if (t === ref.compare) handlers.compare(t.checked);
    else if (t === ref.range) handlers.distance(sliderToDistance(Number(t.value)), 'slider-commit');
  });
  listen(root, 'input', (e) => { if (e.target === ref.range) handlers.distance(sliderToDistance(Number(e.target.value)), 'slider'); });
  listen(root, 'click', (e) => {
    if (ref.expand && e.target.closest('.vsim-expand')) setExpanded(!expanded);
    else if (ref.more && e.target.closest('.vsim-more')) setMore(!more);
    else if (ref.reset && e.target.closest('.vsim-reset')) handlers.reset();
    else if (e.target.closest('[data-vsim-reload]')) handlers.retry();
  });
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
    if (e.key === 'Escape' && expanded) { e.preventDefault(); setExpanded(false); return; }
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

  const seeingText = (state, s) => {
    const lab = LAB[L];
    const scn = scenarioFor(state.distanceM, state.lighting);
    const parts = [];
    if (scn) parts.push(lab.scenarios[scn].detail);
    const words = (lens) => {
      if (lens === 'cataract') return s.catSeeing;
      if (!LAB_LENSES.includes(lens)) return '';
      const row = scn ? SCENARIO_ROW[scn] : (state.distanceM < 0.52 ? 'near' : state.distanceM < 1.6 ? 'intermediate' : 'distance');
      return `${s.lenses[lens].short}: ${lab.dims[row].label} — ${lab.lenses[lens].levels[row]}.`;
    };
    parts.push(words(state.lens));
    if (state.compare && state.lensB !== state.lens) parts.push(words(state.lensB));
    return parts.filter(Boolean).join(' ');
  };

  function update(state, view, viewB) {
    const s = STRINGS[L];
    const set = (group, value) => root.querySelectorAll(`input[data-group="${group}"]`).forEach((r) => { r.checked = String(r.value) === String(value); });
    const distText = formatDistance(L, state.distanceM);
    const obj = s.objects[view.subject];
    ref.tagA.textContent = s.lenses[state.lens].short;
    ref.tagB.textContent = s.lenses[state.lensB].short;
    ref.tagB.hidden = !state.compare;
    ref.divider.hidden = !state.compare;
    ref.divider.style.left = `${state.split * 100}%`;
    ref.divider.setAttribute('aria-valuenow', String(Math.round(state.split * 100)));
    ref.divider.setAttribute('aria-valuetext', `${s.lenses[state.lens].short} ${fmt(L, Math.round(state.split * 100))}% · ${s.lenses[state.lensB].short} ${fmt(L, 100 - Math.round(state.split * 100))}%`);
    // role="img" sits on the picture layer, not on the viewport: the viewport also holds the comparison divider and
    // the enlarge button, and interactive controls must not be nested inside an image (axe nested-interactive).
    ref.canvasHost.setAttribute('role', 'img');
    ref.canvasHost.setAttribute('aria-label', `${s.viewerLabel(s.lenses[state.lens].name, state.compare ? s.lenses[state.lensB].name : null)}. ${distText} · ${obj}. ${s.lights[state.lighting]}.`);
    if (viewerOnly) return;
    ref.caption.textContent = `${distText} · ${obj} · ${s.lights[state.lighting]}`;
    ref.moreNow.hidden = PRIMARY_LENSES.includes(state.lens);
    ref.moreNow.textContent = ref.moreNow.hidden ? '' : s.lenses[state.lens].short;

    const scn = scenarioFor(state.distanceM, state.lighting);
    set('scenario', scn || '');
    ref.custom.hidden = !!scn;
    set('lensA', state.lens); set('lensB', state.lensB); set('lighting', state.lighting);
    set('cyl', Math.abs(state.refraction.cylD)); set('axis', state.refraction.axisDeg); set('sphere', state.refraction.sphereD);
    const preset = ['near', 'intermediate', 'distance'].find((k) => Math.abs(DISTANCES[k] - state.distanceM) < 0.005) || '';
    set('preset', preset);
    ref.compare.checked = state.compare;
    ref.lensBField.hidden = !state.compare;
    const sv = distanceToSlider(state.distanceM);
    if (Number(ref.range.value) !== sv && document.activeElement !== ref.range) ref.range.value = String(sv);
    ref.range.setAttribute('aria-valuetext', `${distText} — ${obj}`);
    ref.rangeOut.textContent = `${distText} · ${obj}`;
    ref.seeing.textContent = seeingText(state, s);
    // lens info cards (neutral)
    const card = (lens, tag) => `<article class="vsim-card"><h3>${tag ? `<span class="vsim-card-tag">${tag}</span>` : ''}${s.lenses[lens].name}</h3>
      <p>${LENS_INFO[L][lens].intended} ${LENS_INFO[L][lens].tradeoffs}</p></article>`;
    ref.lensInfo.innerHTML = card(state.lens, state.compare ? 'A' : '') + (state.compare ? card(state.lensB, 'B') : '');
    // relative clarity bars per distance (no numbers on screen; the value is in the bar's accessible name)
    const row = (band) => {
      const a = view.layers[band], b = viewB ? viewB.layers[band] : null;
      const bar = (layer, tag) => `<span class="vsim-bar" role="img" aria-label="${tag ? `${tag} ` : ''}${s.sharpness} ${fmt(L, layer.sharpness, 2)}"><span style="width:${Math.round(Math.min(1, layer.sharpness) * 100)}%"></span></span><span class="vsim-bar-val" aria-hidden="true">${tag}</span>`;
      return `<li class="${band === view.subject ? 'is-subject' : ''}"><span class="vsim-meter-label">${s.presets[band]} · ${s.objects[band]} · ${formatDistance(L, a.distanceM)}</span>
        <span class="vsim-meter-bars${b ? ' is-pair' : ''}">${bar(a, b ? 'A' : '')}${b ? bar(b, 'B') : ''}</span></li>`;
    };
    ref.meters.innerHTML = `<ul>${BANDS.map(row).join('')}</ul><p class="vsim-fine">${s.clarityNote}</p>`;
    // questions for your doctor (from the lens-lab content: one source of truth)
    const lab = LAB[L];
    const qs = [...new Set([state.lens, ...(state.compare ? [state.lensB] : [])].flatMap((l) => (LAB_LENSES.includes(l) ? lab.lenses[l].ask : [])).concat(lab.generalQuestions.slice(0, 2)))];
    ref.questions.innerHTML = qs.map((q) => `<li>${q}</li>`).join('');
    // model values (Advanced)
    const dl = (v, tag) => `<dl class="vsim-model">${tag ? `<div class="vsim-model-tag">${tag}</div>` : ''}
      <div><dt>${s.pupil}</dt><dd><bdi>${fmt(L, v.pupilMm, 1)} ${s.mm}</bdi></dd></div>
      <div><dt>${s.defocus}</dt><dd><bdi dir="ltr">${fmt(L, v.layers[v.subject].defocusD, 2)} ${s.D}</bdi></dd></div>
      <div><dt>${s.blur}</dt><dd><bdi>${fmt(L, v.layers[v.subject].blurArcmin, 0)} ${s.arcmin}</bdi></dd></div>
      <div><dt>${s.sharpness}</dt><dd>${fmt(L, v.layers[v.subject].sharpness, 2)}</dd></div>
      <div><dt>${s.halo}</dt><dd>${fmt(L, v.halo.haloIndex, 2)}</dd></div>
      <div><dt>${s.contrast}</dt><dd>${fmt(L, v.contrast.contrastIndex, 2)}</dd></div></dl>`;
    ref.model.innerHTML = `<p class="vsim-legend-title">${s.model}</p>${dl(view, viewB ? 'A' : '')}${viewB ? dl(viewB, 'B') : ''}<p class="vsim-fine">${s.sharpnessNote}</p>`;
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
  // All three distances are always drawn at once, so choosing Near / Intermediate / Far does not alter the rendered
  // image; this frame shows which object the eye is looking at. It is a page element over the picture: it is not part
  // of the simulated image and never reaches the review screenshots or the model.
  function setTarget(box) {
    targetBox = box;
    if (!ref.target) return;
    ref.target.hidden = !box;
    if (!box) return;
    Object.assign(ref.target.style, { left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` });
  }
  function showLoading(on) {
    loading = on;
    if (!ref.loading) return;
    ref.loading.hidden = !on;
    ref.loading.textContent = on ? STRINGS[L].loading : '';
  }
  function showFallback(on, retry = fallbackRetry) {
    fallbackShown = on;
    fallbackRetry = on && retry;
    if (!ref.fallback) return;
    ref.fallback.hidden = !on;
    ref.fallback.innerHTML = on ? `${fallbackHTML(L)}${fallbackRetry ? `<button type="button" class="vsim-action" data-vsim-reload>${STRINGS[L].retry}</button>` : ''}` : '';
    root.classList.toggle('vsim--fallback', on);
    if (on && expanded) setExpanded(false);
  }

  return {
    root, ref,
    build,
    update,
    announce,
    showNote,
    showFallback,
    showLoading,
    setTarget,
    measureBench,
    setExpanded,
    setMore,
    get expanded() { return expanded; },
    get more() { return more; },
    attachCanvas(c) { canvas = c; if (ref.canvasHost) ref.canvasHost.appendChild(c); },
    detachCanvas() { if (canvas) canvas.remove(); canvas = null; },
    setLang(l, state) {
      const active = document.activeElement;
      const key = active && root.contains(active) ? (active.id || active.dataset.ref) : null;
      const open = ['clarityBox', 'limits', 'qbox', 'howBox'].filter((k) => ref[k] && ref[k].open);
      L = l; build(state);
      for (const k of open) if (ref[k]) ref[k].open = true;
      if (key) { const el = root.querySelector(`#${CSS.escape(key)}`) || ref[key]; if (el) el.focus({ preventScroll: true }); }
    },
    setTheme(t) { theme = t; root.dataset.theme = t; },
    get lang() { return L; },
    destroy() { root.remove(); },
  };
}
