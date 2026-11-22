// Shared anatomical geometry for every procedure simulator (pure maths, no three.js, importable in Node).
//
// Coordinate system (same as the cataract simulator, src/cataract-sim/anatomy.js):
//   units millimetres; +Z is the optical axis pointing out of the eye towards the viewer; the iris root lies near
//   z = 0; +X is temporal, +Y superior. Values are typical adult reference values for patient education (sources in
//   docs/implementation/phase-2-all-procedure-simulators/ANATOMICAL_MODEL_LIBRARY.md), never biometry of a patient.
// The cross-section view cuts the eye along the plane x = 0 (the y–z plane), so section caps lie at phi = ±90°.
import { EYE, lerp, clamp01, smooth, cornealThickness, lensAntZ, lensPostZ } from '../../cataract-sim/anatomy.js';

export { EYE, lerp, clamp01, smooth, ease, lensAntZ, lensPostZ, lensProfile, capsuleProfile, corneaAntZ, corneaPostZ, iolHalfT, scleraProfile, scleraInnerR } from '../../cataract-sim/anatomy.js';

export const LIBRARY_VERSION = 'ssim-anatomy-2026.11-r1';

// Limbus as a polar angle on the anterior corneal sphere.
export const CORNEA_A0 = Math.asin(EYE.corneaRadius / EYE.corneaRc);

// Corneal layer depths (mm along the anterior normal). The epithelium (~50 µm) is to scale. Descemet's membrane and
// the endothelium together are ~15–20 µm and are drawn 2–3× thicker so they remain visible: a schematic enlargement,
// recorded in ANATOMICAL_MODEL_LIBRARY.md.
export const LAYERS = { epithelium: 0.05, endothelium: 0.045 };

/**
 * Cornea state. Every field is optional; the defaults give the healthy reference cornea.
 *   bulge     { amp, thin, r0, phi0, sigma }  keratoconus: outward bulge (mm) and stromal thinning around a cone centre
 *   ablation  { depth, zone }                 central tissue removed from the stroma for a myopic correction (mm, zone radius)
 *   epiGone   { radius, amount }              epithelium absent inside radius (PRK, regrowing as amount → 0)
 *   swelling  number                          extra stromal thickness from endothelial failure (mm, added inwards)
 */
export function corneaDefaults(s = {}) {
  return {
    bulge: { amp: 0, thin: 0, r0: 1.2, phi0: -Math.PI / 2 - 0.35, sigma: 1.9, ...(s.bulge || {}) },
    ablation: { depth: 0, zone: 3.0, ...(s.ablation || {}) },
    epiGone: { radius: 0, amount: 0, ...(s.epiGone || {}) },
    swelling: s.swelling || 0
  };
}

// Radial distance (mm, in the x–y plane) of the anterior surface at polar angle a.
export const corneaRAt = (a) => EYE.corneaRc * Math.sin(a);

function bulgeAt(r, phi, b) {
  if (!b.amp && !b.thin) return 0;
  const cx = b.r0 * Math.cos(b.phi0), cy = b.r0 * Math.sin(b.phi0);
  const x = r * Math.cos(phi), y = r * Math.sin(phi);
  const d2 = (x - cx) ** 2 + (y - cy) ** 2;
  return Math.exp(-d2 / (2 * b.sigma * b.sigma));
}

// Myopic ablation profile (Munnerlyn-like parabola, flattening the centre) — depth in mm at radius r.
export function ablationAt(r, ab) {
  if (!ab.depth || r >= ab.zone) return 0;
  const q = 1 - (r / ab.zone) ** 2;
  return ab.depth * q * smooth(0, 0.35, q);
}

/**
 * Radii (from the anterior sphere centre, along the direction at polar angle a, azimuth phi) of the corneal surfaces:
 *   ant   anterior surface (epithelium on top)
 *   epi   epithelium / stroma boundary
 *   endo  stroma / Descemet–endothelium boundary
 *   post  posterior surface (endothelium)
 * Radii larger than EYE.corneaRc lie in front of the reference surface.
 */
