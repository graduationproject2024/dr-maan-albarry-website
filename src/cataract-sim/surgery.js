// Pure surgical kinematics shared by the renderer (eye-model.js) and the constraint validator (constraints.js).
// No three.js here, so every motion that is drawn can also be sampled and checked in Node.
// These are patient-education depictions, NOT surgical technique or instrument settings.
import {
  EYE, FULCRUM, ENTRY_OUT, lensProfile, capsuleAntZ, lerp, smooth, clamp01, along, v3lerp, v3sub, v3add, v3scale
} from './anatomy.js';

// ---------------- Capsulorhexis: continuous curvilinear tear of the anterior capsule ----------------
// The central disc of anterior capsule (r < rhexisR) is torn along a circle starting at angle 0 and running
// counter-clockwise (seen by the surgeon). Torn capsule behind the tear front is folded over onto itself
// (a hinge that moves inwards), exactly where the forceps hold it. Once the circle closes, the free flap is
// gathered at the forceps tip (bunching membrane) and leaves with the forceps through the incision.
export const TAU = Math.PI * 2;
export function flapFold(theta, arc) {
  if (theta > arc) return 0;
  return smooth(0, 0.9, arc - theta);
}
// Position of the anterior-capsule point (r, theta) of the flap. `bunch` 0..1 gathers the free flap at `tip`.
export function flapPoint(r, theta, arc, bunch = 0, tip = null, anchor = tip) {
  const R = EYE.rhexisR;
  const f = flapFold(theta, arc);
  const c = Math.cos(theta), s = Math.sin(theta);
  let rr = r, z = capsuleAntZ(r) + 0.012;
  if (f > 0) {
    const rh = R * (1 - 0.42 * f);
    if (r > rh) {
      const d = r - rh, phi = Math.PI * 0.88 * f;
      rr = rh + d * Math.cos(phi);
      z = Math.max(capsuleAntZ(rh) + 0.012 + d * Math.sin(phi), capsuleAntZ(Math.abs(rr)) + 0.03 * f + 0.012);
    }
  }
  let p = [rr * c, rr * s, z];
  if (bunch > 0 && tip) {
    // deterministic crumple: contract towards the tip with a little out-of-plane wrinkle
    const k = 1 - 0.86 * bunch;
    const wrinkle = 0.06 * bunch * Math.sin(theta * 5 + r * 3);
    p = v3add(tip, v3scale(v3sub(p, anchor), k));
    p[2] += wrinkle;
  }
  return p;
}
// Where the forceps hold the flap: on the folded flap, just behind the tear front.
export function forcepsGrasp(arc) {
  const th = Math.max(0, arc - 0.5);
  const p = flapPoint(EYE.rhexisR * 0.96, th, arc);
  return [p[0], p[1], p[2] + 0.05];
}

// ---------------- Nucleus: four fragments ----------------
// The nucleus is a lathe of the lens profile scaled (0.66 radial, 0.62 axial), split into four quadrants.
export const NUC_RS = 0.66, NUC_ZS = 0.62;
export const QUAD_ANGLES = [0, 1, 2, 3].map((k) => Math.PI / 4 + (k * Math.PI) / 2); // quadrant centres
export const nucleusProfile = (n = 36) => lensProfile(NUC_RS, NUC_ZS, n);
// Sample points on the surface of quadrant k (eye coordinates, before any motion).
export function quadrantSamples(k, nPhi = 7) {
  const prof = nucleusProfile(18);
  const pts = [];
  const a0 = QUAD_ANGLES[k] - Math.PI / 4;
  for (let i = 0; i <= nPhi; i++) {
    const a = a0 + (i / nPhi) * (Math.PI / 2);
    for (const [r, z] of prof) pts.push([r * Math.cos(a), r * Math.sin(a), z]);
  }
  // the two flat cut faces
  for (const a of [a0, a0 + Math.PI / 2]) for (const [r, z] of prof) for (const f of [0.3, 0.6]) pts.push([r * f * Math.cos(a), r * f * Math.sin(a), z]);
  return pts;
}
export const QUAD_CENTROIDS = [0, 1, 2, 3].map((k) => {
  const prof = nucleusProfile(36);
  // area-weighted centroid of the profile (Pappus) gives the radius of the quadrant's centre of mass
  let A = 0, rc = 0, zc = 0;
  for (let i = 0; i < prof.length; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[(i + 1) % prof.length];
    const cr = r0 * z1 - r1 * z0;
    A += cr; rc += (r0 + r1) * cr; zc += (z0 + z1) * cr;
  }
  A /= 2; rc /= 6 * A; zc /= 6 * A;
  // centroid of a 90° sector of a solid of revolution: radial distance ≈ (∫r² dA / ∫r dA) · sin(π/4)/(π/4)
  let num = 0, den = 0;
  for (let i = 0; i < prof.length; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[(i + 1) % prof.length];
    const cr = r0 * z1 - r1 * z0;
    den += (r0 + r1) * cr / 6; num += (r0 * r0 + r0 * r1 + r1 * r1) * cr / 12;
  }
  const rMass = (num / den) * (Math.sin(Math.PI / 4) / (Math.PI / 4));
  const a = QUAD_ANGLES[k];
  return [rMass * Math.cos(a), rMass * Math.sin(a), zc];
});

