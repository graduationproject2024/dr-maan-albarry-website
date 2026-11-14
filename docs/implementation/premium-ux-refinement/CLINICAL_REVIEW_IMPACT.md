# Clinical review impact

Status: nothing in this file has been reviewed by a physician. Every asset listed stays `reviewStatus: "pending"` and `approval: "not approved"`. Items marked for re-approval must be looked at again even if an earlier version had been seen.

## Images

13 of 27 assets were materially changed. The other 14 keep version atlas-2026.11-r1 and their images are unchanged. Their labels and level metadata did change (see the sections below).

Each changed asset keeps its source references and known simplifications, and carries a new `version`, a `changeNote` and `reApprovalNeeded: true` in `public/images/procedures/manifest.json`. New simplifications for this revision are recorded per asset, beginning "r2:". Alt text is 160 characters or less, which the manifest build enforces.

| Asset | Version | Visual change | References kept | Re-approval needed |
|---|---|---|---|---|
| cataract-surgery-l2-hero | atlas-2026.11-r2 | Edge fade widened only, so the ciliary body is visible where it is labelled; camera, anatomy and colours unchanged. | A&S, NAV, LB, BCSC, AAO-anatomy, DUB-S, ROS, VASS, EYEWIKI, AAO-cataract, NEI | Yes |
| cataract-surgery-l3-iol-in-bag | atlas-2026.11-r2 | Reframed closer on the implant and capsule (less empty gel); anatomy unchanged, cornea kept in frame. | A&S, NAV, LB, BCSC, AAO-anatomy, VASS, BCSC, EYEWIKI, AAO-cataract | Yes |
| lens-implants-l2-hero | atlas-2026.11-r2 | Replaced the tilted cut-away (it read as a diagonal slab) with the same frontal cut-away as the cataract hero, showing the implant in the capsule on both sides; ciliary body and zonules visible at the edges. | A&S, NAV, LB, BCSC, AAO-anatomy, VASS, BCSC, EYEWIKI, AAO-IOL | Yes |
| lens-implants-l1-card | atlas-2026.11-r2 | Ciliary ring recoloured from heavy maroon to a pale tint and faded out at its outer edge, so the implant is the focal point; closer framing. | BCSC, EYEWIKI, VASS, AAO-IOL | Yes |
| lens-implants-l3-iol-in-bag | atlas-2026.11-r2 | Ciliary ring recoloured from heavy maroon to a pale tint so the implant is the focal point; camera and anatomy unchanged. | BCSC, EYEWIKI, VASS, STR | Yes |
| icl-l2-hero | atlas-2026.11-r2 | Reframed with anterior up so the section runs across the 16:9 frame (the subject filled only the centre on phones); anatomy unchanged. | A&S, NAV, LB, BCSC, AAO-anatomy, STR, AAO-phakic | Yes |
| keratoconus-cxl-l2-hero | atlas-2026.11-r2 | Profile view with anterior up through a straight half cut (the cornea previously read at an angle); yellow is now only on the cut stroma, not over the whole chamber; only the front normal curve is dashed; UV kept as a soft field. | DZ, NAV, BCSC, AAO-KC, AAO-CXL | Yes |
| keratoconus-cxl-l1-card | atlas-2026.11-r2 | Same calmer profile as the hero: yellow only on the cut stroma, one dashed normal curve, closer framing. | AAO-KC, AAO-CXL, BCSC | Yes |
| keratoconus-cxl-l3-cone-section | atlas-2026.11-r2 | Closer on the cone with the iris mostly out of frame; yellow only on the cut stroma; one dashed normal curve; straight half cut. | DZ, BCSC, AAO-KC, AAO-CXL | Yes |
| corneal-transplant-l2-hero | atlas-2026.11-r2 | Closer frontal framing so the graft, junction ring and stitches fill the frame (the eye was a small ball); soft edge fade added; anatomy unchanged. | A&S, NAV, LB, BCSC, AAO-anatomy, AAO-KP, NHS-KP | Yes |
| corneal-transplant-l1-card | atlas-2026.11-r2 | Closer frontal framing so the graft and stitches read at card size; soft edge fade added; anatomy unchanged. | AAO-KP, NHS-KP | Yes |
| intravitreal-injections-l2-hero | atlas-2026.11-r2 | Eye opened from front to back and seen from the front so the needle tip, the medicine and the macula are all in view (the medicine was hidden and the macula sat at the cut edge); the needle enters through the wall next to the opening. | A&S, NAV, LB, BCSC, AAO-anatomy, AAO-IVT, AAO-inj, NEI-AMD | Yes |
| intravitreal-injections-l1-card | atlas-2026.11-r2 | Same view as the hero: the opening shows the needle tip, the medicine and the macula. | AAO-IVT, AAO-inj, NEI-AMD | Yes |

