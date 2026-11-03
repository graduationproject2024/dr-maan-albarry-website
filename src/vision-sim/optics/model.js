// Vision simulator — pure, deterministic optical model (no DOM, no three.js, no randomness, no time).
// Educational approximation — not patient-specific, not clinically validated. Pending review by Dr. Maan.
// Equations and assumptions: docs/implementation/clinical-visual-reconstruction/VISION_OPTICAL_MODEL.md
import {
  BOUNDS, BANDS, DISTANCES, LENSES, LENS_IDS, LIGHTING_IDS, LIGHTING_GRADE, PUPIL_BY_LIGHTING, VIEWING, SCENARIOS, SCENARIO_IDS,
} from './params.js';

const ARCMIN_PER_RAD = (180 / Math.PI) * 60; // ≈ 3437.75

/** Clamp a value into [lo, hi]; non-finite input falls back to `fallback` (then clamped). */
export function clamp(v, lo, hi, fallback = lo) {
  const n = Number.isFinite(v) ? v : fallback;
  return Math.min(hi, Math.max(lo, n));
}

export const clampDistance = (m) => clamp(m, BOUNDS.distanceM[0], BOUNDS.distanceM[1], DISTANCES.distance);
export const clampPupil = (mm) => clamp(mm, BOUNDS.pupilMm[0], BOUNDS.pupilMm[1], PUPIL_BY_LIGHTING.day);
export const lensProfile = (id) => LENSES[LENS_IDS.includes(id) ? id : 'monofocal'];
export const lightingId = (id) => (LIGHTING_IDS.includes(id) ? id : 'day');

/** Object vergence demand (D) of a target at `distanceM` metres: V = 1 / d. */
export function vergence(distanceM) {
  return 1 / clampDistance(distanceM);
}

/** Pupil diameter (mm) for a lighting condition, unless an explicit (clamped) override is given. */
export function pupilFor(lighting, overrideMm) {
  if (Number.isFinite(overrideMm)) return clampPupil(overrideMm);
  return PUPIL_BY_LIGHTING[lightingId(lighting)];
}

/** Residual refraction, clamped to bounds. Minus-cylinder convention; axis in degrees [0, 180). */
export function normalizeRefraction(r = {}) {
  const sphereD = clamp(r.sphereD ?? 0, BOUNDS.sphereD[0], BOUNDS.sphereD[1], 0);
  let cylD = Number.isFinite(r.cylD) ? r.cylD : 0;
  cylD = clamp(-Math.abs(cylD), BOUNDS.cylD[0], BOUNDS.cylD[1], 0); // accept either sign, store minus-cyl
  let axisDeg = Number.isFinite(r.axisDeg) ? r.axisDeg % 180 : 180;
  if (axisDeg < 0) axisDeg += 180;
  if (axisDeg === 0) axisDeg = 180;
  return { sphereD, cylD, axisDeg };
}

/**
 * Defocus (D) of one focus for a target at distanceM:  ΔD = 1/d − (V_focus − S)
 * where V_focus is the focus's in-focus vergence and S the residual spectacle sphere (a myope, S < 0, is
 * in focus nearer). ΔD = 0 at the in-focus distance.
 */
export function defocus(distanceM, focusVergenceD = 0, sphereD = 0) {
  return vergence(distanceM) - (focusVergenceD - sphereD);
}

/** Geometric blur-circle angular DIAMETER (radians) ≈ pupil diameter (m) × |defocus (D)|. */
export function blurAngleRad(pupilMm, defocusD) {
  const rad = (clampPupil(pupilMm) / 1000) * Math.abs(Number.isFinite(defocusD) ? defocusD : 0);
  return Math.min(rad, BOUNDS.blurArcminMax / ARCMIN_PER_RAD);
}
export const blurArcmin = (pupilMm, defocusD) => blurAngleRad(pupilMm, defocusD) * ARCMIN_PER_RAD;

/**
 * Residual astigmatism after the lens. A toric lens cancels the corneal cylinder; rotation by δ leaves
 * 2·|C|·sin(δ) (vector analysis), with its axis shifted ≈45° + δ/2. Other lenses leave the cylinder as is.
 */
