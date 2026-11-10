// Editorial metadata for every atlas asset: alt text and captions (AR + EN), the structures shown, the references
// (only from docs/implementation/clinical-visual-reconstruction/CLINICAL_SOURCES.md), known simplifications and the
// questions for Dr. Maan. Nothing here has been reviewed by a physician; every asset is `reviewStatus: "pending"`.

export const VERSION = 'atlas-2026.11-r2';
export const VERSION_R1 = 'atlas-2026.11-r1'; // assets not re-rendered in r2 keep this


// Reference keys -> citations, copied from CLINICAL_SOURCES.md (keys as used there).
export const REFS = {
  'A&S': 'Atchison DA, Smith G. Optics of the Human Eye. Butterworth-Heinemann; 2000 (schematic eyes, ocular dimensions).',
  NAV: 'Navarro R, Santamaría J, Bescós J. Accommodation-dependent model of the human eye with aspherics. J Opt Soc Am A. 1985;2:1273–1281.',
  LB: 'Liou HL, Brennan NA. Anatomically accurate, finite model eye for optical modeling. J Opt Soc Am A. 1997;14:1684–1695.',
  DZ: 'Doughty MJ, Zaman ML. Human corneal thickness and its impact on intraocular pressure measures. Surv Ophthalmol. 2000;44:367–408.',
  'DUB-S': 'Dubbelman M, van der Heijde GL. The shape of the aging human lens. Vision Res. 2001;41:1867–1877.',
  ROS: 'Rosen AM, et al. In vitro dimensions and curvatures of human lenses. Vision Res. 2006;46:1002–1009.',
  STR: 'Strenk SA, et al. Age-related changes in human ciliary muscle and lens: an MRI study. IOVS. 1999;40:1162–1169.',
  VASS: 'Vass C, Menapace R, et al. Prediction of pseudophakic capsular bag diameter based on biometric variables. JCRS. 1999;25:1376–1381.',
  BCSC: 'American Academy of Ophthalmology, Basic and Clinical Science Course: Section 2 (Fundamentals), Section 3 (Clinical Optics), Section 11 (Lens and Cataract).',
  EYEWIKI: 'AAO EyeWiki articles on capsulorhexis, phacoemulsification, intraocular lenses and clear corneal incisions (titles approximate, no URLs).',
  'AAO-cataract': 'AAO EyeSmart, What are cataracts? / Cataract surgery — https://www.aao.org/eye-health/diseases/what-is-cataract-surgery',
  NEI: 'National Eye Institute, Cataracts — https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts',
  'AAO-anatomy': 'AAO EyeSmart, Parts of the eye — https://www.aao.org/eye-health/anatomy/parts-of-eye',
  'AAO-IOL': 'AAO EyeSmart, Intraocular lenses (IOL) — https://www.aao.org/eye-health/diseases/cataracts-iol-implants',
  'AAO-LASIK': 'AAO EyeSmart, LASIK — https://www.aao.org/eye-health/treatments/lasik',
  'AAO-PRK': 'AAO EyeSmart, PRK — https://www.aao.org/eye-health/treatments/photorefractive-keratectomy-prk',
  'FDA-LASIK': 'FDA, LASIK — https://www.fda.gov/medical-devices/surgery-devices/lasik',
  'AAO-phakic': 'AAO EyeSmart, Phakic IOL — https://www.aao.org/eye-health/treatments/phakic-iol',
  'AAO-KC': 'AAO EyeSmart, What is keratoconus? — https://www.aao.org/eye-health/diseases/what-is-keratoconus',
  'AAO-CXL': 'AAO EyeSmart, Corneal cross-linking — https://www.aao.org/eye-health/treatments/corneal-cross-linking',
  'AAO-KP': 'AAO EyeSmart, About corneal transplantation — https://www.aao.org/eye-health/treatments/corneal-transplant',
  'NHS-KP': 'NHS, Cornea transplant — https://www.nhs.uk/conditions/cornea-transplant/',
  'AAO-IVT': 'AAO EyeSmart, Intravitreal injections — https://www.aao.org/eye-health/treatments/intravitreal-injections',
  'AAO-inj': 'AAO EyeSmart, Eye injections — https://www.aao.org/eye-health/treatments/eye-injections',
  'NEI-AMD': 'NEI, Age-related macular degeneration — https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration'
};

const EYE_DIMS = ['A&S', 'NAV', 'LB', 'BCSC', 'AAO-anatomy'];
const GEN = [
  'Schematic adult eye: rotationally symmetric tissues (lathe solids), so the fovea sits on the optical axis.',
  'Tissue colours are a calm illustration palette, not true histology colours.'
];
const CORNEA_X3 = 'Corneal thickness and its layers are drawn three times thicker than life (lateral sizes to scale) so the layers read; Bowman’s layer and the endothelium are drawn at a minimum visible width.';

