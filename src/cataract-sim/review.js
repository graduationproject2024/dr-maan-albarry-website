// Clinical review mode (doctor workflow): mount(host, { review: true }) or the harness with ?review=1.
// Stage selection, slow playback, frame stepping, camera presets, anatomical layer toggles, screenshots,
// per-stage notes / issue annotations, and SEPARATE review gates per stage:
//   engineeringVerification (pending / verified / failed), anatomicalReview, motionReview, medicalTextReview,
//   finalPhysicianApproval (pending / approved / approved with corrections / rejected).
// Stored in localStorage and exportable / importable as JSON stamped with the model version.
//
// Every gate defaults to "Pending review" and is only ever changed by the reviewer's own click / key press.
// Nothing here is pre-filled or approved automatically. Final physician approval cannot be chosen while an
// anatomical, motion or text gate is pending, rejected or recorded against an older version.
// Each gate records the model version and the stage's content hash at the moment it was set; when either
// changes the stage shows "Needs re-review" and the earlier record is kept (history), never deleted.
// A status saved in a browser is a working note; the authoritative sign-off record is a signed entry in
// docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md.
import '../sim-review/styles.css';
import { STAGES, paramsAt } from './stages.js';
import { MODEL_VERSION } from './anatomy.js';
import {
  CLINICAL_STATES, ENGINEERING_STATES, NOT_OFFICIAL_APPROVAL, contentHash, emptyGate, normaliseGate, normaliseHistory,
  staleInfo, finalGuard, setGate, isApproving, esc, str, download, downloadJSON, renderPreservingFocus, gateFieldset
} from '../sim-review/core.js';

export const REVIEW_STORAGE_KEY = 'csim-clinical-review';
export const REVIEW_FORMAT = 'csim-clinical-review';
export const REVIEW_FORMAT_VERSION = 2;
/** Clinical gate states (kept under the old name for compatibility). */
export const STATUSES = CLINICAL_STATES;
export const LAYERS = ['cornea', 'iris', 'lens', 'iol', 'instruments', 'rays'];
export const GATES = Object.freeze([
  { id: 'engineeringVerification', states: ENGINEERING_STATES },
  { id: 'anatomicalReview', states: CLINICAL_STATES, clinical: true },
  { id: 'motionReview', states: CLINICAL_STATES, clinical: true },
  { id: 'medicalTextReview', states: CLINICAL_STATES, clinical: true },
  { id: 'finalPhysicianApproval', states: CLINICAL_STATES, final: true }
]);
export const GATE_IDS = GATES.map((g) => g.id);
export const CLINICAL_GATES = GATES.filter((g) => g.clinical).map((g) => g.id);
const statesFor = (id) => (GATES.find((g) => g.id === id) || GATES[1]).states;
const FPS = 30; // frame stepping uses 1/30 s of animation time

/**
 * Content version of one stage: a hash of its definition data (titles, texts, focus, camera preset, highlight,
 * sources, playback duration) plus the deterministic scene parameters it produces at p = 0, 0.1 … 1 (so a
 * change to its anatomy or motion code also changes the hash). Build-independent: only data, no source text.
 */
export function stageContentHash(index) {
  const s = STAGES[index];
  const samples = [];
  for (let k = 0; k <= 10; k++) samples.push(paramsAt(index, k / 10));
  return contentHash('stg', { id: s.id, duration: s.duration, title: s.title, text: s.text, focus: s.focus, camera: s.camera, highlight: s.highlight, sources: s.review && s.review.sources, samples });
}
let hashes = null;
export function stageHashes() {
  if (!hashes) hashes = Object.fromEntries(STAGES.map((s, i) => [s.id, stageContentHash(i)]));
  return hashes;
}
const currentFor = (id) => ({ modelVersion: MODEL_VERSION, contentHash: stageHashes()[id] });

