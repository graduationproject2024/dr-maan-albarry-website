// Clinical review mode (doctor workflow): mount(host, { review: true }) or the harness with ?review=1.
// Stage selection, slow playback, frame stepping, camera presets, anatomical layer toggles, screenshots,
// per-stage notes / issue annotations and a per-stage review status, stored in localStorage and exportable /
// importable as JSON stamped with the model version.
//
// Status defaults to "Pending review" for every stage and is only ever changed by the reviewer's own clicks.
// Nothing here is pre-filled or approved automatically. A status saved in a browser is a working note; the
// authoritative sign-off record is docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md.
import { STAGES } from './stages.js';
import { MODEL_VERSION } from './anatomy.js';

export const REVIEW_STORAGE_KEY = 'csim-clinical-review';
export const REVIEW_FORMAT = 'csim-clinical-review';
export const STATUSES = ['pending', 'approved', 'approved-with-corrections', 'rejected'];
export const LAYERS = ['cornea', 'iris', 'lens', 'iol', 'instruments', 'rays'];

const T = {
  en: {
    title: 'Clinical review mode', intro: 'For physician review. Statuses and notes are saved in this browser only until exported.',
    stage: 'Stage', speed: 'Speed', stepBack: 'Previous frame', stepFwd: 'Next frame', camera: 'Camera',
    camStage: 'Stage view', camSurgeon: 'Surgeon (front)', camSide: 'Side', layers: 'Layers',
    cornea: 'Cornea', iris: 'Iris', lens: 'Lens & capsule', iol: 'IOL', instruments: 'Instruments', rays: 'Light rays',
    screenshot: 'Save screenshot', status: 'Review status', notes: 'Notes for this stage', addIssue: 'Add issue at current frame',
    issuePlaceholder: 'Describe the issue', issues: 'Issues', remove: 'Remove', export: 'Export JSON', import: 'Import JSON',
    pending: 'Pending review', approved: 'Approved', 'approved-with-corrections': 'Approved with corrections', rejected: 'Rejected',
    imported: 'Imported.', importedOther: 'Imported a review made for model version {v} (current: {c}). Re-check affected stages.',
    importError: 'Could not import: not a cataract-simulator review file.', model: 'Model version'
  },
  ar: {
    title: 'وضع المراجعة الطبية', intro: 'للمراجعة من قِبل الطبيب. تُحفظ الحالات والملاحظات في هذا المتصفح فقط حتى يتم تصديرها.',
    stage: 'المرحلة', speed: 'السرعة', stepBack: 'الإطار السابق', stepFwd: 'الإطار التالي', camera: 'الكاميرا',
    camStage: 'عرض المرحلة', camSurgeon: 'منظور الجرّاح (أمامي)', camSide: 'جانبي', layers: 'الطبقات',
    cornea: 'القرنية', iris: 'القزحية', lens: 'العدسة والمحفظة', iol: 'العدسة الصناعية', instruments: 'الأدوات', rays: 'أشعة الضوء',
    screenshot: 'حفظ لقطة', status: 'حالة المراجعة', notes: 'ملاحظات هذه المرحلة', addIssue: 'إضافة ملاحظة عند الإطار الحالي',
    issuePlaceholder: 'صف المشكلة', issues: 'الملاحظات', remove: 'حذف', export: 'تصدير JSON', import: 'استيراد JSON',
    pending: 'بانتظار المراجعة', approved: 'معتمد', 'approved-with-corrections': 'معتمد مع تصحيحات', rejected: 'مرفوض',
    imported: 'تم الاستيراد.', importedOther: 'تم استيراد مراجعة لإصدار النموذج {v} (الحالي: {c}). أعد التحقق من المراحل المتأثرة.',
    importError: 'تعذّر الاستيراد: الملف ليس ملف مراجعة لمحاكي الساد.', model: 'إصدار النموذج'
  }
};

