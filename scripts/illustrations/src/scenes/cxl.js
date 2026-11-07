// Keratoconus and corneal cross-linking: the front of the eye from the side, anterior up and to the left, with a
// wedge of the cornea cut away through the cone. The cut face compares the thinned, steepened cone with the normal
// corneal dome (dashed outline). The stroma is saturated with riboflavin (yellow) and a soft UV-A field
// (illustrative violet) falls on the cornea. A loupe magnifies the stroma: collagen lamellae joined by new
// cross-link bridges.
import * as THREE from 'three';
import { buildGlobe } from '../globe.js';
import { EYE, DEG, corneaAntZ, corneaThickness, smoothstep } from '../anatomy.js';
import { corneaSpec, rng } from '../kit.js';
import { paintCornea } from '../eye.js';
import { lightColumn } from '../instruments.js';
import { C } from '../style.js';

const CX = -1.3, AMP = 0.62, SG = 1.8; // inferior paracentral cone (towards -x)
const win = (r) => 1 - smoothstep(3.9, EYE.corneaRadius, r);
const bump = (x, y) => AMP * Math.exp(-(((x - CX) ** 2 + y * y) / (SG * SG))) * win(Math.hypot(x, y));
const thin = (x, y) => 0.16 * Math.exp(-(((x - CX) ** 2 + y * y) / (1.45 * 1.45)));
const F = (x, y) => corneaAntZ(Math.hypot(x, y)) + bump(x, y);
const T = (x, y) => corneaThickness(Math.hypot(x, y)) - thin(x, y);
const rot = (f, phi) => (x, y) => f(x * Math.cos(phi) - y * Math.sin(phi), x * Math.sin(phi) + y * Math.cos(phi));
const CUT = { mode: 'wedge', phi0: 180 * DEG, phi1: 292 * DEG, zc: 0.75, floor: 'aqueous' };
const RIBO = 'rgba(226,204,52,0.62)';