// r2 (patient-clarity pass): what changed in every re-rendered asset. Everything else stays r1 and is not re-approved.
export const CHANGED = {
  "cataract-surgery-l2-hero": [
    "Edge fade widened only, so the ciliary body is visible where it is labelled; camera, anatomy and colours unchanged."
  ],
  "cataract-surgery-l3-iol-in-bag": [
    "Reframed closer on the implant and capsule (less empty gel); anatomy unchanged, cornea kept in frame."
  ],
  "lens-implants-l2-hero": [
    "Replaced the tilted cut-away (it read as a diagonal slab) with the same frontal cut-away as the cataract hero, showing the implant in the capsule on both sides; ciliary body and zonules visible at the edges."
  ],
  "lens-implants-l1-card": [
    "Ciliary ring recoloured from heavy maroon to a pale tint and faded out at its outer edge, so the implant is the focal point; closer framing."
  ],
  "lens-implants-l3-iol-in-bag": [
    "Ciliary ring recoloured from heavy maroon to a pale tint so the implant is the focal point; camera and anatomy unchanged."
  ],
  "icl-l2-hero": [
    "Reframed with anterior up so the section runs across the 16:9 frame (the subject filled only the centre on phones); anatomy unchanged."
  ],
  "keratoconus-cxl-l2-hero": [
    "Profile view with anterior up through a straight half cut (the cornea previously read at an angle); yellow is now only on the cut stroma, not over the whole chamber; only the front normal curve is dashed; UV kept as a soft field."
  ],
  "keratoconus-cxl-l1-card": [
    "Same calmer profile as the hero: yellow only on the cut stroma, one dashed normal curve, closer framing."
  ],
  "keratoconus-cxl-l3-cone-section": [
    "Closer on the cone with the iris mostly out of frame; yellow only on the cut stroma; one dashed normal curve; straight half cut."
  ],
  "corneal-transplant-l2-hero": [
    "Closer frontal framing so the graft, junction ring and stitches fill the frame (the eye was a small ball); soft edge fade added; anatomy unchanged."
  ],
  "corneal-transplant-l1-card": [
    "Closer frontal framing so the graft and stitches read at card size; soft edge fade added; anatomy unchanged."
  ],
  "intravitreal-injections-l2-hero": [
    "Eye opened from front to back and seen from the front so the needle tip, the medicine and the macula are all in view (the medicine was hidden and the macula sat at the cut edge); the needle enters through the wall next to the opening."
  ],
  "intravitreal-injections-l1-card": [
    "Same view as the hero: the opening shows the needle tip, the medicine and the macula."
  ]
};

// Labels shown by default on the plate (at most 4 on L2, 1 or 2 on L1). A proposal: pending physician review.
export const ESSENTIAL = {
  "cataract-surgery-l2-hero": [
    "cataract-nucleus",
    "iol-optic",
    "capsular-bag",
    "iris"
  ],
  "cataract-surgery-l1-card": [
    "cataract-nucleus"
  ],
  "cataract-surgery-l3-lens-capsule": [
    "cataract-nucleus",
    "anterior-capsule",
    "zonules"
  ],
  "cataract-surgery-l3-iol-in-bag": [
    "iol-optic",
    "capsular-bag",
    "zonules"
  ],
  "lens-implants-l2-hero": [
    "iol-optic",
    "capsular-bag",
    "iris",
    "cornea"
  ],
  "lens-implants-l1-card": [
    "iol-optic"
  ],
  "lens-implants-l3-iol-in-bag": [
    "iol-optic",
    "iol-haptic",
    "capsular-bag"
  ],
  "lens-implants-l3-optic-types": [
    "iol-monofocal",
    "iol-toric",
    "iol-multifocal",
    "iol-edof"
  ],
  "laser-vision-correction-l2-hero": [
    "flap",
    "laser-beam",
    "ablation-zone",
    "stroma"
  ],
  "laser-vision-correction-l1-card": [
    "laser-beam",
    "flap"
  ],
  "laser-vision-correction-l3-corneal-layers": [
    "corneal-epithelium",
    "stroma",
    "endothelium"
  ],
  "laser-vision-correction-l3-ablation-profile": [
    "original-profile",
    "ablation-zone",
    "stromal-bed"
  ],
  "icl-l2-hero": [
    "icl",
    "vault",
    "natural-lens",
    "iris"
  ],
  "icl-l1-card": [
    "icl",
    "natural-lens"
  ],
  "icl-l3-vault-section": [
    "icl",
    "vault",
    "natural-lens",
    "icl-footplate"
  ],
  "keratoconus-cxl-l2-hero": [
    "cone",
    "normal-dome",
    "riboflavin",
    "uv-light"
  ],
  "keratoconus-cxl-l1-card": [
    "cone",
    "normal-dome"
  ],
  "keratoconus-cxl-l3-cone-section": [
    "cone",
    "normal-dome",
    "riboflavin"
  ],
  "keratoconus-cxl-l3-collagen-crosslinks": [
    "collagen-fibrils",
    "cross-links"
  ],
  "corneal-transplant-l2-hero": [
    "donor-graft",
    "graft-junction",
    "sutures"
  ],
  "corneal-transplant-l1-card": [
    "donor-graft",
    "sutures"
  ],
  "corneal-transplant-l3-graft-section": [
    "donor-graft",
    "graft-junction",
    "sutures"
  ],
  "corneal-transplant-l3-sutured-junction": [
    "sutures",
    "graft-junction",
    "donor-graft"
  ],
  "intravitreal-injections-l2-hero": [
    "needle",
    "medication",
    "retina",
    "macula"
  ],
  "intravitreal-injections-l1-card": [
    "needle",
    "medication"
  ],
  "intravitreal-injections-l3-pars-plana-entry": [
    "injection-site",
    "medication",
    "retina"
  ],
  "intravitreal-injections-l3-macula": [
    "macula",
    "fovea",
    "optic-disc"
  ]
};

