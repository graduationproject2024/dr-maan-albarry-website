# Illustration review: procedure library (phase 1)

**Medical review: pending Dr. Maan.** None of these images has been reviewed by a physician. They are illustrative anatomy for patient education, not clinical or surgical references, and must not be described as clinically reviewed until Dr. Maan signs them off.

## Summary

The owner judged the previous seven renders "visually weak and repetitive": each was the same sagittal cut-away of the eye with minor changes. Every composition has been replaced, and so have the underlying models. Each procedure now has its own viewpoint, cut and teaching idea. Palette, light rig, line weight and backgrounds are shared, so the set still reads as one series.

| Slug | Before (95702cd) | After |
| --- | --- | --- |
| `cataract-surgery` | Sagittal cut-away with a phaco tip | Split **before / after** macro of the anterior segment, seen from the front and above, with the upper half cut away to just behind the lens |
| `laser-vision-correction` | Same cut-away with a long flap sliver | **Orthographic corneal block diagram** showing the five layers, the lifted flap, the reshaped bed and the removed tissue |
| `icl` | Same cut-away with a cyan strip | **Oblique posterior-chamber macro** with a wedge cut along the implant's long axis, so the vault gap is visible |
| `keratoconus-cxl` | Same cut-away with a violet haze | **Side view of the cone** compared with a dashed normal dome, with riboflavin-saturated stroma, a UV-A field and a **loupe** on the cross-link lattice |
| `corneal-transplant` | Same cut-away with sutures | **Frontal view** of a sutured 8 mm graft, plus an inset of **PK / DALK / endothelial** layer variants |
| `intravitreal-injections` | Whole-globe section with no drug shown | **3D globe opened behind the ora**, showing the fundus (macula, disc and vessels), a pars plana needle and a **medication bolus** |
| `lens-implants` | Cut-away with a small inset of 2 optics | **"Product" study of four optics**: monofocal, toric, trifocal and EDOF, each with a floor caustic that hints at its optical idea |

Contact sheets (light | dark, 1600 px files scaled to tiles):

- `docs/phase-1/evidence/illustrations/before-contact-sheet.jpg`: the previous set.
- `docs/phase-1/evidence/illustrations/round-1-contact-sheet.jpg`: the first full render of the new compositions.
- `docs/phase-1/evidence/illustrations/round-2-contact-sheet.jpg`: after the dark-theme and framing fixes.
- `docs/phase-1/evidence/illustrations/round-3-contact-sheet.jpg`: final.

## Asset audit: `public/images/` and `public/images/procedures/`

"Used by" was checked with a repository search of `main.js`, `index.html`, `doctor-data.js` and the other source files (`docs/` and `tests/` excluded). Identical files were found by MD5. This workstream owns only `public/images/procedures/`, so the other recommendations below are for the owner or the content workstream to act on. No file outside `procedures/` was changed.

