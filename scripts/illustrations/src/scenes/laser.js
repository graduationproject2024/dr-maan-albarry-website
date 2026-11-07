// Laser vision correction: a near-orthographic block diagram of the cornea alone (back half kept, anterior up).
// The cut face shows the layers (epithelium, Bowman's layer, stroma, Descemet's membrane, endothelium) with the
// thickness exaggerated x3 so each layer reads. A thin LASIK flap is lifted on its superior hinge (the far side);
// the exposed stromal bed shows the reshaped (flatter) central profile, with the original profile dashed and the
// removed lens-shaped tissue as a pale violet ghost. A fine excimer beam (illustrative colour) scans the bed.
import * as THREE from 'three';
import { EYE, DEG, corneaAntZ, corneaThickness } from '../anatomy.js';
import { corneaSpec, corneaMesh, makeSection, paintedQuad, colorize, glowSprite, rng } from '../kit.js';
import { lightColumn } from '../instruments.js';
import { C } from '../style.js';

export const EX = 3; // thickness exaggeration of the diagram
const R = EYE.corneaRadius;
const A = (r) => corneaAntZ(r);
const T = (r) => EX * corneaThickness(r);
const tf = 0.11 * EX, rf = 4.3, yh = 3.6, rz = 3.3, d0 = 0.08 * EX;
const EPI = 0.05 * EX, BOW = 0.04 * EX * 0.45, DES = 0.012 * EX, ENDO = 0.009 * EX;
const abl = (r) => (r < rz ? d0 * (1 - (r / rz) ** 2) ** 1.5 : 0);
const inFlap = (x, y) => Math.hypot(x, y) < rf && y < yh;

export const LAYER = {
  epi: '#B9D2DA', epiCell: 'rgba(84,126,142,0.32)', bowman: '#8EB2BF', stroma: '#D9E7EA', lamella: 'rgba(104,140,152,0.2)',
  keratocyte: 'rgba(98,132,146,0.26)', descemet: '#9CBAC4', endo: '#7EA5B3', endoCell: 'rgba(40,74,88,0.45)'
};

export default function laser(ctx) {
  const yaw = 22 * DEG, el = 23 * DEG;
  const cam = ctx.camera({ target: [0.2, 1.6, 3.25], dir: [Math.sin(yaw) * Math.cos(el), -Math.cos(yaw) * Math.cos(el), Math.sin(el)], up: [0, 0, 1], H: 9.8, ortho: true });
  const scene = ctx.scene(cam);

  // ---- corneal body: back half (y >= 0), epithelial surface outside the flap, stromal bed inside it
  const G = (x, y) => { const r = Math.hypot(x, y); return inFlap(x, y) ? A(r) - tf - abl(r) : A(r); };
  const spec = corneaSpec({ F: (x, y) => A(Math.hypot(x, y)), T: (x, y) => T(Math.hypot(x, y)), G });
  const [ant, post, rim] = corneaMesh(spec, { radii: [rf - 0.002, rf + 0.002, rz], segments: 520, rings: 150 });
  const epiC = new THREE.Color('#D3E6EC'), bedC = new THREE.Color('#ECEFEA'), zoneC = new THREE.Color('#E4E1F1');
  colorize(ant, (x, y, z, c) => {
    const r = Math.hypot(x, y);
    if (!inFlap(x, y) || Math.abs(z - (A(r) - tf - abl(r))) > 0.02) return c.copy(epiC);
    c.copy(bedC).lerp(zoneC, r < rz ? 0.55 * (1 - (r / rz) ** 6) : 0);
  });
  const bodyMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.15, transparent: true, opacity: 0.94, envMap: ctx.envMap, envMapIntensity: 0.55, side: THREE.DoubleSide });
  const backMat = new THREE.MeshStandardMaterial({ color: '#C7DDE3', roughness: 0.4, transparent: true, opacity: 0.9, envMap: ctx.envMap, envMapIntensity: 0.4, side: THREE.DoubleSide });
  scene.add(new THREE.Mesh(ant, bodyMat), new THREE.Mesh(post, backMat), new THREE.Mesh(rim, backMat));

  // ---- painted cut face (y = 0)
  const k = makeSection({ x0: -R - 0.2, x1: R + 0.2, z0: -1.4, z1: A(0) + 0.25 }, 300);
  paintBody(k, spec);
  scene.add(paintedQuad(k.canvas, [k.bounds.x1, 0, k.bounds.z1], [k.bounds.x1, 0, k.bounds.z0], [k.bounds.x0, 0, k.bounds.z1]));

  // ---- the lifted flap (kept half: 0 <= y < yh), rotated about its hinge chord (parallel to x at y = yh)
  const zh = A(rf) - tf / 2;
  const pivot = new THREE.Group(); pivot.position.set(0, yh, zh);
  const flap = new THREE.Group(); flap.position.set(0, -yh, -zh); pivot.add(flap);
  const flapMat = new THREE.MeshPhysicalMaterial({ color: '#D9EAEF', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.82, envMap: ctx.envMap, envMapIntensity: 0.8, side: THREE.DoubleSide });
  flap.add(new THREE.Mesh(flapGeometry(), flapMat));
  const fk = makeSection({ x0: -rf - 0.1, x1: rf + 0.1, z0: A(rf) - tf - 0.1, z1: A(0) + 0.1 }, 300);
  paintFlapSection(fk);
  flap.add(paintedQuad(fk.canvas, [fk.bounds.x1, 0, fk.bounds.z1], [fk.bounds.x1, 0, fk.bounds.z0], [fk.bounds.x0, 0, fk.bounds.z1], { order: 12 }));
  pivot.rotation.x = -126 * DEG;
  scene.add(pivot);

  // ---- excimer beam (illustrative violet; the real 193 nm light is invisible) and its scan pattern
  const hit = [-1.05, 0.9]; const zHit = G(...hit);
  scene.add(lightColumn({ radius: 0.07, zFar: zHit + 14, zEnd: () => zHit, opacity: 0.95, cx: hit[0], cy: hit[1], color: '#7462D8' }));
  scene.add(lightColumn({ radius: 0.32, zFar: zHit + 14, zEnd: () => zHit, opacity: 0.32, cx: hit[0], cy: hit[1], color: '#8C7BE0' }));
  scene.add(glowSprite([hit[0], hit[1], zHit + 0.03], 1.0, [128, 110, 226], 0.85));
  const Rn = rng(6);
  for (let i = 0; i < 36; i++) {
    const a = i * 2.39996, r = 0.3 + 2.9 * Math.sqrt(i / 36);
    const x = r * Math.cos(a), y = Math.abs(r * Math.sin(a));
    if (y < 0.15) continue;
    scene.add(glowSprite([x, y, G(x, y) + 0.02], 0.14 + Rn() * 0.05, [128, 110, 226], 0.22 + Rn() * 0.12, { order: 21 }));
  }

  const W = ctx.W, H = ctx.H;
  return {
    passes: [{ scene, camera: cam }],
    under(g, theme) {
      // soft contact shadow under the block
      const [cx, cy] = ctx.project(cam, [0, 2.5, -0.9]);
      g.translate(cx, cy); g.scale(1, 0.16);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, W * 0.4);
      gr.addColorStop(0, theme === 'light' ? 'rgba(70,60,52,0.16)' : 'rgba(0,0,0,0.42)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(-W, -H * 4, W * 2, H * 8);
    }
  };
}

