# Clinical approval status

<!-- Each simulator / content area keeps its own section. Other sections (e.g. the cataract simulator) are maintained
     by other engineers; keep edits inside your own heading. -->

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