export function emptyReview() {
  return {
    format: REVIEW_FORMAT,
    modelVersion: MODEL_VERSION,
    stages: Object.fromEntries(STAGES.map((s) => [s.id, { status: 'pending', notes: '', issues: [] }]))
  };
}
// Accepts only well-formed data; anything unknown falls back to "pending" (never to an approval).
export function normaliseReview(raw) {
  if (!raw || typeof raw !== 'object' || raw.format !== REVIEW_FORMAT || !raw.stages || typeof raw.stages !== 'object') return null;
  const out = emptyReview();
  out.modelVersion = typeof raw.modelVersion === 'string' ? raw.modelVersion : 'unknown';
  for (const s of STAGES) {
    const v = raw.stages[s.id];
    if (!v || typeof v !== 'object') continue;
    out.stages[s.id] = {
      status: STATUSES.includes(v.status) ? v.status : 'pending',
      notes: typeof v.notes === 'string' ? v.notes.slice(0, 20000) : '',
      issues: Array.isArray(v.issues) ? v.issues.filter((i) => i && typeof i.text === 'string').slice(0, 500).map((i) => ({
        text: i.text.slice(0, 4000), p: Number.isFinite(i.p) ? Math.min(1, Math.max(0, i.p)) : 0,
        camera: Array.isArray(i.camera) ? i.camera.slice(0, 6).map(Number) : null,
        createdAt: typeof i.createdAt === 'string' ? i.createdAt : null
      })) : []
    };
  }
  return out;
}
function load() {
  try { const raw = localStorage.getItem(REVIEW_STORAGE_KEY); if (raw) { const n = normaliseReview(JSON.parse(raw)); if (n) return n; } } catch { /* storage unavailable */ }
  return emptyReview();
}
function save(data) {
  try { localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify({ ...data, modelVersion: data.modelVersion, savedAt: new Date().toISOString() })); } catch { /* ignore */ }
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function download(name, href) {
  const a = document.createElement('a');
  a.href = href; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
}

