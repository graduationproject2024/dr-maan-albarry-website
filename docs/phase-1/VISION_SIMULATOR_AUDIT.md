# Vision simulator: scientific audit

**Status: not clinically validated. Pending review by Dr. Maan Albarry.**
Date: 2026-11-03. Scope: `src/vision-sim/optics/*` (the pure model), `src/vision-sim/pipeline.js` (how the model is drawn), `src/vision-sim/scenes.js`, and the patient-facing wording in `src/vision-sim/i18n.js` and `src/lens-lab/content.js`.
Earlier specification: [VISION_OPTICAL_MODEL.md](../implementation/clinical-visual-reconstruction/VISION_OPTICAL_MODEL.md).

This audit asks one question of every modelling choice: **is the picture shown to a patient more alarming or more flattering than the evidence supports?** Where the answer was yes, the code was changed (section 3). Where the evidence was unclear, the issue is listed for Dr. Maan (section 6).

## 1. Method

1. Each equation and parameter was checked against its cited source type, and the citations themselves were checked (section 7: the URLs and what each check found).
2. The model was run for every lens in every everyday situation (section 2) and the outputs compared with published defocus-curve shapes and pupil data.
3. The rendering code was read line by line, looking for any multiplier that is not in the model.
4. Rendered frames were inspected at 1440 and 390 px, in both languages and themes (evidence in `docs/phase-1/evidence/lens-lab/`).

The model stays deterministic: no randomness, no time dependence, frozen parameter tables. `tests/vision-optics.spec.js` checks this, and checks that rendering the same state twice gives identical pixels.

## 2. Model outputs per everyday situation

Assumed pupil: 3 mm by day and 5 mm at night (section 4.4). ΔD is the defocus of the image that contributes most. "Blur" is the geometric blur-circle diameter. Q is the relative sharpness index at 15 cycles/degree (1 = a monofocal lens in perfect focus). **Q is not visual acuity.**

| Situation (distance, light) | Monofocal | EDOF | Multifocal (two-focus) | Trifocal |
|---|---|---|---|---|
| Distance signs (6 m, day) | ΔD 0.17, 1.7′, Q 0.80 | 0.17, 1.7′, Q 0.48 | 0.17, 1.7′, Q 0.33 | 0.17, 1.7′, Q 0.36 |
| Laptop (66 cm, day) | 1.52, 15.6′, Q 0.00 | 0.02, 0.2′, Q 0.13 | 0.98, 10.2′, Q 0.00 | 0.02, 0.2′, Q 0.18 |
| Phone (35 cm, day) | 2.86, 29.5′, Q 0.00 | 1.36, 14.0′, Q 0.00 | 0.36, 3.7′, Q 0.14 | 0.36, 3.7′, Q 0.09 |
| Book (40 cm, day) | 2.50, 25.8′, Q 0.00 | 1.00, 10.3′, Q 0.00 | 0.00, 0′, Q 0.41 | 0.00, 0′, Q 0.27 |
| Night driving (6 m, night) | 0.17, 2.9′, Q 0.53 | 0.17, 2.9′, Q 0.28 | 0.17, 2.9′, Q 0.22 | 0.17, 2.9′, Q 0.24 |

Halos around a distant light at night (5 mm pupil). Each extra focus forms a disk of diameter P·|ΔV|:

| Lens | Halo disks (diameter, share of light) | Halo index | Glare index |
|---|---|---|---|
| Monofocal | none | 0 | 0 |
| EDOF | 9′ (0.20), 17′ (0.15), 26′ (0.11) | 0.24 | 0.10 |
| Trifocal | 26′ (0.18), 43′ (0.27) | 0.54 | 0.21 |
| Multifocal (two-focus) | 43′ (0.41) | 0.63 | 0.26 |

The orderings match the evidence summarised in section 5:

