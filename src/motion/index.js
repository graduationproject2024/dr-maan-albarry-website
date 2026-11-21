// Site motion layer (legacy-zero milestone). Loaded lazily after the first page is on screen (main.js, bootMotion),
// so it never delays the first paint or the doctor's portrait. Everything here is optional polish: without this file
// the site works exactly as before (CSS .fade-in reveal, native scrolling, instant dialogs).
//
// Libraries (pinned in package.json):
//  - GSAP 3.15.1 (core only) — "Standard 'no charge' license" (gsap.com/standard-license), commercial use allowed.
//  - Lenis 1.3.27 (MIT) — smooth wheel scrolling on desktop only (mouse or trackpad). Touch screens keep native
//    scrolling: Lenis is not created there at all.
//
// Rules (MOTION_DESIGN_RULES.md): transform/opacity only; every effect is short (≤ 0.5 s) and interruptible; nothing
// hides content that is already on screen; prefers-reduced-motion turns every effect off (gsap.matchMedia) and
// Lenis is never created; nothing here touches the 3D cataract timeline or the vision simulator's optics.
import { gsap } from 'gsap';

const REDUCED = '(prefers-reduced-motion: reduce)';
const reduced = () => window.matchMedia(REDUCED).matches;
const EASE = 'power3.out'; // decelerating, no overshoot (critically damped feel)

// Groups whose items enter one after another when the group first scrolls into view (the whole group used to fade in
// as one block). Only groups that are still hidden when this module arrives take part: what the reader already sees is
// never hidden again.
const STAGGER_GROUPS = [
  ['.atlas-home.fade-in', ':scope > *'],
  ['.path-tiles.fade-in', ':scope > li'],
  ['.guide-list.fade-in', ':scope > .guide-row'],
  ['.booking-ways.fade-in', ':scope > li']
];

let lenis = null;
let pageCtx = null; // gsap.context for the current page's reveals; reverted on every re-render

function createLenis(Lenis) {
  // Desktop pointer only, never with reduced motion. Lenis wraps the native scroll position, so sticky elements,
  // anchors, keyboard scrolling, find-in-page and the history position keep working.
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!desktop || reduced()) return null;
  const l = new Lenis({
    autoRaf: false, // driven by the single GSAP ticker below: one frame loop, not two
    lerp: 0.14, // a light touch: settles in a few frames, never feels "floaty"
    smoothWheel: true,
    syncTouch: false,
    anchors: false, // the site's own link handling (main.js go/scrollToSection) owns in-page jumps
    allowNestedScroll: true, // inner scrollers (menu sheet, figure dialog, settings) scroll themselves
    // the 3D viewer and the vision picture take the wheel themselves; dialogs and the menu sheet never scroll the page
    prevent: (node) => node.nodeType === 1 && (node.matches('canvas, dialog, .mobile-nav, [data-lenis-prevent]'))
  });
  const tick = (time) => l.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  // A modal dialog or the open menu sheet freezes the page behind it (html.dialog-open / html.drawer-open).
  const root = document.documentElement;
  const sync = () => { if (root.classList.contains('dialog-open') || root.classList.contains('drawer-open')) l.stop(); else l.start(); };
  const mo = new MutationObserver(sync);
  mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  // If the reader turns on reduced motion later, smoothing stops at once and its frame loop and observer go with it.
  window.matchMedia(REDUCED).addEventListener('change', (e) => {
    if (!e.matches || !lenis) return;
    gsap.ticker.remove(tick); mo.disconnect();
    lenis.destroy(); lenis = null; root.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
  });
  return l;
}

/** Scroll the page; smooth only when asked and allowed. Used by main.js for every programmatic jump. */
function scrollTo(top, behavior = 'auto') {
  if (lenis) lenis.scrollTo(top, { immediate: behavior !== 'smooth', force: true, lerp: 0.12 });
  else window.scrollTo({ top, behavior });
}

