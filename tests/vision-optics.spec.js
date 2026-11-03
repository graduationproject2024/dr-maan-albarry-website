// Vision simulator — pure optics model (src/vision-sim/optics). Runs in Node: no browser page is used.
// These are internal-consistency and boundary tests of an EDUCATIONAL model. They do not validate it clinically.
import { test, expect } from '@playwright/test';
import * as O from '../src/vision-sim/optics/index.js';

const LENSES = ['monofocal', 'edof', 'multifocal', 'trifocal', 'toric', 'cataract'];
const close = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

test.describe('defocus', () => {
  test('is zero at the in-focus distance of every focus', () => {
    for (const id of LENSES) {
      for (const f of O.LENSES[id].foci) {
        if (f.vergenceD === 0) continue; // infinity: approached, checked below
        expect(close(O.defocus(1 / f.vergenceD, f.vergenceD, 0), 0)).toBe(true);
      }
    }
    // a 100 m target is within 0.01 D of a distance focus
    expect(Math.abs(O.defocus(100, 0, 0))).toBeLessThanOrEqual(0.0100001);
    // 40 cm demands 2.5 D, 66 cm ≈ 1.52 D, 6 m ≈ 0.167 D
    expect(O.vergence(0.4)).toBeCloseTo(2.5, 9);
    expect(O.vergence(0.66)).toBeCloseTo(1.515, 3);
    expect(O.vergence(6)).toBeCloseTo(0.1667, 4);
  });

  test('follows ΔD = 1/d − (V_focus − S): myopia shifts focus nearer, hyperopia beyond infinity', () => {
    // −1 D myope: in focus at 1 m with a distance-focused lens
    expect(close(O.defocus(1, 0, -1), 0)).toBe(true);
    // +1 D hyperope (no accommodation): even distance is 1 D out of focus
    expect(O.defocus(100, 0, 1)).toBeCloseTo(1.01, 9);
    expect(O.layerOptics({ lens: 'monofocal', distanceM: 1, pupilMm: 3, refraction: { sphereD: -1 } }).blurArcmin).toBeCloseTo(0, 9);
  });

  test('blur angle = pupil (m) × |defocus| and is monotonic in |defocus| and in pupil size', () => {
    expect(O.blurAngleRad(3, 1)).toBeCloseTo(0.003, 12);
    expect(O.blurAngleRad(5, -2)).toBeCloseTo(0.010, 12);
    expect(O.blurAngleRad(4, 0)).toBe(0);
    let prev = -1;
    for (let d = 0; d <= 3.5; d += 0.125) {
      const b = O.blurArcmin(3, d);
      expect(b).toBeGreaterThan(prev);
      expect(O.blurArcmin(3, -d)).toBe(b); // symmetric in sign
      prev = b;
    }
    prev = -1;
    for (let p = 2; p <= 8; p += 0.5) {
      const b = O.blurArcmin(p, 1.5);
      expect(b).toBeGreaterThan(prev);
      prev = b;
    }
    // sharpness falls monotonically with defocus for the single-focus lens
    let q = Infinity;
    for (let d = 0; d <= 3; d += 0.1) {
      const s = O.layerOptics({ lens: 'monofocal', distanceM: d === 0 ? 100 : 1 / d, pupilMm: 4 }).sharpness;
      expect(s).toBeLessThanOrEqual(q + 1e-12);
      q = s;
    }
  });

  test('blur → pixels uses the explicit viewing geometry', () => {
    const f = O.focalPx(800, 34);
    expect(f).toBeCloseTo(400 / Math.tan((17 * Math.PI) / 180), 9);
    // 1 radian of blur equals f pixels; σ is a quarter of the disk diameter
    expect(O.arcminToPx((180 / Math.PI) * 60, f)).toBeCloseTo(f, 6);
    expect(O.sigmaPx(60, f)).toBeCloseTo(O.arcminToPx(60, f) / 4, 9);
  });
});

test.describe('pupil by lighting', () => {
  test('day < dusk < night, inside published adult ranges', () => {
    const d = O.pupilFor('day'), u = O.pupilFor('dusk'), n = O.pupilFor('night');
    expect(d).toBeLessThan(u);
    expect(u).toBeLessThan(n);
    for (const p of [d, u, n]) { expect(p).toBeGreaterThanOrEqual(2); expect(p).toBeLessThanOrEqual(8); }
    expect(O.pupilFor('unknown')).toBe(d);
  });
  test('overrides are clamped to [2, 8] mm', () => {
    expect(O.pupilFor('day', 1)).toBe(2);
    expect(O.pupilFor('day', 12)).toBe(8);
    expect(O.pupilFor('night', 6.5)).toBe(6.5);
    expect(O.clampPupil(NaN)).toBe(O.PUPIL_BY_LIGHTING.day);
  });
});