| File | Size | Used by | Verdict | Justification |
| --- | --- | --- | --- | --- |
| `doctor-portrait.jpg` | 200 × 200, 45 KB | `og:image`, `twitter:image`, JSON-LD | **Improve** | Social cards want about 1200 × 630. At 200 px the image is upscaled and soft when the page is shared. Export an owner-approved 1200 × 630 crop from the master portrait. |
| `dr-maan-portrait.png` | 295 × 225, 68 KB | Home hero (`main.js`) | **Improve** | Correct subject and in use, but small for 2× screens and stored as PNG. Supply a 2× WebP/AVIF (≈ 590 × 450) and keep the PNG as the fallback. |
| `dr-maan-faculty.jpg` | 1024 × 768, 223 KB | — | **Retain (pending consent)** | A conference group photo with other identifiable people. Use it only with their consent. If unused, move it out of `public/` so it is not deployed. |
| `dr-maan-redsea.jpg` | 682 × 1024, 111 KB | — | **Retain (pending use)** | Genuine event portrait with the conference branding baked in. Suitable for an "about / speaking" section. It is not deployed usefully while unused. |
| `clinic-exam-room.jpg` | 512 × 279, 51 KB | — | **Remove** | Unused. It looks staged or synthetic, its provenance is unknown and it is only 512 px. Replace it with a real photo of Dr. Maan's clinic if one is wanted. |
| `cornea-cxl.jpg` | 286 × 512, 43 KB | — | **Remove** | Unused. It is a phone screenshot mock-up with Arabic text and Pentacam maps baked in. The file name ("cxl") does not match the content. The new `keratoconus-cxl` illustration supersedes it. |
| `diagnostics-pentacam.jpg` | 512 × 279, 51 KB | — | **Remove** | Unused and mislabelled: it shows an optics lab bench, not a Pentacam. |
| `surgery-phaco.jpg` | 512 × 279, 20 KB | — | **Remove** | Unused and mislabelled: it shows eye drops and protective glasses (an after-care kit), not phacoemulsification. If kept for an after-care section, rename it and add alt text. |
| `sim-driving-cataract.jpg` | 512 × 279, 30 KB | — | **Remove** | Unused. It was superseded by the procedural vision simulator. |
| `sim-driving-clear.jpg` | 512 × 279, 31 KB | — | **Remove** | Unused, with a screenshot frame and Arabic UI text baked in. Superseded by the vision simulator. |
| `uploaded_1.png` | 68 KB | — | **Remove** | Byte-identical duplicate of `dr-maan-portrait.png`. |
| `uploaded_2.jpg` | 111 KB | — | **Remove** | Byte-identical duplicate of `dr-maan-redsea.jpg`. |
| `uploaded_3.jpg` | 223 KB | — | **Remove** | Byte-identical duplicate of `dr-maan-faculty.jpg`. |
| `procedures/<slug>.webp`, `-dark`, `-800`, `-dark-800` (28 files) | 1600 × 1000 / 800 × 500, 14–85 KB | Procedure pages and cards (`main.js` via `__PROC_IMAGES__`) | **Replaced** | Rebuilt as described in this document. The file names, sizes and themes are unchanged, so no code change is needed. Every file is ≤ 85 KB, well under the 180 KB budget. |

## How the images are made

Run `node scripts/illustrations/render.mjs [slug …]`. Add `PREVIEW_DIR=<dir>` to also write JPEG previews. Run `node scripts/illustrations/contact-sheet.mjs <dir> <out.jpg> [light|dark|both] [title]` to build a review sheet.

The render is procedural three.js 0.170, run in headless Playwright Chromium (ANGLE/D3D11 on Windows). It renders at 3200 × 2000 and downsamples to 1600 × 1000 and 800 × 500. Chromium's `toDataURL('image/webp')` encodes the files, starting at q 0.90. No dependency was added.

| File | Role |
| --- | --- |
| `src/anatomy.js` | Schematic-eye maths, unchanged in this round apart from usage. |
| `src/globe.js` (**new**) | Full 360° lathe eye. Wedge, half or depth-limited box cuts use clipping planes (`clipIntersection`). Each cut face is covered by a painted cap made with the shared section painters. It also holds the vitreous and aqueous painting, the coronal "floor" faces, the brunescent-cataract vertex colouring and the fundus texture (azimuthal map with macula, fovea, optic disc and branching arcades). |
| `src/kit.js` | Lathe and cornea builders. Added: `wedgePlanes`, `clipAll`, `capPlane`, `paintedQuad`, `colorize`, `normalMapFrom` and `glowSprite`. |
| `src/eye.js` | Section painters, kept and shared. The optic disc moved from 15° to 23° nasal, about 4.4 mm from the fovea. |
| `src/instruments.js` | The ICL plate can now be built in full. |
| `src/main.js` | Compositor. A composition is a list of 3D passes, each with a camera, optional rect, mask and edge fade, plus 2D `under` and `over` layers. One **camera-space light rig** (`style.js` `LIGHT_RIG`) lights every scene from the same screen direction: warm key from the upper left, cool fill from the right, rim from behind. On the dark background, faded edges are toned towards the background so bright tissue never glows as a halo. |
| `src/scenes/*.js` (**new**) | One file per composition. |

### Shared brand language