const T = {
  en: {
    title: 'Clinical review mode', intro: 'For physician review. Gates, notes and issues are saved in this browser only until exported.',
    notOfficial: 'Working notes only — not an official approval. Official approval is only a signed entry by the physician in CLINICAL_APPROVAL_STATUS.md.',
    stage: 'Stage', speed: 'Speed', stepBack: 'Previous frame', stepFwd: 'Next frame', camera: 'Camera',
    camStage: 'Stage view', camSurgeon: 'Surgeon (front)', camSide: 'Side', layers: 'Layers',
    cornea: 'Cornea', iris: 'Iris', lens: 'Lens & capsule', iol: 'IOL', instruments: 'Instruments', rays: 'Light rays',
    screenshot: 'Save screenshot', status: 'Review gates for this stage', notes: 'Notes for this stage', addIssue: 'Add issue at current frame',
    issuePlaceholder: 'Describe the issue', issues: 'Issues', remove: 'Remove', export: 'Export JSON', import: 'Import JSON',
    pending: 'Pending review', approved: 'Approved', 'approved-with-corrections': 'Approved with corrections', rejected: 'Rejected',
    verified: 'Verified', failed: 'Failed', unrecognised: 'unrecognised value',
    engineeringVerification: 'Engineering verification', anatomicalReview: 'Anatomical review', motionReview: 'Motion review',
    medicalTextReview: 'Medical text review (AR + EN)', finalPhysicianApproval: 'Final physician approval',
    finalBlocked: 'Final approval cannot be chosen yet:', whyPending: '{g} is still pending', whyRejected: '{g} is rejected',
    whyStale: '{g} was recorded for an earlier version ({v}) and needs re-review',
    finalInconsistent: 'Final approval is recorded, but its conditions are no longer met. Please reconsider it.',
    reReview: 'Needs re-review (changed since {v})', reReviewBody: 'The stage changed after these gates were set: {g}. The earlier records are kept below and in the export.',
    stageVersion: 'Stage content version', recordedFor: 'recorded for {v} · {h}', setAt: 'set in this browser at {t}',
    legacy: 'Earlier single status from an old review file (format 1): {s}. It is not carried over to any gate.',
    history: 'Earlier gate records (kept as evidence)', screenshots: 'Screenshots taken for this stage',
    shotRef: '{f} · frame {n} · {t} s', posRef: 'frame {n} · {t} s', issueRef: 'frame {n} · {t} s · p = {p}',
    imported: 'Imported.', importedOther: 'Imported a review made for model version {v} (current: {c}). Stages changed since then are flagged for re-review.',
    importedLegacy: 'Imported an old-format review (model {v}). Its single statuses were kept as legacy notes only; every gate is Pending review.',
    importError: 'Could not import: not a cataract-simulator review file.', model: 'Model version', blockedMsg: 'Final approval is blocked — see the reasons below.',
    sr: 'Gate updated: {g} — {s}.', reconfirm: 'Confirm “{s}” again for the current version'
  },
  ar: {
    title: 'وضع المراجعة الطبية', intro: 'للمراجعة من قِبل الطبيب. تُحفظ البوابات والملاحظات في هذا المتصفح فقط حتى يتم تصديرها.',
    notOfficial: 'ملاحظات عمل فقط — وليست اعتمادًا رسميًا. الاعتماد الرسمي هو فقط إدخال موقَّع من الطبيب في الملف CLINICAL_APPROVAL_STATUS.md.',
    stage: 'المرحلة', speed: 'السرعة', stepBack: 'الإطار السابق', stepFwd: 'الإطار التالي', camera: 'الكاميرا',
    camStage: 'عرض المرحلة', camSurgeon: 'منظور الجرّاح (أمامي)', camSide: 'جانبي', layers: 'الطبقات',
    cornea: 'القرنية', iris: 'القزحية', lens: 'العدسة والمحفظة', iol: 'العدسة الصناعية', instruments: 'الأدوات', rays: 'أشعة الضوء',
    screenshot: 'حفظ لقطة', status: 'بوابات المراجعة لهذه المرحلة', notes: 'ملاحظات هذه المرحلة', addIssue: 'إضافة ملاحظة عند الإطار الحالي',
    issuePlaceholder: 'صف المشكلة', issues: 'الملاحظات', remove: 'حذف', export: 'تصدير JSON', import: 'استيراد JSON',
    pending: 'بانتظار المراجعة', approved: 'معتمد', 'approved-with-corrections': 'معتمد مع تصحيحات', rejected: 'مرفوض',
    verified: 'تم التحقق', failed: 'فشل', unrecognised: 'قيمة غير معروفة',
    engineeringVerification: 'التحقق الهندسي', anatomicalReview: 'المراجعة التشريحية', motionReview: 'مراجعة الحركة',
    medicalTextReview: 'مراجعة النص الطبي (عربي + إنجليزي)', finalPhysicianApproval: 'الاعتماد النهائي من الطبيب',
    finalBlocked: 'لا يمكن اختيار الاعتماد النهائي بعد:', whyPending: '«{g}» ما زالت بانتظار المراجعة', whyRejected: '«{g}» مرفوضة',
    whyStale: '«{g}» سُجّلت لإصدار سابق ({v}) وتحتاج إلى إعادة مراجعة',
    finalInconsistent: 'الاعتماد النهائي مسجَّل، لكن شروطه لم تعد مستوفاة. يرجى إعادة النظر فيه.',
    reReview: 'تحتاج إلى إعادة مراجعة (تغيّرت منذ {v})', reReviewBody: 'تغيّرت المرحلة بعد تسجيل هذه البوابات: {g}. السجلات السابقة محفوظة أدناه وفي ملف التصدير.',
    stageVersion: 'إصدار محتوى المرحلة', recordedFor: 'مسجَّلة للإصدار {v} · {h}', setAt: 'سُجّلت في هذا المتصفح في {t}',
    legacy: 'حالة واحدة سابقة من ملف مراجعة قديم (الصيغة 1): {s}. لم تُنقل إلى أي بوابة.',
    history: 'سجلات البوابات السابقة (محفوظة كدليل)', screenshots: 'اللقطات المحفوظة لهذه المرحلة',
    shotRef: '{f} · الإطار {n} · {t} ث', posRef: 'الإطار {n} · {t} ث', issueRef: 'الإطار {n} · {t} ث · p = {p}',
    imported: 'تم الاستيراد.', importedOther: 'تم استيراد مراجعة لإصدار النموذج {v} (الحالي: {c}). المراحل التي تغيّرت منذ ذلك الحين مُعلَّمة لإعادة المراجعة.',
    importedLegacy: 'تم استيراد مراجعة بالصيغة القديمة (النموذج {v}). حُفظت حالاتها كملاحظات سابقة فقط؛ وكل البوابات بانتظار المراجعة.',
    importError: 'تعذّر الاستيراد: الملف ليس ملف مراجعة لمحاكي الساد.', model: 'إصدار النموذج', blockedMsg: 'الاعتماد النهائي غير متاح — راجع الأسباب أدناه.',
    sr: 'تم تحديث البوابة: {g} — {s}.', reconfirm: 'تأكيد «{s}» مجددًا للإصدار الحالي'
  }
};
const fill = (s, o) => s.replace(/\{(\w)\}/g, (_, k) => (o[k] !== undefined ? o[k] : ''));

