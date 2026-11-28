// Laser vision correction — /procedures/laser-vision-correction/.
// What it teaches (from the laser-vision-correction page): the cornea and its layers (epithelium, stroma), and how
// the three methods described on the page change its front curve: LASIK (a thin flap is lifted, the layer beneath is
// reshaped and the flap laid back), PRK / surface laser (the outer layer is removed and the surface reshaped, no flap)
// and SMILE (a thin piece of tissue shaped inside the cornea is removed through a small opening, no flap).
// Every depth and thickness here is illustrative and exaggerated so the change can be seen; no laser settings are shown.
import { EYE, corneaDefaults, corneaRadii, corneaPoint, centralThickness, ablationAt, LAYERS } from '../anatomy/geometry.js';
import { CAMERAS, NOTE, COMMON_SIMPLIFICATIONS, standardEye, stage, span, mix } from './common.js';

const HALF_PI = Math.PI / 2;
const RC = EYE.corneaRc;
const aAt = (r) => Math.asin(Math.min(0.9999, Math.abs(r) / RC));
const rOf = (a) => RC * Math.sin(a);

// Illustrative model sizes (mm) — exaggerated for visibility, never shown to the visitor as values.
const ABL = { depth: 0.15, zone: 3.0 };   // myopic correction: central tissue removed
const FLAP = { r: 4.3, t: 0.11, lift: 1.9 }; // LASIK flap radius, thickness, lifted angle (rad)
const GUTTER = 0.09;                       // visible flap edge once the side cut is made
const EPI_R = 4.0;                         // PRK: radius of the removed surface layer
const CAP = 0.12;                          // SMILE: tissue above the lenticule
const LENT_R = ABL.zone * 0.98;
const OPEN = { rIn: ABL.zone + 0.15, rOut: ABL.zone + 0.75, half: 0.24 }; // SMILE small opening (superior)

const ANAT = { ar: 'القرنية وطبقاتها', en: 'The cornea and its layers' };
const ANAT_TEXT = {
  ar: 'القرنية هي السطح الأمامي الشفاف للعين، وتقوم بالجزء الأكبر من تركيز الضوء. الظهارة طبقتها السطحية، وتحتها اللحمة (السدى)، الطبقة الوسطى التي يعيد الليزر تشكيلها. سماكة القرنية عامل أساسي في اختيار الطريقة.',
  en: 'The cornea is the clear front surface of the eye and does most of its focusing. The epithelium is its outer surface layer; beneath it the stroma is the middle layer the laser reshapes. Corneal thickness is a key factor in choosing the method.'
};
const RESULT_LINE = { ar: 'الخط المتقطع يبيّن الانحناء الأصلي.', en: 'The dashed line shows the original curve.' };

const TYPE_TEXT = {
  lasik: { ar: 'الفيمتوليزيك: يصنع ليزر الفيمتو ثانية شريحة رقيقة من القرنية تُرفع، ثم يُعاد تشكيل الطبقة تحتها وتُعاد الشريحة إلى مكانها. التعافي البصري سريع عادةً. تُختار الطريقة المناسبة بعد الفحص والتصوير، لا قبله.', en: 'Femto-LASIK: a femtosecond laser makes a thin flap, which is lifted; the layer beneath is reshaped and the flap is laid back. Visual recovery is usually quick. The method that suits an eye is chosen after examination and imaging, not before.' },
  prk: { ar: 'الليزر السطحي (PRK): يُعاد تشكيل سطح القرنية بعد إزالة الطبقة الخارجية دون شريحة. التعافي أبطأ وأكثر انزعاجاً في الأيام الأولى، وقد يناسب القرنيات الأرق. تُختار الطريقة المناسبة بعد الفحص والتصوير، لا قبله.', en: 'PRK (surface laser): the surface is reshaped after the outer layer is removed, with no flap. Recovery is slower and more uncomfortable at first; it may suit thinner corneas. The method that suits an eye is chosen after examination and imaging, not before.' },
  smile: { ar: 'سمايل (SMILE): يُصنع بالليزر جزء رقيق داخل القرنية ويُستخرج عبر فتحة صغيرة دون شريحة. مناسب لبعض حالات قصر النظر والاستجماتيزم. تُختار الطريقة المناسبة بعد الفحص والتصوير، لا قبله.', en: 'SMILE: a laser shapes a thin piece of tissue inside the cornea, removed through a small opening with no flap. It suits some short-sight and astigmatism prescriptions. The method that suits an eye is chosen after examination and imaging, not before.' }
};

