# Final legacy closure report (2026-11-21)

| Question | Answer |
|---|---|
| Legacy engineering complete? | **YES for engineering. NO for the board as a whole:** 18 cards stay open, and none of them is waiting on engineering except #28 (one GitHub run) |
| Tasks remaining | 11 external, 3 future scope, 1 superseded (kept for the owner), 1 minor engineering, 2 integrated but not deployed |
| P0 / P1 open | 0 / 0. LZ-01 and LZ-05 were P1 defects in this milestone's own work, both fixed with tests |
| Lenis accepted? | **YES, desktop pointers only.** Off on touch and with reduced motion |
| GSAP accepted? | **YES, desktop pointers only, GSAP core.** ScrollTrigger was tried and removed. Not loaded on phones (measured TBT cost) |
| React Bits / 21st.dev verified? | **Studied, no code taken.** React Bits licence forbids ported copies, so 2 techniques were re-implemented; 21st.dev: 1 pattern used in reduced form, 2 rejected. No React added |
| Mobile verified? | **YES in emulation** (320–430 px, final run clean). Phones load nothing new. Not on a physical phone (#29) |
| Medical provenance | Unchanged. The owner's general approval is recorded; item approvals stay pending; no medical content or model touched |
| Trello reconciled? | **YES.** 12 cards closed with evidence (13 complete in all), 18 open with status comments, read back |
| Phase 2 ready? | **YES for review and deployment by the owner** (`feat/legacy-zero`, local) |
| Deployment authorized? | **NO.** Nothing pushed, merged or deployed |

Main changes: `src/motion/index.js` (new), `main.js` (scroll helper, boot, dialog close guard), `style.css` (hand-off, print, Lenis, spotlight), `src/vision-sim/ui.js` (measure before reveal), `index.html` (CSP + referrer), `tests/motion.spec.js` (11 tests).

Records: every file in this folder; key ones are CARD_BY_CARD_AUDIT, BUG_FIX_REGISTER, REGRESSION_TEST_RESULTS, PERFORMANCE_COMPARISON, TRELLO_CLOSURE_EVIDENCE, TRELLO_FINAL_READBACK, PHASE_2_HANDOVER.
