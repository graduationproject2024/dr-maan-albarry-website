# Procedure library illustrations

**Medical review: pending Dr. Maan.** None of these images has been reviewed by a physician. They are illustrative anatomy only and must not be described as clinically reviewed until Dr. Maan signs them off.

## Files

All files are in `public/images/procedures/`. Every slug has four WebP files:

| File | Size | Background |
| --- | --- | --- |
| `<slug>.webp` | 1600 × 1000 | warm off-white (`#FBF8F3` → `#F1EBE2` radial) |
| `<slug>-dark.webp` | 1600 × 1000 | deep neutral dark (`#23262B` → `#14161A` radial) |
| `<slug>-800.webp` | 800 × 500 | light |
| `<slug>-dark-800.webp` | 800 × 500 | dark |

The slugs are `cataract-surgery`, `lens-implants`, `laser-vision-correction`, `icl`, `keratoconus-cxl`, `corneal-transplant` and `intravitreal-injections`. The renderer encodes each file at WebP quality 0.90 and steps the quality down only if a file goes over 180 KB. In the current render every file is between 17 and 74 KB, so none needed a lower quality. No text, labels or measurements are baked into any image.

## Reproducing the renders

```
node scripts/illustrations/render.mjs                    # all seven slugs
node scripts/illustrations/render.mjs icl lens-implants  # selected slugs
PREVIEW_DIR=<dir> node scripts/illustrations/render.mjs  # also write JPEG previews for review
```

- `render.mjs` starts a small static server on `127.0.0.1:4573`. Set `ILLU_PORT` to use another port. The server serves `scripts/illustrations/` and the installed `three@0.170.0`.
- It launches headless Playwright Chromium. On Windows it uses `--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist`.
- In the browser, `window.renderSlug(slug)` renders the scene at 3200 × 2000 with MSAA and downsamples it to 1600 × 1000 and 800 × 500. Chromium's `canvas.toDataURL('image/webp', q)` does the encoding. `sharp` is not installed and no dependency was added.
- Source layout:
  - `src/anatomy.js`: schematic-eye maths.
  - `src/kit.js`: lathe and cornea builders, materials, and the section painter.
  - `src/eye.js`: the shared eye and the cut-face painters.
  - `src/instruments.js`: instruments, implants and the light column.
  - `src/scenes.js`: the seven scenes.
  - `src/style.js`: the shared camera, palette, line weight and backgrounds.
  - `src/main.js`: rendering and compositing.

## Shared visual language

- **Camera.** Every scene uses the same sagittal cut-away of the globe, with the half towards the viewer removed and anterior to the left. The camera is a 14° perspective, 24° yaw towards anterior and 9° elevation. Only the framing height changes between scenes: anterior segment 15.2 mm, cornea 11.2 mm and whole globe 28.5 mm.
- **Cut face.** The cut face is a painted section plane on `y = 0`. Each tissue has a flat medical-illustration fill, a soft inner edge shade, fine structural hatching and a 2.1 px ink outline (at 1600 px width). Behind the plane, lit 3D half-solids of the same profiles give depth. These include the iris front surface, the retinal bowl with its macular tint, the corneal dome and the zonular fibres.
- **Implants.** Implants are sectioned in the same way as the tissues. The IOL optic, IOL haptics and the ICL plate keep only the `y ≥ 0` half, and their cut faces use one teal implant tone.
- **Lighting.** Every scene has the same hemisphere light, warm key light, cool fill light and rim light. Reflections use three.js's procedural `RoomEnvironment`, which is generated geometry rather than an HDRI. Tone mapping is Neutral.
- **Edge fade.** In the anterior and cornea frames, the globe fades softly into the background where it continues out of frame. Instruments are composited again afterwards, so they enter the frame crisply.

## Anatomy dimensions and sources

The geometry is in millimetres. The constants were copied, not imported, from `src/cataract-sim/anatomy.js` and adjusted as follows:

| Structure | Value |
| --- | --- |
| Anterior corneal radius | 7.8 mm |
| Corneal diameter | 11.7 mm |
| Central corneal thickness | 0.52 mm (0.67 mm peripheral) |
| Anterior chamber depth (endothelium to lens) | ≈ 3.0 mm |
| Crystalline lens | 4.0 mm thick (1.6 mm anterior + 2.4 mm posterior), 9.5 mm diameter, anterior radius 10 mm, posterior radius 6 mm |
| Globe | outer scleral radius 11.25 mm, axial length 23.5 mm |
| Sclera | 0.75 mm |
| Choroid | 0.22 mm |
| Retina | ≈ 0.13–0.24 mm, with a foveal pit |
| Pars plicata | ≈ 2 mm |
| Ora serrata | ≈ 6.6 mm behind the limbus |