## Questions this revision adds for Dr. Maan

1. Injection images: the needle now enters through the wall beside the opened part of the eye (a drawing choice). Is that acceptable, and is the view from the front right for patients?
2. Keratoconus images: is one dashed normal curve (front only) enough, with yellow only on the cut tissue?
3. ICL hero and keratoconus images are now drawn anterior up, while the section close-ups stay anterior left. Is the mix acceptable?
4. Implant images: the ciliary ring is now a pale illustration tint, not a tissue colour. Acceptable?

## Essential labels (proposed, per image; recorded as `labelAnchors[].essential`)

| Asset | Shown by default | Behind "Show all labels" |
|---|---|---|
| cataract-surgery-l2-hero | cataract-nucleus, iol-optic, capsular-bag, iris | lens-cortex, ciliary-body |
| cataract-surgery-l1-card | cataract-nucleus | cornea, iris, sclera, vitreous, ciliary-body |
| cataract-surgery-l3-lens-capsule | cataract-nucleus, anterior-capsule, zonules | lens-cortex, posterior-capsule, ciliary-body, iris, cornea, anterior-chamber |
| cataract-surgery-l3-iol-in-bag | iol-optic, capsular-bag, zonules | posterior-capsule, ciliary-body, iris, cornea |
| lens-implants-l2-hero | iol-optic, capsular-bag, iris, cornea | posterior-capsule, ciliary-body, zonules |
| lens-implants-l1-card | iol-optic | iol-haptic, capsular-bag, zonules |
| lens-implants-l3-iol-in-bag | iol-optic, iol-haptic, capsular-bag | zonules, ciliary-body |
| lens-implants-l3-optic-types | iol-monofocal, iol-toric, iol-multifocal, iol-edof | toric-marks, iol-haptic |
| laser-vision-correction-l2-hero | flap, ablation-zone, laser-beam, stroma | flap-hinge, stromal-bed, corneal-epithelium, endothelium |
| laser-vision-correction-l1-card | flap, laser-beam | stromal-bed, stroma |
| laser-vision-correction-l3-corneal-layers | corneal-epithelium, stroma, endothelium | bowman, descemet, stromal-bed, flap-edge |
| laser-vision-correction-l3-ablation-profile | original-profile, ablation-zone, stromal-bed | laser-beam, stroma |
| icl-l2-hero | icl, vault, natural-lens, iris | cornea, icl-footplate, anterior-chamber |
| icl-l1-card | icl, natural-lens | vault, iris |
| icl-l3-vault-section | icl, vault, natural-lens, icl-footplate | iris, ciliary-sulcus, ciliary-body, cornea, anterior-chamber |
| keratoconus-cxl-l2-hero | cone, normal-dome, riboflavin, uv-light | iris, anterior-chamber |
| keratoconus-cxl-l1-card | cone, normal-dome | riboflavin, uv-light |
| keratoconus-cxl-l3-cone-section | cone, normal-dome, riboflavin | stroma, endothelium |
| keratoconus-cxl-l3-collagen-crosslinks | collagen-fibrils, cross-links | lamellae, riboflavin |
| corneal-transplant-l2-hero | donor-graft, graft-junction, sutures | iris, pupil, sclera |
| corneal-transplant-l1-card | donor-graft, sutures | graft-junction |
| corneal-transplant-l3-graft-section | donor-graft, graft-junction, sutures | corneal-epithelium, stroma, endothelium |
| corneal-transplant-l3-sutured-junction | sutures, graft-junction, donor-graft | iris |
| intravitreal-injections-l2-hero | needle, medication, macula, retina | injection-site, optic-disc, vitreous, optic-nerve |
| intravitreal-injections-l1-card | needle, medication | macula, retina |
| intravitreal-injections-l3-pars-plana-entry | injection-site, retina, medication | pars-plana, ciliary-body, ora-serrata, natural-lens, vitreous, limbus |
| intravitreal-injections-l3-macula | fovea, macula, optic-disc | retinal-vessels, retina |

## New or changed medical terms

Terms shown to patients in the key. Each needs physician review in both languages. The medical term stays in the manifest as `en` and `ar`. Terms not listed keep their existing wording.