- **Backgrounds:** the same warm off-white and deep neutral dark radial gradients as before.
- **Tissue palette:** unchanged from the section palette. Sclera is ivory, the cornea pale blue-grey, the iris warm brown, the ciliary body and choroid maroon, and the retina coral.
- **Accents:** **teal** for implants and donor tissue, **violet** for invisible light (excimer, UV-A) and cross-links, **yellow** for riboflavin.
- **Line weight:** a 2.1 px ink line at 1600 px on every cut face.
- **Lighting:** the same camera-space key, fill and rim lights, and the same procedural `RoomEnvironment` reflections.
- **Text:** no text, numbers or labels are baked into any image.

## Per procedure: what changed, anatomy, simplifications, alt text

Dimensions follow the schematic eye already documented in `docs/implementation/clinical-visual-reconstruction/ILLUSTRATIONS.md`: corneal radius 7.8 mm, central thickness 0.52 mm, diameter 11.7 mm, anterior chamber depth ≈ 3.0 mm, lens 4.0 × 9.5 mm, axial length 23.5 mm, sclera 0.75 mm. The sources are Gullstrand (1909), Navarro et al. (*JOSA A* 1985), Liou & Brennan (*JOSA A* 1997) and Snell & Lemp, *Clinical Anatomy of the Eye* (1998). Corneal layer thicknesses are typical published values: epithelium ≈ 50 µm, Bowman's layer ≈ 12 µm, Descemet's membrane ≈ 10 µm, endothelium ≈ 5 µm.

### 1. `cataract-surgery`: split before / after

- **Composition:** a front-and-above macro (camera 50° above the optical axis) of the anterior segment. The upper half is cut away, but only down to just behind the lens (z = −4.0 mm). The rest of the globe stays intact, and a pale vitreous "floor" closes the cut instead of exposing the whole retinal bowl. A hairline seam divides the frame. **Left:** a cloudy lens, with a brunescent amber-brown nucleus inside a milky cortex with cortical spokes, filling the capsular bag. **Right:** the same eye after surgery, with the emptied capsular bag holding a clear, ghosted teal 6 mm IOL optic. The pupil is dilated to 6.3 mm.
- **Anatomy shown:** cornea, anterior chamber, iris, ciliary body, zonules, capsular bag and lens (or IOL), and the vitreous face.
- **Simplifications:**
  - The IOL haptics are generic C-loops.
  - The capsulorhexis is not drawn on the "after" side.
  - Behind the clear pupil the fundus is toned dark, so the pupil reads as it does in life.
- **EN alt:** "Split illustration of the front of the eye cut open: on the left, a cloudy yellow-brown natural lens (a cataract) fills the lens capsule behind the iris; on the right, the same eye after surgery with a clear artificial lens in its place."
- **AR alt:** «رسم توضيحي مقسوم لمقدمة العين مقطوعة: على اليسار عدسة طبيعية معتمة مائلة إلى البني المصفر (الماء الأبيض) تملأ كيس العدسة خلف القزحية، وعلى اليمين العين نفسها بعد الجراحة وقد حلّت مكانها عدسة صناعية شفافة.»

### 2. `laser-vision-correction`: corneal block diagram

- **Composition:** an orthographic, near-diagrammatic block of the cornea alone. The anterior surface is up and the back half is kept. The front cut face shows five distinct layers:
  - stratified epithelium, with basal, wing and surface cells;
  - Bowman's layer;
  - stroma, with lamellae and keratocytes;
  - Descemet's membrane;
  - an endothelial monolayer.

  An 8.6 mm, 110 µm flap is lifted on its far-side (superior) hinge, and its cut edge shows the epithelium, Bowman's layer and thin anterior stroma. The exposed bed carries the reshaped, flatter central profile. The **original bed profile is dashed** and the removed lens-shaped tissue is a pale violet ghost: a myopic ablation of 80 µm over a 6.6 mm zone. A fine excimer beam and a faint scan pattern are shown in illustrative violet.
- **Simplifications:**
  - Thickness, flap depth and ablation depth are **exaggerated ×3**, and Bowman's layer and the endothelium are drawn at a minimum visible width, so the layers read at card size. Lateral dimensions are to scale.
  - Real 193 nm light is invisible.
  - The scan pattern is schematic.
