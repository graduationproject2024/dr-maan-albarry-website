// Site motion layer (legacy-zero milestone). Loaded lazily after the first page is on screen (main.js, bootMotion),
// so it never delays the first paint or the doctor's portrait. Everything here is optional polish: without this file
// the site works exactly as before (CSS .fade-in reveal, native scrolling, instant dialogs).
//
// Libraries (pinned in package.json):
//  - GSAP 3.15.1 + ScrollTrigger — "Standard 'no charge' license" (gsap.com/standard-license), commercial use allowed.
//  - Lenis 1.3.27 (MIT) — smooth wheel scrolling on desktop only (mouse or trackpad). Touch screens keep native
//    scrolling: Lenis is not created there at all.
//
// Rules (MOTION_DESIGN_RULES.md): transform/opacity only; every effect is short (≤ 0.5 s) and interruptible; nothing
// hides content that is already on screen; prefers-reduced-motion turns every effect off (gsap.matchMedia) and
// Lenis is never created; nothing here touches the 3D cataract timeline or the vision simulator's optics.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  l.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => l.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // A modal dialog or the open menu sheet freezes the page behind it (html.dialog-open / html.drawer-open).
  const root = document.documentElement;
  const sync = () => { if (root.classList.contains('dialog-open') || root.classList.contains('drawer-open')) l.stop(); else l.start(); };
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  // If the reader turns on reduced motion later, smoothing stops at once (Lenis also forces lerp 1 by itself).
  window.matchMedia(REDUCED).addEventListener('change', (e) => { if (e.matches && lenis) { lenis.destroy(); lenis = null; root.classList.remove('lenis', 'lenis-smooth'); } });
  return l;
}

/** Scroll the page; smooth only when asked and allowed. Used by main.js for every programmatic jump. */
function scrollTo(top, behavior = 'auto') {
  if (lenis) lenis.scrollTo(top, { immediate: behavior !== 'smooth', force: true, lerp: 0.12 });
  else window.scrollTo({ top, behavior });
}

/** Per-page reveals. Called after every render (main.js renderApp); undoes the previous page's triggers first. */
function refresh() {
  if (pageCtx) { pageCtx.revert(); pageCtx = null; }
  pageCtx = gsap.matchMedia();
  pageCtx.add('(prefers-reduced-motion: no-preference)', () => {
    for (const [groupSel, itemSel] of STAGGER_GROUPS) {
      document.querySelectorAll(groupSel).forEach((group) => {
        if (group.classList.contains('visible')) return; // already revealed by the CSS path: leave it alone
        const items = [...group.querySelectorAll(itemSel)].filter((el) => !el.hidden);
        if (!items.length) return;
        group.classList.add('is-staggered'); // CSS: the group itself is shown; its items carry the motion
        gsap.set(items, { autoAlpha: 0, y: 14 });
        ScrollTrigger.batch(items, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'transform,opacity,visibility' })
        });
      });
    }
    return () => document.querySelectorAll('.is-staggered').forEach((g) => { g.classList.remove('is-staggered'); g.classList.add('visible'); });
  });
  // modules mounted later (Lens Lab, light journey) change the page height: re-measure once they settle
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/** Menu sheet: its links arrive in reading order (the sheet itself keeps its CSS slide). */
function drawerOpened(nav) {
  if (reduced() || !nav) return;
  const links = nav.querySelectorAll('.drawer-links a, .drawer-links li');
  const items = links.length ? links : nav.querySelectorAll('a');
  gsap.fromTo(items, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE, stagger: 0.03, overwrite: true, clearProps: 'transform,opacity,visibility' });
}

/** Figure dialog: grows out of the button that opened it and shrinks back into it (same path both ways). */
function originFor(dlg, from) {
  if (!from || !from.isConnected) return '50% 50%';
  const d = dlg.getBoundingClientRect(), b = from.getBoundingClientRect();
  const x = Math.min(100, Math.max(0, ((b.left + b.width / 2 - d.left) / Math.max(1, d.width)) * 100));
  const y = Math.min(100, Math.max(0, ((b.top + b.height / 2 - d.top) / Math.max(1, d.height)) * 100));
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
}
function dialogIn(dlg, from) {
  if (reduced() || !dlg) return;
  gsap.fromTo(dlg, { autoAlpha: 0, scale: 0.94, transformOrigin: originFor(dlg, from) }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: EASE, overwrite: true, clearProps: 'transform,opacity,visibility,transformOrigin' });
}
function dialogOut(dlg, from, done) {
  if (reduced() || !dlg || !dlg.open) { done(); return; }
  gsap.to(dlg, { autoAlpha: 0, scale: 0.96, transformOrigin: originFor(dlg, from), duration: 0.18, ease: 'power2.in', overwrite: true, onComplete: () => { gsap.set(dlg, { clearProps: 'all' }); done(); } });
}

/** Height reveal for a panel that was just un-hidden (Lens Lab "More settings"). Never delays the final layout. */
function expand(el) {
  if (reduced() || !el) return;
  const h = el.scrollHeight;
  gsap.fromTo(el, { height: 0, autoAlpha: 0, overflow: 'hidden' }, { height: h, autoAlpha: 1, duration: 0.3, ease: EASE, overwrite: true, clearProps: 'height,overflow,opacity,visibility' });
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
    state: () => ({ lenis: !!lenis, triggers: ScrollTrigger.getAll().length, reduced: reduced(), tickerListeners: lenis ? 1 : 0 })
  };
  window.__siteMotion = api;
  refresh();
  return api;
}
