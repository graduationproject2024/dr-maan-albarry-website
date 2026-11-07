// Vision simulator — clinical review PRESETS and the model inventory shown in review mode.
// Pure data + functions (no DOM, no three.js): importable from Node for tests.
//
// A preset is a named, reproducible configuration: applying it sets exactly these parameters (lens A, lens B,
// comparison on/off, viewing distance, lighting, residual refraction, comparison split). Every number shown in
// review mode is READ from the optics code (params.js / model.js) — nothing here restates or changes a model value.
// The pipeline calibration constants (RENDER_CALIBRATION) are copied from pipeline.js with the exact source
// expression; tests/vision-review.spec.js checks each expression is still present there.
import {
  VISION_MODEL_VERSION, BOUNDS, DISTANCES, BANDS, PUPIL_BY_LIGHTING, LIGHTING_GRADE, VIEWING, LENSES, LENS_IDS, LIGHTING_IDS,
  SCENARIOS, SCENARIO_IDS, REFERENCES
} from './optics/params.js';
import { computeView, haloGlare, normalizeRefraction } from './optics/model.js';
import { STRINGS, LENS_INFO } from './i18n.js';
import { CONTENT as LAB } from '../lens-lab/content.js';
import { contentHash } from '../sim-review/core.js';

export { VISION_MODEL_VERSION };

const NO_RX = Object.freeze({ sphereD: 0, cylD: 0, axisDeg: 180 });
const DEFAULT_LENS_B = 'trifocal'; // the simulator's own default for lens B (index.js)

function P(lens, distanceM, lighting, { lensB = DEFAULT_LENS_B, compare = false, refraction = NO_RX } = {}) {
  return Object.freeze({ lens, lensB, compare, distanceM, lighting, refraction: Object.freeze(normalizeRefraction(refraction)), split: 0.5 });
}
const lensName = (lang, id) => STRINGS[lang].lenses[id].name;
const scnLabel = (lang, id) => LAB[lang].scenarios[id].label;
const rxText = (lang, r) => {
  const parts = [];
  if (r.sphereD) parts.push(`${r.sphereD > 0 ? '+' : '−'}${Math.abs(r.sphereD).toFixed(2)} ${STRINGS[lang].D}`);
  if (r.cylD) parts.push(`${r.cylD.toFixed(2).replace('-', '−')} ${STRINGS[lang].D} × ${r.axisDeg}°`);
  return parts.join(' ');
};

// Open questions from docs/phase-1/VISION_SIMULATOR_AUDIT.md §6 that each kind of preset helps answer.
const Q_FOR_SCENARIO = { signs: ['Q1'], laptop: ['Q2', 'Q7'], phone: ['Q6', 'Q7'], book: ['Q6', 'Q7'], 'night-driving': ['Q3', 'Q4'] };

