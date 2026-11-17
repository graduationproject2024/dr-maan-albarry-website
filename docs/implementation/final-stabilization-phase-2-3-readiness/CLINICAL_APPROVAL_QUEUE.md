# Clinical approval queue (for Dr. Maan Albarry)

**Status of every item: PENDING. Nothing below has been reviewed or approved by a physician.** Passing tests, careful drawing or references do not count as approval. Only Dr. Maan's own written decision can change an item, recorded with his name and the date.

How decisions are recorded:

- Images and labels: `reviewStatus`, `reviewer`, `reviewedOn` and `approval` per asset in `public/images/procedures/manifest.json`.
- Written content: `REVIEW` in `src/procedures/content.js` and `src/lens-lab/content.js`.
- Simulators: the review screens (below) export a file per session; that file is the evidence.
- `npm run release:check` (also run by CI) fails if anything is marked approved without a reviewer and a date, or is marked approved while its content changed after the review.

Review tools (test builds only, never published; build with `CSIM_HARNESS=1 npm run build`, then `npx vite preview`):

- `vision-sim-preview.html?review=1`: vision simulator, 51 presets, model `vsim-optics-2026.11-r1`.
- `cataract-sim-preview.html?review=1`: 3D cataract viewer, model `csim-anatomy-2026.11-r2`, per-stage gates.

## Summary

| # | Item | Count | Changed since any earlier look | Where |
|---|---|---|---|---|
| 1 | Anatomical images | 27 | 13 (marked re-approval) | Section A below |
| 2 | Plain-language medical terms | 35 | all new in r2 | Section B below |
| 3 | Essential-label choices (which labels show by default) | 27 images | all proposed in r2 | Section A, two label columns |
| 4 | Image captions | 27 | 13 | Section C |
| 5 | 3D cataract stage animations (7 stages) | 7 | no change in this milestone | `cataract-sim-preview.html?review=1` |
| 6 | Instrument and anatomy motion assumptions | 1 list | no change | `master-redesign-phase-2-3/PHASE_3_SIMULATION.md` "Known simplifications" |
| 7 | Vision simulator optical assumptions | 1 model | no change (model version unchanged) | `clinical-visual-reconstruction/VISION_OPTICAL_MODEL.md` |
| 8 | Lens Lab distance behaviour | 1 | **new in this milestone** | Section E below |
| 9 | Halo and glare drawing | 1 | no change | `VISION_OPTICAL_MODEL.md` (halo/glare section) |
| 10 | Known educational simplifications | per image and per simulator | 13 images | Section C, and items 6 and 7 |

## E. New in this milestone: Lens Lab distance view and lens line

1. **Closer view.** Choosing Near, Intermediate or Far now moves the camera closer to the phone, laptop or road sign. The blur of each object is unchanged (scaled with the zoom; see `OPTICAL_MODEL_FINDINGS.md`). A note under the picture says: "Closer view: the picture only moved nearer to the [object]. The lens model and its sharpness did not change." Question: is this presentation acceptable, and is the note clear?
2. **Lens line in the picture caption.** The caption now shows the chosen lens and its existing qualitative wording for that distance, for example "Monofocal: Reading glasses usually needed". The wording is the existing draft in `src/lens-lab/content.js` (`levels`), already pending review; it is now more prominent. Question: is each of the 15 lines (5 lenses × 3 distances, AR and EN) acceptable as a one-line summary under the picture?
3. **Grouped More settings.** No clinical content changed; listed for completeness.

## What needs re-review because it changed after an earlier look

- The 13 images marked `reApprovalNeeded: true` (Section A).
- The Lens Lab `levels` wording, because it is now shown under the picture (E2).
- Nothing in the 3D cataract viewer or the optics model changed in this milestone.

## Not changed by this milestone, still pending from earlier

