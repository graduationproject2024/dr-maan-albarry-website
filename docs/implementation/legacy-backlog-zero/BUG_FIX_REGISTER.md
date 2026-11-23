# Bug fix register (legacy-zero milestone)

All found in this milestone's own work by the regression runs or the independent review; all fixed on `feat/legacy-zero` with a test.

| ID | Sev | Found by | Defect | Root cause | Fix | Test |
|---|---|---|---|---|---|---|
| LZ-01 | P1 | affected-suites run | plates below the fold could stay hidden; touch journeys timed out tapping a plate | ScrollTrigger stored trigger offsets went stale after late layout changes; items were `visibility: hidden` | IntersectionObserver per item (live layout), opacity only (never visibility) | `premium-journeys` F/T, `motion.spec` "all end fully visible" |
| LZ-02 | P2 | affected-suites run | Back to home landed ~300 px off at 390/768 | `ScrollTrigger.refresh()` interfered with the restored position | ScrollTrigger removed | `premium-journeys` A |
| LZ-03 | P2 | final-code run | Back at 320 px landed 232 px off (every run) | tapping a plate while it was still sliding in shifted the page ~200 px and that position was saved | items animate when they themselves enter; touch screens fade only; hiding decided after the restored position is applied | `premium-journeys` A ×3 (motion off 15/15 vs on 12/15 before the fix) |
| LZ-04 | P2 | gate (`plates-clarity`) | dialog close button measured 43.4 px (needs 44) | the dialog was scaled 0.94 → 1 while opening; later a sub-pixel translate gave 43.99 px | dialog cross-fade, no transform | `plates-clarity` dialog test, `motion.spec` dialog test |
| LZ-05 | P1 | independent review | figure dialog could become impossible to close (reopen during the 160 ms close) | `_closing` was cleared only in `onComplete`, which an overwrite skips | guard reset on close and on open; `onInterrupt` releases it without closing; a late `close` event after reopening is ignored | `motion.spec` "reopening the dialog while it is still closing" |
| LZ-06 | P2 | independent review | printing before scrolling left blank rows | inline `opacity: 0` on unrevealed items | print rule `.is-staggered > * { opacity: 1 !important }` | `motion.spec` "printing shows items" |
| LZ-07 | P2 | independent review | Lens Lab fit check could measure the settings panel at height 0 (risk of BUG-P2-10 returning) | `expand()` ran before `measureBench()` | measure first, then animate | `lens-lab-mobile`, `lens-lab-distance` |
| LZ-08 | P2 | independent review | Lenis frame loop kept running after reduced motion was switched on | ticker callback and observer not removed | removed with Lenis | code review |
| LZ-09 | P3 | independent review / motion test | drawer: list items and links faded twice; total stagger too long with many links | selector matched both levels; per-item stagger | one level only; stagger spread capped at 0.18 s | `motion.spec` phone menu |
| LZ-10 | P3 | motion test | test looked for motion code in the live DOM, where Vite adds preload links at run time | test design | test reads the served HTML for script URLs | `motion.spec` |

Pre-existing items checked: BUG-FS-10 (not reproducible, #27), Phase 2 register P2-01…P2-10 (all fixed on `feat/phase-2`).
