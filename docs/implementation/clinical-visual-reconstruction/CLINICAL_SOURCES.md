# Clinical sources

## Cataract simulator

Scope: the 3D patient-education simulator in `src/cataract-sim/`. This section lists the references behind each visual concept. Numeric values in the model are typical adult or cataract-age reference values. They are illustrative and are not biometry, surgical parameters or instrument settings.

> **Verification note.** These references were compiled from the published literature and standard textbooks. Their bibliographic details were **not re-checked online during this session**. Before any public claim relies on them, a physician or medical editor should confirm the citations (and the EyeWiki article titles, which are given without URLs).

### Reference list

| Key | Reference |
|---|---|
| A&S | Atchison DA, Smith G. *Optics of the Human Eye*. Butterworth-Heinemann; 2000. This covers the schematic eyes (Gullstrand, Le Grand, Navarro), the refractive indices and the ocular dimensions. |
| NAV | Navarro R, Santamaría J, Bescós J. Accommodation-dependent model of the human eye with aspherics. *J Opt Soc Am A*. 1985;2:1273–1281. |
| LB | Liou HL, Brennan NA. Anatomically accurate, finite model eye for optical modeling. *J Opt Soc Am A*. 1997;14:1684–1695. |
| DUB-C | Dubbelman M, Sicam VA, van der Heijde GL. The shape of the anterior and posterior surface of the aging human cornea. *Vision Res*. 2006;46:993–1001. |
| DUB-T | Dubbelman M, van der Heijde GL, Weeber HA. The thickness of the aging human lens obtained from corrected Scheimpflug images. *Optom Vis Sci*. 2001;78:411–416. |
| DUB-S | Dubbelman M, van der Heijde GL. The shape of the aging human lens: curvature, equivalent refractive index and the lens paradox. *Vision Res*. 2001;41:1867–1877. |
| DZ | Doughty MJ, Zaman ML. Human corneal thickness and its impact on intraocular pressure measures: a review and meta-analysis approach. *Surv Ophthalmol*. 2000;44:367–408. |
| ATC08 | Atchison DA, et al. Age-related changes in optical and biometric characteristics of emmetropic eyes. *J Vis*. 2008;8(4):29. |
| ROS | Rosen AM, et al. In vitro dimensions and curvatures of human lenses. *Vision Res*. 2006;46:1002–1009. |
| STR | Strenk SA, et al. Age-related changes in human ciliary muscle and lens: a magnetic resonance imaging study. *Invest Ophthalmol Vis Sci*. 1999;40:1162–1169. |
| VASS | Vass C, Menapace R, et al. Prediction of pseudophakic capsular bag diameter based on biometric variables. *J Cataract Refract Surg*. 1999;25:1376–1381. |
| GN | Gimbel HV, Neuhann T. Development, advantages, and methods of the continuous circular capsulorhexis technique. *J Cataract Refract Surg*. 1990;16:31–37. |
| GIM | Gimbel HV. Divide and conquer nucleofractis phacoemulsification: development and variations. *J Cataract Refract Surg*. 1991;17:281–291. |
| KEL | Kelman CD. Phaco-emulsification and aspiration: a new technique of cataract removal. *Am J Ophthalmol*. 1967;64:23–35. |
| FINE | Fine IH. Architecture and construction of a self-sealing incision for cataract surgery. *J Cataract Refract Surg*. 1991;17(Suppl):672–676. |
| BCSC | American Academy of Ophthalmology, *Basic and Clinical Science Course*: Section 2 (Fundamentals and Principles of Ophthalmology), Section 3 (Clinical Optics) and Section 11 (Lens and Cataract). |
| EYEWIKI | AAO EyeWiki (eyewiki.aao.org) articles on capsulorhexis, phacoemulsification, intraocular lenses and clear corneal incisions. The titles are approximate and no URLs are given. |
| ESCRS | ESCRS (European Society of Cataract & Refractive Surgeons) cataract surgery guidelines and patient information. |
| AAO-PE | AAO EyeSmart, "What Is Cataract Surgery?" and "What Are Cataracts?". These are already cited in the UI. |
| NEI | National Eye Institute (NIH), "Cataracts". Already cited in the UI. |

