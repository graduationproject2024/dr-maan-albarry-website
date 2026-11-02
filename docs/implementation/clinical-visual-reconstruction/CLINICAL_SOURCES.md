# Clinical sources: procedure library

## Status
Every procedure page is general patient education. **It has not been medically reviewed.** Each page shows "Medical review status: draft pending review by Dr. Maan" twice: at the top and at the foot. Nothing here claims physician approval.

## How the text was written
- Written in plain language from the patient-information pages listed below (AAO EyeSmart, NEI, NHS, FDA).
- Rewritten, not quoted.
- Arabic and English carry the same meaning.

**Every source URL was checked on 2026-11-01:**
- **NHS, NEI and FDA:** the URL returned HTTP 200.
- **AAO:** AAO answers HTTP 200 even for pages that do not exist, so each AAO page was also confirmed by its `og:title`.

## Rules applied to all text
| Rule | How it was applied |
|---|---|
| No outcome promises | Phrases like "cannot be guaranteed" and "varies between patients" are used instead. |
| No success-rate or complication-rate numbers | No percentages anywhere. |
| No surgical parameters | No incision sizes, UV dose or time, energy, needle gauge or durations. |
| No device or platform claims | Laser platforms and lens brands are not named. |
| Nothing about Dr. Maan's own technique, volume or results | — |
| Candidacy is phrased as "general considerations" | Each page states that suitability is decided after an examination. |

Every risk list ends with an urgent-contact instruction.

## Sources by page and section

These source lists also appear on each page (`SOURCES` in `src/procedures/content.js`). Anatomy sections on every page also draw on [AAO, Parts of the eye](https://www.aao.org/eye-health/anatomy/parts-of-eye).

### cataract-surgery
**Sources:**
- [AAO, What are cataracts?](https://www.aao.org/eye-health/diseases/what-are-cataracts)
- [AAO, Cataract surgery](https://www.aao.org/eye-health/diseases/what-is-cataract-surgery)
- [NEI, Cataracts](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts)
- [NHS, Cataract surgery](https://www.nhs.uk/conditions/cataract-surgery/)

| Section | Source(s) |
|---|---|
| Intro, purpose | AAO what-are-cataracts; NEI cataracts |
| Steps, recovery | AAO what-is-cataract-surgery; NHS cataract-surgery |
| Risks (posterior capsule opacification, infection, retinal detachment, macular oedema, pressure) | AAO what-is-cataract-surgery; NHS |
| FAQ ("ripe" cataract, one eye at a time) | AAO; NHS |

### lens-implants
**Sources:**
- [AAO, Intraocular lenses (IOL)](https://www.aao.org/eye-health/diseases/cataracts-iol-implants)
- [NHS, Cataract surgery](https://www.nhs.uk/conditions/cataract-surgery/)

| Section | Source(s) |
|---|---|
| Types (monofocal, EDOF, multifocal/trifocal, toric) | AAO IOL |
| Benefits, limitations, risks (halos, glare, toric rotation) | AAO IOL |
| Recovery | NHS |

### laser-vision-correction
**Sources:**
- [AAO, LASIK](https://www.aao.org/eye-health/treatments/lasik)
- [AAO, PRK](https://www.aao.org/eye-health/treatments/photorefractive-keratectomy-prk)
- [AAO, Refractive surgery](https://www.aao.org/eye-health/treatments/refractive-surgery)
- [NHS, Laser eye surgery and lens surgery](https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/)
- [FDA, LASIK](https://www.fda.gov/medical-devices/surgery-devices/lasik)

| Section | Source(s) |
|---|---|
| Types: LASIK | AAO LASIK |
| Types: PRK | AAO PRK |
| Types: SMILE | AAO refractive surgery; NHS. SMILE is described only as a general category. |
| Candidates (age, stability, cornea, dry eye, pregnancy) | FDA LASIK; AAO LASIK |
| Risks (dry eye, halos, under- or over-correction, flap, haze, ectasia) | FDA; AAO |
| Limitations (presbyopia) | AAO refractive surgery |

### icl
**Sources:**
- [AAO, Phakic IOL](https://www.aao.org/eye-health/treatments/phakic-iol)
- [NHS, Laser eye surgery and lens surgery](https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/)

| Section | Source(s) |
|---|---|
| Anatomy, candidates, steps | AAO phakic IOL |
| Risks (pressure, cataract, endothelial cell loss, halos, retinal detachment) | AAO phakic IOL; NHS |

### keratoconus-cxl
**Sources:**
- [AAO, What is keratoconus?](https://www.aao.org/eye-health/diseases/what-is-keratoconus)
- [AAO, Corneal cross-linking](https://www.aao.org/eye-health/treatments/corneal-cross-linking)

| Section | Source(s) |
|---|---|
| Intro, anatomy, eye-rubbing FAQ | AAO keratoconus |
| Purpose (slow or halt, not reverse), steps, risks, recovery | AAO corneal cross-linking |

### corneal-transplant
**Sources:**
- [AAO, About corneal transplantation](https://www.aao.org/eye-health/treatments/corneal-transplant)
- [NHS, Cornea transplant](https://www.nhs.uk/conditions/cornea-transplant/)

| Section | Source(s) |
|---|---|
| Types (PK, DALK, DSAEK/DMEK) | AAO corneal transplant |
| Candidates, rejection signs, recovery, stitches | NHS cornea transplant; AAO |

### intravitreal-injections
**Sources:**
- [AAO, Intravitreal injections](https://www.aao.org/eye-health/treatments/intravitreal-injections)
- [AAO, Eye injections](https://www.aao.org/eye-health/treatments/eye-injections)
- [NEI, Age-related macular degeneration](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration)
- [NEI, Diabetic retinopathy](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy)
- [NHS, AMD treatment](https://www.nhs.uk/conditions/age-related-macular-degeneration-amd/treatment/)

| Section | Source(s) |
|---|---|
| Conditions (wet AMD, DMO, RVO) | NEI AMD; NEI diabetic retinopathy; NHS AMD treatment |
| Steps, risks (endophthalmitis, retinal tear or detachment, pressure), recovery, driving FAQ | AAO intravitreal injections; AAO eye injections; NHS AMD treatment |

### ESCRS
ESCRS (escrs.org) was considered. It was not cited because its material is written for clinicians rather than patients.

## What Dr. Maan needs to review
- All 14 pages: 7 procedures in AR and EN.
- The homepage education answers.
- The 3D stage texts, as already listed in `../master-redesign-phase-2-3/CLINICAL_REVIEW.md`.

After review, record the reviewer and date in `src/procedures/content.js` (`REVIEW`) and in the registry. Only then change the on-page status. The status line is rendered by `reviewStatus()` in `main.js`.
