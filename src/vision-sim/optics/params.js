// Vision simulator — optical model parameters (pure data: no DOM, no three.js).
//
// STATUS OF EVERY VALUE IN THIS FILE: educational approximation, not patient-specific, not clinically
// validated. Values were chosen to reproduce the qualitative SHAPE of published findings (see REFERENCES and
// docs/implementation/clinical-visual-reconstruction/VISION_OPTICAL_MODEL.md). They are not the outcome of
// any particular product and must not be read as a prediction for an individual eye.
// Review status: pending review by Dr. Maan Albarry.

/** Hard bounds. Every public model function clamps its inputs to these ranges. */
export const BOUNDS = Object.freeze({
  distanceM: [0.25, 100],      // viewing distance (m). 0.25 m = 4 D; 100 m ≈ optical infinity (0.01 D)
  pupilMm: [2, 8],             // physiological entrance-pupil range for adults
  sphereD: [-3, 3],            // residual spherical refraction (spectacle plane, D)
  cylD: [-4, 0],               // residual cylinder, minus-cylinder convention (D)
  axisDeg: [0, 180],           // cylinder axis (degrees)
  toricMisalignDeg: [0, 30],   // toric IOL rotation away from the intended axis (degrees)
  blurArcminMax: 240,          // safety cap on any computed blur diameter (4 degrees)
});

/** Slider / preset distances used by the UI (metres). 6 m is the clinical "distance" test distance. */
export const DISTANCES = Object.freeze({
  near: 0.40,
  intermediate: 0.66,
  distance: 6,
  sliderMin: 0.33,
  sliderMax: 6,
});

/** Which scene layer a distance belongs to (the "subject" the slider moves). Thresholds in metres. */
export const BANDS = Object.freeze({ nearMax: 0.52, intermediateMax: 1.6 });

/**
 * Pupil diameter by lighting condition, for an older adult (typical cataract-surgery age, ~60–75 y).
 * Pupils shrink with age (senile miosis) — Winn et al. 1994; Watson & Yellott 2012 unified formula.
 * Representative rounded values, not a measurement. Night uses a mesopic street-lighting level, not full darkness.
 */
export const PUPIL_BY_LIGHTING = Object.freeze({
  day: 3.0,    // photopic, outdoor daylight
  dusk: 4.0,   // upper mesopic
  night: 5.0,  // lower mesopic (lit street at night)
});

/** Educational scene grading by lighting (not optics): rod-intrusion desaturation and scene luminance. */
export const LIGHTING_GRADE = Object.freeze({
  day: { desaturate: 0, contrastLoss: 0 },
  dusk: { desaturate: 0.12, contrastLoss: 0.04 },
  night: { desaturate: 0.3, contrastLoss: 0.1 },
});

/**
 * Viewing-geometry assumption. Blur is computed as a visual ANGLE and converted to pixels through the
 * camera that draws the scene: f_px = (renderHeight / 2) / tan(vFov / 2), blurPx = f_px * angle(rad).
 * Object sizes and blur therefore keep the real-world ratio regardless of the size of the screen.
 */
export const VIEWING = Object.freeze({
  vFovDeg: 34,                 // vertical field of view represented by the simulator image
  diskToGaussianSigma: 0.25,   // a uniform blur disk of diameter b has per-axis RMS σ = b/4
  referenceCyclesPerDeg: 15,   // spatial frequency used by the sharpness index (≈ 20/40 letter detail)
});

/**
 * IOL / eye profiles. Each lens is modelled as SIMULTANEOUS FOCI: a set of in-focus vergences (D, spectacle
 * plane, positive = nearer) that share the light. Light not directed to any useful focus (diffraction into
 * higher orders, scatter) is `lossFraction`, spread as a wide veil of `lossSpreadDeg` degrees.
 * Weights + lossFraction sum to 1.
 *
 * Shapes, not brands: the vergences/weights reproduce the qualitative shape of published defocus curves
 * (monofocal: one sharp distance peak; EDOF: a plateau to ≈1.5 D with a gentle decline; trifocal: three
 * peaks with dips between them). They are parameters, not product specifications.
 */
