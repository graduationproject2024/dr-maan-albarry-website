// Anatomical constants and profile maths for the procedural eye (pure maths, no three.js — importable in Node).
// Units are millimetres. The optical axis is +Z (towards the viewer / surgeon); the iris root is near z = 0.
// Values describe a typical cataract-age (~70 y) adult eye. Every value and its source is listed in
// docs/implementation/clinical-visual-reconstruction/CATARACT_ANATOMY_REVIEW.md and CLINICAL_SOURCES.md.
// These are illustrative reference values for patient education, not biometry for any individual.

export const MODEL_VERSION = 'csim-anatomy-2026.11-r2';

export const EYE = {
  // Cornea: white-to-white ~11.7 mm; anterior apical radius 7.8 mm; posterior apical radius 6.5 mm
  // (Navarro / Liou-Brennan / Dubbelman); central thickness ~0.54 mm, thicker towards the limbus.
  corneaRc: 7.8,
  corneaPostRc: 6.5,
  corneaRadius: 5.85,
  corneaCentralT: 0.54,
  // Anterior chamber: aqueous depth (endothelium -> anterior lens capsule) 2.6 mm, i.e. ~3.1 mm from the
  // epithelium — typical of cataract-age biometry (the chamber shallows as the lens thickens with age).
  aqueousDepth: 2.6,
  // Crystalline lens (age ~70): thickness ~4.6 mm (Dubbelman 2001: 2.93 + 0.0236·age), equatorial diameter
  // ~9.4 mm, anterior apical radius ~8.9 mm and posterior ~5.4 mm (Dubbelman & van der Heijde 2001).
  // The equatorial plane sits ~40 % of the thickness behind the anterior pole.
  lensEqZ: -1.5,
  lensEqR: 4.7,
  lensAntT: 1.85,
  lensPostT: 2.75,
  lensAntRc: 8.9,
  lensPostRc: 5.4,
  // Iris: root at the angle recess, pupil margin resting on the anterior lens surface.
  irisRootR: 5.45,
  irisRootZ: 0.0,
  irisGap: 0.16,            // pupil-margin clearance above its support (lens or IOL/capsule)
  pupilNormal: 1.6,         // 3.2 mm pupil (age-related miosis)
  pupilDilated: 3.5,        // 7 mm after dilating drops
  pupilAfter: 1.9,          // 3.8 mm towards the end of surgery
  irisPseudoZ: -0.55,       // pupil-margin height once the IOL is in place (chamber deepens; qualitative)
  // Globe: sclera sphere (~24 mm axial length) meeting the cornea at the limbus.
  scleraR: 11.5,
  scleraT: 0.8,
  // Capsulorhexis radius used for the illustration only (5 mm opening, overlapping the 6 mm optic edge).
  rhexisR: 2.5,
  // IOL (generic one-piece hydrophobic acrylic): 6 mm optic, ~13 mm overall uncompressed.
  iolOpticR: 3,
  iolOverallR: 6.5,
  iolEdgeT: 0.15,           // half edge thickness (0.3 mm square edge)
  iolCentreHalfT: 0.42,     // half centre thickness (set by the optic radii below)
  iolRc: 14.0,              // biconvex optic surface radius: chosen so paraxial rays focus on the model retina (optics.js)
  iolHapticTube: 0.17,      // haptic cross-section radius
  iolHapticBagR: 4.45,      // haptic centre-line radius when engaged in the capsular-bag fornix
  // Refractive indices (Navarro / Liou-Brennan schematic eyes; typical hydrophobic acrylic).
  nAir: 1.0, nCornea: 1.376, nAqueous: 1.336, nLens: 1.42, nVitreous: 1.336, nIOL: 1.5
};