test.describe('astigmatism', () => {
  test('produces an elliptical (directional) blur along the principal meridians', () => {
    const l = O.layerOptics({ lens: 'monofocal', distanceM: 100, pupilMm: 4, refraction: { cylD: -1.5, axisDeg: 90 } });
    const t = l.terms[0];
    expect(t.blurAxisArcmin).toBeCloseTo(O.blurArcmin(4, 0.01), 6);
    expect(t.blurPerpArcmin).toBeCloseTo(O.blurArcmin(4, 0.01 - 1.5), 6);
    expect(t.blurPerpArcmin / t.blurAxisArcmin).toBeGreaterThan(10);
    expect(l.axisDeg).toBe(90);
  });
  test('cylinder sign is normalised to minus-cylinder and axis to (0, 180]', () => {
    expect(O.normalizeRefraction({ cylD: 2, axisDeg: 0 })).toEqual({ sphereD: 0, cylD: -2, axisDeg: 180 });
    expect(O.normalizeRefraction({ cylD: -9, axisDeg: 270 }).cylD).toBe(-4);
    expect(O.normalizeRefraction({ cylD: -1, axisDeg: 270 }).axisDeg).toBe(90);
  });
  test('a toric lens cancels the cylinder; rotation leaves 2·C·sin(δ)', () => {
    const r = { cylD: -2, axisDeg: 180 };
    expect(O.residualCylinder('toric', r, 0).cylD).toBe(0);
    expect(O.residualCylinder('monofocal', r, 0).cylD).toBe(-2);
    expect(Math.abs(O.residualCylinder('toric', r, 10).cylD)).toBeCloseTo(2 * 2 * Math.sin(Math.PI / 18), 9);
    // ≈ one third of the effect is lost per 10°
    const toric = O.layerOptics({ lens: 'toric', distanceM: 100, pupilMm: 4, refraction: r });
    const mono = O.layerOptics({ lens: 'monofocal', distanceM: 100, pupilMm: 4, refraction: r });
    expect(toric.sharpness).toBeGreaterThan(mono.sharpness);
    expect(toric.blurArcmin).toBeLessThan(mono.blurArcmin);
    expect(O.residualCylinder('toric', r, 999).cylD).toBeCloseTo(-2 * 2 * Math.sin(Math.PI / 6), 9); // clamped to 30°
  });
});