- **EN alt:** "Diagram of a slice of the cornea showing its layers, with a thin flap lifted back and a fine laser beam reshaping the layer beneath; a dashed line marks the original curve and a pale shaded lens shape marks the tissue removed."
- **AR alt:** «رسم تخطيطي لشريحة من القرنية يُظهر طبقاتها، مع سديلة رقيقة مرفوعة إلى الخلف وشعاع ليزر دقيق يعيد تشكيل الطبقة التي تحتها؛ ويُشير خط متقطع إلى الانحناء الأصلي وشكل فاتح على هيئة عدسة إلى النسيج الذي أُزيل.»

### 3. `icl`: the vault

- **Composition:** an oblique macro with anterior to the left. A wedge of the anterior segment is removed to just behind the lens. One cut face runs exactly along the implant's long axis and shows:
  - the cornea and the iris, lifted slightly over the implant;
  - the ICL plate arching over the **clear natural lens**, with its footplate resting in the ciliary sulcus;
  - the aqueous-filled **vault gap** (≈ 0.5 mm centrally), tinted aqua so it is unmistakable.

  The other cut face crosses the plate's short axis. Through the pupil, the 3D plate is visible behind the iris.
- **Simplifications:**
  - The plate outline and thickness are generic and brand-free.
  - The central port is omitted.
  - The vault tint is illustrative; aqueous is clear.
- **EN alt:** "Cut-away illustration of the front of the eye showing an implantable lens resting just behind the coloured iris and arching over the eye's own clear lens, with a small fluid-filled gap between them."
- **AR alt:** «رسم توضيحي مقطوع لمقدمة العين يُظهر عدسة مزروعة تستقر خلف القزحية الملوّنة مباشرة وتتقوّس فوق عدسة العين الطبيعية الشفافة، مع فراغ صغير مملوء بالسائل بينهما.»

### 4. `keratoconus-cxl`: cone, riboflavin, UV, cross-links

- **Composition:** the front of the eye from the side, with anterior up and to the left. A wedge is cut through the cone, so the cut face compares the thinned, steepened **cone** with the **normal dome** (dashed). The cone is inferior paracentral: it bulges 0.62 mm and thins to ≈ 0.36 mm.
  - The epithelium is removed centrally (epi-off).
  - The stroma is saturated with **riboflavin**, strongest anteriorly.
  - A **lattice texture** of lamellae and bridging cross-links runs through the treated stroma.
  - A soft **UV-A field** falls along the axis.
  - A loupe magnifies the stroma: lamellae alternate between fibrils seen lengthwise and fibrils cut end-on, joined by violet cross-link bridges.
- **Simplifications:**
  - The cone is a smooth Gaussian deformation.
  - Riboflavin depth and the lattice are schematic.
  - The UV colour is illustrative; 365 nm light is barely visible.
  - The loupe is not to scale.
- **EN alt:** "Illustration of a cone-shaped, thinned cornea (keratoconus) compared with the normal dome shape, soaked in yellow riboflavin drops under a soft band of ultraviolet light, with a magnified circle showing new links forming between the cornea's fibres."
- **AR alt:** «رسم توضيحي لقرنية رقيقة مخروطية الشكل (القرنية المخروطية) مقارنةً بشكل القبة الطبيعي، مشبّعة بقطرات الريبوفلافين الصفراء تحت حزمة ناعمة من الأشعة فوق البنفسجية، مع دائرة مكبّرة تُظهر روابط جديدة تتكوّن بين ألياف القرنية.»

### 5. `corneal-transplant`: sutured graft and layer variants

- **Composition:** a near-frontal view of the eye. An **8 mm donor button** is outlined by a faint graft–host interface ring and held by **16 fine interrupted sutures**, with the knots buried on the host side. An abstract inset shows three corneal blocks, each drawn with the same five-layer palette as the LVC diagram. The donor tissue is teal:
  - **PK:** full thickness, with sutures;
  - **DALK:** everything above Descemet's membrane;
  - **endothelial keratoplasty:** Descemet's membrane and the endothelium only, with a dashed outline because the graft is internal.

  The image is tasteful, with no blood.
