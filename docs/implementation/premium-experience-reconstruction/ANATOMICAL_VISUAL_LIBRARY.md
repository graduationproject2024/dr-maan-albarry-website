# Anatomical visual library (atlas)

**Medical review: none.** No physician has reviewed any image in this library. Every asset has `reviewStatus: "pending"`, reviewer evidence *none* and approval *not approved*. Do not describe these images as clinically reviewed until Dr. Maan Albarry has reviewed them and the review is recorded in `public/images/procedures/manifest.json` and in `docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md`.

Brief §8 asks for anatomical imagery to become a core brand element instead of small thumbnails. This library gives every procedure a hierarchy of images rendered by one pipeline, with one light rig, one palette and one camera language.

| Level | Use | Master | Delivered sizes (WebP, transparent + neutral) | Budget (WebP) | Count |
| --- | --- | --- | --- | --- | --- |
| L1 | Homepage / card preview | 1200 × 1500 (4:5) | 480, 800, 1200 + JPEG 800 (neutral) | ≤ 120 KB | 7 |
| L2 | Procedure-page hero | 2400 × 1350 (16:9) | 640, 1024, 1600, 2400 + JPEG 1024 and 1600 (neutral) | 1600 w ≤ 250 KB | 7 |
| L3 | Close-up of the structures the procedure acts on | 1600 × 1200 (4:3) | 640, 1024, 1600 + JPEG 1024 (neutral) | ≤ 150 KB | 13 |
| L4 | Interactive | — | Only the existing cataract 3D simulator. No new simulators were built. | — | — |

That makes 27 assets, 210 files and 11.8 MB in `public/images/procedures/atlas/`. Nothing on the site references them yet, so page weight is unchanged. Every WebP is within its budget: the largest are L1 120 KB, L2 at 1600 w 159 KB and L3 148 KB. The manifest lists the exact bytes, quality and encoder settings of each file.

## Files

| Path | What |
| --- | --- |
| `public/images/procedures/manifest.json` | The asset manifest. For each asset it records `assetId`, `procedure`, `level`, `camera` plus the exact `cameraSpec`, `files` (background, format, width, height, bytes, quality), `labelAnchors` (normalised x, y + EN/AR names), `structures`, `references` (keys and citations from CLINICAL_SOURCES.md only), `knownSimplifications`, `alt` (AR + EN, ≤ 160 characters, checked by the build), `caption` (AR + EN), `questionsForDrMaan`, `version`, `reviewStatus: "pending"`, `approval: "not approved"` and `licence`. |
| `public/images/procedures/atlas/<assetId>-alpha-<w>.webp` | The transparent master (WebP with alpha) at width `w`. |
| `public/images/procedures/atlas/<assetId>-neutral-<w>.webp` / `.jpg` | The neutral-background variant (the series warm off-white) and its JPEG fallback. |
| `public/images/procedures/atlas/<assetId>.anchors.json` | The label anchors of one asset (the same data as in the manifest). |
| `public/images/procedures/<slug>[-dark][-800].webp` | The legacy 1600 × 1000 card files the current pages use. They are kept with the same names and sizes, and re-rendered with the weak-spot fixes. |
| `scripts/illustrations/atlas.mjs` | Renders the atlas and writes the manifest. `PREVIEW_DIR=<dir>` also writes review JPEGs with the anchors drawn; `DRY=1` writes nothing to `public/`. |
| `scripts/illustrations/src/atlas.js`, `atlas.html` | The render page: frame size, alpha and neutral composition, anchor projection and encoding. |
| `scripts/illustrations/src/atlas/shots.js` | The shot list: level, frame, camera and anchors of every asset. |
| `scripts/illustrations/src/atlas/compose.js`, `scenes-extra.js` | The atlas compositions: sagittal close-up, quadrant and half cut-aways, IOL-in-bag specimen, ICL and pars plana sections, fundus view, collagen lattice and keratoplasty section. |
| `scripts/illustrations/src/atlas/cameras.js`, `structures.js` | The camera language, and the structure vocabulary (EN + AR) that anchors use. |
| `scripts/illustrations/atlas-meta.mjs`, `atlas-manifest.mjs` | The editorial metadata (alt text, captions, references, simplifications, questions) and the manifest builder. The builder checks references, structures and alt-text length. |
| `scripts/illustrations/atlas-sheet.mjs` | Builds the review contact sheets. |
| `docs/implementation/premium-experience-reconstruction/evidence/anatomy/` | The evidence sheets (listed below). |

