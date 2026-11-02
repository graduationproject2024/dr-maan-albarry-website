# Vision simulator — optical model audit and specification

**Validation status: educational approximation — not patient-specific, not clinically validated.**
**Review status: pending review by Dr. Maan Albarry.** Nothing in this document is a clinical claim.

Code: `src/vision-sim/optics/params.js` (parameters) and `src/vision-sim/optics/model.js` (equations).
Both are pure ES modules with no DOM, no three.js, no randomness and no time dependence, so every output is a
deterministic function of its inputs. Tests: `tests/vision-optics.spec.js`.

---

## 1. Audit of the legacy simulator (`VisionSim` in `main.js`)

Classes used:

- **Physically modelled**: follows from optics with stated assumptions.
- **Evidence-calibrated**: numeric values were fitted to published data.
- **Educational approximation**: the shape or direction is right, but the magnitudes are illustrative.
- **Purely artistic**: decoration with no optical meaning.
- **Unsupported**: not justified by optics or evidence, or presented as more than it is. These items are corrected in the rebuild.

| # | Legacy effect | What the code did | Class | Correction in the rebuild |
|---|---|---|---|---|
| 1 | Generic blur | Blur diameter = (MAR − 1′) × px/arcmin × `angScale` **9**. The MAR came from a per-lens logMAR table. The whole frame was blurred by one amount. | **Unsupported**. Letter MAR is not a blur-circle diameter. The ×9 exaggeration was not disclosed in the UI. One blur for the whole scene ignores depth. | Blur angle = pupil × \|defocus\|, computed **per depth layer** and converted to pixels through one explicit camera (no hidden multiplier). |
| 2 | Lens models (`va` tables) | 8-point logMAR defocus tables for EDOF, trifocal, monofocal and cataract. Cited as "BMC Ophthalmology 2019; ESCRS 2024 abstracts". | **Educational approximation** for the shape. The values could not be traced to a specific table in those sources. | Lenses are now **simultaneous-focus profiles** (vergence + light share). Their through-focus shapes reproduce published curve shapes. No acuity values are claimed. |
| 3 | "Expected acuity 20/xx", "Usually functional without glasses", "Nearest functional distance" | Read from the tables above and shown as results. | **Unsupported**. These are presented as predictions. | Removed. Replaced by a relative **sharpness index** that is labelled "not a measure of visual acuity". |
| 4 | Distance control | Steps of 0 / −1 / −1.5 / −2.5 / −3 D for 6 m+ / 1 m / 66 cm / 40 cm / 33 cm. Night scene forced to 0 D. | Vergence values: **Physically modelled**. Forcing night to 0 D: **Unsupported**. | Continuous log slider 33 cm – 6 m plus presets. V = 1/d at every lighting level. |
| 5 | Diopter assumptions (`ADDP`) | EDOF modelled with a 0.9 D "add ring". Trifocal adds 1.3 / 2.6 D. Monofocal had 0.9 D ring. | Trifocal: **Educational approximation**. EDOF/monofocal discrete rings: **Unsupported**. | Trifocal foci at 1.5 D / 2.5 D (spectacle plane). EDOF is a dense set of foci from 0 to 1.5 D. Monofocal has one focus and no ring. |
| 6 | Halo | Ring radius = ½·P·ΔD (physically right), × `angScale` 9. Intensities 0.16 / 0.78 / 0.08 by lens. | Formula: **Physically modelled**. Size ×9 and intensities: **Purely artistic / Unsupported**. | Halo disk diameter = P·\|V_i − V_0\|, energy = light share w_i, brightness ∝ energy / area. No size multiplier. A relative halo index is reported. |
| 7 | Glare | Radial luminance-thresholded veil. Constants 0.35 (normal) and 2.4 (cataract). Starbursts for cataract. Text cited Stiles–Holladay. | **Educational approximation** for the shape. Magnitudes and starbursts: **Purely artistic**. | A glare skirt shaped roughly as 1/θ² (Stiles–Holladay-like), scaled by a relative straylight factor (1 healthy, 2.5 cataract). No starbursts. |
| 8 | Contrast | Fixed contrast cut for trifocal (−12 %) and cataract (−24 %), plus a yellow tint. | **Educational approximation**. | Contrast loss now *emerges* from the light split (defocused copies). There is also an explicit straylight veil and an educational low-light factor. |
| 9 | Night vision | Night pupil 5.5 mm, reading pupil 3 mm, 30 % desaturation at night. | Pupil values: **Educational approximation** (5.5 mm is large for the age group). Desaturation: **Educational approximation**. | Pupil by lighting for an older adult: 3.0 / 4.0 / 5.0 mm (day / dusk / night). Desaturation 0 / 0.12 / 0.30, labelled as grading, not optics. |
| 10 | Astigmatism | Not modelled. There was no toric option. | **Unsupported** (missing). | Minus-cylinder astigmatism gives an elliptical, axis-oriented blur. A toric IOL cancels it. Rotation leaves 2·C·sin δ. |
| 11 | Presets / defaults | Default lens EDOF. The right half was always "untreated cataract". An intro animation swept the divider. | **Unsupported** (implicitly favours one lens and one framing). | Default is monofocal, with no comparison. Comparison is opt-in and any lens can sit on either side. Cataract is an optional comparator. |
| 12 | Explanatory text | "Purest distance acuity", "high near spectacle independence", acuity results. | **Unsupported** (promotional or predictive wording). | Neutral "designed for / trade-offs" text for every lens, plus a persistent disclaimer. |
| 13 | Vignette, film grain, ACES, camera sway, dust motes, moving traffic | Decoration. | **Purely artistic**. | Removed. The image is static and deterministic, with a fixed dither only. |
| 14 | Luminance-weighted bokeh kernel | 28-tap golden-angle disk with weight 1 + 5·L³. | **Purely artistic** (exaggerates highlights). | Replaced by an energy-normalised Gaussian. Bright sources are handled by the energy-conserving sprites. |