// Layer boundary at depth d below the anterior reference surface, along its normal (section y = 0).
function depthLine(xs, d) {
  return xs.map((x) => {
    const r = Math.abs(x), z = A(r), s = Math.sign(x) || 1;
    const nx = s * r / EYE.corneaRc, nz = (z - (EYE.corneaApexZ - EYE.corneaRc)) / EYE.corneaRc;
    const dd = typeof d === 'function' ? d(x) : d;
    return [x - nx * dd, z - nz * dd];
  });
}
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * (i / n));

function paintBody(k, spec) {
  const xs = range(-R, R, 700);
  const top = xs.map((x) => { const r = Math.abs(x); const z = inFlap(x, 0) ? A(r) - tf - abl(r) : A(r); return [x, z]; });
  // the flap edge is a vertical step: insert both levels at x = +-rf
  const topPoly = [];
  for (let i = 0; i < xs.length; i++) {
    topPoly.push(top[i]);
    const x = xs[i], nx = xs[i + 1];
    if (nx !== undefined && Math.sign(Math.abs(x) - rf) !== Math.sign(Math.abs(nx) - rf)) {
      const xe = Math.sign(x + nx) * rf;
      const lo = [xe, A(rf) - tf], hi = [xe, A(rf)];
      if (Math.abs(x) > rf) topPoly.push(hi, lo); else topPoly.push(lo, hi);
    }
  }
  const back = depthLine(xs, (x) => T(Math.abs(x)));
  const body = [...topPoly, ...back.slice().reverse()];
  k.fill(body, LAYER.stroma);
  k.clipTo(body, () => {
    // stromal lamellae and keratocytes
    for (let f = 0.12; f < 0.98; f += 0.055) k.stroke(depthLine(xs, (x) => EPI + BOW + (T(Math.abs(x)) - EPI - BOW - DES - ENDO) * f), LAYER.lamella, 0.8, false);
    const Rn = rng(31);
    for (let i = 0; i < 110; i++) {
      const x = (Rn() * 2 - 1) * R * 0.98, f = 0.08 + Rn() * 0.84;
      const [px, pz] = depthLine([x], EPI + BOW + (T(Math.abs(x)) - EPI - BOW - DES - ENDO) * f)[0];
      const [cx, cy] = k.P([px, pz]);
      k.ctx.fillStyle = LAYER.keratocyte; k.ctx.beginPath();
      k.ctx.ellipse(cx, cy, k.mm(0.012), k.mm(0.07 + Rn() * 0.05), 0, 0, Math.PI * 2); k.ctx.fill();
    }
    // epithelium and Bowman's layer outside the flap
    for (const s of [1, -1]) {
      const xe = range(rf, R, 120).map((x) => s * x);
      const epi = [...depthLine(xe, 0), ...depthLine(xe, EPI).reverse()];
      const bow = [...depthLine(xe, EPI), ...depthLine(xe, EPI + BOW).reverse()];
      k.fill(epi, LAYER.epi); paintEpiCells(k, xe);
      k.fill(bow, LAYER.bowman);
    }
    // Descemet's membrane and the endothelial monolayer
    const des = [...depthLine(xs, (x) => T(Math.abs(x)) - DES - ENDO), ...depthLine(xs, (x) => T(Math.abs(x)) - ENDO).reverse()];
    const endo = [...depthLine(xs, (x) => T(Math.abs(x)) - ENDO), ...back.slice().reverse()];
    k.fill(des, LAYER.descemet); k.fill(endo, LAYER.endo);
    for (let x = -R; x < R; x += 0.075) k.stroke([depthLine([x], T(Math.abs(x)) - ENDO)[0], depthLine([x], T(Math.abs(x)))[0]], LAYER.endoCell, 0.9, false);
  });
  k.shade(body, 'rgba(70,104,118,0.22)', 5, 5);
  // removed tissue (lenticule) above the new bed: pale violet ghost, original bed profile dashed
  const xz = range(-rz, rz, 300);
  const orig = depthLine(xz, tf), now = xz.map((x) => [x, A(Math.abs(x)) - tf - abl(Math.abs(x))]);
  const ghost = [...orig, ...now.slice().reverse()];
  k.fill(ghost, 'rgba(150,132,232,0.26)');
  k.clipTo(ghost, () => { for (let x = -rz; x < rz; x += 0.09) k.stroke([[x, A(0) - 2], [x + 0.6, A(0) + 1]], 'rgba(120,100,214,0.28)', 0.9, false); });
  k.stroke(orig, 'rgba(104,86,206,0.95)', 1.8, false, [6, 5]);
  k.stroke(now, 'rgba(255,255,255,0.95)', 2.2, false);
  k.stroke(body);
}