The evidence folder holds:

- `contact-sheet.jpg`: all assets on the neutral background.
- `contact-sheet-alpha-on-dark.jpg`: the transparent masters on a dark surface.
- `sheet-<slug>.jpg`: one sheet per procedure.
- `anchors-check.jpg`: every anchor drawn on its image.
- `legacy-cards-after.jpg`: the legacy card files after the fixes.

## Per-asset register

| Asset ID | Procedure | Level | Structures | Reference sources | Known simplifications | Review status | Reviewer evidence | Version | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `cataract-surgery-l2-hero` | cataract-surgery | L2 (oblique) | Cloudy lens nucleus, Lens cortex, Lens capsule, Lens implant optic, Capsular bag, Iris, Ciliary body, Zonules, Cornea | A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, ROS, VASS, EYEWIKI, AAO-cataract, NEI | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Split view: left half before surgery, right half the same eye after; the capsulorhexis opening is not drawn on the “after” side. IOL haptics are generic C-loops; the vitreous floor behind the lens is translucent gel (it was a bright slab in the previous version). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `cataract-surgery-l1-card` | cataract-surgery | L1 (oblique) | Cloudy lens nucleus, Cornea, Iris, Retina, Sclera, Vitreous, Optic nerve | A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, AAO-cataract, NEI | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. A quarter of the globe is removed to show the inside; the vitreous is drawn as a translucent gel. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `cataract-surgery-l3-lens-capsule` | cataract-surgery | L3 (sagittal) | Cloudy lens nucleus, Lens cortex, Anterior capsule, Posterior capsule, Zonules, Ciliary body, Iris, Cornea, Anterior chamber | A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, ROS, STR, EYEWIKI | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Lens thickness 4.0 mm (a cataract-age lens is often thicker); nucleus and cortex boundaries are soft gradients, not graded opacity types. Zonules are drawn as a sparse fan of fibres. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `cataract-surgery-l3-iol-in-bag` | cataract-surgery | L3 (sagittal) | Lens implant optic, Capsular bag, Posterior capsule, Haptic (support arm), Zonules, Ciliary body, Iris, Cornea | A&S, NAV, LB, BCSC, AAO-anatomy, VASS, BCSC, EYEWIKI, AAO-cataract | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Generic one-piece acrylic IOL (6 mm optic, C-loop haptics); the emptied bag keeps its 9.4 mm model diameter (in vivo ~10–10.5 mm, see VASS). The anterior chamber is not shown deepening after surgery. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `lens-implants-l2-hero` | lens-implants | L2 (oblique) | Lens implant optic, Capsular bag, Zonules, Ciliary body, Iris, Cornea | A&S, NAV, LB, BCSC, AAO-anatomy, VASS, BCSC, EYEWIKI, AAO-IOL | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Generic monofocal one-piece IOL; no brand or product geometry. A quarter of the globe is removed; the vitreous is a translucent gel. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `lens-implants-l1-card` | lens-implants | L1 (frontal) | Lens implant optic, Haptic (support arm), Capsular bag, Zonules, Ciliary body | BCSC, EYEWIKI, VASS, AAO-IOL | Specimen view: cornea, iris and the outer coats are omitted to show the capsule; only the pleated ciliary ring (pars plicata) is kept. Generic C-loop one-piece IOL; zonules drawn as a sparse fan. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `lens-implants-l3-iol-in-bag` | lens-implants | L3 (oblique) | Lens implant optic, Haptic (support arm), Capsular bag, Zonules, Ciliary body | BCSC, EYEWIKI, VASS, STR | Specimen view: cornea, iris and outer coats omitted; the ciliary ring is trimmed behind the pars plicata. Bag diameter 9.4 mm (model) vs ~10–10.5 mm in vivo; haptic shape generic. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `lens-implants-l3-optic-types` | lens-implants | L3 (oblique) | Monofocal lens, Toric lens, Toric axis marks, Multifocal (trifocal) lens, Extended depth of focus lens, Haptic (support arm) | AAO-IOL, BCSC, EYEWIKI | Four brand-free one-piece optics resting on a surface; diffractive ring spacing (≈0.6√k mm) and EDOF echelettes are abstract and match no product. Toric marks are three dots each side; real marks vary by manufacturer. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `laser-vision-correction-l2-hero` | laser-vision-correction | L2 (oblique) | Corneal flap, Flap hinge, Reshaped stromal bed, Tissue removed by the laser (illustrative), Laser beam (illustrative colour), Epithelium, Bowman's layer, Stroma, Descemet's membrane, Endothelium | DZ, NAV, BCSC, AAO-LASIK, AAO-PRK, FDA-LASIK | Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. Shows LASIK (flap) only; PRK and SMILE are not illustrated. Myopic ablation profile and depth are illustrative; the excimer beam colour is illustrative (193 nm light is invisible). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `laser-vision-correction-l1-card` | laser-vision-correction | L1 (oblique) | Corneal flap, Reshaped stromal bed, Laser beam (illustrative colour), Stroma | DZ, BCSC, AAO-LASIK, FDA-LASIK | Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. Illustrative beam colour; LASIK shown as the representative technique. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `laser-vision-correction-l3-corneal-layers` | laser-vision-correction | L3 (macro) | Epithelium, Bowman's layer, Stroma, Descemet's membrane, Endothelium, Reshaped stromal bed, Corneal flap | DZ, BCSC, AAO-anatomy, AAO-LASIK | Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. Epithelium ≈50 µm, Bowman ≈12 µm, Descemet ≈10 µm, endothelium ≈5 µm are typical textbook values; keratocytes and lamellae are schematic. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `laser-vision-correction-l3-ablation-profile` | laser-vision-correction | L3 (macro) | Original corneal curve, Tissue removed by the laser (illustrative), Reshaped stromal bed, Laser beam (illustrative colour), Stroma | BCSC, AAO-LASIK, FDA-LASIK | Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. A myopic, lens-shaped removal over a 6.6 mm zone (80 µm drawn ×3) is illustrative, not a treatment plan; the scan-spot pattern is schematic. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `icl-l2-hero` | icl | L2 (oblique) | Implantable contact lens (ICL), Vault (gap above the natural lens), Natural lens, Iris, Cornea, ICL footplate, Anterior chamber, Ciliary body | A&S, NAV, LB, BCSC, AAO-anatomy, STR, AAO-phakic | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Generic, brand-free plate (central port omitted); vault ≈0.5 mm centrally is illustrative. The vault is tinted aqua so it reads; aqueous is clear. The vitreous floor is now translucent (it was a pale slab). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `icl-l1-card` | icl | L1 (oblique) | Implantable contact lens (ICL), Vault (gap above the natural lens), Natural lens, Iris | A&S, NAV, LB, BCSC, AAO-anatomy, AAO-phakic | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Generic plate; vault tint illustrative. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `icl-l3-vault-section` | icl | L3 (sagittal) | Implantable contact lens (ICL), Vault (gap above the natural lens), Natural lens, Iris, ICL footplate, Ciliary sulcus, Ciliary body, Cornea, Anterior chamber | A&S, NAV, LB, BCSC, AAO-anatomy, STR, AAO-phakic | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. True sagittal section along the plate’s long axis; plate thickness and outline generic. The iris is lifted 0.72 mm over the plate (draped iris is simplified). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `keratoconus-cxl-l2-hero` | keratoconus-cxl | L2 (oblique) | Thinned, bulging cone, Normal corneal curve, Riboflavin-soaked stroma, UV-A light (illustrative colour), Stroma, Iris, Anterior chamber | DZ, NAV, BCSC, AAO-KC, AAO-CXL | The cone is a smooth inferior-paracentral bulge (0.62 mm) thinning to ≈0.36 mm; real cones vary. Epithelium-off protocol shown; riboflavin depth schematic; UV-A colour illustrative (365 nm is barely visible). The UV field was toned down after review. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `keratoconus-cxl-l1-card` | keratoconus-cxl | L1 (oblique) | Thinned, bulging cone, Normal corneal curve, Riboflavin-soaked stroma, UV-A light (illustrative colour) | AAO-KC, AAO-CXL, BCSC | Smooth schematic cone; illustrative UV colour. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `keratoconus-cxl-l3-cone-section` | keratoconus-cxl | L3 (sagittal) | Thinned, bulging cone, Normal corneal curve, Riboflavin-soaked stroma, Stroma, Endothelium | DZ, BCSC, AAO-KC, AAO-CXL | Gaussian cone deformation and thinning (≈0.36 mm minimum) are schematic; layers are not exaggerated here. Riboflavin is shown strongest anteriorly, fading with depth (schematic). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `keratoconus-cxl-l3-collagen-crosslinks` | keratoconus-cxl | L3 (macro) | Collagen fibres, Collagen layers (lamellae), New cross-links, Riboflavin-soaked stroma | AAO-CXL, AAO-KC, BCSC | Schematic, not to scale: real fibrils are ~30 nm thick and lamellae ~2 µm; stacking and bridge density are illustrative. Cross-links are drawn as violet bridges concentrated in the anterior stroma; their chemistry is not depicted. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `corneal-transplant-l2-hero` | corneal-transplant | L2 (frontal) | Donor cornea (graft), Graft–host junction, Stitches, Iris, Pupil, Sclera | A&S, NAV, LB, BCSC, AAO-anatomy, AAO-KP, NHS-KP | 8 mm full-thickness graft with 16 interrupted stitches (buried knots); suture thickness slightly exaggerated. Donor tissue is drawn barely cooler than the host; the eye is quiet (no redness, no blood). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `corneal-transplant-l1-card` | corneal-transplant | L1 (frontal) | Donor cornea (graft), Stitches, Graft–host junction | AAO-KP, NHS-KP | Interrupted sutures only; slightly exaggerated thickness. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `corneal-transplant-l3-graft-section` | corneal-transplant | L3 (sagittal) | Donor cornea (graft), Graft–host junction, Stitches, Epithelium, Stroma, Endothelium | DZ, BCSC, AAO-KP, NHS-KP | Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. Penetrating keratoplasty only: a near-vertical wound through every layer; lamellar grafts (DALK, endothelial keratoplasty) are not drawn in this image. Stitch track depth (~90 %) is illustrative. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `corneal-transplant-l3-sutured-junction` | corneal-transplant | L3 (macro) | Stitches, Graft–host junction, Donor cornea (graft), Iris | AAO-KP, NHS-KP | Suture calibre and knot size slightly exaggerated so they read; knots buried on the host side. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `intravitreal-injections-l2-hero` | intravitreal-injections | L2 (oblique) | Fine needle, Entry through the pars plana, Medication (illustrative colour), Vitreous, Retina, Macula, Optic disc, Optic nerve, Sclera | A&S, NAV, LB, BCSC, AAO-anatomy, AAO-IVT, AAO-inj, NEI-AMD | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. Entry drawn 3.75 mm behind the limbus (standard anatomy texts give ~3.5–4 mm); this distance is NOT in CLINICAL_SOURCES and is marked for review. Needle shown without a gauge label; medication colour illustrative (most are clear); vessel pattern procedural. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `intravitreal-injections-l1-card` | intravitreal-injections | L1 (oblique) | Fine needle, Medication (illustrative colour), Vitreous, Retina, Macula | AAO-IVT, AAO-inj, NEI-AMD | Illustrative entry position and medication colour (see hero). | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `intravitreal-injections-l3-pars-plana-entry` | intravitreal-injections | L3 (sagittal) | Entry through the pars plana, Pars plana, Ciliary body, Ora serrata, Retina, Natural lens, Vitreous, Medication (illustrative colour), Limbus, Fine needle | A&S, NAV, LB, BCSC, AAO-anatomy, AAO-IVT, AAO-inj | Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. Tissue colours are a calm illustration palette, not true histology colours. SIMPLIFIED / PENDING: entry 3.75 mm behind the limbus and the ora serrata ~6.6 mm behind it follow standard anatomy texts, not a source listed in CLINICAL_SOURCES. The needle is drawn in the section plane; its gauge and length are not specified. | Pending physician review | none | atlas-2026.11-r1 | not approved |
| `intravitreal-injections-l3-macula` | intravitreal-injections | L3 (macro) | Fovea, Macula, Optic disc, Retinal blood vessels, Retina | A&S, NAV, LB, BCSC, AAO-anatomy, NEI-AMD, AAO-IVT | Healthy schematic fundus (no AMD or diabetic changes); vessel branching is procedural. Optic disc ~4.4 mm from the fovea; fovea on the optical axis (schematic eye). Seen from inside the eye (no laterality implied). | Pending physician review | none | atlas-2026.11-r1 | not approved |