## 2. Model specification

### Inputs (all clamped; see `BOUNDS`)

| Input | Range | Default |
|---|---|---|
| lens | monofocal, edof, trifocal, toric, cataract | monofocal |
| subject distance *d* | slider 0.33 – 6 m (model 0.25 – 100 m) | 6 m |
| lighting | day, dusk, night | day |
| pupil override *P* | 2 – 8 mm | by lighting |
| residual sphere *S* | −3 … +3 D | 0 |
| residual cylinder *C* (minus cyl) | −4 … 0 D | 0 |
| axis | (0, 180]° | 180 |
| toric misalignment δ | 0 – 30° | 0 |

### Equations

1. **Vergence demand:** V(d) = 1 / d (D).
2. **Defocus of focus *i*:** ΔD_i = V(d) − (V_i − S). This is zero at the in-focus distance 1/(V_i − S).
3. **Astigmatism (minus cyl):** the axis meridian carries ΔD_i and the perpendicular meridian carries ΔD_i + C.
   Blur spreads along each meridian, so the blur patch is an ellipse oriented on the axis.
4. **Geometric blur angle (diameter):** β = (P / 1000) · |ΔD| rad. The cap is 240′.
5. **Toric residual:** C_res = −2·|C|·sin δ, with the axis shifted by about 45° + δ/2 (vector analysis). A non-toric lens leaves C unchanged.
6. **Viewing geometry (explicit assumption):** the image shows a 34° vertical field. Focal length is
   f_px = (H/2)/tan(17°) and blurPx = f_px·β. The disk is approximated by a Gaussian with per-axis σ = blurPx / 4
   (the RMS radius of a uniform disk). Object sizes and blur share one camera, so their *ratio* stays correct on any screen.
7. **Simultaneous vision:** image = Σ_i w_i · G(σ_axis,i, σ_perp,i, axis) ∗ layer + w_loss · G(spread/2) ∗ layer.
   Σ w_i + w_loss = 1.
8. **Sharpness index (relative, not acuity):** Q = Σ_i w_i · ½[exp(−2π²σ_a²f²) + exp(−2π²σ_p²f²)], with σ in
   degrees and f = 15 c/deg (≈ 20/40 letter detail). Q = 1 for a focused monofocal.
9. **Halo (distant point light):** each non-distance focus forms a disk of diameter P·|V_i − V_0| carrying energy w_i.
   haloIndex = [Σ_{i>0} w_i·P·|V_i − V_0| + w_loss·P·1 D] / (the same for a trifocal at P = 8 mm). The result lies in [0, 1].
10. **Glare:** glareIndex = (straylight − 1)/2 + w_loss·P/8. It is relative only.
11. **Contrast index:** max(w_i) · 1/(1 + 0.25·(straylight − 1)) · (1 − lightingLoss). It is relative only.
12. **Pupil by lighting (older adult):** day 3.0 mm, dusk 4.0 mm, night 5.0 mm.

### Lens profiles (spectacle-plane vergence D : light share)

