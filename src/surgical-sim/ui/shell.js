// Simulator interface shared by every procedure: header with technique tabs, 3D viewport with view tools and anatomical
// labels, playback bar, camera / anatomy / option controls, and an explanation panel whose ordered stage list is also
// the complete non-3D alternative (it is all the content, as text, and it stays usable when WebGL is unavailable).
import './styles.css';

const T = {
  ar: {
    eyebrow: 'تجربة تعليمية ثلاثية الأبعاد', play: 'تشغيل', pause: 'إيقاف مؤقت', prev: 'المرحلة السابقة', next: 'المرحلة التالية',
    stage: 'المرحلة', of: 'من', timeline: 'التقدم خلال المراحل', close: 'إغلاق التجربة', stages: 'المراحل',
    views: 'زاوية العرض', anatomy: 'إظهار الأجزاء', section: 'مقطع عرضي', labels: 'الأسماء', explore: 'تدوير بإصبع واحد',
    expand: 'ملء الشاشة', collapse: 'إنهاء ملء الشاشة', zoomIn: 'تكبير', zoomOut: 'تصغير', resetView: 'إعادة زاوية العرض', restart: 'البدء من جديد',
    loading: 'جارٍ تجهيز النموذج ثلاثي الأبعاد…', tools: 'أدوات العرض', technique: 'التقنية',
    hint: 'اسحب لتدوير النموذج · Ctrl + عجلة الفأرة للتكبير · الأسهم من لوحة المفاتيح',
    hintTouch: 'اسحب أفقياً للتدوير · قرّب بإصبعين للتكبير · فعّل «تدوير بإصبع واحد» للتدوير الحر',
    note: 'نموذج تعليمي توضيحي مبسّط، وليس تخطيطاً لعمليتك. المحتوى الجديد بانتظار المراجعة الطبية من الطبيب.',
    simplified: 'ما الذي بُسّط في هذا النموذج؟', sources: 'المصادر',
    fbWebgl: 'لا يدعم هذا الجهاز أو المتصفح العرض ثلاثي الأبعاد. المراحل نفسها مشروحة كتابةً أدناه.',
    fbError: 'تعذر تشغيل العرض ثلاثي الأبعاد. المراحل نفسها مشروحة كتابةً أدناه.',
    lost: 'توقف العرض مؤقتاً لأن المتصفح أعاد تشغيل الرسوميات. سيعود تلقائياً.',
    canvas: 'نموذج ثلاثي الأبعاد للعين'
  },
  en: {
    eyebrow: 'Interactive 3D education', play: 'Play', pause: 'Pause', prev: 'Previous stage', next: 'Next stage',
    stage: 'Stage', of: 'of', timeline: 'Progress through the stages', close: 'Close the 3D experience', stages: 'Stages',
    views: 'View', anatomy: 'Show structures', section: 'Cross-section', labels: 'Labels', explore: 'One-finger rotate',
    expand: 'Full screen', collapse: 'Exit full screen', zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetView: 'Reset the view', restart: 'Start again',
    loading: 'Preparing the 3D model…', tools: 'View tools', technique: 'Technique',
    hint: 'Drag to rotate · Ctrl + scroll to zoom · arrow keys work too',
    hintTouch: 'Drag sideways to rotate · pinch to zoom · turn on “One-finger rotate” to turn freely',
    note: 'A simplified educational model, not a plan of your operation. New material is awaiting the doctor’s medical review.',
    simplified: 'What this model simplifies', sources: 'Sources',
    fbWebgl: 'This device or browser cannot show the 3D view. The same stages are explained in writing below.',
    fbError: 'The 3D view could not start. The same stages are explained in writing below.',
    lost: 'The view paused because the browser restarted its graphics. It will come back by itself.',
    canvas: '3D model of the eye'
  }
};