EYE.lensAntApexZ = EYE.lensEqZ + EYE.lensAntT;
EYE.corneaPostApexZ = EYE.lensAntApexZ + EYE.aqueousDepth;
EYE.corneaApexZ = EYE.corneaPostApexZ + EYE.corneaCentralT;
EYE.corneaCz = EYE.corneaApexZ - EYE.corneaRc;            // anterior corneal sphere centre
EYE.corneaPostCz = EYE.corneaPostApexZ - EYE.corneaPostRc; // posterior corneal sphere centre
EYE.limbusZ = EYE.corneaApexZ - (EYE.corneaRc - Math.sqrt(EYE.corneaRc ** 2 - EYE.corneaRadius ** 2));
// Sclera sphere centre chosen so the sphere passes exactly through the anterior limbus.
EYE.scleraCenterZ = EYE.limbusZ - Math.sqrt(EYE.scleraR ** 2 - EYE.corneaRadius ** 2);
EYE.axialLength = EYE.corneaApexZ - (EYE.scleraCenterZ - EYE.scleraR);
EYE.retinaR = EYE.scleraR - EYE.scleraT;
EYE.focusZ = EYE.scleraCenterZ - EYE.retinaR;   // retina (inner globe surface) at the posterior pole
EYE.iolCentreZ = EYE.lensEqZ;                     // in-the-bag optic centre (capsular equator plane)

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const v3lerp = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const along = (base, dir, s) => [base[0] + dir[0] * s, base[1] + dir[1] * s, base[2] + dir[2] * s];
export const v3sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const v3add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const v3scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const v3dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const v3len = (a) => Math.hypot(a[0], a[1], a[2]);
export const v3norm = (a) => { const l = v3len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

const pAnt = EYE.lensEqR ** 2 / (2 * EYE.lensAntT * EYE.lensAntRc);
const pPost = EYE.lensEqR ** 2 / (2 * EYE.lensPostT * EYE.lensPostRc);

// Biconvex lens surface heights. z = eq ± T·(1 − (r/R)²)^p reproduces the apical radius of curvature
// (R_apex = R² / (2 T p)) and gives a smoothly rounded equator with a vertical tangent.
export function lensAntZ(r, s = 1) {
  const q = Math.max(0, 1 - (r / (EYE.lensEqR * s)) ** 2);
  return EYE.lensEqZ + EYE.lensAntT * s * Math.pow(q, pAnt);
}
export function lensPostZ(r, s = 1) {
  const q = Math.max(0, 1 - (r / (EYE.lensEqR * s)) ** 2);
  return EYE.lensEqZ - EYE.lensPostT * s * Math.pow(q, pPost);
}
export function corneaAntZ(r) {
  return EYE.corneaApexZ - (EYE.corneaRc - Math.sqrt(Math.max(0, EYE.corneaRc ** 2 - r * r)));
}
export function corneaPostZ(r) {
  return EYE.corneaPostApexZ - (EYE.corneaPostRc - Math.sqrt(Math.max(0, EYE.corneaPostRc ** 2 - r * r)));
}
// Radius where the posterior corneal surface ends (on the radial line from the anterior centre through the limbus).
const limbusDir = [EYE.corneaRadius / EYE.corneaRc, (EYE.limbusZ - EYE.corneaCz) / EYE.corneaRc];
function postAlongAnteriorNormal(dr, dz) {
  // distance d from the anterior sphere centre along (dr,dz) to the posterior sphere
  const oz = EYE.corneaCz - EYE.corneaPostCz; // anterior centre relative to posterior centre (z only)
  const b = oz * dz, c = oz * oz - EYE.corneaPostRc ** 2;
  return -b + Math.sqrt(b * b - c);
}
EYE.corneaPostEdgeR = postAlongAnteriorNormal(...limbusDir) * limbusDir[0];
EYE.corneaPostEdgeZ = EYE.corneaCz + postAlongAnteriorNormal(...limbusDir) * limbusDir[1];

// Corneal thickness measured along the anterior surface normal.
export function cornealThickness(r) {
  const a = Math.asin(Math.min(1, r / EYE.corneaRc));
  return EYE.corneaRc - postAlongAnteriorNormal(Math.sin(a), Math.cos(a));
}

// Closed lens profile (counter-clockwise in r/z => outward normals). rs/zs scale the shape about the equator plane.
export function lensProfile(rs = 1, zs = 1, n = 40) {
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const r = EYE.lensEqR * Math.sin((k / n) * Math.PI / 2);
    pts.push([r * rs, EYE.lensEqZ + (lensPostZ(r) - EYE.lensEqZ) * zs]);
  }
  for (let k = n - 1; k >= 0; k--) {
    const r = EYE.lensEqR * Math.sin((k / n) * Math.PI / 2);
    pts.push([r * rs, EYE.lensEqZ + (lensAntZ(r) - EYE.lensEqZ) * zs]);
  }
  return pts;
}

// ---------------- IOL optic ----------------
// Symmetric biconvex optic: half-thickness h(r) = edge + sag(r), with spherical surfaces of radius iolRc.
export function iolHalfT(r) {
  const R = EYE.iolRc, oR = EYE.iolOpticR;
  if (r >= oR) return EYE.iolEdgeT;
  const sag = (rr) => R - Math.sqrt(R * R - rr * rr);
  return EYE.iolEdgeT + sag(oR) - sag(r);
}
EYE.iolCentreHalfT = iolHalfT(0);

