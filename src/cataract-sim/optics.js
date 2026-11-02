// Geometric ray tracing through the model's own surfaces (pure, no three.js).
// Method: rays parallel to the optical axis are intersected with each refracting surface z = f(r) (bisection),
// and refracted with the vector form of Snell's law using schematic-eye refractive indices (EYE.n*). Surfaces:
// anterior/posterior cornea, then either the crystalline lens (phakic) or the IOL optic (pseudophakic), ending
// on the retina (inner globe sphere). This is an EDUCATIONAL illustration in a simplified schematic eye
// (homogeneous lens index, no gradient index, no aberration data, no individual biometry). It is not a
// validated optical model and makes no claim about anyone's vision.
import { EYE, corneaAntZ, corneaPostZ, lensAntZ, lensPostZ, iolHalfT } from './anatomy.js';

const deriv = (f, r) => (f(r + 1e-4) - f(Math.max(0, r - 1e-4))) / (r + 1e-4 - Math.max(0, r - 1e-4));

export function surfaces(kind = 'pseudophakic') {
  const list = [
    { name: 'cornea-anterior', f: corneaAntZ, rMax: EYE.corneaRadius, n2: EYE.nCornea },
    { name: 'cornea-posterior', f: corneaPostZ, rMax: EYE.corneaPostEdgeR, n2: EYE.nAqueous }
  ];
  if (kind === 'phakic') {
    list.push({ name: 'lens-anterior', f: (r) => lensAntZ(r), rMax: EYE.lensEqR - 0.05, n2: EYE.nLens });
    list.push({ name: 'lens-posterior', f: (r) => lensPostZ(r), rMax: EYE.lensEqR - 0.05, n2: EYE.nVitreous });
  } else if (kind === 'pseudophakic') {
    const c = EYE.iolCentreZ;
    list.push({ name: 'iol-anterior', f: (r) => c + iolHalfT(r), rMax: EYE.iolOpticR, n2: EYE.nIOL });
    list.push({ name: 'iol-posterior', f: (r) => c - iolHalfT(r), rMax: EYE.iolOpticR, n2: EYE.nVitreous });
  }
  return list;
}

function intersect(o, d, s) {
  const g = (t) => { const x = o[0] + d[0] * t, y = o[1] + d[1] * t; return o[2] + d[2] * t - s.f(Math.hypot(x, y)); };
  let t0 = 1e-6, g0 = g(t0);
  for (let t = 0.02; t < 60; t += 0.02) {
    const g1 = g(t);
    if (Math.sign(g1) !== Math.sign(g0)) {
      let a = t0, b = t;
      for (let i = 0; i < 50; i++) { const m = 0.5 * (a + b); if (Math.sign(g(m)) === Math.sign(g0)) a = m; else b = m; }
      return 0.5 * (a + b);
    }
    t0 = t; g0 = g1;
  }
  return null;
}

export function refract(d, nrm, n1, n2) {
  let n = nrm;
  let cosi = -(n[0] * d[0] + n[1] * d[1] + n[2] * d[2]);
  if (cosi < 0) { n = [-n[0], -n[1], -n[2]]; cosi = -cosi; }
  const eta = n1 / n2, k = 1 - eta * eta * (1 - cosi * cosi);
  if (k < 0) return null; // total internal reflection (does not occur for these rays)
  const a = eta * cosi - Math.sqrt(k);
  return [eta * d[0] + a * n[0], eta * d[1] + a * n[1], eta * d[2] + a * n[2]];
}

// Trace a ray parallel to the axis at lateral offset (x, y), starting at zStart. Returns { points, dirs } where
// points include each surface hit and finally the retina hit.
export function traceAxial(x, y, kind = 'pseudophakic', { zStart = 17, stopAfter = Infinity } = {}) {
  let o = [x, y, zStart], d = [0, 0, -1], n1 = EYE.nAir;
  const points = [o.slice()];
  const list = surfaces(kind);
  for (let i = 0; i < list.length && i < stopAfter; i++) {
    const s = list[i];
    const t = intersect(o, d, s);
    if (t === null) return { points, dir: d, blocked: s.name };
    o = [o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t];
    const r = Math.hypot(o[0], o[1]);
    if (r > s.rMax) return { points, dir: d, blocked: s.name };
    const fp = deriv(s.f, r);
    const nrm = r > 1e-9 ? [-fp * o[0] / r, -fp * o[1] / r, 1] : [0, 0, 1];
    const l = Math.hypot(...nrm);
    const nd = refract(d, [nrm[0] / l, nrm[1] / l, nrm[2] / l], n1, s.n2);
    if (!nd) return { points, dir: d, blocked: s.name };
    d = nd; n1 = s.n2;
    points.push(o.slice());
  }
  if (stopAfter < list.length) return { points, dir: d };
  // retina: inside a sphere centred on the axis -> the forward root
  const cz = EYE.scleraCenterZ, R = EYE.retinaR;
  const oc = [o[0], o[1], o[2] - cz];
  const b = oc[0] * d[0] + oc[1] * d[1] + oc[2] * d[2];
  const c = oc[0] ** 2 + oc[1] ** 2 + oc[2] ** 2 - R * R;
  const t = -b + Math.sqrt(Math.max(0, b * b - c));
  points.push([o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t]);
  return { points, dir: d };
}

// Paraxial back focus: where a near-axis ray crosses the axis after the last refracting surface.
export function paraxialFocusZ(kind = 'pseudophakic', h = 0.05) {
  const list = surfaces(kind);
  const tr = traceAxial(h, 0, kind, { stopAfter: list.length });
  const o = tr.points[tr.points.length - 1], d = tr.dir;
  const t = -o[0] / d[0];
  return o[2] + d[2] * t;
}