// api: { getLang, getState, goToStage, play, pause, isPlaying, setSpeed, step, camera(preset), setLayer, screenshot, listen }
export function createReviewPanel(parent, api) {
  let data = load();
  // Data recorded for another model version stays visible but is flagged.
  const el = document.createElement('section');
  el.className = 'csim-review';
  el.setAttribute('data-ref', 'review');
  parent.appendChild(el);
  let msg = '';
  const t = (k) => (T[api.getLang()] || T.en)[k];

  function render() {
    const st = api.getState();
    const sid = STAGES[st.stageIndex].id;
    const rec = data.stages[sid];
    const lang = api.getLang();
    el.setAttribute('aria-label', t('title'));
    el.innerHTML = `
      <h3 class="csim-review-title">${esc(t('title'))}</h3>
      <p class="csim-small">${esc(t('intro'))} <span class="csim-review-version">${esc(t('model'))}: <code>${esc(MODEL_VERSION)}</code></span></p>
      <div class="csim-review-row">
        <label>${esc(t('stage'))} <select data-r="stage">${STAGES.map((s, i) => `<option value="${i}"${i === st.stageIndex ? ' selected' : ''}>${i + 1}. ${esc(s.title[lang])}</option>`).join('')}</select></label>
        <label>${esc(t('speed'))} <select data-r="speed">${[0.25, 0.5, 1].map((v) => `<option value="${v}"${v === api.getSpeed() ? ' selected' : ''}>${v}×</option>`).join('')}</select></label>
        <button type="button" class="csim-rbtn" data-r="stepBack" aria-label="${esc(t('stepBack'))}">⏮︎ −1</button>
        <button type="button" class="csim-rbtn" data-r="stepFwd" aria-label="${esc(t('stepFwd'))}">+1 ⏭︎</button>
        <output class="csim-review-p" data-r="pos">p = ${st.stageProgress.toFixed(3)}</output>
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
      <div class="csim-review-row">
        <label>${esc(t('status'))} <select data-r="status">${STATUSES.map((s) => `<option value="${s}"${s === rec.status ? ' selected' : ''}>${esc(t(s))}</option>`).join('')}</select></label>
      </div>
      <label class="csim-review-block">${esc(t('notes'))}<textarea data-r="notes" rows="3">${esc(rec.notes)}</textarea></label>
      <div class="csim-review-row">
        <input type="text" data-r="issueText" placeholder="${esc(t('issuePlaceholder'))}" aria-label="${esc(t('issuePlaceholder'))}">
        <button type="button" class="csim-rbtn" data-r="addIssue">${esc(t('addIssue'))}</button>
      </div>
      <ol class="csim-review-issues" aria-label="${esc(t('issues'))}">${rec.issues.map((i, k) => `<li><span>p=${i.p.toFixed(3)} — ${esc(i.text)}</span> <button type="button" class="csim-rbtn" data-del="${k}">${esc(t('remove'))}</button></li>`).join('')}</ol>
      <div class="csim-review-row">
        <button type="button" class="csim-rbtn" data-r="export">${esc(t('export'))}</button>
        <label class="csim-rbtn csim-review-import">${esc(t('import'))}<input type="file" accept="application/json,.json" data-r="importFile" hidden></label>
        <span class="csim-review-msg" role="status">${esc(msg)}</span>
      </div>`;
  }
  const q = (sel) => el.querySelector(sel);
  const stageId = () => STAGES[api.getState().stageIndex].id;
  const commit = () => { save(data); };

  api.listen(el, 'change', (e) => {
    const tg = e.target;
    if (tg.dataset.r === 'stage') api.goToStage(Number(tg.value));
    else if (tg.dataset.r === 'speed') api.setSpeed(Number(tg.value));
    else if (tg.dataset.r === 'status') { data.stages[stageId()].status = STATUSES.includes(tg.value) ? tg.value : 'pending'; commit(); }
    else if (tg.dataset.layer) api.setLayer(tg.dataset.layer, tg.checked);
    else if (tg.dataset.r === 'importFile' && tg.files && tg.files[0]) {
      const f = tg.files[0];
      f.text().then((txt) => {
        let n = null;
        try { n = normaliseReview(JSON.parse(txt)); } catch { n = null; }
        if (!n) { msg = t('importError'); render(); return; }
        data = n;
        msg = n.modelVersion === MODEL_VERSION ? t('imported') : t('importedOther').replace('{v}', n.modelVersion).replace('{c}', MODEL_VERSION);
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
    else if (b.dataset.r === 'stepBack') api.step(-1);
    else if (b.dataset.r === 'stepFwd') api.step(1);
    else if (b.dataset.r === 'shot') {
      const st = api.getState();
      const url = api.screenshot();
      if (url) download(`cataract-sim-stage${st.stageIndex + 1}-p${st.stageProgress.toFixed(3)}.png`, url);
    } else if (b.dataset.r === 'addIssue') {
      const input = q('[data-r="issueText"]');
      const text = input.value.trim();
      if (!text) return;
      const st = api.getState();
      data.stages[stageId()].issues.push({ text, p: st.stageProgress, camera: st.camera ? [...st.camera.target, st.camera.distance, st.camera.azimuth, st.camera.polar] : null, createdAt: new Date().toISOString() });
      commit(); render();
    } else if (b.dataset.del !== undefined) {
      data.stages[stageId()].issues.splice(Number(b.dataset.del), 1);
      commit(); render();
    } else if (b.dataset.r === 'export') {
      const out = { ...data, format: REVIEW_FORMAT, modelVersion: MODEL_VERSION, exportedAt: new Date().toISOString() };
      const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
      download(`cataract-sim-review-${MODEL_VERSION}.json`, url);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });

  render();
  return {
    el,
    refresh() { msg = ''; render(); },
    updatePosition() { const o = q('[data-r="pos"]'); if (o) o.textContent = `p = ${api.getState().stageProgress.toFixed(3)}`; },
    get data() { return JSON.parse(JSON.stringify(data)); },
    destroy() { el.remove(); }
  };
}