The reference keys are those used in `docs/implementation/clinical-visual-reconstruction/CLINICAL_SOURCES.md`:

- **Textbook and literature sources:** A&S, NAV, LB, DZ, DUB-S, ROS, STR, VASS, BCSC, EYEWIKI and NEI.
- **Patient pages listed there:** AAO-cataract, AAO-IOL, AAO-LASIK, AAO-PRK, FDA-LASIK, AAO-phakic, AAO-KC, AAO-CXL, AAO-KP, NHS-KP, AAO-IVT, AAO-inj, NEI-AMD and AAO-anatomy.

The manifest carries the full citation for each key. As CLINICAL_SOURCES.md itself notes, the textbook citations were not re-checked online.

**Not in CLINICAL_SOURCES:** two positions come from standard anatomy texts, not from that file:

- the pars plana entry, drawn 3.75 mm behind the limbus;
- the ora serrata, drawn about 6.6 mm behind the limbus.

Both are marked *simplified / pending* in the manifest and appear in the questions below.

## Art direction

**Lighting.** Every image uses one camera-space light rig (`style.js` `LIGHT_RIG`), shared with the legacy cards:

- a warm key light from the upper left;
- a cool fill from the right;
- a rim light from behind;
- a warm/grey hemisphere light;
- the procedural three.js `RoomEnvironment` for reflections.