The values are typical adult values from the Gullstrand, Navarro and Liou-Brennan schematic eyes and from standard ophthalmic anatomy texts:

- Gullstrand, A., *Helmholtz's Handbuch der Physiologischen Optik*, 3rd ed., 1909, Appendix.
- Navarro, R., Santamaría, J., Bescós, J., "Accommodation-dependent model of the human eye with aspherics", *JOSA A* 2(8), 1985.
- Liou, H.-L., Brennan, N. A., "Anatomically accurate, finite model eye for optical modeling", *JOSA A* 14(8), 1997.
- Snell, R. S., Lemp, M. A., *Clinical Anatomy of the Eye*, 2nd ed., Blackwell, 1998.

The procedure-specific values are illustrative typical values and are not surgical recommendations:

| Procedure | Values used |
| --- | --- |
| Cataract surgery | phaco needle ≈ 0.9 mm diameter, sleeve ≈ 1.4 mm, 5.2 mm capsulorhexis |
| Lens implants | 6 mm optic, ≈ 9 mm in-bag haptic span |
| Laser vision correction | 8.6 mm flap, 110 µm thick; 80 µm central ablation over 7.6 mm |
| ICL | ≈ 11.5 mm plate, ≈ 0.5 mm vault |
| Keratoconus CXL | cone apex thinned to ≈ 0.40 mm; 8.8 mm irradiated zone |
| Corneal transplant | 8 mm graft |
| Intravitreal injection | 30 G needle, 3.75 mm behind the limbus |

## Per-image notes and alt text

### 1. `cataract-surgery`
- **Shows:** a cross-section of the anterior segment with a cloudy crystalline lens. The lens has a brunescent amber nucleus, a milky cortex with cortical spokes, and its capsule opened centrally by a capsulorhexis. A phaco needle with its irrigation sleeve enters through a small temporal clear-corneal incision at the limbus. The tip is roughly parallel to the iris plane and approaches the nucleus. The pupil is dilated.
- **Simplifications:**
  - The incision tunnel is not modelled separately; the instrument is drawn over the cut cornea.
  - The handpiece is generic.
  - Irrigation and fluidics are not shown.
- **EN alt:** "Cross-section illustration of the front of the eye: a cloudy, yellowed natural lens behind the iris, with a fine ultrasound probe entering through a small incision at the edge of the cornea."
- **AR alt:** «رسم توضيحي لمقطع عرضي لمقدمة العين: عدسة طبيعية معتمة مائلة إلى الصفرة خلف القزحية، مع مسبار دقيق بالموجات فوق الصوتية يدخل عبر شق صغير عند حافة القرنية.»

### 2. `lens-implants`
- **Shows:** the cross-section after lens removal. The capsular bag has a posterior capsule, an equator and an anterior leaflet that rests on the optic. A one-piece IOL sits inside it: a sectioned 6 mm biconvex optic with square edges, and the kept halves of two C-loop haptics in the bag behind the iris. A brand-free inset panel compares two IOLs face-on: a plain monofocal optic on the left and a multifocal (trifocal-type) optic with abstract concentric diffractive rings on the right.
- **Simplifications:**
  - The ring count and spacing are abstract (`0.58·√k` mm) and do not match any product.
  - The haptics are round tubes.
  - The bag is drawn as thin lines only.
- **EN alt:** "Cross-section illustration of an artificial lens implant centred in the natural lens capsule behind the iris, with an inset comparing a single-focus lens and a multifocal lens with fine concentric rings."
- **AR alt:** «رسم توضيحي لمقطع عرضي لعدسة صناعية مزروعة في منتصف كيس العدسة الطبيعي خلف القزحية، مع إطار صغير يقارن بين عدسة أحادية البؤرة وعدسة متعددة البؤر ذات حلقات دقيقة متحدة المركز.»

