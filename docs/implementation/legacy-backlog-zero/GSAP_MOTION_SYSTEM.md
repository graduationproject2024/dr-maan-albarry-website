# GSAP motion system

Source studied: https://gsap.com/docs/v3/ (ScrollTrigger, `gsap.matchMedia`), https://gsap.com/licensing/ ; npm `gsap@3.15.1`, "Standard 'no charge' license" (commercial use on a website allowed; all plugins included).

## What GSAP does on the site (`src/motion/index.js`)

| Effect | Purpose | Detail |
|---|---|---|
| Staggered group reveal | the eye reads a group in order instead of one block appearing | home procedure plates, path tiles, guide rows, booking ways; IntersectionObserver per item, batched (live layout, no stored offsets); hiding decided two frames after render, only for items below the screen; y 14 → 0 + opacity on desktop pointers, opacity only on touch; 0.45 s, stagger 0.06, `power3.out`, once |
| Menu sheet links | reading order on open | 0.32 s, stagger 0.03 |
| Figure dialog | calm arrival and exit (same path both ways) | cross-fade: open 0.22 s, close 0.14 s; no transform, so tap targets keep exact size and position |
| Lens Lab "More settings" | the panel opens instead of jumping | height 0 → auto, 0.3 s; closing stays instant |

## Rules kept

- Loaded lazily after the first page is on screen; the portrait, heading and anything already visible are never hidden or delayed.
- `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`: with reduced motion nothing is created; the CSS reveal shows everything at once.
- One context per page: `refresh()` reverts the previous page's triggers before setting up the new one (test: no build-up after four page changes).
- Every tween ends with `clearProps`, so no inline style is left behind; items can never stay hidden (test: every staggered item ends at opacity 1).
- Transform and opacity only, except the one height reveal.
- **Not used for the 3D cataract viewer or the vision simulator's picture.** The surgical timeline and state machine are untouched.

## Rejected

- Hero entrance animation: the portrait and heading are the LCP elements; animating them in would delay what patients come to see.
- ScrollTrigger scroll "beam" on the career timeline: only three milestones; motion without information.
- SplitText headline effects: constant text motion while reading.

## Change after regression (2026-11-21)

The first version used ScrollTrigger.batch with `autoAlpha` and a scaled dialog. The affected-suites run found three faults: plates below the fold could stay `visibility: hidden` when ScrollTrigger's stored offsets went stale (touch journeys timed out tapping a plate); `ScrollTrigger.refresh()` disturbed the Back position (off by ~300 px on home); the scaled dialog measured 43.4 px for a 46 px close button during its first frames. Fix: IntersectionObserver trigger, opacity only (never visibility), dialog moves without scaling. ScrollTrigger is no longer imported.
