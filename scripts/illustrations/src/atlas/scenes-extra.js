// Close-up compositions that exist only in the atlas: the ICL vault and the pars plana entry in sagittal section, the
// posterior pole seen through an opened globe, the stromal collagen lattice (cross-linking) and the penetrating
// keratoplasty section block. All geometry is procedural and shares the series palette and light rig.
import * as THREE from 'three';
import { buildGlobe, zonules, bagShell } from '../globe.js';
import { EYE, DEG, shellPoint, corneaAntZ, corneaThickness, lensAntZ, ciliaryProfile } from '../anatomy.js';
import { corneaSpec, corneaMesh, makeSection, paintedQuad, glowSprite, rng, lathe } from '../kit.js';
import { phakicLens, injectionNeedle, orient, iol } from '../instruments.js';
import { paintPlate } from '../scenes/icl.js';
import { LAYER } from '../scenes/laser.js';
import { sagittal, ppmFor, dirFrom } from './compose.js';

// ---------------------------------------------------------------- ICL: the vault in true sagittal section
export function iclSagittal(ctx, { focus = [3.0, 0.2], H = 6.4 } = {}) {
  return sagittal(ctx, {
    focus, H, tilt: 12, lift: 6,
    globe: { lens: 'clear', pupilR: 2.3, irisLift: 0.72, irisSeed: 7, paintExtra: (k) => { paintPlate(k, 0, 0); paintPlate(k, 0, 0, true); } },
    caps: { zMin: -6.5 },
    extra: (scene, eye) => {
      const lens = phakicLens(ctx.mats, { full: true });
      lens.traverse((o) => { if (o.material) { o.material.clippingPlanes = eye.planes; o.material.clipIntersection = true; } });
      const m = lens.children[0].material; m.color = new THREE.Color('#9FD9DC'); m.opacity = 0.6;
      scene.add(lens);
    }
  });
}

// ---------------------------------------------------------------- Intravitreal injection: pars plana entry in section
export const ENTRY_MM = 3.75; // behind the limbus, along the outer scleral surface (illustrative, see the manifest)
export function entryGeometry(phi = 0) {
  const aE = EYE.aLimbus + ENTRY_MM / EYE.scleraR;
  const [er, ez] = shellPoint(EYE.scleraR, aE);
  const entry = new THREE.Vector3(er * Math.cos(phi), er * Math.sin(phi), ez);
  const aim = new THREE.Vector3(1.2 * Math.cos(phi), 1.2 * Math.sin(phi), EYE.cz + 0.2);
  const d = aim.clone().sub(entry).normalize();
  const tip = entry.clone().addScaledVector(d, 7.4);
  return { entry, d, tip, aE };
}
export function injectionSagittal(ctx, { focus = [6.2, -3.4], H = 11.5 } = {}) {
  return sagittal(ctx, {
    focus, H, tilt: 6, lift: 4, fov: 13,
    globe: { lens: 'clear', pupilR: 2.0, irisSeed: 5 },
    caps: { zMin: -12, ppm: ppmFor(ctx, H, 1.0) },
    extra: (scene) => {
      const { d, tip } = entryGeometry(0);
      const nd = orient(injectionNeedle(ctx.mats, 13), tip.toArray(), d.clone().negate().toArray());
      nd.position.y = -0.2; // just in front of the cut face, in the section plane
      scene.add(nd);
      const b = tip.clone().addScaledVector(d, 0.8); b.y = -0.3;
      scene.add(glowSprite(b.toArray(), 2.4, [120, 196, 214], 0.7, { depthTest: false }));
      scene.add(glowSprite([tip.x + d.x * 0.3, -0.3, tip.z + d.z * 0.3], 1.1, [210, 244, 250], 0.85, { depthTest: false }));
    }
  });
}

