# Regression results

Final code `b9aada8` + docs. Chromium (ANGLE/D3D11, RTX 2060) and WebKit on Windows, production build with the review harness pages, `vite preview`. Emulation only. Runs used **2 workers** ("light mode"): the owner's laptop crashed when the Android Emulator ran beside 8 parallel workers.

## Final runs (2026-11-21)

| Run | Files | Passed | Failed | Flaky | Skipped |
|---|---|---|---|---|---|
| Gate suite (`npm run test:gate`, CI subset) | 15 | **383** | 0 | 0 | 0 |
| Phase 2 affected files (navigation, technical, all 3D, all Lens Lab / vision, WebKit, touch, core journeys) | 16 | 291 | 1 | 0 | 4 (opt-in) |
| Re-run of the one failure alone | 1 | 3 / 3 | 0 | — | — |

The gate count rose from 379 to 383 with the four new motion-constraint tests.

**The one failure:** `journeys/touch-gestures.spec.js` step 2, a 220 px one-finger swipe on the 3D picture must scroll the page more than 120 px; under load it scrolled 117 px. It passed 3/3 alone and in two earlier runs today. Recorded as a load-only test sensitivity (P3), not hidden and not loosened.

## During the work (affected suites after each fix)

Lens Lab and vision files 168 → 185 → 215 / 215; 3D files 74 / 74 (+4 opt-in skipped), stress ×4 44 / 44; navigation, technical, journeys, accessibility 390 / 390. Each fix's new test was also run against the code before the fix and failed there (`BUG_FIX_EVIDENCE.md`).

## Not run

- The full 781-test suite in one run (split into the two runs above to keep the laptop load low; the remaining files were not touched by Phase 2 code: content, SEO and routing are in the gate).
- GitHub CI for this branch (not pushed).
- Opt-in measurement suites (`CSIM_EVIDENCE`, `CSIM_PERF`, `JOURNEY_PERF`).

## FS-10

Not reproducible: 0 failures in 52 loaded repeats on the current code and 0 in 40 on the old code (8 workers, before light mode).