function build() {
  const out = [];
  const add = (id, group, label, params, questions = []) => out.push(Object.freeze({ id, group, label: Object.freeze(label), params, questions: Object.freeze(questions) }));
  // 1. every lens profile in every everyday situation (what a patient can select on the public page)
  for (const lens of LENS_IDS) {
    for (const sc of SCENARIO_IDS) {
      const s = SCENARIOS[sc];
      add(`${lens}.${sc}`, 'situation', { en: `${lensName('en', lens)} — ${scnLabel('en', sc)}`, ar: `${lensName('ar', lens)} — ${scnLabel('ar', sc)}` },
        P(lens, s.distanceM, s.lighting), Q_FOR_SCENARIO[sc] || []);
    }
    // dusk lighting has no everyday situation of its own; distance at dusk shows the 4 mm pupil
    add(`${lens}.distance-dusk`, 'lighting', { en: `${lensName('en', lens)} — ${STRINGS.en.presets.distance}, ${STRINGS.en.lights.dusk}`, ar: `${lensName('ar', lens)} — ${STRINGS.ar.presets.distance}، ${STRINGS.ar.lights.dusk}` },
      P(lens, DISTANCES.distance, 'dusk'), ['Q3', 'Q4']);
  }
  // 2. residual refraction / astigmatism (the "Advanced" options of the public page, plus the Lens Lab toric example)
  const rx = (id, lens, d, light, r, q) => {
    const params = P(lens, d, light, { refraction: r });
    add(id, 'refraction', { en: `${lensName('en', lens)} — ${rxText('en', params.refraction)} — ${(d >= 1 ? `${d} m` : `${Math.round(d * 100)} cm`)}`, ar: `${lensName('ar', lens)} — ${rxText('ar', params.refraction)} — ${(d >= 1 ? `${d} م` : `${Math.round(d * 100)} سم`)}` }, params, q);
  };
  rx('monofocal.cyl-1.0x180.signs', 'monofocal', 6, 'day', { cylD: -1, axisDeg: 180 }, ['Q5']);
  rx('monofocal.cyl-2.0x90.signs', 'monofocal', 6, 'day', { cylD: -2, axisDeg: 90 }, ['Q5']);
  rx('monofocal.cyl-1.5x180.signs', 'monofocal', 6, 'day', { cylD: -1.5, axisDeg: 180 }, ['Q5']);
  rx('toric.cyl-1.5x180.signs', 'toric', 6, 'day', { cylD: -1.5, axisDeg: 180 }, ['Q5']);
  rx('monofocal.sph-minus1.laptop', 'monofocal', 0.66, 'day', { sphereD: -1 }, ['Q1']);
  rx('monofocal.sph-plus1.signs', 'monofocal', 6, 'day', { sphereD: 1 }, ['Q1']);
  // 3. side-by-side comparison examples
  const cmp = (a, b, sc, q, refraction = NO_RX) => {
    const s = SCENARIOS[sc];
    const r = normalizeRefraction(refraction);
    const extra = (lang) => (r.cylD ? ` (${rxText(lang, r)})` : '');
    add(`compare.${a}-vs-${b}.${sc}${r.cylD ? `.cyl${Math.abs(r.cylD)}` : ''}`, 'compare',
      { en: `${lensName('en', a)} vs ${lensName('en', b)} — ${scnLabel('en', sc)}${extra('en')}`, ar: `${lensName('ar', a)} مقابل ${lensName('ar', b)} — ${scnLabel('ar', sc)}${extra('ar')}` },
      P(a, s.distanceM, s.lighting, { lensB: b, compare: true, refraction: r }), q);
  };
  cmp('monofocal', 'trifocal', 'night-driving', ['Q3', 'Q4']);
  cmp('monofocal', 'edof', 'laptop', ['Q2']);
  cmp('edof', 'trifocal', 'laptop', ['Q2']);
  cmp('edof', 'trifocal', 'book', ['Q2', 'Q6']);
  cmp('multifocal', 'trifocal', 'laptop', ['Q2', 'Q6']);
  cmp('multifocal', 'trifocal', 'night-driving', ['Q3', 'Q4']);
  cmp('cataract', 'monofocal', 'signs', ['Q4']);
  cmp('cataract', 'monofocal', 'night-driving', ['Q3', 'Q4']);
  cmp('monofocal', 'toric', 'signs', ['Q5'], { cylD: -1.5, axisDeg: 180 });
  return Object.freeze(out);
}
export const PRESETS = build();
export const PRESET_IDS = Object.freeze(PRESETS.map((p) => p.id));
export const presetById = (id) => PRESETS.find((p) => p.id === id) || null;
export const PRESET_GROUPS = Object.freeze(['situation', 'lighting', 'refraction', 'compare']);

/** Does a simulator state (getState()) show exactly this preset's parameters? */
export function stateMatches(params, st) {
  const close = (a, b) => Math.abs(a - b) < 1e-9;
  return st.lens === params.lens && st.compare === params.compare && (!params.compare || st.lensB === params.lensB)
    && close(st.distanceM, params.distanceM) && st.lighting === params.lighting && close(st.split, params.split)
    && close(st.refraction.sphereD, params.refraction.sphereD) && close(st.refraction.cylD, params.refraction.cylD)
    && close(st.refraction.axisDeg, params.refraction.axisDeg);
}

/** The model's output for a preset (A and, when comparing, B) — exactly what the renderer is given. */
export function presetViews(params) {
  const base = { distanceM: params.distanceM, lighting: params.lighting, refraction: params.refraction };
  return { A: computeView({ ...base, lens: params.lens }), B: params.compare ? computeView({ ...base, lens: params.lensB }) : null };
}

/** Patient-facing texts a preset shows (both languages). Used for the content hash and the text gates. */
export function presetTexts(params) {
  const lenses = [...new Set([params.lens, ...(params.compare ? [params.lensB] : [])])];
  const sc = SCENARIO_IDS.find((id) => SCENARIOS[id].lighting === params.lighting && Math.abs(SCENARIOS[id].distanceM - params.distanceM) < 0.005) || null;
  const t = {};
  for (const lang of ['en', 'ar']) {
    const lab = LAB[lang];
    t[lang] = {
      disclaimer: STRINGS[lang].disclaimer,
      lenses: lenses.map((l) => ({ id: l, name: STRINGS[lang].lenses[l].name, info: LENS_INFO[lang][l], levels: lab.lenses[l] ? lab.lenses[l].levels : null })),
      scenario: sc ? lab.scenarios[sc] : null,
      catSeeing: lenses.includes('cataract') ? STRINGS[lang].catSeeing : null,
      how: STRINGS[lang].howBody,
      limits: lab.limits
    };
  }
  return t;
}

/** Content version of a preset: parameters + model output + the texts it shows. Changes when any of them change. */
export function presetContentHash(preset) {
  return contentHash('vp', { id: preset.id, params: preset.params, views: presetViews(preset.params), texts: presetTexts(preset.params) });
}
let hashes = null;
export function presetHashes() {
  if (!hashes) hashes = Object.fromEntries(PRESETS.map((p) => [p.id, presetContentHash(p)]));
  return hashes;
}