- **Distance** is similar for every lens. The light split lowers the contrast index, not the focus.
- **Intermediate** is better with EDOF and trifocal than with monofocal. The two-focus multifocal has a dip at intermediate.
- **Near**: trifocal and two-focus multifocal are better than EDOF, which is better than monofocal.
- **Halos and contrast**: monofocal performs best, then EDOF, then the split-light designs.

## 3. Findings and changes made (every change is listed)

| # | Finding | Evidence | Change | File |
|---|---|---|---|---|
| A1 | **Glare was drawn with the square of the straylight factor.** The cataract comparator's glare skirt was 6.25× the healthy eye's glare instead of 2.5×, and split-light lenses were 1.69× instead of 1.3×. The model documentation says "scaled by a relative straylight factor". | The straylight parameter *s* multiplies the wide-angle point-spread function, so veiling luminance is proportional to *s*, not *s*² (van den Berg). Reported cataract cohorts improve by about 0.3 log units after surgery (×2.0). One small cohort went from 1.48 to about 1.06–1.10 log(s) (about ×2.5). The ×2.5 factor itself is therefore plausible. Squaring it was not. | Glare skirt now scales linearly with *s*. **Night images of the cataract comparator have visibly less glare.** Split-light lenses have slightly less glare. | `pipeline.js` (`drawLights`) |
| A2 | **No two-focus multifocal existed.** The comparison needs a "Multifocal" category. Showing a trifocal in its place would have made the two categories look identical. | Scalar diffraction gives a half-wave kinoform about 40.5 % in each of the two working orders, with the rest in higher orders (Davison & Simpson 2006). EyeWiki says bifocal designs "may give weaker intermediate vision". | New `multifocal` profile: foci at 0 D and 2.5 D (spectacle plane), 0.41 of the light each, 0.18 lost (1.5° veil), straylight ×1.3. It is a generic shape, not a product. The halo-index normaliser is now the strongest lens at 8 mm (this lens). Halo indices are relative, so the trifocal at 8 mm now reads about 0.87 instead of 1.0. | `optics/params.js`, `optics/model.js` |
| A3 | **The everyday distances were not tied to evidence.** The near preset was 40 cm for everything, but people hold phones closer than books. | Mean smartphone viewing distance is 32–36 cm (Bababekova et al. 2011). | Situations: phone 35 cm, book 40 cm, laptop / dashboard 66 cm, signs 6 m, night driving 6 m at the night pupil. Each situation is only a distance plus a lighting level. No new optics was introduced. | `optics/params.js` (`SCENARIOS`) |
| A4 | **On phones the scene was cramped.** On a 7:6 frame, the laptop and phone would have overlapped, hiding the laptop text. | Geometry: a 26° laptop plus a 10° phone needs at least about 37° of horizontal field. | The two objects are fitted to the actual horizontal field (laptop −min(9°, h−13.4°), phone min(13.5°, h−5.6°)). At 16:10 this gives exactly the original −9° / 13.5°, so desktop frames are pixel-identical. Object sizes and blur angles are unchanged. | `scenes.js` |
| A5 | **The relative sharpness numbers (0.00–1.00) were shown to patients as primary information.** At 15 c/deg they fall to 0 for defocus that patients still read through (section 4.1). | Section 4.1. | The numbers have moved to "Advanced". On screen the bars stay as *relative* comparisons, with no number and a caption: "relative model values for comparing lenses only, not a measure of visual acuity". | `ui.js`, `i18n.js` |
| A6 | **The viewer was an image (`role="img"`) containing controls.** The comparison divider and the new enlarge button were inside it (axe `nested-interactive`). | WCAG 4.1.2. | `role="img"` and the description are now on the picture layer, and the controls sit beside it. | `ui.js` |

Checked and **not** changed, because it agrees with the documentation:

