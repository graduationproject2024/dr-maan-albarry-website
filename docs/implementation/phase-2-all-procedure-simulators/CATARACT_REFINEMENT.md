# Cataract simulator refinement

The cataract simulator stays the quality benchmark. Its stages, anatomy (`csim-anatomy-2026.11-r2`), instruments, motion constraints and review workflow are **unchanged**, so no clinically meaningful change needs re-review.

The refinements carry over lessons from the shared engine.

| Refinement | Why | Where | Test |
|---|---|---|---|
| A plain mouse wheel over the viewer now scrolls the page. Ctrl/⌘ + wheel zooms, and so does a trackpad pinch, which arrives as Ctrl + wheel. In full screen the plain wheel still zooms. | Before, scrolling down a page with a mouse stopped dead over the viewer and zoomed the eye instead. | `src/cataract-sim/index.js` `setupControls` (a capture listener stops the wheel event before it reaches OrbitControls) | `cataract-refinement.spec.js` "a plain wheel over the 3D viewer scrolls the page" (3/3 repeats). The existing zoom-limit tests now hold Ctrl and still pass. |
| Full-screen mode (CSS `position: fixed`, safe-area padding, `100dvh`), with a button in the view tools and Escape to leave. On touch screens it also turns on one-finger exploring, and restores the previous setting on exit. | Phones: a larger model with its controls on one screen. iPhone Safari has no element full-screen API, so this is CSS. | `src/cataract-sim/ui.js`, `styles.css` | `cataract-refinement.spec.js` at 1366×900 and 390×844 (3/3 repeats) |

Results:
- **First run** (`cataract-sim`, `cataract-stress`, `cataract-integration`, `cataract-refinement`, 2 workers): 43 passed, 1 failed, 4 skipped (opt-in). The failure was the new wheel test. It passed alone, then a slow smooth-scroll start under load made it fail once.
- **After hardening:** the test keeps wheeling until the page moves. `cataract-refinement.spec.js` then passed 9 of 9 (3 tests × 3 repeats).
- **Final run:** see `REGRESSION_RESULTS.md`.

## Not changed, deliberately

- **Stage logic, instruments and anatomy.** The brief forbids replacing stages with unsupported, more elaborate sequences. Any surgical change needs Dr. Maan's review first, as recorded in `CATARACT_ANATOMY_IMPROVEMENTS.md`.
- **Moving the cataract simulator onto the new engine.** It already has review mode, a constraints validator and 7 test suites. Re-hosting it would have risked all of that for no gain to patients. It shares the engine's core modules instead (`SHARED_ENGINE_ARCHITECTURE.md`).
