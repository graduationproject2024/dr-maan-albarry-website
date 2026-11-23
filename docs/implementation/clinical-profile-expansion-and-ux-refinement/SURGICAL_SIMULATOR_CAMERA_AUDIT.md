# Surgical simulator camera audit

| Procedure | Finding | Change |
|---|---|---|
| IOL | targets on the lens; no occlusion in the Phase 2 screenshots | Before/After uses the first stage's camera |
| ICL | detail labels crowded a small target | labels now off by default |
| Laser | section views adequate | - |
| CXL | the "understanding" tab shows the disease getting worse | Before/After only on the CXL tab |
| Transplant | front camera for the stitches stage (Phase 2 fix) | - |
| Injections | adequate | - |

- **Existing camera behaviour** (orbit.js, since Phase 2): reset view, eased and interruptible transitions, zoom limits.
- **Cameras were not re-authored** stage by stage in this pass. The next step is a review with Dr. Maan.
