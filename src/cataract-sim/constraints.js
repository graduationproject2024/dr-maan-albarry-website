// Deterministic geometric constraint validator for the cataract simulator (pure JS, runs in Node).
// It samples paramsAt(stage, p) over a fine grid and checks every drawn moving part against bounding volumes
// built from the same anatomy functions the renderer uses.
//
// IMPORTANT: "collision-free" only means the illustration does not show physically impossible overlaps in this
// simplified rigid model. It does NOT mean the motions are surgically accurate or approved.
import {
  EYE, FULCRUM, ENTRY_OUT, WOUND, corneaAntZ, corneaPostZ, capsuleAntZ, capsulePostZ, irisBoundsAt,
  instrumentAxis, outsideAlong, v3sub, v3dot, v3len, v3add, v3scale, lensPostZ
} from './anatomy.js';
import { STAGES, paramsAt } from './stages.js';
import {
  TAU, flapPoint, nucleusPieces, quadrantSamples, pieceTransform, iolLocalSamples, iolDeform, iolToWorld,
  nozzleTip, NOZZLE_BORE
} from './surgery.js';

export const LIMITS = {
  tipRadius: 0.12,          // mm, instrument tip treated as a small sphere
  maxPivotDeg: 40,          // max angle between the shaft and the tunnel axis (instruments pivot about the wound)
  maxTipSpeed: 30,          // mm per second of playback inside / at the eye (no teleporting between frames)
  maxTipSpeedOutside: 150,  // mm per second while approaching or leaving outside the eye
  capsuleClear: 0.02,       // mm, required clearance in front of the posterior capsule
  bagSlack: 0.03            // mm tolerance for IOL/fragment containment in the bag
};

const rOf = (p) => Math.hypot(p[0], p[1]);

// ---------------- bounding volumes ----------------
// Cornea solid: between the posterior and anterior surfaces, inside the limbus.
export function insideCornea(p, pad = 0) {
  const r = rOf(p);
  if (r > EYE.corneaPostEdgeR) return false;
  return p[2] < corneaAntZ(r) + pad && p[2] > corneaPostZ(r) - pad;
}
// Anterior to the corneal endothelium (inside the cornea or outside the eye in front of it).
export function anteriorToEndothelium(p) {
  const r = rOf(p);
  return r <= EYE.corneaPostEdgeR && p[2] > corneaPostZ(r);
}
export function insideIris(p, pupilR, collapse, pad = 0) {
  const b = irisBoundsAt(rOf(p), pupilR, collapse);
  return !!b && p[2] < b.front + pad && p[2] > b.back - pad;
}
// Behind the posterior capsule (vitreous side).
export function behindPosteriorCapsule(p, collapse, clear = 0) {
  const r = rOf(p);
  if (r >= EYE.lensEqR) return false;
  return p[2] < capsulePostZ(r, collapse) + clear;
}
// Inside the capsular bag (between anterior and posterior capsule, inside the equator).
export function insideBag(p, collapse, slack = 0) {
  const r = rOf(p);
  if (r > EYE.lensEqR + slack) return false;
  return p[2] <= capsuleAntZ(Math.min(r, EYE.lensEqR), collapse) + slack && p[2] >= capsulePostZ(Math.min(r, EYE.lensEqR), collapse) - slack;
}
// Anterior chamber + bag ("inside the eye in front of the vitreous"): below the endothelium, not in the iris,
// in front of the posterior capsule, inside the angle.
export function insideAnteriorSegment(p, P) {
  const r = rOf(p);
  if (r > EYE.irisRootR) return false;
  if (anteriorToEndothelium(p)) return false;
  if (insideIris(p, P.pupilR, P.bagCollapse)) return false;
  return !behindPosteriorCapsule(p, P.bagCollapse);
}
const nearWound = (p) => v3len(v3sub(p, FULCRUM)) < WOUND.exemptRadius;
const isOutsideEye = (p) => outsideAlong(p) > 0.5 && !insideCornea(p);

