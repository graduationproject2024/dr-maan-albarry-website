// ICL (implantable collamer lens): a straight sagittal section of the front of the eye, square to the cut face.
//
// atlas r3 (patient-clarity rebuild). The r1/r2 plates showed a 3/4 wedge cut-away with a translucent 3D implant, a
// tinted "vault" slab and two cut faces at once; patients could not tell which layer was the implant. Now:
//   - one flat, opaque section (a half cut, camera square to it); no translucent 3D implant is drawn;
//   - the implant is a single saturated teal arch, clearly a different colour from the pale cornea and the cream lens;
//   - it lies BEHIND the iris (the iris rests on it) and IN FRONT OF the natural lens, which is drawn whole and kept;
//   - the gap between the implant and the natural lens (the vault) is left as clear fluid, like the front chamber;
//   - both footplates rest in the groove (ciliary sulcus) between the iris root and the ciliary body.
//
// Geometry references (no new clinical dimensions are introduced here):
//   - src/surgical-sim/anatomy/geometry.js  ICL = { vault: 0.5, plateT: 0.1, opticR: 2.9, sulcusR: 5.6 }; the vault is
//     the clearance between the implant's back and the front of the natural lens.
//   - src/surgical-sim/procedures/icl.js     plateMid(): arch exponent ARCH = 2, optic bulge 0.08 mm, footplates in
//     the sulcus nook; irisOnIclZ(): the iris margin is raised until the whole iris clears the implant (gap 0.05 mm).
//   - scripts/illustrations/src/anatomy.js   lens, iris, ciliary body and cornea of the series' schematic eye
//     (lens front apex z = 0.30, iris root r = 5.55, ciliary-body front face r ~5.34 mm at z ~0.15 mm).
// Drawn exaggeration (recorded in the manifest): the plate is drawn 0.2 mm thick (2x the 0.1 mm of the reference
// model) so it stays visible on a 390 px phone; the 0.5 mm vault is kept true to the model.
import { buildGlobe } from '../globe.js';
import { EYE, lensAntZ, irisProfile } from '../anatomy.js';
import { dirFrom } from '../atlas/cameras.js';

export const ICL_REF = { vault: 0.5, plateT: 0.1, opticR: 2.9, opticBulge: 0.08, arch: 2, irisGap: 0.05 }; // surgical-sim values
export const DRAWN_T = 0.2; // drawn plate thickness (2x ICL_REF.plateT, legibility)
export const HALF_L = 5.3; // footplate tip in the sulcus nook, in front of the ciliary-body face (r ~5.34 at z ~0.15)
export const FOOT_Z = 0.2; // mid-surface height of the footplate in the sulcus
export const PUPIL_R = 2.3; // pupil radius drawn (as the r1/r2 plates)
const HT = DRAWN_T / 2;
const LENS_APEX = lensAntZ(0);
export const APEX_MID = LENS_APEX + ICL_REF.vault + HT; // the back of the plate sits exactly `vault` above the lens

const optic = (r) => (r < ICL_REF.opticR ? ICL_REF.opticBulge * (1 - (r / ICL_REF.opticR) ** 2) : 0);
const endTaper = (r) => { const e = HALF_L - 0.16; return r <= e ? 1 : Math.sqrt(Math.max(0, 1 - ((r - e) / 0.16) ** 2)); };
/** Mid-surface height of the plate at distance r from the axis, along its long axis (the plane of the section). */
export const plateMid = (r) => { const u = Math.min(1, Math.abs(r) / HALF_L); return FOOT_Z + (APEX_MID - FOOT_Z) * (1 - u * u) ** ICL_REF.arch; };
export const plateBack = (r) => plateMid(r) - HT * endTaper(Math.abs(r));
export const plateTop = (r) => plateMid(r) + (HT + optic(Math.abs(r))) * endTaper(Math.abs(r));
/** Height of the vault (clear gap) at r: back of the plate minus the front of the natural lens. */
export const vaultAt = (r) => plateBack(r) - lensAntZ(Math.min(Math.abs(r), EYE.lensEqR - 0.01));