// Phacoemulsification schedule (stage-5 local progress p):
//   0.00–0.14 probe enters through the incision and the capsular opening
//   0.14–0.32 central sculpting (probe sweeps across the nucleus centre)
//   0.30–0.38 the nucleus cracks into four quadrants that separate slightly (still inside the bag)
//   0.38–0.80 each quadrant in turn is drawn to the probe tip and emulsified/aspirated there
//   0.80–0.88 remaining cortex clears (simplified: irrigation/aspiration is not drawn separately)
//   0.88–1.00 probe withdraws through the incision
export const PHACO = { enter: 0.14, sculptEnd: 0.32, crack: [0.3, 0.38], quads: [0.38, 0.8], cortex: [0.8, 0.88], exit: 0.88 };
const SEP = 0.22; // mm radial separation after cracking
export function quadWindow(k) {
  const [a, b] = PHACO.quads, w = (b - a) / 4;
  return [a + k * w, a + (k + 1) * w];
}
export function phacoTipWork(k) {
  const a = QUAD_ANGLES[k];
  return [0.75 * Math.cos(a), 0.75 * Math.sin(a), EYE.lensEqZ + 0.35];
}
// State of every nucleus piece at stage-5 progress p. Returns [{offset:[..], scale, visible, centroid}].
export function nucleusPieces(p) {
  const split = smooth(PHACO.crack[0], PHACO.crack[1], p);
  return QUAD_CENTROIDS.map((c, k) => {
    const a = QUAD_ANGLES[k];
    const sepOff = [SEP * split * Math.cos(a), SEP * split * Math.sin(a), 0];
    const [w0, w1] = quadWindow(k);
    const t = clamp01((p - w0) / (w1 - w0));
    const move = smooth(0, 0.45, t), em = smooth(0.15, 0.97, t);
    const tip = phacoTipWork(k);
    // the piece is mobilised towards the tip (centroid -> tip) while it is emulsified (shrinks into the tip)
    const target = v3sub(tip, c);
    const offset = v3lerp(sepOff, target, move * 0.85);
    const scale = Math.max(0, 1 - em);
    return { offset, scale, visible: p < w1 && scale > 0.002, centroid: c, split };
  });
}
// Position of a nucleus-surface point `pt` of piece k under the piece transform.
export function pieceTransform(pt, piece) {
  const c = piece.centroid;
  return v3add(v3add(c, piece.offset), v3scale(v3sub(pt, c), piece.scale));
}
// Phaco probe tip during stage 5 (p in 0..1). Requires the outside parking helper from the caller.
export function phacoTip(p, outside, inside) {
  const center = [0.35, 0, EYE.lensEqZ + 0.95];
  if (p < PHACO.enter) {
    return pathKeys([{ t: 0, p: outside(26) }, { t: 0.07, p: outside(0.4) }, { t: 0.11, p: inside(1.4) }, { t: PHACO.enter, p: center }], p);
  }
  if (p < PHACO.sculptEnd) {
    const q = (p - PHACO.enter) / (PHACO.sculptEnd - PHACO.enter);
    // two gentle passes across the centre, slightly deeper each time (stays well inside the bag)
    const sweep = Math.sin(q * Math.PI * 2);
    return [0.35 + 1.0 * sweep, 0, EYE.lensEqZ + 0.95 - 0.45 * q];
  }
  const [a, b] = PHACO.quads;
  if (p < a) return v3lerp([0.35, 0, EYE.lensEqZ + 0.5], phacoTipWork(0), smooth(PHACO.sculptEnd, a, p));
  if (p < b) {
    const w = (b - a) / 4, k = Math.min(3, Math.floor((p - a) / w));
    const t = (p - a - k * w) / w;
    const from = k === 0 ? phacoTipWork(0) : phacoTipWork(k - 1);
    return v3lerp(from, phacoTipWork(k), smooth(0, 0.25, t));
  }
  if (p < PHACO.exit) {
    // cortex clean-up: slow circle well inside the capsular bag
    const t = (p - b) / (PHACO.exit - b);
    const ang = QUAD_ANGLES[3] + t * Math.PI * 1.2;
    const rad = lerp(0.75, 2.2, smooth(0, 0.3, t));
    return [rad * Math.cos(ang), rad * Math.sin(ang), EYE.lensEqZ + 0.35];
  }
  const end = (() => { const ang = QUAD_ANGLES[3] + Math.PI * 1.2; return [2.2 * Math.cos(ang), 2.2 * Math.sin(ang), EYE.lensEqZ + 0.35]; })();
  return pathKeys([{ t: PHACO.exit, p: end }, { t: 0.93, p: inside(1.4) }, { t: 0.95, p: outside(0.4) }, { t: 1, p: outside(26) }], p);
}
// Emulsified particles: small pieces leaving the active quadrant and vanishing inside the probe tip.
export const N_PARTICLES = 18;
export function particlesAt(p, tip, pieces) {
  const out = [];
  const [a, b] = PHACO.quads;
  if (p < a || p >= b) return out;
  const w = (b - a) / 4, k = Math.min(3, Math.floor((p - a) / w));
  const t = (p - a - k * w) / w;
  const piece = pieces[k];
  if (!piece.visible || t < 0.12) return out;
  const src = v3add(piece.centroid, piece.offset);
  const size = 0.55 * Math.max(0.25, piece.scale);
  for (let i = 0; i < N_PARTICLES; i++) {
    const phase = (t * 6 + i / N_PARTICLES) % 1; // each particle travels source -> tip, then respawns
    const g = 2.399963 * i; // golden-angle spread on the piece surface
    const start = [src[0] + size * Math.cos(g) * 0.8, src[1] + size * Math.sin(g) * 0.8, src[2] + size * 0.35 * Math.sin(g * 1.7)];
    const e = phase * phase;
    const pos = v3lerp(start, tip, e);
    out.push([pos[0], pos[1], pos[2], 0.11 * (1 - 0.8 * phase)]);
  }
  return out;
}
function pathKeys(keys, t) {
  if (t <= keys[0].t) return keys[0].p.slice();
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i].t) { const A = keys[i - 1], B = keys[i]; const u = (t - A.t) / (B.t - A.t); return v3lerp(A.p, B.p, u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2); }
  }
  return keys[keys.length - 1].p.slice();
}
export { pathKeys };