export const LENSES = Object.freeze({
  monofocal: Object.freeze({
    id: 'monofocal',
    foci: Object.freeze([{ vergenceD: 0, weight: 1 }]),
    lossFraction: 0,
    lossSpreadDeg: 0,
    straylight: 1,             // relative to a healthy pseudophakic eye
    correctsCylinder: false,
    tint: null,
  }),
  edof: Object.freeze({
    id: 'edof',
    // continuous extended focus approximated by 4 closely spaced foci with decreasing energy
    foci: Object.freeze([
      { vergenceD: 0, weight: 0.50 },
      { vergenceD: 0.5, weight: 0.20 },
      { vergenceD: 1.0, weight: 0.15 },
      { vergenceD: 1.5, weight: 0.11 },
    ]),
    lossFraction: 0.04,
    lossSpreadDeg: 1.5,
    straylight: 1.15,
    correctsCylinder: false,
    tint: null,
  }),
  trifocal: Object.freeze({
    id: 'trifocal',
    // distance / intermediate (≈67 cm) / near (40 cm) foci; light split ≈ 50/20/30 of the useful light with
    // ≈10 % lost to higher diffraction orders (typical published range for diffractive trifocals: ~10–15 %)
    foci: Object.freeze([
      { vergenceD: 0, weight: 0.45 },
      { vergenceD: 1.5, weight: 0.18 },
      { vergenceD: 2.5, weight: 0.27 },
    ]),
    lossFraction: 0.10,
    lossSpreadDeg: 1.5,
    straylight: 1.3,
    correctsCylinder: false,
    tint: null,
  }),
  toric: Object.freeze({
    id: 'toric',
    // a monofocal toric: same focus as monofocal, plus correction of corneal astigmatism
    foci: Object.freeze([{ vergenceD: 0, weight: 1 }]),
    lossFraction: 0,
    lossSpreadDeg: 0,
    straylight: 1,
    correctsCylinder: true,
    tint: null,
  }),
  cataract: Object.freeze({
    id: 'cataract',
    // Comparator, not an IOL: a cloudy natural lens (no accommodation assumed, typical age) — forward light
    // scatter takes energy out of the image into a wide veil; the lens is yellowed. Straylight ×2.5 ≈ log(s)
    // +0.4 over a healthy eye, within the range reported for cataract (van den Berg et al.).
    foci: Object.freeze([{ vergenceD: 0, weight: 0.72 }]),
    lossFraction: 0.28,
    lossSpreadDeg: 2.5,
    straylight: 2.5,
    correctsCylinder: false,
    tint: Object.freeze([1.0, 0.86, 0.62]),
  }),
});

export const LENS_IDS = Object.freeze(['monofocal', 'edof', 'trifocal', 'toric', 'cataract']);
export const LIGHTING_IDS = Object.freeze(['day', 'dusk', 'night']);

/** Source TYPES the model draws on. Full citations: CLINICAL_SOURCES.md → "Vision simulator". */
export const REFERENCES = Object.freeze([
  { id: 'geom-blur', type: 'textbook optics', note: 'Geometric blur-circle angle ≈ pupil diameter × defocus (small-angle, thin-lens eye). E.g. Atchison & Smith, Optics of the Human Eye.' },
  { id: 'smith-1991', type: 'peer-reviewed', note: 'Smith G. Relation between spherical refractive error and visual acuity. Optom Vis Sci 1991 — acuity falls with pupil × defocus.' },
  { id: 'pupil', type: 'peer-reviewed', note: 'Winn B et al. Factors affecting light-adapted pupil size in normal human subjects. IOVS 1994; Watson AB & Yellott JI. A unified formula for light-adapted pupil size. J Vis 2012.' },
  { id: 'defocus-curves', type: 'peer-reviewed reviews / meta-analyses', note: 'Published mean defocus curves comparing monofocal, EDOF and trifocal IOLs (e.g. Cochrane review of multifocal vs monofocal IOLs; ESCRS-presented and peer-reviewed comparative studies).' },
  { id: 'escrs', type: 'professional society', note: 'ESCRS guidance / educational material on presbyopia-correcting IOLs and patient selection.' },
  { id: 'toric', type: 'peer-reviewed', note: 'Residual astigmatism after toric IOL rotation ≈ 2·C·sin(misalignment) (vector analysis; ~3.3 % loss per degree).' },
  { id: 'straylight', type: 'peer-reviewed', note: 'van den Berg TJTP et al. Straylight / forward light scatter in cataract and pseudophakia.' },
]);