- **Simplifications:**
  - Suture thickness is slightly exaggerated for card size.
  - The inset blocks are flat and schematic.
  - Endothelial keratoplasty is shown as one generic thin graft (DMEK and DSAEK are not distinguished).
- **EN alt:** "Illustration of an eye after a corneal transplant: a clear circular donor cornea held by fine, evenly spaced stitches, beside three small diagrams showing a full-thickness transplant, a front-layer transplant and an inner-layer transplant."
- **AR alt:** «رسم توضيحي لعين بعد زراعة القرنية: قرنية دائرية شفافة من متبرع مثبتة بغرز دقيقة متساوية التباعد، وبجانبها ثلاثة رسوم صغيرة تُظهر زراعة كاملة السماكة، وزراعة للطبقات الأمامية، وزراعة للطبقة الداخلية.»

### 6. `intravitreal-injections`: pars plana entry and bolus

- **Composition:** the whole globe from the side and slightly behind, with anterior to the left and the optic nerve to the right. A wedge of the **posterior** globe is opened behind the ora serrata, so the front of the eye stays intact for the entry site. Visible structures:
  - the clear vitreous cavity, with a semi-opaque gel face at the cut;
  - the fundus, with the **macula** at the posterior pole, the optic disc and branching vessels;
  - a fine 30 G needle entering through the **pars plana 3.75 mm behind the limbus** (an arc on the outer sclera) and aimed at the mid-vitreous;
  - a soft **medication bolus** spreading from the needle tip.
- **Simplifications:**
  - The macula sits on the optical axis.
  - The vessel pattern is procedural.
  - The vitreous is drawn nearly clear so the retina shows.
  - The drug's colour is illustrative; most are clear.
- **EN alt:** "Cut-away illustration of the whole eye: a very fine needle enters the white of the eye a few millimetres behind the coloured part and releases a small cloud of medicine into the clear gel, in front of the retina and macula at the back of the eye."
- **AR alt:** «رسم توضيحي مقطوع للعين كاملة: إبرة دقيقة جدًا تدخل بياض العين على بُعد بضعة مليمترات خلف الجزء الملوّن وتُطلق سحابة صغيرة من الدواء داخل الهلام الشفاف، أمام الشبكية والبقعة في مؤخرة العين.»

### 7. `lens-implants`: optics study

- **Composition:** a product-style row of four brand-free one-piece IOLs (6 mm optic, C-loop haptics), resting just above a soft floor:
  - **monofocal:** a plain optic;
  - **toric:** three axis dots on each side;
  - **multifocal / trifocal:** diffractive rings across the optic, modelled as a sawtooth relief normal map;
  - **EDOF:** a few broad echelettes in the central 2.6 mm only.

  Under each lens, the light it focuses onto the floor hints at its optical idea: one point, a line focus, a point with halo rings, and a stretched soft focus.
- **Simplifications:**
  - Ring spacing (≈ 0.6 √k mm) and echelette radii are abstract and match no product.
  - The caustics are illustrative, not ray-traced.
  - The haptics are drawn as round tubes.
- **EN alt:** "Four artificial lens implants side by side: a plain single-focus lens, a toric lens with small alignment marks, a multifocal lens with fine rings and an extended-depth-of-focus lens with a few central rings, each casting a different pattern of focused light."
- **AR alt:** «أربع عدسات صناعية مزروعة جنبًا إلى جنب: عدسة أحادية البؤرة بسيطة، وعدسة لعلاج الاستجماتيزم (توريك) بعلامات محاذاة صغيرة، وعدسة متعددة البؤر بحلقات دقيقة، وعدسة ممتدة العمق البؤري بحلقات مركزية قليلة، وكلٌّ منها يُسقط نمطًا مختلفًا من الضوء المركّز.»

> The alt text above is proposed. The site currently reads its alt text from the procedure content, which is owned by another workstream. The content owner should copy these strings across when the images land.

## Critique rounds

Each round was rendered and every image was inspected at 1600 px. The contact-sheet tiles (≈ 480 px) and selected 800 px files served as the card-size check, and both backgrounds were reviewed.

**Before.** All seven images had the same camera, cut and framing. A saturated retinal bowl dominated four of them. Procedure details were small.