/** Per-page reveals. Called after every render (main.js renderApp); undoes the previous page's reveals first. */
// Each item is watched by an IntersectionObserver (live layout: late-mounted modules, restored reading positions and
// Back never leave an item waiting at a stale offset). Items that enter in the same callback form one batch and arrive
// one after another. The decision to hide is taken two frames after the render, once a restored reading position has
// been applied, and only for items below the screen: what the reader can see is never hidden. On touch screens the
// items only fade (no movement under a finger that may already be tapping them). Opacity only, never visibility, so
// items stay in the accessibility tree, in find-in-page and tappable throughout.
let io = null;
let pending = 0; // items still waiting (diagnostics)
let setupFrame = 0;
function refresh() {
  cancelAnimationFrame(setupFrame);
  if (io) { io.disconnect(); io = null; }
  if (pageCtx) {
    document.querySelectorAll('.is-staggered').forEach((g) => { g.classList.remove('is-staggered'); g.classList.add('visible'); });
    pageCtx.revert(); pageCtx = null;
  }
  pending = 0;
  if (reduced()) return;
  const ctx = pageCtx = gsap.context(() => {});
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const obs = io = new IntersectionObserver((entries) => {
    const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    if (!batch.length) return;
    batch.forEach((el) => obs.unobserve(el)); pending -= batch.length;
    ctx.add(() => gsap.to(batch, { opacity: 1, y: 0, duration: 0.45, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'transform,opacity' }));
  }, { rootMargin: '0px 0px -4% 0px' });
  setupFrame = requestAnimationFrame(() => { setupFrame = requestAnimationFrame(() => {
    if (pageCtx !== ctx) return;
    const vh = window.innerHeight;
    for (const [groupSel, itemSel] of STAGGER_GROUPS) {
      document.querySelectorAll(groupSel).forEach((group) => {
        if (group.classList.contains('visible')) return; // already revealed by the CSS path: leave it alone
        const items = [...group.querySelectorAll(itemSel)].filter((el) => !el.hidden && el.getBoundingClientRect().top >= vh);
        if (!items.length) return;
        group.classList.add('is-staggered'); // CSS: the group itself is shown; its items carry the motion
        ctx.add(() => gsap.set(items, fine ? { opacity: 0, y: 14 } : { opacity: 0 }));
        items.forEach((el) => obs.observe(el)); pending += items.length;
      });
    }
  }); });
}

/** Menu sheet: its links arrive in reading order (the sheet itself keeps its CSS slide). */
function drawerOpened(nav) {
  if (reduced() || !nav) return;
  const links = nav.querySelectorAll('.drawer-links li');
  const items = links.length ? links : nav.querySelectorAll('a'); // one level only: a list item or its link, never both
  gsap.fromTo(items, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: EASE, stagger: { amount: 0.18 }, overwrite: true, clearProps: 'transform,opacity' });
}

/** Figure dialog: a short cross-fade in and out (same path both ways). Opacity only: no transform, so the close button
 *  and every control keep their exact size and position from the first frame (tap targets, measurements, focus ring).
 *  A rise from the button's side was tried first; its sub-pixel transform made a 44 px button measure 43.99 px. */
function dialogIn(dlg) {
  if (reduced() || !dlg) return;
  gsap.fromTo(dlg, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: EASE, overwrite: true, clearProps: 'opacity' });
}
function dialogOut(dlg, _from, done) {
  if (reduced() || !dlg || !dlg.open) { done(); return; }
  gsap.to(dlg, { opacity: 0, duration: 0.14, ease: 'power2.in', overwrite: true,
    onComplete: () => { gsap.set(dlg, { clearProps: 'opacity' }); done(); },
    onInterrupt: () => done(false) }); // reopened mid-close (dialogIn took over): release the guard, do not close
}

/** Height reveal for a panel that was just un-hidden (Lens Lab "More settings"). Never delays the final layout. */
function expand(el) {
  if (reduced() || !el) return;
  const h = el.scrollHeight;
  gsap.fromTo(el, { height: 0, opacity: 0, overflow: 'hidden' }, { height: h, opacity: 1, duration: 0.3, ease: EASE, overwrite: true, clearProps: 'height,overflow,opacity' });
}

/** Light that follows the pointer across an anatomical plate on hover (desktop pointer only, no motion). */
function bindSpotlight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('pointermove', (e) => {
    const fig = e.target instanceof Element ? e.target.closest('.plate-card .pc-fig') : null;
    if (!fig) return;
    const r = fig.getBoundingClientRect();
    fig.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
    fig.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
  }, { passive: true });
}

export async function initMotion() {
  let Lenis = null;
  const wantsLenis = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced();
  if (wantsLenis) {
    try { ({ default: Lenis } = await import('lenis')); } catch (e) { Lenis = null; }
  }
  if (Lenis) lenis = createLenis(Lenis);
  bindSpotlight();
  const api = {
    get lenis() { return lenis; },
    scrollTo, refresh, drawerOpened, dialogIn, dialogOut, expand,
    /** Test and diagnostics handle (no effect on behaviour). */
    state: () => ({ lenis: !!lenis, triggers: pending, reduced: reduced(), tickerListeners: lenis ? 1 : 0 })
  };
  window.__siteMotion = api;
  refresh();
  return api;
}
