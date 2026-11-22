# Keratoconus and CXL simulation: `/procedures/keratoconus-cxl/`

| | |
|---|---|
| Model | `ssim-cxl`, version `2026.11-r1` |
| File | `src/surgical-sim/procedures/keratoconus-cxl.js` |
| Clinical status | **pending review** |
| Content source | the keratoconus-cxl page: intro, anatomy (normal cornea, keratoconic cornea, collagen fibres), steps (tomography, numbing drops, riboflavin drops, controlled UV light, bandage lens and drops) |

## Variant A: Understanding keratoconus (education, never diagnosis or grading)

| # | id | Title | Scene |
|---|---|---|---|
| 1 | normal | A normal cornea: an even dome | Side profile section |
| 2 | cone | The cornea weakens, thins and bulges | The bulge grows (inferior cone, enlarged on purpose). The normal dome stays as a dashed outline. |
| 3 | thin | Thinner and steeper in one area | The section shows thinner stroma at the cone |
| 4 | distortion | Why vision becomes distorted | 7 light rays that no longer meet at one point |
| 5 | compare | Normal dome and cone together | Comparison outline, or a wireframe when the section is off |

## Variant B: Cross-linking (CXL)

| # | id | Title | Scene |
|---|---|---|---|
| 1 | tomography | Corneal tomography | Illustrative colour map on the surface |
| 2 | numbing | Numbing drops | Drops |
| 3 | riboflavin | Riboflavin (vitamin B2) drops | Yellow drops; the stroma tints progressively in the section |
| 4 | uv | Controlled ultraviolet light | A subtle UV cone; cross-link bridges appear between the collagen lamellae |
| 5 | bandage | Bandage lens and drops | A thin bandage lens following the cone |
| 6 | goal | Stronger, not reshaped | The cone **stays**. The aim is strengthening, to slow or stop progression. No vision is promised. |

- **Toggles:** normal dome outline; colour map in every stage (illustrative); rest of the eye.
- **Cameras:** cornea close-up (section), side profile, front, light path, whole eye.
- **Probe:** bulge 0 → 0.7 (enlarged); central thickness 0.54 → 0.343; cone-point thickness 0.55 → 0.31; riboflavin overlay 0.5; cross-links 1; UV visible during its stage.
- **Evidence:** `evidence/cxl/` (7 images, including Arabic and phone).
- **Not shown, and stated in the simplifications:** how the surface layer is handled. The page steps do not describe it, and it is queued as review item R-07.
- **Engineering note:** the crystalline lens is not drawn in this model; the procedure concerns the cornea only.
