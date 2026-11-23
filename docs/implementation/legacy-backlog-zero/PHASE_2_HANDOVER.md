# Phase 2 handover

## Where things are

- **Live:** `main` at 9e1773f (deployed 2026-11-17).
- **Ready, not deployed:** `feat/legacy-zero` at 7381728 and later doc commits, on top of `feat/phase-2`. It contains Phase 2 fixes P2-01…P2-10, the 3D start-up work, the desktop motion layer and the CSP/referrer meta. Both branches are local; nothing is pushed.
- **Tests:** 752 passed, 0 failed, 0 flaky on the final code (REGRESSION_TEST_RESULTS.md).

## To release (owner decisions, in order)

1. Push `feat/legacy-zero` and open a PR to `main`. CI (`verify.yml`, 379-test gate) runs on push.
2. Merge on the owner's instruction; `deploy.yml` runs the gate again before publishing.
3. After the deploy, check the real iPhone and the physical phone (card #29, plan in IOS_SAFARI_TEST_SETUP.md).
4. Optionally run `full-regression.yml` by hand once (card #28).

## Still external (cannot be finished in code)

Dr. Maan's item-level review (#22, #10, #19, #21), clinic decisions D-1…D-14 (#13), testimonials permission (#5), portrait (#4), domain/hosting and HTTP headers (#3, #2), owner visual acceptance (#18, #1). See EXTERNAL_DEPENDENCIES.md.

## Future scope (not started)

Procedure animations other than cataract (#10), automation beyond CI (#7), reservation system (#8), chat bot (#9), field analytics (#24). See FUTURE_SCOPE_SEPARATION.md.

## Working notes for the next engineer

- Motion layer: `src/motion/index.js`. It loads only on desktop pointers, after `load` + idle; `window.__siteMotion.state()` gives diagnostics. Every programmatic scroll must go through `pageScrollTo()` in main.js.
- Never animate items already on screen. Never use `visibility` or transforms on controls that tests measure. Never let GSAP drive the 3D timeline or the optics (MOTION_DESIGN_RULES.md).
- Tests on this laptop: at most 2 workers and no emulator beside them. Never run two Playwright runs at once; they share `dist/`.