function emptyStage() {
  return { gates: Object.fromEntries(GATE_IDS.map((id) => [id, emptyGate()])), history: [], notes: '', issues: [], screenshots: [], legacy: null };
}
export function emptyReview() {
  return {
    format: REVIEW_FORMAT,
    formatVersion: REVIEW_FORMAT_VERSION,
    modelVersion: MODEL_VERSION,
    stages: Object.fromEntries(STAGES.map((s) => [s.id, emptyStage()]))
  };
}

function normCamera(c) {
  if (Array.isArray(c) && c.length >= 6) {
    const n = c.slice(0, 6).map(Number);
    if (n.every(Number.isFinite)) return { target: n.slice(0, 3), distance: n[3], azimuth: n[4], polar: n[5] };
  }
  if (c && typeof c === 'object' && Array.isArray(c.target)) {
    const target = c.target.slice(0, 3).map(Number);
    if (target.length === 3 && target.every(Number.isFinite) && [c.distance, c.azimuth, c.polar].every(Number.isFinite)) return { target, distance: c.distance, azimuth: c.azimuth, polar: c.polar };
  }
  return null;
}
const frameOf = (p, stage) => Math.round(p * stage.duration * FPS);
const timeOf = (p, stage) => Number((p * stage.duration).toFixed(3));
function normAnchor(i, stage, fileModel) {
  const p = Number.isFinite(i.p) ? Math.min(1, Math.max(0, i.p)) : 0;
  return {
    p,
    frame: Number.isFinite(i.frame) ? Math.round(i.frame) : frameOf(p, stage),
    timeS: Number.isFinite(i.timeS) ? i.timeS : timeOf(p, stage),
    camera: normCamera(i.camera),
    modelVersion: str(i.modelVersion, 120) || fileModel,
    contentHash: str(i.contentHash, 120)
  };
}

