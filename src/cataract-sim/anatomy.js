// Anatomical constants and profile maths for the procedural eye (pure maths, no three.js).
// Units are millimetres. The optical axis is +Z (towards the viewer / surgeon); the iris plane is near z = 0.
// Values are typical adult reference dimensions (see docs/implementation/master-redesign-phase-2-3/PHASE_3_SIMULATION.md).

export const EYE = {
  // Cornea: ~11.7 mm diameter, anterior radius ~7.8 mm, ~0.55 mm central / ~0.65 mm peripheral thickness.
  corneaApexZ: 3.85,
  corneaRc: 7.8,
  corneaRadius: 5.85,
  corneaCentralT: 0.55,
  corneaPeriphT: 0.65,
  // Crystalline lens: ~9.5 mm equatorial diameter, ~4 mm thick, anterior radius ~10 mm, posterior ~6 mm.
  lensEqZ: -1.3,
  lensEqR: 4.75,
  lensAntT: 1.6,
  lensPostT: 2.4,
  lensAntRc: 10,
  lensPostRc: 6,
  // Iris and pupil.
  irisRootR: 5.55,
  irisRootZ: 0.5,
  pupilNormal: 1.6,
  pupilDilated: 3.5,
  pupilAfter: 1.9,
  // Globe: sclera sphere (~24 mm axial length) meeting the cornea at the limbus.
  scleraR: 11.5,
  scleraT: 0.8,
  // Capsulorhexis radius used for the illustration only (not a surgical recommendation).
  rhexisR: 2.5,
  // IOL (one-piece hydrophobic acrylic): 6 mm optic, ~13 mm overall uncompressed.
  iolOpticR: 3,
  iolOverallR: 6.5,
  iolBagR: 4.65
};

const limbusZ = EYE.corneaApexZ - (EYE.corneaRc - Math.sqrt(EYE.corneaRc ** 2 - EYE.corneaRadius ** 2));
EYE.limbusZ = limbusZ;
// Sclera sphere centre chosen so the sphere passes exactly through the limbus.
EYE.scleraCenterZ = limbusZ - Math.sqrt(EYE.scleraR ** 2 - EYE.corneaRadius ** 2);
EYE.axialLength = EYE.corneaApexZ - (EYE.scleraCenterZ - EYE.scleraR);
EYE.focusZ = EYE.scleraCenterZ - EYE.scleraR + EYE.scleraT + 0.05; // retina at the posterior pole

const pAnt = EYE.lensEqR ** 2 / (2 * EYE.lensAntT * EYE.lensAntRc);
const pPost = EYE.lensEqR ** 2 / (2 * EYE.lensPostT * EYE.lensPostRc);

// Biconvex lens surface heights. z = eq + T * (1 - (r/R)^2)^p reproduces the apical radius of curvature
// (R_apex = R^2 / (2 T p)) and gives a smoothly rounded equator.
export function lensAntZ(r, s = 1) {
  const q = Math.max(0, 1 - (r / (EYE.lensEqR * s)) ** 2);
  return EYE.lensEqZ + EYE.lensAntT * s * Math.pow(q, pAnt);
}
export function lensPostZ(r, s = 1) {
  const q = Math.max(0, 1 - (r / (EYE.lensEqR * s)) ** 2);
  return EYE.lensEqZ - EYE.lensPostT * s * Math.pow(q, pPost);
}
export function corneaAntZ(r) {
  return EYE.corneaApexZ - (EYE.corneaRc - Math.sqrt(EYE.corneaRc ** 2 - r * r));
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

// Corneal meniscus: anterior sphere + posterior surface offset inward along the normal by a thickness
// that grows from central to peripheral values.
export function corneaProfile(n = 56) {
  const { corneaApexZ: apex, corneaRc: Rc, corneaRadius: R, corneaCentralT: tc, corneaPeriphT: tp } = EYE;
  const cz = apex - Rc;
  const ant = [], post = [];
  for (let k = 0; k <= n; k++) {
    const r = R * Math.sin((k / n) * Math.PI / 2);
    const z = corneaAntZ(r);
    const nx = r / Rc, nz = (z - cz) / Rc;
    const t = tc + (tp - tc) * (r / R) ** 2;
    ant.push([r, z]);
    post.push([r - nx * t, z - nz * t]);
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

// Iris solid for a given pupil radius (closed CCW loop: back surface, root, front surface, pupil rim).
export function irisProfile(pupilR, nFront = 40, nBack = 18) {
  const { irisRootR: rootR, irisRootZ: rootZ } = EYE;
  const zm = lensAntZ(Math.min(pupilR, EYE.lensEqR - 0.01)) + 0.16;
  const front = (s) => zm + (rootZ - zm) * s + 0.2 * Math.sin(Math.PI * s) * (1 - 0.35 * s);
  const thick = (s) => 0.1 + 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.08)), 0.75) + 0.04 * s;
  const rAt = (s) => pupilR + (rootR - pupilR) * s;
  const pts = [], vs = [];
  for (let k = 0; k <= nBack; k++) {
    const s = k / nBack;
    pts.push([rAt(s), front(s) - thick(s)]); vs.push(0.01);
  }
  pts.push([rootR, front(1) - thick(1)]); vs.push(0.01);
  pts.push([rootR, front(1)]); vs.push(1);
  for (let k = nFront; k >= 0; k--) {
    const s = k / nFront;
    pts.push([rAt(s), front(s)]); vs.push(0.055 + 0.945 * s);
  }
  // rounded pupil rim back down to the start
  for (let k = 1; k <= 4; k++) {
    const t = k / 4;
    const zTop = front(0), zBot = front(0) - thick(0);
    pts.push([pupilR - 0.035 * Math.sin(Math.PI * t), zTop + (zBot - zTop) * t]); vs.push(0.03);
  }
  return { pts, vs };
}

// Clear-corneal incision site (temporal limbus, +X) and the inward entry direction used for instrument paths.
export const INCISION = [5.45, 0, 1.3];
const ex = INCISION[0] - 0, ez = INCISION[2] - 0.4;
const el = Math.hypot(ex, ez);
export const ENTRY_OUT = [ex / el, 0, ez / el]; // unit vector pointing out of the eye through the incision

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const v3lerp = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const along = (base, dir, s) => [base[0] + dir[0] * s, base[1] + dir[1] * s, base[2] + dir[2] * s];

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