Tone mapping is neutral, at exposure 1.0 with sRGB output. There is no bloom. Glows are limited to the illustrative laser beam, the medication bolus and the UV field. The UV field was toned down after the earlier review (opacity 0.20 → 0.12, and a shorter column).

**Materials.**

- Tissue is matte PBR (roughness 0.55–0.8, envMap ≤ 0.45), so nothing looks plastic. Only the cornea, the lens implants and the capsule are glossy and translucent.
- Cut faces are *painted sections* (the canvas painters in `eye.js`). Each frame re-rasterises them at one canvas pixel per render pixel, so close-ups are true re-renders, not upscaled crops.
- The vitreous is a translucent gel. The bright, opaque gel slab of the earlier images is gone.

**Palette.**

- **Tissue:** ivory sclera, pale blue-grey cornea, warm brown iris, maroon ciliary body and choroid, coral retina, and a cream lens with an amber cataract nucleus.
- **Accents:** teal for implants and donor tissue, violet for invisible light (excimer, UV-A) and cross-links, and yellow for riboflavin.

The colours of invisible light and of medication are illustrative, and the alt text, captions and anchors say so.

**Camera language** (`src/atlas/cameras.js`). The manifest gives the exact camera for each asset.

| Type | Rule | Used for |
| --- | --- | --- |
| Sagittal cut-away | Square to a meridional cut (≤ 20° off), anterior to the LEFT, superior up, long lens (fov 12–14°) | Lens and capsule, IOL in the bag, ICL vault, pars plana entry, cone section, PK section |
| Frontal | Along the visual axis, ≤ 25° off-axis | Transplant hero and card, IOL specimen card |
| 3/4 oblique | 35–65° off-axis, raised 15–35°, with a cut-away facing the camera | Most L1 and L2 images, IOL specimen, optic types |
| Macro | fov 10–12°, frame height 2–8 mm, on one structure | Corneal layers, ablation profile, sutured junction, collagen lattice, posterior pole |

