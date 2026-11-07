// Vision simulator — clinical review mode (doctor workflow). Enabled only by mount(host, { review: true }) or the
// internal harness vision-sim-preview.html?review=1; never shown on public pages. Lazy chunk.
//
// The reviewer walks through reproducible PRESETS (review-presets.js), each of which sets the simulator's exact
// parameters, and records per preset: separate gates (optical model, visual representation, Arabic text,
// English text, final physician approval), notes, issues tied to the preset + the exact parameters on screen,
// and screenshot references. Everything is saved in this browser (localStorage) and exported / imported as JSON.
//
// Every gate starts "Pending review" and only changes by the reviewer's own action. Final approval is blocked
// while any other gate is pending, rejected or recorded for an older model version / preset content. Each gate
// stores VISION_MODEL_VERSION and the preset's content hash; when either changes the preset is flagged for
// re-review and the earlier record is kept. None of this is an official approval: that is only a signed entry by
// the physician in docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md.
import '../sim-review/styles.css';
import {
  CLINICAL_STATES, NOT_OFFICIAL_APPROVAL, emptyGate, normaliseGate, normaliseHistory, staleInfo, finalGuard, setGate,
  isApproving, esc, str, download, downloadJSON, renderPreservingFocus, gateFieldset
} from '../sim-review/core.js';
import {
  VISION_MODEL_VERSION, PRESETS, PRESET_IDS, PRESET_GROUPS, presetById, presetHashes, presetViews, presetTexts, stateMatches,
  modelInventory, RENDER_CALIBRATION, EQUATIONS
} from './review-presets.js';
import { LENS_IDS, LIGHTING_IDS, PUPIL_BY_LIGHTING, SCENARIOS, SCENARIO_IDS } from './optics/params.js';
import { normalizeRefraction } from './optics/model.js';
import { STRINGS, LENS_INFO } from './i18n.js';
import { CONTENT as LAB } from '../lens-lab/content.js';

export const VREVIEW_STORAGE_KEY = 'vsim-clinical-review';
export const VREVIEW_FORMAT = 'vsim-clinical-review';
export const VREVIEW_FORMAT_VERSION = 1;
export const VGATES = Object.freeze([
  { id: 'opticalModelReview', clinical: true },
  { id: 'visualRepresentationReview', clinical: true },
  { id: 'textReviewAr', clinical: true },
  { id: 'textReviewEn', clinical: true },
  { id: 'finalPhysicianApproval', final: true }
]);
export const VGATE_IDS = VGATES.map((g) => g.id);
const CLINICAL = VGATES.filter((g) => g.clinical).map((g) => g.id);
const statesFor = () => CLINICAL_STATES;
const currentFor = (id) => ({ modelVersion: VISION_MODEL_VERSION, contentHash: presetHashes()[id] || null });
const ID_RE = /^[a-z0-9][a-z0-9.+-]{0,99}$/i;