### Concept → reference

| Visual concept (file) | What is depicted | Supported by |
|---|---|---|
| Corneal anterior radius 7.8 mm, white-to-white 11.7 mm (`anatomy.js`) | Corneal dome size and curvature | A&S, NAV, LB, BCSC §2/§3 |
| Corneal posterior radius 6.5 mm (`anatomy.js`) | Meniscus cornea that thickens peripherally | NAV, LB, DUB-C |
| Central corneal thickness ~0.54 mm, thicker periphery (`anatomy.js`) | Cross-section thickness | DZ, BCSC §2 |
| Anterior chamber depth: 2.6 mm aqueous, i.e. 3.14 mm from the epithelium (`anatomy.js`) | A shallower chamber in a cataract-age eye | ATC08, A&S, BCSC §11 |
| Lens thickness 4.6 mm at age ~70 (`anatomy.js`) | The lens thickens with age | DUB-T, ATC08 |
| Lens apical radii: anterior 8.9 mm, posterior 5.4 mm (`anatomy.js`) | Asymmetric biconvex lens | DUB-S, A&S |
| Lens equatorial diameter ~9.4 mm (`anatomy.js`) | Lens and bag diameter | ROS, STR, A&S |
| Capsule as a thin envelope; anterior capsule thicker than posterior (drawn as a thin shell) | The capsule is continuous with the lens surface | BCSC §11 |
| Zonules: anterior, equatorial and posterior insertions; fibres crossing | Suspensory ligament | BCSC §2 and §11 |
| Ciliary body and processes at the lens equator, small circumlental space | Ciliary anatomy | BCSC §2, STR |
| Iris resting on the anterior lens; posterior chamber behind the iris | Iris–lens relationship | BCSC §2 |
| Pupil 3.2 mm (age-related miosis), 7 mm dilated | Pupil sizes | BCSC §2/§11, AAO-PE |
| Refractive indices: cornea 1.376, aqueous/vitreous 1.336, lens (homogeneous equivalent) 1.42 (`anatomy.js`, `optics.js`) | Computed light paths | A&S, NAV, LB |
| IOL: 6 mm optic, ~13 mm overall, C-loop haptics, generic acrylic index ~1.5 (`anatomy.js`, `surgery.js`) | A generic one-piece IOL | BCSC §3/§11, EYEWIKI |
| Capsular bag diameter after lens removal (~10–10.5 mm in vivo; the model bag is 9.4 mm, see the anatomy review) | Haptics engaging the bag equator | VASS, BCSC §11 |
| Clear-corneal, self-sealing tunnel incision at the temporal limbus (`anatomy.js` `WOUND`) | Entry point and fulcrum for instruments | FINE, EYEWIKI, AAO-PE |
| Continuous curvilinear capsulorhexis: a circular tear, with the flap folded and removed (`surgery.js`) | Stage 4 | GN, EYEWIKI, ESCRS |
| Phacoemulsification: nucleus fragmented into quadrants and aspirated at the tip inside the bag (`surgery.js`) | Stage 5 | KEL, GIM, EYEWIKI, AAO-PE, NEI |
| Folded IOL injected through the incision, unfolding in the bag (`surgery.js`) | Stage 6 | BCSC §11, EYEWIKI, AAO-PE |
| Anterior chamber deepening after lens replacement (`irisPseudoZ`, qualitative) | Stage 7 | BCSC §11 (pseudophakic ACD) |

### What the sources do **not** support