- **Halo size.** It is exactly P·|ΔV| from the model, with no multiplier. Halo brightness is proportional to weight ÷ area, so energy is conserved.
- **Lost-light veil.** It is drawn as a Gaussian of the stated width with the stated energy. The sprite constant 1.3 / (0.25 d²) is about 9 % *below* exact energy conservation, so it understates rather than exaggerates.
- **Blur-to-pixel conversion.** It uses one camera for objects and blur. There is no hidden multiplier; the legacy ×9 was removed earlier.
- **Light-source brightness.** `E = intensity·40·core²` is an artistic calibration that lets halos show on an SDR screen. This is disclosed in the model documentation (section 3) and stays a limitation (section 6).

## 4. Topic-by-topic audit

### 4.1 Defocus and relative blur

- **Model.** ΔD = 1/d − (V_focus − S). The geometric blur diameter is β = P·|ΔD| radians, so at 3 mm, 1 D gives 10.3′. These are textbook thin-lens optics, and the tests check them.
- **Agreement.** Smith's relation (acuity loss grows with pupil × defocus) is supported. Monofocal blur at the laptop (1.5 D, 15.6′) matches the large acuity loss seen on monofocal defocus curves at −1.5 D.
- **Known bias: blur at small defocus is overstated.** For about 0.5 D or less, the geometric disk (5.2′ at 0.5 D, 3 mm) overstates the effect. Real eyes already have about 1′ of aberration blur at best focus, and visual tolerance to small defocus (depth of focus) is around ±0.3–0.5 D. In the picture, letters at 35 cm (about 44′ tall) stay readable through 3.7′ of blur. The sharpness *index* at 15 c/deg, however, drops to 0.09–0.14. This is why the index was removed from the main view (A5). A depth-of-focus allowance was **not** added to the model, because it would be an unvalidated choice. See Q1.
- **Range.** Slider 0.33–6 m. Model 0.25–100 m. Blur is capped at 240′.

### 4.2 Astigmatism and toric

- **Model.** Minus cylinder gives meridional defocus ΔD and ΔD + C, which makes an elliptical blur oriented on the axis. A toric lens cancels C. A rotation δ leaves 2·|C|·sin δ, so a 30° rotation leaves the full original cylinder.
- **Agreement.** EyeWiki *Toric IOLs* gives about 10 % loss per 3° of rotation and full loss at about 30°. The vector form used here gives 2·sin 3° ≈ 10.5 % at 3° and 100 % at 30°, which is consistent.
- **Lens Lab.** When a toric lens is compared, the picture assumes 1.5 D of corneal astigmatism (monofocal at 6 m by day: 13.8′ blur on the worse meridian), and says so in words. Without this assumption a toric lens would look identical to a monofocal one.
- **Not modelled.** Irregular astigmatism. Misalignment is not exposed in the UI.

### 4.3 EDOF and trifocal (and two-focus multifocal) assumptions

- **EDOF.** Four close foci (0 / 0.5 / 1.0 / 1.5 D; weights 0.50 / 0.20 / 0.15 / 0.11; 4 % loss). The result is a monotonic decline to about 1.5 D. EyeWiki describes "a single elongated focal point" and the AAO consensus requires at least 0.5 D more depth of focus than a monofocal at 0.2 logMAR. The shape agrees. One caveat: at 66 cm the in-focus share is only 0.11, so the *index* understates EDOF intermediate performance even though the picture is readable (Q2). The model also cannot represent the design variety within this category (diffractive EDOF, non-diffractive, small-aperture, "enhanced monofocal").
- **Trifocal.** Foci at 0 / 1.5 / 2.5 D (weights 0.45 / 0.18 / 0.27, 10 % lost). The tests show peaks at 0, about 1.5 and about 2.5 D, each below the monofocal peak. This agrees with meta-analyses: Karam 2023 and Liu 2019 found trifocal better at near, EDOF better at intermediate on the defocus curve, and similar distance.
- **Multifocal (two-focus).** See A2. The model has no intermediate peak, consistent with the EyeWiki description.
- **Pupil dependence** (apodised and refractive zonal designs) is ignored. All weights are fixed.