// ---------------- checks ----------------
function checkInstrument(P, at, out) {
  const ins = P.instrument;
  if (!ins) return;
  const tip = ins.tip;
  const add = (type, detail) => out.push({ ...at, part: ins.kind, type, detail });
  const axis = instrumentAxis(tip);
  // path constraint: the shaft passes through the fulcrum whenever the tip is inside the eye
  if (outsideAlong(tip) < -0.05) {
    const toF = v3sub(FULCRUM, tip);
    const cross = v3len([toF[1] * axis[2] - toF[2] * axis[1], toF[2] * axis[0] - toF[0] * axis[2], toF[0] * axis[1] - toF[1] * axis[0]]);
    if (cross > 1e-6) add('fulcrum', `shaft misses fulcrum by ${cross.toFixed(4)} mm`);
    const piv = (Math.acos(Math.min(1, v3dot(axis, ENTRY_OUT))) * 180) / Math.PI;
    if (piv > LIMITS.maxPivotDeg) add('pivot', `pivot ${piv.toFixed(1)}° > ${LIMITS.maxPivotDeg}°`);
  } else {
    // outside the eye the tip travels on the tunnel axis line (enters and leaves only through the incision)
    const rel = v3sub(tip, FULCRUM);
    const off = v3len(v3sub(rel, v3scale(ENTRY_OUT, v3dot(rel, ENTRY_OUT))));
    if (off > 0.05) add('approach', `outside the eye but ${off.toFixed(3)} mm off the tunnel axis`);
  }
  // tip penetration (the wound region itself is exempt: tissue deformation there is not modelled)
  if (!nearWound(tip)) {
    if (insideCornea(tip, LIMITS.tipRadius)) add('tip-cornea', 'tip inside corneal stroma');
    if (insideIris(tip, P.pupilR, P.bagCollapse, LIMITS.tipRadius * 0.5)) add('tip-iris', 'tip inside iris');
    if (behindPosteriorCapsule(tip, P.bagCollapse, LIMITS.capsuleClear + LIMITS.tipRadius)) add('tip-posterior-capsule', `tip z ${tip[2].toFixed(3)} behind posterior capsule`);
  }
  // shaft centre-line from the tip to the fulcrum
  if (outsideAlong(tip) < -0.05) {
    const L = v3len(v3sub(FULCRUM, tip));
    for (let s = 0.1; s < L; s += 0.1) {
      const q = v3add(tip, v3scale(axis, s));
      if (nearWound(q)) continue;
      if (insideCornea(q)) { add('shaft-cornea', 'shaft crosses cornea away from the wound'); break; }
      if (insideIris(q, P.pupilR, P.bagCollapse)) { add('shaft-iris', 'shaft crosses iris'); break; }
      if (behindPosteriorCapsule(q, P.bagCollapse)) { add('shaft-posterior-capsule', 'shaft behind posterior capsule'); break; }
    }
  }
}