test.describe('IOL through-focus shapes (educational approximations)', () => {
  test('monofocal: a single sharp distance peak', () => {
    const peaks = O.findPeaks(O.throughFocus('monofocal'));
    expect(peaks.map((p) => p.vergenceD)).toEqual([0]);
    const r = O.rangeOfFocus('monofocal');
    expect(r.toD).toBeLessThanOrEqual(0.35);
  });

  test('trifocal: peaks at distance, intermediate (≈66 cm) and near (40 cm), each below monofocal peak', () => {
    const c = O.throughFocus('trifocal');
    const peaks = O.findPeaks(c);
    expect(peaks.map((p) => p.vergenceD)).toEqual([0, 1.5, 2.5]);
    const mono = O.throughFocus('monofocal')[0].sharpness;
    for (const p of peaks) expect(p.sharpness).toBeLessThan(mono); // light split ⇒ lower contrast per focus
    const at = (v) => c.find((p) => close(p.vergenceD, v, 1e-6)).sharpness;
    expect(at(2.0)).toBeLessThan(at(2.5));
    expect(at(2.0)).toBeLessThan(at(1.5) + 1e-12);
    expect(at(0.75)).toBeLessThan(at(0));
    // at 40 cm the trifocal is sharper than the monofocal, EDOF and toric
    const q = (lens) => O.layerOptics({ lens, distanceM: 0.4, pupilMm: 3 }).sharpness;
    expect(q('trifocal')).toBeGreaterThan(q('monofocal'));
    expect(q('trifocal')).toBeGreaterThan(q('edof'));
  });

  test('EDOF: extended range with a gentle, monotonic decline (no separate near peak)', () => {
    const c = O.throughFocus('edof');
    const peaks = O.findPeaks(c);
    expect(peaks).toHaveLength(1);
    expect(peaks[0].vergenceD).toBeLessThanOrEqual(0.25);
    for (let i = peaks.length ? c.indexOf(c.find((p) => p.vergenceD === peaks[0].vergenceD)) : 0; i < c.length - 1; i++) {
      expect(c[i + 1].sharpness).toBeLessThanOrEqual(c[i].sharpness + 1e-12);
    }
    const q = (lens, m) => O.layerOptics({ lens, distanceM: m, pupilMm: 3 }).sharpness;
    expect(q('edof', 0.66)).toBeGreaterThan(q('monofocal', 0.66));   // better intermediate than monofocal
    expect(q('edof', 100)).toBeLessThan(q('monofocal', 100));        // at some cost at distance
    expect(q('edof', 100)).toBeGreaterThan(q('trifocal', 100));       // less light split than trifocal
    expect(O.rangeOfFocus('edof').toD).toBeGreaterThan(O.rangeOfFocus('monofocal').toD);
  });

  test('multifocal (two-focus): distance and near peaks with no intermediate peak', () => {
    const c = O.throughFocus('multifocal');
    expect(O.findPeaks(c).map((p) => p.vergenceD)).toEqual([0, 2.5]);
    const at = (v) => c.find((p) => close(p.vergenceD, v, 1e-6)).sharpness;
    const mono = O.throughFocus('monofocal')[0].sharpness;
    expect(at(0)).toBeLessThan(mono);
    expect(at(1.5)).toBeLessThan(at(0) / 4);   // dip at intermediate (≈66 cm)
    const q = (lens, m) => O.layerOptics({ lens, distanceM: m, pupilMm: 3 }).sharpness;
    expect(q('multifocal', 0.66)).toBeLessThan(q('trifocal', 0.66));
    expect(q('multifocal', 0.4)).toBeGreaterThan(q('monofocal', 0.4));
    expect(O.contrast({ lens: 'multifocal' }).contrastIndex).toBeLessThan(O.contrast({ lens: 'edof' }).contrastIndex);
  });

  test('weights and lost light sum to 1 for every lens', () => {
    for (const id of LENSES) {
      const p = O.LENSES[id];
      const sum = p.foci.reduce((s, f) => s + f.weight, 0) + p.lossFraction;
      expect(sum).toBeCloseTo(1, 9);
    }
  });
});

test.describe('halo, glare and contrast', () => {
  test('halo grows with pupil size; multifocal > EDOF > monofocal', () => {
    for (const lens of ['edof', 'trifocal']) {
      let prev = -1;
      for (let p = 2; p <= 8; p += 0.5) {
        const h = O.haloGlare({ lens, pupilMm: p }).haloIndex;
        expect(h).toBeGreaterThan(prev);
        prev = h;
      }
    }
    for (const light of ['day', 'dusk', 'night']) {
      const h = (lens) => O.haloGlare({ lens, lighting: light }).haloIndex;
      expect(h('monofocal')).toBe(0);
      expect(h('edof')).toBeGreaterThan(h('monofocal'));
      expect(h('trifocal')).toBeGreaterThan(h('edof'));
    }
    expect(O.haloGlare({ lens: 'trifocal', lighting: 'night' }).haloIndex).toBeGreaterThan(O.haloGlare({ lens: 'trifocal', lighting: 'day' }).haloIndex);
    // normaliser: the strongest lens at the largest pupil (the bifocal-type multifocal since it was added)
    expect(O.haloGlare({ lens: 'multifocal', pupilMm: 8 }).haloIndex).toBeCloseTo(1, 9);
    for (const id of LENSES) expect(O.haloGlare({ lens: id, pupilMm: 8 }).haloIndex).toBeLessThanOrEqual(1 + 1e-12);
    expect(O.haloGlare({ lens: 'trifocal', pupilMm: 8 }).haloIndex).toBeLessThan(1);
    expect(O.haloGlare({ lens: 'multifocal', lighting: 'night' }).haloIndex).toBeGreaterThan(O.haloGlare({ lens: 'edof', lighting: 'night' }).haloIndex);
    // halo disk diameter = pupil × add (angle): 5 mm × 2.5 D = 12.5 mrad
    const near = O.haloGlare({ lens: 'trifocal', pupilMm: 5 }).halos.at(-1);
    expect(near.diameterArcmin).toBeCloseTo(0.0125 * (180 / Math.PI) * 60, 6);
  });

  test('contrast is reduced by light splitting, scatter and low light', () => {
    const c = (lens, lighting = 'day') => O.contrast({ lens, lighting }).contrastIndex;
    expect(c('monofocal')).toBeCloseTo(1, 9);
    expect(c('trifocal')).toBeLessThan(c('edof'));
    expect(c('edof')).toBeLessThan(c('monofocal'));
    expect(c('cataract')).toBeLessThan(c('monofocal'));
    expect(c('monofocal', 'night')).toBeLessThan(c('monofocal', 'day'));
    expect(O.haloGlare({ lens: 'cataract' }).glareIndex).toBeGreaterThan(O.haloGlare({ lens: 'monofocal' }).glareIndex);
  });
});

