// Pure-JS constraint checks for the cataract simulator: imports the simulation modules directly in Node
// (no browser, no three.js). Collision-free here means "no physically impossible overlap in this simplified
// rigid model" — it is NOT a statement of surgical accuracy or clinical approval.
import { test, expect } from '@playwright/test';
import { validate, checkDeterminism, summarise, insideCornea, insideIris, behindPosteriorCapsule } from '../src/cataract-sim/constraints.js';
import { STAGES, paramsAt } from '../src/cataract-sim/stages.js';
import {
  EYE, WOUND, FULCRUM, cornealThickness, corneaAntZ, corneaPostZ, lensAntZ, lensPostZ, irisBoundsAt, instrumentAxis, MODEL_VERSION
} from '../src/cataract-sim/anatomy.js';
import { paraxialFocusZ, traceAxial } from '../src/cataract-sim/optics.js';
import { nucleusPieces, flapPoint, TAU } from '../src/cataract-sim/surgery.js';

test.describe('cataract simulator — geometric constraints (Node)', () => {
  test('zero violations over a fine grid of every stage (1000 samples per stage)', () => {
    const r = validate({ steps: 1000 });
    expect(r.samples).toBe(7 * 1001);
    expect(r.violations, JSON.stringify(summarise(r))).toEqual([]);
  });

  test('deterministic replay: the same seek always gives the same state', () => {
    expect(checkDeterminism()).toBe(true);
    for (let i = 0; i < STAGES.length; i++) {
      for (const p of [0, 0.123, 0.5, 0.987, 1]) expect(JSON.stringify(paramsAt(i, p))).toBe(JSON.stringify(paramsAt(i, p)));
    }
    // a backwards seek after a forwards one gives the identical earlier state (no hidden accumulated state)
    const a = JSON.stringify(paramsAt(3, 0.4));
    paramsAt(6, 1); paramsAt(4, 0.7);
    expect(JSON.stringify(paramsAt(3, 0.4))).toBe(a);
  });

  test('invalid stage / progress inputs are clamped, never throw', () => {
    expect(() => paramsAt(-3, 0.5)).not.toThrow();
    expect(JSON.stringify(paramsAt(-3, 0.5))).toBe(JSON.stringify(paramsAt(0, 0.5)));
    expect(JSON.stringify(paramsAt(99, 2))).toBe(JSON.stringify(paramsAt(6, 1)));
    expect(JSON.stringify(paramsAt(NaN, NaN))).toBe(JSON.stringify(paramsAt(0, 0)));
  });

  test('the validator really detects penetrations (negative controls)', () => {
    const P = paramsAt(1, 1);
    expect(insideCornea([0, 0, EYE.corneaApexZ - 0.2])).toBe(true);
    expect(insideCornea([0, 0, 0])).toBe(false);
    const b = irisBoundsAt(4.5, P.pupilR, 0);
    expect(insideIris([4.5, 0, (b.front + b.back) / 2], P.pupilR, 0)).toBe(true);
    expect(behindPosteriorCapsule([0, 0, lensPostZ(0) - 0.1], 0)).toBe(true);
    expect(behindPosteriorCapsule([0, 0, EYE.lensEqZ], 0)).toBe(false);
  });

  test('anatomy matches the documented reference values', () => {
    expect(MODEL_VERSION).toMatch(/^csim-anatomy-/);
    expect(EYE.corneaApexZ - EYE.lensAntApexZ).toBeCloseTo(3.14, 2);          // ACD from epithelium
    expect(EYE.aqueousDepth).toBeCloseTo(2.6, 5);                              // endothelium -> lens
    expect(cornealThickness(0)).toBeCloseTo(0.54, 3);                         // central
    expect(cornealThickness(5)).toBeGreaterThan(0.68);                        // thicker periphery
    expect(cornealThickness(5)).toBeLessThan(0.8);
    expect(EYE.lensAntT + EYE.lensPostT).toBeCloseTo(4.6, 5);                  // cataract-age lens thickness
    expect(2 * EYE.lensEqR).toBeCloseTo(9.4, 5);
    expect(EYE.axialLength).toBeGreaterThan(23.5);
    expect(EYE.axialLength).toBeLessThan(24.5);
    expect(lensAntZ(0) - lensPostZ(0)).toBeCloseTo(4.6, 5);
    expect(corneaAntZ(0) - corneaPostZ(0)).toBeCloseTo(0.54, 5);
    // the clear-corneal tunnel is inside the limbus and opens into the anterior chamber
    expect(WOUND.externalR).toBeLessThan(EYE.corneaRadius);
    expect(WOUND.internalR).toBeLessThan(WOUND.externalR);
  });

  test('instrument shafts always pass through the incision fulcrum inside the eye', () => {
    for (let i = 0; i < STAGES.length; i++) {
      for (let k = 0; k <= 200; k++) {
        const P = paramsAt(i, k / 200);
        if (!P.instrument) continue;
        const tip = P.instrument.tip, ax = instrumentAxis(tip);
        const to = [FULCRUM[0] - tip[0], FULCRUM[1] - tip[1], FULCRUM[2] - tip[2]];
        const along = to[0] * ax[0] + to[1] * ax[1] + to[2] * ax[2];
        const off = Math.hypot(to[0] - ax[0] * along, to[1] - ax[1] * along, to[2] - ax[2] * along);
        expect(off).toBeLessThan(1e-6);
      }
    }
  });

  test('capsulorhexis is a progressive tear, not a scale transform', () => {
    const i = STAGES.findIndex((s) => s.id === 'capsulorhexis');
    const arcs = [0.2, 0.4, 0.6, 0.79].map((p) => paramsAt(i, p).rhexisArc);
    for (let k = 1; k < arcs.length; k++) expect(arcs[k]).toBeGreaterThan(arcs[k - 1]);
    // ahead of the tear front the capsule is still in place; behind it the flap is folded over
    const P = paramsAt(i, 0.5);
    const arc = P.flap.arc;
    const ahead = flapPoint(EYE.rhexisR, arc + 0.3, arc), behind = flapPoint(EYE.rhexisR, Math.max(0, arc - 1.5), arc);
    expect(Math.hypot(ahead[0], ahead[1])).toBeCloseTo(EYE.rhexisR, 5);
    expect(Math.hypot(behind[0], behind[1])).toBeLessThan(EYE.rhexisR * 0.8);
    expect(arc).toBeLessThan(TAU);
  });

  test('phaco: nucleus breaks into fragments that are removed at the probe, not shrunk as a whole', () => {
    const early = nucleusPieces(0.2), cracked = nucleusPieces(0.4), late = nucleusPieces(0.55);
    expect(early.every((q) => q.visible && q.scale === 1)).toBe(true);
    expect(cracked.every((q) => q.visible && q.split > 0.99)).toBe(true);
    expect(late.filter((q) => q.visible).length).toBeLessThan(4);   // removed one quadrant at a time
    expect(late.filter((q) => q.visible && q.scale === 1).length).toBeGreaterThan(0);
    expect(nucleusPieces(1).every((q) => !q.visible)).toBe(true);
    const i = STAGES.findIndex((s) => s.id === 'phaco');
    const P = paramsAt(i, 0.64); // middle of the third quadrant's emulsification window
    expect(P.particles.length).toBeGreaterThan(0);
  });

  test('light paths: computed refraction focuses on the model retina after IOL placement', () => {
    expect(Math.abs(paraxialFocusZ('pseudophakic') - EYE.focusZ)).toBeLessThan(0.3);
    const tr = traceAxial(1.0, 0, 'pseudophakic');
    expect(tr.points).toHaveLength(6); // start, 2 corneal surfaces, 2 IOL surfaces, retina
    const hit = tr.points[5];
    expect(Math.hypot(hit[0], hit[1])).toBeLessThan(0.1);
  });
});