| Lens | Foci | Lost light (veil spread) | Straylight × |
|---|---|---|---|
| Monofocal | 0 : 1.00 | 0 | 1.0 |
| EDOF | 0 : 0.50, 0.5 : 0.20, 1.0 : 0.15, 1.5 : 0.11 | 0.04 (1.5°) | 1.15 |
| Trifocal | 0 : 0.45, 1.5 : 0.18, 2.5 : 0.27 | 0.10 (1.5°) | 1.3 |
| Toric (monofocal) | 0 : 1.00, cancels cylinder | 0 | 1.0 |
| Cataract (comparator) | 0 : 0.72, yellow tint (1, 0.86, 0.62) | 0.28 (2.5°) | 2.5 |

These are **parameterised shapes, not product specifications**. No brand is modelled and no outcome is claimed.

### Outputs

`computeView()` returns, for each layer (distance / intermediate / near): vergence, focus terms (weight, meridional
defocus, blur in arcmin, axis), lost-light veil, sharpness Q and dominant defocus. It also returns the pupil, halo
and glare indices, the contrast index and the grading values. `throughFocus()` / `findPeaks()` / `rangeOfFocus()`
describe the defocus-curve shape.

## 3. Assumptions

- The eye is a thin-lens, small-angle system with a centred pupil. Defocus is the only aberration except astigmatism.
  Spherical aberration, coma and chromatic effects are ignored.
- The eye is pseudophakic or presbyopic with **no accommodation**.
- Simultaneous foci add linearly in intensity. Pupil-dependent energy split (apodisation, refractive zones) is ignored.
- The scene is layered: each layer sits at one optical distance. Occlusion edges are composited "over" after blurring
  (the standard layered-depth-of-field approximation).
- Object sizes stay fixed when the slider moves the subject (as in defocus-curve testing). Only vergence changes.
- The 6 m preset is a true 6 m (0.17 D), not optical infinity.
- Light-source brightness (the sprite energy constant) is an artistic calibration chosen so halos are visible on an SDR screen.
  Halo **size** and **relative** energy come from the model.

## 4. Limitations / known inaccuracies

- Geometric optics over-estimates blur for small defocus (below about 0.5 D) because it ignores diffraction and the eye's own
  depth of focus. It also ignores neural processing. The real visual tolerance to defocus is larger than the
  image suggests at small defocus.
- The sharpness index is contrast at one spatial frequency. It is **not** visual acuity and must not be turned into Snellen values.
- No neural adaptation, which in reality reduces perceived halo over months.
- No individual biometry, corneal aberrations, dry eye, posterior capsule opacification or retinal disease.
- The display minifies the scene: the 34° field is shown on a screen that subtends less. Absolute legibility therefore
  differs from real life, but the relative blur between lenses and distances is preserved.
- Halo appearance (a uniform disk with a slightly bright rim) is stylised. Real halos vary by design and are often ring-like.
- The cataract comparator is a single "moderate" opacity. Real cataracts vary widely (nuclear, cortical, posterior subcapsular).

## 5. Calibration method

- **Physically modelled terms** (1–6): no calibration. They are textbook geometric optics.
- **Lens profiles** (vergence, weights): chosen by hand so that `throughFocus()` reproduces the *qualitative shape* of
  published mean defocus curves:
  - monofocal: a single distance peak;
  - EDOF: a plateau or gentle decline to about 1.5 D, with no separate near peak;
  - trifocal: peaks at 0, about 1.5 and about 2.5 D, with dips between them and each peak below the monofocal peak.

  This was **not** a numerical fit to any dataset.
- **Pupil sizes**: rounded representative values for adults aged about 60–75, consistent with the age effect described by
  Winn et al. (1994) and the Watson & Yellott (2012) unified formula. They have not been recomputed from the formula.
- **Straylight factor of the cataract comparator (×2.5)**: chosen to be inside the range reported for cataract eyes in the
  straylight literature (van den Berg et al.). It is not fitted.
- **Lost-light fraction of the trifocal (10 %)**: the order of magnitude reported for diffractive trifocal designs. Not fitted.

Each of these values should be checked against the primary sources by Dr. Maan before release.

## 6. Validation status

| Item | Status |
|---|---|
| Internal consistency (defocus is zero in focus, monotonic blur, peaks at the intended distances, clamping, determinism) | Automated: `tests/vision-optics.spec.js` |
| Agreement with any clinical dataset | **Not done** |
| Clinical review | **Pending review by Dr. Maan Albarry** |
| Patient-specific use | **Not intended. Must not be used for counselling outcomes.** |

## 7. References (source types)

See `CLINICAL_SOURCES.md` → "Vision simulator" for the list and what each one is used for. Sources are cited for the
*type* of evidence. Exact table values were not transcribed from them.
