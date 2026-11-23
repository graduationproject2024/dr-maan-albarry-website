// Helpers shared by the procedure definitions: assembling a standard eye from the anatomical library, standard camera
// presets, stage helpers and the review-safe wording used in every simulator.
import { EYE, corneaAntZ, lensAntZ, POSTERIOR } from '../anatomy/geometry.js';

export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
/** Local progress of a sub-interval [a, b] of a stage, eased. */
export const span = (p, a, b) => ease(clamp01((p - a) / (b - a)));
export const mix = (a, b, t) => a + (b - a) * t;

/** Stage factory: { id, title:{ar,en}, text:{ar,en}, duration, camera, section? } */
export const stage = (id, duration, camera, title, text, extra = {}) => ({ id, duration, camera, title, text, ...extra });

// Camera presets (positions in mm, target on the optical axis). "label" makes a preset a visitor-selectable view.
export const CAMERAS = {
  full: { pos: [22, 13, 36], target: [0, 0, -6], label: { ar: 'العين كاملة', en: 'Whole eye' } },
  anterior: { pos: [8, 5.5, 15], target: [0, 0, -0.6], label: { ar: 'مقدمة العين', en: 'Front of the eye' } },
  section: { pos: [46, 5, -1], target: [0, 0, -7.5], label: { ar: 'مقطع جانبي', en: 'Side section' } },
  anteriorSection: { pos: [19, 3, 4], target: [0, 0, -0.6], label: { ar: 'مقطع لمقدمة العين', en: 'Front section' } },
  cornea: { pos: [9, 3.5, 9], target: [0, 0, 2.2], label: { ar: 'القرنية عن قرب', en: 'Cornea close-up' } },
  corneaSection: { pos: [13, 1.5, 4.5], target: [0, 0, 2.2] },
  lens: { pos: [17, 4, 6], target: [0, 0, -1.2] },
  posterior: { pos: [30, 6, -4], target: [0, 0, -10], label: { ar: 'خلف العين', en: 'Back of the eye' } },
  front: { pos: [0.01, 0.6, 34], target: [0, 0, 0], label: { ar: 'من الأمام', en: 'Front view' } }
};

/** Anatomical label anchors (mm). */
export const ANCHOR = {
  cornea: [0, 4.2, corneaAntZ(4.2) + 0.15],
  iris: [0, -4.6, 0.25],
  lens: [0, 2.4, lensAntZ(2.4) - 0.6],
  capsule: [0, -EYE.lensEqR, EYE.lensEqZ],
  sclera: [0, 11.2, EYE.scleraCenterZ + 2.5],
  retina: [0, -7.4, EYE.scleraCenterZ - 8.3],
  macula: [0, 0, POSTERIOR.poleZ + 0.5],
  vitreous: [0, 3.2, EYE.scleraCenterZ - 2],
  chamber: [0, 1.2, (EYE.corneaPostApexZ + EYE.lensAntApexZ) / 2 + 0.3]
};

/**
 * Standard eye from the shared library. parts: sclera, cornea, iris, lens, capsule, ciliary, posterior (each optional).
 * Returns { root, parts, cornea, iris, lens, capsule, ciliary, posterior }.
 */
export function standardEye({ THREE, lib, mats }, want = {}) {
  const root = new THREE.Group();
  const parts = {};
  const out = { root, parts };
  if (want.sclera !== false) { out.sclera = lib.buildSclera(mats); parts.sclera = out.sclera.object; root.add(out.sclera.object); }
  if (want.posterior) { out.posterior = lib.buildPosterior(mats); parts.posterior = out.posterior.object; parts.retina = out.posterior.retina.object; parts.vitreous = out.posterior.vitreous.object; parts.macula = out.posterior.macula; root.add(out.posterior.object); }
  if (want.ciliary !== false) { out.ciliary = lib.buildCiliary(mats); parts.ciliary = out.ciliary.object; root.add(out.ciliary.object); }
  if (want.lens !== false) { out.lens = lib.buildLens(mats); parts.lens = out.lens.object; root.add(out.lens.object); }
  if (want.capsule) { out.capsule = lib.buildCapsule(mats, 0); parts.capsule = out.capsule.object; root.add(out.capsule.object); }
  if (want.iris !== false) { out.iris = lib.buildIris(mats, EYE.pupilNormal, undefined); parts.iris = out.iris.object; root.add(out.iris.object); }
  if (want.cornea !== false) { out.cornea = lib.buildCornea(mats, want.corneaState, want.corneaExtra || {}); parts.cornea = out.cornea.object; root.add(out.cornea.object); }
  return out;
}

export const NOTE = {
  ar: 'نموذج تعليمي توضيحي مبسّط، وليس تخطيطاً لعمليتك. المراحل مأخوذة من صفحة الإجراء على هذا الموقع؛ النموذج الجديد بانتظار المراجعة الطبية من د. معن البري.',
  en: 'A simplified educational model, not a plan of your operation. The stages follow this procedure’s page on this site; the new model is awaiting medical review by Dr. Maan Al Barry.'
};

export const COMMON_SIMPLIFICATIONS = [
  { ar: 'المقاسات قيم مرجعية نموذجية لعين بالغة، وليست قياسات أي مريض.', en: 'Dimensions are typical adult reference values, not anyone’s measurements.' },
  { ar: 'بعض الطبقات الرقيقة مكبّرة لتظهر بوضوح، ويُشار إلى ذلك في الوصف.', en: 'Some very thin layers are drawn thicker so they can be seen.' },
  { ar: 'لا تُعرض الأدوات أو الإعدادات الجراحية الدقيقة؛ تختلف بحسب الجرّاح والحالة.', en: 'Exact surgical instruments and settings are not shown; they differ between surgeons and cases.' }
];
