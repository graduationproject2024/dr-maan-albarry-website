// Lens implants: a calm "product" study of four brand-free intraocular lens optics side by side, resting just above
// a soft floor: monofocal (plain optic), toric (axis marks), multifocal / trifocal (diffractive rings across the
// optic) and extended depth of focus (a few broad echelettes in the centre only). Under each lens, the light it
// focuses onto the floor hints at its optical idea: one sharp point, a line, a point with halo rings, a stretched
// soft focus. All geometry and textures are procedural; ring spacings are abstract and match no product.
import * as THREE from 'three';
import { DEG } from '../anatomy.js';
import { lathe, normalMapFrom } from '../kit.js';

const H0 = 1.7; // optic centre height above the floor (mm)
const TYPES = ['mono', 'toric', 'trifocal', 'edof'];
const XS = [-13.2, -4.4, 4.4, 13.2];
const LIGHT_OFF = [1.1, -2.7]; // floor light/shadow offset (key light from the upper left, behind)
const TORIC_AXIS = 28 * DEG;

export default function implants(ctx) {
  const el = 47 * DEG;
  const cam = ctx.camera({ target: [0, -0.9, 0.9], dir: [0, -Math.cos(el), Math.sin(el)], up: [0, 0, 1], H: 24.5, fov: 20 });
  const scene = ctx.scene(cam);
  TYPES.forEach((t, i) => { const m = productIOL(ctx, t); m.position.set(XS[i], 0, H0); scene.add(m); });

  return {
    passes: [{ scene, camera: cam }],
    under(g, theme) {
      TYPES.forEach((t, i) => floorLight(g, theme, ctx, cam, XS[i], t));
    }
  };
}

function productIOL(ctx, type) {
  const g = new THREE.Group();
  // biconvex 6 mm optic with a square edge (centre 0.8 mm, edge 0.3 mm)
  const kk = 0.25 / 9, prof = [];
  for (let r = 0; r <= 3.0001; r += 0.05) prof.push([r, -0.4 + kk * r * r]);
  prof.push([3, 0.4 - kk * 9]);
  for (let r = 3; r >= -0.0001; r -= 0.05) prof.push([Math.max(0, r), 0.4 - kk * r * r]);
  const og = lathe(prof, { phiLength: Math.PI * 2, segments: 256 });
  const p = og.attributes.position, uv = og.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 6.2 + 0.5, p.getY(i) / 6.2 + 0.5);
  const mat = new THREE.MeshPhysicalMaterial({
    color: '#A6DCE0', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.68, depthWrite: false,
    clearcoat: 1, clearcoatRoughness: 0.03, envMap: ctx.envMap, envMapIntensity: 1.35, side: THREE.DoubleSide, specularIntensity: 1
  });
  const surf = opticSurface(type);
  if (surf.normal) { mat.normalMap = surf.normal; mat.normalScale = new THREE.Vector2(1, 1); }
  mat.map = surf.color;
  const optic = new THREE.Mesh(og, mat); optic.renderOrder = 5; g.add(optic);
  // C-loop haptics, sweeping front/back (along y) so the row stays compact
  const hm = new THREE.MeshPhysicalMaterial({ color: '#79BFC6', roughness: 0.15, transparent: true, opacity: 0.85, clearcoat: 1, envMap: ctx.envMap, envMapIntensity: 0.9 });
  for (const off of [0, Math.PI]) {
    const pts = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50, r = 2.85 + (5.05 - 2.85) * Math.pow(Math.sin(t * Math.PI / 2), 0.9) - 0.25 * Math.pow(t, 6);
      const ph = 50 * DEG + off + t * 2.0 + 0.25 * Math.pow(t, 4);
      pts.push(new THREE.Vector3(r * Math.cos(ph), r * Math.sin(ph), -0.05 * t));
    }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 100, 0.1, 14, false), hm));
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), hm); cap.position.copy(pts[pts.length - 1]); g.add(cap);
  }
  if (type === 'toric') { // axis marks: three small dots on each side of the optic, sitting on the surface
    const dm = new THREE.MeshStandardMaterial({ color: '#2F6E78', roughness: 0.4 });
    for (const s of [1, -1]) for (const r of [2.35, 2.6, 2.85]) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 10), dm);
      d.position.set(s * r * Math.cos(TORIC_AXIS), s * r * Math.sin(TORIC_AXIS), 0.4 - kk * r * r + 0.01); d.scale.z = 0.35; g.add(d);
    }
  }
  return g;
}

