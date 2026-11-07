// Corneal transplant: a near-frontal view of the eye with an 8 mm donor graft button, a faint graft-host interface
// ring and 16 fine interrupted sutures (buried knots on the host side). An abstract inset compares the
// layer-targeted variants as three corneal blocks, donor tissue in teal: full thickness (PK), front layers only
// (DALK) and the thin inner layer only (endothelial keratoplasty).
import * as THREE from 'three';
import { buildGlobe } from '../globe.js';
import { EYE, DEG, corneaAntZ } from '../anatomy.js';
import { LAYER } from './laser.js';

const RG = 4.0; // graft radius (8 mm button)

export default function transplant(ctx) {
  const a = 21 * DEG, az = 236 * DEG;
  const cam = ctx.camera({ target: [0, 0, 0.6], shift: [4.4, 0.2], dir: [Math.sin(a) * Math.cos(az), Math.sin(a) * Math.sin(az), Math.cos(a)], up: [0, 1, 0], H: 16.5, fov: 18 });
  const scene = ctx.scene(cam);
  const cornea = ctx.mats.cornea.clone(); cornea.opacity = 0.16;
  const eye = buildGlobe(ctx.mats, { lens: 'clear', pupilR: 2.15, corneaMaterial: cornea, fundusTint: '#2A2122', irisSeed: 11, lensOpacity: 0.04 });
  scene.add(eye.group);

  // donor button: a barely cooler, clearer cap and a fine interface ring
  const cap = new THREE.Mesh(new THREE.CircleGeometry(RG, 160, 0, Math.PI * 2), new THREE.MeshPhysicalMaterial({ color: '#CFEAF2', transparent: true, opacity: 0.14, roughness: 0.05, clearcoat: 1, envMap: ctx.envMap, envMapIntensity: 0.9, depthWrite: false }));
  const cp = cap.geometry.attributes.position;
  for (let i = 0; i < cp.count; i++) cp.setZ(i, corneaAntZ(Math.hypot(cp.getX(i), cp.getY(i))) + 0.006);
  cap.geometry.computeVertexNormals(); cap.renderOrder = 4; scene.add(cap);
  const ring = [];
  for (let i = 0; i <= 240; i++) { const p = (i / 240) * Math.PI * 2; ring.push(new THREE.Vector3(RG * Math.cos(p), RG * Math.sin(p), corneaAntZ(RG) + 0.012)); }
  const rm = new THREE.MeshStandardMaterial({ color: '#F4FAFC', transparent: true, opacity: 0.75, roughness: 0.3, depthWrite: false });
  const rmesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ring, true), 240, 0.03, 8, true), rm); rmesh.renderOrder = 5; scene.add(rmesh);

  // 16 interrupted sutures crossing the junction, knots buried on the host side
  const sut = new THREE.MeshStandardMaterial({ color: '#16243A', roughness: 0.35, metalness: 0.1, envMap: ctx.envMap, envMapIntensity: 0.6 });
  for (let i = 0; i < 16; i++) {
    const phi = (i / 16) * Math.PI * 2 + 3 * DEG;
    const pts = [];
    for (let r = 3.3; r <= 4.72 + 1e-6; r += 0.06) {
      const t = (r - 3.3) / 1.42, dip = 0.05 * (1 - Math.sin(Math.PI * t)) ** 3;
      pts.push(new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), corneaAntZ(r) + 0.03 - dip));
    }
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.026, 8, false), sut); m.renderOrder = 6; scene.add(m);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), sut);
    knot.position.set(4.5 * Math.cos(phi), 4.5 * Math.sin(phi), corneaAntZ(4.5) + 0.03); knot.scale.set(1, 1, 0.5); scene.add(knot);
  }

  const W = ctx.W, H = ctx.H;
  const [ex, ey] = ctx.project(cam, [0, 0, EYE.corneaApexZ]);
  const panel = { x: 1056, y: 92, w: 470, h: 816 };
  return {
    passes: [{ scene, camera: cam, fade: { cx: ex, cy: ey, rx: W * 0.33, ry: W * 0.33, inner: 0.6 } }],
    over(g, theme) { if (ctx.opts?.inset !== false) drawVariants(g, theme, panel); }
  };
}