// ---------------- Capsular bag ----------------
// collapse = 0: the bag has the shape of the (removed) lens; collapse = 1: the empty bag has settled around the
// IOL (anterior rim on the optic edge, posterior capsule just behind the optic, haptics in the equatorial fornix).
const FORNIX_H = 0.28, FORNIX_R0 = 3.3, BAG_GAP = 0.05;
function collapsedHalf(r) {
  const R = EYE.lensEqR;
  if (r >= R) return 0;
  const optic = r < EYE.iolOpticR ? iolHalfT(r) + BAG_GAP : 0;
  const fx = r <= FORNIX_R0 ? 0 : (r - FORNIX_R0) / (R - FORNIX_R0);
  const fornix = FORNIX_H * Math.pow(Math.max(0, 1 - fx * fx), 0.25);
  return Math.max(optic, fornix);
}
export function capsuleAntZ(r, collapse = 0) {
  const full = lensAntZ(r);
  if (collapse <= 0) return full;
  return lerp(full, EYE.lensEqZ + Math.min(collapsedHalf(r), full - EYE.lensEqZ), collapse);
}
export function capsulePostZ(r, collapse = 0) {
  const full = lensPostZ(r);
  if (collapse <= 0) return full;
  return lerp(full, EYE.lensEqZ - Math.min(collapsedHalf(r), EYE.lensEqZ - full), collapse);
}
export function capsuleProfile(collapse = 0, n = 48) {
  const pts = [];
  for (let k = 0; k <= n; k++) { const r = EYE.lensEqR * Math.sin((k / n) * Math.PI / 2); pts.push([r, capsulePostZ(r, collapse)]); }
  for (let k = n - 1; k >= 0; k--) { const r = EYE.lensEqR * Math.sin((k / n) * Math.PI / 2); pts.push([r, capsuleAntZ(r, collapse)]); }
  return pts;
}

// Corneal meniscus: anterior sphere (R 7.8) and posterior sphere (R 6.5), joined by a radial limbal edge.
// Posterior points lie on the anterior normal through each anterior point, so thickness grows peripherally.
export function corneaProfile(n = 56) {
  const ant = [], post = [];
  const a0 = Math.asin(EYE.corneaRadius / EYE.corneaRc);
  for (let k = 0; k <= n; k++) {
    const a = a0 * Math.sin((k / n) * Math.PI / 2);
    const dr = Math.sin(a), dz = Math.cos(a);
    ant.push([EYE.corneaRc * dr, EYE.corneaCz + EYE.corneaRc * dz]);
    const d = postAlongAnteriorNormal(dr, dz);
    post.push([d * dr, EYE.corneaCz + d * dz]);
  }
  const pts = [];
  for (const p of post) pts.push(p);
  pts.push(post[n]); // duplicate for a crisp edge
  pts.push(ant[n]);
  for (let k = n; k >= 0; k--) pts.push(ant[k]);
  return pts;
}

// Sclera shell from the limbus to the posterior pole, with explicit texture v (outer 0..0.5, cut 0.5..0.52, inner 0.52..1).
export function scleraProfile(n = 64) {
  const { scleraR: R, scleraT: T, scleraCenterZ: cz, corneaRadius } = EYE;
  const a0 = Math.asin(corneaRadius / R); // polar angle (from +Z) of the limbus on the outer sphere
  const outer = [], inner = [], vs = [];
  for (let k = 0; k <= n; k++) {
    const a = Math.PI - (Math.PI - a0) * (k / n); // pole -> limbus
    outer.push([R * Math.sin(a), cz + R * Math.cos(a)]);
  }
  for (let k = 0; k <= n; k++) {
    const a = a0 + (Math.PI - a0) * (k / n); // limbus -> pole
    inner.push([(R - T) * Math.sin(a), cz + (R - T) * Math.cos(a)]);
  }
  const pts = [];
  outer.forEach((p, k) => { pts.push(p); vs.push(0.5 * k / n); });
  pts.push(outer[n]); vs.push(0.5);
  pts.push(inner[0]); vs.push(0.52);
  inner.forEach((p, k) => { pts.push(p); vs.push(0.52 + 0.48 * k / n); });
  return { pts, vs };
}
export function scleraInnerR(z) {
  const d = z - EYE.scleraCenterZ;
  return Math.sqrt(Math.max(0, EYE.retinaR ** 2 - d * d));
}