**Framing.**

- L1 is 4:5, with the subject filling 50–80 % of the frame.
- L2 is 16:9, with room on one side for HTML text.
- L3 is 4:3, as full-bleed close-ups.

Cut-aways that run out of frame end in a soft elliptical fade. On the transparent masters the fade is compressed into a short band. Before this change, bright tissue left a long translucent rim that read as a halo on dark surfaces (see `contact-sheet-alpha-on-dark.jpg`). Free-standing subjects are complete objects with soft contact shadows and are never cropped mid-tissue: the whole globes, the specimens, the optics and the collagen block.

**Line weight.** Ink outlines on cut faces stay at 2.1 px per 1600 px of output at every level and zoom (`RES.ink`).

**Annotation.** No text, numbers or labels are baked into any image. Labels are HTML, placed from `labelAnchors`:

- Each anchor is a normalised x, y (0,0 = top-left), projected at render time from 3D eye coordinates through the shot camera. The same anchors therefore hold for every width and both backgrounds.
- The build drops any anchor that falls outside the frame.
- Each anchor names a structure from `structures.js` (EN + AR).

Suggested label style:

- a 6 px dot on the anchor, with a short leader to a text label;
- labels kept outside cut faces where possible;
- on Arabic pages, mirror the side the label sits on, never the image.

