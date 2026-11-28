// Keratoconus and corneal cross-linking (CXL) — /procedures/keratoconus-cxl/.
// What it teaches (from the keratoconus-cxl page only): a normal cornea is an evenly curved dome; in keratoconus the
// collagen fibres of the stroma weaken, the cornea thins and bulges into a cone in one area, causing irregular
// astigmatism and distorted vision. Cross-linking follows the page steps: tomography → numbing drops → riboflavin
// (vitamin B2) drops → controlled ultraviolet light that strengthens the bonds → bandage contact lens and drops. Its
// goal is to slow or stop progression; it does not return the cornea to a normal shape, so the cone stays in the model.
// Education only: the cone, the colour map and the light paths are illustrative, never a diagnosis or a grading.
import { EYE, CORNEA_A0, corneaDefaults, corneaRadii, corneaPoint, centralThickness } from '../anatomy/geometry.js';
import { CAMERAS, NOTE, COMMON_SIMPLIFICATIONS, standardEye, stage, span, mix } from './common.js';

// Illustrative cone: outward bulge and stromal thinning at the cone centre (mm). Drawn larger than typical so it can be
// seen at the scale of the whole cornea; position, width and shape come from corneaDefaults() (below the centre).
const CONE = { amp: 0.7, thin: 0.24 };
const BULGE = corneaDefaults().bulge;
const CONE_X = BULGE.r0 * Math.cos(BULGE.phi0), CONE_Y = BULGE.r0 * Math.sin(BULGE.phi0);
const A_OF = (r) => Math.asin(Math.min(0.9999, r / EYE.corneaRc));
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const coneG = (r, phi) => {
  const x = r * Math.cos(phi), y = r * Math.sin(phi);
  return Math.exp(-((x - CONE_X) ** 2 + (y - CONE_Y) ** 2) / (2 * BULGE.sigma ** 2)) * (1 - smooth(EYE.corneaRadius - 0.6, EYE.corneaRadius, r));
};
const stateFor = (k) => corneaDefaults({ bulge: { amp: CONE.amp * k, thin: CONE.thin * k } });
const surfacePoint = (r, phi, k, which = 'ant', off = 0) => { const a = A_OF(r); return corneaPoint(a, phi, corneaRadii(a, phi, stateFor(k))[which] + off); };

const SURFACE_NOTE = { ar: 'تختلف طريقة التعامل مع الطبقة السطحية (الظهارة) بين الحالات، ولا تُعرض هنا.', en: 'How the surface layer (epithelium) is handled differs between cases and is not shown.' };

