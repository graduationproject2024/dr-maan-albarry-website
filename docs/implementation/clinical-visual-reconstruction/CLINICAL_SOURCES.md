# Clinical sources

<!-- Each simulator / content area keeps its own section. Other sections are maintained by other engineers. -->

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
