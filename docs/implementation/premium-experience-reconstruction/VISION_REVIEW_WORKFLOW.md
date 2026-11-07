# Vision simulator: clinical review workflow

**Status of every preset: Pending review.** The model is an educational approximation. It is not patient-specific and has not been clinically validated. Nothing in this document, in the code or in an exported file is a clinical approval.

Code:

- `src/vision-sim/review.js`: the panel and its data.
- `src/vision-sim/review-presets.js`: the presets and the model inventory. This file is pure and can be imported from Node.
- `src/sim-review/core.js`: the gate rules shared with the cataract simulator.
- `VISION_MODEL_VERSION` in `src/vision-sim/optics/params.js`.

Tests: `tests/vision-review.spec.js`.

## 1. How Dr. Maan opens review mode

Review mode is never shown on public pages. The Lens Lab and the site mount the simulator without it. It opens in two ways:

- The internal harness page: `vision-sim-preview.html?lang=en&review=1` (or `lang=ar`). The harness page is only built when `CSIM_HARNESS=1` is set.
- From code: `mount(host, { review: true })`.

The panel appears below the simulator. It has its own localStorage key, `vsim-clinical-review`, which is separate from the cataract simulator's key.

## 2. Controls

| Control | What it does |
|---|---|
| Preset | Choose one of 51 named presets (section 3), grouped by kind. Choosing a preset applies it straight away. It sets every parameter exactly. |
| Previous preset / Next preset | Step through the presets in order. |
| Apply preset again | Restores the preset after you have changed something with the simulator's own controls. |
| Match line and parameter table | For each parameter, the table shows the preset's value next to the current view's value. A highlighted cell differs. The line above the table says whether the view shows exactly this preset. |
| Model output for this preset | For each depth layer: the distance, defocus (D), blur (arcmin) and sharpness index. It also shows the pupil, halo index, glare index, contrast index, straylight factor and halo disks. These values come from `computeView()`, so they are the same numbers the renderer uses. |
| Save screenshot | Downloads a PNG of the current picture (`vision-sim-{preset}-{lens}[-vs-{lensB}]-{distance}m-{lighting}.png`). It also records a reference with the exact parameters, the preset id and whether the view matched the preset. |
| Review gates | Five separate gates for the selected preset (section 4). |
| Notes for this preset | Free text, saved as you type. |
| Add issue with the current parameters | Saves the text with the preset id, the exact parameters on screen (lens A/B, comparison, distance, lighting, pupil, sphere, cylinder, axis, split), whether they match the preset, and the model and preset versions. |
| Export JSON / Import JSON | Section 6. |
| Review progress — all presets | A table of every preset and the status of each of its gates. Presets that need re-review are flagged. |
| Reference sections | Lens profiles, distance settings, lighting settings, halo and glare representation, optical assumptions (equations, bounds, viewing geometry), comparison examples (each with an Apply button), model limitations, the explanation texts in Arabic and English side by side, and the reference types. Every number is read from the code at run time. |

Open questions Q1–Q7 are in `docs/phase-1/VISION_SIMULATOR_AUDIT.md` §6. Each preset lists the questions it helps answer.

## 3. Presets

Applying a preset sets exactly these values: lens A, lens B, comparison, distance, lighting and refraction, with the comparison split at 0.5. A test applies all 51 presets. It checks that the simulator state equals the preset and that the optics output equals `computeView()` for those parameters.

The pupil follows the lighting: day 3.0 mm, dusk 4.0 mm, night 5.0 mm. When the comparison is off, lens B is not shown. Refraction is written as sphere / cylinder × axis.

