// ICL: an oblique macro of the iris and posterior chamber, anterior to the left. A wedge of the anterior segment is
// cut away (to just behind the lens). One cut face runs along the implant's long axis: the plate vaults over the
// clear natural lens with its footplate in the ciliary sulcus, and the aqueous-filled gap (the vault) is tinted.
// The other cut face crosses the plate's short axis.
import * as THREE from 'three';
import { buildGlobe } from '../globe.js';
import { DEG, EYE, lensAntZ } from '../anatomy.js';
import { phakicLens } from '../instruments.js';
import { C } from '../style.js';

export const PHI_LONG = 58 * DEG; // the implant's long axis lies in this cut face
const CUT = { mode: 'wedge', phi0: -52 * DEG, phi1: PHI_LONG, zc: -3.95, floorAlpha: 0.5 }; // translucent gel floor (was a pale slab)

// Plate geometry, matching instruments.phakicLens (L = 5.75, Rb = 17, zApex = 0.84).
const L = 5.75, Rb = 17, zApex = 0.84;
const hw = (x) => {
  const ax = Math.abs(x);
  if (ax <= 2.6) return 3.25;
  if (ax <= 3.4) return 3.25 - 0.65 * Math.sin(((ax - 2.6) / 0.8) * Math.PI / 2);
  if (ax <= 4.7) return 2.6 + 0.3 * Math.sin(((ax - 3.4) / 1.3) * Math.PI / 2);
  const t = Math.min(1, (ax - 4.7) / (L - 4.7));
  return 2.9 * Math.pow(Math.max(0, 1 - t ** 4), 0.25);
};
const th = (x, y) => { const r = Math.hypot(x, y); return r < 2.9 ? 0.09 + 0.17 * (r / 2.9) ** 2 : 0.13; };
const base = (x, y) => zApex - (x * x + y * y) / (2 * Rb);

// Section of the plate along the half-line at polar angle phi: [r, z] polygon (bottom out, top back).
export function plateSection(phi, phiLong = PHI_LONG) {
  const a = phi - phiLong, bottom = [], top = [];
  for (let r = 0; r <= L + 0.001; r += 0.02) {
    const x = r * Math.cos(a), y = r * Math.sin(a);
    if (Math.abs(x) > L || Math.abs(y) > hw(x)) break;
    bottom.push([r, base(x, y)]); top.push([r, base(x, y) + th(x, y)]);
  }
  return { bottom, top, poly: [...bottom, ...top.reverse()] };
}

export default function icl(ctx) {
  const a = 62 * DEG, az = -24 * DEG;
  const dir = [Math.sin(a) * Math.cos(az), Math.sin(a) * Math.sin(az), Math.cos(a)];
  const cam = ctx.camera({ target: [1.5, 2.2, 0.5], shift: [-0.5, 0], dir, up: [0.35, 1, 0], H: 7.4, fov: 18 });
  const scene = ctx.scene(cam);
  const lens = phakicLens(ctx.mats, { full: true });
  lens.rotation.z = PHI_LONG;
  const eye = buildGlobe(ctx.mats, {
    lens: 'clear', pupilR: 2.3, irisLift: 0.72, cut: CUT, fundusTint: '#6E5652', irisSeed: 7,
    paintExtra: (k, phi) => paintPlate(k, phi)
  });
  lens.traverse((o) => { if (o.material) { o.material.clippingPlanes = eye.planes; o.material.clipIntersection = true; } });
  const m = lens.children[0].material; m.color = new THREE.Color('#9FD9DC'); m.opacity = 0.62;
  scene.add(eye.group, lens, ...eye.caps({ r1: 11.6, z1: 4.3, ppm: 330, tones: [0.88, 1, 0.92] }));
  const W = ctx.W, H = ctx.H;
  return { passes: [{ scene, camera: cam, fade: { cx: W * 0.42, cy: H * 0.5, rx: W * 0.56, ry: H * 0.74, inner: 0.56 } }] };
}

// The plate's section on the cut face at polar angle phi, with the vault (aqueous between the implant and the natural
// lens) tinted so the gap reads.
export function paintPlate(k, phi, phiLong = PHI_LONG, mirror = false) {
  const sec = plateSection(phi, phiLong);
  if (sec.bottom.length < 2) return;
  const m = mirror ? (poly) => poly.map(([r, z]) => [-r, z]) : (poly) => poly;
  const n = sec.bottom.length, rEnd = sec.bottom[n - 1][0];
  const over = sec.bottom.filter(([r]) => r < Math.min(rEnd, 4.2)).map(([r]) => [r, lensAntZ(Math.min(r, EYE.lensEqR - 0.01)) + 0.004]);
  const gap = [...sec.bottom.slice(0, over.length).map(([r, z]) => [r, z - 0.004]), ...over.reverse()];
  k.ctx.save(); k.ctx.filter = `blur(${k.mm(0.04)}px)`; k.fill(m(gap), 'rgba(118,202,220,0.62)'); k.ctx.restore();
  k.fill(m(sec.poly), C.implantSection);
  k.shade(m(sec.poly), 'rgba(40,110,120,0.35)', 3, 3);
  k.stroke(m(sec.poly), 'rgba(40,96,106,0.95)', 2.2);
}