const ICON = {
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
  prev: '<path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2"/>',
  next: '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/>',
  close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2"/>',
  section: '<path d="M12 3v18M5 7a9 9 0 0 0 0 10M19 7a9 9 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 5a7 7 0 0 1 0 14z" opacity=".35"/>',
  labels: '<path d="M4 6h10l5 6-5 6H4z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="12" r="1.6"/>',
  explore: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a5.5 5.5 0 0 1-5.5 5.5h-.6a5 5 0 0 1-3.9-1.9L5 14.5a1.4 1.4 0 0 1 2.1-1.9L9 14" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  zoomIn: '<circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l5 5M8 10.5h5M10.5 8v5" stroke="currentColor" stroke-width="1.8"/>',
  zoomOut: '<circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l5 5M8 10.5h5" stroke="currentColor" stroke-width="1.8"/>',
  resetView: '<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="1.8"/>',
  restart: '<path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8"/>'
};
const svg = (name, cls = '') => `<svg class="ssim-icon ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${ICON[name]}</svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const L = (v, lang) => (v && typeof v === 'object' ? (v[lang] ?? v.en) : v);
let uid = 0;

export function createShell(host, { def, lang, theme, track, action }) {
  const id = `ssim-${++uid}`;
  const root = document.createElement('div');
  root.className = 'ssim';
  root.dataset.procedure = def.slug;
  const touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  let cur = { lang, theme };
  let labelNodes = [];
  let notice = null, fb = null;

  root.innerHTML = `
    <header class="ssim-header">
      <div class="ssim-heading">
        <p class="ssim-eyebrow" data-t="eyebrow"></p>
        <h3 class="ssim-title" id="${id}-title"></h3>
      </div>
      <button type="button" class="ssim-btn ssim-btn--icon ssim-close" data-act="close">${svg('close')}</button>
    </header>
    <div class="ssim-variants" role="tablist" hidden></div>
    <div class="ssim-body">
      <div class="ssim-stagewrap">
        <div class="ssim-viewport">
          <div class="ssim-canvas-host"></div>
          <div class="ssim-labels" aria-hidden="true"></div>
          <p class="ssim-chip" aria-hidden="true"></p>
          <div class="ssim-viewtools" role="toolbar">
            <button type="button" class="ssim-tool" data-act="section" aria-pressed="false">${svg('section')}</button>
            <button type="button" class="ssim-tool" data-act="labels" aria-pressed="true">${svg('labels')}</button>
            <button type="button" class="ssim-tool ssim-tool--touch" data-act="explore" aria-pressed="false">${svg('explore')}</button>
            <button type="button" class="ssim-tool" data-act="expand" aria-pressed="false">${svg('expand')}</button>
            <button type="button" class="ssim-tool" data-act="zoomIn">${svg('zoomIn')}</button>
            <button type="button" class="ssim-tool" data-act="zoomOut">${svg('zoomOut')}</button>
            <button type="button" class="ssim-tool" data-act="resetView">${svg('resetView')}</button>
          </div>
          <div class="ssim-overlay ssim-overlay--loading" role="status"><span class="ssim-spinner" aria-hidden="true"></span><span data-t="loading"></span></div>
          <p class="ssim-notice" role="status" hidden></p>
          <p class="ssim-hint"></p>
        </div>
        <div class="ssim-playbar">
          <button type="button" class="ssim-btn ssim-btn--icon" data-act="prev">${svg('prev', 'ssim-icon--dir')}</button>
          <button type="button" class="ssim-btn ssim-btn--primary ssim-play" data-act="play">${svg('play')}<span class="ssim-play-label"></span></button>
          <button type="button" class="ssim-btn ssim-btn--icon" data-act="next">${svg('next', 'ssim-icon--dir')}</button>
          <input class="ssim-range" type="range" min="0" max="1000" step="1" value="0">
          <span class="ssim-count" aria-hidden="true"></span>
          <button type="button" class="ssim-btn ssim-btn--icon ssim-btn--ghost" data-act="reset">${svg('restart')}</button>
        </div>
        <div class="ssim-controls">
          <div class="ssim-group ssim-cams" role="group"></div>
          <div class="ssim-group ssim-toggles" role="group"></div>
          <div class="ssim-group ssim-options"></div>
        </div>
      </div>
      <aside class="ssim-panel">
        <div class="ssim-now" aria-live="polite">
          <p class="ssim-now-n"></p>
          <h4 class="ssim-now-title"></h4>
          <p class="ssim-now-text"></p>
          <p class="ssim-now-extra" hidden></p>
        </div>
        <p class="ssim-fallback" role="status" hidden></p>
        <h4 class="ssim-list-title" data-t="stages"></h4>
        <ol class="ssim-list"></ol>
        <p class="ssim-note"></p>
        <details class="ssim-simpl"><summary data-t="simplified"></summary><ul></ul><p class="ssim-sources-k" data-t="sources"></p><ul class="ssim-sources"></ul></details>
      </aside>
    </div>`;
  host.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const viewport = $('.ssim-viewport'), canvasHost = $('.ssim-canvas-host'), labelLayer = $('.ssim-labels');
  const range = $('.ssim-range');
  root.setAttribute('aria-labelledby', `${id}-title`);
  root.setAttribute('role', 'region');

  const offs = [];
  offs.push(track(root, 'click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b && root.contains(b)) {
      const a = b.dataset.act;
      const pressed = b.getAttribute('aria-pressed');
      if (pressed !== null && ['section', 'labels', 'explore', 'expand'].includes(a)) return action(a, pressed !== 'true');
      return action(a);
    }
    const s = e.target.closest('[data-stage]');
    if (s) return action('stage', Number(s.dataset.stage));
    const v = e.target.closest('[data-variant]');
    if (v) return action('variant', v.dataset.variant);
    const c = e.target.closest('[data-cam]');
    if (c) return action('camera', c.dataset.cam);
    const o = e.target.closest('[data-option]');
    if (o) return action('option', [o.dataset.option, o.dataset.value]);
    return undefined;
  }));
  offs.push(track(root, 'change', (e) => {
    const t = e.target.closest('[data-toggle]');
    if (t) action('toggle', [t.dataset.toggle, t.checked]);
  }));
  offs.push(track(range, 'input', () => action('seek', Number(range.value) / 1000)));
  offs.push(track(root, 'keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('ssim--expanded')) { e.preventDefault(); action('expand', false); }
    // arrow keys move between technique tabs
    const tab = e.target.closest('[data-variant]');
    if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const tabs = [...root.querySelectorAll('[data-variant]')];
      const rtl = cur.lang === 'ar';
      const dir = (e.key === 'ArrowRight') !== rtl ? 1 : -1;
      const next = tabs[(tabs.indexOf(tab) + dir + tabs.length) % tabs.length];
      next.focus(); action('variant', next.dataset.variant);
    }
    if (e.target.tagName === 'CANVAS' && (e.key === ' ' || e.key === 'k')) { e.preventDefault(); action('play'); }
  }));

  function staticText() {
    const t = T[cur.lang];
    root.lang = cur.lang; root.dir = cur.lang === 'ar' ? 'rtl' : 'ltr';
    root.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t[el.dataset.t]; });
    $('.ssim-title').textContent = L(def.title, cur.lang);
    $('.ssim-close').setAttribute('aria-label', t.close);
    const tools = { section: t.section, labels: t.labels, explore: t.explore, expand: t.expand, zoomIn: t.zoomIn, zoomOut: t.zoomOut, resetView: t.resetView };
    root.querySelectorAll('.ssim-tool').forEach((b) => { const l = tools[b.dataset.act]; b.setAttribute('aria-label', l); b.title = l; });
    $('.ssim-viewtools').setAttribute('aria-label', t.tools);
    $('[data-act="prev"]').setAttribute('aria-label', t.prev);
    $('[data-act="next"]').setAttribute('aria-label', t.next);
    $('[data-act="reset"]').setAttribute('aria-label', t.restart);
    $('[data-act="reset"]').title = t.restart;
    range.setAttribute('aria-label', t.timeline);
    $('.ssim-hint').textContent = touch ? t.hintTouch : t.hint;
    $('.ssim-note').textContent = L(def.note, cur.lang) || t.note;
    $('.ssim-simpl ul').innerHTML = (def.simplifications || []).map((s) => `<li>${esc(L(s, cur.lang))}</li>`).join('');
    $('.ssim-sources').innerHTML = (def.sources || []).map(([label, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('');
    const canvas = canvasHost.querySelector('canvas');
    if (canvas) canvas.setAttribute('aria-label', `${t.canvas}: ${L(def.title, cur.lang)}`);
    const vt = $('.ssim-variants');
    if (def.variants) {
      vt.hidden = false;
      vt.setAttribute('aria-label', t.technique);
      vt.innerHTML = def.variants.map((v) => `<button type="button" role="tab" class="ssim-tab" data-variant="${v.id}">${esc(L(v.label, cur.lang))}</button>`).join('');
    }
    $('.ssim-cams').setAttribute('aria-label', t.views);
    $('.ssim-cams').innerHTML = Object.entries(def.cameras).filter(([, c]) => c.label).map(([k, c]) => `<button type="button" class="ssim-seg" data-cam="${k}">${esc(L(c.label, cur.lang))}</button>`).join('');
    $('.ssim-toggles').setAttribute('aria-label', t.anatomy);
    $('.ssim-toggles').innerHTML = (def.toggles || []).map((tg) => `<label class="ssim-check"><input type="checkbox" data-toggle="${tg.id}"><span>${esc(L(tg.label, cur.lang))}</span></label>`).join('');
    $('.ssim-options').innerHTML = (def.options || []).map((o) => `<div class="ssim-opt" role="group" aria-label="${esc(L(o.label, cur.lang))}"><p class="ssim-opt-k">${esc(L(o.label, cur.lang))}</p><div class="ssim-opt-row">${o.choices.map((c) => `<button type="button" class="ssim-seg" data-option="${o.id}" data-value="${c.id}" aria-pressed="false">${esc(L(c.label, cur.lang))}</button>`).join('')}</div></div>`).join('');
    labelNodes.forEach((n) => n.remove()); labelNodes = [];
    if (fb) showFallback(fb);
    if (notice) setNotice(notice);
  }
  staticText();

  let lastList = '';
  function update(v) {
    const t = T[cur.lang];
    root.dataset.state = v.state;
    root.dataset.theme = cur.theme;
    root.classList.toggle('ssim--expanded', !!v.expanded);
    root.classList.toggle('ssim--explore', !!v.explore);
    const st = v.stages[v.index] || v.stages[0];
    const n = `${t.stage} ${v.index + 1} ${t.of} ${v.stages.length}`;
    $('.ssim-chip').textContent = `${v.index + 1}/${v.stages.length} · ${L(st.title, cur.lang)}`;
    $('.ssim-now-n').textContent = n;
    $('.ssim-now-title').textContent = L(st.title, cur.lang);
    $('.ssim-now-text').textContent = L(st.text, cur.lang);
    const ex0 = $('.ssim-now-extra');
    ex0.hidden = !v.extra;
    ex0.textContent = v.extra ? L(v.extra, cur.lang) : '';
    const listKey = `${cur.lang}|${v.variant}|${v.stages.map((s) => s.id).join(',')}`;
    if (listKey !== lastList) {
      lastList = listKey;
      $('.ssim-list').innerHTML = v.stages.map((s, i) => `<li><button type="button" class="ssim-stage" data-stage="${i}"><span class="ssim-stage-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="ssim-stage-body"><span class="ssim-stage-t">${esc(L(s.title, cur.lang))}</span><span class="ssim-stage-d">${esc(L(s.text, cur.lang))}</span></span></button></li>`).join('');
    }
    root.querySelectorAll('.ssim-stage').forEach((b, i) => { if (i === v.index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    const play = $('.ssim-play');
    play.innerHTML = `${svg(v.playing ? 'pause' : 'play')}<span class="ssim-play-label">${v.playing ? t.pause : t.play}</span>`;
    play.setAttribute('aria-pressed', v.playing ? 'true' : 'false');
    const off = v.state === 'fallback' || v.state === 'loading';
    play.disabled = off;
    range.disabled = off;
    $('[data-act="prev"]').disabled = v.index <= 0;
    $('[data-act="next"]').disabled = v.index >= v.stages.length - 1;
    $('.ssim-count').textContent = `${v.index + 1}/${v.stages.length}`;
    range.setAttribute('aria-valuetext', `${n}: ${L(st.title, cur.lang)}`);
    const pressed = { section: v.section, labels: v.labels, explore: v.explore, expand: v.expanded };
    root.querySelectorAll('.ssim-tool[aria-pressed]').forEach((b) => b.setAttribute('aria-pressed', pressed[b.dataset.act] ? 'true' : 'false'));
    const ex = $('[data-act="expand"]'); const exl = v.expanded ? t.collapse : t.expand; ex.setAttribute('aria-label', exl); ex.title = exl;
    root.querySelectorAll('[data-variant]').forEach((b) => { const on = b.dataset.variant === v.variant; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    root.querySelectorAll('[data-toggle]').forEach((c) => { c.checked = !!v.toggles[c.dataset.toggle]; });
    root.querySelectorAll('[data-option]').forEach((b) => b.setAttribute('aria-pressed', v.options[b.dataset.option] === b.dataset.value ? 'true' : 'false'));
    setProgress(v.progress);
  }
  function setProgress(p) {
    if (document.activeElement !== range) range.value = String(Math.round(p * 1000));
  }
  function showFallback(reason) {
    fb = reason;
    root.classList.add('ssim--fallback');
    const el = $('.ssim-fallback');
    el.hidden = false;
    el.textContent = T[cur.lang][reason === 'webgl' ? 'fbWebgl' : 'fbError'];
    setLoading(false);
  }
  function setLoading(on) { $('.ssim-overlay--loading').hidden = !on; }
  function setNotice(key) {
    notice = key;
    const el = $('.ssim-notice');
    el.hidden = !key;
    el.textContent = key ? T[cur.lang][key] : '';
  }
  function labelEls(items, l) {
    if (labelNodes.length !== items.length) {
      labelNodes.forEach((n) => n.remove());
      labelNodes = items.map((it) => {
        const s = document.createElement('span');
        s.className = 'ssim-label';
        s.dataset.label = it.id;
        s.textContent = L(it.text, l);
        labelLayer.appendChild(s);
        return s;
      });
    }
    return labelNodes;
  }
  return {
    root, viewport, canvasHost, labelLayer, update, setProgress, showFallback, setLoading, setNotice, labelEls,
    setLang(l) { cur.lang = l; staticText(); },
    setTheme(th) { cur.theme = th; root.dataset.theme = th; },
    destroy() { offs.forEach((o) => o()); root.remove(); }
  };
}