export function corneaRadii(a, phi, st) {
  const s = st || corneaDefaults();
  const r = corneaRAt(a);
  const t0 = cornealThickness(r);
  const g = bulgeAt(r, phi, s.bulge);
  const bulge = s.bulge.amp * g;
  const thin = s.bulge.thin * g;
  const abl = ablationAt(r, s.ablation);
  const swell = s.swelling * (1 - 0.35 * (r / EYE.corneaRadius) ** 2);
  const edgeFade = 1 - smooth(EYE.corneaRadius - 0.6, EYE.corneaRadius, r); // deformations vanish at the limbus
  const R = EYE.corneaRc;
  const post = R - t0 + (bulge + thin) * edgeFade - swell;
  const stromaTop = R + bulge * edgeFade - LAYERS.epithelium - abl;
  const epiKept = 1 - (r < s.epiGone.radius ? s.epiGone.amount * (1 - smooth(s.epiGone.radius - 0.4, s.epiGone.radius, r)) : 0);
  const ant = stromaTop + LAYERS.epithelium * epiKept;
  return { ant, epi: stromaTop, endo: post + LAYERS.endothelium, post };
}

/** Point on a corneal surface: radius rho along the direction (a, phi) from the anterior sphere centre. */
export function corneaPoint(a, phi, rho) {
  const sa = Math.sin(a);
  return [rho * sa * Math.cos(phi), rho * sa * Math.sin(phi), EYE.corneaCz + rho * Math.cos(a)];
}

/** Central corneal thickness for a state (mm) — used by tests to check that a procedure changes the cornea as intended. */
export function centralThickness(st) {
  const k = corneaRadii(0, 0, st);
  return k.ant - k.post;
}

// ---------------- Iris with an explicit pupil-margin height ----------------
const irisFront = (zm, s) => zm + (EYE.irisRootZ - zm) * s + 0.2 * Math.sin(Math.PI * s) * (1 - 0.35 * s);
const irisThick = (s) => 0.1 + 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.08)), 0.75) + 0.04 * s;
/** Closed CCW iris profile for a pupil radius and a pupil-margin height (the margin rests on whatever lies behind it). */
export function irisProfileZ(pupilR, marginZ, nFront = 36, nBack = 16) {
  const rootR = EYE.irisRootR;
  const rAt = (s) => pupilR + (rootR - pupilR) * s;
  const pts = [], vs = [];
  for (let k = 0; k <= nBack; k++) { const s = k / nBack; pts.push([rAt(s), irisFront(marginZ, s) - irisThick(s)]); vs.push(0.01); }
  pts.push([rootR, irisFront(marginZ, 1) - irisThick(1)]); vs.push(0.01);
  pts.push([rootR, irisFront(marginZ, 1)]); vs.push(1);
  for (let k = nFront; k >= 0; k--) { const s = k / nFront; pts.push([rAt(s), irisFront(marginZ, s)]); vs.push(0.055 + 0.945 * s); }
  for (let k = 1; k <= 4; k++) {
    const t = k / 4, zTop = irisFront(marginZ, 0), zBot = zTop - irisThick(0);
    pts.push([pupilR - 0.035 * Math.sin(Math.PI * t), zTop + (zBot - zTop) * t]); vs.push(0.03);
  }
  return { pts, vs };
}
export const irisBackAt = (r, pupilR, marginZ) => {
  const s = clamp01((r - pupilR) / (EYE.irisRootR - pupilR));
  return irisFront(marginZ, s) - irisThick(s);
};
/** Pupil-margin height when it rests on the crystalline lens. */
export const irisOnLensZ = (pupilR) => lensAntZ(Math.min(pupilR, EYE.lensEqR - 0.01)) + EYE.irisGap;