export default function cxl(ctx) {
  const az = 258 * DEG, a = 82 * DEG;
  const dir = [Math.sin(a) * Math.cos(az), Math.sin(a) * Math.sin(az), Math.cos(a)];
  const side = [Math.cos(az + Math.PI / 2), Math.sin(az + Math.PI / 2), 0];
  const up = [side[0] * 0.75, side[1] * 0.75, 1];
  const cam = ctx.camera({ target: [-1.0, -0.8, 1.9], dir, up, H: 11.2, fov: 18 });
  const scene = ctx.scene(cam);
  const spec = corneaSpec({ F, T });
  const corneaMat = ctx.mats.cornea.clone(); corneaMat.color = new THREE.Color('#ECE58C'); corneaMat.opacity = 0.42;
  const eye = buildGlobe(ctx.mats, {
    lens: 'clear', pupilR: 2.4, cut: CUT, cornea: spec, corneaMaterial: corneaMat, fundusTint: '#6E5652',
    corneaAt: (phi) => corneaSpec({ F: rot(F, phi), T: rot(T, phi) }),
    paintCornea: (k, sp) => { paintCornea(k, sp, {
      epiFrom: 4.4, // epithelium removed centrally (epi-off)
      over: (kk, sec, lerpLine) => {
        // riboflavin saturation: strongest anteriorly, fading with depth
        for (const [f0, f1, al] of [[0, 0.35, 0.62], [0.35, 0.6, 0.42], [0.6, 0.85, 0.22]]) {
          const band = [...lerpLine(f0), ...lerpLine(f1).reverse()];
          kk.ctx.save(); kk.ctx.filter = `blur(${kk.mm(0.05)}px)`; kk.fill(band, RIBO.replace('0.62', al)); kk.ctx.restore();
        }
        // cross-link lattice texture in the treated stroma
        const Rn = rng(12);
        for (let f = 0.08; f < 0.6; f += 0.06) kk.stroke(lerpLine(f), 'rgba(150,120,20,0.32)', 0.9, false);
        for (let i = 0; i < 520; i++) {
          const f = 0.06 + Rn() * 0.52, j = Math.floor(Rn() * (sec.ant.length - 1));
          const l = lerpLine(f), p = l[j], q = lerpLine(f + 0.06)[j];
          if (Math.abs(p[0]) > 4.5) continue;
          kk.stroke([p, q], 'rgba(120,96,210,0.55)', 0.9, false);
        }
      }
    });
      // the normal corneal dome, dashed, for comparison with the cone
      const sec = corneaSpec().section(260);
      k.stroke(sec.ant.filter(([x]) => x >= 0), 'rgba(36,66,80,0.95)', 2.2, false, [7, 6]);
      k.stroke(sec.post.filter(([x]) => x >= 0), 'rgba(36,66,80,0.75)', 1.8, false, [7, 6]);
    }
  });
  const caps = eye.caps({ r1: 11.6, z1: 4.6, ppm: 320, tones: [1, 0.86, 0.95] });
  scene.add(eye.group, ...caps);
  // UV-A field (illustrative violet; 365 nm light is barely visible) with faint parallel rays
  const uv = ctx.opts?.uv ?? 1; // 1 = series default; the UV field was toned down after review (it washed the upper left)
  scene.add(lightColumn({ radius: 4.5, zFar: 17, zEnd: (x, y) => F(x, y) + 0.02, opacity: 0.12 * uv }));
  const rays = [];
  for (let i = 0; i < 46; i++) {
    const r = 4.3 * Math.sqrt((i + 0.5) / 46), t = i * 2.39996, x = r * Math.cos(t), y = r * Math.sin(t);
    rays.push(x, y, 15, x, y, F(x, y) + 0.03);
  }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rays, 3));
  const rl = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#8C7BE0', transparent: true, opacity: 0.13 * uv, depthWrite: false }));
  rl.renderOrder = 21; scene.add(rl);

  const W = ctx.W, H = ctx.H;
  // loupe focus: a point in the treated stroma on the cone cut face (phi0 = 180 deg -> along -x)
  const fx = -1.4, fz = F(fx, 0) - 0.16;
  const focus = ctx.project(cam, [fx, 0, fz]);
  const L = { x: W * 0.8, y: H * 0.33, r: H * 0.2 };
  return {
    passes: [{ scene, camera: cam, fade: { cx: W * 0.42, cy: H * 0.52, rx: W * 0.5, ry: H * 0.62, inner: 0.6 } }],
    over(g, theme) { if (ctx.opts?.loupe !== false) drawLoupe(g, theme, L, focus); }
  };
}