const CAMS = {
  closeup: { pos: [7.3, 2.15, 4.6], target: [0, 2.3, 2.85], fit: [1.6, 3.0], label: { ar: 'القرنية عن قرب (مقطع)', en: 'Cornea close-up (section)' } },
  anterior: CAMERAS.anterior,
  full: CAMERAS.full,
  lifted: { pos: [16.5, 5.2, 8.0], target: [0, 3.4, 6.2], fit: [5.8, 4.4] },
  wide: { pos: [8.7, 3.1, 5.1], target: [0, 2.6, 3.4], fit: [2.6, 3.4] }
};

const anatomy = () => stage('anatomy', 7, 'closeup', ANAT, ANAT_TEXT, { section: true });

const STAGES = {
  lasik: () => [
    anatomy(),
    stage('flap', 7, 'closeup', { ar: 'صنع شريحة رقيقة', en: 'A thin flap is made' },
      { ar: 'في الفيمتوليزيك يصنع ليزر الفيمتو ثانية شريحة رقيقة في الجزء الأمامي من القرنية. الخط الملوّن يبيّن مكان انفصالها عن الطبقة التي تحتها.', en: 'In Femto-LASIK a femtosecond laser makes a thin flap in the front of the cornea. The coloured line shows where it separates from the layer beneath.' }, { section: true }),
    stage('lift', 6, 'lifted', { ar: 'رفع الشريحة', en: 'The flap is lifted' },
      { ar: 'تُرفع الشريحة وتُطوى على مفصلها، فتنكشف الطبقة التي تحتها.', en: 'The flap is lifted and folded back on its hinge, uncovering the layer beneath.' }, { section: true }),
    stage('reshape', 8, 'closeup', { ar: 'إعادة تشكيل الطبقة تحت الشريحة', en: 'The layer beneath is reshaped' },
      { ar: 'يعيد الليزر تشكيل اللحمة المكشوفة بإزالة طبقة رقيقة جداً من نسيجها. العمق مكبّر هنا ليظهر التغيير.', en: 'The laser reshapes the exposed stroma by removing a very thin layer of tissue. The depth is exaggerated here so the change can be seen.' }, { section: true }),
    stage('replace', 6, 'lifted', { ar: 'إعادة الشريحة إلى مكانها', en: 'The flap is laid back' },
      { ar: 'تُعاد الشريحة إلى مكانها فوق السطح الذي أُعيد تشكيله.', en: 'The flap is laid back in place over the reshaped surface.' }, { section: true }),
    stage('result', 7, 'closeup', { ar: 'سطح أمامي أكثر تسطحاً', en: 'A flatter front surface' },
      { ar: `في تصحيح قصر النظر يصبح وسط السطح الأمامي أكثر تسطحاً، فيتركّز الضوء على الشبكية بصورة أدق. التعافي البصري سريع عادةً. ${RESULT_LINE.ar}`, en: `For short sight the centre of the front surface ends up flatter, so light focuses more precisely on the retina. Visual recovery is usually quick. ${RESULT_LINE.en}` }, { section: true })
  ],
  prk: () => [
    anatomy(),
    stage('epithelium', 6, 'closeup', { ar: 'إزالة الطبقة السطحية', en: 'The surface layer is removed' },
      { ar: 'في الليزر السطحي لا توجد شريحة: تُزال الطبقة الخارجية الرقيقة (الظهارة) من وسط القرنية.', en: 'In PRK (surface laser) there is no flap: the thin outer layer, the epithelium, is removed from the centre of the cornea.' }, { section: true }),
    stage('reshape', 8, 'closeup', { ar: 'إعادة تشكيل السطح', en: 'The surface is reshaped' },
      { ar: 'يعيد الليزر تشكيل سطح القرنية مباشرةً بإزالة طبقة رقيقة جداً من النسيج. العمق مكبّر هنا ليظهر التغيير.', en: 'The laser reshapes the surface of the cornea directly, removing a very thin layer of tissue. The depth is exaggerated here so the change can be seen.' }, { section: true }),
    stage('bandage', 6, 'closeup', { ar: 'عدسة لاصقة واقية', en: 'A protective contact lens' },
      { ar: 'توضع عدسة لاصقة شفافة واقية فوق القرنية أثناء التئام السطح.', en: 'A clear protective (bandage) contact lens is placed over the cornea while the surface heals.' }, { section: true }),
    stage('regrow', 8, 'closeup', { ar: 'نمو الطبقة السطحية من جديد', en: 'The surface layer grows back' },
      { ar: 'خلال الأيام التالية تنمو الظهارة من جديد فوق السطح الذي أُعيد تشكيله. التعافي أبطأ وأكثر انزعاجاً في الأيام الأولى.', en: 'Over the following days the epithelium grows back over the reshaped surface. Recovery is slower and more uncomfortable at first.' }, { section: true }),
    stage('result', 6, 'closeup', { ar: 'سطح أمامي أكثر تسطحاً', en: 'A flatter front surface' },
      { ar: `بعد التئام السطح وإزالة العدسة الواقية يصبح وسط السطح الأمامي أكثر تسطحاً في تصحيح قصر النظر، دون شريحة. قد تناسب هذه الطريقة القرنيات الأرق. ${RESULT_LINE.ar}`, en: `Once the surface has healed and the protective lens is removed, the centre of the front surface is flatter for short sight, with no flap. This method may suit thinner corneas. ${RESULT_LINE.en}` }, { section: true })
  ],
  smile: () => [
    anatomy(),
    stage('lenticule', 8, 'closeup', { ar: 'تشكيل جزء رقيق داخل القرنية', en: 'A thin piece is shaped inside the cornea' },
      { ar: 'في سمايل يشكّل الليزر داخل القرنية جزءاً رقيقاً من النسيج على هيئة عدسة صغيرة، مع فتحة صغيرة عند طرفه. لا يُرفع سطح القرنية.', en: 'In SMILE a laser shapes a thin, lens-shaped piece of tissue (a lenticule) inside the cornea, with a small opening at its edge. The surface is not lifted.' }, { section: true }),
    stage('remove', 8, 'wide', { ar: 'الاستخراج عبر فتحة صغيرة', en: 'Removed through a small opening' },
      { ar: 'يُفصل هذا الجزء الرقيق ويُستخرج عبر الفتحة الصغيرة.', en: 'The thin piece of tissue is separated and removed through the small opening.' }, { section: true }),
    stage('result', 7, 'closeup', { ar: 'سطح أكثر تسطحاً دون شريحة', en: 'A flatter front surface, with no flap' },
      { ar: `بعد استخراج النسيج يصبح وسط السطح الأمامي أكثر تسطحاً، دون شريحة. تناسب هذه الطريقة بعض حالات قصر النظر والاستجماتيزم. ${RESULT_LINE.ar}`, en: `With the tissue removed, the centre of the front surface is flatter, and there is no flap. This method suits some short-sight and astigmatism prescriptions. ${RESULT_LINE.en}` }, { section: true })
  ]
};