The doctor and clinic facts D-1 to D-14 (Trello card #13) are separate from clinical review and are not repeated here.

---

Source: `public/images/procedures/manifest.json` (atlas-2026.11-r2). 27 images; 13 changed since any earlier look and marked for re-approval. Every image: review status `pending`, approval `not approved`.

### A. Images (decision per image: approve / approve with changes / reject)

| # | Image | Level | Version | Re-approval | Shown by default | Behind "Show all labels" | Decision |
|---|---|---|---|---|---|---|---|
| 1 | `cataract-surgery-l2-hero` | L2 | atlas-2026.11-r2 | **yes** | Cloudy lens (cataract); Clear artificial lens (implant); Thin bag that holds the lens (capsule); Coloured part of the eye (iris) | Outer part of the lens (cortex); Ring of tissue around the lens (ciliary body) | pending |
| 2 | `cataract-surgery-l1-card` | L1 | atlas-2026.11-r1 | no | Cloudy lens (cataract) | Clear front window (cornea); Coloured part of the eye (iris); White of the eye (sclera); Clear gel inside the eye (vitreous); Ring of tissue around the lens (ciliary body) | pending |
| 3 | `cataract-surgery-l3-lens-capsule` | L3 | atlas-2026.11-r1 | no | Cloudy lens (cataract); Front of the capsule (anterior capsule); Fine fibres holding the lens (zonules) | Outer part of the lens (cortex); Back of the capsule (posterior capsule); Ring of tissue around the lens (ciliary body); Coloured part of the eye (iris); Clear front window (cornea); Space between cornea and iris (anterior chamber) | pending |
| 4 | `cataract-surgery-l3-iol-in-bag` | L3 | atlas-2026.11-r2 | **yes** | Clear artificial lens (implant); Thin bag that holds the lens (capsule); Fine fibres holding the lens (zonules) | Back of the capsule (posterior capsule); Ring of tissue around the lens (ciliary body); Coloured part of the eye (iris); Clear front window (cornea) | pending |
| 5 | `lens-implants-l2-hero` | L2 | atlas-2026.11-r2 | **yes** | Clear artificial lens (implant); Thin bag that holds the lens (capsule); Coloured part of the eye (iris); Clear front window (cornea) | Back of the capsule (posterior capsule); Ring of tissue around the lens (ciliary body); Fine fibres holding the lens (zonules) | pending |
| 6 | `lens-implants-l1-card` | L1 | atlas-2026.11-r2 | **yes** | Clear artificial lens (implant) | Support arm (haptic); Thin bag that holds the lens (capsule); Fine fibres holding the lens (zonules) | pending |
| 7 | `lens-implants-l3-iol-in-bag` | L3 | atlas-2026.11-r2 | **yes** | Clear artificial lens (implant); Support arm (haptic); Thin bag that holds the lens (capsule) | Fine fibres holding the lens (zonules); Ring of tissue around the lens (ciliary body) | pending |
| 8 | `lens-implants-l3-optic-types` | L3 | atlas-2026.11-r1 | no | Monofocal lens; Toric lens; Multifocal (trifocal) lens; Extended depth of focus lens | Toric axis marks; Support arm (haptic) | pending |
| 9 | `laser-vision-correction-l2-hero` | L2 | atlas-2026.11-r1 | no | Thin corneal flap; Tissue removed by the laser (illustrative); Laser beam (illustrative colour); Thick middle layer (stroma) | Flap hinge; Reshaped layer under the flap (stromal bed); Surface layer (epithelium); Inner layer (endothelium) | pending |
| 10 | `laser-vision-correction-l1-card` | L1 | atlas-2026.11-r1 | no | Thin corneal flap; Laser beam (illustrative colour) | Reshaped layer under the flap (stromal bed); Thick middle layer (stroma) | pending |
| 11 | `laser-vision-correction-l3-corneal-layers` | L3 | atlas-2026.11-r1 | no | Surface layer (epithelium); Thick middle layer (stroma); Inner layer (endothelium) | Bowman's layer; Descemet's membrane; Reshaped layer under the flap (stromal bed); Thin corneal flap | pending |
| 12 | `laser-vision-correction-l3-ablation-profile` | L3 | atlas-2026.11-r1 | no | Original corneal curve; Tissue removed by the laser (illustrative); Reshaped layer under the flap (stromal bed) | Laser beam (illustrative colour); Thick middle layer (stroma) | pending |
| 13 | `icl-l2-hero` | L2 | atlas-2026.11-r2 | **yes** | Implanted lens (ICL); Gap above the natural lens (vault); Natural lens; Coloured part of the eye (iris) | Clear front window (cornea); Foot of the implant (footplate); Space between cornea and iris (anterior chamber) | pending |
| 14 | `icl-l1-card` | L1 | atlas-2026.11-r1 | no | Implanted lens (ICL); Natural lens | Gap above the natural lens (vault); Coloured part of the eye (iris) | pending |
| 15 | `icl-l3-vault-section` | L3 | atlas-2026.11-r1 | no | Implanted lens (ICL); Gap above the natural lens (vault); Natural lens; Foot of the implant (footplate) | Coloured part of the eye (iris); Groove behind the iris (ciliary sulcus); Ring of tissue around the lens (ciliary body); Clear front window (cornea); Space between cornea and iris (anterior chamber) | pending |
| 16 | `keratoconus-cxl-l2-hero` | L2 | atlas-2026.11-r2 | **yes** | Thinned, bulging cone; Normal corneal curve; Riboflavin (vitamin B2) in the cornea; UV-A light (illustrative colour) | Coloured part of the eye (iris); Space between cornea and iris (anterior chamber) | pending |
| 17 | `keratoconus-cxl-l1-card` | L1 | atlas-2026.11-r2 | **yes** | Thinned, bulging cone; Normal corneal curve | Riboflavin (vitamin B2) in the cornea; UV-A light (illustrative colour) | pending |
| 18 | `keratoconus-cxl-l3-cone-section` | L3 | atlas-2026.11-r2 | **yes** | Thinned, bulging cone; Normal corneal curve; Riboflavin (vitamin B2) in the cornea | Thick middle layer (stroma); Inner layer (endothelium) | pending |
| 19 | `keratoconus-cxl-l3-collagen-crosslinks` | L3 | atlas-2026.11-r1 | no | Collagen fibres; New bonds between fibres (cross-links) | Collagen layers (lamellae); Riboflavin (vitamin B2) in the cornea | pending |
| 20 | `corneal-transplant-l2-hero` | L2 | atlas-2026.11-r2 | **yes** | Donor cornea (graft); Edge where the graft meets the cornea (junction); Stitches | Coloured part of the eye (iris); Pupil; White of the eye (sclera) | pending |
| 21 | `corneal-transplant-l1-card` | L1 | atlas-2026.11-r2 | **yes** | Donor cornea (graft); Stitches | Edge where the graft meets the cornea (junction) | pending |
| 22 | `corneal-transplant-l3-graft-section` | L3 | atlas-2026.11-r1 | no | Donor cornea (graft); Edge where the graft meets the cornea (junction); Stitches | Surface layer (epithelium); Thick middle layer (stroma); Inner layer (endothelium) | pending |
| 23 | `corneal-transplant-l3-sutured-junction` | L3 | atlas-2026.11-r1 | no | Stitches; Edge where the graft meets the cornea (junction); Donor cornea (graft) | Coloured part of the eye (iris) | pending |
| 24 | `intravitreal-injections-l2-hero` | L2 | atlas-2026.11-r2 | **yes** | Fine needle; Medicine (illustrative colour); Centre of sharp vision (macula); Light-sensitive layer (retina) | Where the needle enters (pars plana); Where the nerve leaves the eye (optic disc); Clear gel inside the eye (vitreous); Optic nerve | pending |
| 25 | `intravitreal-injections-l1-card` | L1 | atlas-2026.11-r2 | **yes** | Fine needle; Medicine (illustrative colour) | Centre of sharp vision (macula); Light-sensitive layer (retina) | pending |
| 26 | `intravitreal-injections-l3-pars-plana-entry` | L3 | atlas-2026.11-r1 | no | Where the needle enters (pars plana); Light-sensitive layer (retina); Medicine (illustrative colour) | Flat part of the ciliary body (pars plana); Ring of tissue around the lens (ciliary body); Edge of the retina (ora serrata); Natural lens; Clear gel inside the eye (vitreous); Edge of the cornea (limbus) | pending |
| 27 | `intravitreal-injections-l3-macula` | L3 | atlas-2026.11-r1 | no | Central pit of the macula (fovea); Centre of sharp vision (macula); Where the nerve leaves the eye (optic disc) | Retinal blood vessels; Light-sensitive layer (retina) | pending |

### B. Plain-language terms (decision per term: accept / change to …)

35 medical terms are shown to patients in plainer words. The medical term stays in brackets where space allows.

| # | Medical term (EN) | Patient wording (EN) | Medical term (AR) | Patient wording (AR) | Images | Decision |
|---|---|---|---|---|---|---|
| 1 | Cloudy lens nucleus | Cloudy lens (cataract) | نواة العدسة المعتمة | العدسة المعتمة (الماء الأبيض) | 3 | pending |
| 2 | Lens cortex | Outer part of the lens (cortex) | قشرة العدسة | الجزء الخارجي من العدسة (القشرة) | 2 | pending |
| 3 | Lens implant optic | Clear artificial lens (implant) | الجزء البصري للعدسة المزروعة | العدسة الصناعية الشفافة (المزروعة) | 5 | pending |
| 4 | Capsular bag | Thin bag that holds the lens (capsule) | كيس المحفظة | كيس رقيق يحمل العدسة (المحفظة) | 5 | pending |
| 5 | Iris | Coloured part of the eye (iris) | القزحية | الجزء الملوّن من العين (القزحية) | 11 | pending |
| 6 | Ciliary body | Ring of tissue around the lens (ciliary body) | الجسم الهدبي | حلقة النسيج حول العدسة (الجسم الهدبي) | 8 | pending |
| 7 | Cornea | Clear front window (cornea) | القرنية | النافذة الشفافة في المقدمة (القرنية) | 6 | pending |
| 8 | Sclera | White of the eye (sclera) | الصلبة | بياض العين (الصلبة) | 2 | pending |
| 9 | Vitreous | Clear gel inside the eye (vitreous) | الجسم الزجاجي | الهلام الشفاف داخل العين (الجسم الزجاجي) | 3 | pending |
| 10 | Anterior capsule | Front of the capsule (anterior capsule) | المحفظة الأمامية | مقدمة المحفظة (المحفظة الأمامية) | 1 | pending |
| 11 | Posterior capsule | Back of the capsule (posterior capsule) | المحفظة الخلفية | مؤخرة المحفظة (المحفظة الخلفية) | 3 | pending |
| 12 | Zonules | Fine fibres holding the lens (zonules) | الألياف المعلِّقة للعدسة | ألياف دقيقة تثبّت العدسة (الألياف المعلِّقة) | 5 | pending |
| 13 | Anterior chamber | Space between cornea and iris (anterior chamber) | الحجرة الأمامية | المسافة بين القرنية والقزحية (الحجرة الأمامية) | 4 | pending |
| 14 | Haptic (support arm) | Support arm (haptic) | ذراع التثبيت | ذراع التثبيت | 3 | pending |
| 15 | Corneal flap | Thin corneal flap | الشريحة | شريحة رقيقة من القرنية | 3 | pending |
| 16 | Reshaped stromal bed | Reshaped layer under the flap (stromal bed) | سطح اللحمة بعد إعادة التشكيل | الطبقة المعاد تشكيلها تحت الشريحة (سطح اللحمة) | 4 | pending |
| 17 | Epithelium | Surface layer (epithelium) | الظهارة | الطبقة السطحية (الظهارة) | 3 | pending |
| 18 | Stroma | Thick middle layer (stroma) | اللحمة (السدى) | الطبقة الوسطى السميكة (اللحمة) | 6 | pending |
| 19 | Endothelium | Inner layer (endothelium) | البطانة | الطبقة الداخلية (البطانة) | 4 | pending |
| 20 | Implantable contact lens (ICL) | Implanted lens (ICL) | العدسة اللاصقة الداخلية (ICL) | العدسة المزروعة (ICL) | 3 | pending |
| 21 | Vault (gap above the natural lens) | Gap above the natural lens (vault) | المسافة بين العدسة المزروعة والعدسة الطبيعية | المسافة فوق العدسة الطبيعية | 3 | pending |
| 22 | ICL footplate | Foot of the implant (footplate) | طرف ارتكاز العدسة | طرف ارتكاز العدسة | 2 | pending |
| 23 | Ciliary sulcus | Groove behind the iris (ciliary sulcus) | الثلم الهدبي | الأخدود خلف القزحية (الثلم الهدبي) | 1 | pending |
| 24 | Riboflavin-soaked stroma | Riboflavin (vitamin B2) in the cornea | اللحمة المشبعة بالريبوفلافين | الريبوفلافين (فيتامين ب٢) في القرنية | 4 | pending |
| 25 | New cross-links | New bonds between fibres (cross-links) | روابط جديدة بين الألياف | روابط جديدة بين الألياف | 1 | pending |
| 26 | Graft–host junction | Edge where the graft meets the cornea (junction) | حدّ التقاء الطُّعم بالقرنية | حافة التقاء الطُّعم بالقرنية | 4 | pending |
| 27 | Entry through the pars plana | Where the needle enters (pars plana) | موضع دخول الإبرة عبر الجزء المسطّح | موضع دخول الإبرة (الجزء المسطّح) | 2 | pending |
| 28 | Medication (illustrative colour) | Medicine (illustrative colour) | الدواء (لون توضيحي) | الدواء (لون توضيحي) | 3 | pending |
| 29 | Macula | Centre of sharp vision (macula) | البقعة | مركز الرؤية الدقيقة (البقعة) | 3 | pending |
| 30 | Optic disc | Where the nerve leaves the eye (optic disc) | القرص البصري | نقطة خروج العصب من العين (القرص البصري) | 2 | pending |
| 31 | Retina | Light-sensitive layer (retina) | الشبكية | الطبقة الحساسة للضوء (الشبكية) | 4 | pending |
| 32 | Pars plana | Flat part of the ciliary body (pars plana) | الجزء المسطّح من الجسم الهدبي | الجزء المسطّح من الجسم الهدبي | 1 | pending |
| 33 | Ora serrata | Edge of the retina (ora serrata) | الحافة المسنّنة للشبكية | حافة الشبكية (الحافة المسنّنة) | 1 | pending |
| 34 | Limbus | Edge of the cornea (limbus) | الحوف (حافة القرنية) | حافة القرنية (الحوف) | 1 | pending |
| 35 | Fovea | Central pit of the macula (fovea) | النُّقرة | النقرة المركزية في البقعة (النُّقرة) | 1 | pending |

### C. Per image: what changed, known simplifications, questions, references

#### `cataract-surgery-l2-hero` — re-approval needed

- Caption (EN): Before and after: the cloudy lens is removed and a clear implant sits in the same capsule.
- Changed: Edge fade widened only, so the ciliary body is visible where it is labelled; camera, anatomy and colours unchanged.
- Known simplifications: r2: edge fade widened so the ciliary body shows; no anatomical change. · Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Split view: left half before surgery, right half the same eye after; the capsulorhexis opening is not drawn on the “after” side. · IOL haptics are generic C-loops; the vitreous floor behind the lens is translucent gel (it was a bright slab in the previous version).
- Questions for Dr. Maan: (1) Is the degree of brunescence (amber nucleus with milky cortex) a fair “typical” cataract for patients, or should a milder grade be shown? (2) Should the “after” half show the capsulorhexis edge resting on the optic?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, ROS, VASS, EYEWIKI, AAO-cataract, NEI

#### `cataract-surgery-l1-card`

- Caption (EN): A cataract is a clouding of the eye’s natural lens.
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · A quarter of the globe is removed to show the inside; the vitreous is drawn as a translucent gel.
- Questions for Dr. Maan: (1) Is a whole-eye cut-away the right first impression for the homepage, or would a front view of a cloudy pupil be more recognisable to patients?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, AAO-cataract, NEI

#### `cataract-surgery-l3-lens-capsule`

- Caption (EN): The natural lens sits in a thin capsule held by fine fibres behind the iris.
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Lens thickness 4.0 mm (a cataract-age lens is often thicker); nucleus and cortex boundaries are soft gradients, not graded opacity types. · Zonules are drawn as a sparse fan of fibres.
- Questions for Dr. Maan: (1) Do you want a specific cataract type shown (nuclear, cortical, posterior subcapsular) or keep this mixed “typical” look? (2) Is the zonule anatomy (anterior, equatorial and posterior insertions) detailed enough or too busy for patients?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, ROS, STR, EYEWIKI

#### `cataract-surgery-l3-iol-in-bag` — re-approval needed

- Caption (EN): After surgery the implant sits in the capsule that held the natural lens.
- Changed: Reframed closer on the implant and capsule (less empty gel); anatomy unchanged, cornea kept in frame.
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Generic one-piece acrylic IOL (6 mm optic, C-loop haptics); the emptied bag keeps its 9.4 mm model diameter (in vivo ~10–10.5 mm, see VASS). · The anterior chamber is not shown deepening after surgery.
- Questions for Dr. Maan: (1) Is the IOL position (optic against the posterior capsule, haptics in the bag equator) how you want it explained?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, VASS, EYEWIKI, AAO-cataract

#### `lens-implants-l2-hero` — re-approval needed

- Caption (EN): A lens implant replaces the natural lens inside its capsule.
- Changed: Replaced the tilted cut-away (it read as a diagonal slab) with the same frontal cut-away as the cataract hero, showing the implant in the capsule on both sides; ciliary body and zonules visible at the edges.
- Known simplifications: r2: half cut seen from the front, the same composition as the cataract hero. · Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Generic monofocal one-piece IOL; no brand or product geometry. · A quarter of the globe is removed; the vitreous is a translucent gel.
- Questions for Dr. Maan: (1) Should the hero show a premium (toric or multifocal) optic instead of a plain monofocal?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, VASS, EYEWIKI, AAO-IOL

#### `lens-implants-l1-card` — re-approval needed

- Caption (EN): Lens implants: a clear optic held in the capsule by two soft arms.
- Changed: Ciliary ring recoloured from heavy maroon to a pale tint and faded out at its outer edge, so the implant is the focal point; closer framing.
- Known simplifications: r2: the ciliary ring is drawn in a pale tint (not a tissue colour) and fades at its outer edge so the implant is the focal point. · Specimen view: cornea, iris and the outer coats are omitted to show the capsule; only the pleated ciliary ring (pars plicata) is kept. · Generic C-loop one-piece IOL; zonules drawn as a sparse fan.
- Questions for Dr. Maan: (1) Is a specimen view (iris and cornea removed) acceptable for patients, or is it too abstract?
- References: BCSC, EYEWIKI, VASS, AAO-IOL

#### `lens-implants-l3-iol-in-bag` — re-approval needed

- Caption (EN): The haptics hold the implant centred in the capsule’s outer rim.
- Changed: Ciliary ring recoloured from heavy maroon to a pale tint so the implant is the focal point; camera and anatomy unchanged.
- Known simplifications: r2: the ciliary ring is drawn in a pale tint (not a tissue colour) so the implant is the focal point. · Specimen view: cornea, iris and outer coats omitted; the ciliary ring is trimmed behind the pars plicata. · Bag diameter 9.4 mm (model) vs ~10–10.5 mm in vivo; haptic shape generic.
- Questions for Dr. Maan: (1) Is the haptic angulation and contact with the bag equator realistic for the IOLs you use?
- References: BCSC, EYEWIKI, VASS, STR

#### `lens-implants-l3-optic-types`

- Caption (EN): Implant types differ in the optic’s surface, not in where they sit.
- Known simplifications: Four brand-free one-piece optics resting on a surface; diffractive ring spacing (≈0.6√k mm) and EDOF echelettes are abstract and match no product. · Toric marks are three dots each side; real marks vary by manufacturer.
- Questions for Dr. Maan: (1) Which lens families should be shown (e.g. trifocal vs bifocal, diffractive vs non-diffractive EDOF)?
- References: AAO-IOL, BCSC, EYEWIKI

#### `laser-vision-correction-l2-hero`

- Caption (EN): In LASIK a thin flap is lifted and the laser reshapes the layer beneath it.
- Known simplifications: Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. · Shows LASIK (flap) only; PRK and SMILE are not illustrated. · Myopic ablation profile and depth are illustrative; the excimer beam colour is illustrative (193 nm light is invisible).
- Questions for Dr. Maan: (1) Do you also want PRK (surface) and SMILE (lenticule) versions of this diagram? (2) Is the flap thickness relative to the cornea acceptable given the ×3 exaggeration?
- References: DZ, NAV, BCSC, AAO-LASIK, AAO-PRK, FDA-LASIK

#### `laser-vision-correction-l1-card`

- Caption (EN): Laser vision correction reshapes the cornea.
- Known simplifications: Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. · Illustrative beam colour; LASIK shown as the representative technique.
- Questions for Dr. Maan: (1) Is the violet beam colour acceptable as an illustrative convention?
- References: DZ, BCSC, AAO-LASIK, FDA-LASIK

#### `laser-vision-correction-l3-corneal-layers`

- Caption (EN): The cornea has five layers; the laser works in the thick middle stroma.
- Known simplifications: Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. · Epithelium ≈50 µm, Bowman ≈12 µm, Descemet ≈10 µm, endothelium ≈5 µm are typical textbook values; keratocytes and lamellae are schematic.
- Questions for Dr. Maan: (1) Should the flap interface depth (≈110 µm drawn ×3) be shown, or a femtosecond flap of a different thickness?
- References: DZ, BCSC, AAO-anatomy, AAO-LASIK

#### `laser-vision-correction-l3-ablation-profile`

- Caption (EN): The laser removes a thin, lens-shaped layer to flatten the curve (illustrative).
- Known simplifications: Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. · A myopic, lens-shaped removal over a 6.6 mm zone (80 µm drawn ×3) is illustrative, not a treatment plan; the scan-spot pattern is schematic.
- Questions for Dr. Maan: (1) Should a hyperopic (ring-shaped) profile be shown alongside the myopic one?
- References: BCSC, AAO-LASIK, FDA-LASIK

#### `icl-l2-hero` — re-approval needed

- Caption (EN): An ICL sits behind the iris and arches over the natural lens, which stays in place.
- Changed: Reframed with anterior up so the section runs across the 16:9 frame (the subject filled only the centre on phones); anatomy unchanged.
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Generic, brand-free plate (central port omitted); vault ≈0.5 mm centrally is illustrative. · The vault is tinted aqua so it reads; aqueous is clear. The vitreous floor is now translucent (it was a pale slab).
- Questions for Dr. Maan: (1) Is a ~0.5 mm central vault the right “ideal” to depict? (2) Should the central port be drawn?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, STR, AAO-phakic

#### `icl-l1-card`

- Caption (EN): The ICL adds a lens inside the eye; the natural lens stays.
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Generic plate; vault tint illustrative.
- Questions for Dr. Maan: (1) Is this close-up recognisable enough at card size?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, AAO-phakic

#### `icl-l3-vault-section`

- Caption (EN): The gap over the natural lens (the vault) is checked after surgery.
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · True sagittal section along the plate’s long axis; plate thickness and outline generic. · The iris is lifted 0.72 mm over the plate (draped iris is simplified).
- Questions for Dr. Maan: (1) Is the footplate position in the ciliary sulcus drawn correctly? (2) Is it appropriate to name the vault for patients?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, STR, AAO-phakic

#### `keratoconus-cxl-l2-hero` — re-approval needed

- Caption (EN): Cross-linking uses riboflavin (vitamin B2) drops and UV light to strengthen a weakened cornea.
- Changed: Profile view with anterior up through a straight half cut (the cornea previously read at an angle); yellow is now only on the cut stroma, not over the whole chamber; only the front normal curve is dashed; UV kept as a soft field.
- Known simplifications: r2: straight half cut through the cone; riboflavin tint on the cut stroma only; only the front normal curve is dashed. · The cone is a smooth inferior-paracentral bulge (0.62 mm) thinning to ≈0.36 mm; real cones vary. · Epithelium-off protocol shown; riboflavin depth schematic; UV-A colour illustrative (365 nm is barely visible). The UV field was toned down after review.
- Questions for Dr. Maan: (1) Should the epithelium-on (trans-epithelial) protocol be shown too?
- References: DZ, NAV, BCSC, AAO-KC, AAO-CXL

#### `keratoconus-cxl-l1-card` — re-approval needed

- Caption (EN): Keratoconus: the cornea thins and bulges into a cone.
- Changed: Same calmer profile as the hero: yellow only on the cut stroma, one dashed normal curve, closer framing.
- Known simplifications: r2: straight half cut through the cone; riboflavin tint on the cut stroma only; only the front normal curve is dashed. · Smooth schematic cone; illustrative UV colour.
- Questions for Dr. Maan: (1) Is the cone’s steepness exaggerated too much for patients?
- References: AAO-KC, AAO-CXL, BCSC

#### `keratoconus-cxl-l3-cone-section` — re-approval needed

- Caption (EN): Where the cone forms, the cornea is thinner and steeper.
- Changed: Closer on the cone with the iris mostly out of frame; yellow only on the cut stroma; one dashed normal curve; straight half cut.
- Known simplifications: r2: straight half cut through the cone; riboflavin tint on the cut stroma only; only the front normal curve is dashed. · Gaussian cone deformation and thinning (≈0.36 mm minimum) are schematic; layers are not exaggerated here. · Riboflavin is shown strongest anteriorly, fading with depth (schematic).
- Questions for Dr. Maan: (1) Is the minimum thickness (≈360 µm) a sensible “moderate” example?
- References: DZ, BCSC, AAO-KC, AAO-CXL

#### `keratoconus-cxl-l3-collagen-crosslinks`

- Caption (EN): Cross-linking adds bonds between collagen fibres (schematic, not to scale).
- Known simplifications: Schematic, not to scale: real fibrils are ~30 nm thick and lamellae ~2 µm; stacking and bridge density are illustrative. · Cross-links are drawn as violet bridges concentrated in the anterior stroma; their chemistry is not depicted.
- Questions for Dr. Maan: (1) Is depicting cross-links as discrete bridges acceptable as a patient-level simplification?
- References: AAO-CXL, AAO-KC, BCSC

#### `corneal-transplant-l2-hero` — re-approval needed

- Caption (EN): Shown here: a full-thickness graft held by stitches, which are removed in stages. Lamellar grafts replace only some layers.
- Changed: Closer frontal framing so the graft, junction ring and stitches fill the frame (the eye was a small ball); soft edge fade added; anatomy unchanged.
- Known simplifications: r2: closer framing with a soft edge fade; the eye is cropped by the frame. · 8 mm full-thickness graft with 16 interrupted stitches (buried knots); suture thickness slightly exaggerated. · Donor tissue is drawn barely cooler than the host; the eye is quiet (no redness, no blood).
- Questions for Dr. Maan: (1) Interrupted, running or combined sutures — which pattern should patients see? (2) Is 8 mm a representative graft size?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, AAO-KP, NHS-KP

#### `corneal-transplant-l1-card` — re-approval needed

- Caption (EN): Corneal transplant replaces damaged cornea with donor tissue.
- Changed: Closer frontal framing so the graft and stitches read at card size; soft edge fade added; anatomy unchanged.
- Known simplifications: r2: closer framing with a soft edge fade; the eye is cropped by the frame. · Interrupted sutures only; slightly exaggerated thickness.
- Questions for Dr. Maan: (1) Is a sutured PK the right representative image, given DMEK/DALK are also offered?
- References: AAO-KP, NHS-KP

#### `corneal-transplant-l3-graft-section`

- Caption (EN): Full-thickness (PK) graft: every layer is replaced. Lamellar grafts replace only some layers.
- Known simplifications: Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width. · Penetrating keratoplasty only: a near-vertical wound through every layer; lamellar grafts (DALK, endothelial keratoplasty) are not drawn in this image. · Stitch track depth (~90 %) is illustrative.
- Questions for Dr. Maan: (1) Should separate DALK and DMEK section images be added (we can draw them if you confirm the layer boundaries to show)? (2) Is the wound profile (vertical trephination) right, or do you prefer a shaped (e.g. mushroom/top-hat) profile?
- References: DZ, BCSC, AAO-KP, NHS-KP

#### `corneal-transplant-l3-sutured-junction`

- Caption (EN): Stitches cross the graft edge and are removed gradually over months.
- Known simplifications: Suture calibre and knot size slightly exaggerated so they read; knots buried on the host side.
- Questions for Dr. Maan: (1) Is the knot burial / suture length realistic?
- References: AAO-KP, NHS-KP

#### `intravitreal-injections-l2-hero` — re-approval needed

- Caption (EN): The medicine is placed in the vitreous gel and reaches the retina and macula.
- Changed: Eye opened from front to back and seen from the front so the needle tip, the medicine and the macula are all in view (the medicine was hidden and the macula sat at the cut edge); the needle enters through the wall next to the opening.
- Known simplifications: r2: the sector is opened from front to back and the needle enters through the wall beside the opening (meridian 148 degrees, an illustrative choice). · Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · Entry drawn 3.75 mm behind the limbus (standard anatomy texts give ~3.5–4 mm); this distance is NOT in CLINICAL_SOURCES and is marked for review. · Needle shown without a gauge label; medication colour illustrative (most are clear); vessel pattern procedural.
- Questions for Dr. Maan: (1) Confirm the entry distance behind the limbus to depict (phakic vs pseudophakic). (2) Should the needle angle be shown (e.g. aimed at the mid-vitreous)?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, AAO-IVT, AAO-inj, NEI-AMD

#### `intravitreal-injections-l1-card` — re-approval needed

- Caption (EN): Eye injections deliver medicine inside the eye.
- Changed: Same view as the hero: the opening shows the needle tip, the medicine and the macula.
- Known simplifications: r2: the sector is opened from front to back and the needle enters through the wall beside the opening (illustrative). · Illustrative entry position and medication colour (see hero).
- Questions for Dr. Maan: (1) Is a visible needle acceptable on the homepage, or should a calmer image be used for anxious patients?
- References: AAO-IVT, AAO-inj, NEI-AMD

#### `intravitreal-injections-l3-pars-plana-entry`

- Caption (EN): The needle enters through the pars plana, a zone between the lens and the retina (illustrative).
- Known simplifications: Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis. · Tissue colours are a calm illustration palette, not true histology colours. · SIMPLIFIED / PENDING: entry 3.75 mm behind the limbus and the ora serrata ~6.6 mm behind it follow standard anatomy texts, not a source listed in CLINICAL_SOURCES. · The needle is drawn in the section plane; its gauge and length are not specified.
- Questions for Dr. Maan: (1) Confirm the entry distance to depict and whether to show it as a range. (2) Is the ora serrata position (~6.6 mm behind the limbus) acceptable?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, AAO-IVT, AAO-inj

#### `intravitreal-injections-l3-macula`

- Caption (EN): The macula gives sharp central vision; injections treat diseases that affect it.
- Known simplifications: Healthy schematic fundus (no AMD or diabetic changes); vessel branching is procedural. · Optic disc ~4.4 mm from the fovea; fovea on the optical axis (schematic eye). · Seen from inside the eye (no laterality implied).
- Questions for Dr. Maan: (1) Should a diseased version (wet AMD, diabetic macular oedema) be drawn for the conditions section?
- References: A&S, NAV, LB, BCSC, AAO-anatomy, NEI-AMD, AAO-IVT

### D. Reference list

- **A&S**: Atchison DA, Smith G. Optics of the Human Eye. Butterworth-Heinemann; 2000 (schematic eyes, ocular dimensions).
- **AAO-CXL**: AAO EyeSmart, Corneal cross-linking — https://www.aao.org/eye-health/treatments/corneal-cross-linking
- **AAO-IOL**: AAO EyeSmart, Intraocular lenses (IOL) — https://www.aao.org/eye-health/diseases/cataracts-iol-implants
- **AAO-IVT**: AAO EyeSmart, Intravitreal injections — https://www.aao.org/eye-health/treatments/intravitreal-injections
- **AAO-KC**: AAO EyeSmart, What is keratoconus? — https://www.aao.org/eye-health/diseases/what-is-keratoconus
- **AAO-KP**: AAO EyeSmart, About corneal transplantation — https://www.aao.org/eye-health/treatments/corneal-transplant
- **AAO-LASIK**: AAO EyeSmart, LASIK — https://www.aao.org/eye-health/treatments/lasik
- **AAO-PRK**: AAO EyeSmart, PRK — https://www.aao.org/eye-health/treatments/photorefractive-keratectomy-prk
- **AAO-anatomy**: AAO EyeSmart, Parts of the eye — https://www.aao.org/eye-health/anatomy/parts-of-eye
- **AAO-cataract**: AAO EyeSmart, What are cataracts? / Cataract surgery — https://www.aao.org/eye-health/diseases/what-is-cataract-surgery
- **AAO-inj**: AAO EyeSmart, Eye injections — https://www.aao.org/eye-health/treatments/eye-injections
- **AAO-phakic**: AAO EyeSmart, Phakic IOL — https://www.aao.org/eye-health/treatments/phakic-iol
- **BCSC**: American Academy of Ophthalmology, Basic and Clinical Science Course: Section 2 (Fundamentals), Section 3 (Clinical Optics), Section 11 (Lens and Cataract).
- **DUB-S**: Dubbelman M, van der Heijde GL. The shape of the aging human lens. Vision Res. 2001;41:1867–1877.
- **DZ**: Doughty MJ, Zaman ML. Human corneal thickness and its impact on intraocular pressure measures. Surv Ophthalmol. 2000;44:367–408.
- **EYEWIKI**: AAO EyeWiki articles on capsulorhexis, phacoemulsification, intraocular lenses and clear corneal incisions (titles approximate, no URLs).
- **FDA-LASIK**: FDA, LASIK — https://www.fda.gov/medical-devices/surgery-devices/lasik
- **LB**: Liou HL, Brennan NA. Anatomically accurate, finite model eye for optical modeling. J Opt Soc Am A. 1997;14:1684–1695.
- **NAV**: Navarro R, Santamaría J, Bescós J. Accommodation-dependent model of the human eye with aspherics. J Opt Soc Am A. 1985;2:1273–1281.
- **NEI**: National Eye Institute, Cataracts — https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts
- **NEI-AMD**: NEI, Age-related macular degeneration — https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration
- **NHS-KP**: NHS, Cornea transplant — https://www.nhs.uk/conditions/cornea-transplant/
- **ROS**: Rosen AM, et al. In vitro dimensions and curvatures of human lenses. Vision Res. 2006;46:1002–1009.
- **STR**: Strenk SA, et al. Age-related changes in human ciliary muscle and lens: an MRI study. IOVS. 1999;40:1162–1169.
- **VASS**: Vass C, Menapace R, et al. Prediction of pseudophakic capsular bag diameter based on biometric variables. JCRS. 1999;25:1376–1381.