const T = {
  en: {
    title: 'Clinical review mode — vision simulator',
    intro: 'For physician review. Gates, notes and issues are saved in this browser only until exported.',
    notOfficial: 'Working notes only — not an official approval. Official approval is only a signed entry by the physician in CLINICAL_APPROVAL_STATUS.md.',
    model: 'Model version', preset: 'Preset', prev: 'Previous preset', next: 'Next preset', apply: 'Apply preset again',
    situation: 'Everyday situations (each lens)', lighting: 'Lighting', refraction: 'Refraction and astigmatism', compare: 'Comparison examples',
    matchYes: 'The view shows exactly this preset.', matchNo: 'The view differs from this preset (changed after applying). Apply it again to reproduce it.',
    parameter: 'Parameter', presetValue: 'Preset', currentValue: 'Current view',
    lens: 'Lens (A)', lensB: 'Lens B', compareOn: 'Comparison', distanceM: 'Viewing distance (m)', lightingP: 'Lighting', pupil: 'Pupil (mm, from lighting)',
    sphere: 'Residual sphere (D)', cyl: 'Cylinder (D)', axis: 'Axis (°)', split: 'Comparison split', yes: 'on', no: 'off',
    outputs: 'Model output for this preset', layer: 'Layer', defocus: 'Defocus (D)', blur: 'Blur (arcmin)', sharp: 'Sharpness index',
    haloIndex: 'Halo index', glareIndex: 'Glare index', contrastIndex: 'Contrast index', haloDisks: 'Halo disks (diameter′ × share)', straylight: 'Straylight factor',
    near: 'near', intermediate: 'intermediate', distance: 'distance',
    screenshot: 'Save screenshot', status: 'Review gates for this preset',
    pending: 'Pending review', approved: 'Approved', 'approved-with-corrections': 'Approved with corrections', rejected: 'Rejected',
    opticalModelReview: 'Optical model review', visualRepresentationReview: 'Visual representation review',
    textReviewAr: 'Arabic text review', textReviewEn: 'English text review', finalPhysicianApproval: 'Final physician approval',
    finalBlocked: 'Final approval cannot be chosen yet:', whyPending: '{g} is still pending', whyRejected: '{g} is rejected',
    whyStale: '{g} was recorded for an earlier version ({v}) and needs re-review',
    finalInconsistent: 'Final approval is recorded, but its conditions are no longer met. Please reconsider it.',
    reReview: 'Needs re-review (changed since {v})', reReviewBody: 'The model or this preset’s output or text changed after these gates were set: {g}. The earlier records are kept below and in the export.',
    presetVersion: 'Preset content version', recordedFor: 'recorded for {v} · {h}', setAt: 'set in this browser at {t}',
    history: 'Earlier gate records (kept as evidence)', notes: 'Notes for this preset', issuePlaceholder: 'Describe the issue',
    addIssue: 'Add issue with the current parameters', issues: 'Issues', remove: 'Remove', screenshots: 'Screenshots taken for this preset',
    custom: 'custom (differs from preset)', export: 'Export JSON', import: 'Import JSON',
    imported: 'Imported.', importedOther: 'Imported a review made for model version {v} (current: {c}). Presets changed since then are flagged for re-review.',
    importError: 'Could not import: not a vision-simulator review file.', blockedMsg: 'Final approval is blocked — see the reasons below.',
    sr: 'Gate updated: {g} — {s}.', reconfirm: 'Confirm “{s}” again for the current version', applied: 'Preset applied: {p}.', questions: 'Related open questions (VISION_SIMULATOR_AUDIT.md §6)',
    progress: 'Review progress — all presets', needs: 'needs re-review', retired: 'Records for presets that no longer exist (kept)',
    refConditions: 'Vision conditions and lens profiles', refDistance: 'Distance settings', refLighting: 'Lighting settings',
    refHalo: 'Halo and glare representation', refAssumptions: 'Optical assumptions, equations and parameter bounds',
    refCompare: 'Comparison examples', refLimits: 'Model limitations', refTexts: 'Explanation texts (Arabic and English)', refRefs: 'Source types used by the model',
    readFrom: 'All values below are read from the code at run time ({f}); nothing is restated by hand.',
    id: 'Id', name: 'Name', foci: 'Foci (vergence D × share of light)', loss: 'Lost light', lossSpread: 'Loss spread (°)', corrects: 'Corrects cylinder', tint: 'Tint',
    key: 'Setting', value: 'Value', scenario: 'Situation', grade: 'Grading (desaturate / contrast loss)', formula: 'As implemented', fn: 'Function',
    calib: 'Rendering calibration (pipeline.js)', code: 'Expression in code', meaning: 'Meaning', equations: 'Equations (optics/model.js)', bounds: 'Parameter bounds (BOUNDS)', viewing: 'Viewing geometry (VIEWING)',
    bands: 'Distance bands (BANDS)', distances: 'Distance presets (DISTANCES)', scenarios: 'Everyday situations (SCENARIOS)',
    assumptions: 'Stated assumptions', limits: 'Stated limitations', disclaimer: 'Disclaimer', how: 'How the simulation works', lensTexts: 'Lens descriptions',
    scnTexts: 'Situation descriptions', apply1: 'Apply', type: 'Type', note: 'Note'
  },
  ar: {
    title: 'وضع المراجعة الطبية — محاكي الرؤية',
    intro: 'للمراجعة من قِبل الطبيب. تُحفظ البوابات والملاحظات في هذا المتصفح فقط حتى يتم تصديرها.',
    notOfficial: 'ملاحظات عمل فقط — وليست اعتمادًا رسميًا. الاعتماد الرسمي هو فقط إدخال موقَّع من الطبيب في الملف CLINICAL_APPROVAL_STATUS.md.',
    model: 'إصدار النموذج', preset: 'الإعداد المسبق', prev: 'الإعداد السابق', next: 'الإعداد التالي', apply: 'تطبيق الإعداد مجددًا',
    situation: 'مواقف يومية (لكل عدسة)', lighting: 'الإضاءة', refraction: 'الانكسار والاستجماتيزم', compare: 'أمثلة المقارنة',
    matchYes: 'العرض يطابق هذا الإعداد تمامًا.', matchNo: 'العرض يختلف عن هذا الإعداد (تغيّر بعد التطبيق). طبّقه مجددًا لإعادة إنتاجه.',
    parameter: 'المعامل', presetValue: 'الإعداد', currentValue: 'العرض الحالي',
    lens: 'العدسة (أ)', lensB: 'العدسة ب', compareOn: 'المقارنة', distanceM: 'مسافة النظر (م)', lightingP: 'الإضاءة', pupil: 'البؤبؤ (مم، حسب الإضاءة)',
    sphere: 'الكروي المتبقي (ديوبتر)', cyl: 'الأسطواني (ديوبتر)', axis: 'المحور (°)', split: 'موضع خط المقارنة', yes: 'مفعّلة', no: 'متوقفة',
    outputs: 'مخرجات النموذج لهذا الإعداد', layer: 'الطبقة', defocus: 'عدم التركيز (ديوبتر)', blur: 'التشويش (دقيقة قوسية)', sharp: 'مؤشر الوضوح',
    haloIndex: 'مؤشر الهالات', glareIndex: 'مؤشر الوهج', contrastIndex: 'مؤشر التباين', haloDisks: 'أقراص الهالة (القطر′ × الحصة)', straylight: 'عامل التشتت',
    near: 'قريب', intermediate: 'متوسط', distance: 'بعيد',
    screenshot: 'حفظ لقطة', status: 'بوابات المراجعة لهذا الإعداد',
    pending: 'بانتظار المراجعة', approved: 'معتمد', 'approved-with-corrections': 'معتمد مع تصحيحات', rejected: 'مرفوض',
    opticalModelReview: 'مراجعة النموذج البصري', visualRepresentationReview: 'مراجعة التمثيل المرئي',
    textReviewAr: 'مراجعة النص العربي', textReviewEn: 'مراجعة النص الإنجليزي', finalPhysicianApproval: 'الاعتماد النهائي من الطبيب',
    finalBlocked: 'لا يمكن اختيار الاعتماد النهائي بعد:', whyPending: '«{g}» ما زالت بانتظار المراجعة', whyRejected: '«{g}» مرفوضة',
    whyStale: '«{g}» سُجّلت لإصدار سابق ({v}) وتحتاج إلى إعادة مراجعة',
    finalInconsistent: 'الاعتماد النهائي مسجَّل، لكن شروطه لم تعد مستوفاة. يرجى إعادة النظر فيه.',
    reReview: 'يحتاج إلى إعادة مراجعة (تغيّر منذ {v})', reReviewBody: 'تغيّر النموذج أو مخرجات هذا الإعداد أو نصّه بعد تسجيل هذه البوابات: {g}. السجلات السابقة محفوظة أدناه وفي ملف التصدير.',
    presetVersion: 'إصدار محتوى الإعداد', recordedFor: 'مسجَّلة للإصدار {v} · {h}', setAt: 'سُجّلت في هذا المتصفح في {t}',
    history: 'سجلات البوابات السابقة (محفوظة كدليل)', notes: 'ملاحظات هذا الإعداد', issuePlaceholder: 'صف المشكلة',
    addIssue: 'إضافة ملاحظة بالمعاملات الحالية', issues: 'الملاحظات', remove: 'حذف', screenshots: 'اللقطات المحفوظة لهذا الإعداد',
    custom: 'مخصص (يختلف عن الإعداد)', export: 'تصدير JSON', import: 'استيراد JSON',
    imported: 'تم الاستيراد.', importedOther: 'تم استيراد مراجعة لإصدار النموذج {v} (الحالي: {c}). الإعدادات التي تغيّرت منذ ذلك الحين مُعلَّمة لإعادة المراجعة.',
    importError: 'تعذّر الاستيراد: الملف ليس ملف مراجعة لمحاكي الرؤية.', blockedMsg: 'الاعتماد النهائي غير متاح — راجع الأسباب أدناه.',
    sr: 'تم تحديث البوابة: {g} — {s}.', reconfirm: 'تأكيد «{s}» مجددًا للإصدار الحالي', applied: 'تم تطبيق الإعداد: {p}.', questions: 'أسئلة مفتوحة ذات صلة (VISION_SIMULATOR_AUDIT.md §6)',
    progress: 'تقدّم المراجعة — كل الإعدادات', needs: 'يحتاج إعادة مراجعة', retired: 'سجلات لإعدادات لم تعد موجودة (محفوظة)',
    refConditions: 'الحالات البصرية وملفات العدسات', refDistance: 'إعدادات المسافة', refLighting: 'إعدادات الإضاءة',
    refHalo: 'تمثيل الهالات والوهج', refAssumptions: 'الافتراضات البصرية والمعادلات وحدود المعاملات',
    refCompare: 'أمثلة المقارنة', refLimits: 'حدود النموذج', refTexts: 'نصوص الشرح (عربي وإنجليزي)', refRefs: 'أنواع المصادر التي يعتمد عليها النموذج',
    readFrom: 'كل القيم أدناه تُقرأ من الشيفرة أثناء التشغيل ({f})؛ ولا يُعاد كتابة أي منها يدويًا.',
    id: 'المعرّف', name: 'الاسم', foci: 'البؤر (التقارب بالديوبتر × حصة الضوء)', loss: 'الضوء المفقود', lossSpread: 'انتشار الفقد (°)', corrects: 'تصحّح الأسطواني', tint: 'اللون',
    key: 'الإعداد', value: 'القيمة', scenario: 'الموقف', grade: 'التدرّج (إزالة التشبع / فقد التباين)', formula: 'كما هو منفَّذ', fn: 'الدالة',
    calib: 'معايرة الرسم (pipeline.js)', code: 'التعبير في الشيفرة', meaning: 'المعنى', equations: 'المعادلات (optics/model.js)', bounds: 'حدود المعاملات (BOUNDS)', viewing: 'هندسة الرؤية (VIEWING)',
    bands: 'نطاقات المسافة (BANDS)', distances: 'مسافات الإعداد (DISTANCES)', scenarios: 'المواقف اليومية (SCENARIOS)',
    assumptions: 'الافتراضات المعلنة', limits: 'الحدود المعلنة', disclaimer: 'إخلاء المسؤولية', how: 'كيف تعمل المحاكاة', lensTexts: 'أوصاف العدسات',
    scnTexts: 'أوصاف المواقف', apply1: 'تطبيق', type: 'النوع', note: 'ملاحظة'
  }
};
const fill = (s, o) => s.replace(/\{(\w)\}/g, (_, k) => (o[k] !== undefined ? o[k] : ''));
const n = (v, d = 4) => (Number.isFinite(v) ? String(Number(v.toFixed(d)) + 0) : '—');
const ltr = (s) => `<bdi dir="ltr">${esc(s)}</bdi>`;

