// Intraocular lens implants (IOL) — /procedures/lens-implants/.
// What it teaches (from the lens-implants page): the natural lens and its capsule; the implant takes the natural lens's
// place inside the capsule during cataract surgery; lens designs look alike and differ in how they share focus.
// The cataract operation itself is shown in detail by the cataract simulator; here it is summarised in two stages.
import { EYE, lensAntZ, irisOnLensZ, corneaAntZ, corneaPostZ } from '../anatomy/geometry.js';
import { CAMERAS, ANCHOR, NOTE, COMMON_SIMPLIFICATIONS, standardEye, stage, span, mix } from './common.js';

const TYPES = [
  { id: 'monofocal', label: { ar: 'أحادية البؤرة', en: 'Monofocal' } },
  { id: 'edof', label: { ar: 'عمق تركيز ممتد', en: 'EDOF' } },
  { id: 'multifocal', label: { ar: 'متعددة البؤر', en: 'Multifocal / Trifocal' } },
  { id: 'toric', label: { ar: 'توريك', en: 'Toric' } }
];
const TYPE_TEXT = {
  monofocal: { ar: 'أحادية البؤرة: تركّز الضوء على مسافة واحدة، غالباً البعيدة، وتحتاج عادةً نظارة للقراءة.', en: 'Monofocal: focuses light at one distance, usually far; glasses are usually needed for reading.' },
  edof: { ar: 'عمق تركيز ممتد: توزّع التركيز على مدى أطول من البعيد إلى المتوسط. الحلقات الدقيقة على سطحها توضيحية.', en: 'EDOF: stretches focus over a longer range, from far to intermediate. The fine rings on its surface are illustrative.' },
  multifocal: { ar: 'متعددة البؤر أو ثلاثية البؤر: تقسم الضوء بين عدة مسافات، مع احتمال أعلى لهالات حول الأضواء ليلاً.', en: 'Multifocal / trifocal: splits light between several distances, with a higher chance of halos around lights at night.' },
  toric: { ar: 'توريك: تصحح الاستجماتيزم الناتج عن شكل القرنية؛ العلامات على طرفيها تساعد على ضبط محورها داخل العين.', en: 'Toric: corrects astigmatism from the shape of the cornea; the marks near its edge help align its axis in the eye.' }
};