export function residualCylinder(lensId, refraction, toricMisalignDeg = 0) {
  const r = normalizeRefraction(refraction);
  if (!lensProfile(lensId).correctsCylinder) return { cylD: r.cylD, axisDeg: r.axisDeg };
  const d = clamp(toricMisalignDeg, BOUNDS.toricMisalignDeg[0], BOUNDS.toricMisalignDeg[1], 0);
  const cylD = -2 * Math.abs(r.cylD) * Math.sin((d * Math.PI) / 180);
  if (Math.abs(cylD) < 1e-9) return { cylD: 0, axisDeg: r.axisDeg };
  return { cylD, axisDeg: (r.axisDeg + 45 + d / 2) % 180 || 180 };
}

/**
 * One focus term at a distance, with astigmatism. Minus-cyl: the meridian along the axis carries ΔD, the
 * meridian perpendicular to it carries ΔD + C. Light is spread ALONG the meridian that carries the error,
 * so the blur patch is an ellipse: extent along the axis ∝ |ΔD|, perpendicular to it ∝ |ΔD + C|.
 */
export function focusTerm({ distanceM, focus, pupilMm, sphereD = 0, cylD = 0, axisDeg = 180 }) {
  const dAxis = defocus(distanceM, focus.vergenceD, sphereD);
  const dPerp = dAxis + cylD;
  return {
    weight: focus.weight,
    focusVergenceD: focus.vergenceD,
    defocusAxisD: dAxis,
    defocusPerpD: dPerp,
    // spherical equivalent: the circle-of-least-confusion defocus
    defocusSeD: dAxis + cylD / 2,
    blurAxisArcmin: blurArcmin(pupilMm, dAxis),
    blurPerpArcmin: blurArcmin(pupilMm, dPerp),
    axisDeg,
  };
}

/** Gaussian modulation transfer of one term at the reference frequency (σ per axis = blur/4). */
export function termTransfer(term, cyclesPerDeg = VIEWING.referenceCyclesPerDeg) {
  const k = VIEWING.diskToGaussianSigma / 60; // arcmin → degrees, disk → σ
  const sa = term.blurAxisArcmin * k, sb = term.blurPerpArcmin * k;
  const f2 = cyclesPerDeg * cyclesPerDeg;
  // orientation-averaged: mean of the two principal-axis transfers
  return 0.5 * (Math.exp(-2 * Math.PI * Math.PI * sa * sa * f2) + Math.exp(-2 * Math.PI * Math.PI * sb * sb * f2));
}

/**
 * Optics of one depth layer: all focus terms (simultaneous images), the lost-light veil and a sharpness
 * index Q = Σ w_i · T_i  (relative contrast of ≈20/40-sized detail; 1 = a perfectly focused monofocal).
 */
export function layerOptics({ lens = 'monofocal', distanceM, pupilMm, refraction, toricMisalignDeg = 0 } = {}) {
  const prof = lensProfile(lens);
  const p = clampPupil(pupilMm);
  const r = normalizeRefraction(refraction);
  const cyl = residualCylinder(prof.id, r, toricMisalignDeg);
  const d = clampDistance(distanceM);
  const terms = prof.foci.map((focus) => focusTerm({ distanceM: d, focus, pupilMm: p, sphereD: r.sphereD, cylD: cyl.cylD, axisDeg: cyl.axisDeg }));
  const sharpness = terms.reduce((s, t) => s + t.weight * termTransfer(t), 0);
  // the dominant image at this distance = the term contributing most to sharpness
  let best = terms[0], bestC = -1;
  for (const t of terms) { const c = t.weight * termTransfer(t); if (c > bestC) { bestC = c; best = t; } }
  return {
    lens: prof.id,
    distanceM: d,
    vergenceD: vergence(d),
    pupilMm: p,
    residualCylD: cyl.cylD,
    axisDeg: cyl.axisDeg,
    terms,
    loss: { fraction: prof.lossFraction, spreadDeg: prof.lossSpreadDeg },
    sharpness,
    dominant: best,
    defocusD: best.defocusSeD,
    blurArcmin: Math.max(best.blurAxisArcmin, best.blurPerpArcmin),
  };
}

/** Through-focus (defocus-curve SHAPE) of a lens: sharpness index vs vergence demand, 0 … `toD` dioptres. */
export function throughFocus(lens, { pupilMm = PUPIL_BY_LIGHTING.day, fromD = 0, toD = 3.5, stepD = 0.05, refraction, toricMisalignDeg } = {}) {
  const out = [];
  const n = Math.round((toD - fromD) / stepD);
  for (let i = 0; i <= n; i++) {
    const v = +(fromD + i * stepD).toFixed(6);
    const dist = v <= 1 / BOUNDS.distanceM[1] ? BOUNDS.distanceM[1] : 1 / v;
    out.push({ vergenceD: v, distanceM: dist, sharpness: layerOptics({ lens, distanceM: dist, pupilMm, refraction, toricMisalignDeg }).sharpness });
  }
  return out;
}

