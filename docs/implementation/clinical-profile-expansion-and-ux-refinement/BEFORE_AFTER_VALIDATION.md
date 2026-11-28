# Before / After validation

- **Before:** time 0 of the first stage.
- **After:** the end of the last stage.
- **Display:** both shots use the first stage's camera, with playback paused.
- **Leaving the comparison:** Play, seek, a stage change, a technique change or restart.
- **Wording:** in `src/surgical-sim/procedures/compare.js`. It describes the anatomical change and never promises a visual result.

| Procedure | Safeguard in the "after" text |
|---|---|
| Lens implants (also the cataract case) | glasses may still be needed |
| ICL | the natural lens stays in place; follow-up is needed |
| Laser | vision settles over days to weeks; results vary |
| CXL (CXL tab only) | it aims to slow progression and **does not restore a normal shape instantly** |
| Transplant | recovery takes months; anti-rejection drops |
| Injections | works gradually, often as a series; **not an instant cure** |

- **Cataract simulator:** added 2026-11-28 (its own engine, same rule): end of stage 1 vs end of stage 7, stage 1's camera. See `phase-2-final-closure/10_BEFORE_AFTER_VERIFICATION.md`.
- **Status:** pending Dr. Maan's review.