### 4.4 Pupil assumptions

Model: day 3.0 mm, dusk 4.0 mm, night 5.0 mm, for an adult aged about 60–75.

The Watson & Yellott (2012) unified formula was recomputed here: binocular viewing, 60° field, reference age 28.58, D = D_SD + (age − 28.58)(0.02132 − 0.009562·D_SD). The formula was taken from the CVD R package source (section 7) because the journal and NASA copies could not be fetched.

| Luminance (cd/m²) | 0.1 | 1 | 10 | 100 | 1000 |
|---|---|---|---|---|---|
| Age 65 | 4.9 mm | 4.1 mm | 3.3 mm | 2.7 mm | 2.3 mm |
| Age 75 | 4.5 mm | 3.9 mm | 3.1 mm | 2.6 mm | 2.3 mm |

What this shows:

- The **day** value of 3 mm suits indoor reading (about 30–100 cd/m²) but is about 0.5 mm larger than outdoor daylight. This overstates daytime distance blur slightly (by about 1.7′ → 1.3′ at 6 m).
- **Dusk at 4 mm** corresponds to about 1–2 cd/m².
- **Night at 5 mm** is the **upper end**. The formula gives 4.1–4.9 mm for lit-street adaptation (0.1–1 cd/m²) at age 65. Lazar et al. (2024) also report age-related shrinkage that is strongest in dim light (Winn et al.: about 0.043 mm/year at 9 cd/m²).
- The night images therefore show *at most* about 20 % more blur and halo diameter than a typical 65-year-old would have. This was **not changed**: it is within the published range, and choosing a single value is a clinical decision (Q3).

### 4.5 Halo

- **Model.** Each non-distance focus images a far light as a disk of angular diameter P·|V_i − V_0| carrying energy w_i (section 2). Brightness is proportional to energy ÷ area. The disk has a slightly bright rim (stylised) to suggest ring-like halos.
- **Agreement.** The size grows with pupil and add power. Alba-Bueno et al. found that add power affected both laboratory-measured and patient-perceived halos.
- **Not modelled.** Neural adaptation, which lessens perceived halos over months (Cochrane 2016 and EyeWiki both note symptoms lessen for many patients but persist in some).
- **Uncertainty.** EyeWiki (bench tests: more halos with trifocal) and the patient-reported study (fewer complaints with trifocal) disagree on the bifocal vs trifocal order. The Lens Lab therefore does **not** rank the two; both are labelled "more likely, especially at night".

### 4.6 Glare and straylight

- **Model.** glareIndex = (s − 1)/2 + w_loss·P/8. The skirt has a roughly 1/θ² shape over 9° (Stiles–Holladay-like).
- **Change A1.** The skirt is now linear in *s*.
- **Value of s.** The cataract comparator uses ×2.5 (about +0.4 log s). C-Quant cohorts report pre-operative means of about 1.48–1.55 log(s) and post-operative means of about 1.06–1.21, which supports a ×2–2.5 range. A pseudophakic age norm is about 0.0044·age + 0.89 log(s), which is 1.2 at age 70 (Łabuz, Reus & van den Berg). Split-light lenses use ×1.3, which is not fitted (Q4).

### 4.7 Contrast

- **Model.** The contrast index is the largest focus share × 1/(1 + 0.25(s − 1)) × (1 − lighting loss).
- **Agreement.** The order (monofocal > EDOF > two-focus multifocal ≈ trifocal) agrees with the direction of the evidence. Liu 2019 found EDOF contrast lower than monofocal and better than trifocal in some studies, especially scotopic.
- **Limitation.** Magnitudes are not calibrated to contrast-sensitivity data.

### 4.8 Night driving

The night-driving situation is the 6 m sign under night lighting. That means a 5 mm pupil (upper end, section 4.4), street-light halos and glare drawn from the model, and a grading of 0.30 desaturation and 0.10 contrast loss. That grading is labelled as *educational grading, not optics*. Headlight glare from oncoming cars is **not** simulated as a separate event. The dashboard (66 cm) appears as the laptop layer.