/**
 * Accepts only well-formed data; anything unknown falls back to "pending" (never to an approval).
 * Format 1 (one status per stage) is migrated: the old status is kept as `legacy`, every gate stays pending.
 */
export function normaliseReview(raw) {
  if (!raw || typeof raw !== 'object' || raw.format !== REVIEW_FORMAT || !raw.stages || typeof raw.stages !== 'object') return null;
  const fv = Number.isFinite(raw.formatVersion) ? raw.formatVersion : 1;
  const out = emptyReview();
  out.modelVersion = typeof raw.modelVersion === 'string' ? raw.modelVersion.slice(0, 120) : 'unknown';
  out.sourceFormatVersion = fv;
  for (const s of STAGES) {
    const v = raw.stages[s.id];
    if (!v || typeof v !== 'object') continue;
    const rec = out.stages[s.id];
    rec.notes = typeof v.notes === 'string' ? v.notes.slice(0, 20000) : '';
    rec.issues = Array.isArray(v.issues) ? v.issues.filter((i) => i && typeof i.text === 'string').slice(0, 500).map((i) => ({
      text: i.text.slice(0, 4000), ...normAnchor(i, s, out.modelVersion), createdAt: str(i.createdAt, 40)
    })) : [];
    if (fv < 2) {
      if (typeof v.status === 'string') rec.legacy = { status: STATUSES.includes(v.status) ? v.status : 'unrecognised', formatVersion: 1, modelVersion: out.modelVersion };
      continue; // no gate is derived from a legacy status
    }
    const g = v.gates && typeof v.gates === 'object' ? v.gates : {};
    for (const id of GATE_IDS) rec.gates[id] = normaliseGate(g[id], statesFor(id));
    rec.history = normaliseHistory(v.history, GATE_IDS, statesFor);
    rec.screenshots = Array.isArray(v.screenshots) ? v.screenshots.filter((x) => x && typeof x.file === 'string').slice(0, 500).map((x) => ({
      file: x.file.slice(0, 200), ...normAnchor(x, s, out.modelVersion), takenAt: str(x.takenAt, 40)
    })) : [];
    if (v.legacy && typeof v.legacy === 'object') {
      rec.legacy = { status: STATUSES.includes(v.legacy.status) ? v.legacy.status : 'unrecognised', formatVersion: 1, modelVersion: str(v.legacy.modelVersion, 120) || 'unknown' };
    }
  }
  return out;
}

/** Per-stage review summary for the current model (used by the UI and the export). */
export function stageSummary(rec, id) {
  const cur = currentFor(id);
  return { current: cur, ...staleInfo(rec.gates, cur), finalCheck: finalGuard(rec.gates, CLINICAL_GATES, cur) };
}

