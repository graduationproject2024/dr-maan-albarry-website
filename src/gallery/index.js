// Photo gallery — "محطات من مسيرتي العلمية والمهنية" (owner brief 2026-11-23, §24–26). Lightweight, no dependencies.
//
// API: mount(host, { lang: 'ar'|'en', photos, categories, category? }) → { destroy, setLang, getState, open, close, setCategory }
//   photos      entries from clinical-profile.js GALLERY that passed isPublishablePhoto() (the caller filters)
//   categories  clinical-profile.js GALLERY_CATEGORIES
// Grid: an editorial column layout that keeps each photograph's own aspect ratio (no face-cropping). Lightbox: a
// modal <dialog> with previous / next, arrow keys, swipe, Esc, and focus returned to the thumbnail that opened it.
import './styles.css';

export const counters = { mounts: 0, destroys: 0, live: 0 };
const T = {
  ar: { all: 'الكل', filter: 'تصفية الصور حسب الفئة', open: 'تكبير الصورة', close: 'إغلاق', prev: 'الصورة السابقة', next: 'الصورة التالية', of: 'من', empty: 'لا توجد صور منشورة في هذه الفئة بعد.', viewer: 'عارض الصور' },
  en: { all: 'All', filter: 'Filter photos by category', open: 'Enlarge photo', close: 'Close', prev: 'Previous photo', next: 'Next photo', of: 'of', empty: 'No photos have been published in this category yet.', viewer: 'Photo viewer' }
};
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let uid = 0;