/** Local maxima of a through-focus curve (plateaus count once, at their centre). */
export function findPeaks(curve, minProminence = 0.02) {
  const peaks = [];
  for (let i = 0; i < curve.length; i++) {
    const y = curve[i].sharpness;
    let j = i;
    while (j + 1 < curve.length && Math.abs(curve[j + 1].sharpness - y) < 1e-12) j++;
    const left = i > 0 ? curve[i - 1].sharpness : -Infinity;
    const right = j < curve.length - 1 ? curve[j + 1].sharpness : -Infinity;
    if (y > left && y > right) {
      // prominence: drop to the lowest point before a higher neighbour on each side
      let lMin = y, rMin = y;
      for (let k = i - 1; k >= 0 && curve[k].sharpness <= y; k--) lMin = Math.min(lMin, curve[k].sharpness);
      for (let k = j + 1; k < curve.length && curve[k].sharpness <= y; k++) rMin = Math.min(rMin, curve[k].sharpness);
      const prom = y - Math.max(i > 0 ? lMin : -Infinity, j < curve.length - 1 ? rMin : -Infinity);
      if (prom >= minProminence || i === 0 || j === curve.length - 1) peaks.push({ ...curve[Math.floor((i + j) / 2)], prominence: prom });
    }
    i = j;
  }
  // the global maximum is always reported (a broad EDOF plateau has little local prominence)
  let g = 0;
  curve.forEach((p, k) => { if (p.sharpness > curve[g].sharpness) g = k; });
  if (!peaks.some((p) => Math.abs(p.vergenceD - curve[g].vergenceD) < 0.26)) peaks.push({ ...curve[g], prominence: 0 });
  return peaks.sort((x, y) => x.vergenceD - y.vergenceD);
}

/**
 * Contiguous vergence range (D) around the best focus over which sharpness stays ≥ `threshold` × the lens's
 * own best value (a depth-of-focus measure of the curve shape).
 */
export function rangeOfFocus(lens, opts = {}, threshold = 0.5) {
  const c = throughFocus(lens, opts);
  let iMax = 0;
  c.forEach((p, i) => { if (p.sharpness > c[iMax].sharpness) iMax = i; });
  const lim = threshold * c[iMax].sharpness;
  let a = iMax, b = iMax;
  while (a > 0 && c[a - 1].sharpness >= lim) a--;
  while (b < c.length - 1 && c[b + 1].sharpness >= lim) b++;
  return { fromD: c[a].vergenceD, toD: c[b].vergenceD, max: c[iMax].sharpness, peakD: c[iMax].vergenceD };
}

// Normaliser for the halo index: the strongest configuration the model allows (largest raw value over every
// lens profile at an 8 mm pupil — the bifocal-type multifocal since it was added; previously the trifocal).
const HALO_RAW = (prof, p) => {
  const primary = prof.foci[0].vergenceD;
  let raw = 0;
  for (const f of prof.foci.slice(1)) raw += f.weight * p * Math.abs(f.vergenceD - primary);
  return raw + prof.lossFraction * p * 1.0;
};
const HALO_REF = Math.max(...LENS_IDS.map((id) => HALO_RAW(LENSES[id], BOUNDS.pupilMm[1])));

/**
 * Halo and glare around a DISTANT point light (relative, educational scale).
 *  - each non-distance focus images a far light as a defocused disk of angular diameter p·|V_i − V_0|
 *    carrying energy w_i  → halos grow with pupil size and add power;
 *  - lost light → a wide veil; straylight (scatter) → glare, relative to a healthy pseudophakic eye.
 * haloIndex ∈ [0,1] is normalised to the model's maximum (strongest lens at an 8 mm pupil). Not a clinical scale.
 */
export function haloGlare({ lens = 'monofocal', pupilMm, lighting } = {}) {
  const prof = lensProfile(lens);
  const p = pupilFor(lighting, pupilMm);
  const primary = prof.foci[0].vergenceD;
  const halos = prof.foci.slice(1).map((f) => ({ diameterArcmin: blurArcmin(p, f.vergenceD - primary), energy: f.weight }));
  const haloIndex = Math.min(1, HALO_RAW(prof, p) / HALO_REF);
  const glareIndex = Math.min(1, (prof.straylight - 1) / 2 + prof.lossFraction * (p / BOUNDS.pupilMm[1]));
  return { pupilMm: p, halos, haloIndex, glareIndex, straylight: prof.straylight, loss: { fraction: prof.lossFraction, spreadDeg: prof.lossSpreadDeg } };
}