// ---------------- IOL (one-piece acrylic, 6 mm optic, C-loop haptics) ----------------
export const HAPTIC_POLAR = [[2.75, 0], [3.35, 14], [4.2, 30], [5.15, 50], [5.95, 75], [6.4, 102], [6.5, 122], [6.3, 140]];
// Uniform Catmull-Rom through the haptic control points (dense polyline; also used to build the tube).
export function hapticCentreline(rot, n = 64) {
  const P = HAPTIC_POLAR.map(([r, deg]) => { const a = rot + (deg * Math.PI) / 180; return [r * Math.cos(a), r * Math.sin(a), 0]; });
  const pts = [];
  const seg = P.length - 1;
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * seg, j = Math.min(seg - 1, Math.floor(u)), t = u - j;
    const p0 = P[Math.max(0, j - 1)], p1 = P[j], p2 = P[j + 1], p3 = P[Math.min(seg, j + 2)];
    const t2 = t * t, t3 = t2 * t;
    pts.push([0, 1, 2].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
  }
  return pts;
}
export const IOL_ROLL_K = 1.4;        // rolled curvature (1/mm) at fold = 1 -> rolled outer diameter ~2 mm
export const IOL_SQUEEZE = 0.5;       // optic thickness compression while rolled in the cartridge (visual)
export const HAPTIC_TUCKED = 0.16;    // radial haptic compression while folded in the cartridge
const maxCentreR = Math.max(...hapticCentreline(0).map((p) => Math.hypot(p[0], p[1])));
export const HAPTIC_BAG = (EYE.iolHapticBagR - EYE.iolOpticR) / (maxCentreR - EYE.iolOpticR);
// Deform a local IOL point: haptics compress radially (tucked -> engaged in the bag), and the whole IOL rolls
// about its local X axis (the haptic axis), as it does inside an injector cartridge.
export function iolDeform(x, y, z, fold, open) {
  const oR = EYE.iolOpticR;
  const c = lerp(HAPTIC_TUCKED, HAPTIC_BAG, open);
  const r = Math.hypot(x, y);
  if (r > oR) { const s = (oR + (r - oR) * c) / r; x *= s; y *= s; }
  const k = fold * IOL_ROLL_K;
  z *= lerp(1, IOL_SQUEEZE, fold);
  if (k > 1e-4) {
    const a = y * k; const rr = 1 / k - z;
    y = Math.sin(a) * rr; z = 1 / k - Math.cos(a) * rr;
    // keep the roll centred on the local X axis so the rolled IOL travels along the nozzle axis
    z -= (1 / k) * (1 - Math.cos(Math.min(Math.PI, EYE.iolOpticR * k))) / 2;
  }
  return [x, y, z];
}
// Local -> eye coordinates for the IOL group: rotation Euler XYZ (0, tilt, spin) then translation.
export function iolToWorld(p, iol) {
  const cs = Math.cos(iol.spin), ss = Math.sin(iol.spin), ct = Math.cos(iol.tilt || 0), st = Math.sin(iol.tilt || 0);
  const x1 = p[0] * cs - p[1] * ss, y1 = p[0] * ss + p[1] * cs, z1 = p[2];
  return [x1 * ct + z1 * st + iol.pos[0], y1 + iol.pos[1], -x1 * st + z1 * ct + iol.pos[2]];
}
// Undeformed local sample points: optic surfaces and rim, haptic tube surfaces (top/bottom/sides of centreline).
export function iolLocalSamples() {
  const pts = [];
  const oR = EYE.iolOpticR, T = EYE.iolHapticTube;
  for (const r of [0, 1, 2, 2.95]) {
    const n = r === 0 ? 1 : 16;
    const h = r === 0 ? EYE.iolCentreHalfT : (() => { const R = EYE.iolRc; const sag = (q) => R - Math.sqrt(R * R - q * q); return EYE.iolEdgeT + sag(oR) - sag(r); })();
    for (let i = 0; i < n; i++) { const a = (i / n) * TAU; pts.push([r * Math.cos(a), r * Math.sin(a), h], [r * Math.cos(a), r * Math.sin(a), -h]); }
  }
  for (const rot of [0, Math.PI]) {
    for (const [x, y] of hapticCentreline(rot, 28)) {
      const rr = Math.hypot(x, y) || 1;
      pts.push([x, y, T], [x, y, -T], [x + (x / rr) * T, y + (y / rr) * T, 0]);
    }
  }
  return pts;
}

