# Regression test results

Chromium on Windows with GPU, 2 workers (light mode), production build with the review harness (`CSIM_HARNESS=1` via the test server). Emulation only; no physical device.

## Runs in this milestone

| Run | Code | Result | Notes |
|---|---|---|---|
| 1 | WIP 006dd67 | polluted | two runs shared `dist/` while one rebuilt it (404.html missing mid-run); discarded |
| 2 | WIP + CSP | 497 passed, 12 failed | real motion faults LZ-01, LZ-02, LZ-04 plus test LZ-10 |
| 3 | IntersectionObserver fix | 747 passed, 2 failed | LZ-03 (Back at 320 px), LZ-04 (43.99 px) |
| 4 | + review fixes, opacity-only dialog, per-item reveal | 752 passed, 0 failed, 0 flaky | — |
| **5 (final)** | **7381728** (desktop-only, after load) | **752 passed, 0 failed, 0 flaky, 4 skipped** | skipped = opt-in screenshot/performance samples in cataract-sim |

Targeted checks: `motion.spec` 22/22 (×2 repeats); premium journey A at 5 profiles ×3: 15/15 with motion off, 15/15 after the LZ-03 fix (12/15 before); intravitreal axe scans ×10: 40/40.

## Final run, per suite (32 suites)

cataract-constraints 13 · cataract-sim 29 (4 skipped) · cataract-warmup 7 · closure 40 · content-registry 6 · first-render 25 · hero-portrait 22 · journey-regressions 16 · journeys/axe 60 · journeys/core-journeys 13 · journeys/premium-journeys 38 · journeys/security 1 · journeys/touch-gestures 1 · lens-lab 25 · lens-lab-distance 38 · lens-lab-jump 13 · lens-lab-mobile 57 · light-journey 24 · motion 11 · phase0-content 14 · phase1-mobile 52 · phase1-pages 39 · plates-clarity 46 · premium-regressions 11 · procedures 20 · returning-visitor 22 · routing 20 · section-registry 19 · seo 4 · technical-fixes 29 · vision-optics 22 · vision-sim 19.

This covers the whole CI gate (`npm run test:gate`, 15 files) plus every suite touched by scrolling, dialogs, reveals or the Lens Lab.

Not run this milestone: the persona suites A–H, stress, webkit and perf specs (not affected by the change; light mode).

## Independent review

A read-only review agent checked the diff. It found 1 P1 (dialog could stick open), 3 P2 (print, Lens Lab measure order, Lenis loop after reduced motion) and 2 P3. All are fixed with tests (BUG_FIX_REGISTER LZ-05…LZ-09). It found no CSP breakage.