// ---------------- Implantable phakic lens (ICL) ----------------
// Plate-haptic collamer lens in the posterior chamber: optic in front of the crystalline lens, footplates in the
// ciliary sulcus behind the iris root. Dimensions are illustrative of the published lens family (overall length
// ~12–13.7 mm, width ~7 mm), not a specific model or size; the central clearance above the natural lens ("vault")
// is drawn at 0.5 mm, inside the commonly reported acceptable range.
export const ICL = { length: 12.6, width: 6.6, opticR: 2.9, vault: 0.5, plateT: 0.1, sulcusR: 5.6, footZ: -0.55 };
ICL.apexZ = EYE.lensAntApexZ + ICL.vault;
/** Height of the ICL mid-surface at a point of its plane (x along the long axis). */
export function iclZ(x, y) {
  const u = Math.min(1, Math.abs(x) / (ICL.length / 2));
  const w = Math.min(1, Math.abs(y) / (ICL.width / 2));
  const arch = 1 - u * u;                         // vaulted along its length
  return ICL.footZ + (ICL.apexZ - ICL.footZ) * Math.pow(arch, 0.85) - 0.12 * w * w;
}
/** ICL outline in its plane: long rounded plate with a waist at the optic (half-width at x). */
export function iclHalfWidth(x) {
  const L = ICL.length / 2, u = Math.abs(x) / L;
  if (u >= 1) return 0;
  const end = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, u - 0.82) / 0.18, 2)));
  const waist = 1 - 0.18 * Math.exp(-Math.pow((u - 0.5) / 0.14, 2));
  return (ICL.width / 2) * end * waist;
}

// ---------------- Posterior segment ----------------
// Retina lines the globe behind the ora serrata; the macula sits at the posterior pole (the fovea is drawn on the
// optical axis, a simplification of its ~5° temporal offset); the optic disc lies ~15° nasal (−X) of the pole.
export const POSTERIOR = {
  retinaT: 0.25,            // drawn thickness, slightly enlarged
  oraZ: EYE.lensEqZ - 3.2,  // anterior edge of the retina (illustrative position of the ora serrata)
  maculaR: 2.75,            // macula ~5.5 mm across
  foveaR: 0.75,
  discAngle: (15 * Math.PI) / 180,
  discOffset: 4.3,          // fovea → optic-disc centre distance along the retina (~4–4.5 mm)
  discR: 0.9,               // disc ~1.8 mm across
  parsPlanaZ: EYE.limbusZ - 3.7 // site of intravitreal injections: the pars plana, behind the limbus
};
POSTERIOR.poleZ = EYE.scleraCenterZ - EYE.retinaR;

// Point on the inner globe at a polar angle theta from the posterior pole (theta = 0) towards azimuth phi.
export function globeInnerPoint(theta, phi, inset = 0) {
  const R = EYE.retinaR - inset;
  return [R * Math.sin(theta) * Math.cos(phi), R * Math.sin(theta) * Math.sin(phi), EYE.scleraCenterZ - R * Math.cos(theta)];
}

/** Vitreous cavity profile: the inner globe behind the lens, closed in front by the posterior lens and ciliary region. */
export function vitreousProfile(n = 48) {
  const R = EYE.retinaR - POSTERIOR.retinaT, cz = EYE.scleraCenterZ;
  const zFront = EYE.lensEqZ - 0.4;
  // polar angle from +Z, sweeping from the posterior pole (pi) forward to the plane z = zFront
  const start = Math.PI, end = Math.acos((zFront - cz) / R);
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const a = start + (end - start) * (k / n);
    pts.push([R * Math.sin(a), cz + R * Math.cos(a)]);
  }
  // front: the hollow (patellar fossa) in which the crystalline lens sits, back to the axis
  const rFront = pts[pts.length - 1][0];
  for (let k = 1; k <= 14; k++) {
    const r = rFront * (1 - k / 14);
    pts.push([r, Math.min(zFront, lensPostZ(Math.min(r, EYE.lensEqR - 0.01)) - 0.08)]);
  }
  return pts;
}

export { lerp as mix, clamp01 as clamp };