const def = {
  id: 'keratoconus-cxl', slug: 'keratoconus-cxl', modelId: 'ssim-cxl', version: '2026.11-r1',
  title: { ar: 'القرنية المخروطية وتثبيت القرنية (CXL)', en: 'Keratoconus and corneal cross-linking (CXL)' },
  note: NOTE,
  objectives: [
    { ar: 'التعرف على القرنية الطبيعية كقبة منتظمة الانحناء، وعلى طبقة اللحمة المصنوعة من ألياف الكولاجين.', en: 'Recognise the normal cornea as an evenly curved dome, and the stroma made of collagen fibres.' },
    { ar: 'فهم كيف تضعف القرنية المخروطية وتترقق وتبرز في جزء منها، ولماذا تتشوش الرؤية.', en: 'Understand how a keratoconic cornea weakens, thins and bulges in one area, and why vision becomes distorted.' },
    { ar: 'معرفة خطوات التثبيت كما تصفها الصفحة، وأن هدفه إبطاء التطور أو إيقافه وليس إعادة القرنية إلى شكلها الطبيعي.', en: 'Know the cross-linking steps described on the page, and that it aims to slow or stop progression, not to return the cornea to a normal shape.' }
  ],
  variants: [
    { id: 'keratoconus', label: { ar: 'فهم القرنية المخروطية', en: 'Understanding keratoconus' } },
    { id: 'cxl', label: { ar: 'تثبيت القرنية (CXL)', en: 'Cross-linking (CXL)' } }
  ],
  cameras: {
    closeSection: { pos: [11.5, -2.0, 2.6], target: [0, -2.0, 2.6], fit: [1.8, 3.4], label: { ar: 'القرنية عن قرب (مقطع)', en: 'Cornea close-up (section)' } },
    side: { pos: [18, -0.4, 2.0], target: [0, -0.4, 2.0], fit: [2.8, 6.2], label: { ar: 'جانب القرنية', en: 'Side profile' } },
    front: { pos: [0.01, 0.5, 21], target: [0, -0.3, 1.5], fit: [6.6, 6.6], label: { ar: 'من الأمام', en: 'Front view' } },
    optics: { pos: [34, 1, -2.5], target: [0, 0, -2.5], fit: [11, 8], label: { ar: 'مسار الضوء', en: 'Light path' } },
    oblique: { pos: [7.5, 6.5, 15.5], target: [0, -0.4, 1.6], fit: [6.6, 6.6] },
    full: CAMERAS.full
  },
  toggles: [
    { id: 'compare', label: { ar: 'إطار القبة الطبيعية للمقارنة', en: 'Normal dome outline to compare' }, default: true },
    { id: 'map', label: { ar: 'الخريطة الملونة في كل المراحل (توضيحية)', en: 'Colour map in every stage (illustrative)' }, default: false },
    { id: 'eye', label: { ar: 'أجزاء العين الأخرى', en: 'Rest of the eye' }, parts: ['sclera', 'iris'] }
  ],
  stages: (variant) => (variant === 'cxl' ? [
    stage('tomography', 7, 'front', { ar: 'التصوير الطبقي للقرنية', en: 'Corneal tomography' },
      { ar: 'يقيس التصوير الطبقي شكل القرنية وسماكتها ويتابع تغيّرها عبر الوقت. يُلجأ إلى التثبيت حين يثبت التصوير أن القرنية المخروطية تتطور. الألوان هنا توضيحية: الألوان الدافئة تشير إلى مكان البروز.', en: 'Corneal tomography measures the shape and thickness of the cornea and tracks change over time. Cross-linking is considered when imaging shows the keratoconus is progressing. The colours here are illustrative: warmer colours mark where the cornea bulges.' }, { section: false }),
    stage('numbing', 5, 'front', { ar: 'قطرات مخدرة', en: 'Numbing drops' },
      { ar: 'تبدأ الجلسة بقطرات مخدرة على العين.', en: 'The treatment starts with numbing drops on the eye.' }, { section: false }),
    stage('riboflavin', 8, 'closeSection', { ar: 'قطرات الريبوفلافين (فيتامين ب2)', en: 'Riboflavin (vitamin B2) drops' },
      { ar: 'توضع قطرات الريبوفلافين (فيتامين ب2) على القرنية. في المقطع يظهر الريبوفلافين باللون الأصفر داخل اللحمة. ' + SURFACE_NOTE.ar, en: 'Riboflavin (vitamin B2) drops are applied to the cornea. In the cross-section, yellow shows the riboflavin in the stroma. ' + SURFACE_NOTE.en }, { section: true }),
    stage('uv', 9, 'closeSection', { ar: 'أشعة فوق بنفسجية مضبوطة', en: 'Controlled ultraviolet light' },
      { ar: 'تُعرَّض القرنية لأشعة فوق بنفسجية مضبوطة تتفاعل مع الريبوفلافين لتقوية الروابط بين ألياف الكولاجين. الجسور القصيرة بين الألياف رسم تخطيطي للفكرة.', en: 'Controlled ultraviolet light activates the riboflavin to strengthen the bonds between the collagen fibres. The short bridges between the fibres are a schematic drawing of the idea.' }, { section: true }),
    stage('bandage', 6, 'oblique', { ar: 'عدسة ضمادية وقطرات', en: 'Bandage lens and drops' },
      { ar: 'توضع عادةً عدسة لاصقة ضمادية وتُستعمل قطرات في الأيام الأولى. يُمنع فرك العين تماماً، فهو عامل معروف في تفاقم الحالة.', en: 'Usually a bandage contact lens and drops are used for the first days. No eye rubbing at all — it is a recognised factor in progression.' }, { section: false }),
    stage('goal', 7, 'side', { ar: 'أقوى، لا شكل جديد', en: 'Stronger, not reshaped' },
      { ar: 'يهدف التثبيت إلى إبطاء تطور القرنية المخروطية أو إيقافه للمحافظة على الرؤية الحالية، ولا يعيد القرنية إلى شكلها الطبيعي، لذا يبقى المخروط. غالباً تبقى النظارة أو العدسات الخاصة لازمة، والمتابعة بالتصوير ضرورية لسنوات.', en: 'Cross-linking aims to slow or stop keratoconus from progressing, to protect the vision you have. It does not return the cornea to a normal shape, so the cone stays. Glasses or specialty lenses are usually still needed, and imaging follow-up is needed for years.' }, { section: true })
  ] : [
    stage('normal', 6, 'side', { ar: 'القرنية الطبيعية: قبة منتظمة', en: 'A normal cornea: an even dome' },
      { ar: 'تتكون القرنية من طبقات، أهمها اللحمة (السدى) المصنوعة من ألياف الكولاجين. القرنية الطبيعية قبة منتظمة الانحناء.', en: 'The cornea is built in layers; the main one, the stroma, is made of collagen fibres. A normal cornea is an evenly curved dome.' }, { section: true }),
    stage('cone', 8, 'side', { ar: 'تضعف القرنية وتترقق وتبرز', en: 'The cornea weakens, thins and bulges' },
      { ar: 'في القرنية المخروطية تضعف ألياف الكولاجين، فتترقق القرنية وتبرز تدريجياً في جزء منها بشكل يشبه المخروط. المخروط في النموذج مكبّر ليظهر بوضوح.', en: 'In keratoconus the collagen fibres weaken, so the cornea thins and gradually bulges into a cone-like shape in one area. The cone in the model is enlarged so it can be seen.' }, { section: true }),
    stage('thin', 6, 'closeSection', { ar: 'أرق وأكثر بروزاً في جزء منها', en: 'Thinner and steeper in one area' },
      { ar: 'يُظهر المقطع أن القرنية أرق في مكان البروز وأكثر تحدباً فيه، بينما يبقى باقيها أقرب إلى شكله المعتاد.', en: 'The cross-section shows the cornea is thinner where it bulges, and steeper there, while the rest stays closer to its usual shape.' }, { section: true }),
    stage('distortion', 8, 'optics', { ar: 'لماذا تتشوش الرؤية', en: 'Why vision becomes distorted' },
      { ar: 'يسبب الشكل غير المنتظم استجماتيزماً غير منتظم وتشوشاً في الرؤية: لم يعد الضوء يلتقي في نقطة واحدة. مسارات الضوء رسم مبسط للفكرة، وليست محاكاة بصرية.', en: 'The uneven shape causes irregular astigmatism and distorted vision: light no longer comes together at one point. The light paths are a simple drawing of the idea, not an optical simulation.' }, { section: true }),
    stage('compare', 7, 'side', { ar: 'القبة الطبيعية والمخروط معاً', en: 'Normal dome and cone together' },
      { ar: 'يُظهر الإطار المتقطع مكان القبة الطبيعية المنتظمة للمقارنة. تظهر القرنية المخروطية غالباً في سن المراهقة والشباب، والتشخيص المبكر يفتح خيارات أكثر.', en: 'The dashed outline shows where an evenly curved dome would be, for comparison. Keratoconus often appears in the teens and twenties, and early diagnosis opens up more options.' }, { section: true })
  ]),
  extra: ({ variant, stage: st }) => (variant === 'keratoconus' && st.id === 'compare'
    ? { ar: 'هذا نموذج تعليمي وليس تشخيصاً أو تقييماً لدرجة الحالة؛ الفحص والتصوير يحددان ذلك.', en: 'This is an educational model, not a diagnosis or a grading; the examination and imaging decide that.' }
    : null),
  sources: [
    ['AAO EyeSmart — What is keratoconus?', 'https://www.aao.org/eye-health/diseases/what-is-keratoconus'],
    ['AAO EyeSmart — Corneal cross-linking', 'https://www.aao.org/eye-health/treatments/corneal-cross-linking'],
    ['AAO EyeSmart — Parts of the eye', 'https://www.aao.org/eye-health/anatomy/parts-of-eye']
  ],
  simplifications: [
    ...COMMON_SIMPLIFICATIONS,
    { ar: 'حجم المخروط وموضعه توضيحيان ومكبّران؛ الشكل يختلف من مريض لآخر.', en: 'The size and position of the cone are illustrative and enlarged; the shape differs between patients.' },
    { ar: 'الخريطة الملونة رسم توضيحي لمكان البروز، وليست صورة تصوير طبقي حقيقية ولا تقييماً لدرجة الحالة.', en: 'The colour map is an illustration of where the cornea bulges, not a real tomography scan or a grading.' },
    { ar: 'مسارات الضوء رسم مبسط لفكرة الاستجماتيزم غير المنتظم، وليست محاكاة بصرية.', en: 'The light paths are a simple drawing of irregular astigmatism, not an optical simulation.' },
    SURFACE_NOTE,
    { ar: 'اللون الأصفر للريبوفلافين، وحجم حزمة الأشعة، والجسور بين ألياف الكولاجين رسوم تخطيطية.', en: 'The yellow riboflavin tint, the size of the light beam and the bridges between the collagen fibres are schematic.' }
  ],

  build({ THREE, lib, mats }) {
    const eye = standardEye({ THREE, lib, mats }, { cornea: false, lens: false, ciliary: false });
    const { root, parts } = eye;
    const clip = mats.stroma.clippingPlanes; // the shared section plane (same array, so it follows the section switch)
    const own = []; // materials made here
    const mat = (m) => { own.push(m); return m; };

    // ---- tomography colour map (illustrative): elevation above the normal dome, plus a gentle centre–edge gradient
    const ramp = ['#2a56b0', '#2b9fcf', '#3fae6a', '#e3d23a', '#ee8a2b', '#d1342b'].map((h) => new THREE.Color(h));
    let kNow = 0;
    const colorAt = (a, phi) => {
      const r = EYE.corneaRc * Math.sin(a);
      const v = Math.min(1, 0.2 * (1 - (r / EYE.corneaRadius) ** 2) + 0.82 * coneG(r, phi) * kNow);
      const x = v * (ramp.length - 1), i = Math.min(ramp.length - 2, Math.floor(x)), f = x - i;
      const c0 = ramp[i], c1 = ramp[i + 1];
      return [c0.r + (c1.r - c0.r) * f, c0.g + (c1.g - c0.g) * f, c0.b + (c1.b - c0.b) * f];
    };
    const cornea = lib.buildCornea(mats, corneaDefaults(), { colorAt });
    root.add(cornea.object); parts.cornea = cornea.object;
    const tomo = new THREE.Mesh(cornea.top.geometry, mats.corneaTomo); tomo.renderOrder = 31;
    cornea.object.add(tomo); parts.map = tomo;
    const riboFilm = new THREE.Mesh(cornea.top.geometry, mat(new THREE.MeshStandardMaterial({ color: 0xf2c400, roughness: 0.5, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: clip })));
    riboFilm.renderOrder = 32; cornea.object.add(riboFilm);

    // ---- stroma overlays in the cross-section: riboflavin tint and cross-link bridges (reuse the stroma cap strips)
    const riboCaps = [], linkCaps = [];
    for (const m of cornea.capMeshes) if (m.userData.band === 1) {
      const r = new THREE.Mesh(m.geometry, mats.riboflavin); r.renderOrder = 32;
      const l = new THREE.Mesh(m.geometry, mats.crosslinks); l.renderOrder = 33;
      cornea.caps.add(r, l); riboCaps.push(r); linkCaps.push(l);
    }

    // ---- normal dome for comparison: faint wireframe (3D) and dashed profile on the cut (section view)
    const ghost = new THREE.Group(); ghost.name = 'ghost';
    const capG = new THREE.SphereGeometry(EYE.corneaRc + 0.004, 40, 9, 0, Math.PI * 2, 0, Math.asin(EYE.corneaRadius / EYE.corneaRc));
    capG.rotateX(Math.PI / 2); capG.translate(0, 0, EYE.corneaCz);
    const wire = new THREE.Mesh(capG, mat(new THREE.MeshBasicMaterial({ color: 0x2e7fb8, wireframe: true, transparent: true, opacity: 0.28, depthWrite: false, clippingPlanes: clip })));
    wire.renderOrder = 34;
    const profileLine = (which) => {
      const pts = [], n = 60;
      for (const [phi, dir] of [[-Math.PI / 2, -1], [Math.PI / 2, 1]]) {
        for (let k = 0; k <= n; k++) {
          const t = dir < 0 ? 1 - k / n : k / n;
          const a = CORNEA_A0 * t, rho = corneaRadii(a, phi, corneaDefaults())[which];
          const p = corneaPoint(a, phi, rho);
          pts.push(new THREE.Vector3(0.02, p[1], p[2]));
        }
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(g, dashMat); line.computeLineDistances(); line.renderOrder = 42;
      return line;
    };
    const dashMat = mat(new THREE.LineDashedMaterial({ color: 0x1f6fb2, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.95, depthTest: false }));
    const dashes = new THREE.Group();
    dashes.add(profileLine('ant'), profileLine('post'));
    ghost.add(wire, dashes);
    root.add(ghost); parts.ghost = ghost;

    // ---- drops (numbing: clear; riboflavin: yellow), falling onto the apex
    const apex = surfacePoint(0.0001, 0, 1);
    const dropG = new THREE.SphereGeometry(0.3, 18, 12);
    const drop = new THREE.Mesh(dropG, mats.drop); drop.renderOrder = 44;
    root.add(drop); parts.drop = drop;

    // ---- controlled UV light (subtle cone onto the cornea; not clipped so it stays readable)
    // own normal-blended copy of the UV material: additive light washes out to white on the light theme
    const uvMat = mat(new THREE.MeshBasicMaterial({ color: 0x6b4fe0, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    const uv = lib.buildBeam(uvMat, { radius: 4.4, length: 12 });
    uv.position.z = 1.4; uv.name = 'uv';
    root.add(uv); parts.uv = uv;

    // ---- bandage contact lens: a thin shell following the treated (still conical) cornea
    const bandMat = mat(mats.bandage.clone()); bandMat.clippingPlanes = clip; bandMat.opacity = 0.3;
    const rimMat = mat(new THREE.MeshStandardMaterial({ color: 0x8fc3e6, roughness: 0.3, transparent: true, opacity: 0, clippingPlanes: clip }));
    const bandage = (() => {
      const nR = 22, nP = 72, pos = [], idx = [];
      for (let j = 0; j <= nR; j++) for (let i = 0; i <= nP; i++) {
        const r = Math.max(0.0001, 5.7 * (j / nR)), phi = (i / nP) * Math.PI * 2;
        pos.push(...surfacePoint(r, phi, 1, 'ant', 0.07));
      }
      for (let j = 0; j < nR; j++) for (let i = 0; i < nP; i++) {
        const a = j * (nP + 1) + i, b = a + 1, c = a + nP + 1, d = c + 1; idx.push(a, c, b, b, c, d);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, bandMat); m.renderOrder = 36; m.name = 'bandage';
      // rim so the thin clear lens can be seen
      const rim = [];
      for (let i = 0; i <= nP; i++) rim.push(new THREE.Vector3(...surfacePoint(5.7, (i / nP) * Math.PI * 2, 1, 'ant', 0.07)));
      m.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim, true), 144, 0.05, 6, true), rimMat));
      return m;
    })();
    root.add(bandage); parts.bandage = bandage;

    // ---- light paths for irregular astigmatism (drawn in the cut plane)
    const rays = lib.buildRays(mats.rays, 7);
    rays.object.name = 'rays';
    root.add(rays.object); parts.rays = rays.object;
    const FOCUS_Z = -9;

    // label anchors
    const conePt = surfacePoint(Math.abs(CONE_Y), -Math.PI / 2, 1, 'ant', 0.05);
    const stromaMid = (r, phi, k) => { const a = A_OF(r), q = corneaRadii(a, phi, stateFor(k)); return corneaPoint(a, phi, (q.epi + q.endo) / 2); };
    const ghostTop = corneaPoint(A_OF(3.2), Math.PI / 2, EYE.corneaRc + 0.02);

    let lastKey = '';
    const model = {
      root, parts,
      labels: [
        { id: 'cornea', part: 'cornea', at: [0, 4.2, surfacePoint(4.2, Math.PI / 2, 0)[2] + 0.15], text: { ar: 'القرنية', en: 'Cornea' }, when: (s) => s.index === 0 && !s.section },
        { id: 'stroma', part: 'cornea', at: stromaMid(3.9, Math.PI / 2, 0), text: { ar: 'اللحمة: ألياف الكولاجين', en: 'Stroma: collagen fibres' }, inner: true, when: (s) => (s.variant === 'keratoconus' ? s.index <= 2 : s.index === 2) },
        { id: 'cone', part: 'cornea', at: conePt, text: { ar: 'أرق وأكثر بروزاً', en: 'Thinner, steeper area' }, inner: true, when: (s) => (s.variant === 'keratoconus' ? s.index === 2 || s.index === 4 : s.index === 5) },
        { id: 'normal', part: 'ghost', at: [0, ghostTop[1], ghostTop[2] + 0.1], text: { ar: 'إطار القبة الطبيعية', en: 'Normal dome (outline)' }, inner: true },
        { id: 'map', part: 'map', at: [0, -3.6, surfacePoint(3.6, -Math.PI / 2, 1)[2] + 0.2], text: { ar: 'الألوان الدافئة: مكان البروز', en: 'Warmer colours: where it bulges' } },
        { id: 'ribo', part: 'cornea', at: stromaMid(3.2, -Math.PI / 2, 1), text: { ar: 'الريبوفلافين في اللحمة', en: 'Riboflavin in the stroma' }, inner: true, when: (s) => s.variant === 'cxl' && s.index === 2 },
        { id: 'links', part: 'cornea', at: stromaMid(3.2, -Math.PI / 2, 1), text: { ar: 'روابط أقوى بين الألياف (تخطيطي)', en: 'Stronger bonds between fibres (schematic)' }, inner: true, when: (s) => s.variant === 'cxl' && s.index === 3 },
        { id: 'uv', part: 'uv', at: [0, 2.2, 9.5], text: { ar: 'أشعة فوق بنفسجية مضبوطة', en: 'Controlled ultraviolet light' } },
        { id: 'bandage', part: 'bandage', at: surfacePoint(5.0, 0.35, 1, 'ant', 0.3), text: { ar: 'عدسة لاصقة ضمادية', en: 'Bandage contact lens' } },
        { id: 'rays', part: 'rays', at: [0, 0.4, FOCUS_Z + 1.2], text: { ar: 'الضوء لا يلتقي في نقطة واحدة', en: 'Light does not meet at one point' } }
      ],
      state: {},
      apply(s) {
        const i = s.index, p = s.p, cxl = s.variant === 'cxl';
        // ---- cone: grows in the keratoconus variant; already present (and kept) in the CXL variant
        const k = cxl ? 1 : i === 0 ? 0 : i === 1 ? span(p, 0.1, 0.9) : 1;
        const key = k.toFixed(5);
        if (key !== lastKey) { kNow = k; cornea.setState({ bulge: { amp: CONE.amp * k, thin: CONE.thin * k } }); lastKey = key; }
        // ---- colour map: the tomography stage, or everywhere when the visitor turns it on
        const map = !!s.toggles.map || (cxl && i === 0);
        tomo.visible = map; cornea.top.visible = !map;
        // ---- drops
        let dropT = -1, ribDrop = false;
        if (cxl && i === 1) { dropT = p < 0.5 ? span(p, 0.08, 0.42) : span(p, 0.55, 0.9); }
        if (cxl && i === 2 && p < 0.66) { const q = (p % 0.22) / 0.22; dropT = span(q, 0.05, 0.9); ribDrop = true; }
        drop.visible = dropT >= 0 && dropT < 0.999;
        drop.material = ribDrop ? mats.dropRibo : mats.drop;
        const fall = span(dropT, 0, 0.75), splash = span(dropT, 0.75, 1);
        drop.position.set(apex[0], apex[1], mix(apex[2] + 7, apex[2] + 0.2, fall));
        drop.scale.set(1 + 1.4 * splash, 1 + 1.4 * splash, 1 - 0.75 * splash);
        mats.drop.opacity = 0.55 * (1 - splash);
        mats.dropRibo.opacity = 0.85 * (1 - splash);
        // ---- riboflavin in the stroma, then cross-links under the UV light
        const ribo = !cxl || i < 2 ? 0 : i === 2 ? span(p, 0.12, 0.95) : i === 3 ? 1 : i === 4 ? 1 - span(p, 0.1, 0.9) : 0;
        const links = !cxl || i < 3 ? 0 : i === 3 ? span(p, 0.12, 0.92) : 1;
        mats.riboflavin.opacity = 0.5 * ribo;
        riboFilm.material.opacity = 0.3 * ribo;
        riboFilm.visible = ribo > 0.001;
        mats.crosslinks.opacity = links;
        for (const m of riboCaps) m.visible = ribo > 0.001;
        for (const m of linkCaps) m.visible = links > 0.001;
        const uvOn = cxl && i === 3 && p > 0.04;
        uv.visible = uvOn;
        uvMat.opacity = uvOn ? 0.1 * span(p, 0.04, 0.14) : 0;
        // ---- bandage lens settles onto the cornea
        const band = !cxl || i < 4 ? -1 : i === 4 ? span(p, 0.1, 0.75) : 1;
        bandage.visible = band >= 0;
        bandage.position.z = mix(3.5, 0, Math.max(0, band));
        bandMat.opacity = 0.38 * Math.max(0, band); rimMat.opacity = 0.85 * Math.max(0, band);
        // ---- normal outline for comparison (wireframe in 3D, dashed profile on the cut)
        ghost.visible = !!s.toggles.compare && (cxl ? i === 5 : i >= 1);
        wire.visible = !s.section; dashes.visible = !!s.section;
        // ---- light paths: irregular astigmatism (keratoconus variant, "why vision distorts")
        const showRays = !cxl && i === 3;
        rays.object.visible = showRays;
        if (showRays) {
          const grow = span(p, 0, 0.35), spread = span(p, 0.3, 0.85);
          const paths = [];
          for (let j = 0; j < 7; j++) {
            const y = -2.7 + (5.4 * j) / 6;
            const r = Math.abs(y), phi = y < 0 ? -Math.PI / 2 : Math.PI / 2;
            const c = surfacePoint(Math.max(0.0001, r), phi, k);
            const g = coneG(r, phi);
            const ey = (y - CONE_Y) * 0.9 * g * spread + (j - 3) * 0.12 * spread;
            const ez = FOCUS_Z + 3.4 * g * spread;
            const end = [0.02, c[1] + (ey - c[1]) * grow, c[2] + (ez - c[2]) * grow];
            paths.push([[0.02, y, 13], [0.02, c[1], c[2]], end]);
          }
          rays.set(paths);
        }
        model.state = { k, ribo, links, uvOn, map, band: Math.max(0, band) };
      },
      probe: () => {
        const st = cornea.state, a = A_OF(BULGE.r0), q = corneaRadii(a, BULGE.phi0, st);
        return {
          bulgeAmp: +st.bulge.amp.toFixed(4), thin: +st.bulge.thin.toFixed(4),
          centralThickness: +centralThickness(st).toFixed(4), conePointThickness: +(q.ant - q.post).toFixed(4),
          riboflavinOpacity: +mats.riboflavin.opacity.toFixed(4), crosslinkOpacity: +mats.crosslinks.opacity.toFixed(4),
          uvVisible: uv.visible, mapVisible: tomo.visible, ghostVisible: ghost.visible, bandageVisible: bandage.visible, raysVisible: rays.object.visible
        };
      },
      dispose() { for (const m of own) m.dispose(); }
    };
    return model;
  }
};
export default def;