// ---------- data ----------
function emptyRecord() {
  return { gates: Object.fromEntries(VGATE_IDS.map((id) => [id, emptyGate()])), history: [], notes: '', issues: [], screenshots: [] };
}
export function emptyVisionReview() {
  return {
    format: VREVIEW_FORMAT, formatVersion: VREVIEW_FORMAT_VERSION, modelVersion: VISION_MODEL_VERSION, selected: PRESET_IDS[0],
    presets: Object.fromEntries(PRESET_IDS.map((id) => [id, emptyRecord()]))
  };
}
/** Simulator parameters as recorded with an issue / screenshot (sanitised). */
export function normParams(p) {
  if (!p || typeof p !== 'object') return null;
  const r = normalizeRefraction(p.refraction || {});
  return {
    lens: LENS_IDS.includes(p.lens) ? p.lens : null,
    lensB: LENS_IDS.includes(p.lensB) ? p.lensB : null,
    compare: !!p.compare,
    distanceM: Number.isFinite(p.distanceM) ? p.distanceM : null,
    lighting: LIGHTING_IDS.includes(p.lighting) ? p.lighting : null,
    pupilMm: Number.isFinite(p.pupilMm) ? p.pupilMm : null,
    refraction: { sphereD: r.sphereD, cylD: r.cylD, axisDeg: r.axisDeg },
    split: Number.isFinite(p.split) ? p.split : null
  };
}
function normAnchor(x, fileModel) {
  return {
    presetId: typeof x.presetId === 'string' && ID_RE.test(x.presetId) ? x.presetId : null,
    matchesPreset: x.matchesPreset === true,
    params: normParams(x.params),
    modelVersion: str(x.modelVersion, 120) || fileModel,
    contentHash: str(x.contentHash, 120)
  };
}
/** Accepts only well-formed data; anything unknown becomes "pending" — never an approval. */
export function normaliseVisionReview(raw) {
  if (!raw || typeof raw !== 'object' || raw.format !== VREVIEW_FORMAT || !raw.presets || typeof raw.presets !== 'object') return null;
  const out = emptyVisionReview();
  out.modelVersion = typeof raw.modelVersion === 'string' ? raw.modelVersion.slice(0, 120) : 'unknown';
  if (typeof raw.selected === 'string' && PRESET_IDS.includes(raw.selected)) out.selected = raw.selected;
  for (const [id, v] of Object.entries(raw.presets).slice(0, 1000)) {
    if (!ID_RE.test(id) || !v || typeof v !== 'object') continue;
    const rec = emptyRecord();
    const g = v.gates && typeof v.gates === 'object' ? v.gates : {};
    for (const gid of VGATE_IDS) rec.gates[gid] = normaliseGate(g[gid], CLINICAL_STATES);
    rec.history = normaliseHistory(v.history, VGATE_IDS, statesFor);
    rec.notes = typeof v.notes === 'string' ? v.notes.slice(0, 20000) : '';
    rec.issues = Array.isArray(v.issues) ? v.issues.filter((i) => i && typeof i.text === 'string').slice(0, 500)
      .map((i) => ({ text: i.text.slice(0, 4000), ...normAnchor(i, out.modelVersion), createdAt: str(i.createdAt, 40) })) : [];
    rec.screenshots = Array.isArray(v.screenshots) ? v.screenshots.filter((x) => x && typeof x.file === 'string').slice(0, 500)
      .map((x) => ({ file: x.file.slice(0, 200), ...normAnchor(x, out.modelVersion), takenAt: str(x.takenAt, 40) })) : [];
    out.presets[id] = rec; // records for presets that no longer exist are kept (retired), never dropped
  }
  return out;
}
export function presetSummary(rec, id) {
  const cur = currentFor(id);
  return { current: cur, retired: !PRESET_IDS.includes(id), ...staleInfo(rec.gates, cur), finalCheck: finalGuard(rec.gates, CLINICAL, cur) };
}
export function buildVisionExport(data, now = new Date().toISOString()) {
  const presets = {};
  for (const [id, rec] of Object.entries(data.presets)) {
    const p = presetById(id);
    const sum = presetSummary(rec, id);
    presets[id] = {
      label: p ? p.label : null,
      group: p ? p.group : null,
      parameters: p ? p.params : null,
      relatedQuestions: p ? p.questions : [],
      retired: sum.retired,
      currentModelVersion: sum.current.modelVersion,
      currentContentHash: sum.current.contentHash,
      needsReReview: sum.needsReReview,
      staleGates: sum.gates,
      changedSinceModelVersions: sum.sinceModelVersions,
      finalApprovalAllowedNow: sum.finalCheck.allowed,
      finalApprovalBlockedBy: sum.finalCheck.reasons,
      finalApprovalInconsistent: isApproving(rec.gates.finalPhysicianApproval.status) && !sum.finalCheck.allowed,
      gates: rec.gates, history: rec.history, notes: rec.notes, issues: rec.issues, screenshots: rec.screenshots
    };
  }
  const inv = modelInventory();
  return {
    format: VREVIEW_FORMAT,
    formatVersion: VREVIEW_FORMAT_VERSION,
    notOfficialApproval: NOT_OFFICIAL_APPROVAL.en,
    notOfficialApprovalAr: NOT_OFFICIAL_APPROVAL.ar,
    simulator: 'vision-sim',
    modelVersion: VISION_MODEL_VERSION,
    exportedAt: now,
    gateStates: [...CLINICAL_STATES],
    modelParametersAtExport: {
      bounds: inv.bounds, distances: inv.distances, bands: inv.bands, pupilByLighting: inv.pupilByLighting, lightingGrade: inv.lightingGrade,
      viewing: inv.viewing, lenses: inv.lenses, scenarios: inv.scenarios, renderCalibration: inv.renderCalibration.map((c) => ({ id: c.id, code: c.code }))
    },
    presets
  };
}
function load() {
  try { const raw = localStorage.getItem(VREVIEW_STORAGE_KEY); if (raw) { const v = normaliseVisionReview(JSON.parse(raw)); if (v) return v; } } catch { /* storage unavailable */ }
  return emptyVisionReview();
}
function save(data) {
  try { localStorage.setItem(VREVIEW_STORAGE_KEY, JSON.stringify({ ...data, format: VREVIEW_FORMAT, formatVersion: VREVIEW_FORMAT_VERSION, savedAt: new Date().toISOString() })); } catch { /* ignore */ }
}

