# Regression results

All runs: Chromium through Playwright on one Windows machine (12 logical CPUs, RTX 2060 through ANGLE), production build, default workers, plus one WebKit journey. Browser emulation only; no physical device and no screen reader.

Command: `PW_PORT=4671 PRERENDER_PORT=4676 npx playwright test` (the build runs first; 737 tests in 45 spec files, of which 24 are flag-gated performance and evidence runs).

## Full-suite runs on this branch

| Run | Code | Result | Notes |
|---|---|---|---|
| 1 | `23c158c` (hero + image clarity; this is what was deployed on 2026-11-10) | **588 passed, 0 failed, 24 skipped** | Quiet machine |
| 2 | `c05f52e` (all four workstreams merged) | 693 passed, 5 failed, 24 skipped | All 5 in `technical-fixes.spec.js`: the jump tests assumed the Lens Lab sits above the simulator, and the Lens Lab reconstruction moved it below. Tests moved to the new order with the same assertions. |
| 3 | `d9db70a` (jump lands on the workbench) | 711 passed, 2 failed, 24 skipped | J03 still measured the section title after a jump; the gallery Back test read its position before late content had settled. Both were test defects, fixed without loosening them. |
| 4 | `c13c474` (final, with the portrait preload) | **713 passed, 0 failed, 24 skipped** | Final code |

Earlier attempts while three agents were also running tests could not start: the prerender step timed out under load. Those are not counted as test results.

## The known flaky tests

| Test | Status before | Root cause | Now |
|---|---|---|---|
| Persona C step 8 (scrubber tap) | Failed about 1 in 7 under load | Product defect: after Start, the 3D controls could sit under the booking bar, so the tap reached "Call" | Fixed in the product (`revealViewer`), and the test now asserts what is under the tap point. 0 of 20 failed under the same load. |
| Persona H step 1 | 4 of 30 under heavy load | Product defect: a jump lost its target when a module arrived late | Fixed (`holdScrollTarget`). 0 of 20 under the lighter load; the heavier after-run was interrupted and not completed. |
| Routing subpath | 1 of 30 under heavy load | Test defect: its request stub held response bodies past the end of the test | Fixed. 0 of 20 under the lighter load; heavier after-run not completed. |

Runs 1 and 4 had no failure of any of these. Details and numbers: `TECHNICAL_FIXES.md`.

## New tests in this work

| Spec | Tests | Covers |
|---|---|---|
| `hero-portrait.spec.js` | 20 | Portrait first and large at 320–430 px, booking on the first screen, desktop balance, no distortion |
| `plates-clarity.spec.js` | 46 | At most 4 labels by default, reveal, close-ups, enlarge dialog, pin overlap at 320/390/430, AR/EN, light/dark |
| `lens-lab-mobile.spec.js` | 57 | The 10-step acceptance test with real taps; every lens, distance and lighting option; Simple and Advanced; Reset; rapid changes; persistence; URL presets; back/forward; one WebGL context; 5 phone sizes and landscape; 150% text; focus order; 44 px targets; failure and retry |
| `lens-lab-jump.spec.js` | 13 | After the jump, picture and every essential control between header and booking bar at 6 sizes, AR/EN; a real touch moves the page by at most 1 px |
| `technical-fixes.spec.js` | 18 | 3D controls clear of the bar; jumps keep their target |
| `returning-visitor.spec.js` | 18 | Saved language and theme, reset, storage contents, bookmarks, Back, Forward, reload, leaving and returning to simulators |
| `section-registry.spec.js` | 19 | Registry drives routes, navigation, sitemap, prerender; an unpublished section is absent everywhere |

## Existing tests changed, and why

No assertion was dropped. Changes follow layout that legitimately moved:

- `vision-sim`, `journey-regressions`, `persona-h`, `core-journeys`, `touch-gestures`, `webkit`, `perf`, `phase0-content`, `phase1-mobile`, `stress`, `premium-journeys`, `premium-regressions`: open "More settings" or a fold first; labels "Far" and "Dim". Listed one by one in `LENS_LAB_UX_RECONSTRUCTION.md`.
- `phase1-mobile` "images load": counts rendered images only, because a lazy image in a hidden element is never fetched by design.
- `persona-c`, `routing`, `harness.js`: the flaky-test fixes above.
- `core-journeys` J03 and `returning-visitor` bookmark: after a jump on a phone the workbench, not the section title, is at the top.
- `returning-visitor` gallery Back: compares with the position at the moment of the click.

## Accessibility and safety checks in the suite

`journeys/axe.spec.js` (60 tests, automated WCAG checks on pages and themes), keyboard and focus tests, reduced-motion tests, `journeys/security.spec.js`. These are automated checks, not a full WCAG 2.2 AA audit. The review harness pages are absent from the public build, and the public pages request no review code.