const IOL_SAMPLES = iolLocalSamples();
export function iolWorldPoints(iol) {
  return IOL_SAMPLES.map((q) => iolToWorld(iolDeform(q[0], q[1], q[2], iol.fold, iol.open), iol));
}
function insideNozzle(p, P) {
  if (!P.instrument || P.instrument.kind !== 'injector') return false;
  const tip = P.instrument.tip, axis = instrumentAxis(tip);
  const rel = v3sub(p, tip), a = v3dot(rel, axis);
  if (a < -0.05 || a > 30) return false;
  return v3len(v3sub(rel, v3scale(axis, a))) <= NOZZLE_BORE + 0.02;
}
function checkIOL(P, at, out) {
  if (!P.iol) return;
  const add = (type, detail) => out.push({ ...at, part: 'iol', type, detail });
  const pts = iolWorldPoints(P.iol);
  let bad = { cornea: 0, iris: 0, post: 0, outside: 0 };
  for (const q of pts) {
    if (insideNozzle(q, P)) continue; // still inside the injector cartridge
    if (anteriorToEndothelium(q) || rOf(q) > EYE.corneaPostEdgeR && q[2] > EYE.corneaPostEdgeZ) bad.cornea++;
    if (insideIris(q, P.pupilR, P.bagCollapse)) bad.iris++;
    if (behindPosteriorCapsule(q, P.bagCollapse, LIMITS.capsuleClear)) bad.post++;
    if (rOf(q) > EYE.lensEqR + LIMITS.bagSlack) bad.outside++;
  }
  if (bad.cornea) add('iol-cornea', `${bad.cornea} IOL samples at/in the cornea`);
  if (bad.iris) add('iol-iris', `${bad.iris} IOL samples inside the iris`);
  if (bad.post) add('iol-posterior-capsule', `${bad.post} IOL samples behind the posterior capsule`);
  if (bad.outside) add('iol-beyond-equator', `${bad.outside} IOL samples beyond the bag equator`);
}
function checkFlap(P, at, out) {
  if (!P.flap) return;
  const f = P.flap;
  let bad = 0;
  for (let i = 0; i <= 8; i++) for (let j = 0; j < 24; j++) {
    const q = flapPoint(EYE.rhexisR * (i / 8), (j / 24) * TAU, f.arc, f.bunch, f.tip, f.anchor);
    if (nearWound(q)) continue;
    if (anteriorToEndothelium(q) || insideIris(q, P.pupilR, P.bagCollapse) || behindPosteriorCapsule(q, P.bagCollapse)) bad++;
  }
  if (bad) out.push({ ...at, part: 'flap', type: 'flap-containment', detail: `${bad} flap samples outside the anterior chamber` });
}
const QUAD_SAMPLES = [0, 1, 2, 3].map((k) => quadrantSamples(k));
function checkNucleus(P, at, out) {
  const pieces = nucleusPieces(P.nucleusP);
  pieces.forEach((pc, k) => {
    if (!pc.visible) return;
    let bad = 0;
    for (const q of QUAD_SAMPLES[k]) if (!insideBag(pieceTransform(q, pc), P.bagCollapse, LIMITS.bagSlack)) bad++;
    if (bad) out.push({ ...at, part: `nucleus-${k}`, type: 'nucleus-outside-bag', detail: `${bad} samples outside the capsular bag` });
  });
  for (const [x, y, z] of P.particles) {
    const q = [x, y, z];
    if (!insideBag(q, P.bagCollapse, 0.15) && !insideAnteriorSegment(q, P)) out.push({ ...at, part: 'particle', type: 'particle-outside', detail: q.map((v) => v.toFixed(2)).join(',') });
  }
}

// Persistent anatomical fields must be continuous across stage boundaries (no jumps between stages).
const PERSIST = ['pupilR', 'cataract', 'cortexOpacity', 'rhexisArc', 'rhexisOpen', 'incision', 'bagCollapse', 'nucleusP'];