// Magnifier: stromal collagen lamellae (alternating orientations) bound by cross-link bridges.
function drawLoupe(g, theme, L, focus) {
  const light = theme === 'light';
  // leader from the stroma to the loupe
  const ang = Math.atan2(L.y - focus[1], L.x - focus[0]);
  g.strokeStyle = light ? 'rgba(70,58,50,0.5)' : 'rgba(235,235,240,0.55)'; g.lineWidth = 2;
  g.beginPath(); g.arc(focus[0], focus[1], 16, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(focus[0] + 16 * Math.cos(ang), focus[1] + 16 * Math.sin(ang));
  g.lineTo(L.x - L.r * Math.cos(ang), L.y - L.r * Math.sin(ang)); g.stroke();
  // drop shadow and body
  g.save();
  g.shadowColor = light ? 'rgba(60,45,30,0.22)' : 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; g.shadowOffsetY = 12;
  g.beginPath(); g.arc(L.x, L.y, L.r, 0, Math.PI * 2); g.fillStyle = '#F3EBC4'; g.fill();
  g.restore();
  g.save();
  g.beginPath(); g.arc(L.x, L.y, L.r - 1, 0, Math.PI * 2); g.clip();
  const bg = g.createLinearGradient(L.x, L.y - L.r, L.x, L.y + L.r);
  bg.addColorStop(0, '#F1E39A'); bg.addColorStop(1, '#F6EDC8');
  g.fillStyle = bg; g.fillRect(L.x - L.r, L.y - L.r, 2 * L.r, 2 * L.r);
  const R = rng(3);
  // alternating lamellae: fibrils running across the view (lines) and fibrils cut end-on (dots)
  const top = L.y - L.r, band = 34;
  const dots = [];
  for (let i = 0, y = top + 6; y < L.y + L.r; i++, y += band) {
    if (i % 2 === 0) {
      for (let k = 0; k < 3; k++) {
        const yy = y + 6 + k * 9;
        const gr = g.createLinearGradient(0, yy - 4, 0, yy + 4);
        gr.addColorStop(0, '#FFF8DC'); gr.addColorStop(0.5, '#D9B65A'); gr.addColorStop(1, '#A7832E');
        g.strokeStyle = gr; g.lineWidth = 6.5; g.lineCap = 'round';
        g.beginPath(); g.moveTo(L.x - L.r - 10, yy); g.lineTo(L.x + L.r + 10, yy); g.stroke();
      }
    } else {
      for (let k = 0; k < 2; k++) for (let x = L.x - L.r + (k ? 13 : 2); x < L.x + L.r; x += 26) {
        const yy = y + 9 + k * 14;
        const gr = g.createRadialGradient(x - 2, yy - 2, 0, x, yy, 7);
        gr.addColorStop(0, '#FFF6D6'); gr.addColorStop(0.6, '#D6B154'); gr.addColorStop(1, '#9C7A28');
        g.fillStyle = gr; g.beginPath(); g.arc(x, yy, 6.5, 0, Math.PI * 2); g.fill();
        dots.push([x, yy, i]);
      }
    }
  }
  // cross-links: short bridges between neighbouring fibrils, forming a lattice
  g.lineCap = 'round';
  const link = (x0, y0, x1, y1) => {
    const glow = g.createRadialGradient((x0 + x1) / 2, (y0 + y1) / 2, 0, (x0 + x1) / 2, (y0 + y1) / 2, 18);
    glow.addColorStop(0, 'rgba(150,128,240,0.38)'); glow.addColorStop(1, 'rgba(150,128,240,0)');
    g.fillStyle = glow; g.fillRect(Math.min(x0, x1) - 18, Math.min(y0, y1) - 18, Math.abs(x1 - x0) + 36, Math.abs(y1 - y0) + 36);
    g.strokeStyle = 'rgba(100,78,210,0.95)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  };
  for (const [x, y] of dots) {
    const upper = (y - top - 6) % band < 12; // first dot row of the band links up, the second links down
    if (R() < 0.42) link(x, y + (upper ? -6 : 6), x, y + (upper ? -16 : 17));
    if (R() < 0.18) link(x + 5, y + (upper ? 4 : -4), x + 9, y + (upper ? 10 : -10));
  }
  // lens glare
  const gl = g.createRadialGradient(L.x - L.r * 0.4, L.y - L.r * 0.5, 0, L.x - L.r * 0.4, L.y - L.r * 0.5, L.r * 1.2);
  gl.addColorStop(0, 'rgba(255,255,255,0.35)'); gl.addColorStop(0.5, 'rgba(255,255,255,0.05)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gl; g.fillRect(L.x - L.r, L.y - L.r, 2 * L.r, 2 * L.r);
  g.restore();
  g.lineWidth = 5; g.strokeStyle = light ? 'rgba(255,255,255,0.95)' : 'rgba(225,230,235,0.9)';
  g.beginPath(); g.arc(L.x, L.y, L.r, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 1.5; g.strokeStyle = light ? 'rgba(80,64,50,0.35)' : 'rgba(0,0,0,0.5)';
  g.beginPath(); g.arc(L.x, L.y, L.r + 3, 0, Math.PI * 2); g.stroke();
}

void C;

export { F as coneSurface, T as coneThickness, CX as CONE_X };
