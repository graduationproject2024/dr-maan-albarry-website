// DOM, ARIA and i18n for the simulator. Builds the complete UI inside the host; owns no 3-D state.
import { STAGES, STRUCTURES } from './stages.js';
import { stageDiagram } from './fallback.js';

export const I18N = {
  en: {
    eyebrow: 'Patient education · 3D',
    title: 'Cataract surgery, step by step',
    close: 'Back to site',
    start: 'Start the walkthrough',
    startHint: 'Seven short steps · about one minute',
    play: 'Play', pause: 'Pause', replay: 'Replay',
    prev: 'Previous stage', next: 'Next stage',
    replayStage: 'Replay this stage', restart: 'Restart from the beginning',
    zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetView: 'Reset view',
    labels: 'Anatomy labels', cutaway: 'Cross-section view',
    touch: 'Explore 3D', touchDone: 'Done exploring',
    touchHint: 'Tap “Explore 3D” to rotate with one finger; pinch to zoom.',
    viewport: '3D model of the eye. Drag to rotate, scroll or use the zoom buttons to zoom. Arrow keys change stage, Space plays or pauses.',
    viewTools: 'View controls', playback: 'Playback controls', timeline: 'Procedure timeline',
    scrubber: 'Playback position',
    stageOf: 'Stage {n} of {t}',
    focus: 'What you are seeing',
    anatomy: 'Explore the anatomy',
    anatomyHint: 'Choose a structure to focus the camera on it.',
    review: 'Draft — pending physician review',
    learnMore: 'Sources and review status',
    sourcesIntro: 'General background drawn from these public patient-education resources:',
    reviewStatus: 'Status: draft wording, not yet reviewed or approved by Dr. Maan Albarry.',
    loading: 'Preparing the 3D eye model…',
    restoring: 'The 3D view was interrupted. Restoring…',
    fallbackNote: '3D view isn’t available on this device, so each stage is shown as an illustrated diagram.',
    disclaimer: 'Illustrative patient education only — not a substitute for a consultation with your eye doctor. Simplified animation; content pending physician review.',
    announcePlaying: 'Playing', announcePaused: 'Paused', announceCompleted: 'Walkthrough complete. Press Replay to watch again.',
    announceRestored: '3D view restored.',
    rayNote: 'Illustrative light path — simplified model eye, not a vision test'
  },
  ar: {
    eyebrow: 'تثقيف صحي · ثلاثي الأبعاد',
    title: 'جراحة الساد (الماء الأبيض) خطوة بخطوة',
    close: 'العودة إلى الموقع',
    start: 'ابدأ الجولة التوضيحية',
    startHint: 'سبع خطوات قصيرة · نحو دقيقة واحدة',
    play: 'تشغيل', pause: 'إيقاف مؤقت', replay: 'إعادة التشغيل',
    prev: 'المرحلة السابقة', next: 'المرحلة التالية',
    replayStage: 'إعادة هذه المرحلة', restart: 'البدء من جديد',
    zoomIn: 'تكبير', zoomOut: 'تصغير', resetView: 'إعادة ضبط العرض',
    labels: 'تسميات التشريح', cutaway: 'عرض المقطع العرضي',
    touch: 'استكشاف ثلاثي الأبعاد', touchDone: 'إنهاء الاستكشاف',
    touchHint: 'اضغط «استكشاف ثلاثي الأبعاد» للتدوير بإصبع واحد، وباعد بين إصبعين للتكبير.',
    viewport: 'نموذج ثلاثي الأبعاد للعين. اسحب للتدوير، واستخدم عجلة الفأرة أو أزرار التكبير. تُغيّر مفاتيح الأسهم المرحلة، ويُشغّل مفتاح المسافة العرض أو يوقفه.',
    viewTools: 'أدوات العرض', playback: 'أدوات التشغيل', timeline: 'المخطط الزمني للإجراء',
    scrubber: 'موضع التشغيل',
    stageOf: 'المرحلة {n} من {t}',
    focus: 'ما تراه الآن',
    anatomy: 'استكشف التشريح',
    anatomyHint: 'اختر جزءًا من العين لتوجيه الكاميرا إليه.',
    review: 'مسودة — بانتظار مراجعة الطبيب',
    learnMore: 'المصادر وحالة المراجعة',
    sourcesIntro: 'معلومات عامة مستندة إلى مصادر التثقيف الصحي العامة التالية:',
    reviewStatus: 'الحالة: صياغة مبدئية لم يراجعها أو يعتمدها د. معن البري بعد.',
    loading: 'جارٍ تجهيز نموذج العين ثلاثي الأبعاد…',
    restoring: 'توقّف العرض ثلاثي الأبعاد مؤقتًا. جارٍ الاستعادة…',
    fallbackNote: 'العرض ثلاثي الأبعاد غير متاح على هذا الجهاز، لذلك تُعرض كل مرحلة في رسم توضيحي.',
    disclaimer: 'محتوى توضيحي للتثقيف الصحي فقط، ولا يُغني عن استشارة طبيب العيون. الرسوم مبسّطة، والمحتوى قيد المراجعة الطبية.',
    announcePlaying: 'جارٍ التشغيل', announcePaused: 'متوقف مؤقتًا', announceCompleted: 'اكتملت الجولة. اضغط «إعادة التشغيل» للمشاهدة مرة أخرى.',
    announceRestored: 'تمت استعادة العرض ثلاثي الأبعاد.',
    rayNote: 'مسار ضوئي توضيحي — نموذج مبسّط للعين، وليس اختبارًا للنظر'
  }
};