// Three abstract corneal blocks (epithelium, Bowman's layer, stroma, Descemet's membrane, endothelium).
function drawVariants(g, theme, P) {
  const light = theme === 'light';
  g.save();
  rr(g, P.x, P.y, P.w, P.h, 26);
  g.fillStyle = light ? 'rgba(255,255,255,0.62)' : 'rgba(44,48,54,0.78)'; g.fill();
  g.lineWidth = 1.5; g.strokeStyle = light ? 'rgba(90,70,56,0.14)' : 'rgba(255,255,255,0.10)'; g.stroke();
  g.restore();
  const variants = [
    { from: 0, to: 1 }, // PK: full thickness
    { from: 0, to: 0.86 }, // DALK: everything above Descemet's membrane
    { from: 0.9, to: 1 } // EK: Descemet's membrane + endothelium
  ];
  const bw = 300, bh = 112, dx = 64, dy = -40;
  variants.forEach((v, i) => {
    const x = P.x + 52, y = P.y + 128 + i * 252;
    block(g, theme, x, y, bw, bh, dx, dy, v, i === 0);
    if (i < 2) {
      g.strokeStyle = light ? 'rgba(90,70,56,0.12)' : 'rgba(255,255,255,0.08)'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(P.x + 40, y + bh + 70); g.lineTo(P.x + P.w - 40, y + bh + 70); g.stroke();
    }
  });
}

function block(g, theme, x, y, w, h, dx, dy, v, sutures) {
  // layer stack, fractions of the front-face height
  const L = [[0, 0.1, LAYER.epi], [0.1, 0.135, LAYER.bowman], [0.135, 0.86, LAYER.stroma], [0.86, 0.9, LAYER.descemet], [0.9, 1, LAYER.endo]];
  // top face (epithelial surface)
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w, y); g.closePath();
  const tg = g.createLinearGradient(x, y + dy, x, y); tg.addColorStop(0, '#E6F1F4'); tg.addColorStop(1, '#CFE2E8');
  g.fillStyle = tg; g.fill();
  // right side face
  g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + dy + h); g.lineTo(x + w, y + h); g.closePath();
  g.fillStyle = '#B4CCD4'; g.fill();
  for (const [a, b, c] of L) {
    g.beginPath(); g.moveTo(x + w, y + a * h); g.lineTo(x + w + dx, y + dy + a * h); g.lineTo(x + w + dx, y + dy + b * h); g.lineTo(x + w, y + b * h); g.closePath();
    g.fillStyle = shade(c, 0.86); g.fill();
  }
  // front face layers
  for (const [a, b, c] of L) { g.fillStyle = c; g.fillRect(x, y + a * h, w, (b - a) * h); }
  g.save(); g.beginPath(); g.rect(x, y + 0.135 * h, w, 0.725 * h); g.clip();
  g.strokeStyle = LAYER.lamella; g.lineWidth = 1;
  for (let k = 1; k < 9; k++) { const yy = y + (0.135 + 0.725 * k / 9) * h; g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
  g.restore();
  // donor tissue (central 56 %), teal
  const gx0 = x + w * 0.22, gx1 = x + w * 0.78, gy0 = y + v.from * h, gy1 = y + v.to * h;
  g.fillStyle = 'rgba(86,186,198,0.5)'; g.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
  g.lineWidth = 2.4; g.strokeStyle = 'rgba(32,120,132,0.95)'; g.strokeRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
  // graft outline on the top face (an ellipse in perspective), dashed when the graft is internal
  const cx = x + w / 2 + dx / 2, cy = y + dy / 2, rx = (gx1 - gx0) / 2, ry = Math.abs(dy) * 0.38;
  g.save(); if (v.from > 0) g.setLineDash([7, 6]);
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  if (v.from === 0) { g.fillStyle = 'rgba(86,186,198,0.38)'; g.fill(); }
  g.strokeStyle = 'rgba(32,120,132,0.95)'; g.lineWidth = 2.2; g.stroke(); g.restore();
  if (sutures) {
    g.strokeStyle = '#16243A'; g.lineWidth = 2.2; g.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const t = (i / 16) * Math.PI * 2;
      g.beginPath(); g.moveTo(cx + rx * 0.82 * Math.cos(t), cy + ry * 0.82 * Math.sin(t)); g.lineTo(cx + rx * 1.18 * Math.cos(t), cy + ry * 1.18 * Math.sin(t)); g.stroke();
    }
  }
  // outlines
  g.strokeStyle = 'rgba(56,42,36,0.6)'; g.lineWidth = 2; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + dy + h); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.stroke();
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.moveTo(x + w, y); g.lineTo(x + w, y + h); g.stroke();
  void theme;
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${Math.round((n >> 16) * f)},${Math.round(((n >> 8) & 255) * f)},${Math.round((n & 255) * f)})`;
}
function rr(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