function paintEpiCells(k, xe) {
  // stratified epithelium: columnar basal row, wing cells, flattened surface cells
  for (const [f0, f1, step] of [[0.62, 1, 0.022], [0.3, 0.62, 0.034], [0, 0.3, 0.06]]) {
    k.stroke(depthLine(xe, EPI * f0), LAYER.epiCell, 0.7, false);
    for (let i = 0; i < xe.length - 1; i++) {
      const x0 = xe[i];
      for (let x = x0; Math.abs(x - x0) < Math.abs(xe[i + 1] - x0); x += Math.sign(xe[i + 1] - x0) * step) {
        const a = depthLine([x], EPI * f0)[0], b = depthLine([x], EPI * f1)[0];
        k.stroke([a, b], LAYER.epiCell, 0.6, false);
      }
    }
  }
}

function paintFlapSection(k) {
  const xs = range(-rf, rf, 400);
  const strip = [...depthLine(xs, 0), ...depthLine(xs, tf).reverse()];
  k.fill(strip, LAYER.stroma);
  k.clipTo(strip, () => {
    for (let f = 0.3; f < 1; f += 0.25) k.stroke(depthLine(xs, EPI + BOW + (tf - EPI - BOW) * f), LAYER.lamella, 0.8, false);
    k.fill([...depthLine(xs, 0), ...depthLine(xs, EPI).reverse()], LAYER.epi);
    paintEpiCells(k, xs);
    k.fill([...depthLine(xs, EPI), ...depthLine(xs, EPI + BOW).reverse()], LAYER.bowman);
  });
  k.stroke(strip);
}

function flapGeometry() {
  // top (epithelial) and bottom (stromal) surfaces over the kept half of the flap, plus the rim
  const nx = 220, ny = 90, pos = [], idx = [];
  const grid = (bottom) => {
    const base = pos.length / 3;
    for (let j = 0; j <= ny; j++) {
      const y = (yh * j) / ny, w = Math.sqrt(Math.max(0, rf * rf - y * y));
      for (let i = 0; i <= nx; i++) {
        const x = -w + (2 * w * i) / nx, r = Math.hypot(x, y);
        pos.push(x, y, A(r) - (bottom ? tf : 0));
      }
    }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = base + j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  };
  grid(false); grid(true);
  const off = (nx + 1) * (ny + 1);
  for (let j = 0; j < ny; j++) for (const i of [0, nx]) { // curved rim
    const a = j * (nx + 1) + i, c = a + nx + 1;
    idx.push(a, c, off + c, a, off + c, off + a);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
