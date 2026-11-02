// Schematic-eye geometry for the procedure illustrations (pure maths, no three.js).
//
// Units: millimetres. Eye coordinates: +Z is the optical axis pointing out of the eye (anterior),
// +X is "up" in every illustration, the section plane is y = 0 and the half y > 0 is kept.
//
// The lens / cornea / iris maths below were COPIED (not imported) from src/cataract-sim/anatomy.js so this
// render pipeline keeps working while that module is edited elsewhere. Values changed from that source:
//   corneaCentralT 0.55 -> 0.52 mm, corneaPeriphT 0.65 -> 0.67 mm, scleraR 11.5 -> 11.25 mm (axial length
//   23.5 mm), scleraT 0.8 -> 0.75 mm. Choroid, retina, ciliary body and ora serrata are new here.
//
// Reference dimensions (typical adult, schematic eyes of Gullstrand, Navarro and Liou-Brennan, and standard
// anatomy texts): anterior corneal radius ~7.8 mm, central corneal thickness ~0.52 mm, horizontal corneal
// diameter ~11.7 mm, anterior chamber depth ~3.0 mm, crystalline lens ~4.0 mm thick and ~9.5 mm wide with
// anterior radius ~10 mm and posterior radius ~6 mm, axial length ~23.5 mm, pars plana ~3.5-4 mm and
// ora serrata ~6.5-7 mm behind the limbus.

export const EYE = {
  corneaApexZ: 3.85,
  corneaRc: 7.8,
  corneaRadius: 5.85,
  corneaCentralT: 0.52,
  corneaPeriphT: 0.67,
  lensEqZ: -1.3,
  lensEqR: 4.75,
  lensAntT: 1.6,
  lensPostT: 2.4,
  lensAntRc: 10,
  lensPostRc: 6,
  irisRootR: 5.55,
  irisRootZ: 0.5,
  pupilR: 2.0,
  scleraR: 11.25,
  scleraT: 0.75,
  choroidT: 0.22,
  retinaT: 0.24
};

EYE.limbusZ = EYE.corneaApexZ - (EYE.corneaRc - Math.sqrt(EYE.corneaRc ** 2 - EYE.corneaRadius ** 2));
EYE.cz = EYE.limbusZ - Math.sqrt(EYE.scleraR ** 2 - EYE.corneaRadius ** 2); // globe (sclera sphere) centre
EYE.Ri = EYE.scleraR - EYE.scleraT; // inner scleral radius
EYE.axialLength = EYE.corneaApexZ - (EYE.cz - EYE.scleraR);
EYE.aLimbus = Math.asin(EYE.corneaRadius / EYE.scleraR); // polar angle of the limbus on the outer sphere
EYE.aOra = EYE.aLimbus + 6.6 / EYE.Ri; // ora serrata ~6.6 mm behind the limbus (arc on the inner wall)

const DEG = Math.PI / 180;
export { DEG };

const pAnt = EYE.lensEqR ** 2 / (2 * EYE.lensAntT * EYE.lensAntRc);
const pPost = EYE.lensEqR ** 2 / (2 * EYE.lensPostT * EYE.lensPostRc);

export function lensAntZ(r, s = 1) {
  const q = Math.max(0, 1 - (r / (EYE.lensEqR * s)) ** 2);
  return EYE.lensEqZ + EYE.lensAntT * s * Math.pow(q, pAnt);
}
export function lensPostZ(r, s = 1) {
  const q = Math.max(0, 1 - (r / (EYE.lensEqR * s)) ** 2);
  return EYE.lensEqZ - EYE.lensPostT * s * Math.pow(q, pPost);
}
// Closed lens profile [r, z] (posterior pole -> equator -> anterior pole). s scales about the equator plane.
export function lensProfile(s = 1, n = 48) {
  const pts = [];
  const R = EYE.lensEqR * s;
  for (let k = 0; k <= n; k++) { const r = R * Math.sin((k / n) * Math.PI / 2); pts.push([r, lensPostZ(r, s)]); }
  for (let k = n - 1; k >= 0; k--) { const r = R * Math.sin((k / n) * Math.PI / 2); pts.push([r, lensAntZ(r, s)]); }
  return pts;
}

export function corneaAntZ(r) {
  return EYE.corneaApexZ - (EYE.corneaRc - Math.sqrt(EYE.corneaRc ** 2 - r * r));
}
export function corneaThickness(r) {
  return EYE.corneaCentralT + (EYE.corneaPeriphT - EYE.corneaCentralT) * (r / EYE.corneaRadius) ** 2;
}

// Point on a sphere about the globe centre at polar angle a (from +Z), in [r, z].
export function shellPoint(radius, a) {
  return [radius * Math.sin(a), EYE.cz + radius * Math.cos(a)];
}
export function polarOf(r, z) {
  return { a: Math.atan2(r, z - EYE.cz), rad: Math.hypot(r, z - EYE.cz) };
}

