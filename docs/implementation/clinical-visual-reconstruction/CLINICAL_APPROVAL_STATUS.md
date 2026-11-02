# Clinical approval status

Each simulator keeps its own section. Nothing here is approved until Dr. Maan Albarry actually reviews it.

## Cataract simulator

Model version under review: `csim-anatomy-2026.11-r2`

**No stage has been approved.** Every stage is **Pending review**. No reviewer, date or signature has been recorded, and none may be added until Dr. Maan Albarry has actually reviewed the stage.

| # | Stage id | Visual / motion status | Text status | Reviewed by | Date |
|---|---|---|---|---|---|
| 1 | `cloudy-lens` | Pending review | Pending review (`draft-pending-clinical-review`) | — | — |
| 2 | `preparation` | Pending review | Pending review | — | — |
| 3 | `incision` | Pending review | Pending review | — | — |
| 4 | `capsulorhexis` | Pending review | Pending review | — | — |
| 5 | `phaco` | Pending review | Pending review | — | — |
| 6 | `iol` | Pending review | Pending review | — | — |
| 7 | `completion` | Pending review | Pending review | — | — |

### How to review (clinical review mode)

1. Open the harness with `?review=1`, for example `cataract-sim-preview.html?lang=en&review=1`. An integrator can also call `mount(host, { review: true })`.
2. For each stage, use the review tools:
   - select the stage;
   - play it at 0.25× or 0.5×, or step frame by frame (±1/30 s);
   - use the Stage / Surgeon / Side cameras, or orbit freely;
   - toggle the layers (cornea, iris, lens & capsule, IOL, instruments, rays);
   - save screenshots.
3. Record your findings:
   - add notes for the stage;
   - add issue annotations, each of which stores the current p and camera;
   - set the status: **Pending review**, **Approved**, **Approved with corrections** or **Rejected**.
4. Click **Export JSON**. The file includes the model version, and it is the review record to hand back. **Import JSON** restores a review. If a file was made for a different model version, a warning appears, and any unknown status is read as Pending.

### Rules

- A status saved in a browser (localStorage) is a working note only. This document is the authoritative record and is updated only from an exported review that Dr. Maan Albarry has signed off.
- Every stage defaults to Pending. The code never pre-fills or infers an approval.
- Approving the visuals does not approve the wording, and the reverse is also true. Both columns must be approved before the public "pending physician review" badge and disclaimer phrase can be removed (see `docs/implementation/master-redesign-phase-2-3/CLINICAL_REVIEW.md`).
- If the model version changes, earlier approvals must be re-confirmed for the stages that changed.

## Vision simulator

Module: `src/vision-sim/`. Model: `VISION_OPTICAL_MODEL.md`. Sources: `CLINICAL_SOURCES.md` → "Vision simulator".
Validation status of the whole simulator: **educational approximation, not patient-specific, not clinically validated.**
Nothing below has been approved.

| Effect | Assumptions | References | Parameter limits | Calibration | Known inaccuracies | Review status |
|---|---|---|---|---|---|---|
| Defocus vs distance | V = 1/d; ΔD = V − (V_focus − S); no accommodation | geom-blur | d 0.25–100 m (UI 0.33–6 m); S −3…+3 D | None (physics) | 6 m treated as 0.17 D, not infinity; no depth-of-focus tolerance | Pending review by Dr. Maan |
| Blur size | β = P·\|ΔD\|; disk → Gaussian σ = b/4; 34° vertical field mapped to the image | geom-blur, smith-1991 | P 2–8 mm; blur cap 240′ | None (physics + explicit viewing assumption) | Over-estimates blur below about 0.5 D (ignores diffraction and neural factors); the display minifies the scene | Pending review by Dr. Maan |
| Pupil by lighting | Older adult; day 3.0, dusk 4.0, night 5.0 mm | pupil | 2–8 mm | Representative rounded values | Not age- or luminance-specific | Pending review by Dr. Maan |
| Astigmatism | Minus cyl; meridional defocus → elliptical blur on the axis | geom-blur | C −4…0 D; axis (0,180] | None (physics) | Image-axis convention simplified (not TABO-mapped to a specific eye) | Pending review by Dr. Maan |
| Toric IOL | Cancels corneal cylinder; residual 2·C·sin δ | toric | δ 0–30° (API only; UI 0°) | None (vector analysis) | Shown as a monofocal toric only; no surgically induced astigmatism | Pending review by Dr. Maan |
| Monofocal IOL | One focus at 0 D, 100 % light | defocus-curves | — | Shape match (single peak) | No spherical-aberration-related depth of focus | Pending review by Dr. Maan |
| EDOF IOL | Foci 0/0.5/1.0/1.5 D with 50/20/15/11 % light, 4 % lost | defocus-curves, escrs | Weights + loss = 1 | Hand-tuned shape match (plateau, gentle decline, no near peak) | Real EDOF designs differ (diffractive vs non-diffractive); intermediate range may be under-represented | Pending review by Dr. Maan |
| Trifocal IOL | Foci 0/1.5/2.5 D with 45/18/27 % light, 10 % lost | defocus-curves, escrs | Weights + loss = 1 | Hand-tuned shape match (three peaks) | Pupil-dependent energy split ignored; add powers generic | Pending review by Dr. Maan |
| Halo | Disk diameter P·\|V_i − V_0\|, energy w_i; index normalised to trifocal at 8 mm | geom-blur, escrs | Index 0–1 (relative) | Light-source brightness constant chosen for visibility on SDR screens (artistic) | Halo look stylised; no neural adaptation | Pending review by Dr. Maan |
| Glare / straylight | Relative straylight factor; 1/θ²-like skirt | straylight | Factor 1 (healthy) – 2.5 (cataract) | Factor chosen inside the reported cataract range | One cataract severity; no cataract-type differences | Pending review by Dr. Maan |
| Contrast reduction | Emerges from the light split + straylight veil + educational low-light factor (0 / 4 / 10 %) | defocus-curves, straylight | Index 0–1 (relative) | Low-light factor illustrative | Not a contrast-sensitivity function | Pending review by Dr. Maan |
| Night grading | Desaturation 0 / 0.12 / 0.30 (day / dusk / night) | — (educational) | — | Illustrative | Not a model of rod vision | Pending review by Dr. Maan |
| Cataract comparator | 72 % image, 28 % scattered within 2.5°, yellow tint | straylight | — | Illustrative | Single "moderate" cataract | Pending review by Dr. Maan |
| Sharpness index (UI meters) | Σ w·MTF at 15 c/deg; 1 = focused monofocal | — (derived) | 0–1 | — | Not visual acuity; must not be shown as Snellen | Pending review by Dr. Maan |
| Lens descriptions and disclaimer | Neutral "designed for / trade-offs" text (AR + EN) | escrs | — | — | Arabic medical wording needs native clinical review | Pending review by Dr. Maan |

Before public release, the reviewer should:

1. Confirm or replace the lens profiles, preferably against reference curves he nominates.
2. Verify the citations in `CLINICAL_SOURCES.md`.
3. Approve the Arabic and English copy.
4. Decide whether the cataract comparator stays.