/**
 * Contrast reduction (relative): the in-focus share of light at the best focus, reduced by straylight veil
 * and (educational) low-light adaptation. 1 = monofocal in daylight.
 */
export function contrast({ lens = 'monofocal', lighting = 'day' } = {}) {
  const prof = lensProfile(lens);
  const g = LIGHTING_GRADE[lightingId(lighting)];
  const peak = Math.max(...prof.foci.map((f) => f.weight));
  const veil = 1 / (1 + 0.25 * (prof.straylight - 1));
  return { inFocusFraction: peak, veilFactor: veil, lightingFactor: 1 - g.contrastLoss, contrastIndex: peak * veil * (1 - g.contrastLoss) };
}

/** Which scene layer a subject distance belongs to. */
export function bandOf(distanceM) {
  const d = clampDistance(distanceM);
  if (d < BANDS.nearMax) return 'near';
  if (d < BANDS.intermediateMax) return 'intermediate';
  return 'distance';
}

/**
 * Everything the renderer and UI need for one lens, one subject distance and one lighting condition.
 * The three scene layers sit at their default distances (near 40 cm, intermediate 66 cm, distance 6 m);
 * the layer that contains the subject distance is moved to it (object sizes stay fixed, as in defocus-curve
 * testing, so only the optical effect changes).
 */
export function computeView({ lens = 'monofocal', distanceM = DISTANCES.distance, lighting = 'day', pupilMm, refraction, toricMisalignDeg = 0 } = {}) {
  const prof = lensProfile(lens);
  const light = lightingId(lighting);
  const p = pupilFor(light, pupilMm);
  const subjectM = clampDistance(distanceM);
  const subject = bandOf(subjectM);
  const dist = { near: DISTANCES.near, intermediate: DISTANCES.intermediate, distance: DISTANCES.distance };
  dist[subject] = subjectM;
  const layers = {};
  for (const k of ['distance', 'intermediate', 'near']) layers[k] = layerOptics({ lens: prof.id, distanceM: dist[k], pupilMm: p, refraction, toricMisalignDeg });
  return {
    lens: prof.id,
    lighting: light,
    pupilMm: p,
    subject,
    subjectM,
    refraction: normalizeRefraction(refraction),
    layers,
    halo: haloGlare({ lens: prof.id, pupilMm: p }),
    contrast: contrast({ lens: prof.id, lighting: light }),
    grade: { ...LIGHTING_GRADE[light], tint: prof.tint },
  };
}

/** Focal length in pixels of a camera with vertical field of view `vFovDeg` drawing `heightPx` rows. */
export function focalPx(heightPx, vFovDeg = VIEWING.vFovDeg) {
  return (heightPx / 2) / Math.tan((vFovDeg * Math.PI) / 360);
}
/** On-screen size (px) of an angle in arcminutes under the viewing-geometry assumption. */
export function arcminToPx(arcmin, fPx) {
  return (arcmin / ARCMIN_PER_RAD) * fPx;
}
/** Per-axis Gaussian σ (px) that approximates a uniform blur disk of `arcmin` diameter. */
export function sigmaPx(arcmin, fPx) {
  return arcminToPx(arcmin, fPx) * VIEWING.diskToGaussianSigma;
}

/** Log-scale slider mapping between 0…1000 and the slider distance range. */
export function sliderToDistance(t) {
  const u = clamp(t, 0, 1000, 1000) / 1000;
  return DISTANCES.sliderMin * Math.pow(DISTANCES.sliderMax / DISTANCES.sliderMin, u);
}
export function distanceToSlider(m) {
  const d = clamp(m, DISTANCES.sliderMin, DISTANCES.sliderMax, DISTANCES.distance);
  return Math.round((1000 * Math.log(d / DISTANCES.sliderMin)) / Math.log(DISTANCES.sliderMax / DISTANCES.sliderMin));
}

/** The everyday situation (scenario id) that matches a distance + lighting pair, or null. */
export function scenarioFor(distanceM, lighting) {
  const l = lightingId(lighting);
  return SCENARIO_IDS.find((id) => SCENARIOS[id].lighting === l && Math.abs(SCENARIOS[id].distanceM - distanceM) < 0.005) || null;
}