The following are educational choices with no clinical source. None of them is presented to the user as a number:
- the playback timings;
- the tear direction;
- the order of quadrant removal;
- the instrument paths, apart from the rule that instruments pass through the incision;
- the depicted rolled diameter of the IOL;
- the 0.16 mm iris-to-lens clearance.

No surgical parameter, instrument setting, energy, fluidics value, wound size, rhexis size or IOL power is given anywhere in the UI.

## Vision simulator

The vision simulator (`src/vision-sim/`) is an **educational approximation**. The sources below are cited for the
*type* of evidence each modelling choice draws on. No numeric table was transcribed from them. Every parameter must be
verified against the primary source during clinical review (see `CLINICAL_APPROVAL_STATUS.md` → "Vision simulator").

| ID (in `optics/params.js`) | Source type | Reference | Used for | Verification needed |
|---|---|---|---|---|
| `geom-blur` | Textbook optics | Atchison DA, Smith G. *Optics of the Human Eye.* Butterworth-Heinemann. Standard geometric-optics derivation of the blur circle. | Blur angle ≈ pupil diameter × defocus. Vergence = 1/distance. | Confirm the small-angle form and the disk → Gaussian σ = b/4 approximation are acceptable for patient education. |
| `smith-1991` | Peer-reviewed | Smith G. Relation between spherical refractive error and visual acuity. *Optometry and Vision Science* 1991. | Supports the principle that visual loss scales with pupil × defocus. **Not** used to compute acuity. | Confirm the citation details. |
| `pupil` | Peer-reviewed | Winn B, Whitaker D, Elliott DB, Phillips NJ. Factors affecting light-adapted pupil size in normal human subjects. *IOVS* 1994. Watson AB, Yellott JI. A unified formula for light-adapted pupil size. *J Vis* 2012. | Pupil 3.0 / 4.0 / 5.0 mm (day / dusk / night) for an older adult. | Check the values against the unified formula at a realistic age and luminance. |
| `defocus-curves` | Peer-reviewed reviews / meta-analyses and comparative studies | E.g. the Cochrane review of multifocal versus monofocal IOLs after cataract extraction, and peer-reviewed comparative defocus-curve studies of monofocal, EDOF and trifocal IOLs. | The qualitative SHAPES of the through-focus profiles: monofocal single peak; EDOF extended with a gentle decline; trifocal three peaks with reduced contrast per focus. | Dr. Maan to nominate the preferred reference curves; profiles can then be re-tuned. |
| `escrs` | Professional society | ESCRS educational and clinical guidance on presbyopia-correcting IOLs and patient selection. | Neutral framing of trade-offs (halos/glare with multifocal and some EDOF designs; spectacle needs by lens type). | Confirm that the lens descriptions match current guidance. |
| `toric` | Peer-reviewed (vector analysis) | Standard astigmatism vector analysis (e.g. Alpins method literature). Residual cylinder after toric rotation ≈ 2·C·sin(misalignment), about 3.3 % loss of effect per degree. | Toric residual cylinder and axis shift. | Confirm. |
| `straylight` | Peer-reviewed | van den Berg TJTP and colleagues on straylight / forward light scatter (C-Quant) in cataract and pseudophakia. | Relative straylight factor (cataract ×2.5) and the glare skirt shape. Stiles–Holladay-type 1/θ² falloff. | Confirm that the relative factor is within the reported cataract range. |

Notes:

- No brand, product or manufacturer data is modelled. Lens profiles are generic and parameterised.
- The legacy simulator cited "BMC Ophthalmology 2019 meta-analysis" and "ESCRS 2024 abstracts" for acuity tables. Those
  tables could not be traced to specific published values, so they are not used.
- The light-share and lost-light values (e.g. a trifocal with about 10 % of light in non-useful diffraction orders) are
  order-of-magnitude values from the general diffractive-IOL literature. They must be verified before release.

## Procedure library


### Status
Every procedure page is general patient education. **It has not been medically reviewed.** Each page shows "Medical review status: draft pending review by Dr. Maan" twice: at the top and at the foot. Nothing here claims physician approval.