| Id | Medical term EN | Medical term AR | Patient term EN (new) | Patient term AR (new) |
|---|---|---|---|---|
| cornea | Cornea | القرنية | Clear front window (cornea) | النافذة الشفافة في المقدمة (القرنية) |
| corneal-epithelium | Epithelium | الظهارة | Surface layer (epithelium) | الطبقة السطحية (الظهارة) |
| stroma | Stroma | اللحمة (السدى) | Thick middle layer (stroma) | الطبقة الوسطى السميكة (اللحمة) |
| endothelium | Endothelium | البطانة | Inner layer (endothelium) | الطبقة الداخلية (البطانة) |
| sclera | Sclera | الصلبة | White of the eye (sclera) | بياض العين (الصلبة) |
| limbus | Limbus | الحوف (حافة القرنية) | Edge of the cornea (limbus) | حافة القرنية (الحوف) |
| iris | Iris | القزحية | Coloured part of the eye (iris) | الجزء الملوّن من العين (القزحية) |
| anterior-chamber | Anterior chamber | الحجرة الأمامية | Space between cornea and iris (anterior chamber) | المسافة بين القرنية والقزحية (الحجرة الأمامية) |
| ciliary-body | Ciliary body | الجسم الهدبي | Ring of tissue around the lens (ciliary body) | حلقة النسيج حول العدسة (الجسم الهدبي) |
| ciliary-sulcus | Ciliary sulcus | الثلم الهدبي | Groove behind the iris (ciliary sulcus) | الأخدود خلف القزحية (الثلم الهدبي) |
| zonules | Zonules | الألياف المعلِّقة للعدسة | Fine fibres holding the lens (zonules) | ألياف دقيقة تثبّت العدسة (الألياف المعلِّقة) |
| cataract-nucleus | Cloudy lens nucleus | نواة العدسة المعتمة | Cloudy lens (cataract) | العدسة المعتمة (الماء الأبيض) |
| lens-cortex | Lens cortex | قشرة العدسة | Outer part of the lens (cortex) | الجزء الخارجي من العدسة (القشرة) |
| anterior-capsule | Anterior capsule | المحفظة الأمامية | Front of the capsule (anterior capsule) | مقدمة المحفظة (المحفظة الأمامية) |
| posterior-capsule | Posterior capsule | المحفظة الخلفية | Back of the capsule (posterior capsule) | مؤخرة المحفظة (المحفظة الخلفية) |
| capsular-bag | Capsular bag | كيس المحفظة | Thin bag that holds the lens (capsule) | كيس رقيق يحمل العدسة (المحفظة) |
| iol-optic | Lens implant optic | الجزء البصري للعدسة المزروعة | Clear artificial lens (implant) | العدسة الصناعية الشفافة (المزروعة) |
| iol-haptic | Haptic (support arm) | ذراع التثبيت | Support arm (haptic) | ذراع التثبيت |
| icl | Implantable contact lens (ICL) | العدسة اللاصقة الداخلية (ICL) | Implanted lens (ICL) | العدسة المزروعة (ICL) |
| icl-footplate | ICL footplate | طرف ارتكاز العدسة | Foot of the implant (footplate) | طرف ارتكاز العدسة |
| vault | Vault (gap above the natural lens) | المسافة بين العدسة المزروعة والعدسة الطبيعية | Gap above the natural lens (vault) | المسافة فوق العدسة الطبيعية |
| vitreous | Vitreous | الجسم الزجاجي | Clear gel inside the eye (vitreous) | الهلام الشفاف داخل العين (الجسم الزجاجي) |
| retina | Retina | الشبكية | Light-sensitive layer (retina) | الطبقة الحساسة للضوء (الشبكية) |
| macula | Macula | البقعة | Centre of sharp vision (macula) | مركز الرؤية الدقيقة (البقعة) |
| fovea | Fovea | النُّقرة | Central pit of the macula (fovea) | النقرة المركزية في البقعة (النُّقرة) |
| optic-disc | Optic disc | القرص البصري | Where the nerve leaves the eye (optic disc) | نقطة خروج العصب من العين (القرص البصري) |
| pars-plana | Pars plana | الجزء المسطّح من الجسم الهدبي | Flat part of the ciliary body (pars plana) | الجزء المسطّح من الجسم الهدبي |
| ora-serrata | Ora serrata | الحافة المسنّنة للشبكية | Edge of the retina (ora serrata) | حافة الشبكية (الحافة المسنّنة) |
| flap | Corneal flap | الشريحة | Thin corneal flap | شريحة رقيقة من القرنية |
| stromal-bed | Reshaped stromal bed | سطح اللحمة بعد إعادة التشكيل | Reshaped layer under the flap (stromal bed) | الطبقة المعاد تشكيلها تحت الشريحة (سطح اللحمة) |
| riboflavin | Riboflavin-soaked stroma | اللحمة المشبعة بالريبوفلافين | Riboflavin (vitamin B2) in the cornea | الريبوفلافين (فيتامين ب٢) في القرنية |
| cross-links | New cross-links | روابط جديدة بين الألياف | New bonds between fibres (cross-links) | روابط جديدة بين الألياف |
| graft-junction | Graft–host junction | حدّ التقاء الطُّعم بالقرنية | Edge where the graft meets the cornea (junction) | حافة التقاء الطُّعم بالقرنية |
| injection-site | Entry through the pars plana | موضع دخول الإبرة عبر الجزء المسطّح | Where the needle enters (pars plana) | موضع دخول الإبرة (الجزء المسطّح) |
| medication | Medication (illustrative colour) | الدواء (لون توضيحي) | Medicine (illustrative colour) | الدواء (لون توضيحي) |