export function mount(host, o = {}) {
  if (!host || host.nodeType !== 1) throw new TypeError('gallery mount(host): host must be an element');
  counters.mounts++; counters.live++;
  const id = `gal${++uid}`;
  const st = { lang: o.lang === 'en' ? 'en' : 'ar', cat: 'all', index: -1, opener: null, destroyed: false };
  const photos = Array.isArray(o.photos) ? o.photos.slice() : [];
  const cats = (o.categories || []).filter((c) => photos.some((p) => p.category === c.id));
  if (o.category && cats.some((c) => c.id === o.category)) st.cat = o.category;
  const offs = [];
  const on = (el, type, fn, opt) => { el.addEventListener(type, fn, opt); offs.push(() => el.removeEventListener(type, fn, opt)); };
  const root = document.createElement('div');
  root.className = 'gal';
  host.appendChild(root);

  const shown = () => photos.filter((p) => st.cat === 'all' || p.category === st.cat);
  const L = (x) => (x && typeof x === 'object' ? x[st.lang] || x.en || '' : x || '');
  const meta = (p) => [p.event, p.location, p.date].filter(Boolean).map((m) => esc(L(m))).join(' · ');

  function render() {
    const t = T[st.lang];
    root.lang = st.lang; root.dir = st.lang === 'ar' ? 'rtl' : 'ltr';
    const list = shown();
    root.innerHTML = `
      ${cats.length > 1 ? `<div class="gal-filter" role="group" aria-label="${t.filter}">
        <button type="button" class="gal-chip" data-cat="all" aria-pressed="${st.cat === 'all'}">${t.all} <span class="gal-count">${photos.length}</span></button>
        ${cats.map((c) => `<button type="button" class="gal-chip" data-cat="${esc(c.id)}" aria-pressed="${st.cat === c.id}">${esc(c[st.lang])} <span class="gal-count">${photos.filter((p) => p.category === c.id).length}</span></button>`).join('')}
      </div>` : ''}
      ${list.length ? `<ul class="gal-grid">${list.map((p, i) => `
        <li class="gal-item">
          <figure>
            <button type="button" class="gal-thumb" data-open="${i}" aria-label="${t.open}: ${esc(L(p.alt))}">
              <img src="${esc(p.thumbnail || p.image)}" width="${p.width}" height="${p.height}" alt="" loading="lazy" decoding="async">
            </button>
            <figcaption><span class="gal-cap">${esc(L(p.caption))}</span>${meta(p) ? `<span class="gal-meta">${meta(p)}</span>` : ''}</figcaption>
          </figure>
        </li>`).join('')}</ul>` : `<p class="gal-empty">${t.empty}</p>`}
      <dialog class="gal-box" aria-labelledby="${id}-cap">
        <div class="gal-box-in">
          <button type="button" class="gal-x" data-act="close" aria-label="${t.close}">×</button>
          <figure class="gal-box-fig"><img class="gal-box-img" alt=""><figcaption id="${id}-cap" class="gal-box-cap"></figcaption></figure>
          <div class="gal-box-nav">
            <button type="button" class="gal-nav" data-act="prev" aria-label="${t.prev}"><span aria-hidden="true">‹</span></button>
            <span class="gal-pos" aria-live="polite"></span>
            <button type="button" class="gal-nav" data-act="next" aria-label="${t.next}"><span aria-hidden="true">›</span></button>
          </div>
        </div>
      </dialog>`;
    if (st.index >= 0) showPhoto(st.index);
  }

  const box = () => root.querySelector('.gal-box');
  function showPhoto(i) {
    const list = shown(); const t = T[st.lang];
    if (!list.length) return;
    st.index = (i + list.length) % list.length;
    const p = list[st.index];
    const img = root.querySelector('.gal-box-img');
    img.src = p.image; img.alt = L(p.alt); img.width = p.width; img.height = p.height;
    root.querySelector('.gal-box-cap').innerHTML = `<span class="gal-cap">${esc(L(p.caption))}</span>${meta(p) ? `<span class="gal-meta">${meta(p)}</span>` : ''}`;
    root.querySelector('.gal-pos').textContent = `${st.index + 1} ${t.of} ${list.length}`;
    root.querySelectorAll('.gal-nav').forEach((b) => { b.hidden = list.length < 2; });
  }
  function open(i, opener = null) {
    const d = box(); if (!d) return;
    st.opener = opener || document.activeElement;
    showPhoto(i);
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
    document.documentElement.classList.add('gal-locked');
    root.querySelector('.gal-x').focus();
  }
  function close() {
    const d = box();
    if (d && d.open) { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); }
    document.documentElement.classList.remove('gal-locked');
    st.index = -1;
    if (st.opener && st.opener.isConnected) st.opener.focus();
    st.opener = null;
  }

  on(root, 'click', (e) => {
    const c = e.target.closest('[data-cat]');
    if (c) { st.cat = c.dataset.cat; render(); root.querySelector(`[data-cat="${CSS.escape(st.cat)}"]`)?.focus(); return; }
    const th = e.target.closest('[data-open]');
    if (th) { open(Number(th.dataset.open), th); return; }
    const a = e.target.closest('[data-act]');
    if (a) { if (a.dataset.act === 'close') close(); else if (a.dataset.act === 'prev') showPhoto(st.index - 1); else if (a.dataset.act === 'next') showPhoto(st.index + 1); return; }
    if (e.target === box()) close(); // click on the backdrop
  });
  on(root, 'keydown', (e) => {
    if (!box() || !box().open) return;
    const rtl = st.lang === 'ar';
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); showPhoto(st.index + (rtl ? -1 : 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(st.index + (rtl ? 1 : -1)); }
  });
  // the dialog's own cancel (Esc in browsers that handle it natively) must restore focus too
  on(root, 'cancel', (e) => { if (e.target === box()) { e.preventDefault(); close(); } }, true);
  // swipe in the lightbox
  let sx = null, sy = null;
  on(root, 'pointerdown', (e) => { if (e.target.closest('.gal-box-fig')) { sx = e.clientX; sy = e.clientY; } });
  on(root, 'pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = sy = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { const fwd = st.lang === 'ar' ? dx > 0 : dx < 0; showPhoto(st.index + (fwd ? 1 : -1)); }
  });

  render();
  return {
    destroy() { if (st.destroyed) return; close(); offs.splice(0).forEach((f) => f()); root.remove(); st.destroyed = true; counters.destroys++; counters.live--; },
    setLang(l) { st.lang = l === 'en' ? 'en' : 'ar'; const wasOpen = st.index; render(); if (wasOpen >= 0 && box()) { st.index = -1; open(wasOpen); } },
    setTheme() { /* colours follow the page tokens */ },
    getState: () => ({ lang: st.lang, category: st.cat, count: shown().length, total: photos.length, open: !!(box() && box().open), index: st.index }),
    open: (i) => open(i), close, setCategory(c) { if (c === 'all' || cats.some((x) => x.id === c)) { st.cat = c; render(); } }
  };
}