// IOL insertion schedule (stage-6 local progress p) and injector nozzle placement.
export const NOZZLE_TIP_S = 1.25;     // nozzle tip sits this far inside the fulcrum along the tunnel axis
export const NOZZLE_BORE = 1.02;      // inner radius of the cartridge nozzle (~2 mm bore)
export const IOL_SCHEDULE = { inject: [0.18, 0.42], descend: [0.42, 0.66], settle: [0.66, 0.82], centre: [0.8, 0.92], out: [0.45, 0.6], collapse: [0.9, 1.0] };
export function nozzleTip() { return along(FULCRUM, ENTRY_OUT, -NOZZLE_TIP_S); }
export function iolState(p) {
  const S = IOL_SCHEDULE;
  if (p < S.inject[0]) return null;
  const tipN = nozzleTip();
  const tiltNozzle = -Math.asin(ENTRY_OUT[2]); // local X along the nozzle axis
  const emergeA = along(tipN, ENTRY_OUT, 3.0), emergeB = along(tipN, ENTRY_OUT, -3.6);
  const bag = [0, 0, EYE.iolCentreZ];
  const mid = [0.0, 0, EYE.iolCentreZ + 0.15];
  let pos, fold, tilt, spin, open;
  if (p < S.inject[1]) {
    const u = smooth(S.inject[0], S.inject[1], p);
    pos = v3lerp(emergeA, emergeB, u); fold = 1; tilt = tiltNozzle; spin = 0; open = 0;
  } else if (p < S.descend[1]) {
    const u = smooth(S.descend[0], S.descend[1], p);
    pos = v3lerp(emergeB, mid, u); fold = 1 - 0.85 * u; tilt = lerp(tiltNozzle, 0, u); spin = lerp(0, -0.35, u); open = 0;
  } else {
    const u = smooth(S.settle[0], S.settle[1], p);
    pos = v3lerp(mid, bag, u); fold = 0.15 * (1 - smooth(0, 0.5, u)); tilt = 0; open = smooth(0.3, 1, u);
    spin = lerp(-0.35, -0.7, u) * (1 - smooth(S.centre[0], S.centre[1], p));
  }
  return { pos, fold, tilt, spin, open };
}