/** The export record: both the recorded gates (with the version each was set for) and the current versions. */
export function buildExport(data, now = new Date().toISOString()) {
  const stages = {};
  for (const s of STAGES) {
    const rec = data.stages[s.id];
    const sum = stageSummary(rec, s.id);
    stages[s.id] = {
      title: s.title,
      currentModelVersion: sum.current.modelVersion,
      currentContentHash: sum.current.contentHash,
      needsReReview: sum.needsReReview,
      staleGates: sum.gates,
      changedSinceModelVersions: sum.sinceModelVersions,
      finalApprovalAllowedNow: sum.finalCheck.allowed,
      finalApprovalBlockedBy: sum.finalCheck.reasons,
      finalApprovalInconsistent: isApproving(rec.gates.finalPhysicianApproval.status) && !sum.finalCheck.allowed,
      gates: rec.gates,
      history: rec.history,
      notes: rec.notes,
      issues: rec.issues,
      screenshots: rec.screenshots,
      legacy: rec.legacy
    };
  }
  return {
    format: REVIEW_FORMAT,
    formatVersion: REVIEW_FORMAT_VERSION,
    notOfficialApproval: NOT_OFFICIAL_APPROVAL.en,
    notOfficialApprovalAr: NOT_OFFICIAL_APPROVAL.ar,
    simulator: 'cataract-sim',
    modelVersion: MODEL_VERSION,
    exportedAt: now,
    gateStates: { engineeringVerification: [...ENGINEERING_STATES], clinical: [...CLINICAL_STATES] },
    issueAnchor: 'p = stage progress 0..1; frame = p × stage duration × 30; timeS = animation seconds within the stage; camera = orbit target (mm), distance, azimuth and polar angle (rad)',
    stages
  };
}

function load() {
  try { const raw = localStorage.getItem(REVIEW_STORAGE_KEY); if (raw) { const n = normaliseReview(JSON.parse(raw)); if (n) return n; } } catch { /* storage unavailable */ }
  return emptyReview();
}
function save(data) {
  try {
    const { sourceFormatVersion, ...rest } = data;
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify({ ...rest, format: REVIEW_FORMAT, formatVersion: REVIEW_FORMAT_VERSION, savedAt: new Date().toISOString() }));
  } catch { /* ignore */ }
}