**Backgrounds.**

- *Transparent* (WebP alpha), for placing on any surface. The alpha plane is quantised to 64 levels to keep files small.
- *Neutral* (the series warm off-white, `#FBF8F3 → #F1EBE2`), as WebP plus a JPEG fallback.

## Weak spots from the earlier review (docs/phase-1/ILLUSTRATION_REVIEW.md)

| Weak spot | Fix |
| --- | --- |
| Bright gel in the dark cataract image | The vitreous floor (`floorAlpha 0.6`) and the gel on the cut face (`gelAlpha 0.66`) are now translucent, and the floor is toned down. The “after” half no longer has a white patch on dark (see `legacy-cards-after.jpg` and the atlas L2 hero). |
| Pale area in the ICL image | The vitreous floor is translucent (`floorAlpha 0.5`) instead of a pale slab, in the legacy card and in atlas L1/L2. |
| Oblique macula view | The intravitreal hero camera moved from 102° to 66° off-axis. A new L3 (`intravitreal-injections-l3-macula`) shows the posterior pole face-on from inside the eye. The fundus map was rebuilt for close-ups, with soft mottling and continuous vessels. |
| UV wash in the light CXL image | UV column opacity went from 0.20 to 0.12 and ray opacity from 0.22 to 0.13, and the column was shortened from 26 to 17 mm. The atlas card and section use 60 % of that intensity. |
| Also fixed | The EDOF optic's relief normal map read as a spiral, so the EDOF optic now shows rings only (legacy and atlas). The halo on the transparent masters on dark surfaces is fixed (see Framing). |

## Licensing

All geometry, textures and images are **original procedural three.js work written for this site** (`scripts/illustrations/`). That covers the eye solids, cut-face paintings, iris and fundus textures, IOL and ICL models, needle, sutures, collagen lattice and all glows. **No third-party model, texture, HDRI or photograph is used.**

Libraries used:

- **three.js 0.170** (MIT), including its procedural `RoomEnvironment`.
- **Playwright/Chromium** (Apache-2.0 / BSD), for rendering, and for WebP and JPEG encoding through `canvas.toDataURL`. `sharp` is not installed and was not added.

The installed `anatomy` skill was consulted. It covers isometric machine figures, not human anatomy, so only its verification discipline (render, zoom in, check the anchors) was applied.

## Questions for Dr. Maan (per image)