/** Thin ribbon drawn just in front of the section plane (x = 0), along a curve in the y–z plane. Not clipped. */
function sectionRibbon(THREE, mat, n, dash = false) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((n + 1) * 2 * 3), 3));
  const idx = [];
  for (let k = 0; k < n; k++) { if (dash && k % 2) continue; const a = k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  g.setIndex(idx);
  const mesh = new THREE.Mesh(g, mat);
  mesh.renderOrder = 45; mesh.frustumCulled = false;
  return {
    object: mesh,
    /** pts: n + 1 points [y, z]; hw: half width (mm) */
    set(pts, hw) {
      const p = g.attributes.position.array;
      for (let k = 0; k <= n; k++) {
        const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n, k + 1)];
        let ty = b[0] - a[0], tz = b[1] - a[1];
        const l = Math.hypot(ty, tz) || 1; ty /= l; tz /= l;
        const [y, z] = pts[k];
        p.set([0.004, y - tz * hw, z + ty * hw], k * 6);
        p.set([0.004, y + tz * hw, z - ty * hw], k * 6 + 3);
      }
      g.attributes.position.needsUpdate = true;
    }
  };
}

/** Point [y, z] in the section plane at a signed distance t from the axis (t > 0: superior) on surface rhoAt(a, phi). */
const sectionPoint = (t, rhoAt) => {
  const phi = t >= 0 ? HALF_PI : -HALF_PI, a = aAt(t);
  const q = corneaPoint(a, phi, rhoAt(a, phi));
  return [q[1], q[2]];
};

