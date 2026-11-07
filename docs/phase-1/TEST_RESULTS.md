# Phase 1 — Test results

## Full suite (merged branch `feat/phase-1-premium-experience`)
Command: `npx playwright test`. It rebuilds the site and prerenders all 30 pages before running.

```
  16 skipped
  428 passed (5.1m)
```

There were 0 failures. The 16 skipped tests are the 12 performance specs that need `JOURNEY_PERF=1` plus 4 opt-in evidence tests. No assertion was weakened.

The first run after merging gave 424 passed and 4 failed. All 4 failures were the axe scan of `/how-vision-works/`, which hung: the scan waited for every animation to finish, and the Light Journey's illustrative ray flow loops forever. The fix was to wait only for animations that finish (`tests/journeys/axe.spec.js`). After the fix, the axe scans pass 60 of 60 (30 pages × light/dark).

## New Phase 1 suites (run by their authors on their own branches; included in the full run above)
| Suite | Result | Covers |
|---|---|---|
| `tests/phase1-pages.spec.js` | Pass | All new pages in AR and EN, with and without JavaScript; internal links return 200; homepage height budgets; no overflow at 320–1440; restored content on its destination page |
| `tests/lens-lab.spec.js` | 25 pass | Comparison content in both languages; compare-two; situations drive the simulator; disclaimer; mount and destroy leave no leaks; no overflow at 320/390/768/1440; keyboard; axe |
| `tests/vision-optics.spec.js` + `tests/vision-sim.spec.js` | 22 + 19 pass | Model determinism, boundaries, scenario flow, Advanced controls, fallback, cleanup |
| `tests/light-journey.spec.js` | 24 pass | All 9 steps in AR and EN; keyboard both directions; part selection; links; light and focus toggles; cleanup; 44 px targets; reduced motion; axe |

## Patient journeys (emulated, Chromium on Windows, RTX 2060)
These were regenerated from the final run's logs (`docs/implementation/clinical-visual-reconstruction/USER_JOURNEY_SUMMARY.md`):
- 217 of 217 steps passed.
- 24 of 24 journey logs are PASS (Verified).
- No P0 or P1 defects remain open.

The journeys were adapted to the new pages without changing any persona's goal. For example, the older patient still reaches the qualifications, the cataract guide, the 3D walkthrough and booking.

## Homepage height (measured with `scripts/qa-measure.mjs` on the merged build)
| | Before | After | Change |
|---|---|---|---|
| AR 1440 | 10,746 | **5,363** | −50% |
| EN 1440 | 11,026 | **5,585** | −49% |
| AR 390 | 14,943 | **8,015** | −46% |
| EN 390 | 15,322 | **8,272** | −46% |

Body text stays at 18 px. The reduction comes from moving detail to the new dedicated pages.

## Not covered
- **Devices and assistive technology:** no physical phones and no screen reader were used; all mobile results are emulated.
- **Performance:** not re-measured for the new pages. The `JOURNEY_PERF` specs were not run in Phase 1.
- **WebKit:** runs only one English journey, because Windows display scaling breaks WebKit's mobile emulation (as before).