- **`cataract-surgery-l2-hero`**: Is the degree of brunescence (amber nucleus with milky cortex) a fair “typical” cataract for patients, or should a milder grade be shown? Should the “after” half show the capsulorhexis edge resting on the optic?
- **`cataract-surgery-l1-card`**: Is a whole-eye cut-away the right first impression for the homepage, or would a front view of a cloudy pupil be more recognisable to patients?
- **`cataract-surgery-l3-lens-capsule`**: Do you want a specific cataract type shown (nuclear, cortical, posterior subcapsular) or keep this mixed “typical” look? Is the zonule anatomy (anterior, equatorial and posterior insertions) detailed enough or too busy for patients?
- **`cataract-surgery-l3-iol-in-bag`**: Is the IOL position (optic against the posterior capsule, haptics in the bag equator) how you want it explained?
- **`lens-implants-l2-hero`**: Should the hero show a premium (toric or multifocal) optic instead of a plain monofocal?
- **`lens-implants-l1-card`**: Is a specimen view (iris and cornea removed) acceptable for patients, or is it too abstract?
- **`lens-implants-l3-iol-in-bag`**: Is the haptic angulation and contact with the bag equator realistic for the IOLs you use?
- **`lens-implants-l3-optic-types`**: Which lens families should be shown (e.g. trifocal vs bifocal, diffractive vs non-diffractive EDOF)?
- **`laser-vision-correction-l2-hero`**: Do you also want PRK (surface) and SMILE (lenticule) versions of this diagram? Is the flap thickness relative to the cornea acceptable given the ×3 exaggeration?
- **`laser-vision-correction-l1-card`**: Is the violet beam colour acceptable as an illustrative convention?
- **`laser-vision-correction-l3-corneal-layers`**: Should the flap interface depth (≈110 µm drawn ×3) be shown, or a femtosecond flap of a different thickness?
- **`laser-vision-correction-l3-ablation-profile`**: Should a hyperopic (ring-shaped) profile be shown alongside the myopic one?
- **`icl-l2-hero`**: Is a ~0.5 mm central vault the right “ideal” to depict? Should the central port be drawn?
- **`icl-l1-card`**: Is this close-up recognisable enough at card size?
- **`icl-l3-vault-section`**: Is the footplate position in the ciliary sulcus drawn correctly? Is it appropriate to name the vault for patients?
- **`keratoconus-cxl-l2-hero`**: Should the epithelium-on (trans-epithelial) protocol be shown too?
- **`keratoconus-cxl-l1-card`**: Is the cone’s steepness exaggerated too much for patients?
- **`keratoconus-cxl-l3-cone-section`**: Is the minimum thickness (≈360 µm) a sensible “moderate” example?
- **`keratoconus-cxl-l3-collagen-crosslinks`**: Is depicting cross-links as discrete bridges acceptable as a patient-level simplification?
- **`corneal-transplant-l2-hero`**: Interrupted, running or combined sutures — which pattern should patients see? Is 8 mm a representative graft size?
- **`corneal-transplant-l1-card`**: Is a sutured PK the right representative image, given DMEK/DALK are also offered?
- **`corneal-transplant-l3-graft-section`**: Should separate DALK and DMEK section images be added (we can draw them if you confirm the layer boundaries to show)? Is the wound profile (vertical trephination) right, or do you prefer a shaped (e.g. mushroom/top-hat) profile?
- **`corneal-transplant-l3-sutured-junction`**: Is the knot burial / suture length realistic?
- **`intravitreal-injections-l2-hero`**: Confirm the entry distance behind the limbus to depict (phakic vs pseudophakic). Should the needle angle be shown (e.g. aimed at the mid-vitreous)?
- **`intravitreal-injections-l1-card`**: Is a visible needle acceptable on the homepage, or should a calmer image be used for anxious patients?
- **`intravitreal-injections-l3-pars-plana-entry`**: Confirm the entry distance to depict and whether to show it as a range. Is the ora serrata position (~6.6 mm behind the limbus) acceptable?
- **`intravitreal-injections-l3-macula`**: Should a diseased version (wet AMD, diabetic macular oedema) be drawn for the conditions section?

General questions:

1. Some Arabic terms are not yet used on the site. They are listed in `scripts/illustrations/src/atlas/structures.js` (the entries without `site: true`), for example طبقة بومان، غشاء ديسيميه، الجسم الهدبي، الثلم الهدبي، الألياف المعلِّقة للعدسة، النُّقرة، الحافة المسنّنة للشبكية. Please confirm or correct them.
2. Should Arabic pages use the same image orientation (anterior to the left)? Only the labels would mirror.
3. Which images may show visible instruments, such as the needle, on public pages?

## Remaining weak spots

- `lens-implants-l1-card` and `lens-implants-l3-iol-in-bag`: the specimen's ciliary ring is a heavy maroon ring, and the ciliary processes are not modelled (the ring is a smooth lathe).
- `intravitreal-injections-l2-hero`: the macula still sits at the far edge of the opened globe. The face-on view is in the L3.
- The L3 sagittal and macro images are full-bleed rectangles, so their transparent masters are opaque except where the frame shows background.
- `keratoconus-cxl-l3-collagen-crosslinks` is schematic (not to scale), and the bridges read as short violet stubs.
- `corneal-transplant-l3-graft-section` shows PK only. Lamellar sections (DALK, DMEK/DSAEK) are not drawn in 3D; the legacy card keeps its 2D inset of them.
- The anatomy is rotationally symmetric: the fovea sits on the optical axis, and the ciliary processes, retina and iris are lathe solids.

## How to re-render

```
node scripts/illustrations/atlas.mjs [assetId|slug|L1|L2|L3 …]   # atlas assets + manifest.json (all if no arguments)
node scripts/illustrations/render.mjs                             # legacy 1600 × 1000 cards
node scripts/illustrations/atlas-sheet.mjs <out.jpg> [slug|all] [--dark] [--h 300]
```