const ICON = {
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
  pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>',
  replay: '<path d="M12 5a7 7 0 1 1-6.6 4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 4.5v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  prev: '<path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  next: '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  replayStage: '<path d="M6 5v14M18 6l-8 6 8 6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
  restart: '<path d="M5 12a7 7 0 1 0 2-4.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 3.5V8h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>',
  zoomIn: '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 8v6M8 11h6M15.5 15.5L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  zoomOut: '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11h6M15.5 15.5L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  reset: '<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  labels: '<path d="M4 5h9l7 7-7 7H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="8.5" cy="12" r="1.6" fill="currentColor"/>',
  cutaway: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 8 8h-8z" fill="currentColor"/>',
  touch: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-2.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 15.5a1.6 1.6 0 0 1 2.6-1.8L9 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
};
const icon = (name, cls = '') => `<svg class="csim-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[name]}</svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let uid = 0;

export function createUI(host, ctx) {
  const id = `csim${++uid}`;
  const S = { lang: ctx.lang, stage: 0, playing: false, state: 'loading', labels: false, cutaway: false, touch: false, focusId: null };
  const t = (k) => I18N[S.lang][k];
  const root = document.createElement('div');
  root.className = 'csim';
  root.setAttribute('data-theme', ctx.theme);
  root.setAttribute('data-state', 'loading');
  root.setAttribute('aria-labelledby', `${id}-title`);
  root.setAttribute('role', 'region');

  root.innerHTML = `
  <header class="csim-header">
    <div class="csim-heading">
      <p class="csim-eyebrow" data-i18n="eyebrow"></p>
      <h2 class="csim-title" id="${id}-title" data-i18n="title"></h2>
    </div>
    <button type="button" class="csim-btn csim-btn--ghost csim-close" data-ref="close">${icon('close', 'csim-icon--dir')}<span data-i18n="close"></span></button>
  </header>
  <div class="csim-body">
    <section class="csim-stagewrap">
      <div class="csim-viewport" data-ref="viewport" tabindex="0" role="group" data-i18n-label="viewport">
        <div class="csim-canvas-host" data-ref="canvasHost"></div>
        <div class="csim-vignette" aria-hidden="true"></div>
        <div class="csim-hotspots" data-ref="hotspots"></div>
        <div class="csim-fallback" data-ref="fallback" hidden>
          <div class="csim-fallback-art" data-ref="fallbackArt"></div>
          <p class="csim-fallback-note" data-ref="fallbackNote"></p>
        </div>
        <div class="csim-chip" aria-hidden="true"><span data-ref="chipNum"></span><span class="csim-chip-sep">·</span><span data-ref="chipTitle"></span></div>
        <div class="csim-viewtools" role="toolbar" data-i18n-label="viewTools" data-ref="viewtools">
          <button type="button" class="csim-tool" data-ref="zoomIn" data-i18n-label="zoomIn">${icon('zoomIn')}</button>
          <button type="button" class="csim-tool" data-ref="zoomOut" data-i18n-label="zoomOut">${icon('zoomOut')}</button>
          <button type="button" class="csim-tool" data-ref="resetView" data-i18n-label="resetView">${icon('reset')}</button>
          <button type="button" class="csim-tool" data-ref="labels" aria-pressed="false" data-i18n-label="labels">${icon('labels')}</button>
          <button type="button" class="csim-tool" data-ref="cutaway" aria-pressed="false" data-i18n-label="cutaway">${icon('cutaway')}</button>
          <button type="button" class="csim-tool csim-tool--touch" data-ref="touch" aria-pressed="false" data-i18n-label="touch" hidden>${icon('touch')}</button>
        </div>
        <div class="csim-overlay csim-overlay--loading" data-ref="loading" role="status">
          <span class="csim-spinner" aria-hidden="true"></span><span data-ref="loadingText"></span>
        </div>
        <div class="csim-overlay csim-overlay--start" data-ref="startOverlay" hidden>
          <button type="button" class="csim-btn csim-btn--primary csim-start" data-ref="start">${icon('play')}<span data-i18n="start"></span></button>
          <p class="csim-start-hint" data-i18n="startHint"></p>
        </div>
        <p class="csim-note" data-ref="note" role="status" hidden></p>
        <p class="csim-raynote" data-ref="rayNote" data-i18n="rayNote" hidden></p>
      </div>
      <div class="csim-playbar" role="group" data-i18n-label="playback">
        <div class="csim-transport">
          <button type="button" class="csim-btn csim-btn--icon" data-ref="prev" data-i18n-label="prev">${icon('prev', 'csim-icon--dir')}</button>
          <button type="button" class="csim-btn csim-btn--primary csim-btn--play" data-ref="playPause">${icon('play', 'csim-i-play')}${icon('pause', 'csim-i-pause')}${icon('replay', 'csim-i-replay')}<span data-ref="playLabel"></span></button>
          <button type="button" class="csim-btn csim-btn--icon" data-ref="next" data-i18n-label="next">${icon('next', 'csim-icon--dir')}</button>
          <button type="button" class="csim-btn csim-btn--icon" data-ref="replayStage" data-i18n-label="replayStage">${icon('replayStage', 'csim-icon--dir')}</button>
          <button type="button" class="csim-btn csim-btn--icon" data-ref="restart" data-i18n-label="restart">${icon('restart')}</button>
          <span class="csim-counter" data-ref="counter" aria-hidden="true"></span>
        </div>
        <div class="csim-timeline">
          <ol class="csim-segments" data-ref="segments" data-i18n-label="timeline"></ol>
          <input type="range" class="csim-scrubber" data-ref="scrubber" min="0" max="1000" step="1" value="0" data-i18n-label="scrubber">
        </div>
      </div>
    </section>
    <aside class="csim-panel" aria-labelledby="${id}-stage-title">
      <p class="csim-kicker" data-ref="stageNum"></p>
      <h3 class="csim-stage-title" id="${id}-stage-title" data-ref="stageTitle"></h3>
      <p class="csim-stage-text" data-ref="stageText"></p>
      <div class="csim-focus">
        <h4 data-i18n="focus"></h4>
        <p data-ref="stageFocus"></p>
      </div>
      <p class="csim-badge"><span class="csim-badge-dot" aria-hidden="true"></span><span data-i18n="review"></span></p>
      <details class="csim-details">
        <summary data-i18n="learnMore"></summary>
        <p class="csim-small" data-i18n="reviewStatus"></p>
        <p class="csim-small" data-i18n="sourcesIntro"></p>
        <ul class="csim-sources" data-ref="sources"></ul>
      </details>
      <section class="csim-anatomy" aria-labelledby="${id}-anat">
        <h4 id="${id}-anat" data-i18n="anatomy"></h4>
        <p class="csim-small" data-i18n="anatomyHint"></p>
        <div class="csim-chips" data-ref="anatomyList"></div>
        <div class="csim-anatomy-info" data-ref="anatomyInfo" aria-live="polite"></div>
      </section>
    </aside>
  </div>
  <p class="csim-disclaimer" role="note" data-i18n="disclaimer"></p>
  <div class="csim-sr" data-ref="live" aria-live="polite" aria-atomic="true"></div>`;

  const ref = {};
  root.querySelectorAll('[data-ref]').forEach((el) => { ref[el.dataset.ref] = el; });

  // timeline segments
  const total = STAGES.reduce((a, s) => a + s.duration, 0);
  ref.segments.innerHTML = STAGES.map((s, i) => `<li style="flex:${s.duration / total}"><button type="button" class="csim-seg" data-seg="${i}"><span class="csim-seg-fill"></span><span class="csim-seg-num" aria-hidden="true">${i + 1}</span></button></li>`).join('');
  const segBtns = [...ref.segments.querySelectorAll('.csim-seg')];
  const segFills = segBtns.map((b) => b.querySelector('.csim-seg-fill'));
  // anatomy chips
  ref.anatomyList.innerHTML = STRUCTURES.map((s) => `<button type="button" class="csim-chip-btn" data-structure="${s.id}" aria-pressed="false"></button>`).join('');
  const chipBtns = [...ref.anatomyList.querySelectorAll('[data-structure]')];
  // hotspots
  ref.hotspots.innerHTML = STRUCTURES.map((s) => `<button type="button" class="csim-hotspot" data-hotspot="${s.id}" hidden><span class="csim-hotspot-dot" aria-hidden="true"></span><span class="csim-hotspot-label"></span></button>`).join('');
  const hotspots = Object.fromEntries([...ref.hotspots.querySelectorAll('[data-hotspot]')].map((b) => [b.dataset.hotspot, b]));

  host.appendChild(root);
  const { listen } = ctx;
  const H = ctx.handlers;
  const on = (el, ev, fn) => listen(el, ev, fn);
  on(ref.close, 'click', () => H.close());
  on(ref.start, 'click', () => H.start());
  on(ref.playPause, 'click', () => H.playPause());
  on(ref.prev, 'click', () => H.prev());
  on(ref.next, 'click', () => H.next());
  on(ref.replayStage, 'click', () => H.replayStage());
  on(ref.restart, 'click', () => H.restart());
  on(ref.zoomIn, 'click', () => H.zoom(1));
  on(ref.zoomOut, 'click', () => H.zoom(-1));
  on(ref.resetView, 'click', () => H.resetView());
  on(ref.labels, 'click', () => H.toggleLabels());
  on(ref.cutaway, 'click', () => H.toggleCutaway());
  on(ref.touch, 'click', () => H.toggleTouch());
  on(ref.scrubber, 'input', () => H.scrub(Number(ref.scrubber.value) / 1000));
  on(ref.segments, 'click', (e) => { const b = e.target.closest('[data-seg]'); if (b) H.goTo(Number(b.dataset.seg)); });
  on(ref.anatomyList, 'click', (e) => { const b = e.target.closest('[data-structure]'); if (b) H.focusStructure(b.dataset.structure); });
  on(ref.hotspots, 'click', (e) => { const b = e.target.closest('[data-hotspot]'); if (b) H.focusStructure(b.dataset.hotspot); });
  on(root, 'keydown', (e) => H.keydown(e));

  function applyText() {
    root.setAttribute('lang', S.lang);
    root.setAttribute('dir', S.lang === 'ar' ? 'rtl' : 'ltr');
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-label]').forEach((el) => {
      const v = t(el.dataset.i18nLabel);
      el.setAttribute('aria-label', v);
      if (el.tagName === 'BUTTON') el.setAttribute('title', v);
    });
    ref.loadingText.textContent = t('loading');
    ref.fallbackNote.textContent = t('fallbackNote');
    ref.touch.setAttribute('aria-label', t(S.touch ? 'touchDone' : 'touch'));
    ref.touch.setAttribute('title', t(S.touch ? 'touchDone' : 'touch'));
    segBtns.forEach((b, i) => {
      b.setAttribute('aria-label', `${t('stageOf').replace('{n}', i + 1).replace('{t}', STAGES.length)}: ${STAGES[i].title[S.lang]}`);
    });
    chipBtns.forEach((b) => { b.textContent = STRUCTURES.find((s) => s.id === b.dataset.structure).name[S.lang]; });
    for (const [sid, b] of Object.entries(hotspots)) {
      const name = STRUCTURES.find((s) => s.id === sid).name[S.lang];
      b.querySelector('.csim-hotspot-label').textContent = name;
      b.setAttribute('aria-label', name);
    }
    renderStage();
    renderPlay();
    renderAnatomyInfo();
    if (!ref.note.hidden && ref.note.dataset.key) ref.note.textContent = t(ref.note.dataset.key);
  }

  function stageLabel(i) { return t('stageOf').replace('{n}', i + 1).replace('{t}', STAGES.length); }

  function renderStage() {
    const s = STAGES[S.stage];
    ref.stageNum.textContent = stageLabel(S.stage);
    ref.stageTitle.textContent = s.title[S.lang];
    ref.stageText.textContent = s.text[S.lang];
    ref.stageFocus.textContent = s.focus[S.lang];
    ref.chipNum.textContent = `${S.stage + 1}/${STAGES.length}`;
    ref.chipTitle.textContent = s.title[S.lang];
    ref.counter.textContent = stageLabel(S.stage);
    ref.sources.innerHTML = s.review.sources.map((src) => `<li><a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">${esc(src.name)}</a></li>`).join('');
    segBtns.forEach((b, i) => {
      if (i === S.stage) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('is-done', i < S.stage);
    });
    ref.prev.disabled = S.stage === 0;
    ref.next.disabled = S.stage === STAGES.length - 1;
    if (!ref.fallback.hidden) ref.fallbackArt.innerHTML = stageDiagram(S.stage, esc(s.title[S.lang]));
  }

  function renderPlay() {
    const completed = S.state === 'completed';
    const mode = completed ? 'replay' : S.playing ? 'pause' : 'play';
    ref.playPause.dataset.mode = mode;
    ref.playLabel.textContent = t(mode);
    ref.playPause.setAttribute('aria-label', t(mode));
  }

  function renderAnatomyInfo() {
    chipBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.structure === S.focusId)));
    if (!S.focusId) { ref.anatomyInfo.innerHTML = ''; return; }
    const s = STRUCTURES.find((x) => x.id === S.focusId);
    ref.anatomyInfo.innerHTML = `<strong>${esc(s.name[S.lang])}</strong><span>${esc(s.desc[S.lang])}</span>`;
  }

  const ui = {
    root, ref,
    get lang() { return S.lang; },
    t,
    setLang(lang) { S.lang = lang; applyText(); },
    setTheme(theme) { root.setAttribute('data-theme', theme); },
    setState(state, playing) {
      S.state = state; S.playing = playing;
      root.setAttribute('data-state', state);
      ref.loading.hidden = state !== 'loading';
      renderPlay();
    },
    setStage(i) { S.stage = i; renderStage(); },
    setProgress(global, stageIndex, stageP) {
      if (document.activeElement !== ref.scrubber || !ctx.isScrubbing()) ref.scrubber.value = String(Math.round(global * 1000));
      const pct = Math.round(global * 100);
      ref.scrubber.setAttribute('aria-valuetext', `${stageLabel(stageIndex)} — ${STAGES[stageIndex].title[S.lang]} (${pct}%)`);
      segFills.forEach((f, i) => { f.style.transform = `scaleX(${i < stageIndex ? 1 : i === stageIndex ? stageP : 0})`; });
    },
    showStart(v) { ref.startOverlay.hidden = !v; },
    showFallback(v) {
      ref.fallback.hidden = !v;
      root.classList.toggle('csim--fallback', v);
      if (v) renderStage();
    },
    showNote(key) {
      if (!key) { ref.note.hidden = true; ref.note.dataset.key = ''; return; }
      ref.note.hidden = false; ref.note.dataset.key = key; ref.note.textContent = t(key);
    },
    setRayNote(v) { if (ref.rayNote.hidden === v) ref.rayNote.hidden = !v; },
    setLoadingProgress(pct) { ref.loadingText.textContent = `${t('loading')} ${Math.round(pct)}%`; },
    setLabels(v) { S.labels = v; ref.labels.setAttribute('aria-pressed', String(v)); root.classList.toggle('csim--labels', v); if (!v) Object.values(hotspots).forEach((b) => { b.hidden = true; }); },
    setCutaway(v) { S.cutaway = v; ref.cutaway.setAttribute('aria-pressed', String(v)); },
    setTouchCapable(v) { ref.touch.hidden = !v; },
    setTouch(v) {
      S.touch = v;
      ref.touch.setAttribute('aria-pressed', String(v));
      ref.touch.setAttribute('aria-label', t(v ? 'touchDone' : 'touch'));
      root.classList.toggle('csim--touch-active', v);
    },
    setFocus(id) { S.focusId = id; renderAnatomyInfo(); },
    updateHotspots(list) {
      for (const h of list) {
        const b = hotspots[h.id];
        if (!b) continue;
        const show = S.labels && h.visible;
        if (b.hidden === show) b.hidden = !show;
        if (show) b.style.transform = `translate(${h.x.toFixed(1)}px, ${h.y.toFixed(1)}px)`;
      }
    },
    announce(text) {
      ref.live.textContent = '';
      // next frame so repeated identical messages are still announced
      setTimeout(() => { if (root.isConnected) ref.live.textContent = text; }, 30);
    },
    stageLabel,
    destroy() { root.remove(); }
  };
  applyText();
  return ui;
}
