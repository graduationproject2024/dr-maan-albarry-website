// Corneal transplant (keratoplasty) — /procedures/corneal-transplant/.
// What it teaches (from the corneal-transplant page only): the cornea has three main layers (epithelium, stroma,
// endothelium); which layer is damaged decides the type of transplant — PK replaces the full thickness of the central
// cornea, DALK replaces the front layers and keeps the patient's own endothelium, DSAEK / DMEK replace only the inner
// layer. Steps: an examination identifies the damaged layer → local or general anaesthetic → the damaged tissue is
// removed and donor tissue is secured with stitches, or with an air bubble in endothelial transplants → close follow-up.
// The graft radius and the stitches are illustrative; no trephine size, suture count or operative detail is stated.
import { EYE, corneaDefaults, corneaRadii, corneaPoint, centralThickness } from '../anatomy/geometry.js';
import { CAMERAS, NOTE, COMMON_SIMPLIFICATIONS, standardEye, stage, span, mix } from './common.js';

const GR = 3.75;          // illustrative graft radius on the anterior reference sphere (mm) — never stated in text
const SWELL = 0.24;       // illustrative extra stromal thickness of a swollen cornea (mm)
const EK_T = 0.075;       // thin donor inner layer, drawn thicker than real so it can be seen (mm)
const STITCHES = 16;      // drawn only; the text never gives a number
const A_OF = (r) => Math.asin(Math.min(0.9999, r / EYE.corneaRc));

const T = {
  exam: { ar: 'الفحص: أي طبقة متضررة؟', en: 'Examination: which layer is damaged?' },
  anaesthetic: { ar: 'التخدير', en: 'Anaesthetic' },
  anaestheticText: { ar: 'تخدير موضعي أو عام بحسب الحالة.', en: 'Local or general anaesthetic, depending on the case.' },
  examText: { ar: 'يحدد الفحص الطبقة المتضررة ونوع الزراعة المناسب.', en: 'An examination identifies the damaged layer and the right type of transplant.' },
  stitches: { ar: 'التثبيت بالغرز', en: 'Secured with stitches' },
  stitchesText: { ar: 'يُثبَّت نسيج المتبرع بغرز. عدد الغرز وترتيبها في النموذج توضيحيان.', en: 'The donor tissue is secured with stitches. The number and pattern of stitches in the model are illustrative.' },
  follow: { ar: 'متابعة مكثفة', en: 'Close follow-up' }
};
const WARNING = {
  ar: 'تُستعمل قطرات لمنع الرفض لفترة طويلة يحددها الطبيب. تعرّف على علامات الرفض: احمرار، حساسية للضوء، تراجع الرؤية، ألم — وتواصل فوراً إن ظهرت.',
  en: 'Anti-rejection drops are used for a long period set by your surgeon. Know the warning signs — redness, light sensitivity, reduced vision, pain — and contact the clinic at once if they appear.'
};