**Building the compositions (between the "before" sheet and round 1):**

- **Cataract:**
  - A full-length wedge cut exposed the whole orange retinal bowl again, and the V-shaped notch read awkwardly.
  - Fix: the cut became a depth-limited half cut with a vitreous floor face.
  - The section's vitreous region was transparent, so the retina showed through as a salmon band. Fix: vitreous gel and an aqueous tint are now painted under every cut face.
- **ICL:**
  - The plate's long-axis profile was painted on both cut faces. Fix: each cap is now painted with its own true section, sampled from the plate geometry.
  - Anterior pointed up and the lens wedge dominated. Fix: the view was re-oriented with anterior to the left, and the camera was offset so the long-axis face is seen nearly square-on.
- **CXL:**
  - The view was too frontal, so the cone did not show in silhouette. Fix: the camera moved to 82° from the axis.
  - The loupe lattice looked like scattered pins. Fix: it was redrawn as alternating lamellae with regular bridges.
- **Transplant:**
  - The eye was buried behind the inset panel. Fix: a camera frame shift was added.
  - The pupil was milky. Fix: lens opacity was reduced and the fundus darkened.
- **Injection:**
  - Opaque gel on the cut faces hid the retina entirely. Fix: the vitreous is now nearly clear here.
  - The needle tip was hidden by the intact anterior globe. Fix: the camera moved slightly behind the equator. A further move to 122° exposed the lens and pushed the needle tip visually close to it, so the camera was set back to 102°.
- **Implants:**
  - The row was cropped, the haptics were heavy and the caustics were hidden under the optics. Fix: the lenses were respaced, the haptics thinned and the floor light offset along the key-light direction.

**Round 1 (first full sheet):**

- On the dark background, edge fades turned bright tissue into glowing white haloes (cataract, ICL, transplant, CXL). Fix: the compositor now tones faded margins towards the background on dark.
- **Cataract and ICL:** about a third of each frame was empty gel floor. Fix: both were reframed and cropped tighter.
- **LVC:** the lifted flap was oversized and cropped. Fix: it was folded back further (126°) and the frame widened.
- **Implants (light):** pale optics on a pale floor. Fix: a deeper optic tint, a stronger square-edge rim and deeper shadows.

**Round 2:**

- The dark-theme haloes were reduced but still visible on cataract and ICL. Fix: stronger toning and a tighter crop.
- **LVC:** the keratocyte dashes were noisy. Fix: about 60 % fewer, at lower contrast.

**Round 3 (final):**

- All seven compositions are mutually distinct: different viewpoint, cut type and teaching device.
- The anatomy is consistent with the schematic eye.
- Key elements read at card size: the brunescent nucleus vs the IOL, the layer stack and the dashed bed profile, the vault gap, the cone vs the dashed dome and the loupe, the sutures and the inset variants, the needle, bolus and macula, and the four optic types.

## Known limitations

- **Cataract (dark):** the "after" half still shows a soft light area of vitreous above the IOL. This is intended (gel), but it is the brightest region of that frame.
- **ICL:** a light vitreous floor fills the lower right corner.
- **Injection:** the macula is seen obliquely at the posterior pole, at the edge of the opened sector. It is legible, but not face-on.
- **CXL (light):** the UV rays slightly wash the upper left.
- **Rotationally symmetric anatomy:** the ciliary processes and retina are lathed, so the fovea sits on the optical axis.
- **Colour of invisible light:** the excimer and UV-A colours are illustrative.
- **No clinical review yet** (see the top of this document).

## Licensing

All geometry, textures and images in `public/images/procedures/` were generated procedurally by the code in `scripts/illustrations/`, written for this project. That includes the iris fibre texture, fundus map, cataract colouring, diffractive normal maps, cut-face paintings, loupe, inset blocks, glows and caustics.

- **Nothing external:** the pipeline downloads nothing and uses no third-party 3D models, photographs, textures or HDRIs.
- **Runtime libraries:**
  - **three.js** (MIT): its procedural `RoomEnvironment` is used for reflections.
  - **Playwright/Chromium** (Apache-2.0 / BSD): used only to render and encode.

The images are original works for the Dr. Maan Albarry website.