const def = {
  id: 'laser', slug: 'laser-vision-correction', modelId: 'ssim-laser', version: '2026.11-r1',
  title: { ar: 'تصحيح الإبصار بالليزر: كيف يغيّر الفيمتوليزيك والليزر السطحي وسمايل شكل القرنية', en: 'Laser vision correction: how Femto-LASIK, PRK and SMILE reshape the cornea' },
  note: NOTE,
  objectives: [
    { ar: 'التعرف على طبقات القرنية: الظهارة واللحمة (السدى) والبطانة.', en: 'Recognise the layers of the cornea: epithelium, stroma and endothelium.' },
    { ar: 'فهم أن الليزر يغيّر انحناء القرنية بإزالة طبقة رقيقة جداً من نسيجها.', en: 'Understand that the laser changes the curve of the cornea by removing a very thin layer of tissue.' },
    { ar: 'التمييز بين الفيمتوليزيك والليزر السطحي وسمايل في طريقة الوصول إلى النسيج.', en: 'See how Femto-LASIK, PRK and SMILE differ in the way the tissue is reached.' }
  ],
  variants: [
    { id: 'lasik', label: { ar: 'الفيمتوليزيك (Femto-LASIK)', en: 'Femto-LASIK' } }, // id 'lasik' kept for links and tests
    { id: 'prk', label: { ar: 'التقشير السطحي (PRK)', en: 'PRK' } },
    { id: 'smile', label: { ar: 'سمايل (SMILE)', en: 'SMILE' } }
  ],
  cameras: CAMS,
  toggles: [
    { id: 'eye', label: { ar: 'بقية العين (الصلبة والقزحية والعدسة)', en: 'Rest of the eye (sclera, iris, lens)' }, parts: ['sclera', 'iris', 'lens', 'ciliary'] },
    { id: 'guide', label: { ar: 'خط الانحناء الأصلي', en: 'Original curve line' }, parts: ['guide'] }
  ],
  stages: (variant) => (STAGES[variant] || STAGES.lasik)(),
  extra: ({ variant }) => TYPE_TEXT[variant] || null,
  sources: [
    ['AAO EyeSmart — LASIK', 'https://www.aao.org/eye-health/treatments/lasik'],
    ['AAO EyeSmart — PRK', 'https://www.aao.org/eye-health/treatments/photorefractive-keratectomy-prk'],
    ['AAO EyeSmart — Refractive surgery', 'https://www.aao.org/eye-health/treatments/refractive-surgery'],
    ['NHS — Laser eye surgery and lens surgery', 'https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/'],
    ['FDA — LASIK', 'https://www.fda.gov/medical-devices/surgery-devices/lasik']
  ],
  simplifications: [
    ...COMMON_SIMPLIFICATIONS,
    { ar: 'عمق النسيج المُزال مكبّر كثيراً ليظهر التغيير في الانحناء؛ الشكل توضيحي.', en: 'The depth of tissue removed is greatly exaggerated so the change in curve can be seen; the shape is illustrative.' },
    { ar: 'سماكة الشريحة في الليزك وسماكة النسيج فوق الجزء المستخرج في سمايل توضيحيتان.', en: 'The LASIK flap thickness and the tissue above the SMILE lenticule are illustrative.' },
    { ar: 'البطانة مرسومة أسمك من حقيقتها لتظهر.', en: 'The endothelium is drawn thicker than it is so it can be seen.' },
    { ar: 'يُعرض تصحيح قصر النظر (تسطيح وسط القرنية) فقط.', en: 'Only a short-sight (myopic) correction, flattening the centre of the cornea, is shown.' },
    { ar: 'أشعة الليزر رسم رمزي؛ لا تُعرض إعدادات الأجهزة أو مسارات المسح الفعلية.', en: 'Laser beams are symbolic; device settings and real scanning patterns are not shown.' }
  ],

  build({ THREE, lib, mats }) {
    const eye = standardEye({ THREE, lib, mats }, { capsule: false, posterior: false, corneaExtra: { nR: 72 } });
    const { root, parts } = eye;
    const clip = [mats.stroma.clippingPlanes[0]];
    const own = []; // materials and geometries created here, disposed in dispose()
    const mine = (m) => { own.push(m); return m; };
    // slightly deeper tissue tints for this close-up (this mount's materials only) so the thin bands read against the page
    mats.stroma.color.set(0xa9c8da);
    mats.epithelium.color.set(0xe7b4a0);
    // The page shows through a transparent canvas: additive blending over empty background turns white there, so the
    // beams in this model use normal alpha blending at a low opacity (recommended as a shared change in materials.js).
    mats.laserBeam.blending = THREE.NormalBlending;
    mats.femtoBeam.blending = THREE.NormalBlending;
    const base = corneaDefaults();
    const thick0 = centralThickness(base);

    // ---------- LASIK flap: a layered patch on a hinge at the superior edge (+Y) ----------
    let flapAbl = 0;
    const flapState = () => corneaDefaults({ ablation: { depth: flapAbl, zone: ABL.zone } });
    let fst = flapState();
    const flapSurfaces = (a, phi) => { const k = corneaRadii(a, phi, fst); return [k.ant, k.epi, k.ant - FLAP.t]; };
    const flap = lib.layeredPatch({ rMax: FLAP.r, surfaces: flapSurfaces, bands: [mats.epithelium, mats.stroma], top: mats.flapSurface, bottom: mats.corneaBack, edge: mats.corneaEdge, nR: 48 });
    const hinge = corneaPoint(aAt(FLAP.r), HALF_PI, RC - FLAP.t / 2);
    const flapPivot = new THREE.Group(); flapPivot.name = 'flap';
    flapPivot.position.set(...hinge);
    flap.object.position.set(-hinge[0], -hinge[1], -hinge[2]);
    flapPivot.add(flap.object);
    root.add(flapPivot); parts.flap = flapPivot;

    // interface plane drawn while the flap is made (visible from the front), and the beam that makes it
    const femtoSheetMat = mine(new THREE.MeshBasicMaterial({ color: 0xff8a5c, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: clip }));
    const NU = 28, NV = 32;
    const sheetG = mine(new THREE.BufferGeometry());
    sheetG.setAttribute('position', new THREE.BufferAttribute(new Float32Array((NU + 1) * (NV + 1) * 3), 3));
    { const idx = []; for (let j = 0; j < NU; j++) for (let i = 0; i < NV; i++) { const a = j * (NV + 1) + i, b = a + 1, c = a + NV + 1, d = c + 1; idx.push(a, c, b, b, c, d); } sheetG.setIndex(idx); }
    const sheet = new THREE.Mesh(sheetG, femtoSheetMat); sheet.renderOrder = 35; sheet.frustumCulled = false;
    root.add(sheet); parts.sheet = sheet;
    const coneG = mine(new THREE.CylinderGeometry(0.85, 0.02, 6, 28, 1, true)); coneG.rotateX(HALF_PI); coneG.translate(0, 0, 3);
    const femto = new THREE.Mesh(coneG, mats.femtoBeam); femto.renderOrder = 40;
    root.add(femto); parts.femto = femto;
    const excimer = lib.buildBeam(mats.laserBeam, { radius: ABL.zone, length: 9 });
    excimer.position.z = EYE.corneaApexZ;
    root.add(excimer); parts.excimer = excimer;

    // section overlays: interface line (LASIK), original curve (dashed), small opening (SMILE)
    const ifaceMat = mine(new THREE.MeshBasicMaterial({ color: 0xe0673a, transparent: true, opacity: 0.95, depthWrite: false, side: THREE.DoubleSide }));
    const guideMat = mine(new THREE.MeshBasicMaterial({ color: 0x2f4d66, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }));
    const openMat = mine(new THREE.MeshBasicMaterial({ color: 0x8c3b26, transparent: true, opacity: 0.95, depthWrite: false, side: THREE.DoubleSide }));
    const iface = sectionRibbon(THREE, ifaceMat, 120); root.add(iface.object); parts.iface = iface.object;
    const guide = sectionRibbon(THREE, guideMat, 90, true); root.add(guide.object); parts.guide = guide.object;
    const openLine = sectionRibbon(THREE, openMat, 12); root.add(openLine.object); parts.openLine = openLine.object;
    guide.set(Array.from({ length: 91 }, (_, k) => sectionPoint(-4.9 + (9.8 * k) / 90, () => RC + 0.012)), 0.007);
    own.push(iface.object.geometry, guide.object.geometry, openLine.object.geometry);

    // ---------- PRK bandage contact lens: thin spherical shell resting on the cornea ----------
    mats.bandage.clippingPlanes = clip; // cut by the section like the tissue under it
    const bandCap = mine(new THREE.MeshStandardMaterial({ color: 0x5fa9d6, roughness: 0.3, transparent: true, opacity: 0.9, side: THREE.DoubleSide, clippingPlanes: clip }));
    const bandage = lib.layeredPatch({ rMax: 5.7, surfaces: () => [RC + 0.12, RC + 0.035], bands: [bandCap], top: mats.bandage, bottom: mats.bandage, edge: mats.bandage, nR: 24, nPhi: 72 });
    const bandageG = new THREE.Group(); bandageG.name = 'bandage'; bandageG.add(bandage.object);
    root.add(bandageG); parts.bandage = bandageG;

    // ---------- SMILE lenticule (lens-shaped piece inside the stroma) and the small opening ----------
    const lentTop = RC - LAYERS.epithelium - CAP;
    const lentAbl = { depth: ABL.depth, zone: ABL.zone };
    const lentSurfaces = (a) => [lentTop, lentTop - ablationAt(rOf(a), lentAbl) - 0.012];
    const lentCapMat = mine(new THREE.MeshStandardMaterial({ color: 0x7fb3d6, map: mats.tex.lamellae, roughness: 0.6, transparent: true, opacity: 0.95, side: THREE.DoubleSide, clippingPlanes: clip, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
    const lentSurfMat = mine(mats.lenticuleSurface.clone()); lentSurfMat.clippingPlanes = clip;
    const lent = lib.layeredPatch({ rMax: LENT_R, surfaces: lentSurfaces, bands: [lentCapMat], top: lentSurfMat, bottom: lentSurfMat, edge: lentSurfMat, nR: 32, nPhi: 72 });
    const lentMid = lentTop - (ABL.depth + 0.012) / 2;
    const c0 = corneaPoint(0, 0, lentMid);
    lent.object.position.set(-c0[0], -c0[1], -c0[2]);
    const lentPivot = new THREE.Group(); lentPivot.name = 'lenticule'; lentPivot.add(lent.object);
    root.add(lentPivot); parts.lenticule = lentPivot;
    const arcPts = [];
    for (let k = 0; k <= 24; k++) {
      const phi = HALF_PI - OPEN.half + (2 * OPEN.half * k) / 24;
      arcPts.push(new THREE.Vector3(...corneaPoint(aAt(OPEN.rOut), phi, RC + 0.01)));
    }
    const arcMat = mine(new THREE.MeshStandardMaterial({ color: 0x8c3b26, roughness: 0.6, transparent: true, opacity: 1, clippingPlanes: clip }));
    const arc = new THREE.Mesh(mine(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arcPts), 32, 0.035, 6, false)), arcMat);
    arc.name = 'opening'; root.add(arc); parts.opening = arc;
    const aIn = aAt(OPEN.rIn), aOut = aAt(OPEN.rOut);
    const pIn = corneaPoint(aIn, HALF_PI, lentMid), pOut = corneaPoint(aOut, HALF_PI, RC + 0.03), pFar = corneaPoint(aOut - 0.03, HALF_PI, RC + 0.9);

    // ---------- labels (anchors on the superior half of the section, where each layer actually is) ----------
    const layerAt = (r, which) => {
      const a = aAt(r), k = corneaRadii(a, HALF_PI, base);
      const rho = which === 'epi' ? (k.ant + k.epi) / 2 : which === 'stroma' ? (k.epi + k.endo) / 2 : (k.endo + k.post) / 2;
      return corneaPoint(a, HALF_PI, rho);
    };
    const flapLabel = { id: 'flap', part: 'flap', at: [0, 0, 0], text: { ar: 'الشريحة', en: 'Flap' }, when: (s) => s.variant === 'lasik' && s.index >= 1 };
    const lentLabel = { id: 'lenticule', part: 'lenticule', at: [0, 0, 0], text: { ar: 'العُدَيسة النسيجية', en: 'Lenticule' }, when: (s) => s.variant === 'smile' && (s.index === 1 || s.index === 2) };
    const bandLabel = { id: 'bandage', part: 'bandage', at: [0, 0, 0], text: { ar: 'العدسة اللاصقة الواقية', en: 'Bandage lens' }, when: (s) => s.variant === 'prk' && (s.index === 3 || s.index === 4) };
    const labels = [
      { id: 'epithelium', part: 'cornea', at: layerAt(3.05, 'epi'), text: { ar: 'الظهارة', en: 'Epithelium' }, inner: true, when: (s) => !(s.variant === 'lasik' && s.index >= 2 && s.index <= 4) && !(s.variant === 'prk' && s.index >= 1 && s.index <= 4) },
      { id: 'stroma', part: 'cornea', at: layerAt(2.0, 'stroma'), text: { ar: 'اللحمة (السدى)', en: 'Stroma' }, inner: true },
      { id: 'endothelium', part: 'cornea', at: layerAt(0.75, 'endo'), text: { ar: 'البطانة', en: 'Endothelium' }, inner: true },
      flapLabel, lentLabel, bandLabel
    ];

    const v = new THREE.Vector3();
    const model = {
      root, parts, labels,
      state: {},
      apply(s) {
        const i = s.index, p = s.p, variant = s.variant || 'lasik';
        let depth = 0, epiAmt = 0, epiR = EPI_R, theta = 0, cut = 0;
        let flapOn = false, beam = 0, femtoOn = 0, band = -1, lentK = 0, lentMove = 0, guideOn = false;

        if (variant === 'lasik') {
          cut = i === 0 ? 0 : i === 1 ? span(p, 0.05, 0.9) : 1;
          flapOn = i >= 1;
          theta = i === 2 ? FLAP.lift * span(p, 0.1, 0.9) : i === 3 ? FLAP.lift : i === 4 ? FLAP.lift * (1 - span(p, 0.1, 0.9)) : 0;
          depth = i < 3 ? 0 : i === 3 ? ABL.depth * span(p, 0.1, 0.9) : ABL.depth;
          beam = i === 3 ? span(p, 0.04, 0.12) * (1 - span(p, 0.88, 0.96)) : 0;
          femtoOn = i === 1 ? span(p, 0, 0.05) * (1 - span(p, 0.88, 0.95)) : 0;
          guideOn = i === 5 || (i === 4 && p > 0.9);
        } else if (variant === 'prk') {
          epiAmt = i === 0 ? 0 : i === 1 ? span(p, 0.1, 0.9) : i <= 3 ? 1 : i === 4 ? 1 - span(p, 0.55, 0.95) : 0;
          epiR = i === 4 ? EPI_R * (1 - 0.85 * span(p, 0.05, 0.9)) : EPI_R;
          depth = i < 2 ? 0 : i === 2 ? ABL.depth * span(p, 0.1, 0.9) : ABL.depth;
          beam = i === 2 ? span(p, 0.04, 0.12) * (1 - span(p, 0.88, 0.96)) : 0;
          band = i < 3 ? -1 : i === 3 ? 1 - span(p, 0.1, 0.8) : i === 4 ? 0 : (p < 0.35 ? span(p, 0, 0.35) : -1);
          guideOn = i === 5;
        } else {
          lentK = i === 1 ? span(p, 0.1, 0.75) : i === 2 ? 1 : 0;
          lentMove = i === 2 ? p : 0;
          depth = i < 2 ? 0 : i === 2 ? ABL.depth * span(p, 0.55, 0.95) : ABL.depth;
          femtoOn = i === 1 ? span(p, 0, 0.06) * (1 - span(p, 0.8, 0.9)) : 0;
          guideOn = i === 3 || (i === 2 && p > 0.9);
        }

        // cornea (pure: the state is rebuilt from the inputs on every call)
        const st = corneaDefaults({ ablation: { depth, zone: ABL.zone }, epiGone: { radius: epiR, amount: epiAmt } });
        eye.cornea.setState(st);
        if (flapOn) {
          // under the flap the host ends at the flap bed; a narrow gutter marks the side cut (none at the hinge)
          const gutter = cut >= 0.95 ? GUTTER : 0;
          eye.cornea.update((a, phi) => {
            const k = corneaRadii(a, phi, st), r = rOf(a);
            const atHinge = Math.abs(Math.atan2(Math.sin(phi - HALF_PI), Math.cos(phi - HALF_PI))) < 0.32;
            if (r <= FLAP.r + (atHinge ? 0 : gutter)) { const bed = k.ant - FLAP.t; return [bed, bed, k.endo, k.post]; }
            return [k.ant, k.epi, k.endo, k.post];
          });
        }

        // LASIK flap: its own shape follows the reshaped bed as it is laid back
        flapPivot.visible = flapOn;
        flapAbl = depth * (FLAP.lift > 0 ? 1 - theta / FLAP.lift : 1);
        fst = flapState();
        if (flapOn) flap.update(flapSurfaces);
        flapPivot.rotation.set(-theta, 0, 0);
        flapPivot.updateMatrix();
        v.set(...corneaPoint(aAt(1.6), -HALF_PI, RC)).sub(new THREE.Vector3(...hinge)).applyEuler(flapPivot.rotation).add(new THREE.Vector3(...hinge));
        flapLabel.at[0] = v.x; flapLabel.at[1] = v.y; flapLabel.at[2] = v.z + 0.05;

        // femtosecond sheet + beam (LASIK: raster from the hinge down; SMILE: spiral over the lenticule)
        const g = span(p, 0.05, 0.75);
        sheet.visible = variant === 'lasik' && i === 1 && femtoOn > 0.001;
        femtoSheetMat.opacity = 0.35 * femtoOn;
        if (sheet.visible) {
          const yFront = FLAP.r - 2 * FLAP.r * g;
          const pos = sheetG.attributes.position.array;
          for (let j = 0; j <= NU; j++) {
            const y = FLAP.r - (FLAP.r - yFront) * (j / NU);
            const hw = Math.sqrt(Math.max(0, FLAP.r * FLAP.r - y * y));
            for (let q = 0; q <= NV; q++) {
              const x = -hw + (2 * hw * q) / NV, r = Math.hypot(x, y), phi = Math.atan2(y, x), a = aAt(r);
              const k = corneaRadii(a, phi, st);
              pos.set(corneaPoint(a, phi, k.ant - FLAP.t + 0.004), (j * (NV + 1) + q) * 3);
            }
          }
          sheetG.attributes.position.needsUpdate = true;
        }
        femto.visible = femtoOn > 0.001;
        mats.femtoBeam.opacity = 0.22 * femtoOn;
        if (variant === 'lasik') {
          const y = FLAP.r - 2 * FLAP.r * g;
          femto.position.set(0, y, corneaPoint(aAt(y), y >= 0 ? HALF_PI : -HALF_PI, RC - FLAP.t)[2]);
        } else {
          const t = span(p, 0.1, 0.75), rr = LENT_R * (1 - t), ang = t * 26;
          const x = rr * Math.cos(ang), y = rr * Math.sin(ang);
          femto.position.set(x, y, corneaPoint(aAt(Math.hypot(x, y)), 0, lentTop)[2]);
        }

        // excimer beam (reshaping): subtle, additive, with a gentle deterministic shimmer
        excimer.visible = beam > 0.001;
        mats.laserBeam.opacity = beam * (0.1 + 0.025 * Math.sin(p * 90));

        // section overlays (only meaningful with the cut)
        iface.object.visible = s.section && variant === 'lasik' && ((i === 1 && cut > 0.001) || (theta === 0 && i >= 4));
        if (iface.object.visible) {
          const n = 120, bedAt = (a, phi) => corneaRadii(a, phi, st).ant - FLAP.t;
          const pts = [];
          for (let k = 0; k <= n; k++) {
            const u = (k / n) * cut;
            if (u <= 0.88) pts.push(sectionPoint(FLAP.r - (2 * FLAP.r * u) / 0.88, bedAt));
            else {
              const w = (u - 0.88) / 0.12, a = aAt(FLAP.r), kk = corneaRadii(a, -HALF_PI, st);
              const q = corneaPoint(a, -HALF_PI, mix(kk.ant - FLAP.t, kk.ant, w));
              pts.push([q[1], q[2]]);
            }
          }
          iface.set(pts, 0.009);
          ifaceMat.opacity = i >= 4 ? 0.6 : 0.95;
        }
        guide.object.visible = s.section && guideOn;

        // PRK bandage lens
        bandageG.visible = variant === 'prk' && band >= 0;
        bandageG.position.z = Math.max(0, band) * 3.2;
        bandLabel.at[0] = 0; bandLabel.at[1] = -1.3; bandLabel.at[2] = corneaPoint(aAt(1.3), -HALF_PI, RC + 0.11)[2] + Math.max(0, band) * 3.2;

        // SMILE lenticule: shaped in place, then separated and drawn out through the small opening
        const smile = variant === 'smile';
        lentPivot.visible = smile && lentK > 0.001;
        lentCapMat.opacity = 0.95 * lentK;
        lentSurfMat.opacity = 0.55 * lentK;
        const pa = span(lentMove, 0.08, 0.5), pb = span(lentMove, 0.5, 0.75), pc = span(lentMove, 0.75, 0.97);
        const sc = span(lentMove, 0.08, 0.46);
        let pos;
        if (pb <= 0) pos = corneaPoint(aIn * pa, HALF_PI, lentMid);
        else if (pc <= 0) pos = pIn.map((c, k) => mix(c, pOut[k], pb));
        else pos = pOut.map((c, k) => mix(c, pFar[k], pc));
        lentPivot.position.set(...pos);
        lentPivot.rotation.set(-(aIn * pa + 0.08 * pc), 0, 0);
        lentPivot.scale.set(mix(1, 0.16, sc), mix(1, 0.24, sc), mix(1, 0.7, sc));
        lentLabel.at[0] = pos[0]; lentLabel.at[1] = pos[1]; lentLabel.at[2] = pos[2] + 0.04;
        const openK = smile ? (i === 1 ? span(p, 0.75, 0.95) : i >= 2 ? 1 : 0) : 0;
        arc.visible = openK > 0.001;
        arcMat.opacity = openK;
        openLine.object.visible = s.section && openK > 0.001 && i < 3;
        if (openLine.object.visible) {
          const a0 = aIn, a1 = aOut, kin = lentTop, kout = RC;
          openLine.set(Array.from({ length: 13 }, (_, k) => { const t = k / 12; const q = corneaPoint(mix(a0, a1, t), HALF_PI, mix(kin, kout, t)); return [q[1], q[2]]; }), 0.012);
          openMat.opacity = openK * (i === 2 ? 1 - 0.5 * span(p, 0.8, 1) : 1);
        }

        const dist = Math.hypot(pos[0], pos[1], pos[2] - EYE.corneaCz);
        model.state = {
          variant, depth, epiAmount: epiAmt, epiRadius: epiR, flapAngle: flapOn ? theta : 0, flapVisible: flapOn,
          bandage: bandageG.visible, bandageLift: Math.max(0, band),
          lenticuleVisible: lentPivot.visible, lenticuleOutside: smile && (i === 3 || dist > RC + 0.05), lenticuleRemoved: smile && i === 3, lenticuleProgress: lentMove,
          centralThicknessStart: thick0, centralThickness: centralThickness(st)
        };
      },
      probe: () => ({ ...model.state }),
      dispose() {
        for (const o of own) o.dispose && o.dispose();
        for (const p of [flap, bandage, lent]) p.object.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      }
    };
    return model;
  }
};
export default def;