const def = {
  id: 'iol', slug: 'lens-implants', modelId: 'ssim-iol', version: '2026.11-r1',
  title: { ar: 'العدسة المزروعة داخل العين: أين توضع وكيف تختلف أنواعها', en: 'Lens implants: where the lens sits and how the types differ' },
  note: NOTE,
  objectives: [
    { ar: 'التعرف على العدسة الطبيعية والمحفظة التي تحيط بها.', en: 'Recognise the natural lens and the capsule around it.' },
    { ar: 'فهم أن العدسة المزروعة توضع داخل المحفظة نفسها أثناء عملية الماء الأبيض.', en: 'Understand that the implant is placed inside that same capsule during cataract surgery.' },
    { ar: 'فهم أن أنواع العدسات متشابهة الشكل وتختلف في طريقة توزيع التركيز.', en: 'Understand that lens types look alike and differ in how they share focus.' }
  ],
  cameras: { full: CAMERAS.full, front: CAMERAS.front, anterior: CAMERAS.anterior, section: CAMERAS.section, anteriorSection: CAMERAS.anteriorSection, lens: CAMERAS.lens, optics: { pos: [42, 17, -3], target: [0, 0, -8.5], fit: [14, 10.5], label: { ar: 'مسار الضوء', en: 'Light path' } } },
  options: [{ id: 'type', label: { ar: 'نوع العدسة', en: 'Lens type' }, choices: TYPES, default: 'monofocal' }],
  toggles: [
    { id: 'compare', label: { ar: 'إظهار العدسة الطبيعية للمقارنة', en: 'Show the natural lens to compare' }, default: false },
    { id: 'capsule', label: { ar: 'المحفظة', en: 'Capsule' }, parts: ['capsule'] },
    { id: 'iris', label: { ar: 'القزحية', en: 'Iris' }, parts: ['iris'] }
  ],
  stages: () => [
    stage('natural', 6, 'section', { ar: 'العدسة الطبيعية', en: 'The natural lens' },
      { ar: 'تقع العدسة الطبيعية خلف القزحية والبؤبؤ، وتحيط بها محفظة رقيقة شفافة. تعمل مع القرنية على تركيز الضوء على الشبكية.', en: 'The natural lens sits behind the iris and pupil, wrapped in a thin clear capsule. Together with the cornea it focuses light onto the retina.' }, { section: true }),
    stage('cataract', 5, 'front', { ar: 'عندما تعتم العدسة', en: 'When the lens turns cloudy' },
      { ar: 'في الماء الأبيض تفقد العدسة صفاءها تدريجياً. العدسة المزروعة تأخذ مكانها عند إزالتها.', en: 'In a cataract the lens gradually loses its clarity. A lens implant takes its place when it is removed.' }, { section: false }),
    stage('removed', 7, 'anteriorSection', { ar: 'تُزال العدسة المعتمة وتبقى المحفظة', en: 'The cloudy lens is removed; its capsule stays' },
      { ar: 'خلال عملية الماء الأبيض تُفتح فتحة دائرية في مقدمة المحفظة وتُزال العدسة المعتمة، ويُترك كيس المحفظة في مكانه ليحمل العدسة الجديدة.', en: 'During cataract surgery a round opening is made in the front of the capsule and the cloudy lens is removed, leaving the capsular bag in place to hold the new lens.' }, { section: true }),
    stage('insert', 8, 'anteriorSection', { ar: 'العدسة المطوية تدخل المحفظة', en: 'The folded lens enters the capsule' },
      { ar: 'تُدخل العدسة الصناعية مطوية عبر فتحة صغيرة، ثم تنفرد داخل كيس المحفظة.', en: 'The artificial lens is passed in folded through a small opening, then unfolds inside the capsular bag.' }, { section: true }),
    stage('position', 6, 'lens', { ar: 'العدسة في مكانها', en: 'The lens in place' },
      { ar: 'يستقر الجزء البصري في المنتصف خلف البؤبؤ، وتثبّت الأذرع المرنة العدسة داخل المحفظة. العدسة دائمة ولا تحتاج عناية يومية.', en: 'The optic settles in the centre behind the pupil and the flexible arms hold the lens inside the capsule. The lens is permanent and needs no daily care.' }, { section: true }),
    stage('designs', 9, 'optics', { ar: 'كيف تختلف أنواع العدسات', en: 'How lens designs differ' },
      { ar: 'تتشابه العدسات في الشكل والمكان؛ يكمن الفرق في تصميم سطحها البصري وطريقة توزيعها للضوء. اختر نوعاً لترى الفكرة. لا توجد عدسة تناسب الجميع.', en: 'Lenses look alike and sit in the same place; the difference is in the design of the optic and how it shares light. Choose a type to see the idea. No single lens suits everyone.' }, { section: true })
  ],
  extra: ({ options, stage: st }) => (st.id === 'designs' || st.id === 'position' ? TYPE_TEXT[options.type] : null),
  sources: [
    ['American Academy of Ophthalmology — IOL implants', 'https://www.aao.org/eye-health/diseases/cataracts-iol-implants'],
    ['National Eye Institute — Cataract surgery', 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts/cataract-surgery'],
    ['NHS — Cataract surgery', 'https://www.nhs.uk/conditions/cataract-surgery/']
  ],
  simplifications: [
    ...COMMON_SIMPLIFICATIONS,
    { ar: 'إزالة العدسة المعتمة مختصرة هنا في مرحلة واحدة؛ تعرضها تجربة عملية الماء الأبيض بالتفصيل.', en: 'Removing the cloudy lens is summarised in one stage; the cataract simulator shows it in detail.' },
    { ar: 'مسارات الضوء رسم مبسط لفكرة توزيع التركيز، وليست محاكاة بصرية دقيقة.', en: 'Light paths are a simple drawing of how focus is shared, not an optical simulation.' },
    { ar: 'العدسة الممثلة عدسة عامة قطعة واحدة؛ تصاميم العدسات الفعلية متنوعة.', en: 'The implant shown is a generic one-piece lens; real designs vary.' },
    { ar: 'زاوية محور عدسة التوريك في النموذج توضيحية؛ يُحدَّد المحور الفعلي لكل عين من قياساتها.', en: 'The toric lens axis shown is illustrative; the real axis is set for each eye from its measurements.' }
  ],

  build({ THREE, lib, mats }) {
    const eye = standardEye({ THREE, lib, mats }, { capsule: true, posterior: true });
    const { root, parts } = eye;
    const iol = lib.buildIOL(mats);
    root.add(iol.object); parts.iol = iol.object;
    const injector = lib.buildInjector(mats);
    injector.object.position.set(6.2, 0, 1.05); injector.object.rotation.y = 0.2;
    root.add(injector.object); parts.injector = injector.object;
    // ghost of the natural lens for comparison
    const ghost = new THREE.Mesh(eye.lens.mesh.geometry, new THREE.MeshBasicMaterial({ color: 0xc58a3a, wireframe: true, transparent: true, opacity: 0.22, clippingPlanes: [mats.lens.clippingPlanes[0]] }));
    root.add(ghost); parts.ghost = ghost;
    // capsule opening (anterior capsulotomy edge)
    const rh = new THREE.Mesh(new THREE.TorusGeometry(EYE.rhexisR, 0.05, 6, 96), mats.capsuleCap);
    root.add(rh); parts.rhexis = rh;
    const rays = lib.buildRays(mats.rays, 7), raysH = lib.buildRays(mats.raysAlt, 7);
    root.add(rays.object, raysH.object); parts.rays = rays.object; parts.raysH = raysH.object;
    const cataract = new THREE.Color(0xc99a4a), clear = new THREE.Color(0xf6efdf);
    const ghostMat = ghost.material;

    const model = {
      root, parts,
      labels: [
        { id: 'cornea', part: 'cornea', at: ANCHOR.cornea, text: { ar: 'القرنية', en: 'Cornea' } },
        { id: 'iris', part: 'iris', at: ANCHOR.iris, text: { ar: 'القزحية', en: 'Iris' } },
        { id: 'lens', part: 'lens', at: ANCHOR.lens, text: { ar: 'العدسة الطبيعية', en: 'Natural lens' }, inner: true, when: (s) => s.index <= 2 },
        { id: 'capsule', part: 'capsule', at: [0, -EYE.lensEqR - 0.1, EYE.lensEqZ - 0.2], text: { ar: 'المحفظة', en: 'Capsule' }, inner: true, when: (s) => s.index >= 2 },
        { id: 'iol', part: 'iol', at: [0, EYE.iolOpticR * 0.6, EYE.iolCentreZ + 0.5], text: { ar: 'العدسة المزروعة', en: 'Lens implant' }, inner: true, when: (s) => s.index >= 4 },
        { id: 'macula', part: 'posterior', at: ANCHOR.macula, text: { ar: 'البقعة (مركز الإبصار)', en: 'Macula (centre of vision)' }, inner: true, when: (s) => s.index === 5 },
        { id: 'retina', part: 'posterior', at: ANCHOR.retina, text: { ar: 'الشبكية', en: 'Retina' }, inner: true, when: (s) => s.index === 0 }
      ],
      state: {},
      apply(s) {
        const i = s.index, p = s.p;
        // natural lens: clear → cloudy → removed
        const cloud = i === 0 ? 0 : i === 1 ? span(p, 0.1, 0.8) : 1;
        const gone = i < 2 ? 0 : i === 2 ? span(p, 0.35, 0.95) : 1;
        mats.lens.color.copy(clear).lerp(cataract, cloud);
        mats.lens.opacity = mix(0.32, 0.8, cloud) * (1 - gone);
        eye.lens.object.visible = gone < 0.999;
        eye.lens.object.scale.setScalar(1 - 0.25 * gone);
        eye.lens.object.position.z = EYE.lensEqZ * 0.25 * gone;
        // capsule opening and collapse around the implant
        rh.visible = i >= 2 && (i > 2 || p > 0.15);
        rh.position.z = lensAntZ(EYE.rhexisR) - (i >= 4 ? (lensAntZ(EYE.rhexisR) - EYE.lensEqZ - 0.35) * (i === 4 ? span(p, 0.1, 0.9) : 1) : 0);
        const collapse = i < 4 ? 0 : i === 4 ? span(p, 0.1, 0.9) : 1;
        eye.capsule.set(collapse);
        // pupil: normal → dilated for surgery → smaller afterwards
        const dil = i === 0 ? 0 : i === 1 ? span(p, 0.5, 1) : i <= 4 ? 1 : 1 - span(p, 0, 0.4);
        const pupil = mix(EYE.pupilNormal, EYE.pupilDilated, dil);
        const settle = i < 2 ? 0 : i === 2 ? gone : 1;
        const marginZ = mix(irisOnLensZ(pupil), EYE.irisPseudoZ, settle);
        eye.iris.set(pupil, marginZ);
        // implant: hidden → injected and unfolding → in the bag
        const ins = i < 3 ? -1 : i === 3 ? p : 1;
        iol.object.visible = ins >= 0.25;
        injector.object.visible = i === 3 && p < 0.85;
        injector.object.position.x = 6.2 + 6 * (1 - span(p, 0, 0.25)) + 6 * span(p, 0.7, 0.85);
        const u = span(ins, 0.25, 0.85);
        iol.object.position.set(mix(3.6, 0, u), 0, mix(0.4, EYE.iolCentreZ, u));
        iol.object.scale.set(1, mix(0.18, 1, span(ins, 0.4, 1)), 1);
        iol.haptics.rotation.z = mix(0.9, 0, span(ins, 0.5, 1));
        iol.setDesign(s.options.type);
        // toric lenses are aligned to an axis (illustrative 30° here)
        iol.object.rotation.z = s.options.type === 'toric' && i >= 4 ? (30 * Math.PI) / 180 : 0;
        // optional ghost of the natural lens, from the moment it is gone
        ghost.visible = !!s.toggles.compare && i >= 2;
        ghostMat.opacity = 0.22;
        // light paths in the last stage
        const showRays = i === 5;
        rays.object.visible = raysH.object.visible = showRays;
        if (showRays) {
          const k = span(p, 0, 0.35);
          const focusZ = EYE.focusZ + 0.05;
          const paths = [], pathsH = [];
          for (let j = 0; j < 7; j++) {
            const y = -1.6 + (3.2 * j) / 6;
            const start = [0, y, 16], c = [0, y, corneaAntZ(Math.abs(y))], l = [0, y * 0.88, EYE.iolCentreZ];
            let fz = focusZ;
            if (s.options.type === 'edof') fz = focusZ + 1.4 * (Math.abs(y) / 1.6);
            if (s.options.type === 'multifocal') fz = focusZ + [0, 1.1, 2.2][j % 3];
            const end = [0, 0, mix(l[2], fz, k)];
            paths.push([start, c, l, end]);
            if (s.options.type === 'toric') pathsH.push([[y, 0, 16], [y, 0, corneaAntZ(Math.abs(y))], [y * 0.88, 0, EYE.iolCentreZ], [0, 0, mix(l[2], focusZ, k)]]);
          }
          rays.set(paths); raysH.set(pathsH);
          raysH.object.visible = s.options.type === 'toric';
        }
        model.state = { cloud, gone, collapse, pupil, ins, type: s.options.type, rays: showRays };
      },
      probe: () => ({ ...model.state, iolZ: iol.object.position.z, iolVisible: iol.object.visible, lensVisible: eye.lens.object.visible, corneaPostZ0: corneaPostZ(0) })
    };
    return model;
  }
};
export default def;