### 4.9 Parameter ranges (all clamped; see `BOUNDS`)

| Parameter | Range |
|---|---|
| Distance | 0.25–100 m (slider 0.33–6 m) |
| Pupil | 2–8 mm |
| Sphere | ±3 D |
| Cylinder | −4 to 0 D |
| Axis | (0, 180]° |
| Toric rotation | 0–30° |
| Blur cap | 240′ |
| Halo index | [0, 1], normalised to the strongest lens at 8 mm |

Out-of-range input is clamped, and an invalid lens or situation id is ignored (tests check both).

## 5. Evidence summary used for direction checks

- **Cochrane** (de Silva 2016, CD003169):
  - With multifocal lenses, distance vision is probably not very different from monofocal (moderate certainty).
  - Near vision may be better and spectacle dependence lower.
  - Adverse visual phenomena such as glare and halos are more common (low certainty).
- **Liu 2019** (BMC Ophthalmol 19:198). EDOF compared with monofocal and trifocal:
  - Similar distance vision.
  - Better intermediate than monofocal.
  - Near vision between monofocal and trifocal.
  - Halos more frequent than monofocal; no significant difference from trifocal.
- **Karam 2023** (Am J Ophthalmol 251:52–70):
  - Trifocal better at near; EDOF better at intermediate on the defocus curve.
  - No significant difference in halos, glare or satisfaction.
  - The choice is individual.

## 6. Assumptions, limitations and unresolved questions for Dr. Maan

**Assumptions:**

- A thin-lens, centred eye with no accommodation.
- Simultaneous images add linearly.
- Light shares do not depend on pupil size.
- A layered scene, with object sizes fixed when the distance changes.
- A 34° vertical field, minified on screen. Relative differences are preserved; absolute legibility is not.

**Limitations:**

- No neural adaptation.
- No diffraction or higher-order aberrations.
- No individual biometry, ocular surface, retina, posterior capsule opacification or dry eye.
- One generic shape per category.
- The cataract comparator is a single moderate density.
- Light-source brightness is an artistic calibration.
- The sharpness index is not acuity.

**Questions:**

- **Q1** Should the model include a depth-of-focus allowance (for example, defocus below about 0.3 D treated as in focus) so small defocus is not over-blurred? Which reference curves should it be fitted to?
- **Q2** Which published defocus curves should the EDOF, trifocal and two-focus multifocal shapes be tuned to (nominate studies or products)? Should the EDOF intermediate share be raised?
- **Q3** Should the night pupil be 4.5 mm (Watson–Yellott, about 0.3 cd/m², age 65) rather than 5.0 mm? Should "day" be split into indoor (3 mm) and outdoor (about 2.5 mm)?
- **Q4** Are straylight ×1.3 for diffractive split-light lenses and ×2.5 for the cataract comparator acceptable?
- **Q5** Is 1.5 D of corneal astigmatism a suitable example for the toric illustration?
- **Q6** Should the two-focus multifocal near focus be 2.5 D at the spectacle plane (about +3.0 to +3.25 D at the lens plane), or a lower add?
- **Q7** Is "book at 40 cm, phone at 35 cm, laptop / dashboard at 66 cm" acceptable for patients in Madinah? Should an Arabic-specific reading situation be added?

**Validation status:**

| Check | Status |
|---|---|
| Internal consistency | Automated (`tests/vision-optics.spec.js`, 22 tests) |
| Agreement with clinical datasets | **Not done** (shapes only) |
| Clinical review | **Pending: Dr. Maan** |
| Patient-specific use | **Not intended** |

## 7. Sources and verification (URLs checked 2026-11-02 / 03)

