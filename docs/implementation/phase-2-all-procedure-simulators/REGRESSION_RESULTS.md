# Regression results

| Run | Scope | Result |
|---|---|---|
| Full suite after all six modules (2 workers) | 861 tests | **835 passed, 2 failed, 24 skipped (opt-in)**, 20.8 min. The 2 failures were older assertions that the new simulators made outdated (BUG-TEST-01). Fixed and rerun 3/3. |
| Rerun of the 3 affected suites ×3 | cataract-integration, journey-regressions, cataract-warmup | 83 passed, 1 failed (the warm-up shader test, once, under mixed load: BUG-TEST-02). That test alone: 6/6 serial, 8/8 with 2 workers. |
| Final: CI gate + every suite this phase touched (2 workers), after the last code change | Gate (15 files) + surgical-sim, cataract-refinement, cataract-integration, journey-regressions, motion | **448 passed, 0 failed, 0 flaky** |
| `surgical-sim.spec.js` ×2 | 30 tests | 60/60 |
| `surgical-sim-webkit.spec.js` | 6 | 6/6 |
| Android Emulator | 6 simulators × 6 steps + Back | high-end 37/37; mid-range 37/37 + 3 × 19/19 after one tab restart (BUG-SIM-04) |

**Skipped:** 24 opt-in tests (as in earlier phases: device, long-soak and harness-only checks). None was skipped to obtain a pass, and no test was weakened. The 2 changed assertions now check the intended behaviour, explained in each test's comment.