| Preset id | Group | Lens | Distance (m) | Lighting | Refraction (D) | Questions |
|---|---|---|---|---|---|---|
| `{lens}.signs` | situation | each of 6 lenses* | 6 | day | 0 / 0 × 180 | Q1 |
| `{lens}.laptop` | situation | each of 6 lenses | 0.66 | day | 0 / 0 × 180 | Q2, Q7 |
| `{lens}.phone` | situation | each of 6 lenses | 0.35 | day | 0 / 0 × 180 | Q6, Q7 |
| `{lens}.book` | situation | each of 6 lenses | 0.40 | day | 0 / 0 × 180 | Q6, Q7 |
| `{lens}.night-driving` | situation | each of 6 lenses | 6 | night | 0 / 0 × 180 | Q3, Q4 |
| `{lens}.distance-dusk` | lighting | each of 6 lenses | 6 | dusk | 0 / 0 × 180 | Q3, Q4 |
| `monofocal.cyl-1.0x180.signs` | refraction | monofocal | 6 | day | 0 / −1 × 180 | Q5 |
| `monofocal.cyl-2.0x90.signs` | refraction | monofocal | 6 | day | 0 / −2 × 90 | Q5 |
| `monofocal.cyl-1.5x180.signs` | refraction | monofocal | 6 | day | 0 / −1.5 × 180 | Q5 |
| `toric.cyl-1.5x180.signs` | refraction | toric | 6 | day | 0 / −1.5 × 180 | Q5 |
| `monofocal.sph-minus1.laptop` | refraction | monofocal | 0.66 | day | −1 / 0 × 180 | Q1 |
| `monofocal.sph-plus1.signs` | refraction | monofocal | 6 | day | +1 / 0 × 180 | Q1 |
| `compare.monofocal-vs-trifocal.night-driving` | compare | monofocal vs trifocal | 6 | night | 0 / 0 × 180 | Q3, Q4 |
| `compare.monofocal-vs-edof.laptop` | compare | monofocal vs EDOF | 0.66 | day | 0 / 0 × 180 | Q2 |
| `compare.edof-vs-trifocal.laptop` | compare | EDOF vs trifocal | 0.66 | day | 0 / 0 × 180 | Q2 |
| `compare.edof-vs-trifocal.book` | compare | EDOF vs trifocal | 0.40 | day | 0 / 0 × 180 | Q2, Q6 |
| `compare.multifocal-vs-trifocal.laptop` | compare | multifocal vs trifocal | 0.66 | day | 0 / 0 × 180 | Q2, Q6 |
| `compare.multifocal-vs-trifocal.night-driving` | compare | multifocal vs trifocal | 6 | night | 0 / 0 × 180 | Q3, Q4 |
| `compare.cataract-vs-monofocal.signs` | compare | cataract vs monofocal | 6 | day | 0 / 0 × 180 | Q4 |
| `compare.cataract-vs-monofocal.night-driving` | compare | cataract vs monofocal | 6 | night | 0 / 0 × 180 | Q3, Q4 |
| `compare.monofocal-vs-toric.signs.cyl1.5` | compare | monofocal vs toric | 6 | day | 0 / −1.5 × 180 | Q5 |

\* The 6 lenses are monofocal, edof, multifocal, trifocal, toric and cataract (the cataract comparator). That gives 6 × 6 = 36 situation and lighting presets, plus 6 refraction presets and 9 comparison presets: 51 in total.

The toric situation presets have no astigmatism, as on the public page, so they look the same as monofocal. The `toric.cyl-1.5x180.signs` preset and the monofocal-vs-toric comparison use the 1.5 D example from the Lens Lab (Q5).

## 4. Review gates (separate per preset)

| Gate | What it covers |
|---|---|
| Optical model review | The numbers: foci, light shares, pupil, defocus, blur, halo, glare and contrast for this preset. |
| Visual representation review | Whether the picture shows those numbers fairly. This includes the rendering calibration in section 5.4. |
| Arabic text review | The Arabic texts this preset shows: lens names, descriptions, the situation text, the disclaimer, "how it works" and the limitations. |
| English text review | The same texts in English. |
| Final physician approval | The physician's overall sign-off for the preset, recorded in this browser. |

Each gate has the states Pending review, Approved, Approved with corrections and Rejected.

The rules are the same as for the cataract simulator:

- Every gate starts as Pending review and changes only by the reviewer's click or key press.
- Final approval cannot be set to Approved or Approved with corrections while any of the other four gates is pending, rejected or recorded for an older version. The reasons are listed, and the code refuses a forced change.
- A later rejection flags an earlier final approval as inconsistent. It does not change it.
- Superseded records go to the history. They are never deleted.

## 5. Versioning and re-review

Each gate stores two versions when it is set:

- `VISION_MODEL_VERSION` (currently `vsim-optics-2026.11-r1`). **Bump it whenever any value in `optics/params.js`, any equation in `optics/model.js` or the rendering calibration in `pipeline.js` changes.**
- The preset content version (`vp-xxxxxxxx`). This is a hash of the preset's parameters, the full `computeView()` output for A (and B), and the AR/EN texts the preset shows. Any change to the model's output or to those texts therefore flags the preset, even if nobody bumped the version string.

When either value differs from the current one, the preset shows **"Needs re-review (changed since vX)"**. The old status stays visible, in the history and in the export. A "Confirm … again for the current version" button re-records the same status for the new version.

### 5.1 Optical assumptions (as implemented)

All the values below come from `src/vision-sim/optics/params.js` and `model.js`. The review panel reads them from the code at run time.

| Item | Value in code |
|---|---|
| Vergence | V = 1/d |
| Defocus | ΔD = 1/d − (V_focus − S) |
| Blur angle | β = P (m) · \|ΔD\| rad, capped at 240′ |
| Astigmatism | Meridians ΔD and ΔD + C (minus cylinder); elliptical blur along the axis |
| Toric residual | 2·\|C\|·sin δ, axis + 45° + δ/2 |
| Disk to Gaussian | σ = b · 0.25 |
| Viewing geometry | Vertical field of view 34°; f_px = (H/2)/tan(17°) |
| Sharpness index | Q = Σ wᵢ · exp(−2π²σ²f²) at 15 c/deg, orientation-averaged |
| Halo | Disk diameter P·\|Vᵢ − V₀\|, energy wᵢ; halo index normalised to the strongest lens at 8 mm |
| Glare index | (s − 1)/2 + loss · P/8 |
| Contrast index | max(wᵢ) · 1/(1 + 0.25(s − 1)) · (1 − lighting loss) |
| Bounds | Distance 0.25–100 m (slider 0.33–6 m); pupil 2–8 mm; sphere −3…+3 D; cylinder −4…0 D; axis 0–180°; toric rotation 0–30° |
| Distances | Near 0.40 m; intermediate 0.66 m; distance 6 m. Bands: near < 0.52 m, intermediate < 1.6 m |
| Pupil by lighting | Day 3.0 mm; dusk 4.0 mm; night 5.0 mm |
| Lighting grading (not optics) | Day 0 / 0; dusk 0.12 / 0.04; night 0.30 / 0.10 (desaturation / contrast loss) |

