# Cataract simulator: anatomy review

Model version: `csim-anatomy-2026.11-r2` (`MODEL_VERSION` in `src/cataract-sim/anatomy.js`).

Units are millimetres. The optical axis is +Z, pointing toward the surgeon. The source keys refer to `CLINICAL_SOURCES.md` → "Cataract simulator".

**Status: Pending clinical review.** This is a technical review against the published reference values. It is not a physician approval (see `CLINICAL_APPROVAL_STATUS.md`).

## Summary of problems found (before)

1. **Posterior cornea too flat.** The posterior cornea was an offset of the anterior surface, so its effective radius was about 7.2 mm, against an anatomical value of about 6.5 mm. The peripheral thickening was therefore set by hand rather than following from the geometry.
2. **Lens too young for a cataract patient.** The lens was 4.0 mm thick with apical radii of 10 / 6 mm, which matches a young adult. The anterior chamber depth was a fixed 3.0 mm of aqueous, which is deep for a cataract-age eye.
3. **Cross-section only cut two layers.** Only the sclera and ciliary body were sectioned. The cornea, iris disc, lens and capsule stayed whole inside the cut-away, so intact structures showed through the "section" (visible in `evidence/surgery/before/desktop-stage1-*.jpg`).
4. **Capsule never changed after lens removal.** It kept the shape of a full lens. The IOL floated in an inflated, empty bag, with its posterior surface about 2 mm in front of the posterior capsule.
5. **Zonules fixed in place.** Their insertions did not follow the capsule.
6. **Incision was only a texture.** It was a mark on the cornea, with no tunnel geometry. The instrument fulcrum was an arbitrary point.
7. **Light rays were hand-drawn.** They were polylines with plausible-looking kinks, and nothing labelled them as illustrative.

## Before → after

| Structure | Before | After | Source / rationale |
|---|---|---|---|
| Corneal anterior apical radius | 7.8 | 7.8 (unchanged) | A&S, NAV, LB |
| Corneal posterior surface | Normal offset of the anterior surface (≈ R 7.2) | Sphere, R 6.5 | NAV, LB, DUB-C |
| Central corneal thickness | 0.55 | 0.54 | DZ |
| Peripheral corneal thickness | 0.65 at the limbus, set by hand | Follows the geometry: 0.61 at r = 3, 0.66 at r = 4, 0.74 at r = 5, ~0.8 at the limbus | Consequence of R 7.8 / 6.5 / CCT 0.54 (NAV, LB) |
| Corneal diameter (white-to-white) | 11.7 | 11.7 (unchanged) | A&S |
| Limbus continuity | Separate corneal edge face | Posterior corneal edge (r 5.23, z 0.31) overlaps the inner scleral sphere by 0.04 mm, so the shell is continuous | Geometry check |
| Anterior chamber depth (aqueous, endothelium → lens) | 3.0 | 2.6 (3.14 from the epithelium) | ATC08, BCSC §11: the chamber shallows as the lens thickens |
| Lens thickness | 4.0 | 4.6 | DUB-T: about 2.93 + 0.0236 × age at age 70 |
| Lens apical radii (anterior / posterior) | 10 / 6 | 8.9 / 5.4 | DUB-S (age 70) |
| Lens equatorial diameter | 9.5 | 9.4 | ROS, STR |
| Equatorial plane | 40 % (1.6 / 2.4) | 40 % (1.85 / 2.75) | A&S |
| Lens surface shape | `z = eq ± T(1 − (r/R)²)^p`, reproducing the apical radius exactly | Same method, new parameters | Rounded equator with a vertical tangent |
| Nucleus | Lens profile scaled 0.66 / 0.62, a single mesh | Same proportions, built as 4 solid quadrants with closed faces, so it can fragment | Proportions are illustrative (age-dependent) |
| Cortex | Shell at 0.97 / 0.95 | Shell at 0.985 / 0.975, a thinner gap to the capsule | Visual |
| Capsule | Shell of the lens shape, always inflated | Same shell; after the IOL is placed the empty bag **settles** (`bagCollapse`): the anterior rim lies on the optic edge, the posterior capsule sits about 0.05 mm behind the optic, and the haptics rest in the equatorial fornix | BCSC §11 |
| Capsule cut face | None | A thin band (0.035 mm) drawn on the section planes, with the rhexis opening left out | A membrane has no volume to cap |
| Zonules | Static | Re-laid out whenever the bag changes shape. Anterior, equatorial and posterior insertions; the fibres cross | BCSC §2/§11 |
| Ciliary body | Top at z 0.3; processes at z −1.2 (0.1 anterior to the equator) | Top at z 0.05 (just behind the angle); processes at the equator plane; circumlental space ≈ 0.6 mm | BCSC §2, STR |
| Iris root | r 5.55, z 0.5 | r 5.45, z 0.0: behind Schwalbe's line (z 0.31), forming an open angle | BCSC §2 |
| Iris on the lens | Pupil margin 0.16 mm above the lens surface | Unchanged while phakic. After the IOL is placed, the pupil margin settles back to z −0.55 (`irisPseudoZ`), depicting qualitatively that the anterior chamber deepens. No contact with the cornea, lens, capsule or IOL at any pupil size (validated) | BCSC §11 |
| Pupil | 3.2 / 7.0 / 3.8 mm | Unchanged | BCSC §2/§11 |
| Axial length | 24.0 | 24.04 | A&S |
| IOL optic | 6.0 mm, centre thickness 0.85, hand-set profile | 6.0 mm, symmetric biconvex R 14.0, centre thickness 0.95, edge 0.30. R was chosen so that paraxial rays focus on the model retina (thin-lens power in aqueous ≈ 23 D, a typical range). This is **not** an IOL power calculation | BCSC §3, `optics.js` |
| IOL haptics | Engaged radius 4.65 (bag) | Centre-line 4.45, outer edge 4.52, in a bag 9.4 mm across: they sit in the equatorial fornix. The uncompressed span is ~13 mm | VASS (the real in-vivo bag is ~10–10.5 mm), BCSC §11 |
| IOL final position | Centre 0.05 mm in front of the equator plane, in an inflated bag | Centre on the equator plane, centred, behind the iris, inside the settled bag | BCSC §11 |
| Clear-corneal incision | Texture mark at r 5.25 | Straight tunnel: external opening at r 5.48 (inside the 5.85 limbus), internal opening at r 4.58, length 0.92 mm, pitch 11.5°; fulcrum at the tunnel mid-point (r 5.0) | FINE, EYEWIKI |
| Injector nozzle | 1.1 mm bore | 2.04 mm bore, 2.4 mm outer diameter (so the depicted rolled IOL fits) | Illustrative |
| Cross-section | Sclera and ciliary body only | Every layer is clipped by the same two planes (a 90° temporal wedge), with **capped cut faces** on the cornea, iris, nucleus, cortex (ring around the nucleus), capsule (band) and the settled IOL optic. Thin parts (zonules, haptics, processes, fragments) are clipped with double-sided materials, so no hollow interiors show | `eye-model.js` |
| Light rays | Hand-drawn polylines | Traced with vector Snell's law through the model surfaces (indices 1.376 / 1.336 / 1.42 / 1.5). The paraxial focus after IOL placement is 0.002 mm from the model retina. Scattering in the cloudy lens remains illustrative. A caption in the UI labels the rays as an "Illustrative light path" | A&S, NAV, LB; `optics.js` |