## Changed captions and alt text

| Asset | Field | English | Arabic |
|---|---|---|---|
| laser-vision-correction-l2-hero | caption | In LASIK a thin flap is lifted and the laser reshapes the layer beneath it. | في الليزك تُرفع شريحة رقيقة ويعيد الليزر تشكيل الطبقة تحتها. |
| icl-l2-hero | caption | An ICL sits behind the iris and arches over the natural lens, which stays in place. | تستقر العدسة اللاصقة الداخلية خلف القزحية وتتقوّس فوق العدسة الطبيعية التي تبقى في مكانها. |
| keratoconus-cxl-l2-hero | caption | Cross-linking uses riboflavin (vitamin B2) drops and UV light to strengthen a weakened cornea. | يستخدم التثبيت قطرات الريبوفلافين (فيتامين ب٢) والأشعة فوق البنفسجية لتقوية القرنية الضعيفة. |
| corneal-transplant-l2-hero | caption | Shown here: a full-thickness graft held by stitches, which are removed in stages. Lamellar grafts replace only some layers. | الزراعة المعروضة كاملة السماكة تثبّتها غرز تُزال على مراحل، أما الزراعات الجزئية فتستبدل بعض الطبقات فقط. |
| lens-implants-l2-hero | alt | Cut-away of the front of the eye: a clear lens implant sits in the capsule behind the iris, with fine fibres and the ciliary body at each side. | مقطع لمقدمة العين: عدسة مزروعة شفافة داخل المحفظة خلف القزحية، وعلى جانبيها ألياف دقيقة والجسم الهدبي. |
| intravitreal-injections-l2-hero | alt | Cut-away eye seen from the front: a fine needle enters the white of the eye and releases medicine into the clear gel, with the retina and macula behind. | عين مقطوعة تُرى من الأمام: إبرة دقيقة تدخل بياض العين وتُطلق الدواء في الهلام الشفاف، وخلفه الشبكية والبقعة. |
| intravitreal-injections-l1-card | alt | An opened eye seen from the front: a fine needle releases a small cloud of medicine into the clear gel in front of the retina. | عين مفتوحة تُرى من الأمام: إبرة دقيقة تُطلق سحابة صغيرة من الدواء في الهلام الشفاف أمام الشبكية. |

Interface text added (not clinical): "Show all labels (N)", "Show essential labels only", "More detail: close-up illustrations (N)", "Hide the close-up illustrations", "Enlarge illustration", "Close the enlarged illustration", in English and Arabic.

No medical claim was added. "Riboflavin (vitamin B2)" and "which stays in place" come from `src/procedures/content.js`; "lamellar grafts replace only some layers" comes from the existing L3 caption.

## Simulators

**Nothing in the optical model changed.** `src/vision-sim/optics/` and `VISION_MODEL_VERSION` (`vsim-optics-2026.11-r1`) are untouched, so the 51 review presets and their content hashes stay valid and no gate became stale because of this work. The review modes (`vision-sim-preview.html?review=1`, `cataract-sim-preview.html?review=1`) pass their specs unchanged. Every gate is still **Pending review**; nothing was approved.

What changed around the model, and what Dr. Maan should look at:

| Change | Why it matters for review |
|---|---|
| The controls were regrouped: three lens types, three distances and three lighting levels first; the other lens types, everyday situations, compare, exact distance, astigmatism, axis, sphere and model numbers under "More settings" | The default view now shows fewer options. The same options exist as before. |
| A white frame marks the object being looked at (phone, laptop or road sign) | It is a page element over the picture, not part of the rendered image, the model or the review screenshots. Choosing Near, Intermediate or Far does not change the rendered image itself, as before: the model draws all three distances at once. The owner and the physician should decide whether that is the right behaviour. |
| One paragraph per lens under the workbench | Composed from the existing "intended" and "trade-offs" texts, with no new claim. |
| New labels: More settings, Reset, Other lens types, Extended range (English, for EDOF), Dim (replacing Dusk for the same model condition), Far (replacing Distance in English) | Wording only; listed in `LENS_LAB_UX_RECONSTRUCTION.md`. |
| The "educational illustration, not a prediction of your vision" notice | Now attached to the top of the picture and stays with it when the picture sticks. |
| Cataract 3D viewer | No change to anatomy, motion or text. After Start, the page now scrolls so the playback controls are clear of the booking bar. |

The simulator still does not predict a patient's vision and says so beside the picture.