test.describe('bounds, layers and determinism', () => {
  test('inputs are clamped at the bounds', () => {
    expect(O.vergence(0)).toBe(4);
    expect(O.vergence(-5)).toBe(4);
    expect(O.vergence(1e9)).toBeCloseTo(0.01, 12);
    expect(O.vergence(NaN)).toBeCloseTo(1 / 6, 12);
    expect(O.blurArcmin(8, 1000)).toBe(O.BOUNDS.blurArcminMax);
    expect(O.lensProfile('nope').id).toBe('monofocal');
    expect(O.computeView({ lighting: 'bogus' }).lighting).toBe('day');
    expect(O.normalizeRefraction({ sphereD: 99 }).sphereD).toBe(3);
    expect(O.normalizeRefraction({ sphereD: -99 }).sphereD).toBe(-3);
    expect(O.sliderToDistance(-10)).toBeCloseTo(O.DISTANCES.sliderMin, 9);
    expect(O.sliderToDistance(5000)).toBeCloseTo(O.DISTANCES.sliderMax, 9);
  });

  test('everyday situations map to one distance + one lighting level', () => {
    expect(O.SCENARIO_IDS).toEqual(['signs', 'laptop', 'phone', 'book', 'night-driving']);
    for (const id of O.SCENARIO_IDS) {
      const sc = O.SCENARIOS[id];
      expect(O.scenarioFor(sc.distanceM, sc.lighting)).toBe(id);
      expect(sc.distanceM).toBeGreaterThanOrEqual(O.DISTANCES.sliderMin);
      expect(sc.distanceM).toBeLessThanOrEqual(O.DISTANCES.sliderMax);
    }
    expect(O.bandOf(O.SCENARIOS.phone.distanceM)).toBe('near');
    expect(O.bandOf(O.SCENARIOS.laptop.distanceM)).toBe('intermediate');
    expect(O.SCENARIOS['night-driving'].lighting).toBe('night');
    expect(O.scenarioFor(1.0, 'day')).toBe(null);
    expect(Object.isFrozen(O.SCENARIOS)).toBe(true);
  });

  test('slider mapping round-trips the presets', () => {
    for (const m of [0.4, 0.66, 6]) expect(O.sliderToDistance(O.distanceToSlider(m))).toBeCloseTo(m, 2);
    expect(O.bandOf(0.4)).toBe('near');
    expect(O.bandOf(0.66)).toBe('intermediate');
    expect(O.bandOf(6)).toBe('distance');
  });

  test('computeView moves only the subject layer and keeps the others at their defaults', () => {
    const v = O.computeView({ lens: 'trifocal', distanceM: 0.45, lighting: 'night' });
    expect(v.subject).toBe('near');
    expect(v.layers.near.distanceM).toBe(0.45);
    expect(v.layers.intermediate.distanceM).toBe(0.66);
    expect(v.layers.distance.distanceM).toBe(6);
    expect(v.pupilMm).toBe(O.PUPIL_BY_LIGHTING.night);
  });

  test('outputs are deterministic and inputs are not mutated', () => {
    const input = { lens: 'edof', distanceM: 0.8, lighting: 'dusk', refraction: { sphereD: -0.5, cylD: -1, axisDeg: 30 } };
    const frozen = JSON.stringify(input);
    const a = JSON.stringify(O.computeView(input));
    for (let i = 0; i < 5; i++) expect(JSON.stringify(O.computeView(input))).toBe(a);
    expect(JSON.stringify(input)).toBe(frozen);
    expect(JSON.stringify(O.throughFocus('trifocal'))).toBe(JSON.stringify(O.throughFocus('trifocal')));
  });

  test('parameter tables are frozen', () => {
    expect(Object.isFrozen(O.LENSES)).toBe(true);
    expect(Object.isFrozen(O.LENSES.trifocal.foci)).toBe(true);
    expect(Object.isFrozen(O.BOUNDS)).toBe(true);
  });
});