// Diffractive / echelette surface relief as a normal map, with fine tinted ring lines so it reads at card size.
function opticSurface(type) {
  let zones;
  if (type === 'trifocal') zones = Array.from({ length: 16 }, (_, k) => 0.6 * Math.sqrt(k + 1)).filter((r) => r < 2.5);
  else if (type === 'edof') zones = [0.62, 1.0, 1.32];
  else zones = [];
  const toR = (u, v) => Math.hypot((u - 0.5) * 6.2, (v - 0.5) * 6.2);
  const h = (u, v) => {
    const r = toR(u, v);
    let i = zones.findIndex((z) => r < z);
    if (i < 0) return 0;
    const r0 = i ? zones[i - 1] : 0, r1 = zones[i], amp = type === 'trifocal' ? 1 - 0.55 * (r1 / 2.5) : 1.2;
    return amp * ((r - r0) / (r1 - r0)) * 0.012; // sawtooth step
  };
  const normal = zones.length ? normalMapFrom(h, 1024, 260) : null;
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 1024, 1024);
  const s = 1024 / 6.2;
  zones.forEach((r, k) => {
    g.strokeStyle = `rgba(30,104,116,${type === 'trifocal' ? 0.78 - k * 0.03 : 0.72})`;
    g.lineWidth = type === 'trifocal' ? 3.6 : 5;
    g.beginPath(); g.arc(512, 512, r * s, 0, Math.PI * 2); g.stroke();
  });
  // square optic edge: a slightly deeper rim so the optic reads against the floor
  const rim = g.createRadialGradient(512, 512, 2.75 * s, 512, 512, 3.05 * s);
  rim.addColorStop(0, 'rgba(50,130,142,0)'); rim.addColorStop(1, 'rgba(50,130,142,0.8)');
  g.fillStyle = rim; g.fillRect(0, 0, 1024, 1024);
  const color = new THREE.CanvasTexture(c); color.colorSpace = THREE.SRGBColorSpace; color.anisotropy = 16;
  return { normal, color };
}

// Soft floor shadow of the optic, with the light it focuses (illustrative caustics).
function floorLight(g, theme, ctx, cam, x, type) {
  const light = theme === 'light';
  const [ox, oy] = [x + LIGHT_OFF[0], LIGHT_OFF[1]];
  const o = ctx.project(cam, [ox, oy, 0]), ex = ctx.project(cam, [ox + 1, oy, 0]), ey = ctx.project(cam, [ox, oy + 1, 0]);
  g.save();
  g.setTransform(ex[0] - o[0], ex[1] - o[1], ey[0] - o[0], ey[1] - o[1], o[0], o[1]); // 1 unit = 1 mm on the floor
  const shadow = g.createRadialGradient(0, 0, 0, 0, 0, 5.2);
  shadow.addColorStop(0, light ? 'rgba(54,64,66,0.3)' : 'rgba(0,0,0,0.55)'); shadow.addColorStop(0.55, light ? 'rgba(54,64,66,0.17)' : 'rgba(0,0,0,0.3)'); shadow.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = shadow; g.fillRect(-6, -6, 12, 12);
  const glow = (r, a) => { const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, `rgba(255,255,250,${a})`); gr.addColorStop(0.4, `rgba(220,248,250,${a * 0.5})`); gr.addColorStop(1, 'rgba(220,248,250,0)'); g.fillStyle = gr; g.fillRect(-r, -r, 2 * r, 2 * r); };
  const ring = (r, w, a) => { g.strokeStyle = `rgba(232,252,252,${a})`; g.lineWidth = w; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke(); };
  if (type === 'mono') glow(0.75, 0.95);
  if (type === 'toric') { g.rotate(TORIC_AXIS + Math.PI / 2); g.scale(2.4, 0.42); glow(0.8, 0.95); }
  if (type === 'trifocal') { glow(0.62, 0.95); ring(1.35, 0.16, 0.55); ring(2.2, 0.14, 0.32); }
  if (type === 'edof') { g.scale(1, 1.9); glow(1.0, 0.85); }
  g.restore();
}