### How the text was written
- Written in plain language from the patient-information pages listed below (AAO EyeSmart, NEI, NHS, FDA).
- Rewritten, not quoted.
- Arabic and English carry the same meaning.

**Every source URL was checked on 2026-11-01:**
- **NHS, NEI and FDA:** the URL returned HTTP 200.
- **AAO:** AAO answers HTTP 200 even for pages that do not exist, so each AAO page was also confirmed by its `og:title`.

### Rules applied to all text
| Rule | How it was applied |
|---|---|
| No outcome promises | Phrases like "cannot be guaranteed" and "varies between patients" are used instead. |
| No success-rate or complication-rate numbers | No percentages anywhere. |
| No surgical parameters | No incision sizes, UV dose or time, energy, needle gauge or durations. |
| No device or platform claims | Laser platforms and lens brands are not named. |
| Nothing about Dr. Maan's own technique, volume or results | — |
| Candidacy is phrased as "general considerations" | Each page states that suitability is decided after an examination. |

Every risk list ends with an urgent-contact instruction.

### Sources by page and section

These source lists also appear on each page (`SOURCES` in `src/procedures/content.js`). Anatomy sections on every page also draw on [AAO, Parts of the eye](https://www.aao.org/eye-health/anatomy/parts-of-eye).

#### cataract-surgery
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

#### lens-implants
**Sources:**
- [AAO, Intraocular lenses (IOL)](https://www.aao.org/eye-health/diseases/cataracts-iol-implants)
- [NHS, Cataract surgery](https://www.nhs.uk/conditions/cataract-surgery/)

| Section | Source(s) |
|---|---|
| Types (monofocal, EDOF, multifocal/trifocal, toric) | AAO IOL |
| Benefits, limitations, risks (halos, glare, toric rotation) | AAO IOL |
| Recovery | NHS |

#### laser-vision-correction
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

#### icl
**Sources:**
- [AAO, Phakic IOL](https://www.aao.org/eye-health/treatments/phakic-iol)
- [NHS, Laser eye surgery and lens surgery](https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/)

| Section | Source(s) |
|---|---|
| Anatomy, candidates, steps | AAO phakic IOL |
| Risks (pressure, cataract, endothelial cell loss, halos, retinal detachment) | AAO phakic IOL; NHS |

#### keratoconus-cxl
**Sources:**
- [AAO, What is keratoconus?](https://www.aao.org/eye-health/diseases/what-is-keratoconus)
- [AAO, Corneal cross-linking](https://www.aao.org/eye-health/treatments/corneal-cross-linking)

| Section | Source(s) |
|---|---|
| Intro, anatomy, eye-rubbing FAQ | AAO keratoconus |
| Purpose (slow or halt, not reverse), steps, risks, recovery | AAO corneal cross-linking |

#### corneal-transplant
**Sources:**
- [AAO, About corneal transplantation](https://www.aao.org/eye-health/treatments/corneal-transplant)
- [NHS, Cornea transplant](https://www.nhs.uk/conditions/cornea-transplant/)

| Section | Source(s) |
|---|---|
| Types (PK, DALK, DSAEK/DMEK) | AAO corneal transplant |
| Candidates, rejection signs, recovery, stitches | NHS cornea transplant; AAO |

#### intravitreal-injections
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

#### ESCRS
ESCRS (escrs.org) was considered. It was not cited because its material is written for clinicians rather than patients.

### What Dr. Maan needs to review
- All 14 pages: 7 procedures in AR and EN.
- The homepage education answers.
- The 3D stage texts, as already listed in `../master-redesign-phase-2-3/CLINICAL_REVIEW.md`.

After review, record the reviewer and date in `src/procedures/content.js` (`REVIEW`) and in the registry. Only then change the on-page status. The status line is rendered by `reviewStatus()` in `main.js`.