### 3. `laser-vision-correction`
- **Shows:** a cross-section of the cornea with an 8.6 mm, 110 µm hinged flap folded back on a superior hinge. The flap is shown in section, with its epithelium and as a translucent half-dome. The exposed stromal bed has a flattened central profile from an 80 µm myopic ablation, highlighted with a fine light line. A thin, softly glowing beam meets the bed.
- **Simplifications:**
  - The excimer beam is drawn in violet, although real 193 nm light is invisible.
  - The scanning-spot pattern is reduced to a single beam.
  - The hinge is modelled as a tangent line rather than a chord.
  - The flap angle is illustrative.
- **EN alt:** "Cross-section illustration of the cornea during laser vision correction: a thin corneal flap folded back on its hinge and a fine laser beam gently reshaping the central corneal layer beneath."
- **AR alt:** «رسم توضيحي لمقطع عرضي للقرنية أثناء تصحيح النظر بالليزر: سديلة قرنية رقيقة مطوية على مفصلها وشعاع ليزر دقيق يعيد تشكيل الطبقة الوسطى من القرنية بلطف.»

### 4. `icl`
- **Shows:** a phakic posterior-chamber plate lens, sectioned like the tissues. It lies between the back of the iris and the clear natural lens, with a vault of about 0.5 mm over the lens and its footplates in the ciliary sulcus. The natural lens is kept clear. The pupillary iris is shown gently lifted forward by the implant.
- **Simplifications:**
  - The plate outline, thickness profile and optic are generic.
  - The central port that some models have is deliberately omitted to stay brand-free.
  - The sulcus geometry is approximate.
- **EN alt:** "Cross-section illustration of an implantable contact lens placed just behind the iris and in front of the eye's own clear natural lens."
- **AR alt:** «رسم توضيحي لمقطع عرضي لعدسة لاصقة مزروعة داخل العين، موضوعة خلف القزحية مباشرة وأمام العدسة الطبيعية الشفافة للعين.»

### 5. `keratoconus-cxl`
- **Shows:** a keratoconic cornea with an inferior paracentral cone, a steepened anterior surface and thinning to about 0.40 mm at the cone. The epithelium is removed centrally (epi-off). A riboflavin tint colours the anterior stroma (in the section and the dome). A soft, abstract violet UV light field with faint parallel rays falls on a 9 mm zone.
- **Simplifications:**
  - The cone is a smooth Gaussian deformation, and in this section it sits inferiorly.
  - The riboflavin penetration depth is schematic.
  - The UV colour is illustrative, since 365 nm light is barely visible.
- **EN alt:** "Cross-section illustration of a thinned, cone-shaped cornea (keratoconus) with a yellow vitamin B2 (riboflavin) tint in the cornea and a soft band of ultraviolet light used for corneal cross-linking."
- **AR alt:** «رسم توضيحي لمقطع عرضي لقرنية رقيقة مخروطية الشكل (القرنية المخروطية)، مع صبغة صفراء من فيتامين ب2 (الريبوفلافين) داخل القرنية وحزمة ناعمة من الأشعة فوق البنفسجية المستخدمة في تثبيت القرنية.»

### 6. `corneal-transplant`
- **Shows:** a penetrating keratoplasty with an 8 mm donor button. The graft has a slightly cooler tint, and fine full-thickness graft–host junction lines run through the cut cornea. In the section, the two interrupted sutures in the cut plane are drawn as loops passing through about 86% of the depth. On the corneal dome, seven more interrupted sutures and a faint junction ring sit on the kept half (16 sutures in total around the full eye). The image is tasteful and has no blood or tissue damage.
- **Simplifications:**
  - Knots are not shown.
  - Suture thickness is slightly exaggerated so it stays visible at card size.
  - The graft has the same thickness as the host.
- **EN alt:** "Cross-section illustration of a corneal transplant: a circular donor cornea held in place by fine, evenly spaced stitches around its edge."
- **AR alt:** «رسم توضيحي لمقطع عرضي لزراعة القرنية: قرنية دائرية من متبرع مثبتة بغرز دقيقة متساوية التباعد حول حافتها.»

### 7. `intravitreal-injections`
- **Shows:** a whole-globe cross-section. It includes:
  - the cornea, iris, clear lens, zonules and ciliary body;
  - the pars plana;
  - the vitreous cavity, with the retinal bowl visible behind it;
  - the sclera, choroid and retina, including the macula and foveal pit at the posterior pole;
  - the optic nerve with its sheath and central vessels, about 15° nasal.

  A fine 30 G needle with a translucent hub enters through the pars plana about 3.75 mm behind the limbus, aimed at the centre of the globe, with its tip in the mid-vitreous.
