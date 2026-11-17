# Regression results

All runs: Chromium (and WebKit for its journey) on Windows, GPU through ANGLE/D3D11, the production build served by `vite preview`. Emulation only.

## Full suite

| Run | Code | Passed | Failed | Flaky | Skipped |
|---|---|---|---|---|---|
| Historical (earlier milestone, not re-used as evidence) | `c13c474` | 713 | 0 | — | 24 |
| Full run 1 | `d3ab9b6` (all product changes) | 757 | 0 | 0 | 24 |
| **Final full run** | `d49386d` (+ test fixes) | **757** | **0** | **0** | **24** |

781 tests in 47 files. The 24 skipped tests are opt-in measurement and evidence runs (`CSIM_EVIDENCE`, `CSIM_PERF`, `JOURNEY_PERF`); each has its reason in the run summary. No test was weakened: changed tests are listed with their reason in `LENS_LAB_FINAL_REFINEMENT.md` and `REMAINING_DEFECTS.md`.

## Gate suite (CI subset)

379 tests in 15 files (`npm run test:gate`). Last separate run with `CI=true`, at 377 tests: 376 passed and 1 failed (FS-07, a test race, fixed and repeated 3/3). All 15 files are also part of the final full run above, where every test passed.

## Stress and load (brief §13)

| Run | Scope | Result |
|---|---|---|
| Stress 1 | 11 interaction-heavy files × 3 repeats, 8 workers (3D open/close, play/pause, scrubber, lens/distance/lighting switching, URL presets, language/theme, Back/Forward, slow modules, context loss, resize/orientation, cleanup) | 518 passed, 4 failed: subpath test 3× (FS-08), touch drag 1× (FS-09) |
| After fixing FS-08/FS-09 | touch-gestures + lens-lab-mobile + cataract-stress × 4, 8 workers | 276 passed, 0 failed |
| Routing + Lens Lab × 3, 8 workers, four runs | current code | 3 of 4 runs clean; one run had 1 failure (FS-10, breadcrumb) and an earlier one 2 (FS-10 and a timeout in the same test) |
| Same, live commit `c7cdbed`, three runs | baseline | 2 of 3 clean; one run had 1 failure (FS-08 crash, since fixed in the test) |
| `first-render` × 3 | after FS-06/07 fixes | 75/75 |
| Subpath test alone | current code | 6/6 |

Earlier heavy-load reruns that were interrupted in the previous milestone are superseded by these runs; none is described as completed that was not.

## Open

FS-10 only (`REMAINING_DEFECTS.md`).
