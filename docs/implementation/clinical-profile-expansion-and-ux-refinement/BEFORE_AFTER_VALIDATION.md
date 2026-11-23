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

- **Cataract simulator:** it is a separate engine and has no Before/After. The lens-implants simulator covers the clouded-lens-to-implant comparison.
- **Status:** pending Dr. Maan's review.