let uidSeq = 0;
// api: { getLang, getState, goToStage, getSpeed, setSpeed, step, camera(preset), getLayers, setLayer, screenshot, listen }
export function createReviewPanel(parent, api) {
  let data = load();
  const uid = `csimr${++uidSeq}`;
  const el = document.createElement('section');
  el.className = 'csim-review srv';
  el.setAttribute('data-ref', 'review');
  parent.appendChild(el);
  let msg = '';
  const t = (k) => (T[api.getLang()] || T.en)[k];
  const stageId = () => STAGES[api.getState().stageIndex].id;
  const stageObj = () => STAGES[api.getState().stageIndex];
  const fmtTime = (iso) => { try { return new Date(iso).toLocaleString(api.getLang() === 'ar' ? 'ar' : 'en-GB'); } catch { return iso; } };

  function gatesHTML(rec, sid) {
    const sum = stageSummary(rec, sid);
    const labels = Object.fromEntries([...CLINICAL_STATES, ...ENGINEERING_STATES].map((s) => [s, t(s)]));
    const reasons = sum.finalCheck.reasons.map((r) => `<li>${esc(fill(t(r.why === 'pending' ? 'whyPending' : r.why === 'rejected' ? 'whyRejected' : 'whyStale'), { g: t(r.gate), v: r.since }))}</li>`).join('');
    const whyId = `${uid}-why`;
    const finalRec = rec.gates.finalPhysicianApproval;
    const fieldsets = GATES.map((g) => {
      const gate = rec.gates[g.id];
      const stale = sum.gates.includes(g.id);
      const flag = stale ? ` <span class="srv-flag" data-flag="stale">${esc(fill(t('reReview'), { v: gate.modelVersion || 'unknown' }))}</span>` : '';
      const disabled = g.final && !sum.finalCheck.allowed ? ['approved', 'approved-with-corrections'].filter((s) => s !== gate.status) : [];
      const meta = gate.setAt ? `<p class="srv-meta" data-gate-meta="${g.id}">${esc(fill(t('recordedFor'), { v: gate.modelVersion || 'unknown', h: gate.contentHash || 'unknown' }))} · ${esc(fill(t('setAt'), { t: fmtTime(gate.setAt) }))}</p>` : '';
      const again = stale ? `<p class="srv-row"><button type="button" class="csim-rbtn" data-reconfirm="${g.id}" id="${uid}-again-${g.id}">${esc(fill(t('reconfirm'), { s: t(gate.status) }))}</button></p>` : '';
      return gateFieldset({ uid, gateId: g.id, legend: t(g.id), states: g.states, labels, value: gate.status, disabled, describedBy: g.final && !sum.finalCheck.allowed ? whyId : '', flag }) + meta + again;
    }).join('');
    const why = sum.finalCheck.allowed ? '' : `<div class="srv-why" id="${whyId}" data-r="finalWhy"><strong>${esc(t('finalBlocked'))}</strong><ul>${reasons}</ul></div>`;
    const inconsistent = isApproving(finalRec.status) && !sum.finalCheck.allowed ? `<p class="srv-notice" data-r="finalInconsistent">${esc(t('finalInconsistent'))}</p>` : '';
    const rereview = sum.needsReReview ? `<div class="srv-rereview" data-r="rereview" role="note"><strong>${esc(fill(t('reReview'), { v: sum.sinceModelVersions.join(', ') }))}</strong>${esc(fill(t('reReviewBody'), { g: sum.gates.map((g) => t(g)).join(', ') }))}</div>` : '';
    const legacy = rec.legacy ? `<p class="srv-legacy" data-r="legacy">${esc(fill(t('legacy'), { s: t(rec.legacy.status) }))} <span class="srv-meta">(${esc(rec.legacy.modelVersion)})</span></p>` : '';
    const history = rec.history.length ? `<details data-r="history"><summary>${esc(t('history'))} (${rec.history.length})</summary><ol class="srv-list">${rec.history.map((h) => `<li>${esc(t(h.gate))}: ${esc(t(h.status))} <span class="srv-meta">— ${esc(fill(t('recordedFor'), { v: h.modelVersion || 'unknown', h: h.contentHash || 'unknown' }))}${h.setAt ? ` · ${esc(fmtTime(h.setAt))}` : ''}</span></li>`).join('')}</ol></details>` : '';
    return `${rereview}${legacy}<h4 class="csim-review-label">${esc(t('status'))}</h4>
      <p class="srv-meta">${esc(t('stageVersion'))}: <code data-r="stageHash">${esc(sum.current.contentHash)}</code></p>
      ${inconsistent}<div class="srv-gates">${fieldsets}</div>${why}${history}`;
  }

  function render() {
    const st = api.getState();
    const sid = STAGES[st.stageIndex].id;
    const rec = data.stages[sid];
    const stage = STAGES[st.stageIndex];
    const lang = api.getLang();
    el.setAttribute('aria-label', t('title'));
    renderPreservingFocus(el, `
      <h3 class="csim-review-title">${esc(t('title'))}</h3>
      <p class="csim-small">${esc(t('intro'))} <span class="csim-review-version">${esc(t('model'))}: <code>${esc(MODEL_VERSION)}</code></span></p>
      <p class="srv-notice" data-r="notOfficial">${esc(t('notOfficial'))}</p>
      <div class="csim-review-row">
        <label>${esc(t('stage'))} <select data-r="stage">${STAGES.map((s, i) => `<option value="${i}"${i === st.stageIndex ? ' selected' : ''}>${i + 1}. ${esc(s.title[lang])}</option>`).join('')}</select></label>
        <label>${esc(t('speed'))} <select data-r="speed">${[0.25, 0.5, 1].map((v) => `<option value="${v}"${v === api.getSpeed() ? ' selected' : ''}>${v}×</option>`).join('')}</select></label>
        <button type="button" class="csim-rbtn" data-r="stepBack" aria-label="${esc(t('stepBack'))}">⏮︎ −1</button>
        <button type="button" class="csim-rbtn" data-r="stepFwd" aria-label="${esc(t('stepFwd'))}">+1 ⏭︎</button>
        <output class="csim-review-p" data-r="pos">${esc(posText(st, stage))}</output>
      </div>
      <div class="csim-review-row" role="group" aria-label="${esc(t('camera'))}">
        <span class="csim-review-label">${esc(t('camera'))}</span>
        <button type="button" class="csim-rbtn" data-cam="stage">${esc(t('camStage'))}</button>
        <button type="button" class="csim-rbtn" data-cam="surgeon">${esc(t('camSurgeon'))}</button>
        <button type="button" class="csim-rbtn" data-cam="side">${esc(t('camSide'))}</button>
        <button type="button" class="csim-rbtn" data-r="shot">${esc(t('screenshot'))}</button>
      </div>
      <fieldset class="csim-review-row csim-review-layers"><legend>${esc(t('layers'))}</legend>
        ${LAYERS.map((id) => `<label><input type="checkbox" data-layer="${id}"${api.getLayers()[id] ? ' checked' : ''}> ${esc(t(id))}</label>`).join('')}
      </fieldset>
      ${gatesHTML(rec, sid)}
      <label class="csim-review-block">${esc(t('notes'))}<textarea data-r="notes" rows="3">${esc(rec.notes)}</textarea></label>
      <div class="csim-review-row">
        <input type="text" data-r="issueText" placeholder="${esc(t('issuePlaceholder'))}" aria-label="${esc(t('issuePlaceholder'))}">
        <button type="button" class="csim-rbtn" data-r="addIssue">${esc(t('addIssue'))}</button>
      </div>
      <ol class="csim-review-issues" aria-label="${esc(t('issues'))}">${rec.issues.map((i, k) => `<li><span>${esc(fill(t('issueRef'), { n: i.frame, t: i.timeS.toFixed(2), p: i.p.toFixed(3) }))} — ${esc(i.text)}</span> <button type="button" class="csim-rbtn" data-del="${k}">${esc(t('remove'))}</button></li>`).join('')}</ol>
      ${rec.screenshots.length ? `<p class="csim-review-label">${esc(t('screenshots'))}</p><ol class="srv-list" data-r="shots">${rec.screenshots.map((x, k) => `<li class="srv-item"><span>${esc(fill(t('shotRef'), { f: x.file, n: x.frame, t: x.timeS.toFixed(2) }))}</span> <button type="button" class="csim-rbtn" data-delshot="${k}">${esc(t('remove'))}</button></li>`).join('')}</ol>` : ''}
      <div class="csim-review-row">
        <button type="button" class="csim-rbtn" data-r="export">${esc(t('export'))}</button>
        <button type="button" class="csim-rbtn" data-r="importBtn">${esc(t('import'))}</button><input type="file" accept="application/json,.json" data-r="importFile" hidden>
        <span class="csim-review-msg" role="status">${esc(msg)}</span>
      </div>`);
  }
  function posText(st, stage) {
    return `p = ${st.stageProgress.toFixed(3)} · ${fill(t('posRef'), { n: frameOf(st.stageProgress, stage), t: timeOf(st.stageProgress, stage).toFixed(2) })}`;
  }
  const q = (sel) => el.querySelector(sel);
  const commit = () => { save(data); };
  const anchorNow = () => {
    const st = api.getState();
    const stage = STAGES[st.stageIndex];
    const p = st.stageProgress;
    return {
      p, frame: frameOf(p, stage), timeS: timeOf(p, stage),
      camera: st.camera ? { target: [...st.camera.target], distance: st.camera.distance, azimuth: st.camera.azimuth, polar: st.camera.polar } : null,
      ...currentFor(stage.id)
    };
  };

  // reconfirm: the reviewer explicitly confirms the SAME status again for the current version (re-review)
  function onGate(gateId, value, reconfirm = false) {
    const sid = stageId();
    const rec = data.stages[sid];
    const states = statesFor(gateId);
    if (!states.includes(value) || (!reconfirm && rec.gates[gateId].status === value)) return;
    const cur = currentFor(sid);
    if (gateId === 'finalPhysicianApproval' && isApproving(value) && !finalGuard(rec.gates, CLINICAL_GATES, cur).allowed) {
      msg = t('blockedMsg'); render(); return; // guard: never record a blocked final approval
    }
    setGate(rec, gateId, value, cur);
    msg = fill(t('sr'), { g: t(gateId), s: t(value) });
    commit(); render();
  }

  api.listen(el, 'change', (e) => {
    const tg = e.target;
    if (tg.dataset.gate) onGate(tg.dataset.gate, tg.value);
    else if (tg.dataset.r === 'stage') api.goToStage(Number(tg.value));
    else if (tg.dataset.r === 'speed') api.setSpeed(Number(tg.value));
    else if (tg.dataset.layer) api.setLayer(tg.dataset.layer, tg.checked);
    else if (tg.dataset.r === 'importFile' && tg.files && tg.files[0]) {
      const f = tg.files[0];
      f.text().then((txt) => {
        let n = null;
        try { n = normaliseReview(JSON.parse(txt)); } catch { n = null; }
        if (!n) { msg = t('importError'); render(); return; }
        const legacy = n.sourceFormatVersion < 2;
        data = n;
        msg = legacy ? fill(t('importedLegacy'), { v: n.modelVersion })
          : n.modelVersion === MODEL_VERSION ? t('imported') : fill(t('importedOther'), { v: n.modelVersion, c: MODEL_VERSION });
        commit(); render();
      });
    }
  });
  api.listen(el, 'input', (e) => {
    if (e.target.dataset.r === 'notes') { data.stages[stageId()].notes = e.target.value; commit(); }
  });
  api.listen(el, 'click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.cam) api.camera(b.dataset.cam);
    else if (b.dataset.reconfirm) {
      const gid = b.dataset.reconfirm;
      if (!GATE_IDS.includes(gid)) return;
      onGate(gid, data.stages[stageId()].gates[gid].status, true);
      const r = el.querySelector(`input[data-gate="${gid}"]:checked`); if (r) r.focus({ preventScroll: true });
    } else if (b.dataset.r === 'stepBack') api.step(-1);
    else if (b.dataset.r === 'stepFwd') api.step(1);
    else if (b.dataset.r === 'shot') {
      const st = api.getState();
      const url = api.screenshot();
      if (url) {
        const file = `cataract-sim-stage${st.stageIndex + 1}-p${st.stageProgress.toFixed(3)}.png`;
        download(file, url);
        data.stages[stageId()].screenshots.push({ file, ...anchorNow(), takenAt: new Date().toISOString() });
        commit(); render();
      }
    } else if (b.dataset.r === 'addIssue') {
      const input = q('[data-r="issueText"]');
      const text = input.value.trim();
      if (!text) return;
      data.stages[stageId()].issues.push({ text, ...anchorNow(), createdAt: new Date().toISOString() });
      commit(); render();
    } else if (b.dataset.del !== undefined) {
      data.stages[stageId()].issues.splice(Number(b.dataset.del), 1);
      commit(); render();
    } else if (b.dataset.delshot !== undefined) {
      data.stages[stageId()].screenshots.splice(Number(b.dataset.delshot), 1);
      commit(); render();
    } else if (b.dataset.r === 'importBtn') {
      const f = q('[data-r="importFile"]'); if (f) { f.value = ''; f.click(); }
    } else if (b.dataset.r === 'export') {
      downloadJSON(`cataract-sim-review-${MODEL_VERSION}.json`, buildExport(data));
    }
  });

  render();
  return {
    el,
    refresh() { msg = ''; render(); },
    updatePosition() { const o = q('[data-r="pos"]'); if (o) o.textContent = posText(api.getState(), stageObj()); },
    get data() { return JSON.parse(JSON.stringify(data)); },
    get summary() { return Object.fromEntries(STAGES.map((s) => [s.id, stageSummary(data.stages[s.id], s.id)])); },
    exportRecord: () => buildExport(data),
    destroy() { el.remove(); }
  };
}
