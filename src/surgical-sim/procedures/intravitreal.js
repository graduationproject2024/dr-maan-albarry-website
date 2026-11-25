// Intravitreal injections — /procedures/intravitreal-injections/.
// What it teaches (from the intravitreal-injections page): the vitreous is a clear gel filling the eye behind the lens;
// the retina lines the back wall and the macula at its centre gives detailed vision; the medicine is placed into the
// vitreous, close to the retina. Steps: examination and retinal imaging; numbing drops and careful cleaning; a quick
// injection into the white of the eye with a very fine needle; a short check, then home the same day.
// No condition is depicted: the "affected area" at the macula is a generic, illustrative overlay.
import { EYE, POSTERIOR } from '../anatomy/geometry.js';
import { CAMERAS, ANCHOR, NOTE, COMMON_SIMPLIFICATIONS, standardEye, stage, span, mix } from './common.js';

// ---------------- Pure geometry of the injection (checked in Node) ----------------
const CZ = EYE.scleraCenterZ;
/** Entry point on the outer sclera at the illustrative pars-plana height, below the cornea (in the section plane). */
export const ENTRY = (() => {
  const z = POSTERIOR.parsPlanaZ, r = Math.sqrt(EYE.scleraR ** 2 - (z - CZ) ** 2);
  return [0, -r, z];
})();
/** The needle points from the entry towards the centre of the vitreous cavity (never towards the lens). */
export const AIM = (() => {
  const d = [0 - ENTRY[0], 0 - ENTRY[1], CZ - ENTRY[2]], l = Math.hypot(...d);
  return d.map((v) => v / l);
})();
const DEPTH_IN = 2.6;   // illustrative: how far the tip is drawn inside the wall (never shown as a number)
const DEPTH_OUT = -5;   // start / end position, outside the eye
export const tipAt = (d) => ENTRY.map((v, k) => v + AIM[k] * d);
// The medicine: a few soft translucent puffs that start at the tip and drift towards the back of the eye.
const PUFFS = [
  [0, 0, 0], [-0.3, 0.9, -0.6], [-0.2, -0.7, -0.9], [-0.5, 0.4, 0.8], [-0.2, 1.4, -1.6], [-0.4, -0.2, -1.8]
];
const CLOUD_END = [0, -0.6, CZ - 3.2];
/** Puff k at spread s (0 at the tip, 1 drifted and widened). Pure. */
export function puff(k, s) {
  const tip = tipAt(DEPTH_IN), o = PUFFS[k];
  const c = tip.map((v, j) => mix(v, CLOUD_END[j], s));
  const spread = mix(0.12, 1.9, s);
  return { pos: [c[0] + o[0] * spread, c[1] + o[1] * spread, c[2] + o[2] * spread], r: mix(0.45, 2.5, s) * (1 - 0.12 * k / PUFFS.length) };
}

// Point on the inner retinal surface, from a flat chart around the posterior pole (same mapping as build.js).
const INNER = EYE.retinaR - 0.12 - POSTERIOR.retinaT;
export function onRetina(x, y, lift = 0) {
  const R = INNER - lift, l = Math.hypot(x, y, INNER);
  return [(R * x) / l, (R * y) / l, CZ - (R * INNER) / l];
}
const AREA_R = 1.9, AREA_H = 0.32; // generic affected area: a shallow dome over the macula (illustrative)
export const areaLift = (rho) => 0.02 + AREA_H * Math.pow(Math.max(0, 1 - (rho / AREA_R) ** 2), 2);

