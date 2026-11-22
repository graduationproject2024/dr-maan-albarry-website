// Implantable collamer lens (ICL, phakic IOL) — /procedures/icl/.
// What it teaches (from the icl page): a thin flexible lens placed in the narrow space just behind the iris and in front
// of the natural lens, which stays in place; the front-chamber depth and corneal lining are measured first; under local
// anaesthetic the folded lens goes in through a small opening, unfolds and is positioned behind the iris; eye pressure
// is checked afterwards and the second eye is usually treated on another day.
//
// The plate is built here rather than with lib.buildICL: its arch is shaped so that, in this model's anatomy, the plate
// passes under the iris all the way to the sulcus (footplates on the ciliary body behind the iris root) and the iris can
// rest on it without the two surfaces crossing. The central height above the natural lens still follows ICL.apexZ.
import { EYE, ICL, iclHalfWidth, lensAntZ, irisBackAt, irisOnLensZ, corneaPostZ, corneaAntZ } from '../anatomy/geometry.js';
import { CAMERAS, ANCHOR, NOTE, COMMON_SIMPLIFICATIONS, standardEye, stage, span, mix } from './common.js';

// ---------------- Plate shape (pure maths, checked in Node) ----------------
const HALF_L = 5.5;       // half-length: footplate tips reach the sulcus nook between the iris root and the ciliary body
const FOOT_Z = -0.3;      // footplate height in the sulcus
const ARCH = 2;           // how quickly the plate drops from the centre towards the sulcus
const CURVE_Y = 1;        // across its width the plate follows the curve of the natural lens
const HALF_T = 0.05;      // half the plate thickness
const OPTIC_BULGE = 0.08; // front bulge of the central optic
const lensSag = (r) => EYE.lensAntApexZ - lensAntZ(Math.min(r, EYE.lensEqR - 0.01));
/** Mid-surface height of the placed lens at (x, y); x is its long axis (horizontal, temporal → nasal). */
export const plateMid = (x, y) => {
  const u = Math.min(1, Math.abs(x) / HALF_L);
  return FOOT_Z + (ICL.apexZ - FOOT_Z) * Math.pow(1 - u * u, ARCH) - CURVE_Y * lensSag(Math.abs(y));
};
const opticAt = (r) => (r < ICL.opticR ? OPTIC_BULGE * (1 - (r / ICL.opticR) ** 2) : 0);
export const plateTop = (x, y) => plateMid(x, y) + HALF_T + opticAt(Math.hypot(x, y));
export const plateBack = (x, y) => plateMid(x, y) - HALF_T;
/** Half-width of the outline at x (the published lens outline, scaled to this half-length). */
export const plateHalfW = (x) => iclHalfWidth((x * (ICL.length / 2)) / HALF_L);

// Highest point of the placed plate at each radius (any direction): what the iris must clear.
const DR = 0.05;
const TOP_MAX = (() => {
  const t = new Float64Array(Math.ceil(6.5 / DR) + 1).fill(-Infinity);
  for (let x = -HALF_L; x <= HALF_L + 1e-9; x += 0.04) {
    const h = plateHalfW(x);
    for (let k = 0; k <= 16; k++) {
      const y = -h + (2 * h * k) / 16, i = Math.round(Math.hypot(x, y) / DR);
      if (i < t.length) t[i] = Math.max(t[i], plateTop(x, y));
    }
  }
  return t;
})();
export const topMaxAt = (r) => TOP_MAX[Math.min(TOP_MAX.length - 1, Math.round(r / DR))];
const IRIS_GAP = 0.05;
/** Lowest pupil-margin height for which the whole iris lies on top of the placed plate (bisection, pure). */
export function irisOnIclZ(pupilR) {
  let lo = -1, hi = 3;
  for (let it = 0; it < 32; it++) {
    const zm = (lo + hi) / 2;
    let ok = true;
    for (let i = 0; i < TOP_MAX.length && ok; i++) {
      const r = i * DR;
      if (r < pupilR - 1e-6 || r > EYE.irisRootR || TOP_MAX[i] === -Infinity) continue;
      if (irisBackAt(r, pupilR, zm) < TOP_MAX[i] + IRIS_GAP) ok = false;
    }
    if (ok) hi = zm; else lo = zm;
  }
  return Math.max(hi, irisOnLensZ(pupilR));
}
// Iris front surface (same formula as geometry.js, which keeps it private) — used for the section highlights.
const irisThick = (s) => 0.1 + 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.08)), 0.75) + 0.04 * s;
export const irisFrontAt = (r, pupilR, marginZ) => {
  const s = Math.min(1, Math.max(0, (r - pupilR) / (EYE.irisRootR - pupilR)));
  return irisBackAt(r, pupilR, marginZ) + irisThick(s);
};

