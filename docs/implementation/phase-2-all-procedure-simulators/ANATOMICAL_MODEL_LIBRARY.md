# Anatomical model library (`ssim-anatomy-2026.11-r1`)

Files:
- `src/surgical-sim/anatomy/geometry.js`: pure maths, Node-testable;
- `build.js`: three.js meshes;
- `materials.js`: materials.

The base values come from the cataract simulator's `EYE` constants. They are already referenced in `clinical-visual-reconstruction/CATARACT_ANATOMY_REVIEW.md` and `CLINICAL_SOURCES.md`, which cite the Navarro, Liou–Brennan and Dubbelman schematic eyes. They are typical adult values for education.

## Coordinate system

| | |
|---|---|
| Units | mm |
| +Z | optical axis, out of the eye |
| +X | temporal |
| +Y | superior |
| z = 0 | iris root |
| Cornea apex | z ≈ 3.5 |
| Limbus | z ≈ 0.85 |
| Posterior pole | z ≈ −19.75, so the axial length is about 23.3 mm |
| Section plane | x = 0, keeping x ≤ 0 |

## Structures

| Structure | Builder | Values and notes |
|---|---|---|
| Cornea | `buildCornea` → `layeredPatch` | Anterior radius 7.8, posterior 6.5, centre 0.54 mm thick, thicker towards the limbus, 11.7 mm across. Three section bands: epithelium (0.05 mm, to scale), stroma with collagen lamellae, and Descemet + endothelium (drawn 0.045 mm, **enlarged about 2–3×** so it can be seen). |
| Cornea states | `corneaDefaults` / `corneaRadii` | `ablation` (myopic, flattens the centre); `epiGone` (PRK, epithelium absent or regrowing); `bulge` (keratoconus cone with stromal thinning, inferior and slightly temporal); `swelling` (endothelial failure). All deformations fade to zero at the limbus. |
| Flap, lenticule, grafts | `layeredPatch` with any surfaces and an optional inner radius | Used by the laser and transplant modules |
| Sclera | `buildSclera` | 11.5 mm radius, 0.8 mm wall; the cataract simulator's texture |
| Iris | `buildIris(pupil, marginZ)` | The pupil margin rests on whatever lies behind it: the lens, the ICL, or its pseudophakic position |
| Crystalline lens | `buildLens` | Age-about-70 profile from the cataract model. Its tint is set per procedure: clear, or cloudy for a cataract. |
| Capsule | `buildCapsule(collapse)` | Full bag, or collapsed around an IOL. In section it is drawn as an outline, never filled. |
| Ciliary body and zonules | `buildCiliary` | Schematic ring and 216 fibres |
| Posterior segment | `buildPosterior` | Choroid and retina shells to an illustrative ora serrata. Macula 5.5 mm across, fovea, optic disc 1.8 mm across, 4.3 mm nasal of the fovea. Main vessel arcades are schematic. The vitreous fills the cavity, hollowed in front where the lens sits. |
| IOL | `buildIOL` | Generic one-piece lens: 6 mm optic, C-loop haptics. Surface designs: EDOF (3 central rings), multifocal (9 rings in equal-area zones), toric (axis dots). |
| ICL | `buildICL` | Vaulted plate lens with a central optic. Illustrative 12.6 × 6.6 mm. Its footplates sit at the sulcus. The vault over the natural lens is 0.5 mm. |
| Effects | `buildBeam`, `buildNeedle`, `buildInjector`, `buildRays` | Not clipped by the section, so they stay readable |

## Known simplifications (all shown to patients in each simulator's "What this model simplifies")

- The fovea is drawn on the optical axis. In reality it sits about 5° temporal.
- The endothelium and Descemet's membrane are drawn thicker than they are.
- The zonules and vessels are schematic.
- Pathology is shown in generic form: a cataract tint, a keratoconic cone, swelling and haze.
- The capsule is rigid and does not deform when the IOL unfolds.
- The cornea is drawn fully transparent from outside; its layers are visible in the section only.

## Tested properties

`geometry.js` is pure, so it is checked in Node and in the browser tests. The checks are:
- no NaN anywhere on the corneal grid;
- central thickness 0.540 mm;
- the ICL apex sits above the lens apex (vault 0.5 mm);
- each procedure's `probe()` values.