const def = {
  id: 'intravitreal', slug: 'intravitreal-injections', modelId: 'ssim-ivt', version: '2026.11-r1',
  title: { ar: 'حقن العين داخل الجسم الزجاجي: إيصال الدواء إلى خلف العين', en: 'Intravitreal injections: bringing medicine to the back of the eye' },
  note: NOTE,
  objectives: [
    { ar: 'التعرف على الجسم الزجاجي والشبكية والبقعة في الجزء الخلفي من العين.', en: 'Recognise the vitreous, the retina and the macula at the back of the eye.' },
    { ar: 'فهم أن الحقنة تمر عبر بياض العين خلف القرنية، بعيداً عن العدسة.', en: 'Understand that the injection passes through the white of the eye behind the cornea, away from the lens.' },
    { ar: 'فهم أن الدواء يوضع في الجسم الزجاجي قرب الشبكية.', en: 'Understand that the medicine is placed in the vitreous, close to the retina.' }
  ],
  cameras: {
    full: CAMERAS.full,
    posterior: CAMERAS.posterior,
    macula: { pos: [8.5, 2.2, -10.2], target: [-0.9, 0.2, -19.2], fit: [4.6, 4.6], label: { ar: 'البقعة عن قرب', en: 'Macula close-up' } },
    drops: { pos: [21, 7, 9], target: [0, 0, 0.5], fit: [7, 7] },
    entry: { pos: [27, -5, 0], target: [0, -8.6, -3.6], fit: [7.2, 6.4] }
  },
  toggles: [
    { id: 'vitreous', label: { ar: 'الجسم الزجاجي', en: 'Vitreous' }, parts: ['vitreous'] },
    { id: 'lens', label: { ar: 'العدسة', en: 'Lens' }, parts: ['lens'] },
    { id: 'cornea', label: { ar: 'القرنية', en: 'Cornea' }, parts: ['cornea'] }
  ],
  stages: () => [
    stage('back', 7, 'posterior', { ar: 'الجزء الخلفي من العين', en: 'The back of the eye' },
      { ar: 'يملأ الجسم الزجاجي، وهو هلام شفاف، تجويف العين خلف العدسة. تبطّن الشبكية الجدار الخلفي، وفي مركزها البقعة المسؤولة عن الرؤية الدقيقة كالقراءة والتعرف على الوجوه.', en: 'The vitreous, a clear gel, fills the eye behind the lens. The retina lines the back wall, and at its centre is the macula, responsible for detailed vision such as reading and recognising faces.' }, { section: true }),
    stage('exam', 7, 'macula', { ar: 'الفحص وتصوير الشبكية', en: 'Examination and retinal imaging' },
      { ar: 'يُفحص قاع العين وتُصوَّر الشبكية لتحديد الحاجة إلى الحقن وجدوله. المنطقة المظلّلة عند البقعة رسم توضيحي عام لمنطقة متأثرة، وليست حالة بعينها.', en: 'The back of the eye is examined and the retina imaged to decide whether injections are needed and how often. The shaded area at the macula is a generic drawing of an affected area, not a specific condition.' }, { section: true }),
    stage('numbing', 6, 'drops', { ar: 'قطرات مخدرة وتعقيم دقيق', en: 'Numbing drops and careful cleaning' },
      { ar: 'توضع قطرات مخدرة على سطح العين، ثم يُعقَّم سطح العين والجفون بعناية قبل الحقن.', en: 'Numbing drops are placed on the surface of the eye, then the surface and the lids are carefully cleaned before the injection.' }, { section: false }),
    stage('injection', 8, 'entry', { ar: 'حقنة سريعة في بياض العين', en: 'A quick injection into the white of the eye' },
      { ar: 'تُعطى حقنة سريعة في بياض العين بإبرة دقيقة جداً، خلف حافة القرنية، متجهةً نحو الجسم الزجاجي بعيداً عن العدسة.', en: 'A quick injection is given into the white of the eye with a very fine needle, behind the edge of the cornea, pointing into the vitreous and away from the lens.' }, { section: true }),
    stage('spread', 8, 'posterior', { ar: 'الدواء داخل الجسم الزجاجي', en: 'The medicine in the vitreous' },
      { ar: 'تُسحب الإبرة، ويبقى الدواء داخل الجسم الزجاجي ثم ينتشر فيه نحو الشبكية، فيصل مباشرة إلى الجزء الخلفي من العين.', en: 'The needle is withdrawn. The medicine stays in the vitreous and spreads through it towards the retina, reaching the back of the eye directly.' }, { section: true }),
    stage('after', 6, 'macula', { ar: 'فحص قصير ثم العودة إلى المنزل', en: 'A short check, then home' },
      { ar: 'يُجرى فحص بسيط بعد الحقن، ثم يعود المريض إلى المنزل في اليوم نفسه. الحقن غالباً علاج مستمر على دفعات، مع متابعة وتصوير منتظمين.', en: 'A short check follows the injection, and you go home the same day. Injections are usually an ongoing course, with regular check-ups and imaging.' }, { section: true })
  ],
  sources: [
    ['AAO EyeSmart — Intravitreal injections', 'https://www.aao.org/eye-health/treatments/intravitreal-injections'],
    ['AAO EyeSmart — Eye injections', 'https://www.aao.org/eye-health/treatments/eye-injections'],
    ['NEI — Age-related macular degeneration', 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration'],
    ['NEI — Diabetic retinopathy', 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy'],
    ['NHS — AMD treatment', 'https://www.nhs.uk/conditions/age-related-macular-degeneration-amd/treatment/']
  ],
  simplifications: [
    ...COMMON_SIMPLIFICATIONS,
    { ar: 'المنطقة المتأثرة عند البقعة رسم عام توضيحي، ولا تمثل مرضاً بعينه.', en: 'The affected area at the macula is a generic illustration, not a specific disease.' },
    { ar: 'تُرسم النقرة على محور العين، وهي في الواقع منحرفة قليلاً نحو الصدغ.', en: 'The fovea is drawn on the eye’s axis; in reality it lies slightly towards the temple.' },
    { ar: 'الإبرة والمحقنة مرسومتان بشكل عام؛ موضع الحقن مرسوم أسفل القرنية ليظهر في المقطع، ويحدده الطبيب في الواقع.', en: 'The needle and syringe are drawn generically; the injection site is drawn below the cornea so it shows in the section, and is chosen by the doctor in reality.' },
    { ar: 'الدواء مرسوم كسحابة شفافة لتوضيح الفكرة؛ لا يمثل كميته أو طريقة انتشاره الفعلية.', en: 'The medicine is drawn as a translucent cloud to show the idea; it does not represent its amount or exact spread.' },
    { ar: 'التعقيم موصوف في النص ولا يُرسم، والجفون غير مرسومة.', en: 'Cleaning is described in the text but not drawn, and the lids are not modelled.' }
  ],

  build({ THREE, lib, mats }) {
    const eye = standardEye({ THREE, lib, mats }, { posterior: true });
    const { root, parts } = eye;
    const clip = [mats.lens.clippingPlanes[0]];
    const own = [];

    // ---- generic affected area at the macula (shallow dome) and its section profile ----
    const seg = 48, rings = 10, pos = [], idx = [];
    for (let j = 0; j <= rings; j++) for (let k = 0; k <= seg; k++) {
      const rho = AREA_R * (j / rings), a = (k / seg) * Math.PI * 2;
      pos.push(...onRetina(rho * Math.cos(a), rho * Math.sin(a), areaLift(rho)));
    }
    for (let j = 0; j < rings; j++) for (let k = 0; k < seg; k++) { const a = j * (seg + 1) + k, b = a + 1, c = a + seg + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    const ag = new THREE.BufferGeometry(); ag.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); ag.setIndex(idx); ag.computeVertexNormals();
    const area = new THREE.Mesh(ag, mats.fluid); area.renderOrder = 20;
    const areaCutMat = new THREE.MeshBasicMaterial({ color: 0xe8c45e, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }); own.push(areaCutMat);
    const cp = [], ci = [];
    const n = 40;
    for (let k = 0; k <= n; k++) {
      const y = -AREA_R + (2 * AREA_R * k) / n;
      const lo = onRetina(0, y, 0.005), hi = onRetina(0, y, areaLift(Math.abs(y)));
      cp.push(0.02, lo[1], lo[2], 0.02, hi[1], hi[2]);
    }
    for (let k = 0; k < n; k++) { const a = k * 2; ci.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cg.setIndex(ci);
    const areaCut = new THREE.Mesh(cg, areaCutMat); areaCut.renderOrder = 34;
    const affected = new THREE.Group(); affected.name = 'affected'; affected.add(area, areaCut);
    root.add(affected); parts.affected = affected;

    // ---- macula outline (highlight while the retina is examined) ----
    const ringMat = new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, clippingPlanes: clip }); own.push(ringMat);
    const ringPts = [];
    for (let k = 0; k < 120; k++) { const a = (k / 120) * Math.PI * 2; ringPts.push(new THREE.Vector3(...onRetina(POSTERIOR.maculaR * Math.cos(a), POSTERIOR.maculaR * Math.sin(a), 0.05))); }
    const macRing = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPts), ringMat);
    macRing.renderOrder = 36;
    root.add(macRing); parts.maculaRing = macRing;

    // ---- numbing drops ----
    const dropGeo = new THREE.SphereGeometry(0.42, 20, 14);
    const drops = [0, 1].map((k) => { const d = new THREE.Mesh(dropGeo, mats.drop); d.renderOrder = 42; root.add(d); return d; });
    parts.drops = drops[0];

    // ---- needle ----
    const needle = lib.buildNeedle(mats);
    const up = new THREE.Vector3(0, 1, 0), back = new THREE.Vector3(-AIM[0], -AIM[1], -AIM[2]);
    needle.object.quaternion.setFromUnitVectors(up, back);
    root.add(needle.object); parts.needle = needle.object;
    const siteMat = new THREE.MeshBasicMaterial({ color: 0x8a2b22, transparent: true, opacity: 0, depthWrite: false }); own.push(siteMat);
    const site = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), siteMat);
    site.position.set(...ENTRY);
    root.add(site); parts.site = site;

    // ---- medicine ----
    const medMat = new THREE.MeshStandardMaterial({ color: 0x4f9fd6, roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }); own.push(medMat);
    const puffGeo = new THREE.SphereGeometry(1, 24, 16);
    const cloud = new THREE.Group(); cloud.name = 'medicine';
    // each puff: a denser core inside a fainter halo, so the cloud has soft edges
    const haloMat = new THREE.MeshStandardMaterial({ color: 0x6fb2de, roughness: 1, transparent: true, opacity: 0, depthWrite: false }); own.push(haloMat);
    const puffs = PUFFS.map(() => {
      const g = new THREE.Group();
      const core = new THREE.Mesh(puffGeo, medMat); core.scale.setScalar(0.62); core.renderOrder = 26;
      const halo = new THREE.Mesh(puffGeo, haloMat); halo.renderOrder = 25;
      g.add(core, halo); cloud.add(g); return g;
    });
    root.add(cloud); parts.medicine = cloud;

    const clear = new THREE.Color(0xf6efdf);
    const medLabel = puff(0, 0.75).pos;

    const model = {
      root, parts,
      labels: [
        { id: 'cornea', part: 'cornea', at: ANCHOR.cornea, text: { ar: 'القرنية', en: 'Cornea' }, when: (s) => s.index === 2 || s.index === 3 },
        { id: 'lens', part: 'lens', at: [0, -ANCHOR.lens[1], ANCHOR.lens[2]], text: { ar: 'العدسة', en: 'Lens' }, inner: true, when: (s) => s.index === 0 || s.index === 3 },
        { id: 'vitreous', part: 'vitreous', at: ANCHOR.vitreous, text: { ar: 'الجسم الزجاجي', en: 'Vitreous' }, inner: true, when: (s) => s.index === 0 || s.index === 3 },
        { id: 'retina', part: 'retina', at: ANCHOR.retina, text: { ar: 'الشبكية', en: 'Retina' }, inner: true, when: (s) => s.index === 0 || s.index === 4 },
        { id: 'macula', part: 'macula', at: onRetina(0, 1.9, 0.1), text: { ar: 'البقعة', en: 'Macula' }, inner: true, when: (s) => s.index <= 1 || s.index === 5 },
        { id: 'affected', part: 'affected', at: onRetina(0, -0.9, AREA_H + 0.1), text: { ar: 'منطقة متأثرة (توضيحية)', en: 'Affected area (illustrative)' }, inner: true, when: (s) => s.index === 1 || s.index === 5 },
        { id: 'sclera', part: 'sclera', at: [ENTRY[0], ENTRY[1] - 0.4, ENTRY[2] + 0.6], text: { ar: 'بياض العين', en: 'White of the eye' }, when: (s) => s.index === 3 },
        { id: 'medicine', part: 'medicine', at: medLabel, text: { ar: 'الدواء', en: 'Medicine' }, when: (s) => s.index === 4 }
      ],
      state: {},
      apply(s) {
        const i = s.index, p = s.p;
        // anterior eye: clear lens (the iris keeps the shape it was built with)
        mats.lens.color.copy(clear); mats.lens.opacity = 0.32;

        // macula: outlined while it is examined
        mats.macula.opacity = 0.55;
        macRing.visible = i <= 1;
        ringMat.opacity = i === 0 ? 0.9 * span(p, 0.3, 0.7) : i === 1 ? 0.9 * (1 - span(p, 0.2, 0.6)) : 0;

        // generic affected area: appears during the examination, stays, then fades a little (no result is implied)
        const aff = i === 0 ? 0 : i === 1 ? span(p, 0.15, 0.6) : i < 5 ? 1 : 1 - 0.3 * span(p, 0.2, 0.9);
        affected.visible = aff > 0.001;
        mats.fluid.opacity = 0.6 * aff;
        areaCut.visible = s.section;
        areaCutMat.opacity = 0.7 * aff;

        // drops: two drops fall onto the cornea, then spread into a thin film and disappear
        drops.forEach((d, k) => {
          const t0 = 0.1 + k * 0.32, fall = (p - t0) / 0.18, flat = (p - t0 - 0.18) / 0.22;
          const on = i === 2 && fall >= 0; // after landing each drop stays as a thin film on the surface
          d.visible = on;
          const apexZ = EYE.corneaApexZ + 0.35, off = k ? 0.6 : -0.4;
          if (fall < 1) { d.position.set(off, 0.3 * k, mix(12, apexZ, Math.max(0, fall) ** 2)); d.scale.set(1, 1, 1.15); }
          else { const f = Math.min(1, Math.max(0, flat)); d.position.set(off, 0.3 * k, apexZ - 0.3 * f); d.scale.set(mix(1, 3.2, f), mix(1, 3.2, f), mix(1, 0.12, f)); }
        });
        mats.drop.opacity = 0.55;

        // needle: in through the white of the eye, held briefly, out at the start of the next stage
        let d = DEPTH_OUT;
        if (i === 3) d = p < 0.15 ? DEPTH_OUT : mix(DEPTH_OUT, DEPTH_IN, span(p, 0.15, 0.55));
        if (i === 4) d = mix(DEPTH_IN, DEPTH_OUT, span(p, 0.05, 0.3));
        const tip = tipAt(d);
        needle.object.visible = (i === 3 && p > 0.05) || (i === 4 && p < 0.3);
        needle.object.position.set(tip[0] - AIM[0] * 0.6, tip[1] - AIM[1] * 0.6, tip[2] - AIM[2] * 0.6);
        site.visible = i === 3 || i === 4;
        siteMat.opacity = i === 3 ? 0.85 * span(p, 0.0, 0.15) : 0.85;

        // medicine: released at the tip during the injection, then drifting and widening towards the retina
        let spread = 0, med = 0;
        if (i === 3) { med = span(p, 0.6, 0.85); spread = 0; }
        else if (i === 4) { med = 1; spread = span(p, 0.15, 0.95); }
        else if (i === 5) { med = 1 - span(p, 0, 0.8) * 0.6; spread = 1; }
        cloud.visible = med > 0.001;
        medMat.opacity = med * mix(0.45, 0.16, spread);
        haloMat.opacity = med * mix(0.22, 0.1, spread);
        puffs.forEach((m, k) => {
          const f = puff(k, spread), grow = i === 3 ? mix(0.2, 1, med) : 1;
          m.position.set(...f.pos);
          m.scale.setScalar(f.r * grow);
        });

        model.state = { stage: s.stage.id, needleDepth: d, tip, med, spread, affected: aff };
      },
      probe() {
        const st = model.state, t = st.tip;
        const fromCentre = Math.hypot(t[0], t[1], t[2] - CZ);
        return {
          ...st,
          needleVisible: needle.object.visible,
          needleTip: t,
          tipInsideGlobe: fromCentre < INNER,
          entryZ: ENTRY[2], limbusZ: EYE.limbusZ, entryBehindLimbus: ENTRY[2] < EYE.limbusZ,
          aimTowardsVitreousCentre: AIM,
          medicineOpacity: medMat.opacity,
          medicineVisible: cloud.visible,
          maculaPresent: !!parts.macula && parts.macula.visible !== false,
          affectedOpacity: mats.fluid.opacity
        };
      },
      dispose() { for (const m of own) m.dispose(); }
    };
    return model;
  }
};
export default def;