## Layer order, relative scale and transparency

- **Layer order along the axis** (validated in `constraints.js`): cornea, then anterior chamber, then iris (only for r ≥ pupil), then lens/capsule, then vitreous. This is checked for every radius from 0 to 4.7 mm, at the 3 pupil sizes, phakic and settled. The checks are: the iris never touches the cornea, the iris never intersects the lens or the settled capsule, the lens never touches the cornea, the settled bag is never inverted, and the bag never moves backwards as it settles.
- **Render order** for transparency (`renderOrder`): zonules 1, nucleus 2, cortex 3, cut faces 4, capsule 5, capsule band / IOL 6, flap / IOL cap 7, rays 8, pupil ring 9, cornea 10, cornea cap 11. The transparent shells do not write depth.
- **Materials.**
  - The nucleus is now opaque and double-sided, so a fragment never looks hollow.
  - The IOL is slightly more visible against the red reflex (opacity 0.34).
  - The cut faces are matte, so the section reads as tissue rather than glass.

## Intentional educational simplifications (clearly not anatomy)

- **Bag diameter.** The capsular bag stays 9.4 mm wide (the lens diameter). The real empty bag is about 10–10.5 mm. The bag also does not deform around the haptics; it is axisymmetric.
- **Tunnel length.** The clear-corneal tunnel is a straight 0.92 mm tunnel in a rigid cornea. Real tunnels are typically longer and stepped, and the cornea deforms around instruments. The ±1.6 mm wound region is therefore exempt from penetration checks.
- **Lens index.** The lens has one homogeneous index (1.42). There is no gradient index and no aspheric corneal surfaces.
- **Not modelled:** the conjunctiva, eyelids, speculum, tear film, optic nerve, scleral sulcus and trabecular meshwork.
- **Capsule thickness.** The capsule is drawn as a single shell. Its true thickness (about 10–20 µm anterior, a few µm posterior) is far below display resolution.
- **Cortical spokes** are a painted alpha texture.
- **IOL optic thickness** is visually compressed (×0.5) while the IOL is rolled in the cartridge.
- **Iris in the pseudophakic eye.** Its posterior shift (to z −0.55) is qualitative.
