// The atlas shot list: every image in the anatomical library, its level, frame, camera and label anchors.
//   L1  homepage / card preview, 4:5, 1200 x 1500 master
//   L2  procedure-page hero, 16:9, 2400 x 1350 master
//   L3  close-up of the structures the procedure acts on, 4:3, 1600 x 1200 master (its own camera, not a crop)
// Anchors are 3D points in eye coordinates (mm), projected through the shot camera at render time.
import { EYE, lensAntZ, lensPostZ, corneaAntZ, corneaThickness, shellPoint } from '../anatomy.js';
import cataract from '../scenes/cataract.js';
import laser from '../scenes/laser.js';
import icl, { PHI_LONG } from '../scenes/icl.js';
import cxl, { coneSurface as F, coneThickness as TC } from '../scenes/cxl.js';
import transplant from '../scenes/transplant.js';
import injection from '../scenes/injection.js';
import implants from '../scenes/implants.js';
import { sagittal, quadrant, cutaway, onHalf, onFace, DEG, dirFrom } from './compose.js';
import { iclSagittal, injectionSagittal, posteriorPole, collagenLattice, graftSection, bagSpecimen, entryGeometry, PK } from './scenes-extra.js';

const L1 = { level: 'L1', W: 1200, H: 1500, sizes: [480, 800, 1200] };
const L2 = { level: 'L2', W: 2400, H: 1350, sizes: [640, 1024, 1600, 2400] };
const L3 = { level: 'L3', W: 1600, H: 1200, sizes: [640, 1024, 1600] };

const ciliaryTip = shellPoint(EYE.Ri - 1.26, 35.6 * DEG); // [r, z]
const corneaMid = (r) => corneaAntZ(r) - corneaThickness(r) / 2;
const shell = (rad, aDeg) => shellPoint(rad, aDeg * DEG);
const bagPost = (r) => -1.6 + 0.0278 * r * r;

// Laser diagram geometry (scenes/laser.js): thickness x3, flap 0.33 (x3) thick, radius 4.3, hinge chord at y = 3.6.
const LX = { EX: 3, tf: 0.33, rf: 4.3, yh: 3.6, rz: 3.3, d0: 0.24, EPI: 0.15, BOW: 0.054 };
const A = (r) => corneaAntZ(Math.abs(r));
const abl = (r) => (Math.abs(r) < LX.rz ? LX.d0 * (1 - (r / LX.rz) ** 2) ** 1.5 : 0);
const depthAt = (x, d, y = 0) => { // point at depth d below the anterior reference surface (along its normal)
  const r = Math.abs(x), z = A(r), s = Math.sign(x) || 1;
  const nx = s * r / EYE.corneaRc, nz = (z - (EYE.corneaApexZ - EYE.corneaRc)) / EYE.corneaRc;
  return [x - nx * d, y, z - nz * d];
};
const TT = (x) => LX.EX * corneaThickness(Math.abs(x));
const flapPoint = (x, y) => { // a point of the lifted flap (rotated -126 deg about its hinge chord)
  const zh = A(LX.rf) - LX.tf / 2, th = -126 * DEG, z = A(Math.hypot(x, y)) - LX.tf / 2;
  const dy = y - LX.yh, dz = z - zh;
  return [x, LX.yh + Math.cos(th) * dy - Math.sin(th) * dz, zh + Math.sin(th) * dy + Math.cos(th) * dz];
};
const laserHit = [-1.05, 0.9, A(Math.hypot(-1.05, 0.9)) - LX.tf - abl(Math.hypot(-1.05, 0.9))];

// ICL plate section along its long axis (PHI_LONG), from instruments.phakicLens.
const iclBase = (r) => 0.84 - (r * r) / 34;