| Source | URL | Check |
|---|---|---|
| Winn B, Whitaker D, Elliott DB, Phillips NJ. *Factors affecting light-adapted pupil size in normal human subjects.* IOVS 1994;35:1132–7 | https://pubmed.ncbi.nlm.nih.gov/8125724/ | Citation confirmed by search. The 0.043 mm/year at 9 cd/m² figure was confirmed via Lazar 2024's citation of it. |
| Watson AB, Yellott JI. *A unified formula for light-adapted pupil size.* J Vis 2012;12(10):12 | https://jov.arvojournals.org/article.aspx?articleid=2279420 (403 to automated fetch); https://humansystems.arc.nasa.gov/publications/watson_formula_pupilsize.pdf (refused connection) | Formula taken from the CVD R package source https://raw.githubusercontent.com/cran/CVD/master/R/CVD.R (`lightAdaptedPupilSize.WatsonAndYellott`). Values recomputed in section 4.4. |
| Lazar R et al. *Regulation of pupil size in natural vision across the human lifespan.* 2024 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11295891/ | Fetched. Age effect strongest in dim light. |
| Liu J, Dong Y, Wang Y. BMC Ophthalmol 2019;19:198 (EDOF meta-analysis) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6719364/ | Fetched (summary in section 5). |
| Karam M et al. Am J Ophthalmol 2023;251:52–70 (EDOF vs trifocal) | https://doi.org/10.1016/j.ajo.2023.01.024 | Abstract via search. Full text not read. |
| de Silva SR et al. Cochrane CD003169 (2016) | https://www.cochrane.org/CD003169/EYES_multifocal-versus-monofocal-intraocular-lenses-after-cataract-extraction | Summary via search. |
| EyeWiki: *Extended Depth of Focus IOLs* | https://eyewiki.org/Extended_Depth_of_Focus_IOLs | Fetched. |
| EyeWiki: *Presbyopia-Correcting IOLs* | https://eyewiki.org/Presbyopia-Correcting_IOLs | Fetched. |
| EyeWiki: *Toric IOLs* | https://eyewiki.org/Toric_IOLs | Fetched (10 % per 3°, about 30° for full loss). |
| AAO EyeSmart: *IOL implants* | https://www.aao.org/eye-health/diseases/cataracts-iol-implants | Fetched (definitions only; no halo data). |
| Davison JA, Simpson MJ. J Cataract Refract Surg 2006;32:849–58 | https://pubmed.ncbi.nlm.nih.gov/16765805/ | Citation confirmed. The 41/41/18 split is a scalar-diffraction result. Patent text and a slide deck agree, but the paper's own table was not read. |
| Bababekova Y et al. Optom Vis Sci 2011;88:795–7 | https://pubmed.ncbi.nlm.nih.gov/21499163/ | Confirmed (36.2 cm texting, 32.2 cm web). |
| Straylight: Łabuz G, Reus NJ, van den Berg TJTP (pseudophakic norm); van der Meulen et al. (217 patients); Reus & van den Berg 2023 | https://iolsafety.com/issues-under-discussion/glistenings/for-medical-personnel/peer-reviewed-published-material/light-scattering-publications/280-ocular-straylight-in-the-normal-pseudophakic-eye ; https://iolsafety.com/issues-under-discussion/glistenings/for-medical-personnel/peer-reviewed-published-material/light-scattering-publications/227-straylight-measurements-as-an-indication-for-cataract-surgery ; https://herseninstituut.nl/publicaties/changes-in-straylight-after-cataract-surgery | Values from abstracts and snippets. Full tables not read. |
| Alba-Bueno F et al. *Patient-perceived and laboratory-measured halos associated with diffractive bifocal and trifocal IOLs* | https://upcommons.upc.edu/entities/publication/29cfa540-1821-4aee-a4f8-de6e7e74f8da | Abstract via search. |
| Smith G. Optom Vis Sci 1991 (refractive error vs acuity) | not re-checked | Carried over from CLINICAL_SOURCES.md. |