// Iris lift: the lowest lift (pupil-margin rise, anatomy.irisProfile) for which the back of the whole iris clears the
// top of the plate by ICL_REF.irisGap (the same rule as irisOnIclZ in the surgical simulator).
function irisBack(lift) {
  const back = irisProfile(PUPIL_R, lift).slice(0, 23); // pts 0..nBack (22): back surface, pupil -> root
  return (r) => {
    for (let i = 1; i < back.length; i++) if (back[i][0] >= r) { const [r0, z0] = back[i - 1], [r1, z1] = back[i]; return z0 + (z1 - z0) * (r - r0) / (r1 - r0); }
    return back[back.length - 1][1];
  };
}
export const IRIS_LIFT = (() => {
  let lo = 0, hi = 2;
  for (let it = 0; it < 30; it++) {
    const mid = (lo + hi) / 2, b = irisBack(mid);
    let ok = true;
    for (let r = PUPIL_R; r <= Math.min(HALF_L, EYE.irisRootR - 0.05); r += 0.02) if (b(r) < plateTop(r) + ICL_REF.irisGap) { ok = false; break; }
    if (ok) hi = mid; else lo = mid;
  }
  return Math.round(hi * 1000) / 1000;
})();

/** Plate section polygon in (x, z) of the cut face, from footplate to footplate. */
export function plateSection() {
  const back = [], top = [];
  for (let x = -HALF_L; x <= HALF_L + 1e-9; x += 0.02) { back.push([x, plateBack(x)]); top.push([x, plateTop(x)]); }
  return [...back, ...top.reverse()];
}

// Aqueous of the front chamber, painted under every tissue: the part of the sphere of the corneal back surface in
// front of z = 0 (the tissues painted afterwards cover what is not fluid). The shared humour painter
// (globe.paintHumors) stops at the inner globe sphere (z ~1.8 on the axis, ~1.0 at r = 4); above it the cut face was
// a window onto the 3D eye behind it.
export const AQUEOUS = 'rgb(232, 240, 242)';
export function paintAqueous(k) {
  const cz = EYE.corneaApexZ - EYE.corneaRc, R = EYE.corneaRc - EYE.corneaCentralT + 0.08, z0 = 0;
  const xr = Math.sqrt(R * R - (z0 - cz) ** 2), a0 = Math.atan2(xr, z0 - cz), pts = [];
  for (let i = 0; i <= 160; i++) { const a = -a0 + (2 * a0 * i) / 160; pts.push([R * Math.sin(a), cz + R * Math.cos(a)]); }
  k.fill(pts, AQUEOUS);
}

export const ICL_FILL = '#63BAC1';
export const ICL_INK = 'rgba(22, 82, 90, 0.95)';
/** Paints the implant on a section canvas (kit.makeSection), after the lens and before the iris. */
export function paintICL(k) {
  const poly = plateSection();
  k.fill(poly, ICL_FILL);
  k.shade(poly, 'rgba(255,255,255,0.35)', 1.2, 1.2);
  k.stroke(poly, ICL_INK, 2.6);
}

/**
 * The ICL section composition. view 'up': anterior up, x to the right (L1 card, L2 hero, legacy card);
 * view 'left': the atlas sagittal convention, anterior to the left, superior up (L3 close-up).
 * target [x, z] on the cut face; H visible height (mm); polar: degrees from the anterior axis (90 = square to the face).
 */
export function iclSection(ctx, { view = 'up', target = [0, 0.1], H = 8.6, fov = 12, polar = 89, swing = 0, fade = null, zMin = -5.4, r1 = 8.6, k = 1.1 } = {}) {
  const cam = ctx.camera({ target: [target[0], 0, target[1]], dir: dirFrom(polar, -90 + swing), up: view === 'up' ? [0, 0, 1] : [1, 0, 0], H, fov });
  const scene = ctx.scene(cam);
  const eye = buildGlobe(ctx.mats, {
    lens: 'clear', pupilR: PUPIL_R, irisLift: IRIS_LIFT, irisSeed: 7, fundusTint: '#6E5652',
    aqueousAlpha: 1, gelAlpha: 1, // opaque fluids: the front chamber and the vault read as one clear fluid, and the
    // section is never a window onto the 3D eye behind it
    cut: { mode: 'half', keep: '+y' },
    paintUnder: (kk) => paintAqueous(kk),
    paintExtra: (kk) => paintICL(kk)
  });
  const ppm = Math.round((2 * ctx.H / H) * k); // as compose.ppmFor (SS = 2)
  scene.add(eye.group, ...eye.caps({ r1, z1: 4.4, ppm, tones: [1, 1, 1], zMin }));
  return { passes: [{ scene, camera: cam, fade }], eye, cam };
}

// Legacy 1600 x 1000 card (render.mjs) and the default composition: the whole section, anterior up.
export default function icl(ctx) {
  const W = ctx.W, H = ctx.H;
  const r = iclSection(ctx, { view: 'up', target: [0, 0.15], H: 9.4, fade: { cx: W * 0.5, cy: H * 0.5, rx: W * 0.56, ry: H * 0.8, inner: 0.72 } });
  return { passes: r.passes };
}