// Intravitreal: entry meridian of the legacy hero (112 degrees) and the pars plana geometry
const injE = entryGeometry(112 * DEG), injS = entryGeometry(0);
const fovea = [0, 0, EYE.cz - EYE.Ri + EYE.choroidT + 0.16];
// A point of the fundus map (globe.js fundusTexture): dx, dy in mm of arc from the fovea (dx along +x, dy along +y).
const fundusPoint = (dx, dy) => {
  const d = Math.hypot(dx, dy), az = Math.atan2(dy, dx), R = EYE.Ri - EYE.choroidT - 0.12;
  const [r, z] = shellPoint(R, Math.PI - d / R);
  return [r * Math.cos(az), r * Math.sin(az), z];
};
const DISC_D = (Math.PI - 157 * DEG) * EYE.Ri;
const disc = (() => { const a = 157 * DEG; const p = shellPoint(EYE.Ri - EYE.choroidT - 0.2, a); return [-p[0], 0, p[1]]; })();

export const SHOTS = [
  // =================================================================== cataract surgery
  {
    ...L2, id: 'cataract-surgery-l2-hero', slug: 'cataract-surgery', camera: 'oblique',
    build: cataract, cam: { H: 8.0, shift: [0, -0.95] }, ppm: 1.5,
    anchors: [
      { id: 'cataract-nucleus', p: onHalf(-1.4, -1.45) },
      { id: 'lens-cortex', p: onHalf(-3.9, -1.25) },
      { id: 'iol-optic', p: onHalf(1.4, -1.2) },
      { id: 'capsular-bag', p: onHalf(4.4, -1.24) },
      { id: 'iris', p: onHalf(-4.4, 0.25) },
      { id: 'ciliary-body', p: onHalf(ciliaryTip[0] + 0.3, ciliaryTip[1]) }
    ]
  },
  {
    ...L1, id: 'cataract-surgery-l1-card', slug: 'cataract-surgery', camera: 'oblique',
    build: (ctx) => quadrant(ctx, { globe: { lens: 'cataract', pupilR: 2.6, gelAlpha: 0.82 }, phi0: -90, phi1: 0, polar: 60, az: -64, up: [1, 0, 0], target: [0.4, -0.6, -2.2], H: 21, caps: { zMin: -14 }, fade: { cx: 0.5, cy: 0.5, rx: 0.62, ry: 0.56, inner: 0.7 } }),
    anchors: [
      { id: 'cataract-nucleus', p: onFace(0, 0.5, EYE.lensEqZ - 0.2) },
      { id: 'cornea', p: onFace(0, 1.5, corneaMid(1.5)) },
      { id: 'iris', p: onFace(0, 4.3, 0.35) },
      { id: 'sclera', p: onFace(0, ...shell(EYE.Ri + 0.37, 64)) },
      { id: 'vitreous', p: onFace(0, 3.5, -6) },
      { id: 'ciliary-body', p: onFace(0, ciliaryTip[0] + 0.3, ciliaryTip[1]) }
    ]
  },
  {
    ...L3, id: 'cataract-surgery-l3-lens-capsule', slug: 'cataract-surgery', camera: 'sagittal',
    build: (ctx) => sagittal(ctx, { globe: { lens: 'cataract', pupilR: 2.4, gelAlpha: 0.84 }, focus: [2.5, -0.9], H: 7.6, tilt: 9, lift: 6, caps: { zMin: -7.5 } }),
    anchors: [
      { id: 'cataract-nucleus', p: onHalf(0.6, -1.5) },
      { id: 'lens-cortex', p: onHalf(3.6, -1.6) },
      { id: 'anterior-capsule', p: onHalf(2.2, lensAntZ(2.2)) },
      { id: 'posterior-capsule', p: onHalf(2.2, lensPostZ(2.2)) },
      { id: 'zonules', p: onHalf(5.05, -1.12) },
      { id: 'ciliary-body', p: onHalf(ciliaryTip[0] + 0.5, ciliaryTip[1]) },
      { id: 'iris', p: onHalf(3.6, 0.3) },
      { id: 'cornea', p: onHalf(2.0, corneaMid(2.0)) },
      { id: 'anterior-chamber', p: onHalf(1.4, 1.6) }
    ]
  },
  {
    ...L3, id: 'cataract-surgery-l3-iol-in-bag', slug: 'cataract-surgery', camera: 'sagittal',
    build: (ctx) => sagittal(ctx, { globe: { lens: 'iol', pupilR: 2.4, gelAlpha: 0.84, iolOpts: { phi0: 100 * DEG } }, focus: [2.5, -0.9], H: 7.6, tilt: 9, lift: 6, caps: { zMin: -7.5 } }),
    anchors: [
      { id: 'iol-optic', p: onHalf(1.2, -1.25) },
      { id: 'capsular-bag', p: onHalf(4.55, -1.24) },
      { id: 'posterior-capsule', p: onHalf(3.3, bagPost(3.3) - 0.02) },
      { id: 'zonules', p: onHalf(5.05, -1.12) },
      { id: 'ciliary-body', p: onHalf(ciliaryTip[0] + 0.5, ciliaryTip[1]) },
      { id: 'iris', p: onHalf(3.6, 0.3) },
      { id: 'cornea', p: onHalf(2.0, corneaMid(2.0)) }
    ]
  },

  // =================================================================== lens implants
  {
    ...L2, id: 'lens-implants-l2-hero', slug: 'lens-implants', camera: 'oblique',
    build: (ctx) => cutaway(ctx, { globe: { lens: 'iol', pupilR: 3.4, iolOpts: { phi0: 205 * DEG } }, dir: [0.42, 0.6, 0.68], up: [0, 1, 0], target: [0.2, -0.4, -0.9], H: 8.4, shift: [0, -0.5], caps: { zMin: -4.1 }, fade: { cx: 0.5, cy: 0.54, rx: 0.5, ry: 0.64, inner: 0.62 } }),
    anchors: [
      { id: 'iol-optic', p: onHalf(-1.2, -1.2) },
      { id: 'capsular-bag', p: onHalf(-4.55, -1.24) },
      { id: 'posterior-capsule', p: onHalf(2.4, bagPost(2.4) - 0.02) },
      { id: 'iris', p: onHalf(4.4, 0.25) },
      { id: 'cornea', p: onHalf(-2.6, corneaMid(2.6)) },
      { id: 'ciliary-body', p: onHalf(-(ciliaryTip[0] + 0.3), ciliaryTip[1]) },
      { id: 'zonules', p: onHalf(5.05, -1.12) }
    ]
  },
  {
    ...L1, id: 'lens-implants-l1-card', slug: 'lens-implants', camera: 'frontal',
    build: (ctx) => bagSpecimen(ctx, { polar: 30, az: -60, H: 15.5 }),
    anchors: [
      { id: 'iol-optic', p: [0.6, -0.6, -0.9] },
      { id: 'iol-haptic', p: [4.2 * Math.cos(100 * DEG), 4.2 * Math.sin(100 * DEG), -1.27] },
      { id: 'capsular-bag', p: [4.6 * Math.cos(-150 * DEG), 4.6 * Math.sin(-150 * DEG), -1.24] },
      { id: 'zonules', p: [5.1 * Math.cos(-40 * DEG), 5.1 * Math.sin(-40 * DEG), -1.1] }
    ]
  },
  {
    ...L3, id: 'lens-implants-l3-iol-in-bag', slug: 'lens-implants', camera: 'oblique',
    build: (ctx) => bagSpecimen(ctx, { polar: 42, az: -60, H: 14.2 }),
    anchors: [
      { id: 'iol-optic', p: [0.6, -0.6, -0.9] },
      { id: 'iol-haptic', p: [4.2 * Math.cos(100 * DEG), 4.2 * Math.sin(100 * DEG), -1.27] },
      { id: 'capsular-bag', p: [4.6 * Math.cos(-150 * DEG), 4.6 * Math.sin(-150 * DEG), -1.24] },
      { id: 'zonules', p: [5.1 * Math.cos(-40 * DEG), 5.1 * Math.sin(-40 * DEG), -1.1] },
      { id: 'ciliary-body', p: [5.5 * Math.cos(-80 * DEG), 5.5 * Math.sin(-80 * DEG), -0.9] }
    ]
  },
  {
    ...L3, id: 'lens-implants-l3-optic-types', slug: 'lens-implants', camera: 'oblique',
    build: implants, opts: { resting: true, grid: true }, cam: { H: 23, target: [0, -0.3, 0.4], dir: [0, -Math.cos(58 * DEG), Math.sin(58 * DEG)] }, ppm: 1,
    anchors: [
      { id: 'iol-monofocal', p: [-5.4, 4.7, 0.82] },
      { id: 'iol-toric', p: [5.4, 4.7, 0.82] },
      { id: 'toric-marks', p: [5.4 + 2.6 * Math.cos(28 * DEG), 4.7 + 2.6 * Math.sin(28 * DEG), 0.82] },
      { id: 'iol-multifocal', p: [-5.4, -4.9, 0.82] },
      { id: 'iol-edof', p: [5.4, -4.9, 0.82] },
      { id: 'iol-haptic', p: [5.4 + 4.4 * Math.cos(160 * DEG), -4.9 + 4.4 * Math.sin(160 * DEG), 0.38] }
    ]
  },

  // =================================================================== laser vision correction
  {
    ...L2, id: 'laser-vision-correction-l2-hero', slug: 'laser-vision-correction', camera: 'oblique',
    build: laser, cam: { H: 8.9 }, ppm: 1.5,
    anchors: [
      { id: 'flap', p: flapPoint(-1.6, 1.4) },
      { id: 'flap-hinge', p: [2.6, LX.yh, A(Math.hypot(2.6, LX.yh)) - 0.1] },
      { id: 'stromal-bed', p: [-2.2, 1.2, A(Math.hypot(-2.2, 1.2)) - LX.tf - abl(Math.hypot(-2.2, 1.2))] },
      { id: 'ablation-zone', p: [0.4, 0, A(0.4) - LX.tf - LX.d0 * 0.45] },
      { id: 'laser-beam', p: [laserHit[0], laserHit[1], laserHit[2] + 3.2] },
      { id: 'corneal-epithelium', p: depthAt(-5.2, LX.EPI / 2) },
      { id: 'stroma', p: depthAt(-2.6, TT(-2.6) * 0.55) },
      { id: 'endothelium', p: depthAt(2.4, TT(2.4) - 0.015) }
    ]
  },
  {
    ...L1, id: 'laser-vision-correction-l1-card', slug: 'laser-vision-correction', camera: 'oblique',
    build: laser, cam: { H: 10.6, target: [0.4, 1.7, 3.6], dir: [Math.sin(30 * DEG) * Math.cos(38 * DEG), -Math.cos(30 * DEG) * Math.cos(38 * DEG), Math.sin(38 * DEG)] }, ppm: 1.4,
    anchors: [
      { id: 'flap', p: flapPoint(-1.6, 1.4) },
      { id: 'stromal-bed', p: [-2.2, 1.2, A(Math.hypot(-2.2, 1.2)) - LX.tf - abl(Math.hypot(-2.2, 1.2))] },
      { id: 'laser-beam', p: [laserHit[0], laserHit[1], laserHit[2] + 3.2] },
      { id: 'stroma', p: depthAt(-2.6, TT(-2.6) * 0.55) }
    ]
  },
  {
    ...L3, id: 'laser-vision-correction-l3-corneal-layers', slug: 'laser-vision-correction', camera: 'macro',
    build: laser, cam: { H: 2.5, target: depthAt(-4.3, 0.95), dir: [0.1, -0.985, 0.14], up: [-4.3 / EYE.corneaRc, 0, (A(4.3) - (EYE.corneaApexZ - EYE.corneaRc)) / EYE.corneaRc], ortho: true }, ppm: 4.6, fade: null,
    anchors: [
      { id: 'corneal-epithelium', p: depthAt(-5.3, LX.EPI * 0.5) },
      { id: 'bowman', p: depthAt(-5.0, LX.EPI + LX.BOW * 0.5) },
      { id: 'stroma', p: depthAt(-4.9, TT(-4.9) * 0.5) },
      { id: 'descemet', p: depthAt(-5.2, TT(-5.2) - 0.027 - 0.018) },
      { id: 'endothelium', p: depthAt(-4.7, TT(-4.7) - 0.012) },
      { id: 'stromal-bed', p: depthAt(-3.75, LX.tf + 0.02) },
      { id: 'flap-edge', structure: 'flap', p: depthAt(-4.25, LX.tf * 0.5) }
    ]
  },
  {
    ...L3, id: 'laser-vision-correction-l3-ablation-profile', slug: 'laser-vision-correction', camera: 'macro',
    build: laser, cam: { H: 3.0, target: [-0.6, 0.2, A(0) - 0.6], dir: [Math.sin(16 * DEG) * Math.cos(20 * DEG), -Math.cos(16 * DEG) * Math.cos(20 * DEG), Math.sin(20 * DEG)] }, ppm: 3.7, fade: null,
    anchors: [
      { id: 'original-profile', p: depthAt(-1.9, LX.tf) },
      { id: 'ablation-zone', p: [-0.3, 0, A(0.3) - LX.tf - abl(0.3) * 0.5] },
      { id: 'stromal-bed', p: [-1.4, 0.9, A(Math.hypot(1.4, 0.9)) - LX.tf - abl(Math.hypot(1.4, 0.9))] },
      { id: 'laser-beam', p: [laserHit[0], laserHit[1], laserHit[2] + 1.1] },
      { id: 'stroma', p: depthAt(-1.2, LX.tf + 0.7) }
    ]
  },

  // =================================================================== ICL
  {
    ...L2, id: 'icl-l2-hero', slug: 'icl', camera: 'oblique',
    build: icl, cam: { H: 6.7 }, ppm: 1.5,
    anchors: [
      { id: 'icl', p: onFace(PHI_LONG, 1.6, iclBase(1.6) + 0.06) },
      { id: 'vault', p: onFace(PHI_LONG, 1.0, (iclBase(1.0) + lensAntZ(1.0)) / 2) },
      { id: 'natural-lens', p: onFace(PHI_LONG, 1.8, -1.0) },
      { id: 'iris', p: onFace(PHI_LONG, 4.2, 0.78) },
      { id: 'cornea', p: onFace(PHI_LONG, 2.4, corneaMid(2.4)) },
      { id: 'icl-footplate', p: onFace(PHI_LONG, 5.45, iclBase(5.45) + 0.06) },
      { id: 'anterior-chamber', p: onFace(PHI_LONG, 1.6, 2.2) }
    ]
  },
  {
    ...L1, id: 'icl-l1-card', slug: 'icl', camera: 'oblique',
    build: icl, cam: { H: 7.6, target: [1.6, 2.3, 0.35] }, ppm: 1.3, fade: { cx: 0.46, cy: 0.5, rx: 0.62, ry: 0.56, inner: 0.62 },
    anchors: [
      { id: 'icl', p: onFace(PHI_LONG, 1.6, iclBase(1.6) + 0.06) },
      { id: 'vault', p: onFace(PHI_LONG, 1.0, (iclBase(1.0) + lensAntZ(1.0)) / 2) },
      { id: 'natural-lens', p: onFace(PHI_LONG, 1.8, -1.0) },
      { id: 'iris', p: onFace(PHI_LONG, 4.2, 0.78) }
    ]
  },
  {
    ...L3, id: 'icl-l3-vault-section', slug: 'icl', camera: 'sagittal',
    build: (ctx) => iclSagittal(ctx),
    anchors: [
      { id: 'icl', p: onHalf(2.0, iclBase(2.0) + 0.08) },
      { id: 'vault', p: onHalf(0.9, (iclBase(0.9) + lensAntZ(0.9)) / 2) },
      { id: 'natural-lens', p: onHalf(2.0, -0.9) },
      { id: 'iris', p: onHalf(4.0, 0.95) },
      { id: 'icl-footplate', p: onHalf(5.5, iclBase(5.5) + 0.06) },
      { id: 'ciliary-sulcus', p: onHalf(5.8, -0.05) },
      { id: 'ciliary-body', p: onHalf(ciliaryTip[0] + 0.5, ciliaryTip[1] - 0.2) },
      { id: 'cornea', p: onHalf(2.2, corneaMid(2.2)) },
      { id: 'anterior-chamber', p: onHalf(1.6, 2.2) }
    ]
  },

  // =================================================================== keratoconus / CXL
  {
    ...L2, id: 'keratoconus-cxl-l2-hero', slug: 'keratoconus-cxl', camera: 'oblique',
    build: cxl, opts: { loupe: false }, cam: { H: 9.6, target: [-1.0, -0.8, 1.9] }, ppm: 1.55,
    anchors: [
      { id: 'cone', p: [-1.5, 0, F(-1.5, 0) - 0.12] },
      { id: 'normal-dome', p: [-3.1, 0, corneaAntZ(3.1)] },
      { id: 'riboflavin', p: [-2.6, 0, F(-2.6, 0) - 0.2] },
      { id: 'uv-light', p: [-2.6, -1.2, 5.6] },
      { id: 'iris', p: [-4.0, 0, 0.32] },
      { id: 'anterior-chamber', p: [-1.4, 0, 2.2] }
    ]
  },
  {
    ...L1, id: 'keratoconus-cxl-l1-card', slug: 'keratoconus-cxl', camera: 'oblique',
    build: cxl, opts: { loupe: false, uv: 0.6 }, cam: { H: 6.6, target: [-1.9, -0.6, 2.9] }, ppm: 2.0, fade: { cx: 0.5, cy: 0.5, rx: 0.62, ry: 0.56, inner: 0.62 },
    anchors: [
      { id: 'cone', p: [-1.5, 0, F(-1.5, 0) - 0.12] },
      { id: 'normal-dome', p: [-3.1, 0, corneaAntZ(3.1)] },
      { id: 'riboflavin', p: [-2.6, 0, F(-2.6, 0) - 0.2] },
      { id: 'uv-light', p: [-2.6, -1.2, 5.6] }
    ]
  },
  {
    ...L3, id: 'keratoconus-cxl-l3-cone-section', slug: 'keratoconus-cxl', camera: 'sagittal',
    build: cxl, opts: { loupe: false, uv: 0.6 }, cam: { H: 6.4, fov: 12, target: [-1.7, 0, 2.9], dir: [0.06, -0.96, 0.27], up: [1, 0, 0] }, ppm: 1.9, fade: null,
    anchors: [
      { id: 'cone', p: [-1.4, 0, F(-1.4, 0) - TC(-1.4, 0) * 0.5] },
      { id: 'normal-dome', p: [-2.9, 0, corneaAntZ(2.9)] },
      { id: 'riboflavin', p: [-2.2, 0, F(-2.2, 0) - 0.12] },
      { id: 'stroma', p: [-3.2, 0, F(-3.2, 0) - TC(-3.2, 0) * 0.65] },
      { id: 'endothelium', p: [-0.9, 0, F(-0.9, 0) - TC(-0.9, 0) + 0.01] }
    ]
  },
  {
    ...L3, id: 'keratoconus-cxl-l3-collagen-crosslinks', slug: 'keratoconus-cxl', camera: 'macro',
    build: collagenLattice,
    anchors: [
      { id: 'collagen-fibrils', p: [2.6, -2.5, 1.55] },
      { id: 'lamellae', p: [-4.2, 1.0, 0.31] },
      { id: 'cross-links', p: 'cross-link' },
      { id: 'riboflavin', p: [-2.6, -2.6, 1.55] }
    ]
  },

  // =================================================================== corneal transplant
  {
    ...L2, id: 'corneal-transplant-l2-hero', slug: 'corneal-transplant', camera: 'frontal',
    build: transplant, opts: { inset: false }, cam: { H: 25.5, shift: [0, 0] }, ppm: 0.95, fade: null,
    anchors: [
      { id: 'donor-graft', p: [-1.4, 2.2, corneaAntZ(2.6)] },
      { id: 'graft-junction', p: [4.0 * Math.cos(200 * DEG), 4.0 * Math.sin(200 * DEG), corneaAntZ(4.0)] },
      { id: 'sutures', p: [4.45 * Math.cos(-19.5 * DEG), 4.45 * Math.sin(-19.5 * DEG), corneaAntZ(4.45) + 0.03] },
      { id: 'iris', p: [3.2 * Math.cos(-60 * DEG), 3.2 * Math.sin(-60 * DEG), 0.4] },
      { id: 'pupil', p: [0, 0, 0.1] },
      { id: 'sclera', p: [8.0 * Math.cos(330 * DEG), 8.0 * Math.sin(330 * DEG), -1.0] }
    ]
  },
  {
    ...L1, id: 'corneal-transplant-l1-card', slug: 'corneal-transplant', camera: 'frontal',
    build: transplant, opts: { inset: false }, cam: { H: 30, shift: [0, 0] }, ppm: 0.8, fade: null,
    anchors: [
      { id: 'donor-graft', p: [-1.8, 1.2, corneaAntZ(2.2)] },
      { id: 'sutures', p: [4.45 * Math.cos(-19.5 * DEG), 4.45 * Math.sin(-19.5 * DEG), corneaAntZ(4.45) + 0.03] },
      { id: 'graft-junction', p: [4.0 * Math.cos(200 * DEG), 4.0 * Math.sin(200 * DEG), corneaAntZ(4.0)] }
    ]
  },
  {
    ...L3, id: 'corneal-transplant-l3-graft-section', slug: 'corneal-transplant', camera: 'sagittal',
    build: graftSection, cam: { target: [-3.7, 0, 2.15] },
    anchors: [
      { id: 'donor-graft', p: depthAt(-2.2, TT(-2.2) * 0.5) },
      { id: 'graft-junction', p: depthAt(-PK.RG, TT(PK.RG) * 0.3) },
      { id: 'sutures', p: [4.32 * Math.cos(Math.PI - Math.PI / 16), 4.32 * Math.sin(Math.PI - Math.PI / 16), A(4.32) + 0.03] },
      { id: 'corneal-epithelium', p: depthAt(-5.3, 0.07) },
      { id: 'stroma', p: depthAt(-5.0, TT(5.0) * 0.55) },
      { id: 'endothelium', p: depthAt(-1.6, TT(1.6) - 0.012) }
    ]
  },
  {
    ...L3, id: 'corneal-transplant-l3-sutured-junction', slug: 'corneal-transplant', camera: 'macro',
    build: transplant, opts: { inset: false }, cam: { H: 5.6, fov: 12, target: [-2.9, -2.3, 2.3], dir: dirFrom(55, 208), up: [0, 0, 1], shift: [0, 0] }, ppm: 2.6, fade: null,
    anchors: [
      { id: 'sutures', p: [4.45 * Math.cos(-154.5 * DEG), 4.45 * Math.sin(-154.5 * DEG), corneaAntZ(4.45) + 0.03] },
      { id: 'graft-junction', p: [4.0 * Math.cos(-140 * DEG), 4.0 * Math.sin(-140 * DEG), corneaAntZ(4.0)] },
      { id: 'donor-graft', p: [-1.6, -1.2, corneaAntZ(2.0)] },
      { id: 'iris', p: [3.3 * Math.cos(-125 * DEG), 3.3 * Math.sin(-125 * DEG), 0.45] }
    ]
  },

  // =================================================================== intravitreal injections
  {
    ...L2, id: 'intravitreal-injections-l2-hero', slug: 'intravitreal-injections', camera: 'oblique',
    build: injection, cam: { H: 26, dir: dirFrom(66, 72), shift: [0.6, -0.4] }, ppm: 1.5, tex: 1.6,
    anchors: [
      { id: 'needle', p: injE.entry.clone().addScaledVector(injE.d, -3).toArray() },
      { id: 'injection-site', p: injE.entry.toArray() },
      { id: 'medication', p: injE.tip.clone().addScaledVector(injE.d, 1.0).toArray() },
      { id: 'macula', p: fovea },
      { id: 'optic-disc', p: disc },
      { id: 'retina', p: onFace(205 * DEG, ...shell(EYE.Ri - EYE.choroidT - 0.12, 128)) },
      { id: 'vitreous', p: [0, 2.0, EYE.cz - 3] },
      { id: 'optic-nerve', p: [-EYE.scleraR * Math.sin(157 * DEG) * 1.25, 0, EYE.cz + EYE.scleraR * Math.cos(157 * DEG) * 1.25] }
    ]
  },
  {
    ...L1, id: 'intravitreal-injections-l1-card', slug: 'intravitreal-injections', camera: 'oblique',
    build: injection, cam: { H: 33, dir: dirFrom(66, 72), shift: [0.2, -0.3] }, ppm: 1.0, tex: 1.2,
    anchors: [
      { id: 'needle', p: injE.entry.clone().addScaledVector(injE.d, -3).toArray() },
      { id: 'medication', p: injE.tip.clone().addScaledVector(injE.d, 1.0).toArray() },
      { id: 'macula', p: fovea },
      { id: 'retina', p: onFace(205 * DEG, ...shell(EYE.Ri - EYE.choroidT - 0.12, 128)) }
    ]
  },
  {
    ...L3, id: 'intravitreal-injections-l3-pars-plana-entry', slug: 'intravitreal-injections', camera: 'sagittal',
    build: (ctx) => injectionSagittal(ctx),
    anchors: [
      { id: 'injection-site', p: [injS.entry.x, 0, injS.entry.z] },
      { id: 'pars-plana', p: onHalf(...shell(EYE.Ri - 0.18, 52)) },
      { id: 'ciliary-body', p: onHalf(ciliaryTip[0] + 0.3, ciliaryTip[1]) },
      { id: 'ora-serrata', p: onHalf(...shell(EYE.Ri - 0.25, EYE.aOra / DEG)) },
      { id: 'retina', p: onHalf(...shell(EYE.Ri - EYE.choroidT - 0.08, 82)) },
      { id: 'natural-lens', p: onHalf(2.2, -1.3) },
      { id: 'vitreous', p: onHalf(6.2, -6.8) },
      { id: 'medication', p: [injS.tip.x + injS.d.x * 0.8, 0, injS.tip.z + injS.d.z * 0.8] },
      { id: 'limbus', p: onHalf(EYE.corneaRadius + 0.1, EYE.limbusZ - 0.25) }
    ]
  },
  {
    ...L3, id: 'intravitreal-injections-l3-macula', slug: 'intravitreal-injections', camera: 'macro',
    build: (ctx) => posteriorPole(ctx), tex: 3.2,
    anchors: [
      { id: 'fovea', p: fundusPoint(0, 0) },
      { id: 'macula', p: fundusPoint(1.5, 0.9) },
      { id: 'optic-disc', p: fundusPoint(-DISC_D, 0) },
      { id: 'retinal-vessels', p: fundusPoint(-DISC_D + 0.42, 0.25 + 0.12 + 0.75) },
      { id: 'retina', p: fundusPoint(3.4, -3.1) }
    ]
  }
];