// ---------------------------------------------------------------- Posterior pole seen through the opened globe
export function posteriorPole(ctx, { H = 10.5, fov = 42, polar = 10 } = {}) {
  // The camera sits inside the vitreous cavity (about 13 mm in front of the retina) and looks back at the posterior
  // pole, the way the fundus is seen in an examination; nothing needs cutting because the near plane is inside the eye.
  const pole = [0, 0, EYE.cz - EYE.Ri + EYE.choroidT + 0.2];
  const cam = ctx.camera({ target: [pole[0] - 2.0, pole[1], pole[2]], dir: dirFrom(polar, 180), up: [0, 1, 0], H, fov });
  cam.near = 0.5; cam.updateProjectionMatrix();
  const scene = ctx.scene(cam);
  const eye = buildGlobe(ctx.mats, { lens: 'none', posterior: true, irisSeed: 5 });
  scene.add(eye.group);
  return { passes: [{ scene, camera: cam, fade: null }], cam };
}

// ---------------------------------------------------------------- Corneal stroma: collagen lamellae and cross-links
// A schematic block of stroma (not to scale: real fibrils are ~30 nm): stacked lamellae whose fibrils alternate in
// direction, a riboflavin tint strongest in the anterior lamellae, and violet bridges for the new cross-links.
export function collagenLattice(ctx) {
  const cam = ctx.camera({ target: [0, 0, 0.1], dir: dirFrom(62, -58), up: [0, 0, 1], H: 7.4, fov: 16 });
  const scene = ctx.scene(cam);
  const R = rng(19);
  const BX = 4.2, BY = 2.6, nL = 6, gap = 0.62, rF = 0.13;
  const fib = (tint) => new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.38, clearcoat: 0.4, envMap: ctx.envMap, envMapIntensity: 0.55 });
  const link = new THREE.MeshStandardMaterial({ color: '#7A62E8', roughness: 0.3, emissive: '#4B36B0', emissiveIntensity: 0.45, envMap: ctx.envMap, envMapIntensity: 0.4 });
  const fibrils = [];
  for (let L = 0; L < nL; L++) {
    const z = 1.55 - L * gap;
    const ribo = Math.max(0, 1 - L / (nL - 1.5)); // riboflavin strongest anteriorly
    const col = new THREE.Color('#EFE4C4').lerp(new THREE.Color('#E2C64A'), 0.75 * ribo);
    const alongX = L % 2 === 0, len = alongX ? 2 * BX : 2 * BY, span = alongX ? BY : BX, n = Math.floor((2 * span) / (2 * rF + 0.2));
    const geo = new THREE.CylinderGeometry(rF, rF, len, 20, 1, false);
    const mesh = new THREE.InstancedMesh(geo, fib(col), n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), alongX ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0));
    for (let i = 0; i < n; i++) {
      const c = -span + rF + 0.05 + i * ((2 * span - 2 * rF - 0.1) / (n - 1));
      const p = alongX ? new THREE.Vector3(0, c, z + (R() - 0.5) * 0.05) : new THREE.Vector3(c, 0, z + (R() - 0.5) * 0.05);
      m4.compose(p, q, new THREE.Vector3(1, 1, 1)); mesh.setMatrixAt(i, m4);
      fibrils.push({ L, alongX, c, z: p.z });
    }
    scene.add(mesh);
  }
  // cross-links: short bridges between neighbouring fibrils in a lamella and between adjacent lamellae (treated zone)
  const bridges = [];
  const segGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 12);
  const addBridge = (a, b) => { const v = b.clone().sub(a), mid = a.clone().add(b).multiplyScalar(0.5); bridges.push({ mid, q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize()), len: v.length() }); };
  for (const f of fibrils) {
    if (f.L > 3 || R() > 0.8) continue; // cross-linking concentrated in the anterior stroma
    const nb = fibrils.find((g) => g.L === f.L && g.c > f.c && g.c - f.c < 0.6);
    for (let rep = 0; rep < 3 && nb; rep++) {
      const t = (R() * 2 - 1) * (f.alongX ? BX - 0.4 : BY - 0.4);
      const a = f.alongX ? new THREE.Vector3(t, f.c + rF * 0.8, f.z) : new THREE.Vector3(f.c + rF * 0.8, t, f.z);
      const b = f.alongX ? new THREE.Vector3(t, nb.c - rF * 0.8, nb.z) : new THREE.Vector3(nb.c - rF * 0.8, t, nb.z);
      addBridge(a, b);
    }
    if (R() < 0.75) { // to the lamella below, at a crossing
      const below = fibrils.filter((g) => g.L === f.L + 1);
      const g = below[Math.floor(R() * below.length)];
      if (g) {
        const x = f.alongX ? g.c : f.c, y = f.alongX ? f.c : g.c;
        if (Math.abs(x) < BX - 0.2 && Math.abs(y) < BY - 0.2) addBridge(new THREE.Vector3(x, y, f.z - rF * 0.85), new THREE.Vector3(x, y, g.z + rF * 0.85));
      }
    }
  }
  const lm = new THREE.InstancedMesh(segGeo, link, bridges.length);
  const top = bridges.filter((b) => b.mid.z > 1.4).sort((a, b) => Math.abs(a.mid.x - 0.6) + Math.abs(a.mid.y + 0.8) - Math.abs(b.mid.x - 0.6) - Math.abs(b.mid.y + 0.8))[0];
  const m4 = new THREE.Matrix4();
  bridges.forEach((b, i) => { m4.compose(b.mid, b.q, new THREE.Vector3(1, b.len, 1)); lm.setMatrixAt(i, m4); });
  scene.add(lm);
  // interfibrillar ground substance: a faint glassy envelope so the block reads as tissue, not loose rods
  const env = new THREE.Mesh(new THREE.BoxGeometry(2 * BX + 0.08, 2 * BY + 0.08, nL * gap + 0.06), new THREE.MeshPhysicalMaterial({ color: '#F6EFD8', roughness: 0.2, transparent: true, opacity: 0.12, depthWrite: false, envMap: ctx.envMap, envMapIntensity: 0.6, clearcoat: 1 }));
  env.position.z = 1.55 - ((nL - 1) * gap) / 2; env.renderOrder = 8; scene.add(env);
  const W = ctx.W, Hh = ctx.H;
  return {
    passes: [{ scene, camera: cam, fade: null }],
    under(g) {
      const [cx, cy] = ctx.project(cam, [0, 0, 1.55 - nL * gap - 0.1]);
      g.translate(cx, cy + Hh * 0.02); g.scale(1, 0.2);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, W * 0.38);
      gr.addColorStop(0, 'rgba(60,50,42,0.2)'); gr.addColorStop(1, 'rgba(60,50,42,0)');
      g.fillStyle = gr; g.fillRect(-W, -Hh * 3, 2 * W, Hh * 6);
    },
    lattice: { BX, BY, nL, gap },
    points: { 'cross-link': top ? top.mid.toArray() : [0, 0, 1.55] }
  };
}