### 5.2 Lens profiles

| Lens | Foci (vergence D × light share) | Lost light | Loss spread | Straylight | Corrects cylinder | Tint |
|---|---|---|---|---|---|---|
| monofocal | 0 × 1 | 0 | 0° | 1 | no | none |
| edof | 0 × 0.50, 0.5 × 0.20, 1.0 × 0.15, 1.5 × 0.11 | 0.04 | 1.5° | 1.15 | no | none |
| multifocal | 0 × 0.41, 2.5 × 0.41 | 0.18 | 1.5° | 1.3 | no | none |
| trifocal | 0 × 0.45, 1.5 × 0.18, 2.5 × 0.27 | 0.10 | 1.5° | 1.3 | no | none |
| toric | 0 × 1 | 0 | 0° | 1 | yes | none |
| cataract (comparator) | 0 × 0.72 | 0.28 | 2.5° | 2.5 | no | 1.0 / 0.86 / 0.62 |

### 5.3 Everyday situations

| Situation | Distance | Lighting |
|---|---|---|
| signs | 6 m | day |
| laptop | 0.66 m | day |
| phone | 0.35 m | day |
| book | 0.40 m | day |
| night-driving | 6 m | night |

### 5.4 Rendering calibration (`pipeline.js`, `drawLights` and composite)

These constants draw the model. They are not part of the optics equations. A test checks that each expression still appears verbatim in `pipeline.js`.

| Id | Expression | Meaning |
|---|---|---|
| light-energy | `Lt.intensity * 40 * core * core` | Light-source energy. This is an artistic calibration so that halos show on an ordinary screen. |
| halo-disk | `(t.weight * E) / (da * dp)` | Halo disk brightness. Energy is conserved. |
| loss-veil | `(layer.loss.fraction * E * 1.3) / (d * d * 0.25)` | Lost-light veil. A Gaussian of the lens's loss spread (sprite × 1.6). |
| glare-size | `((9 * Math.PI) / 180) * f` | The glare skirt is 9° wide, with a shape like 1/θ². |
| glare-gain | `0.018 * Lt.intensity * glareGain` | Glare strength. It is linear in straylight. |
| veil-grade | `0.05 * (v.halo.straylight - 1)` | Composite veil, plus the lighting grading and the lens tint. |

### 5.5 Limitations

These are the limitations stated in the code and the audit:

- The model does not predict any individual's result. It uses no biometry, and it does not model the retina, cornea, ocular surface, posterior capsule opacification or dry eye.
- There is no neural adaptation, which in real patients reduces halos over time.
- There is no diffraction and there are no higher-order aberrations.
- Blur is overstated for small defocus, below about 0.5 D (Q1).
- There is one generic shape per lens category. Pupil-dependent light splitting is ignored.
- The cataract comparator is a single, moderate density.
- Light-source brightness is an artistic calibration.
- The sharpness index is not visual acuity.
- The picture on screen is smaller than real life, so only the relative differences between lenses are meaningful.

## 6. Export and import

**Export JSON** downloads `vision-sim-review-{VISION_MODEL_VERSION}.json`, containing:

- `format: "vsim-clinical-review"`, `formatVersion: 1`, `simulator: "vision-sim"`, `modelVersion`, and `exportedAt` (the time of the export click);
- `notOfficialApproval` and `notOfficialApprovalAr`;
- `gateStates`;
- `modelParametersAtExport`: the bounds, distances, bands, pupils, grading, viewing geometry, lens profiles, situations and calibration expressions in force at the time of export;
- per preset:
  - `label`, `group`, `parameters` and `relatedQuestions`;
  - `retired`, `currentModelVersion` and `currentContentHash`;
  - `needsReReview`, `staleGates` and `changedSinceModelVersions`;
  - `finalApprovalAllowedNow`, `finalApprovalBlockedBy` and `finalApprovalInconsistent`;
  - `gates`, `history`, `notes`, `issues` and `screenshots`.

There is no reviewer name, signature or approval-date field, and a test checks this.

**Import JSON**:

- A cataract file or any other file is refused.
- Unknown statuses become Pending review.
- Records for presets that no longer exist are kept and reported as retired.
- A file from another model version is accepted, and the presets that changed are flagged for re-review.

## 7. What counts as official approval

Only a **signed record placed by the physician in `docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md`** is an official approval. The browser statuses and exported files are working notes and supporting evidence only. No one may write Dr. Maan Albarry's name, a date or a signature into that file for him.