// Unfolded in the front chamber (before it is tucked behind the iris): partly opened along its length, lifted forward.
export const AC_POSE = { sx: 0.72, dz: 1.05 };
// Folded, just out of the cartridge: short, narrow and flattened, near the opening.
export const FOLDED_POSE = { sx: 0.3, sy: 0.12, sz: 0.3, px: 2.8, dz: 1.1 };
const PUPIL_WIDE = EYE.pupilDilated, PUPIL = EYE.pupilNormal;

const def = {
  id: 'icl', slug: 'icl', modelId: 'ssim-icl', version: '2026.11-r1',
  title: { ar: 'العدسة اللاصقة الداخلية (ICL): عدسة إضافية خلف القزحية', en: 'Implantable contact lens (ICL): an added lens behind the iris' },
  note: NOTE,
  objectives: [
    { ar: 'التعرف على المسافة الضيقة بين القزحية والعدسة الطبيعية، حيث توضع العدسة الداخلية.', en: 'Find the narrow space between the iris and the natural lens, where the implantable lens sits.' },
    { ar: 'فهم أن العدسة تدخل مطويةً عبر فتحة صغيرة، ثم تنفتح وتُثبَّت خلف القزحية.', en: 'Understand that the lens goes in folded through a small opening, then unfolds and is positioned behind the iris.' },
    { ar: 'فهم أن العدسة الطبيعية تبقى في مكانها، على خلاف عملية الماء الأبيض.', en: 'Understand that the natural lens stays in place, unlike in cataract surgery.' }
  ],
  cameras: {
    full: CAMERAS.full,
    front: CAMERAS.front,
    anteriorSection: CAMERAS.anteriorSection,
    section: CAMERAS.section,
    anterior: { pos: CAMERAS.anterior.pos, target: CAMERAS.anterior.target },
    closeSection: { pos: [18.5, 2, 3.2], target: [0, 0, 0] },
    vault: { pos: [15.5, 1.6, 2.6], target: [0, 0.3, 0.2] }
  },
  toggles: [
    { id: 'icl', label: { ar: 'العدسة الداخلية (ICL)', en: 'Implantable lens (ICL)' }, parts: ['icl'] },
    { id: 'naturalLens', label: { ar: 'العدسة الطبيعية', en: 'Natural lens' }, parts: ['lens'] },
    { id: 'iris', label: { ar: 'القزحية', en: 'Iris' }, parts: ['iris'] }
  ],
  stages: () => [
    stage('space', 7, 'closeSection', { ar: 'المسافة الضيقة خلف القزحية', en: 'The narrow space behind the iris' },
      { ar: 'توضع العدسة الداخلية عادةً خلف القزحية مباشرة وأمام العدسة الطبيعية، في المسافة الضيقة بينهما (المظلّلة). العدسة الطبيعية تبقى في مكانها.', en: 'The implantable lens usually sits just behind the iris and in front of the natural lens, in the narrow space between them (shaded). The natural lens stays in place.' }, { section: true }),
    stage('assessment', 7, 'anteriorSection', { ar: 'الفحص والقياسات قبل الإجراء', en: 'Assessment before the operation' },
      { ar: 'يبدأ الأمر بفحص شامل يشمل قياس عمق الحجرة الأمامية بين القرنية والقزحية، وفحص بطانة القرنية، لاختيار مقاس العدسة وقوتها.', en: 'It starts with a full assessment, including the depth of the front chamber between the cornea and the iris and the corneal lining (endothelium), to choose the lens size and power.' }, { section: true }),
    stage('anaesthetic', 5, 'front', { ar: 'تخدير موضعي', en: 'Local anaesthetic' },
      { ar: 'تُخدَّر العين تخديراً موضعياً. في هذا النموذج يُرسم البؤبؤ أوسع لتظهر الخطوات التالية بوضوح.', en: 'The eye is numbed with a local anaesthetic. In this model the pupil is drawn wider so the next steps can be seen.' }, { section: false }),
    stage('insert', 8, 'anterior', { ar: 'العدسة تدخل مطويةً ثم تنفتح', en: 'The folded lens goes in and unfolds' },
      { ar: 'عبر فتحة صغيرة عند حافة القرنية تُدخَل العدسة وهي مطوية، ثم تنفتح برفق داخل العين أمام القزحية.', en: 'Through a small opening at the edge of the cornea the lens is inserted folded, then gently unfolds inside the eye, in front of the iris.' }, { section: false }),
    stage('position', 8, 'closeSection', { ar: 'تثبيت العدسة خلف القزحية', en: 'Positioned behind the iris' },
      { ar: 'تُثبَّت العدسة بعد ذلك خلف القزحية: يستقر طرفاها تحت القزحية، ويبقى جزؤها البصري أمام العدسة الطبيعية مع مسافة صغيرة بينهما.', en: 'The lens is then positioned behind the iris: its ends rest under the iris, and its optic sits in front of the natural lens with a small space between them.' }, { section: true }),
    stage('result', 7, 'vault', { ar: 'العدسة الطبيعية تبقى', en: 'The natural lens stays' },
      { ar: 'تبقى العدسة الطبيعية في مكانها وتحتفظ بقدرتها على التركيز. بين العدستين مسافة صغيرة (مظلّلة) تُسمّى أحياناً «القبة».', en: 'The natural lens stays in place and keeps its focusing. A small clearance (shaded), sometimes called the vault, is left between the two lenses.' }, { section: true }),
    stage('after', 6, 'full', { ar: 'بعد الإجراء', en: 'After the operation' },
      { ar: 'يُقاس ضغط العين في الساعات والأيام التالية. وتُعالَج العين الأخرى عادةً في موعد لاحق.', en: 'Eye pressure is checked in the following hours and days. The second eye is usually treated on another day.' }, { section: false })
  ],
  sources: [
    ['AAO EyeSmart — Phakic IOL', 'https://www.aao.org/eye-health/treatments/phakic-iol'],
    ['NHS — Laser eye surgery and lens surgery', 'https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/'],
    ['AAO EyeSmart — Parts of the eye', 'https://www.aao.org/eye-health/anatomy/parts-of-eye']
  ],
  simplifications: [
    ...COMMON_SIMPLIFICATIONS,
    { ar: 'العدسة الداخلية المعروضة عدسة عامة؛ مقاسها وشكلها والمسافة بينها وبين العدسة الطبيعية قيم توضيحية.', en: 'The implantable lens shown is generic; its size, shape and the clearance above the natural lens are illustrative.' },
    { ar: 'يُرسم البؤبؤ أوسع أثناء الإجراء لتظهر الخطوات بوضوح.', en: 'The pupil is drawn wider during the operation so the steps can be seen.' },
    { ar: 'العدسة مرسومة أفقياً، فيمرّ المقطع عبر عرضها؛ يظهر طرفاها تحت القزحية في العرض المجسّم عند إخفاء القزحية.', en: 'The lens is drawn lying horizontally, so the section cuts across its width; its ends under the iris show in the 3D view when the iris is hidden.' },
    { ar: 'إدخال الطرفين خلف القزحية مرسوم كحركة واحدة سلسة.', en: 'Tucking the ends behind the iris is drawn as one smooth movement.' }
  ],

  build({ THREE, lib, mats }) {
    const eye = standardEye({ THREE, lib, mats }, { capsule: false, posterior: false });
    const { root, parts } = eye;
    const clip = [mats.lens.clippingPlanes[0]];
    const own = []; // materials created here (geometries are disposed with the scene)

    // ---- the implantable lens ----
    const icl = new THREE.Group(); icl.name = 'icl';
    const nx = 72, ny = 14;
    const surface = (fn, flip) => {
      const pos = [], idx = [];
      for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
        const x = -HALF_L + (2 * HALF_L * i) / nx, h = Math.max(0.02, plateHalfW(x)), y = -h + (2 * h * j) / ny;
        pos.push(x, y, fn(x, y));
      }
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const a = i * (ny + 1) + j, b = a + 1, c = a + ny + 1, d = c + 1;
        if (flip) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, mats.icl); m.renderOrder = 17;
      return m;
    };
    icl.add(surface(plateTop, false), surface(plateBack, true));
    const rim = [];
    for (let k = 0; k < 200; k++) {
      const t = (k / 200) * Math.PI * 2, x = HALF_L * 0.998 * Math.cos(t);
      const y = Math.sign(Math.sin(t)) * plateHalfW(x) * Math.min(1, Math.abs(Math.sin(t)) * 6);
      rim.push(new THREE.Vector3(x, y, plateMid(x, y)));
    }
    icl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim, true), 220, 0.055, 6, true), mats.iclRim));
    const ring = [];
    for (let k = 0; k < 96; k++) { const t = (k / 96) * Math.PI * 2, x = ICL.opticR * Math.cos(t), y = ICL.opticR * Math.sin(t); ring.push(new THREE.Vector3(x, y, plateTop(x, y) + 0.01)); }
    icl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ring, true), 96, 0.03, 5, true), mats.iclRim));
    // cut face of the plate (x = 0), shown only in the section once the lens is in place
    const cutMat = new THREE.MeshBasicMaterial({ color: 0x7656c4, side: THREE.DoubleSide }); own.push(cutMat);
    const band = (lower, upper, n, yMax, x = 0.012) => {
      const pos = [], idx = [];
      for (let k = 0; k <= n; k++) { const y = -yMax + (2 * yMax * k) / n; pos.push(x, y, lower(y), x, y, upper(y)); }
      for (let k = 0; k < n; k++) { const a = k * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
      return g;
    };
    const hw0 = plateHalfW(0);
    const iclCut = new THREE.Mesh(band((y) => plateBack(0, y) - 0.03, (y) => plateTop(0, y) + 0.03, 48, hw0 * 0.995), cutMat);
    iclCut.renderOrder = 32;
    icl.add(iclCut);
    root.add(icl); parts.icl = icl;

    // ---- insertion: injector cartridge with the folded lens, small opening at the temporal edge of the cornea ----
    const injector = lib.buildInjector(mats);
    injector.object.position.set(6.2, 0, 1.05); injector.object.rotation.y = 0.2;
    const rollMat = new THREE.MeshStandardMaterial({ color: 0xb7a3e0, roughness: 0.3, transparent: true, opacity: 0.9 }); own.push(rollMat);
    injector.roll.material = rollMat;
    root.add(injector.object); parts.injector = injector.object;
    const slitMat = new THREE.MeshBasicMaterial({ color: 0x5b4a3a, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide }); own.push(slitMat);
    const slit = new THREE.Mesh(new THREE.CircleGeometry(1, 24), slitMat);
    const aSlit = Math.asin((EYE.corneaRadius - 0.25) / EYE.corneaRc);
    slit.position.set(EYE.corneaRc * Math.sin(aSlit) + 0.01, 0, corneaAntZ(EYE.corneaRadius - 0.25) + 0.01);
    slit.lookAt(slit.position.x * 2, 0, EYE.corneaCz + (slit.position.z - EYE.corneaCz) * 2);
    slit.scale.set(0.09, 1.1, 1);
    slit.renderOrder = 35;
    root.add(slit); parts.opening = slit;

    // ---- section highlights (flat bands just in front of the cut face) ----
    const shade = (color) => { const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }); own.push(m); return m; };
    // the narrow space between the iris (resting on the lens) and the natural lens
    const spaceMat = shade(0x8a6fd1);
    const spaceTop = (y) => {
      const r = Math.abs(y), low = lensAntZ(Math.min(r, EYE.lensEqR - 0.01));
      return r < PUPIL ? low + 0.5 : Math.max(low + 0.05, Math.min(low + 0.5, irisBackAt(r, PUPIL, irisOnLensZ(PUPIL)) - 0.02));
    };
    const space = new THREE.Mesh(band((y) => lensAntZ(Math.min(Math.abs(y), EYE.lensEqR - 0.01)) + 0.02, spaceTop, 96, 4.4, 0.02), spaceMat);
    space.renderOrder = 33;
    // the front chamber, between the back of the cornea and the iris / lens
    const chamberMat = shade(0x5aa7d6);
    const chamberLow = (y) => { const r = Math.abs(y); return r < PUPIL ? lensAntZ(r) + 0.02 : irisFrontAt(r, PUPIL, irisOnLensZ(PUPIL)) + 0.02; };
    const chamber = new THREE.Mesh(band(chamberLow, (y) => corneaPostZ(Math.abs(y)) - 0.02, 96, 5.3, 0.02), chamberMat);
    chamber.renderOrder = 33;
    // the clearance (vault) between the placed lens and the natural lens
    const vaultMat = shade(0xe0a23a);
    const vault = new THREE.Mesh(band((y) => lensAntZ(Math.abs(y)) + 0.02, (y) => plateBack(0, y) - 0.04, 64, hw0 * 0.97, 0.02), vaultMat);
    vault.renderOrder = 33;
    // front-chamber depth marker on the axis (no value is shown)
    const markMat = new THREE.MeshBasicMaterial({ color: 0x1f5f8a, transparent: true, opacity: 0 }); own.push(markMat);
    const depth = new THREE.Group();
    const z0 = EYE.lensAntApexZ + 0.06, z1 = corneaPostZ(0) - 0.06;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, z1 - z0 - 0.36, 8), markMat);
    shaft.rotation.x = Math.PI / 2; shaft.position.set(0.05, 0, (z0 + z1) / 2);
    const head = (z, dir) => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 12), markMat); c.rotation.x = dir * Math.PI / 2; c.position.set(0.05, 0, z); return c; };
    depth.add(shaft, head(z1 - 0.1, 1), head(z0 + 0.1, -1));
    root.add(space, chamber, vault, depth);
    parts.space = space; parts.chamber = chamber; parts.vault = vault; parts.depth = depth;

    const clear = new THREE.Color(0xf6efdf);
    const vaultMid = (EYE.lensAntApexZ + plateBack(0, 0)) / 2;

    const model = {
      root, parts,
      labels: [
        { id: 'cornea', part: 'cornea', at: ANCHOR.cornea, text: { ar: 'القرنية', en: 'Cornea' } },
        { id: 'chamber', at: [0, 1.6, 2.15], text: { ar: 'الحجرة الأمامية', en: 'Anterior chamber' }, inner: true, when: (s) => s.index <= 1 || s.index === 4 },
        { id: 'endothelium', part: 'cornea', at: [0, 3.2, corneaPostZ(3.2) + 0.03], text: { ar: 'بطانة القرنية', en: 'Corneal lining' }, inner: true, when: (s) => s.index === 1 },
        { id: 'iris', part: 'iris', at: ANCHOR.iris, text: { ar: 'القزحية', en: 'Iris' } },
        { id: 'space', at: [0, -2.2, lensAntZ(2.2) + 0.25], text: { ar: 'المسافة بين القزحية والعدسة', en: 'Space between iris and lens' }, inner: true, when: (s) => s.index === 0 },
        { id: 'icl', part: 'icl', at: [0, 1.0, plateTop(0, 1.0) + 0.05], text: { ar: 'العدسة الداخلية (ICL)', en: 'ICL' }, when: (s) => s.index >= 4 },
        { id: 'lens', part: 'lens', at: ANCHOR.lens, text: { ar: 'العدسة الطبيعية', en: 'Natural lens' }, inner: true },
        { id: 'vault', at: [0, -0.9, vaultMid], text: { ar: 'المسافة الصغيرة (القبة)', en: 'Clearance (vault)' }, inner: true, when: (s) => s.index === 5 }
      ],
      state: {},
      apply(s) {
        const i = s.index, p = s.p;
        // natural lens: always clear and in place
        mats.lens.color.copy(clear);
        mats.lens.opacity = 0.32;
        eye.lens.object.visible = true;
        eye.lens.object.scale.setScalar(1);
        eye.lens.object.position.set(0, 0, 0);

        // pupil: normal → drawn wider for the operation → normal again once the lens is in place
        const wide = i < 2 ? 0 : i === 2 ? span(p, 0.35, 0.95) : i <= 4 ? 1 : i === 5 ? 1 - span(p, 0.05, 0.6) : 0;
        const pupil = mix(PUPIL, PUPIL_WIDE, wide);

        // the implant: hidden → folded in the cartridge → unfolding in front of the iris → tucked behind the iris
        let sx = 1, sy = 1, sz = 1, px = 0, dz = 0, iclOn = i >= 4, roll = -1;
        if (i === 3) {
          const F = FOLDED_POSE;
          roll = span(p, 0.2, 0.5);
          const u = span(p, 0.5, 0.95);
          iclOn = p >= 0.47;
          sx = mix(F.sx, AC_POSE.sx, u); sy = mix(F.sy, 1, u); sz = mix(F.sz, 1, u); px = mix(F.px, 0, u); dz = mix(F.dz, AC_POSE.dz, u);
        } else if (i === 4) {
          const t = span(p, 0.1, 0.85);
          sx = mix(AC_POSE.sx, 1, t); dz = mix(AC_POSE.dz, 0, t);
        }
        const placed = i > 4 || (i === 4 && p >= 0.85);
        icl.visible = iclOn;
        icl.position.set(px, 0, dz);
        icl.scale.set(sx, sy, sz);
        iclCut.visible = placed && s.section;

        injector.object.visible = i === 3 && p < 0.92;
        injector.object.position.x = 6.2 + 6 * (1 - span(p, 0, 0.2)) + 6 * span(p, 0.75, 0.92);
        injector.roll.visible = i === 3 && p < 0.5;
        injector.roll.position.x = mix(1.6, -1.0, Math.max(0, roll));
        slit.visible = i === 3 || (i === 4 && !s.section);
        slitMat.opacity = 0.7;

        // iris: rests on the natural lens until the implant is under it, then rests on the implant
        const onLens = irisOnLensZ(pupil);
        const tuck = i < 4 ? 0 : i === 4 ? span(p, 0.35, 0.9) : 1;
        const marginZ = mix(onLens, irisOnIclZ(pupil), tuck);
        eye.iris.set(pupil, marginZ);

        // section highlights
        space.visible = s.section && i === 0;
        spaceMat.opacity = 0.45 * span(p, 0.1, 0.45);
        chamber.visible = s.section && i === 1;
        chamberMat.opacity = 0.32 * span(p, 0.05, 0.35);
        depth.visible = i === 1;
        markMat.opacity = span(p, 0.3, 0.6);
        vault.visible = s.section && i === 5;
        vaultMat.opacity = 0.6 * span(p, 0.15, 0.55);

        model.state = { stage: s.stage.id, pupil, marginZ, sx, sy, sz, dz, px, placed, iclVisible: icl.visible };
      },
      probe() {
        const st = model.state;
        const iclApexZ = plateMid(0, 0) * st.sz + st.dz;
        const marginTop = st.placed ? topMaxAt(st.pupil) : null;
        return {
          ...st,
          iclApexZ, lensApexZ: EYE.lensAntApexZ,
          vault: plateBack(0, 0) * st.sz + st.dz - EYE.lensAntApexZ,
          iclMidAtMargin: st.placed ? plateMid(st.pupil, 0) : null,
          iclTopAtMargin: marginTop,
          irisAboveIcl: st.placed ? st.marginZ >= marginTop : null,
          lensVisible: eye.lens.object.visible && mats.lens.opacity > 0.2,
          lensOpacity: mats.lens.opacity
        };
      },
      dispose() { for (const m of own) m.dispose(); }
    };
    return model;
  }
};
export default def;