// ---------------------------------------------------------------- Penetrating keratoplasty: the graft in section
// A block of cornea (back half kept, thickness exaggerated x3 like the laser diagram): a full-thickness donor button
// (8 mm, faint teal) meets the host at a near-vertical wound and is held by interrupted stitches that pass deep through
// both sides. Layers follow the laser block palette.
export const PK = { EX: 3, RG: 4.0 };
export function graftSection(ctx) {
  const { EX, RG } = PK;
  const R = EYE.corneaRadius, A = (r) => corneaAntZ(r), T = (r) => EX * corneaThickness(r);
  const EPI = 0.05 * EX, BOW = 0.012 * EX * 1.5, DES = 0.012 * EX, ENDO = 0.009 * EX;
  const cam = ctx.camera({ target: [-2.6, 1.0, 2.6], dir: [Math.sin(14 * DEG) * Math.cos(24 * DEG), -Math.cos(14 * DEG) * Math.cos(24 * DEG), Math.sin(24 * DEG)], up: [0, 0, 1], H: 4.6, ortho: true });
  const scene = ctx.scene(cam);
  const spec = corneaSpec({ T: (x, y) => T(Math.hypot(x, y)) });
  const [ant, post, rim] = corneaMesh(spec, { radii: [RG - 0.01, RG + 0.01], segments: 360, rings: 120 });
  const host = new THREE.MeshPhysicalMaterial({ color: '#D3E6EC', roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.15, transparent: true, opacity: 0.94, envMap: ctx.envMap, envMapIntensity: 0.55, side: THREE.DoubleSide, vertexColors: true });
  const col = new Float32Array(ant.attributes.position.count * 3), p = ant.attributes.position, cH = new THREE.Color('#D3E6EC'), cG = new THREE.Color('#C9EBEF');
  for (let i = 0; i < p.count; i++) { const c = Math.hypot(p.getX(i), p.getY(i)) < RG ? cG : cH; col.set([c.r, c.g, c.b], i * 3); }
  ant.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const backMat = new THREE.MeshStandardMaterial({ color: '#C7DDE3', roughness: 0.4, transparent: true, opacity: 0.9, envMap: ctx.envMap, envMapIntensity: 0.4, side: THREE.DoubleSide });
  scene.add(new THREE.Mesh(ant, host), new THREE.Mesh(post, backMat), new THREE.Mesh(rim, backMat));
  // graft-host junction ring on the surface (kept half)
  const ring = [];
  for (let i = 0; i <= 120; i++) { const a = (i / 120) * Math.PI; ring.push(new THREE.Vector3(RG * Math.cos(a), RG * Math.sin(a), A(RG) + 0.006)); }
  const rmesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ring), 160, 0.018, 8, false), new THREE.MeshStandardMaterial({ color: '#EAF6F8', roughness: 0.3, transparent: true, opacity: 0.8 }));
  scene.add(rmesh);
  // interrupted stitches on the surface: 8 in the kept half, crossing the junction radially
  const sut = new THREE.MeshStandardMaterial({ color: '#16243A', roughness: 0.35, metalness: 0.1, envMap: ctx.envMap, envMapIntensity: 0.6 });
  for (let i = 0; i < 8; i++) {
    const phi = ((i + 0.5) / 8) * Math.PI;
    const pts = [];
    for (let r = RG - 0.7; r <= RG + 0.72 + 1e-6; r += 0.04) { const t = (r - RG + 0.7) / 1.42, dip = 0.07 * (1 - Math.sin(Math.PI * t)) ** 3; pts.push(new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), A(r) + 0.024 - dip)); } // ends dip into the tissue
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.022, 8, false), sut));
  }
  // painted cut face (y = 0)
  const k = makeSection({ x0: -R - 0.2, x1: R + 0.2, z0: -1.4, z1: A(0) + 0.25 }, ppmFor(ctx, 4.6, 1.0) / 1);
  const depthLine = (xs, d) => xs.map((x) => {
    const r = Math.abs(x), z = A(r), s = Math.sign(x) || 1;
    const nx = s * r / EYE.corneaRc, nz = (z - (EYE.corneaApexZ - EYE.corneaRc)) / EYE.corneaRc;
    const dd = typeof d === 'function' ? d(x) : d;
    return [x - nx * dd, z - nz * dd];
  });
  const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * (i / n));
  const xs = range(-R, R, 600), Tx = (x) => T(Math.abs(x));
  const body = [...depthLine(xs, 0), ...depthLine(xs, Tx).reverse()];
  const band = (x0, x1, d0, d1) => { const q = range(x0, x1, 200); return [...depthLine(q, d0), ...depthLine(q, d1).reverse()]; };
  k.fill(body, LAYER.stroma);
  k.clipTo(body, () => {
    for (let f = 0.12; f < 0.98; f += 0.06) k.stroke(depthLine(xs, (x) => EPI + BOW + (Tx(x) - EPI - BOW - DES - ENDO) * f), LAYER.lamella, 0.8, false);
    k.fill(band(-R, R, 0, EPI), LAYER.epi);
    k.fill(band(-R, R, EPI, EPI + BOW), LAYER.bowman);
    k.fill([...depthLine(xs, (x) => Tx(x) - DES - ENDO), ...depthLine(xs, (x) => Tx(x) - ENDO).reverse()], LAYER.descemet);
    k.fill([...depthLine(xs, (x) => Tx(x) - ENDO), ...depthLine(xs, Tx).reverse()], LAYER.endo);
    // donor button: full thickness inside the junction, a faint teal wash over its own (donor) layers
    k.fill(band(-RG, RG, 0, (x) => Tx(x)), 'rgba(86,186,198,0.20)');
    // the wound: a near-vertical cut through every layer on each side
    for (const s of [1, -1]) k.stroke([depthLine([s * RG], 0)[0], depthLine([s * RG], Tx(RG))[0]], 'rgba(28,104,116,0.95)', 2.2, false);
    // stitch tracks: from the donor surface, deep (about 90 % depth) across the junction, out on the host side
    for (const s of [1, -1]) {
      const pts = [];
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const x = s * (RG - 0.7 + 1.42 * t), depth = Tx(RG) * 0.88 * Math.max(0, Math.sin(Math.PI * t)) ** 0.55;
        pts.push(depthLine([x], depth)[0]);
      }
      k.stroke(pts, '#16243A', 3.0, false);
    }
  });
  k.shade(body, 'rgba(70,104,118,0.22)', 5, 5);
  k.stroke(body);
  scene.add(paintedQuad(k.canvas, [k.bounds.x1, 0, k.bounds.z1], [k.bounds.x1, 0, k.bounds.z0], [k.bounds.x0, 0, k.bounds.z1]));
  const W = ctx.W, Hh = ctx.H;
  return {
    passes: [{ scene, camera: cam, fade: { cx: W * 0.5, cy: Hh * 0.5, rx: W * 0.62, ry: Hh * 0.7, inner: 0.72 } }],
    layers: { EPI, BOW, DES, ENDO, T, A, depthLine }
  };
}