/**
 * Rendering calibration used by pipeline.js to DRAW the model (not part of the optics equations).
 * `code` is the exact expression in src/vision-sim/pipeline.js.
 */
export const RENDER_CALIBRATION = Object.freeze([
  { id: 'light-energy', code: 'Lt.intensity * 40 * core * core', en: 'Light-source energy: intensity × 40 × core area (artistic calibration so halos show on an ordinary screen).', ar: 'طاقة مصدر الضوء: الشدة × ٤٠ × مساحة النواة (معايرة فنية لتظهر الهالات على شاشة عادية).' },
  { id: 'halo-disk', code: '(t.weight * E) / (da * dp)', en: 'Halo disk brightness = focus weight × energy ÷ disk area (energy conserved).', ar: 'سطوع قرص الهالة = حصة البؤرة × الطاقة ÷ مساحة القرص (حفظ الطاقة).' },
  { id: 'loss-veil', code: '(layer.loss.fraction * E * 1.3) / (d * d * 0.25)', en: 'Lost-light veil: Gaussian of the lens’s loss spread (×1.6 sprite size) carrying the lost fraction.', ar: 'غشاء الضوء المفقود: توزيع غاوسي بعرض انتشار الفقد للعدسة (×١٫٦ لحجم الرسم) يحمل نسبة الضوء المفقود.' },
  { id: 'glare-size', code: '((9 * Math.PI) / 180) * f', en: 'Glare skirt: 9° wide, 1/θ²-like shape.', ar: 'هالة الوهج: بعرض ٩ درجات وبشكل يقارب 1/θ².' },
  { id: 'glare-gain', code: '0.018 * Lt.intensity * glareGain', en: 'Glare strength: 0.018 × intensity × straylight factor (linear in straylight).', ar: 'شدة الوهج: ٠٫٠١٨ × الشدة × عامل التشتت (خطي مع التشتت).' },
  { id: 'veil-grade', code: '0.05 * (v.halo.straylight - 1)', en: 'Composite veil: 0.05 × (straylight − 1), plus the lighting grading and lens tint.', ar: 'الغشاء في التركيب النهائي: ٠٫٠٥ × (التشتت − ١)، مع تدرّج الإضاءة ولون العدسة.' }
]);

/** Optics equations as implemented in src/vision-sim/optics/model.js (language-neutral notation). */
export const EQUATIONS = Object.freeze([
  { id: 'vergence', f: 'V = 1 / d', fn: 'vergence()' },
  { id: 'defocus', f: 'ΔD = 1/d − (V_focus − S)', fn: 'defocus()' },
  { id: 'blur', f: 'β = P(m) · |ΔD|  (rad), capped at ' + BOUNDS.blurArcminMax + '′', fn: 'blurAngleRad()' },
  { id: 'astig', f: 'meridians ΔD and ΔD + C; elliptical blur on the axis', fn: 'focusTerm()' },
  { id: 'toric', f: 'residual C = 2·|C|·sin δ, axis + 45° + δ/2', fn: 'residualCylinder()' },
  { id: 'sigma', f: 'σ = b · ' + VIEWING.diskToGaussianSigma + ' ; f_px = (H/2) / tan(vFov/2), vFov = ' + VIEWING.vFovDeg + '°', fn: 'sigmaPx(), focalPx()' },
  { id: 'sharpness', f: 'Q = Σ wᵢ · exp(−2π²σ²f²), f = ' + VIEWING.referenceCyclesPerDeg + ' c/deg (orientation-averaged)', fn: 'termTransfer(), layerOptics()' },
  { id: 'halo', f: 'halo disk diameter = P · |Vᵢ − V₀|, energy wᵢ; haloIndex normalised to the strongest lens at ' + BOUNDS.pupilMm[1] + ' mm', fn: 'haloGlare()' },
  { id: 'glare', f: 'glareIndex = (s − 1)/2 + loss · P/' + BOUNDS.pupilMm[1], fn: 'haloGlare()' },
  { id: 'contrast', f: 'contrastIndex = max(wᵢ) · 1/(1 + 0.25(s − 1)) · (1 − lightingLoss)', fn: 'contrast()' }
]);

/** Live model inventory (all values read from params.js / model.js at run time). */
export function modelInventory() {
  return {
    modelVersion: VISION_MODEL_VERSION,
    bounds: BOUNDS, distances: DISTANCES, bands: BANDS, pupilByLighting: PUPIL_BY_LIGHTING, lightingGrade: LIGHTING_GRADE,
    viewing: VIEWING, lenses: LENSES, scenarios: SCENARIOS, references: REFERENCES, equations: EQUATIONS, renderCalibration: RENDER_CALIBRATION,
    haloByLighting: Object.fromEntries(LENS_IDS.map((l) => [l, Object.fromEntries(LIGHTING_IDS.map((li) => {
      const h = haloGlare({ lens: l, lighting: li });
      return [li, { pupilMm: h.pupilMm, haloIndex: h.haloIndex, glareIndex: h.glareIndex, halos: h.halos }];
    }))]))
  };
}