// ---------------- Iris ----------------
// The pupil margin rests (with a small clearance) on its support: the crystalline lens while phakic, settling
// back to EYE.irisPseudoZ as the empty capsular bag collapses around the IOL (collapse 0..1).
export function irisMarginZ(pupilR, collapse = 0) {
  const phakic = lensAntZ(Math.min(pupilR, EYE.lensEqR - 0.01)) + EYE.irisGap;
  return lerp(phakic, Math.min(phakic, EYE.irisPseudoZ), clamp01(collapse));
}
const irisFront = (zm, s) => zm + (EYE.irisRootZ - zm) * s + 0.2 * Math.sin(Math.PI * s) * (1 - 0.35 * s);
const irisThick = (s) => 0.1 + 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.08)), 0.75) + 0.04 * s;
// Iris solid bounds at radius r (null when r is outside the iris annulus).
export function irisBoundsAt(r, pupilR, collapse = 0) {
  if (r < pupilR || r > EYE.irisRootR) return null;
  const s = (r - pupilR) / (EYE.irisRootR - pupilR);
  const zm = irisMarginZ(pupilR, collapse);
  const front = irisFront(zm, s);
  return { front, back: front - irisThick(s) };
}
// Iris solid for a given pupil radius (closed CCW loop: back surface, root, front surface, pupil rim).
export function irisProfile(pupilR, collapse = 0, nFront = 40, nBack = 18) {
  const rootR = EYE.irisRootR;
  const zm = irisMarginZ(pupilR, collapse);
  const front = (s) => irisFront(zm, s);
  const rAt = (s) => pupilR + (rootR - pupilR) * s;
  const pts = [], vs = [];
  for (let k = 0; k <= nBack; k++) {
    const s = k / nBack;
    pts.push([rAt(s), front(s) - irisThick(s)]); vs.push(0.01);
  }
  pts.push([rootR, front(1) - irisThick(1)]); vs.push(0.01);
  pts.push([rootR, front(1)]); vs.push(1);
  for (let k = nFront; k >= 0; k--) {
    const s = k / nFront;
    pts.push([rAt(s), front(s)]); vs.push(0.055 + 0.945 * s);
  }
  // rounded pupil rim back down to the start
  for (let k = 1; k <= 4; k++) {
    const t = k / 4;
    const zTop = front(0), zBot = front(0) - irisThick(0);
    pts.push([pupilR - 0.035 * Math.sin(Math.PI * t), zTop + (zBot - zTop) * t]); vs.push(0.03);
  }
  return { pts, vs };
}

// ---------------- Clear-corneal incision (temporal, +X) ----------------
// A short self-sealing tunnel through the peripheral clear cornea. FULCRUM is the mid-point of the tunnel;
// instruments pivot about it. ENTRY_OUT points out of the eye along the tunnel axis.
const TUNNEL_PITCH = 0.2; // rad (~11.5°) above the iris plane, approaching from the temporal side
export const ENTRY_OUT = [Math.cos(TUNNEL_PITCH), 0, Math.sin(TUNNEL_PITCH)];
const fR = 5.0;
export const FULCRUM = [fR, 0, 0.5 * (corneaAntZ(fR) + corneaPostZ(fR))];
export const INCISION = FULCRUM; // kept for API compatibility
function tunnelExit(sign) {
  // march along ±ENTRY_OUT from the fulcrum until leaving the corneal stroma
  for (let s = 0; s < 6; s += 0.002) {
    const p = along(FULCRUM, ENTRY_OUT, sign * s);
    const r = Math.hypot(p[0], p[1]);
    if (sign > 0 ? p[2] >= corneaAntZ(r) : p[2] <= corneaPostZ(r)) return { s, p };
  }
  return { s: NaN, p: FULCRUM };
}
const extO = tunnelExit(1), intO = tunnelExit(-1);
export const WOUND = {
  external: extO.p, internal: intO.p,
  length: extO.s + intO.s,
  externalR: Math.hypot(extO.p[0], extO.p[1]),
  internalR: Math.hypot(intO.p[0], intO.p[1]),
  // Region around the tunnel where tissue deformation around an instrument is not modelled (exempt from
  // penetration checks). Everything farther than this from the fulcrum is checked strictly.
  exemptRadius: 1.6
};

// Instrument shaft axis (unit vector from the tip towards the handle). Inside the eye the shaft always passes
// through the fulcrum; outside (beyond the tunnel) instruments approach/leave along the tunnel axis.
export function instrumentAxis(tip) {
  const rel = v3sub(tip, FULCRUM);
  if (v3dot(rel, ENTRY_OUT) > -0.05) return ENTRY_OUT.slice();
  return v3norm(v3sub(FULCRUM, tip));
}
// Signed position along the tunnel axis (positive = outside the eye).
export const outsideAlong = (tip) => v3dot(v3sub(tip, FULCRUM), ENTRY_OUT);

// Piecewise path through keyframes [{t, p:[x,y,z]}] with eased segments.
export function pathAt(keys, t) {
  if (t <= keys[0].t) return keys[0].p.slice();
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i].t) {
      const a = keys[i - 1], b = keys[i];
      return v3lerp(a.p, b.p, ease((t - a.t) / (b.t - a.t)));
    }
  }
  return keys[keys.length - 1].p.slice();
}