// Monotone-ish smooth interpolation through [x, y] keys (Catmull-Rom, clamped ends).
export function spline(keys) {
  return (x) => {
    if (x <= keys[0][0]) return keys[0][1];
    const n = keys.length;
    if (x >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0;
    while (keys[i + 1][0] < x) i++;
    const p0 = keys[Math.max(0, i - 1)], p1 = keys[i], p2 = keys[i + 1], p3 = keys[Math.min(n - 1, i + 2)];
    const t = (x - p1[0]) / (p2[0] - p1[0]);
    const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * (p2[0] - p1[0]);
    const m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * (p2[0] - p1[0]);
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
  };
}

// Cornea posterior margin point (where the corneal back surface meets the angle / sclera).
export function corneaPostMargin() {
  const R = EYE.corneaRadius, z = corneaAntZ(R), czc = EYE.corneaApexZ - EYE.corneaRc;
  const nx = R / EYE.corneaRc, nz = (z - czc) / EYE.corneaRc, t = corneaThickness(R);
  return [R - nx * t, z - nz * t];
}

// Sclera shell: outer pole -> outer limbus -> corneal back margin -> inner wall -> inner pole.
export function scleraProfile(n = 90) {
  const { scleraR: R, Ri, aLimbus } = EYE;
  const aIn = 31.4 * DEG;
  const pts = [];
  for (let k = 0; k <= n; k++) pts.push(shellPoint(R, Math.PI - (Math.PI - aLimbus) * (k / n)));
  pts.push(corneaPostMargin());
  for (let k = 0; k <= n; k++) pts.push(shellPoint(Ri, aIn + (Math.PI - aIn) * (k / n)));
  return pts;
}

// Ciliary body depth (inward from the inner scleral wall) as a function of polar angle in degrees.
// Steep anterior face (iris insertion), ciliary processes (pars plicata) and the thin pars plana.
const ciliaryDepth = spline([
  [31.4, 0], [32.0, 0.42], [32.9, 0.86], [34.2, 1.17], [35.6, 1.26], [37.2, 1.08], [39.6, 0.7],
  [42.5, 0.42], [50, 0.3], [EYE.aOra / DEG, EYE.choroidT]
]);
export function ciliaryProfile(n = 70) {
  const a0 = 31.4 * DEG, a1 = EYE.aOra;
  const outer = [], inner = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const a = a0 + (a1 - a0) * Math.pow(t, 1.6); // denser samples at the processes
    outer.push(shellPoint(EYE.Ri, a));
    inner.push(shellPoint(EYE.Ri - Math.max(0.001, ciliaryDepth(a / DEG)), a));
  }
  return [...outer, ...inner.reverse()];
}
export function ciliaryTip() {
  return shellPoint(EYE.Ri - 1.26, 35.6 * DEG);
}

// Retinal thickness with a foveal pit at the posterior pole (d = arc distance from the pole in mm).
export function retinaThickness(a) {
  const d = (Math.PI - a) * (EYE.Ri - EYE.choroidT);
  const fromOra = (a - EYE.aOra) * EYE.Ri;
  const taper = Math.min(1, fromOra / 1.2);
  const base = 0.13 + 0.11 * Math.exp(-((d / 6) ** 2)); // thicker around the macula
  const pit = 0.16 * Math.exp(-((d / 0.55) ** 2));
  const rim = 0.06 * Math.exp(-(((d - 1.1) / 0.5) ** 2));
  return Math.max(0.03, (base - pit + rim) * (0.35 + 0.65 * taper));
}

export function choroidProfile(n = 90) {
  const { Ri, choroidT, aOra } = EYE;
  const outer = [], inner = [];
  for (let k = 0; k <= n; k++) {
    const a = aOra + (Math.PI - aOra) * (k / n);
    outer.push(shellPoint(Ri, a));
    inner.push(shellPoint(Ri - choroidT, a));
  }
  return [...inner.slice().reverse(), ...outer]; // inner pole -> inner ora -> outer ora -> outer pole
}

export function retinaProfile(n = 140) {
  const { Ri, choroidT, aOra } = EYE;
  const outer = [], inner = [];
  for (let k = 0; k <= n; k++) {
    const a = aOra + (Math.PI - aOra) * (k / n);
    outer.push(shellPoint(Ri - choroidT, a));
    inner.push(shellPoint(Ri - choroidT - retinaThickness(a), a));
  }
  return [...inner.slice().reverse(), ...outer];
}

// Iris solid (closed loop) for a pupil radius. `lift` moves the pupillary part forward (e.g. over an ICL).
export function irisProfile(pupilR = EYE.pupilR, lift = 0, nFront = 44, nBack = 22) {
  const { irisRootR: rootR, irisRootZ: rootZ } = EYE;
  const zm = lensAntZ(Math.min(pupilR, EYE.lensEqR - 0.01)) + 0.16 + lift;
  const front = (s) => zm + (rootZ - zm) * s + 0.2 * Math.sin(Math.PI * s) * (1 - 0.35 * s);
  const thick = (s) => 0.1 + 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.08)), 0.75) + 0.04 * s;
  const rAt = (s) => pupilR + (rootR - pupilR) * s;
  const pts = [];
  for (let k = 0; k <= nBack; k++) { const s = k / nBack; pts.push([rAt(s), front(s) - thick(s)]); }
  pts.push([rootR, front(1)]);
  for (let k = nFront; k >= 0; k--) { const s = k / nFront; pts.push([rAt(s), front(s)]); }
  for (let k = 1; k <= 5; k++) {
    const t = k / 6, zTop = front(0), zBot = front(0) - thick(0);
    pts.push([pupilR - 0.04 * Math.sin(Math.PI * t), zTop + (zBot - zTop) * t]);
  }
  return pts;
}

// Mirror a lathe profile that starts and ends on the axis into one full-section polygon in (x, z).
export function fullSection(profile) {
  const right = profile.map(([r, z]) => [r, z]);
  const left = profile.slice().reverse().map(([r, z]) => [-r, z]);
  return [...right, ...left];
}
export function mirrorX(poly) {
  return poly.map(([x, z]) => [-x, z]);
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