// ---------- panel ----------
let uidSeq = 0;
// api: { getLang, getTheme, getState, applyParams(params) → bool, screenshot() → dataURL|null, listen }
export function createVisionReviewPanel(host, api) {
  let data = load();
  const uid = `vsimr${++uidSeq}`;
  const el = document.createElement('section');
  el.className = 'vsim vsim-review srv';
  host.appendChild(el);
  el.innerHTML = '<div data-part="work"></div><div data-part="ref"></div>';
  const work = el.querySelector('[data-part="work"]');
  const refPart = el.querySelector('[data-part="ref"]');
  let msg = '';
  const L = () => (api.getLang() === 'en' ? 'en' : 'ar');
  const t = (k) => T[L()][k] ?? T.en[k] ?? k;
  const fmtTime = (iso) => { try { return new Date(iso).toLocaleString(L() === 'ar' ? 'ar' : 'en-GB'); } catch { return iso; } };
  const lensName = (id) => (id ? STRINGS[L()].lenses[id].name : '—');
  const selected = () => presetById(data.selected) || PRESETS[0];

  function keepOpen(part, fn) {
    const open = [...part.querySelectorAll('details[data-sec]')].filter((d) => d.open).map((d) => d.dataset.sec);
    fn();
    for (const k of open) { const d = part.querySelector(`details[data-sec="${k}"]`); if (d) d.open = true; }
  }
  function frame() {
    el.lang = L();
    el.dir = L() === 'ar' ? 'rtl' : 'ltr';
    el.dataset.theme = api.getTheme();
    el.setAttribute('aria-label', t('title'));
  }

  function paramRows(p, st) {
    const cur = st ? { lens: st.lens, lensB: st.lensB, compare: st.compare, distanceM: st.distanceM, lighting: st.lighting, refraction: st.refraction, split: st.split } : null;
    const rows = [
      ['lens', (x) => lensName(x.lens)],
      ['lensB', (x) => (x.compare ? lensName(x.lensB) : '—')],
      ['compareOn', (x) => t(x.compare ? 'yes' : 'no')],
      ['distanceM', (x) => n(x.distanceM)],
      ['lightingP', (x) => STRINGS[L()].lights[x.lighting]],
      ['pupil', (x) => n(PUPIL_BY_LIGHTING[x.lighting])],
      ['sphere', (x) => n(x.refraction.sphereD, 2)],
      ['cyl', (x) => n(x.refraction.cylD, 2)],
      ['axis', (x) => n(x.refraction.axisDeg, 0)],
      ['split', (x) => n(x.split, 2)]
    ];
    return rows.map(([k, f]) => {
      const a = f(p), b = cur ? f(cur) : '—';
      return `<tr data-param="${k}"><th scope="row">${esc(t(k))}</th><td>${ltr(a)}</td><td${a !== b ? ' class="srv-diff"' : ''}>${ltr(b)}</td></tr>`;
    }).join('');
  }
  function liveHTML() {
    const p = selected();
    const st = api.getState();
    const match = stateMatches(p.params, st);
    return `<p class="${match ? 'srv-meta' : 'srv-why'}" data-r="match" data-match="${match ? 'yes' : 'no'}">${esc(t(match ? 'matchYes' : 'matchNo'))}</p>
      <div class="srv-scroll"><table class="srv-table" data-r="params"><thead><tr><th scope="col">${esc(t('parameter'))}</th><th scope="col">${esc(t('presetValue'))}</th><th scope="col">${esc(t('currentValue'))}</th></tr></thead><tbody>${paramRows(p.params, st)}</tbody></table></div>`;
  }
  function outputsHTML(p) {
    const v = presetViews(p.params);
    const one = (view, tag) => {
      const rows = ['distance', 'intermediate', 'near'].map((k) => {
        const l = view.layers[k];
        return `<tr><th scope="row">${esc(t(k))}${k === view.subject ? ' ★' : ''}</th><td>${ltr(n(l.distanceM, 3))}</td><td>${ltr(n(l.defocusD, 3))}</td><td>${ltr(n(l.blurArcmin, 2))}</td><td>${ltr(n(l.sharpness, 3))}</td></tr>`;
      }).join('');
      const disks = view.halo.halos.map((h) => `${n(h.diameterArcmin, 1)}′×${n(h.energy, 2)}`).join(', ') || '—';
      return `<p class="srv-meta">${tag ? `<b>${esc(tag)}</b> · ` : ''}${esc(lensName(view.lens))} · ${esc(t('pupil'))}: ${ltr(n(view.pupilMm))} · ${esc(t('haloIndex'))}: ${ltr(n(view.halo.haloIndex, 3))} · ${esc(t('glareIndex'))}: ${ltr(n(view.halo.glareIndex, 3))} · ${esc(t('contrastIndex'))}: ${ltr(n(view.contrast.contrastIndex, 3))} · ${esc(t('straylight'))}: ${ltr(n(view.halo.straylight))} · ${esc(t('haloDisks'))}: ${ltr(disks)}</p>
        <div class="srv-scroll"><table class="srv-table"><thead><tr><th scope="col">${esc(t('layer'))}</th><th scope="col">${esc(t('distanceM'))}</th><th scope="col">${esc(t('defocus'))}</th><th scope="col">${esc(t('blur'))}</th><th scope="col">${esc(t('sharp'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    };
    return one(v.A, v.B ? 'A' : '') + (v.B ? one(v.B, 'B') : '');
  }

  function gatesHTML(rec, id) {
    const sum = presetSummary(rec, id);
    const labels = Object.fromEntries(CLINICAL_STATES.map((s) => [s, t(s)]));
    const whyId = `${uid}-why`;
    const fieldsets = VGATES.map((g) => {
      const gate = rec.gates[g.id];
      const stale = sum.gates.includes(g.id);
      const flag = stale ? ` <span class="srv-flag" data-flag="stale">${esc(fill(t('reReview'), { v: gate.modelVersion || 'unknown' }))}</span>` : '';
      const disabled = g.final && !sum.finalCheck.allowed ? ['approved', 'approved-with-corrections'].filter((s) => s !== gate.status) : [];
      const meta = gate.setAt ? `<p class="srv-meta" data-gate-meta="${g.id}">${esc(fill(t('recordedFor'), { v: gate.modelVersion || 'unknown', h: gate.contentHash || 'unknown' }))} · ${esc(fill(t('setAt'), { t: fmtTime(gate.setAt) }))}</p>` : '';
      const again = stale ? `<p class="srv-row"><button type="button" class="srv-btn" data-reconfirm="${g.id}">${esc(fill(t('reconfirm'), { s: t(gate.status) }))}</button></p>` : '';
      return gateFieldset({ uid, gateId: g.id, legend: t(g.id), states: CLINICAL_STATES, labels, value: gate.status, disabled, describedBy: g.final && !sum.finalCheck.allowed ? whyId : '', flag }) + meta + again;
    }).join('');
    const reasons = sum.finalCheck.reasons.map((r) => `<li>${esc(fill(t(r.why === 'pending' ? 'whyPending' : r.why === 'rejected' ? 'whyRejected' : 'whyStale'), { g: t(r.gate), v: r.since }))}</li>`).join('');
    const why = sum.finalCheck.allowed ? '' : `<div class="srv-why" id="${whyId}" data-r="finalWhy"><strong>${esc(t('finalBlocked'))}</strong><ul>${reasons}</ul></div>`;
    const inconsistent = isApproving(rec.gates.finalPhysicianApproval.status) && !sum.finalCheck.allowed ? `<p class="srv-notice" data-r="finalInconsistent">${esc(t('finalInconsistent'))}</p>` : '';
    const rereview = sum.needsReReview ? `<div class="srv-rereview" data-r="rereview" role="note"><strong>${esc(fill(t('reReview'), { v: sum.sinceModelVersions.join(', ') }))}</strong>${esc(fill(t('reReviewBody'), { g: sum.gates.map((g) => t(g)).join(', ') }))}</div>` : '';
    const history = rec.history.length ? `<details data-sec="history"><summary>${esc(t('history'))} (${rec.history.length})</summary><ol class="srv-list">${rec.history.map((h) => `<li>${esc(t(h.gate))}: ${esc(t(h.status))} <span class="srv-meta">— ${esc(fill(t('recordedFor'), { v: h.modelVersion || 'unknown', h: h.contentHash || 'unknown' }))}${h.setAt ? ` · ${esc(fmtTime(h.setAt))}` : ''}</span></li>`).join('')}</ol></details>` : '';
    return `${rereview}<h3>${esc(t('status'))}</h3><p class="srv-meta">${esc(t('presetVersion'))}: <code data-r="presetHash">${esc(sum.current.contentHash)}</code></p>${inconsistent}<div class="srv-gates">${fieldsets}</div>${why}${history}`;
  }
  const paramText = (pp) => (pp ? `${lensName(pp.lens)}${pp.compare ? ` / ${lensName(pp.lensB)}` : ''} · ${n(pp.distanceM)} m · ${pp.lighting} · ${n(pp.pupilMm)} mm · S ${n(pp.refraction.sphereD, 2)} C ${n(pp.refraction.cylD, 2)} × ${n(pp.refraction.axisDeg, 0)}` : '—');

  function progressHTML() {
    const head = `<tr><th scope="col">${esc(t('preset'))}</th>${VGATES.map((g) => `<th scope="col">${esc(t(g.id))}</th>`).join('')}</tr>`;
    const row = (id, label) => {
      const rec = data.presets[id];
      const sum = presetSummary(rec, id);
      return `<tr data-preset-row="${esc(id)}"><th scope="row">${esc(label)}${sum.needsReReview ? ` <span class="srv-flag">${esc(t('needs'))}</span>` : ''}</th>${VGATE_IDS.map((g) => `<td data-status="${rec.gates[g].status}">${esc(t(rec.gates[g].status))}</td>`).join('')}</tr>`;
    };
    const retired = Object.keys(data.presets).filter((id) => !PRESET_IDS.includes(id));
    return `<details data-sec="progress"><summary>${esc(t('progress'))}</summary><div class="srv-scroll"><table class="srv-table"><thead>${head}</thead><tbody>${PRESETS.map((p) => row(p.id, p.label[L()])).join('')}</tbody></table></div>
      ${retired.length ? `<p class="srv-meta">${esc(t('retired'))}: ${retired.map((id) => `<code>${esc(id)}</code>`).join(', ')}</p>` : ''}</details>`;
  }

  function renderWork() {
    frame();
    const p = selected();
    const rec = data.presets[p.id];
    const lang = L();
    const options = PRESET_GROUPS.map((g) => `<optgroup label="${esc(t(g))}">${PRESETS.filter((x) => x.group === g).map((x) => `<option value="${esc(x.id)}"${x.id === p.id ? ' selected' : ''}>${esc(x.label[lang])}</option>`).join('')}</optgroup>`).join('');
    keepOpen(work, () => renderPreservingFocus(work, `
      <h2 class="srv-title">${esc(t('title'))}</h2>
      <p>${esc(t('intro'))} <span class="srv-meta">${esc(t('model'))}: <code data-r="modelVersion">${esc(VISION_MODEL_VERSION)}</code></span></p>
      <p class="srv-notice" data-r="notOfficial">${esc(t('notOfficial'))}</p>
      <div class="srv-row">
        <label class="srv-field">${esc(t('preset'))} <select data-r="preset" id="${uid}-preset">${options}</select></label>
      </div>
      <div class="srv-row">
        <button type="button" class="srv-btn" data-r="prev">${esc(t('prev'))}</button>
        <button type="button" class="srv-btn" data-r="next">${esc(t('next'))}</button>
        <button type="button" class="srv-btn" data-r="apply">${esc(t('apply'))}</button>
        <button type="button" class="srv-btn" data-r="shot">${esc(t('screenshot'))}</button>
      </div>
      <p class="srv-meta">${esc(t('id'))}: <code data-r="presetId">${esc(p.id)}</code>${p.questions.length ? ` · ${esc(t('questions'))}: ${p.questions.map((q) => `<b>${esc(q)}</b>`).join(', ')}` : ''}</p>
      <div data-part="live">${liveHTML()}</div>
      <details data-sec="outputs"><summary>${esc(t('outputs'))}</summary>${outputsHTML(p)}</details>
      ${gatesHTML(rec, p.id)}
      <label class="srv-block">${esc(t('notes'))}<textarea data-r="notes" rows="3">${esc(rec.notes)}</textarea></label>
      <div class="srv-row">
        <input type="text" data-r="issueText" placeholder="${esc(t('issuePlaceholder'))}" aria-label="${esc(t('issuePlaceholder'))}">
        <button type="button" class="srv-btn" data-r="addIssue">${esc(t('addIssue'))}</button>
      </div>
      <ol class="srv-list" data-r="issues" aria-label="${esc(t('issues'))}">${rec.issues.map((i, k) => `<li class="srv-item"><span>${ltr(paramText(i.params))}${i.matchesPreset ? '' : ` (${esc(t('custom'))})`} — ${esc(i.text)}</span> <button type="button" class="srv-btn" data-del="${k}">${esc(t('remove'))}</button></li>`).join('')}</ol>
      ${rec.screenshots.length ? `<p><b>${esc(t('screenshots'))}</b></p><ol class="srv-list" data-r="shots">${rec.screenshots.map((x, k) => `<li class="srv-item"><span>${ltr(x.file)} · ${ltr(paramText(x.params))}</span> <button type="button" class="srv-btn" data-delshot="${k}">${esc(t('remove'))}</button></li>`).join('')}</ol>` : ''}
      <div class="srv-row">
        <button type="button" class="srv-btn" data-r="export">${esc(t('export'))}</button>
        <button type="button" class="srv-btn" data-r="importBtn">${esc(t('import'))}</button><input type="file" accept="application/json,.json" data-r="importFile" hidden>
        <span class="srv-msg" role="status" data-r="msg">${esc(msg)}</span>
      </div>
      ${progressHTML()}`));
  }

  // ---------- reference (read from the code) ----------
  function table(head, rows) {
    return `<div class="srv-scroll"><table class="srv-table"><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  // a two-number array in the parameter tables is a [min, max] range; anything else is shown as JSON
  const val = (v) => ltr(Array.isArray(v) && v.length === 2 ? v.join(' – ') : v === null ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v));
  const sec = (k, title, body) => `<details data-sec="${k}"><summary>${esc(title)}</summary>${body}</details>`;
  const bi = (fn) => `<div class="srv-bilingual">${['ar', 'en'].map((lg) => `<div lang="${lg}" dir="${lg === 'ar' ? 'rtl' : 'ltr'}">${fn(lg)}</div>`).join('')}</div>`;

  function renderRef() {
    const inv = modelInventory();
    const lang = L();
    const from = (f) => `<p class="srv-meta">${esc(fill(t('readFrom'), { f }))}</p>`;
    const lensRows = LENS_IDS.map((id) => {
      const l = inv.lenses[id];
      return [ltr(id), `${esc(STRINGS.en.lenses[id].name)}<br><span lang="ar" dir="rtl">${esc(STRINGS.ar.lenses[id].name)}</span>`,
        ltr(l.foci.map((f) => `${f.vergenceD} D × ${f.weight}`).join(' · ')), val(l.lossFraction), val(l.lossSpreadDeg), val(l.straylight), val(l.correctsCylinder), val(l.tint)];
    });
    const haloRows = [];
    for (const id of LENS_IDS) for (const li of LIGHTING_IDS) {
      const h = inv.haloByLighting[id][li];
      haloRows.push([`${esc(STRINGS[lang].lenses[id].short)} · ${esc(STRINGS[lang].lights[li])}`, val(h.pupilMm), ltr(n(h.haloIndex, 3)), ltr(n(h.glareIndex, 3)), ltr(h.halos.map((x) => `${n(x.diameterArcmin, 1)}′×${n(x.energy, 2)}`).join(', ') || '—')]);
    }
    const compare = PRESETS.filter((p) => p.group === 'compare');
    keepOpen(refPart, () => { refPart.innerHTML = [
      sec('conditions', t('refConditions'), from('optics/params.js → LENSES') + table([t('id'), t('name'), t('foci'), t('loss'), t('lossSpread'), t('straylight'), t('corrects'), t('tint')], lensRows)),
      sec('distance', t('refDistance'), from('optics/params.js → DISTANCES, BANDS, SCENARIOS')
        + `<h4>${esc(t('distances'))}</h4>` + table([t('key'), t('value')], Object.entries(inv.distances).map(([k, v]) => [ltr(k), val(v)]))
        + `<h4>${esc(t('bands'))}</h4>` + table([t('key'), t('value')], Object.entries(inv.bands).map(([k, v]) => [ltr(k), val(v)]))
        + `<h4>${esc(t('scenarios'))}</h4>` + table([t('scenario'), t('distanceM'), t('lightingP')], SCENARIO_IDS.map((id) => [`${esc(LAB[lang].scenarios[id].label)} ${ltr(`(${id})`)}`, val(SCENARIOS[id].distanceM), esc(STRINGS[lang].lights[SCENARIOS[id].lighting])]))),
      sec('lighting', t('refLighting'), from('optics/params.js → PUPIL_BY_LIGHTING, LIGHTING_GRADE')
        + table([t('lightingP'), t('pupil'), t('grade')], LIGHTING_IDS.map((li) => [esc(STRINGS[lang].lights[li]), val(inv.pupilByLighting[li]), ltr(`${inv.lightingGrade[li].desaturate} / ${inv.lightingGrade[li].contrastLoss}`)]))),
      sec('halo', t('refHalo'), from('optics/model.js → haloGlare(); pipeline.js → drawLights()')
        + table([`${t('lens')} · ${t('lightingP')}`, t('pupil'), t('haloIndex'), t('glareIndex'), t('haloDisks')], haloRows)
        + `<h4>${esc(t('calib'))}</h4>` + table([t('id'), t('code'), t('meaning')], RENDER_CALIBRATION.map((c) => [ltr(c.id), `<code>${esc(c.code)}</code>`, esc(c[lang])]))),
      sec('assumptions', t('refAssumptions'), from('optics/params.js → BOUNDS, VIEWING; optics/model.js')
        + `<h4>${esc(t('equations'))}</h4>` + table([t('id'), t('formula'), t('fn')], EQUATIONS.map((e) => [ltr(e.id), ltr(e.f), `<code>${esc(e.fn)}</code>`]))
        + `<h4>${esc(t('bounds'))}</h4>` + table([t('key'), t('value')], Object.entries(inv.bounds).map(([k, v]) => [ltr(k), val(v)]))
        + `<h4>${esc(t('viewing'))}</h4>` + table([t('key'), t('value')], Object.entries(inv.viewing).map(([k, v]) => [ltr(k), val(v)]))
        + `<h4>${esc(t('assumptions'))}</h4>` + bi((lg) => `<ul class="srv-list">${LAB[lg].advAssumptions.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`)),
      sec('compare', t('refCompare'), `<ul class="srv-list">${compare.map((p) => `<li class="srv-item"><span>${esc(p.label[lang])}</span> <button type="button" class="srv-btn" data-apply="${esc(p.id)}">${esc(t('apply1'))}</button></li>`).join('')}</ul>`),
      sec('limits', t('refLimits'), from('lens-lab/content.js → limits; i18n.js → howBody') + bi((lg) => `<ul class="srv-list">${LAB[lg].limits.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`)),
      sec('texts', t('refTexts'), from('vision-sim/i18n.js, lens-lab/content.js')
        + `<h4>${esc(t('disclaimer'))}</h4>` + bi((lg) => `<p>${esc(STRINGS[lg].disclaimer)}</p>`)
        + `<h4>${esc(t('how'))}</h4>` + bi((lg) => STRINGS[lg].howBody.map((x) => `<p>${esc(x)}</p>`).join(''))
        + `<h4>${esc(t('lensTexts'))}</h4>` + bi((lg) => LENS_IDS.map((id) => `<p><b>${esc(STRINGS[lg].lenses[id].name)}</b><br>${esc(LENS_INFO[lg][id].intended)}<br>${esc(LENS_INFO[lg][id].tradeoffs)}</p>`).join(''))
        + `<h4>${esc(t('scnTexts'))}</h4>` + bi((lg) => SCENARIO_IDS.map((id) => `<p><b>${esc(LAB[lg].scenarios[id].label)}</b> — ${esc(LAB[lg].scenarios[id].detail)}</p>`).join(''))
        + `<p class="srv-meta">${esc(STRINGS.en.catSeeing)}</p><p class="srv-meta" lang="ar" dir="rtl">${esc(STRINGS.ar.catSeeing)}</p>`),
      sec('refs', t('refRefs'), from('optics/params.js → REFERENCES') + table([t('id'), t('type'), t('note')], inv.references.map((r) => [ltr(r.id), esc(r.type), esc(r.note)])))
    ].join(''); });
  }

  // ---------- actions ----------
  const commit = () => save(data);
  const anchorNow = () => {
    const p = selected();
    const st = api.getState();
    return {
      presetId: p.id,
      matchesPreset: stateMatches(p.params, st),
      params: normParams({ ...st, pupilMm: st.pupilMm }),
      ...currentFor(p.id)
    };
  };
  function applySelected() {
    const p = selected();
    if (api.applyParams(p.params)) msg = fill(t('applied'), { p: p.label[L()] });
  }
  function select(id, apply = true) {
    if (!PRESET_IDS.includes(id)) return;
    data.selected = id;
    if (!data.presets[id]) data.presets[id] = emptyRecord();
    commit();
    if (apply) applySelected();
    renderWork();
  }
  // reconfirm: the reviewer explicitly confirms the SAME status again for the current version (re-review)
  function onGate(gateId, value, reconfirm = false) {
    const id = selected().id;
    const rec = data.presets[id];
    if (!CLINICAL_STATES.includes(value) || (!reconfirm && rec.gates[gateId].status === value)) return;
    const cur = currentFor(id);
    if (gateId === 'finalPhysicianApproval' && isApproving(value) && !finalGuard(rec.gates, CLINICAL, cur).allowed) { msg = t('blockedMsg'); renderWork(); return; }
    setGate(rec, gateId, value, cur);
    msg = fill(t('sr'), { g: t(gateId), s: t(value) });
    commit(); renderWork();
  }

  api.listen(el, 'change', (e) => {
    const tg = e.target;
    if (tg.dataset.gate) onGate(tg.dataset.gate, tg.value);
    else if (tg.dataset.r === 'preset') select(tg.value);
    else if (tg.dataset.r === 'importFile' && tg.files && tg.files[0]) {
      tg.files[0].text().then((txt) => {
        let v = null;
        try { v = normaliseVisionReview(JSON.parse(txt)); } catch { v = null; }
        if (!v) { msg = t('importError'); renderWork(); return; }
        data = v;
        msg = v.modelVersion === VISION_MODEL_VERSION ? t('imported') : fill(t('importedOther'), { v: v.modelVersion, c: VISION_MODEL_VERSION });
        commit(); renderWork();
      });
    }
  });
  api.listen(el, 'input', (e) => {
    if (e.target.dataset.r === 'notes') { data.presets[selected().id].notes = e.target.value; commit(); }
  });
  api.listen(el, 'click', (e) => {
    const b = e.target.closest('button');
    if (!b || !el.contains(b)) return;
    const r = b.dataset.r;
    const i = PRESET_IDS.indexOf(selected().id);
    if (r === 'prev') select(PRESET_IDS[(i - 1 + PRESET_IDS.length) % PRESET_IDS.length]);
    else if (r === 'next') select(PRESET_IDS[(i + 1) % PRESET_IDS.length]);
    else if (r === 'apply') { applySelected(); renderWork(); }
    else if (b.dataset.apply) select(b.dataset.apply);
    else if (b.dataset.reconfirm) {
      const gid = b.dataset.reconfirm;
      if (!VGATE_IDS.includes(gid)) return;
      onGate(gid, data.presets[selected().id].gates[gid].status, true);
      const rr = work.querySelector(`input[data-gate="${gid}"]:checked`); if (rr) rr.focus({ preventScroll: true });
    } else if (r === 'shot') {
      const url = api.screenshot();
      if (!url) return;
      const st = api.getState();
      const file = `vision-sim-${selected().id}-${st.lens}${st.compare ? `-vs-${st.lensB}` : ''}-${n(st.distanceM, 2)}m-${st.lighting}.png`;
      download(file, url);
      data.presets[selected().id].screenshots.push({ file, ...anchorNow(), takenAt: new Date().toISOString() });
      commit(); renderWork();
    } else if (r === 'addIssue') {
      const input = work.querySelector('[data-r="issueText"]');
      const text = input.value.trim();
      if (!text) return;
      data.presets[selected().id].issues.push({ text, ...anchorNow(), createdAt: new Date().toISOString() });
      commit(); renderWork();
    } else if (b.dataset.del !== undefined) {
      data.presets[selected().id].issues.splice(Number(b.dataset.del), 1); commit(); renderWork();
    } else if (b.dataset.delshot !== undefined) {
      data.presets[selected().id].screenshots.splice(Number(b.dataset.delshot), 1); commit(); renderWork();
    } else if (r === 'importBtn') {
      const f = work.querySelector('[data-r="importFile"]'); if (f) { f.value = ''; f.click(); }
    } else if (r === 'export') {
      downloadJSON(`vision-sim-review-${VISION_MODEL_VERSION}.json`, buildVisionExport(data));
    }
  });

  renderWork();
  renderRef();
  return {
    el,
    refresh() { msg = ''; renderWork(); renderRef(); },
    setTheme(th) { el.dataset.theme = th; },
    onViewChange() { const live = work.querySelector('[data-part="live"]'); if (live) live.innerHTML = liveHTML(); },
    select: (id) => select(id),
    get data() { return JSON.parse(JSON.stringify(data)); },
    summary: () => Object.fromEntries(Object.keys(data.presets).map((id) => [id, presetSummary(data.presets[id], id)])),
    exportRecord: () => buildVisionExport(data),
    texts: (id) => { const p = presetById(id); return p ? presetTexts(p.params) : null; },
    destroy() { el.remove(); }
  };
}