export function validate({ steps = 400 } = {}) {
  const violations = [];
  let samples = 0;
  for (let i = 0; i < STAGES.length; i++) {
    let prevTip = null, prevKind = null, prevP = 0;
    for (let k = 0; k <= steps; k++) {
      const p = k / steps;
      const P = paramsAt(i, p);
      samples++;
      const at = { stage: i + 1, id: STAGES[i].id, p: +p.toFixed(4) };
      checkInstrument(P, at, violations);
      checkIOL(P, at, violations);
      checkFlap(P, at, violations);
      checkNucleus(P, at, violations);
      // transform consistency: instruments appear/disappear only outside the eye, and never jump
      const kind = P.instrument ? P.instrument.kind : null;
      if (kind !== prevKind) {
        const tip = kind ? P.instrument.tip : prevTip;
        if (tip && !isOutsideEye(tip)) violations.push({ ...at, part: kind || prevKind, type: 'appear-inside', detail: 'instrument appears or vanishes inside the eye' });
      } else if (kind && prevTip) {
        const v = v3len(v3sub(P.instrument.tip, prevTip)) / ((p - prevP) * STAGES[i].duration);
        const out = Math.min(outsideAlong(P.instrument.tip), outsideAlong(prevTip)) > 0.3;
        if (v > (out ? LIMITS.maxTipSpeedOutside : LIMITS.maxTipSpeed)) violations.push({ ...at, part: kind, type: 'tip-speed', detail: `${v.toFixed(1)} mm/s` });
      }
      prevKind = kind; prevTip = P.instrument ? P.instrument.tip : prevTip; prevP = p;
    }
    // final IOL position: centred, unfolded, haptics engaged in the bag, behind the iris
    if (STAGES[i].id === 'iol') {
      const P = paramsAt(i, 1);
      const at = { stage: i + 1, id: STAGES[i].id, p: 1 };
      const I = P.iol;
      if (!I || Math.hypot(I.pos[0], I.pos[1]) > 0.02 || I.fold > 1e-3 || I.open < 0.999 || Math.abs(I.spin) > 1e-3) violations.push({ ...at, part: 'iol', type: 'iol-final', detail: 'IOL not centred, unfolded and engaged' });
      else {
        const pts = iolWorldPoints(I);
        const maxR = Math.max(...pts.map(rOf));
        if (maxR < EYE.lensEqR - 0.35 || maxR > EYE.lensEqR) violations.push({ ...at, part: 'iol', type: 'haptic-equator', detail: `haptic reach ${maxR.toFixed(2)} mm vs bag equator ${EYE.lensEqR}` });
        const notInBag = pts.filter((q) => rOf(q) > EYE.rhexisR && !insideBag(q, P.bagCollapse, LIMITS.bagSlack)).length;
        if (notInBag) violations.push({ ...at, part: 'iol', type: 'iol-not-in-bag', detail: `${notInBag} samples outside the bag` });
        const inFront = pts.filter((q) => { const b = irisBoundsAt(rOf(q), P.pupilR, P.bagCollapse); return b && q[2] > b.back; }).length;
        if (inFront) violations.push({ ...at, part: 'iol', type: 'iol-not-behind-iris', detail: `${inFront} samples in front of the iris` });
      }
    }
  }
  // stage boundaries: persistent fields of stage i at p=1 equal stage i+1 at p=0
  for (let i = 0; i + 1 < STAGES.length; i++) {
    const A = paramsAt(i, 1), B = paramsAt(i + 1, 0);
    for (const f of PERSIST) {
      const a = A[f], b = B[f];
      const same = typeof a === 'number' ? Math.abs(a - b) < 1e-9 : a === b;
      if (!same) violations.push({ stage: i + 1, id: STAGES[i].id, p: 1, part: 'state', type: 'boundary-jump', detail: `${f}: ${a} -> ${b}` });
    }
    if (JSON.stringify(A.iol) !== JSON.stringify(B.iol)) violations.push({ stage: i + 1, id: STAGES[i].id, p: 1, part: 'iol', type: 'boundary-jump', detail: 'IOL pose differs across the boundary' });
  }
  // static anatomy: layer order along every radius
  const anat = [];
  for (let r = 0; r <= EYE.lensEqR; r += 0.05) {
    for (const pupilR of [EYE.pupilNormal, EYE.pupilAfter, EYE.pupilDilated]) {
      for (const c of [0, 1]) {
        const b = irisBoundsAt(r, pupilR, c);
        if (b && r < EYE.corneaPostEdgeR && b.front >= corneaPostZ(r)) anat.push(`iris touches cornea at r=${r.toFixed(2)}`);
        if (b && c === 0 && b.back <= capsuleAntZ(Math.min(r, EYE.lensEqR), 0)) anat.push(`iris intersects lens at r=${r.toFixed(2)} pupil=${pupilR}`);
        if (b && c === 1 && r < EYE.lensEqR && b.back <= capsuleAntZ(r, 1)) anat.push(`iris intersects capsule/IOL at r=${r.toFixed(2)}`);
      }
    }
    if (r < EYE.corneaPostEdgeR && capsuleAntZ(r, 0) >= corneaPostZ(r)) anat.push(`lens touches cornea at r=${r.toFixed(2)}`);
    if (capsuleAntZ(r, 1) < capsulePostZ(r, 1)) anat.push(`collapsed bag inverted at r=${r.toFixed(2)}`);
    if (lensPostZ(r) > capsulePostZ(r, 1) + 1e-9) anat.push(`collapse moves posterior capsule backwards at r=${r.toFixed(2)}`);
  }
  for (const d of anat) violations.push({ stage: 0, id: 'anatomy', p: 0, part: 'anatomy', type: 'layer-order', detail: d });
  return { samples, steps, violations };
}

// Deterministic replay: the same (stage, p) always yields an identical parameter set.
export function checkDeterminism(points = [[0, 0.3], [3, 0.47], [4, 0.61], [5, 0.5], [6, 0.9]]) {
  const snap = () => points.map(([i, p]) => JSON.stringify(paramsAt(i, p)));
  const a = snap();
  for (let i = 0; i < STAGES.length; i++) paramsAt(i, Math.random()); // unrelated calls in between
  const b = snap();
  return a.every((s, k) => s === b[k]);
}

export function summarise(result) {
  const byType = {};
  for (const v of result.violations) byType[v.type] = (byType[v.type] || 0) + 1;
  return { samples: result.samples, violations: result.violations.length, byType };
}