const def = {
  id: 'corneal-transplant', slug: 'corneal-transplant', modelId: 'ssim-kpl', version: '2026.11-r1',
  title: { ar: 'زراعة القرنية: أي طبقة تُستبدل', en: 'Corneal transplant: which layer is replaced' },
  note: NOTE,
  minR: 6,
  objectives: [
    { ar: 'التعرف على طبقات القرنية: الظهارة واللحمة والبطانة.', en: 'Recognise the layers of the cornea: epithelium, stroma and endothelium.' },
    { ar: 'فهم أن الطبقة المتضررة تحدد نوع الزراعة: كاملة، أو أمامية عميقة، أو زراعة البطانة.', en: 'Understand that the damaged layer decides the type of transplant: full-thickness, deep anterior, or endothelial.' },
    { ar: 'معرفة أن نسيج المتبرع يُثبَّت بغرز، أو بفقاعة هواء في زراعة البطانة، وأن المتابعة المكثفة ضرورية.', en: 'Know that donor tissue is secured with stitches, or with an air bubble in endothelial transplants, and that close follow-up is needed.' }
  ],
  variants: [
    { id: 'pk', label: { ar: 'الزراعة الكاملة', en: 'PK' } },
    { id: 'dalk', label: { ar: 'الزراعة الأمامية العميقة', en: 'DALK' } },
    { id: 'ek', label: { ar: 'زراعة البطانة', en: 'DSAEK / DMEK' } }
  ],
  cameras: {
    section: { pos: [10.5, -2.7, 2.9], target: [0, -2.7, 2.2], label: { ar: 'مقطع القرنية عن قرب', en: 'Cornea section close-up' } },
    front: { pos: [0.01, 0.5, 21], target: [0, 0, 1.6], label: { ar: 'من الأمام', en: 'Front view' } },
    oblique: { pos: [7, 7.5, 16], target: [0, 0, 2] },
    full: CAMERAS.full
  },
  toggles: [
    { id: 'eye', label: { ar: 'أجزاء العين الأخرى', en: 'Rest of the eye' }, parts: ['sclera', 'iris'] }
  ],
  stages: (variant) => {
    if (variant === 'dalk') return [
      stage('exam', 7, 'front', T.exam, { ar: T.examText.ar + ' هنا الطبقات الأمامية معتمة بينما بطانة المريض سليمة، فتُختار الزراعة الأمامية العميقة (DALK)، كما في بعض حالات القرنية المخروطية المتقدمة أو التندب.', en: T.examText.en + ' Here the front layers are cloudy while the patient’s own endothelium is healthy, so a deep anterior transplant (DALK) is chosen — as in some advanced keratoconus or scarring.' }, { section: false }),
      stage('anaesthetic', 5, 'section', T.anaesthetic, { ar: T.anaestheticText.ar + ' يُظهر المقطع البطانة السليمة (مميّزة باللون) التي ستبقى في مكانها.', en: T.anaestheticText.en + ' The cross-section shows the healthy endothelium (highlighted), which will stay in place.' }, { section: true }),
      stage('remove', 8, 'section', { ar: 'إزالة الطبقات الأمامية', en: 'The front layers are removed' }, { ar: 'تُزال الطبقات الأمامية المتضررة حتى الطبقة الخلفية العميقة، وتبقى بطانة المريض في مكانها.', en: 'The damaged front layers are removed down to the deep back layer; the patient’s own endothelium stays in place.' }, { section: true }),
      stage('donor', 8, 'section', { ar: 'وضع الطبقات الأمامية من المتبرع', en: 'Donor front layers placed' }, { ar: 'توضع الطبقات الأمامية من قرنية المتبرع فوق الطبقة الخلفية المحفوظة. يأتي النسيج من بنوك العيون التي تفحصه وفق معايير طبية صارمة.', en: 'Donor front layers are placed on the kept back layer. The tissue comes from eye banks, which screen it to strict medical standards.' }, { section: true }),
      stage('stitches', 7, 'front', T.stitches, T.stitchesText, { section: false }),
      stage('followup', 6, 'front', T.follow, { ar: 'متابعة مكثفة في الأسابيع الأولى. الزراعات الجزئية تحافظ على أجزاء سليمة من قرنية المريض، والتعافي البصري قد يستمر شهوراً.', en: 'Close follow-up in the first weeks. Partial transplants keep healthy parts of your own cornea; visual recovery can take months.' }, { section: false })
    ];
    if (variant === 'ek') return [
      stage('exam', 7, 'front', T.exam, { ar: T.examText.ar + ' هنا تعطلت البطانة، وهي الطبقة الداخلية التي تحافظ على شفافية القرنية بضخ السوائل، فتورمت القرنية وفقدت صفاءها، كما في ضمور فوكس. تكفي زراعة البطانة (DSAEK / DMEK).', en: T.examText.en + ' Here the endothelium — the inner layer that keeps the cornea clear by pumping out fluid — has failed, as in Fuchs’ dystrophy, so the cornea is swollen and hazy. Only the inner layer needs replacing: an endothelial transplant (DSAEK / DMEK).' }, { section: false }),
      stage('anaesthetic', 5, 'section', T.anaesthetic, { ar: T.anaestheticText.ar + ' يُظهر المقطع القرنية المتورمة الأسمك من المعتاد.', en: T.anaestheticText.en + ' The cross-section shows the swollen cornea, thicker than usual.' }, { section: true }),
      stage('remove', 8, 'section', { ar: 'إزالة الطبقة الداخلية القديمة', en: 'The old inner layer is removed' }, { ar: 'تُزال الطبقة الداخلية المتضررة من خلف القرنية، وتبقى الطبقات الأمامية. تُعرض الإزالة بشكل مبسط.', en: 'The damaged inner layer is removed from the back of the cornea; the front layers stay. The removal is shown in a simplified way.' }, { section: true }),
      stage('donor', 8, 'section', { ar: 'طبقة رقيقة من المتبرع داخل العين', en: 'A thin donor layer inside the eye' }, { ar: 'توضع طبقة داخلية رقيقة من قرنية المتبرع داخل العين، تحت السطح الخلفي للقرنية.', en: 'A thin donor inner layer is placed inside the eye, under the back surface of the cornea.' }, { section: true }),
      stage('bubble', 8, 'section', { ar: 'فقاعة هواء تثبّتها', en: 'An air bubble holds it in place' }, { ar: 'بدلاً من الغرز، تضغط فقاعة هواء في مقدمة العين الطبقة المزروعة على السطح الخلفي للقرنية.', en: 'Instead of stitches, an air bubble in the front of the eye presses the donor layer against the back of the cornea.' }, { section: true }),
      stage('clear', 8, 'section', { ar: 'القرنية تستعيد صفاءها', en: 'The cornea clears' }, { ar: 'مع عمل البطانة الجديدة يخف التورم والعتامة تدريجياً. متابعة مكثفة في الأسابيع الأولى؛ زراعة البطانة أسرع تعافياً عادةً من الزراعة الكاملة.', en: 'With the new endothelium at work, the swelling and haze settle gradually. Close follow-up in the first weeks; endothelial transplants usually recover faster than full-thickness ones.' }, { section: true })
    ];
    return [
      stage('exam', 7, 'front', T.exam, { ar: T.examText.ar + ' هنا كامل سماكة الجزء المركزي من القرنية معتم، أي أن كل الطبقات متضررة، فتُختار الزراعة الكاملة (PK).', en: T.examText.en + ' Here the full thickness of the central cornea is cloudy — all its layers are affected — so a full-thickness transplant (PK) is chosen.' }, { section: false }),
      stage('anaesthetic', 5, 'section', T.anaesthetic, { ar: T.anaestheticText.ar + ' يُظهر المقطع العتامة في كل الطبقات: الظهارة واللحمة والبطانة.', en: T.anaestheticText.en + ' The cross-section shows the cloudiness through every layer: epithelium, stroma and endothelium.' }, { section: true }),
      stage('remove', 8, 'section', { ar: 'إزالة الجزء المركزي المعتم', en: 'The cloudy centre is removed' }, { ar: 'يُزال الجزء المركزي المتضرر بكامل سماكته، فتبقى فتحة دائرية في قرنية المريض. المقاس المعروض توضيحي.', en: 'The damaged central cornea is removed through its full thickness, leaving a round opening in the patient’s own cornea. The size shown is illustrative.' }, { section: true }),
      stage('donor', 8, 'section', { ar: 'وضع قرنية المتبرع', en: 'Donor cornea placed' }, { ar: 'يوضع في الفتحة جزء سليم من قرنية متبرع بكامل سماكته. يأتي النسيج من بنوك العيون التي تفحصه وفق معايير طبية صارمة.', en: 'A healthy full-thickness piece of donor cornea is placed in the opening. The tissue comes from eye banks, which screen it to strict medical standards.' }, { section: true }),
      stage('stitches', 7, 'front', T.stitches, T.stitchesText, { section: false }),
      stage('followup', 6, 'front', T.follow, { ar: 'متابعة مكثفة في الأسابيع الأولى. التعافي البصري بطيء وقد يستمر شهوراً، وتُزال الغرز تدريجياً على مراحل بعد الزراعة الكاملة.', en: 'Close follow-up in the first weeks. Visual recovery is slow and can take months; after a full-thickness transplant, stitches are removed in stages.' }, { section: false })
    ];
  },
  extra: ({ stage: st }) => (st && (st.id === 'followup' || st.id === 'clear') ? WARNING : null),
  sources: [
    ['AAO EyeSmart — About corneal transplantation', 'https://www.aao.org/eye-health/treatments/corneal-transplant'],
    ['NHS — Cornea transplant', 'https://www.nhs.uk/conditions/cornea-transplant/'],
    ['AAO EyeSmart — Parts of the eye', 'https://www.aao.org/eye-health/anatomy/parts-of-eye']
  ],
  simplifications: [
    ...COMMON_SIMPLIFICATIONS,
    { ar: 'مقاس الجزء المزروع توضيحي، وهو نفسه في الأنواع الثلاثة.', en: 'The size of the graft is illustrative and the same in all three types.' },
    { ar: 'عدد الغرز ونمطها توضيحيان؛ لا تُعرض طريقة الخياطة.', en: 'The number and pattern of stitches are illustrative; the stitching technique is not shown.' },
    { ar: 'طبقة رقيقة واحدة من المتبرع تمثل زراعة البطانة بنوعيها DSAEK وDMEK، ولا تُعرض طريقة إدخالها وفردها.', en: 'One thin donor layer stands for both DSAEK and DMEK; how it is inserted and unfolded is not shown.' },
    { ar: 'العتامة والتورم مرسومان بشكل تخطيطي.', en: 'Cloudiness and swelling are drawn schematically.' }
  ],

  build({ THREE, lib, mats }) {
    const eye = standardEye({ THREE, lib, mats }, { cornea: false, lens: false, ciliary: false });
    const { root, parts } = eye;
    const clip = mats.stroma.clippingPlanes; // shared section plane
    const own = [];
    const mat = (m) => { own.push(m); return m; };

    // ---- cornea state (only the swelling changes, in the endothelial transplant)
    let st = corneaDefaults();
    const R = (a, phi) => corneaRadii(a, phi, st);
    const full = (a, phi) => { const k = R(a, phi); return [k.ant, k.epi, k.endo, k.post]; };
    const front = (a, phi) => { const k = R(a, phi); return [k.ant, k.epi, k.endo]; };
    const back = (a, phi) => { const k = R(a, phi); return [k.endo, k.post]; };
    const ekLayer = (a, phi) => { const k = R(a, phi); return [k.endo, k.post - (EK_T - (k.endo - k.post))]; };

    // own materials: highlight of the kept endothelium; haze overlays (cut) and films (surface) per region
    const endoHi = mat(new THREE.MeshStandardMaterial({ color: 0xe08a3c, emissive: 0x6a3000, roughness: 0.6, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: clip }));
    const hazeMat = (color = 0xf4f2ee) => mat(new THREE.MeshStandardMaterial({ color, roughness: 0.9, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: clip, polygonOffset: true, polygonOffsetFactor: -1 }));
    // the cut uses a darker, milky grey so the cloudiness reads against the pale stroma
    const hz = { front: hazeMat(0xb9b3a6), back: hazeMat(0xb9b3a6), ring: hazeMat(0xb9b3a6), filmC: hazeMat(), filmR: hazeMat() };
    const bubbleMat = mat(mats.airBubble.clone()); bubbleMat.clippingPlanes = clip; bubbleMat.color.set(0xbfdcf5); bubbleMat.opacity = 0.42;
    const sutureMat = mat(mats.suture.clone()); sutureMat.clippingPlanes = clip;

    const patch = (o) => {
      const p = lib.layeredPatch({ bottom: mats.corneaBack, edge: mats.corneaEdge, nPhi: 96, ...o });
      p.walls = p.object.children.filter((c) => c.isMesh && c !== p.top && c !== p.bottom);
      return p;
    };
    const overlay = (p, bands, m) => p.capMeshes.filter((c) => bands.includes(c.userData.band)).map((c) => {
      const o = new THREE.Mesh(c.geometry, m); o.renderOrder = 32; p.caps.add(o); return o;
    });
    const film = (p, m) => { const f = new THREE.Mesh(p.top.geometry, m); f.renderOrder = 31; p.object.add(f); return f; };

    // host: the ring outside the graft, and the central button as front layers + back layer (endothelium)
    const ring = patch({ rMin: GR, rMax: EYE.corneaRadius, surfaces: full, bands: [mats.epithelium, mats.stroma, mats.endothelium], top: mats.corneaSurface, nR: 20 });
    const cFront = patch({ rMax: GR, surfaces: front, bands: [mats.epithelium, mats.stroma], top: mats.corneaSurface, nR: 24 });
    const cBack = patch({ rMax: GR, surfaces: back, bands: [mats.endothelium], top: endoHi, nR: 18 });
    // donor tissue (graft materials): full thickness (PK), front layers (DALK), thin inner layer (DSAEK / DMEK)
    const gPK = patch({ rMax: GR, surfaces: full, bands: [mats.graftEpithelium, mats.graftStroma, mats.graftEndothelium], top: mats.graftSurface, nR: 24 });
    const gDALK = patch({ rMax: GR, surfaces: front, bands: [mats.graftEpithelium, mats.graftStroma], top: mats.graftSurface, nR: 24 });
    const gEK = patch({ rMax: GR, surfaces: ekLayer, bands: [mats.graftEndothelium], top: mats.graftSurface, bottom: mats.graftSurface, nR: 18 });
    const hostCut = { front: overlay(cFront, [0, 1], hz.front), back: overlay(cBack, [0], hz.back), ring: overlay(ring, [1], hz.ring) };
    const films = { c: film(cFront, hz.filmC), r: film(ring, hz.filmR) };

    const cornea = new THREE.Group(); cornea.name = 'cornea';
    cornea.add(ring.object, cFront.object, cBack.object, gPK.object, gDALK.object, gEK.object);
    root.add(cornea);
    Object.assign(parts, { cornea, ring: ring.object, centreFront: cFront.object, centreBack: cBack.object, graftPK: gPK.object, graftDALK: gDALK.object, graftEK: gEK.object });

    // ---- stitches: small bites across the graft–host junction, following the (unswollen) corneal surface
    const stitches = new THREE.Group(); stitches.name = 'stitches';
    const k0 = corneaDefaults();
    const onSurf = (r, phi, depth) => { const a = A_OF(r), k = corneaRadii(a, phi, k0); return new THREE.Vector3(...corneaPoint(a, phi, k.ant - depth * (k.ant - k.post) + (depth === 0 ? 0.025 : 0))); };
    for (let n = 0; n < STITCHES; n++) {
      const phi = ((n + 0.5) / STITCHES) * Math.PI * 2;
      const pts = [onSurf(GR + 0.45, phi, 0), onSurf(GR + 0.3, phi, 0.3), onSurf(GR, phi, 0.55), onSurf(GR - 0.3, phi, 0.3), onSurf(GR - 0.45, phi, 0)];
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.032, 6, false), sutureMat);
      m.renderOrder = 35; stitches.add(m);
    }
    root.add(stitches); parts.stitches = stitches;

    // ---- air bubble in the anterior chamber (endothelial transplant): a sphere cap closed by a flat base above the lens
    const BR = 3.4, bCz = EYE.corneaPostApexZ - 0.03 - BR, bBase = EYE.lensAntApexZ + 0.35;
    const th = Math.acos((bBase - bCz) / BR);
    const bubbleG = new THREE.SphereGeometry(BR, 48, 20, 0, Math.PI * 2, 0, th);
    bubbleG.rotateX(Math.PI / 2);
    const baseG = new THREE.CircleGeometry(BR * Math.sin(th), 48); baseG.translate(0, 0, BR * Math.cos(th));
    const bubble = new THREE.Group(); bubble.name = 'bubble';
    const bMesh = new THREE.Mesh(bubbleG, bubbleMat), bBaseM = new THREE.Mesh(baseG, bubbleMat);
    bMesh.renderOrder = bBaseM.renderOrder = 26;
    bubble.add(bMesh, bBaseM);
    bubble.position.z = bCz;
    root.add(bubble); parts.bubble = bubble;

    // label anchors (section plane x = 0; host labels on the ring, below the centre)
    const at = (r, phi, f) => { const a = A_OF(r), k = corneaRadii(a, phi, k0); return corneaPoint(a, phi, f(k)); };
    const lab = {
      epi: at(4.7, -Math.PI / 2, (k) => k.ant + 0.05),
      stroma: at(4.3, -Math.PI / 2, (k) => (k.epi + k.endo) / 2),
      endo: at(4.0, -Math.PI / 2, (k) => k.post - 0.05),
      donor: at(1.7, -Math.PI / 2, (k) => k.ant + 0.1),
      donorEK: at(2.4, -Math.PI / 2, (k) => k.post - 0.15),
      kept: at(2.6, -Math.PI / 2, (k) => k.post - 0.08),
      cloudy: at(1.9, -Math.PI / 2, (k) => k.ant + 0.1),
      stitch: at(GR + 0.2, Math.PI * 0.62, (k) => k.ant + 0.06)
    };

    let lastSwell = -1;
    const model = {
      root, parts,
      labels: [
        { id: 'epithelium', part: 'ring', at: lab.epi, text: { ar: 'الظهارة', en: 'Epithelium' }, inner: true, when: (s) => s.index <= 3 },
        { id: 'stroma', part: 'ring', at: lab.stroma, text: { ar: 'اللحمة', en: 'Stroma' }, inner: true, when: (s) => s.index <= 3 },
        { id: 'endothelium', part: 'ring', at: lab.endo, text: { ar: 'البطانة', en: 'Endothelium' }, inner: true, when: (s) => s.index <= 3 && s.variant !== 'dalk' },
        { id: 'kept', part: 'centreBack', at: lab.kept, text: { ar: 'بطانة المريض (تبقى)', en: 'Your own endothelium (kept)' }, inner: true, when: (s) => s.variant === 'dalk' && s.index <= 3 },
        { id: 'cloudy', part: 'centreFront', at: lab.cloudy, text: { ar: 'الجزء المعتم', en: 'Cloudy area' }, when: (s) => s.index <= 1 && s.variant !== 'ek' },
        { id: 'swollen', part: 'centreFront', at: lab.cloudy, text: { ar: 'قرنية متورمة معتمة', en: 'Swollen, hazy cornea' }, when: (s) => s.index <= 1 && s.variant === 'ek' },
        { id: 'donorPK', part: 'graftPK', at: lab.donor, text: { ar: 'نسيج المتبرع', en: 'Donor tissue' } },
        { id: 'donorDALK', part: 'graftDALK', at: lab.donor, text: { ar: 'نسيج المتبرع', en: 'Donor tissue' } },
        { id: 'donorEK', part: 'graftEK', at: lab.donorEK, text: { ar: 'طبقة المتبرع الداخلية', en: 'Donor inner layer' }, inner: true },
        { id: 'stitches', part: 'stitches', at: lab.stitch, text: { ar: 'الغرز', en: 'Stitches' } },
        { id: 'bubble', part: 'bubble', at: [0, -1.6, 1.9], text: { ar: 'فقاعة هواء', en: 'Air bubble' } }
      ],
      state: {},
      apply(s) {
        const i = s.index, p = s.p, v = s.variant || 'pk';
        const pk = v === 'pk', dalk = v === 'dalk', ek = v === 'ek';
        // ---- swelling (endothelial failure) and its recovery
        const sw = !ek ? 0 : i === 0 ? span(p, 0.1, 0.8) : i < 5 ? 1 : 1 - span(p, 0.1, 0.85);
        const swell = SWELL * sw;
        if (Math.abs(swell - lastSwell) > 1e-6) {
          st = corneaDefaults({ swelling: swell });
          for (const q of [ring, cFront, cBack, gEK]) q.update();
          lastSwell = swell;
        }
        // ---- haze: where the damage is
        const h0 = i === 0 ? span(p, 0.1, 0.75) : 1;
        const hzFront = (pk || dalk) ? h0 : ek ? (i < 5 ? h0 : 1 - span(p, 0.2, 1)) * 0.75 : 0;
        const hzBack = pk ? h0 : 0;
        const hzRing = ek ? hzFront * 0.8 : 0;
        hz.front.opacity = 0.72 * hzFront; hz.back.opacity = 0.72 * hzBack; hz.ring.opacity = 0.6 * hzRing;
        hz.filmC.opacity = 0.75 * hzFront; hz.filmR.opacity = 0.5 * hzRing;
        for (const m of hostCut.front) m.visible = hzFront > 0.001;
        for (const m of hostCut.back) m.visible = hzBack > 0.001;
        for (const m of hostCut.ring) m.visible = hzRing > 0.001;
        films.c.visible = hzFront > 0.001; films.r.visible = hzRing > 0.001;
        // ---- removal of the damaged tissue (lifted out in front; the old inner layer drops away behind)
        const out = i < 2 ? 0 : i === 2 ? span(p, 0.12, 0.85) : 1;
        const frontOut = pk || dalk ? out : 0, backOut = pk ? out : ek ? out : 0;
        cFront.object.visible = frontOut < 0.999;
        cFront.object.position.z = 4.5 * frontOut;
        cBack.object.visible = backOut < 0.999;
        cBack.object.position.z = pk ? 4.5 * backOut : ek ? -1.6 * backOut : 0;
        // the kept endothelium of DALK is highlighted
        const hi = dalk ? (i === 0 ? span(p, 0.5, 1) : i <= 3 ? 1 : 1 - span(p, 0, 0.6)) : 0;
        endoHi.opacity = 0.65 * hi;
        cBack.top.visible = hi > 0.001;
        // ---- donor tissue
        const arrive = i < 3 ? -1 : i === 3 ? span(p, 0.1, 0.85) : 1;
        gPK.object.visible = pk && arrive >= 0;
        gDALK.object.visible = dalk && arrive >= 0;
        gPK.object.position.z = gDALK.object.position.z = 4.5 * (1 - Math.max(0, arrive));
        // EK: placed inside the eye below the cornea, then pressed up by the air bubble
        const press = !ek || i < 4 ? 0 : i === 4 ? span(p, 0.35, 0.9) : 1;
        gEK.object.visible = ek && arrive >= 0;
        gEK.object.position.z = -(1 - Math.max(0, arrive)) * 1.2 - 0.32 * (1 - press);
        const bub = !ek || i < 4 ? 0 : i === 4 ? span(p, 0, 0.55) : 1;
        bubble.visible = bub > 0.001;
        bubble.scale.setScalar(Math.max(0.001, bub));
        bubble.position.z = bCz + (1 - bub) * BR * 0.6;
        // ---- walls: the junction shows only once the centre has been cut
        const opened = (pk || dalk) && (i > 2 || (i === 2 && out > 0));
        ring.walls[1].visible = opened && !(arrive >= 0.999 && (pk || dalk)); // the graft edge shows the junction once it is in
        cFront.walls[0].visible = frontOut > 0;
        cBack.walls[0].visible = backOut > 0 || (dalk && opened);
        // ---- stitches appear one by one around the edge (PK and DALK)
        const nSt = (pk || dalk) ? (i < 4 ? 0 : i === 4 ? Math.round(STITCHES * span(p, 0.05, 0.9)) : STITCHES) : 0;
        stitches.visible = nSt > 0;
        stitches.children.forEach((m, n) => { m.visible = n < nSt; });
        model.state = {
          variant: v, replaced: pk ? ['epithelium', 'stroma', 'endothelium'] : dalk ? ['epithelium', 'stroma'] : ['endothelium'],
          swelling: +swell.toFixed(4), haze: +Math.max(hzFront * (1 - frontOut), hzBack * (1 - backOut), hzRing).toFixed(4), removed: +out.toFixed(4),
          graftVisible: gPK.object.visible || gDALK.object.visible || gEK.object.visible,
          stitchesVisible: nSt, bubbleVisible: bubble.visible, endotheliumHighlight: +hi.toFixed(4)
        };
      },
      probe: () => ({ ...model.state, centralThickness: +centralThickness(st).toFixed(4) }),
      dispose() { for (const m of own) m.dispose(); }
    };
    return model;
  }
};
export default def;