- **Simplifications:**
  - The macula is placed on the optical axis.
  - The optic nerve is a straight sheathed cylinder.
  - The vitreous is left clear so the retina stays visible.
  - The injected drug is not shown.
  - No measurements are drawn.
- **EN alt:** "Cross-section illustration of the whole eye showing the retina and macula at the back, with a very fine needle entering the white of the eye just behind the coloured part to deliver medicine into the gel-filled centre."
- **AR alt:** «رسم توضيحي لمقطع عرضي للعين كاملة يُظهر الشبكية والبقعة في الخلف، مع إبرة دقيقة جدًا تدخل بياض العين خلف الجزء الملوّن مباشرة لإيصال الدواء إلى مركز العين الهلامي.»

## Visual critique rounds

Each round was rendered and every image was inspected at 1600 px and at 800 px card size, on both backgrounds.

**Round 1 (first full render)**
- The retinal bowl seen through the vitreous was a flat, saturated orange that dominated the frame. It was muted to `#E4AC94` and darkened slightly towards the ora for depth.
- The cornea-centred scenes (LVC, CXL, PK) were framed exactly like the anterior-segment scenes, so the procedure detail was small. They were reframed to 11.2 mm.
- **ICL:**
  - A full, uncut 3D plate drawn in front of the cut plane read as a cyan blob over the iris.
  - The optic-edge ring tube intersected the plate and showed as a zig-zag line.
  - Fix: the plate was cut to the kept half and its section painted like the tissues, and the ring was removed.
- **IOL:**
  - The front haptic projected into the vitreous because of the 24° yaw.
  - The bag membrane read as a solid peach shape.
  - Fix: the haptics were reoriented and the bag opacity reduced from 0.32 to 0.14.
- **LVC:** at 98° the flap was a long, blade-like sliver leaving the frame. It was changed to 62° on the superior hinge, and the beam was moved to x = −1.05 mm so it no longer crosses the flap.
- **CXL:** the UV column was too heavy (0.34 opacity) and tinted the iris violet. It was reduced to about 0.2–0.24.

**Round 2**
- **IOL:** after reorientation, haptic segments in front of the cut plane still seemed to float outside the bag. Fix: the haptics were clipped to the kept half, which is consistent with the cut-away convention.
- **CXL:** the riboflavin band became a hard, saturated yellow stripe (0.85 alpha). It was softened to 0.5 alpha with a wider blur.
- **ICL:** the section strip was too faint at 800 px. The implant outline was strengthened from 1.6 px to 2.0 px.

**Round 3**
- **PK:** the 3D sutures and junction ring seemed to float in front of an almost invisible dome. Fix: the PK corneal dome was made more visible (0.42 opacity), and the sutures were lowered onto the surface and thinned to 0.022 mm.
- **Final check:** contrast was checked in all 28 files.
  - On the dark background, the light sclera and cornea fills and the ink outlines keep the silhouette legible.
  - On the light background, the ink outline and the edge shading do the same.
  - At 800 px, the key elements of every scene still read. Those elements are the instrument, the IOL and ICL section, the flap, the cone, the sutures, the needle and the macula.

## Known limitations

- Several structures are rotationally symmetric about the optical axis: the macula, the ciliary processes and the retina. In reality the fovea is temporal to the optic axis, and the ciliary processes are discrete folds.
- The 3D corneal dome is a simple transparent surface. On the dark background its rim reads as a grey crescent.
- Colours for invisible light (excimer and UV-A) are illustrative.
- Instruments and implants are generic, brand-free approximations.
- The cut-face painting and the 3D halves are rendered separately. At very high zoom, small anti-aliasing seams could show at tissue edges. None are visible at the delivered sizes.
- The images have not had clinical review (see the top of this document).

## Licensing statement

All geometry, textures and images in `public/images/procedures/` were generated procedurally by the code in `scripts/illustrations/`, written for this project. This includes the iris fibre texture, the IOL ring texture, the glow sprite and every cut-face painting. The pipeline downloads nothing. It uses no third-party 3D models, photographs, textures or HDRIs. The only runtime libraries are three.js (MIT licence), whose `RoomEnvironment` is used as procedural reflection lighting, and Playwright/Chromium (Apache-2.0), which is used only to render. The images are original works for the Dr. Maan Albarry website.