// Per-asset metadata. `structures` = what the image shows (anchor ids are a subset).
export const META = {
  // ------------------------------------------------------------- cataract
  'cataract-surgery-l2-hero': {
    structures: ['cataract-nucleus', 'lens-cortex', 'lens-capsule', 'iol-optic', 'capsular-bag', 'iris', 'ciliary-body', 'zonules', 'cornea'],
    refs: [...EYE_DIMS, 'DUB-S', 'ROS', 'VASS', 'EYEWIKI', 'AAO-cataract', 'NEI'],
    simplifications: ['r2: edge fade widened so the ciliary body shows; no anatomical change.', ...GEN, 'Split view: left half before surgery, right half the same eye after; the capsulorhexis opening is not drawn on the “after” side.', 'IOL haptics are generic C-loops; the vitreous floor behind the lens is translucent gel (it was a bright slab in the previous version).'],
    alt: { en: 'Cut-away of the front of the eye: on the left a cloudy amber natural lens in its capsule; on the right a clear artificial lens in the same capsule.', ar: 'مقطع لمقدمة العين: على اليسار عدسة طبيعية معتمة بلون كهرماني داخل محفظتها، وعلى اليمين عدسة صناعية شفافة في المحفظة نفسها.' },
    caption: { en: 'Before and after: the cloudy lens is removed and a clear implant sits in the same capsule.', ar: 'قبل وبعد: تُزال العدسة المعتمة وتستقر عدسة مزروعة شفافة في المحفظة نفسها.' },
    questions: ['Is the degree of brunescence (amber nucleus with milky cortex) a fair “typical” cataract for patients, or should a milder grade be shown?', 'Should the “after” half show the capsulorhexis edge resting on the optic?']
  },
  'cataract-surgery-l1-card': {
    structures: ['cataract-nucleus', 'cornea', 'iris', 'retina', 'sclera', 'vitreous', 'optic-nerve'],
    refs: [...EYE_DIMS, 'DUB-S', 'AAO-cataract', 'NEI'],
    simplifications: [...GEN, 'A quarter of the globe is removed to show the inside; the vitreous is drawn as a translucent gel.'],
    alt: { en: 'Eye with a quarter cut away showing a cloudy amber natural lens behind the iris, the clear gel and the retina lining the back of the eye.', ar: 'عين نُزع ربعها تُظهر عدسة طبيعية معتمة بلون كهرماني خلف القزحية، والهلام الشفاف، والشبكية التي تبطّن مؤخرة العين.' },
    caption: { en: 'A cataract is a clouding of the eye’s natural lens.', ar: 'الماء الأبيض عتامة في عدسة العين الطبيعية.' },
    questions: ['Is a whole-eye cut-away the right first impression for the homepage, or would a front view of a cloudy pupil be more recognisable to patients?']
  },
  'cataract-surgery-l3-lens-capsule': {
    structures: ['cataract-nucleus', 'lens-cortex', 'anterior-capsule', 'posterior-capsule', 'zonules', 'ciliary-body', 'iris', 'cornea', 'anterior-chamber'],
    refs: [...EYE_DIMS, 'DUB-S', 'ROS', 'STR', 'EYEWIKI'],
    simplifications: [...GEN, 'Lens thickness 4.0 mm (a cataract-age lens is often thicker); nucleus and cortex boundaries are soft gradients, not graded opacity types.', 'Zonules are drawn as a sparse fan of fibres.'],
    alt: { en: 'Close-up cross-section of a cloudy natural lens: amber-brown nucleus, paler cortex, thin capsule, and the fibres holding it to the ciliary body.', ar: 'مقطع مقرّب لعدسة طبيعية معتمة: نواة بنية كهرمانية وقشرة أفتح ومحفظة رقيقة، والألياف التي تربطها بالجسم الهدبي.' },
    caption: { en: 'The natural lens sits in a thin capsule held by fine fibres behind the iris.', ar: 'تستقر العدسة الطبيعية داخل محفظة رقيقة تثبّتها ألياف دقيقة خلف القزحية.' },
    questions: ['Do you want a specific cataract type shown (nuclear, cortical, posterior subcapsular) or keep this mixed “typical” look?', 'Is the zonule anatomy (anterior, equatorial and posterior insertions) detailed enough or too busy for patients?']
  },
  'cataract-surgery-l3-iol-in-bag': {
    structures: ['iol-optic', 'capsular-bag', 'posterior-capsule', 'iol-haptic', 'zonules', 'ciliary-body', 'iris', 'cornea'],
    refs: [...EYE_DIMS, 'VASS', 'BCSC', 'EYEWIKI', 'AAO-cataract'],
    simplifications: [...GEN, 'Generic one-piece acrylic IOL (6 mm optic, C-loop haptics); the emptied bag keeps its 9.4 mm model diameter (in vivo ~10–10.5 mm, see VASS).', 'The anterior chamber is not shown deepening after surgery.'],
    alt: { en: 'Close-up cross-section after cataract surgery: a clear artificial lens sits inside the emptied capsule behind the iris, its support arm in the capsule edge.', ar: 'مقطع مقرّب بعد جراحة الماء الأبيض: عدسة صناعية شفافة داخل المحفظة الفارغة خلف القزحية، وذراع تثبيتها عند حافة المحفظة.' },
    caption: { en: 'After surgery the implant sits in the capsule that held the natural lens.', ar: 'بعد الجراحة تستقر العدسة المزروعة في المحفظة التي كانت تحتضن العدسة الطبيعية.' },
    questions: ['Is the IOL position (optic against the posterior capsule, haptics in the bag equator) how you want it explained?']
  },
  // ------------------------------------------------------------- lens implants
  'lens-implants-l2-hero': {
    structures: ['iol-optic', 'capsular-bag', 'zonules', 'ciliary-body', 'iris', 'cornea'],
    refs: [...EYE_DIMS, 'VASS', 'BCSC', 'EYEWIKI', 'AAO-IOL'],
    simplifications: ['r2: half cut seen from the front, the same composition as the cataract hero.', ...GEN, 'Generic monofocal one-piece IOL; no brand or product geometry.', 'A quarter of the globe is removed; the vitreous is a translucent gel.'],
    alt: { en: 'Cut-away of the front of the eye: a clear lens implant sits in the capsule behind the iris, with fine fibres and the ciliary body at each side.', ar: 'مقطع لمقدمة العين: عدسة مزروعة شفافة داخل المحفظة خلف القزحية، وعلى جانبيها ألياف دقيقة والجسم الهدبي.' },
    caption: { en: 'A lens implant replaces the natural lens inside its capsule.', ar: 'تحل العدسة المزروعة محل العدسة الطبيعية داخل محفظتها.' },
    questions: ['Should the hero show a premium (toric or multifocal) optic instead of a plain monofocal?']
  },
  'lens-implants-l1-card': {
    structures: ['iol-optic', 'iol-haptic', 'capsular-bag', 'zonules', 'ciliary-body'],
    refs: ['BCSC', 'EYEWIKI', 'VASS', 'AAO-IOL'],
    simplifications: ['r2: the ciliary ring is drawn in a pale tint (not a tissue colour) and fades at its outer edge so the implant is the focal point.', 'Specimen view: cornea, iris and the outer coats are omitted to show the capsule; only the pleated ciliary ring (pars plicata) is kept.', 'Generic C-loop one-piece IOL; zonules drawn as a sparse fan.'],
    alt: { en: 'Front view of a clear lens implant with two curved support arms resting inside the transparent lens capsule, ringed by fine fibres.', ar: 'منظر أمامي لعدسة مزروعة شفافة بذراعَي تثبيت منحنيتين داخل محفظة العدسة الشفافة، تحيط بها ألياف دقيقة.' },
    caption: { en: 'Lens implants: a clear optic held in the capsule by two soft arms.', ar: 'العدسات المزروعة: جزء بصري شفاف تثبّته ذراعان مرنتان داخل المحفظة.' },
    questions: ['Is a specimen view (iris and cornea removed) acceptable for patients, or is it too abstract?']
  },
  'lens-implants-l3-iol-in-bag': {
    structures: ['iol-optic', 'iol-haptic', 'capsular-bag', 'zonules', 'ciliary-body'],
    refs: ['BCSC', 'EYEWIKI', 'VASS', 'STR'],
    simplifications: ['r2: the ciliary ring is drawn in a pale tint (not a tissue colour) so the implant is the focal point.', 'Specimen view: cornea, iris and outer coats omitted; the ciliary ring is trimmed behind the pars plicata.', 'Bag diameter 9.4 mm (model) vs ~10–10.5 mm in vivo; haptic shape generic.'],
    alt: { en: 'Oblique view of a lens implant in the capsular bag: the optic centred, both haptics curving into the capsule edge, zonules running to the ciliary ring.', ar: 'منظر مائل لعدسة مزروعة في كيس المحفظة: الجزء البصري في المركز وذراعا التثبيت تنحنيان نحو حافة المحفظة والألياف تمتد إلى الجسم الهدبي.' },
    caption: { en: 'The haptics hold the implant centred in the capsule’s outer rim.', ar: 'تُبقي ذراعا التثبيت العدسة في مركز المحفظة عند حافتها الخارجية.' },
    questions: ['Is the haptic angulation and contact with the bag equator realistic for the IOLs you use?']
  },
  'lens-implants-l3-optic-types': {
    structures: ['iol-monofocal', 'iol-toric', 'toric-marks', 'iol-multifocal', 'iol-edof', 'iol-haptic'],
    refs: ['AAO-IOL', 'BCSC', 'EYEWIKI'],
    simplifications: ['Four brand-free one-piece optics resting on a surface; diffractive ring spacing (≈0.6√k mm) and EDOF echelettes are abstract and match no product.', 'Toric marks are three dots each side; real marks vary by manufacturer.'],
    alt: { en: 'Four clear lens implants: a plain monofocal, a toric with alignment dots, a multifocal with fine rings and an extended-depth lens with central rings.', ar: 'أربع عدسات مزروعة شفافة: أحادية البؤرة بسيطة، وتوريكية بنقاط محاذاة، ومتعددة البؤرة بحلقات دقيقة، وممتدة العمق البؤري بحلقات مركزية.' },
    caption: { en: 'Implant types differ in the optic’s surface, not in where they sit.', ar: 'تختلف أنواع العدسات المزروعة في سطح الجزء البصري لا في موضعها.' },
    questions: ['Which lens families should be shown (e.g. trifocal vs bifocal, diffractive vs non-diffractive EDOF)?']
  },
  // ------------------------------------------------------------- laser
  'laser-vision-correction-l2-hero': {
    structures: ['flap', 'flap-hinge', 'stromal-bed', 'ablation-zone', 'laser-beam', 'corneal-epithelium', 'bowman', 'stroma', 'descemet', 'endothelium'],
    refs: ['DZ', 'NAV', 'BCSC', 'AAO-LASIK', 'AAO-PRK', 'FDA-LASIK'],
    simplifications: [CORNEA_X3, 'Shows LASIK (flap) only; PRK and SMILE are not illustrated.', 'Myopic ablation profile and depth are illustrative; the excimer beam colour is illustrative (193 nm light is invisible).'],
    alt: { en: 'Diagram of a corneal slice: a thin flap folded back, a fine laser beam reshaping the layer beneath, a dashed line marking the original curve.', ar: 'رسم لشريحة من القرنية: سديلة رقيقة مطوية للخلف وشعاع ليزر دقيق يعيد تشكيل الطبقة تحتها، وخط متقطع يُظهر الانحناء الأصلي.' },
    caption: { en: 'In LASIK a thin flap is lifted and the laser reshapes the layer beneath it.', ar: 'في الليزك تُرفع شريحة رقيقة ويعيد الليزر تشكيل الطبقة تحتها.' },
    questions: ['Do you also want PRK (surface) and SMILE (lenticule) versions of this diagram?', 'Is the flap thickness relative to the cornea acceptable given the ×3 exaggeration?']
  },
  'laser-vision-correction-l1-card': {
    structures: ['flap', 'stromal-bed', 'laser-beam', 'stroma'],
    refs: ['DZ', 'BCSC', 'AAO-LASIK', 'FDA-LASIK'],
    simplifications: [CORNEA_X3, 'Illustrative beam colour; LASIK shown as the representative technique.'],
    alt: { en: 'A slice of the cornea with a thin flap lifted back and a fine violet laser beam touching the exposed layer beneath.', ar: 'شريحة من القرنية مع سديلة رقيقة مرفوعة للخلف وشعاع ليزر بنفسجي دقيق يلامس الطبقة المكشوفة تحتها.' },
    caption: { en: 'Laser vision correction reshapes the cornea.', ar: 'تصحيح النظر بالليزر يعيد تشكيل القرنية.' },
    questions: ['Is the violet beam colour acceptable as an illustrative convention?']
  },
  'laser-vision-correction-l3-corneal-layers': {
    structures: ['corneal-epithelium', 'bowman', 'stroma', 'descemet', 'endothelium', 'stromal-bed', 'flap'],
    refs: ['DZ', 'BCSC', 'AAO-anatomy', 'AAO-LASIK'],
    simplifications: [CORNEA_X3, 'Epithelium ≈50 µm, Bowman ≈12 µm, Descemet ≈10 µm, endothelium ≈5 µm are typical textbook values; keratocytes and lamellae are schematic.'],
    alt: { en: 'Close-up of the cornea’s layers at the flap edge: surface epithelium, Bowman’s layer, thick stroma, Descemet’s membrane and the endothelium.', ar: 'منظر مقرّب لطبقات القرنية عند حافة السديلة: الظهارة السطحية وطبقة بومان واللحمة السميكة وغشاء ديسيميه والبطانة.' },
    caption: { en: 'The cornea has five layers; the laser works in the thick middle stroma.', ar: 'للقرنية خمس طبقات، ويعمل الليزر في اللحمة الوسطى السميكة.' },
    questions: ['Should the flap interface depth (≈110 µm drawn ×3) be shown, or a femtosecond flap of a different thickness?']
  },
  'laser-vision-correction-l3-ablation-profile': {
    structures: ['original-profile', 'ablation-zone', 'stromal-bed', 'laser-beam', 'stroma'],
    refs: ['BCSC', 'AAO-LASIK', 'FDA-LASIK'],
    simplifications: [CORNEA_X3, 'A myopic, lens-shaped removal over a 6.6 mm zone (80 µm drawn ×3) is illustrative, not a treatment plan; the scan-spot pattern is schematic.'],
    alt: { en: 'Close-up of the reshaped corneal bed: a dashed line marks the original curve and a pale violet lens shape marks the tissue the laser removed.', ar: 'منظر مقرّب لسطح القرنية بعد إعادة التشكيل: خط متقطع للانحناء الأصلي وشكل بنفسجي فاتح للنسيج الذي أزاله الليزر.' },
    caption: { en: 'The laser removes a thin, lens-shaped layer to flatten the curve (illustrative).', ar: 'يزيل الليزر طبقة رقيقة على شكل عدسة لتسطيح الانحناء (توضيحي).' },
    questions: ['Should a hyperopic (ring-shaped) profile be shown alongside the myopic one?']
  },
  // ------------------------------------------------------------- ICL
  'icl-l2-hero': {
    structures: ['icl', 'vault', 'natural-lens', 'iris', 'cornea', 'icl-footplate', 'anterior-chamber', 'ciliary-body'],
    refs: [...EYE_DIMS, 'STR', 'AAO-phakic'],
    simplifications: [...GEN, 'Generic, brand-free plate (central port omitted); vault ≈0.5 mm centrally is illustrative.', 'The vault is tinted aqua so it reads; aqueous is clear. The vitreous floor is now translucent (it was a pale slab).'],
    alt: { en: 'Cut-away of the front of the eye: a thin implantable lens rests behind the iris and arches over the clear natural lens with a small fluid gap.', ar: 'مقطع لمقدمة العين: عدسة مزروعة رقيقة خلف القزحية تتقوّس فوق العدسة الطبيعية الشفافة مع فراغ صغير مملوء بالسائل.' },
    caption: { en: 'An ICL sits behind the iris and arches over the natural lens, which stays in place.', ar: 'تستقر العدسة اللاصقة الداخلية خلف القزحية وتتقوّس فوق العدسة الطبيعية التي تبقى في مكانها.' },
    questions: ['Is a ~0.5 mm central vault the right “ideal” to depict?', 'Should the central port be drawn?']
  },
  'icl-l1-card': {
    structures: ['icl', 'vault', 'natural-lens', 'iris'],
    refs: [...EYE_DIMS, 'AAO-phakic'],
    simplifications: [...GEN, 'Generic plate; vault tint illustrative.'],
    alt: { en: 'Close cut-away showing a thin lens implant behind the coloured iris, arching over the eye’s own clear lens.', ar: 'مقطع مقرّب يُظهر عدسة مزروعة رقيقة خلف القزحية الملوّنة تتقوّس فوق عدسة العين الطبيعية الشفافة.' },
    caption: { en: 'The ICL adds a lens inside the eye; the natural lens stays.', ar: 'تُضيف ICL عدسة داخل العين وتبقى العدسة الطبيعية.' },
    questions: ['Is this close-up recognisable enough at card size?']
  },
  'icl-l3-vault-section': {
    structures: ['icl', 'vault', 'natural-lens', 'iris', 'icl-footplate', 'ciliary-sulcus', 'ciliary-body', 'cornea', 'anterior-chamber'],
    refs: [...EYE_DIMS, 'STR', 'AAO-phakic'],
    simplifications: [...GEN, 'True sagittal section along the plate’s long axis; plate thickness and outline generic.', 'The iris is lifted 0.72 mm over the plate (draped iris is simplified).'],
    alt: { en: 'Cross-section showing an implantable lens arching between the iris and the natural lens, its foot resting in the groove behind the iris root.', ar: 'مقطع يُظهر عدسة مزروعة تتقوّس بين القزحية والعدسة الطبيعية، وطرفها مستقر في الثلم خلف جذر القزحية.' },
    caption: { en: 'The gap over the natural lens (the vault) is checked after surgery.', ar: 'تُفحص المسافة فوق العدسة الطبيعية بعد الجراحة.' },
    questions: ['Is the footplate position in the ciliary sulcus drawn correctly?', 'Is it appropriate to name the vault for patients?']
  },
  // ------------------------------------------------------------- keratoconus / CXL
  'keratoconus-cxl-l2-hero': {
    structures: ['cone', 'normal-dome', 'riboflavin', 'uv-light', 'stroma', 'iris', 'anterior-chamber'],
    refs: ['DZ', 'NAV', 'BCSC', 'AAO-KC', 'AAO-CXL'],
    simplifications: ['r2: straight half cut through the cone; riboflavin tint on the cut stroma only; only the front normal curve is dashed.', 'The cone is a smooth inferior-paracentral bulge (0.62 mm) thinning to ≈0.36 mm; real cones vary.', 'Epithelium-off protocol shown; riboflavin depth schematic; UV-A colour illustrative (365 nm is barely visible). The UV field was toned down after review.'],
    alt: { en: 'Side view of a thinned, cone-shaped cornea next to a dashed normal curve, soaked in yellow riboflavin under a soft band of ultraviolet light.', ar: 'منظر جانبي لقرنية رقيقة مخروطية بجانب خط متقطع للانحناء الطبيعي، مشبعة بالريبوفلافين الأصفر تحت حزمة ناعمة من الأشعة فوق البنفسجية.' },
    caption: { en: 'Cross-linking uses riboflavin (vitamin B2) drops and UV light to strengthen a weakened cornea.', ar: 'يستخدم التثبيت قطرات الريبوفلافين (فيتامين ب٢) والأشعة فوق البنفسجية لتقوية القرنية الضعيفة.' },
    questions: ['Should the epithelium-on (trans-epithelial) protocol be shown too?']
  },
  'keratoconus-cxl-l1-card': {
    structures: ['cone', 'normal-dome', 'riboflavin', 'uv-light'],
    refs: ['AAO-KC', 'AAO-CXL', 'BCSC'],
    simplifications: ['r2: straight half cut through the cone; riboflavin tint on the cut stroma only; only the front normal curve is dashed.', 'Smooth schematic cone; illustrative UV colour.'],
    alt: { en: 'A cone-shaped, thinned cornea compared with its normal dome, tinted yellow by riboflavin under soft ultraviolet light.', ar: 'قرنية رقيقة مخروطية مقارنةً بقبتها الطبيعية، مصبوغة بالأصفر بالريبوفلافين تحت أشعة فوق بنفسجية ناعمة.' },
    caption: { en: 'Keratoconus: the cornea thins and bulges into a cone.', ar: 'القرنية المخروطية: تترقق القرنية وتبرز على شكل مخروط.' },
    questions: ['Is the cone’s steepness exaggerated too much for patients?']
  },
  'keratoconus-cxl-l3-cone-section': {
    structures: ['cone', 'normal-dome', 'riboflavin', 'stroma', 'endothelium'],
    refs: ['DZ', 'BCSC', 'AAO-KC', 'AAO-CXL'],
    simplifications: ['r2: straight half cut through the cone; riboflavin tint on the cut stroma only; only the front normal curve is dashed.', 'Gaussian cone deformation and thinning (≈0.36 mm minimum) are schematic; layers are not exaggerated here.', 'Riboflavin is shown strongest anteriorly, fading with depth (schematic).'],
    alt: { en: 'Cross-section of a keratoconic cornea: the thinned cone bulges ahead of a dashed normal curve, its front layers stained yellow by riboflavin.', ar: 'مقطع لقرنية مخروطية: يبرز المخروط المترقق أمام خط متقطع للانحناء الطبيعي، وطبقاته الأمامية مصبوغة بالريبوفلافين الأصفر.' },
    caption: { en: 'Where the cone forms, the cornea is thinner and steeper.', ar: 'حيث يتكوّن المخروط تكون القرنية أرق وأشد انحناءً.' },
    questions: ['Is the minimum thickness (≈360 µm) a sensible “moderate” example?']
  },
  'keratoconus-cxl-l3-collagen-crosslinks': {
    structures: ['collagen-fibrils', 'lamellae', 'cross-links', 'riboflavin'],
    refs: ['AAO-CXL', 'AAO-KC', 'BCSC'],
    simplifications: ['Schematic, not to scale: real fibrils are ~30 nm thick and lamellae ~2 µm; stacking and bridge density are illustrative.', 'Cross-links are drawn as violet bridges concentrated in the anterior stroma; their chemistry is not depicted.'],
    alt: { en: 'Magnified block of corneal stroma: layers of collagen fibres crossing at angles, joined by small violet bridges representing new cross-links.', ar: 'كتلة مكبّرة من لحمة القرنية: طبقات من ألياف الكولاجين المتقاطعة، تربطها جسور بنفسجية صغيرة تمثّل الروابط الجديدة.' },
    caption: { en: 'Cross-linking adds bonds between collagen fibres (schematic, not to scale).', ar: 'يضيف التثبيت روابط بين ألياف الكولاجين (رسم تخطيطي غير مطابق للمقياس).' },
    questions: ['Is depicting cross-links as discrete bridges acceptable as a patient-level simplification?']
  },
  // ------------------------------------------------------------- corneal transplant
  'corneal-transplant-l2-hero': {
    structures: ['donor-graft', 'graft-junction', 'sutures', 'iris', 'pupil', 'sclera'],
    refs: [...EYE_DIMS, 'AAO-KP', 'NHS-KP'],
    simplifications: ['r2: closer framing with a soft edge fade; the eye is cropped by the frame.', '8 mm full-thickness graft with 16 interrupted stitches (buried knots); suture thickness slightly exaggerated.', 'Donor tissue is drawn barely cooler than the host; the eye is quiet (no redness, no blood).'],
    alt: { en: 'Front view of an eye after a corneal transplant: a clear round donor cornea held by sixteen fine, evenly spaced stitches.', ar: 'منظر أمامي لعين بعد زراعة القرنية: قرنية دائرية شفافة من متبرع مثبتة بست عشرة غرزة دقيقة متساوية التباعد.' },
    caption: { en: 'Shown here: a full-thickness graft held by stitches, which are removed in stages. Lamellar grafts replace only some layers.', ar: 'الزراعة المعروضة كاملة السماكة تثبّتها غرز تُزال على مراحل، أما الزراعات الجزئية فتستبدل بعض الطبقات فقط.' },
    questions: ['Interrupted, running or combined sutures — which pattern should patients see?', 'Is 8 mm a representative graft size?']
  },
  'corneal-transplant-l1-card': {
    structures: ['donor-graft', 'sutures', 'graft-junction'],
    refs: ['AAO-KP', 'NHS-KP'],
    simplifications: ['r2: closer framing with a soft edge fade; the eye is cropped by the frame.', 'Interrupted sutures only; slightly exaggerated thickness.'],
    alt: { en: 'An eye with a clear circular corneal graft held by fine stitches around its edge.', ar: 'عين بطُعم قرنية دائري شفاف تثبّته غرز دقيقة حول حافته.' },
    caption: { en: 'Corneal transplant replaces damaged cornea with donor tissue.', ar: 'تستبدل زراعة القرنية النسيج المتضرر بنسيج من متبرع.' },
    questions: ['Is a sutured PK the right representative image, given DMEK/DALK are also offered?']
  },
  'corneal-transplant-l3-graft-section': {
    structures: ['donor-graft', 'graft-junction', 'sutures', 'corneal-epithelium', 'stroma', 'endothelium'],
    refs: ['DZ', 'BCSC', 'AAO-KP', 'NHS-KP'],
    simplifications: [CORNEA_X3, 'Penetrating keratoplasty only: a near-vertical wound through every layer; lamellar grafts (DALK, endothelial keratoplasty) are not drawn in this image.', 'Stitch track depth (~90 %) is illustrative.'],
    alt: { en: 'Cross-section of the cornea after a full-thickness transplant: the donor button meets the patient’s cornea at a vertical edge crossed by deep stitches.', ar: 'مقطع للقرنية بعد زراعة كاملة السماكة: يلتقي نسيج المتبرع بقرنية المريض عند حافة عمودية تعبرها غرز عميقة.' },
    caption: { en: 'Full-thickness (PK) graft: every layer is replaced. Lamellar grafts replace only some layers.', ar: 'الزراعة كاملة السماكة تستبدل كل الطبقات، أما الزراعات الجزئية فتستبدل بعضها فقط.' },
    questions: ['Should separate DALK and DMEK section images be added (we can draw them if you confirm the layer boundaries to show)?', 'Is the wound profile (vertical trephination) right, or do you prefer a shaped (e.g. mushroom/top-hat) profile?']
  },
  'corneal-transplant-l3-sutured-junction': {
    structures: ['sutures', 'graft-junction', 'donor-graft', 'iris'],
    refs: ['AAO-KP', 'NHS-KP'],
    simplifications: ['Suture calibre and knot size slightly exaggerated so they read; knots buried on the host side.'],
    alt: { en: 'Close-up of the graft edge: fine dark stitches cross the faint ring where the donor cornea meets the patient’s own cornea.', ar: 'منظر مقرّب لحافة الطُّعم: غرز داكنة دقيقة تعبر الحلقة الخفيفة حيث تلتقي قرنية المتبرع بقرنية المريض.' },
    caption: { en: 'Stitches cross the graft edge and are removed gradually over months.', ar: 'تعبر الغرز حافة الطُّعم وتُزال تدريجياً على مدى أشهر.' },
    questions: ['Is the knot burial / suture length realistic?']
  },
  // ------------------------------------------------------------- intravitreal injections
  'intravitreal-injections-l2-hero': {
    structures: ['needle', 'injection-site', 'medication', 'vitreous', 'retina', 'macula', 'optic-disc', 'optic-nerve', 'sclera'],
    refs: [...EYE_DIMS, 'AAO-IVT', 'AAO-inj', 'NEI-AMD'],
    simplifications: ['r2: the sector is opened from front to back and the needle enters through the wall beside the opening (meridian 148 degrees, an illustrative choice).', ...GEN, 'Entry drawn 3.75 mm behind the limbus (standard anatomy texts give ~3.5–4 mm); this distance is NOT in CLINICAL_SOURCES and is marked for review.', 'Needle shown without a gauge label; medication colour illustrative (most are clear); vessel pattern procedural.'],
    alt: { en: 'Cut-away eye seen from the front: a fine needle enters the white of the eye and releases medicine into the clear gel, with the retina and macula behind.', ar: 'عين مقطوعة تُرى من الأمام: إبرة دقيقة تدخل بياض العين وتُطلق الدواء في الهلام الشفاف، وخلفه الشبكية والبقعة.' },
    caption: { en: 'The medicine is placed in the vitreous gel and reaches the retina and macula.', ar: 'يُوضع الدواء في الجسم الزجاجي ويصل إلى الشبكية والبقعة.' },
    questions: ['Confirm the entry distance behind the limbus to depict (phakic vs pseudophakic).', 'Should the needle angle be shown (e.g. aimed at the mid-vitreous)?']
  },
  'intravitreal-injections-l1-card': {
    structures: ['needle', 'medication', 'vitreous', 'retina', 'macula'],
    refs: ['AAO-IVT', 'AAO-inj', 'NEI-AMD'],
    simplifications: ['r2: the sector is opened from front to back and the needle enters through the wall beside the opening (illustrative).', 'Illustrative entry position and medication colour (see hero).'],
    alt: { en: 'An opened eye seen from the front: a fine needle releases a small cloud of medicine into the clear gel in front of the retina.', ar: 'عين مفتوحة تُرى من الأمام: إبرة دقيقة تُطلق سحابة صغيرة من الدواء في الهلام الشفاف أمام الشبكية.' },
    caption: { en: 'Eye injections deliver medicine inside the eye.', ar: 'حقن العين توصل الدواء إلى داخل العين.' },
    questions: ['Is a visible needle acceptable on the homepage, or should a calmer image be used for anxious patients?']
  },
  'intravitreal-injections-l3-pars-plana-entry': {
    structures: ['injection-site', 'pars-plana', 'ciliary-body', 'ora-serrata', 'retina', 'natural-lens', 'vitreous', 'medication', 'limbus', 'needle'],
    refs: [...EYE_DIMS, 'AAO-IVT', 'AAO-inj'],
    simplifications: [...GEN, 'SIMPLIFIED / PENDING: entry 3.75 mm behind the limbus and the ora serrata ~6.6 mm behind it follow standard anatomy texts, not a source listed in CLINICAL_SOURCES.', 'The needle is drawn in the section plane; its gauge and length are not specified.'],
    alt: { en: 'Cross-section of the front of the eye: a fine needle passes through the flat part of the ciliary body, behind the lens and in front of the retina’s edge.', ar: 'مقطع لمقدمة العين: إبرة دقيقة تمر عبر الجزء المسطّح من الجسم الهدبي، خلف العدسة وأمام حافة الشبكية.' },
    caption: { en: 'The needle enters through the pars plana, a zone between the lens and the retina (illustrative).', ar: 'تدخل الإبرة عبر الجزء المسطّح، وهو منطقة بين العدسة والشبكية (توضيحي).' },
    questions: ['Confirm the entry distance to depict and whether to show it as a range.', 'Is the ora serrata position (~6.6 mm behind the limbus) acceptable?']
  },
  'intravitreal-injections-l3-macula': {
    structures: ['fovea', 'macula', 'optic-disc', 'retinal-vessels', 'retina'],
    refs: [...EYE_DIMS, 'NEI-AMD', 'AAO-IVT'],
    simplifications: ['Healthy schematic fundus (no AMD or diabetic changes); vessel branching is procedural.', 'Optic disc ~4.4 mm from the fovea; fovea on the optical axis (schematic eye).', 'Seen from inside the eye (no laterality implied).'],
    alt: { en: 'View of the back of the eye from inside: the darker macula with its central pit, the pale optic disc and branching blood vessels.', ar: 'منظر لمؤخرة العين من الداخل: البقعة الأغمق ونقرتها المركزية، والقرص البصري الفاتح، والأوعية الدموية المتفرعة.' },
    caption: { en: 'The macula gives sharp central vision; injections treat diseases that affect it.', ar: 'البقعة مسؤولة عن الرؤية المركزية الدقيقة، والحقن تعالج أمراضاً تصيبها.' },
    questions: ['Should a diseased version (wet AMD, diabetic macular oedema) be drawn for the conditions section?']
  }
};