// ---------------------------------------------------------------- IOL in the capsular bag: specimen view
// The posterior-chamber contents seen from the front with the cornea, iris and outer coats removed: the ring of
// ciliary processes, the zonules and the emptied capsular bag holding a one-piece IOL whose haptics rest in the bag
// equator.
export function bagSpecimen(ctx, { polar = 34, az = -62, H = 15, target = [0, 0, -1.2], fov = 16, iolPhi = -20, ringTint = null, fade = null } = {}) {
  const cam = ctx.camera({ target, dir: dirFrom(polar, az), up: [1, 0, 0], H, fov });
  const scene = ctx.scene(cam);
  const g = new THREE.Group();
  const cm = ctx.mats.ciliary.clone(); // pars plicata only: the thin pars plana behind it is trimmed away
  if (ringTint) cm.color.set(ringTint); // atlas r2: a calm ring, so the implant (not the ring) is what the eye goes to
  cm.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.9)];
  g.add(new THREE.Mesh(lathe(ciliaryProfile(), { segments: 256, phiLength: Math.PI * 2, closed: true }), cm));
  g.add(zonules('iol'));
  const bag = new THREE.Mesh(lathe(bagShell(), { segments: 256, phiLength: Math.PI * 2, closed: true }), ctx.mats.capsule.clone());
  bag.material.opacity = 0.17; bag.material.color.set('#E4ECEE'); bag.renderOrder = 2; g.add(bag);
  g.add(iol(ctx.mats, { zc: -1.25, span: 4.45, phi0: iolPhi * DEG }));
  scene.add(g);
  const W = ctx.W, Hh = ctx.H;
  return {
    passes: [{ scene, camera: cam, fade: fade && { cx: fade.cx * W, cy: fade.cy * Hh, rx: fade.rx * W, ry: fade.ry * Hh, inner: fade.inner } }],
    under(gg) {
      const [cx, cy] = ctx.project(cam, [-4.5, 0, -3.5]);
      gg.translate(cx, cy + Hh * 0.04); gg.scale(1, 0.22);
      const gr = gg.createRadialGradient(0, 0, 0, 0, 0, W * 0.34);
      gr.addColorStop(0, 'rgba(60,50,42,0.16)'); gr.addColorStop(1, 'rgba(60,50,42,0)');
      gg.fillStyle = gr; gg.fillRect(-W, -Hh * 4, 2 * W, Hh * 8);
    }
  };
}
