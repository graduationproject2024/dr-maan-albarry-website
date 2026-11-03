// The shared eye: 3D half-solids (y >= 0) plus the matching painted cut face. Every procedure scene
// starts from buildEye() so anatomy, palette and line weight stay identical across the series.
import * as THREE from 'three';
import {
  EYE, DEG, lensProfile, lensAntZ, lensPostZ, scleraProfile, ciliaryProfile, ciliaryTip, choroidProfile,
  retinaProfile, irisProfile, fullSection, mirrorX, shellPoint, retinaThickness, spline
} from './anatomy.js';
import { lathe, corneaSpec, corneaMesh, irisTexture, irisUV, retinaColors, rng, offsetLine } from './kit.js';
import { C } from './style.js';

const both = (poly) => [poly, mirrorX(poly)];

export function buildEye(mats, opt = {}) {
  const o = {
    lens: 'clear', // 'clear' | 'cataract' | 'bag'
    pupilR: EYE.pupilR,
    irisLift: 0,
    cornea: corneaSpec(),
    corneaRadii: [],
    corneaMaterial: mats.cornea,
    rhexis: false,
    opticNerve: false,
    zonules3D: true,
    ...opt
  };
  const group = new THREE.Group();
  const add = (g, m, order = 0) => { const mesh = new THREE.Mesh(g, m); mesh.renderOrder = order; group.add(mesh); return mesh; };

  // ---- 3D half solids
  add(lathe(scleraProfile(), { segments: 160 }), mats.sclera);
  add(lathe(choroidProfile(), { segments: 160 }), mats.choroid);
  const rg = lathe(retinaProfile(), { segments: 160 }); retinaColors(rg); add(rg, mats.retina);
  add(lathe(ciliaryProfile(), { segments: 160, closed: true }), mats.ciliary);
  const irisProf = irisProfile(o.pupilR, o.irisLift);
  const ig = lathe(irisProf, { segments: 256, closed: true }); irisUV(ig, o.pupilR);
  const im = mats.iris.clone(); im.map = irisTexture(); im.map.wrapS = THREE.RepeatWrapping; add(ig, im);
  for (const g of corneaMesh(o.cornea, { radii: o.corneaRadii })) add(g, o.corneaMaterial, 3);
  if (o.lens === 'clear') add(lathe(lensProfile(), { segments: 160 }), mats.lensClear, 2);
  if (o.lens === 'cataract') add(lathe(lensProfile(), { segments: 160 }), mats.cataract);
  if (o.lens === 'bag') add(lathe(bagProfileClosed(), { segments: 160, closed: true }), mats.capsule, 2);
  if (o.zonules3D) group.add(zonules3D(o.lens));
  if (o.opticNerve) group.add(opticNerve3D(mats));

  // ---- painted section
  const paint = (k) => {
    paintSclera(k);
    paintChoroid(k);
    paintRetina(k);
    if (o.opticNerve) paintOpticNerve(k);
    paintCiliary(k);
    paintZonules(k, o.lens);
    if (o.lens === 'clear') paintLens(k, false, o.rhexis);
    if (o.lens === 'cataract') paintLens(k, true, o.rhexis);
    if (o.lens === 'bag') paintBag(k);
    paintIris(k, irisProf);
    if (o.paintCornea) o.paintCornea(k, o.cornea); else paintCornea(k, o.cornea);
  };
  return { group, paint, irisProf, opts: o };
}

// ---------------------------------------------------------------------------------------------
// Section painters (both halves). Widths are in output px at 1600 width.
export function paintSclera(k) {
  const poly = fullSection(scleraProfile(140));
  k.fill(poly, C.sclera);
  k.clipTo(poly, () => {
    for (let f = 0.12; f < 0.95; f += 0.11) {
      const rad = EYE.Ri + f * EYE.scleraT;
      const pts = [];
      for (let a = EYE.aLimbus; a <= Math.PI; a += 0.004) pts.push(shellPoint(rad + 0.025 * Math.sin(a * 55 + f * 9), a));
      const full = [...pts, ...pts.slice().reverse().map(([x, z]) => [-x, z])];
      k.stroke(full, C.scleraFibre, 0.8, false);
    }
  });
  k.shade(poly, C.scleraShade, 7, 6);
  k.stroke(poly);
}

export function paintChoroid(k) {
  const poly = fullSection(choroidProfile(140));
  k.fill(poly, C.choroid);
  const R = rng(11);
  k.clipTo(poly, () => {
    for (let a = EYE.aOra; a < Math.PI; a += 0.018) {
      for (const s of [1, -1]) {
        const [x, z] = shellPoint(EYE.Ri - EYE.choroidT * (0.35 + 0.3 * R()), a);
        const [px, py] = k.P([s * x, z]);
        k.ctx.fillStyle = R() < 0.5 ? 'rgba(150,60,48,0.55)' : 'rgba(40,10,8,0.45)';
        k.ctx.beginPath(); k.ctx.ellipse(px, py, k.mm(0.07 + R() * 0.05), k.mm(0.05), 0, 0, Math.PI * 2); k.ctx.fill();
      }
    }
  });
  k.stroke(poly, C.inkSoft, 1.1);
}

export function paintRetina(k) {
  const prof = retinaProfile(220);
  const poly = fullSection(prof);
  k.fill(poly, C.retina);
  // inner (vitreous-facing) layers lighter, RPE dark along the outer border
  const n = (prof.length) / 2;
  const inner = prof.slice(0, n), outer = prof.slice(n);
  const outerPO = outer.slice().reverse();
  const innerFull = [...mirrorX(inner).reverse(), ...inner];
  const outerFull = [...mirrorX(outerPO).reverse(), ...outerPO];
  k.clipTo(poly, () => {
    k.stroke(innerFull, C.retinaInner, 2.6, false);
    k.stroke(outerFull, C.rpe, 1.6, false);
    const [mx, mz] = k.P([0, EYE.cz - EYE.Ri + EYE.choroidT]);
    const gr = k.ctx.createRadialGradient(mx, mz, 0, mx, mz, k.mm(2.6));
    gr.addColorStop(0, C.macula); gr.addColorStop(1, 'rgba(214,166,64,0)');
    k.ctx.fillStyle = gr; k.ctx.fillRect(mx - k.mm(3), mz - k.mm(3), k.mm(6), k.mm(6));
  });
  k.stroke(poly, C.inkSoft, 1.1);
}

export function paintCiliary(k) {
  const prof = ciliaryProfile(90);
  for (const poly of both(prof)) {
    k.fill(poly, C.ciliary);
    k.shade(poly, C.ciliaryShade, 6, 5);
    k.stroke(poly);
  }
}

export function paintIris(k, prof) {
  for (const poly of both(prof)) {
    k.fill(poly, C.iris);
    k.clipTo(poly, () => {
      const back = poly.slice(0, 23);
      k.stroke(back, C.irisPigment, 5.5, false);
      const R = rng(5);
      for (let i = 0; i < 90; i++) {
        const t = R(), p = poly[23 + Math.floor(t * 44)];
        if (!p) continue;
        const [px, py] = k.P([p[0] + (R() - 0.5) * 0.3, p[1] - R() * 0.25]);
        k.ctx.fillStyle = R() < 0.5 ? 'rgba(160,110,70,0.35)' : 'rgba(40,22,12,0.35)';
        k.ctx.beginPath(); k.ctx.arc(px, py, k.mm(0.02 + R() * 0.03), 0, Math.PI * 2); k.ctx.fill();
      }
    });
    k.shade(poly, C.irisShade, 5, 4);
    k.stroke(poly);
  }
}

export function paintCornea(k, spec, opts = {}) {
  const sec = spec.section(320);
  const poly = sec.poly;
  k.fill(poly, opts.fill || C.cornea);
  k.clipTo(poly, () => {
    const lerpLine = (f) => sec.ant.map((a, i) => [a[0] + (sec.post[i][0] - a[0]) * f, a[1] + (sec.post[i][1] - a[1]) * f]);
    if (opts.under) opts.under(k, sec, lerpLine);
    for (let f = 0.2; f < 0.95; f += 0.085) k.stroke(lerpLine(f), C.corneaLamella, 0.75, false);
    const epiFrom = opts.epiFrom ?? 0;
    const epi = [...sec.ant, ...lerpLine(0.1).reverse()];
    if (!opts.noEpi) {
      k.ctx.save();
      if (epiFrom > 0) { // epithelium removed centrally (|x| < epiFrom)
        const clip = new Path2D();
        const top = k.P([k.bounds.x1, 0])[1], yA = k.P([epiFrom, 0])[1], yB = k.P([-epiFrom, 0])[1];
        clip.rect(0, top, k.canvas.width, yA - top); clip.rect(0, yB, k.canvas.width, k.canvas.height - yB);
        k.ctx.clip(clip);
      }
      k.fill(epi, C.corneaEpi);
      k.ctx.restore();
    }
    k.stroke(sec.post, C.corneaEndo, 1.3, false);
    if (opts.over) opts.over(k, sec, lerpLine);
  });
  k.shade(poly, C.corneaShade, 4, 4);
  k.stroke(poly);
  return sec;
}

export function paintLens(k, cataract, rhexis) {
  const poly = fullSection(lensProfile(1, 80));
  const center = k.P([0, EYE.lensEqZ - 0.15]);
  if (!cataract) {
    k.fill(poly, C.lens);
    k.ctx.save(); k.ctx.filter = `blur(${k.mm(0.35)}px)`; k.fill(fullSection(lensProfile(0.62, 60)), C.lensNucleus); k.ctx.restore();
    k.clipTo(poly, () => { for (const s of [0.9, 0.79, 0.68, 0.56, 0.44, 0.33]) k.stroke(fullSection(lensProfile(s, 60)), C.lensShell, 0.8); });
  } else {
    k.fill(poly, C.cataractCortex);
    const R = rng(21);
    k.clipTo(poly, () => {
      // milky cortical clouding
      k.ctx.save(); k.ctx.filter = `blur(${k.mm(0.18)}px)`;
      for (let i = 0; i < 70; i++) {
        const x = (R() * 2 - 1) * 4.4, z = EYE.lensEqZ + (R() * 2 - 1) * 1.9;
        const [px, py] = k.P([x, z]);
        k.ctx.fillStyle = `rgba(250,246,234,${0.16 + R() * 0.2})`;
        k.ctx.beginPath(); k.ctx.ellipse(px, py, k.mm(0.25 + R() * 0.5), k.mm(0.12 + R() * 0.25), 0, 0, Math.PI * 2); k.ctx.fill();
      }
      // cortical spokes converging from the equator
      for (const s of [1, -1]) for (let i = 0; i < 7; i++) {
        const front = i % 2 === 0;
        const r0 = 4.7, r1 = 2.4 + R() * 1.2;
        const zf = (r) => (front ? lensAntZ(r) - 0.25 - R() * 0.2 : lensPostZ(r) + 0.3 + R() * 0.25);
        const w = 0.18 + R() * 0.12;
        const tri = [[s * r0, EYE.lensEqZ + (front ? w : -w)], [s * r1, zf(r1)], [s * r0, EYE.lensEqZ + (front ? 3 * w : -3 * w)]];
        k.fill(tri, `rgba(255,252,242,${0.45 + R() * 0.2})`);
      }
      k.ctx.restore();
      for (const s of [0.9, 0.8, 0.7]) k.stroke(fullSection(lensProfile(s, 60)), 'rgba(150,120,80,0.22)', 0.8);
    });
    const nuc = fullSection(lensProfile(0.64, 60));
    const gr = k.ctx.createRadialGradient(center[0], center[1], 0, center[0], center[1], k.mm(3.1));
    gr.addColorStop(0, '#946232'); gr.addColorStop(0.55, C.cataractNucleus); gr.addColorStop(1, '#C9A66C');
    k.ctx.save(); k.ctx.filter = `blur(${k.mm(0.22)}px)`; k.fill(nuc, gr); k.ctx.restore();
    k.clipTo(nuc, () => { for (const s of [0.52, 0.4, 0.28]) k.stroke(fullSection(lensProfile(s, 60)), 'rgba(90,55,25,0.25)', 0.8); });
  }
  // capsule (opened centrally when a capsulorhexis is shown)
  if (rhexis) {
    const prof = lensProfile(1, 80);
    const post = prof.slice(0, 81), ant = prof.slice(80).slice().reverse(); // both r 0..R
    const right = [...ant.filter(([r]) => r >= rhexis), ...post.slice().reverse()];
    const line = [...right, ...right.slice().reverse().map(([r, z]) => [-r, z])];
    k.stroke(line, C.capsule, 2.4, false);
    k.stroke(poly, C.inkSoft, 1.0);
  } else {
    k.stroke(poly, C.capsule, 2.4);
  }
}

// Empty capsular bag after lens removal: posterior capsule, equator, anterior leaflet to the rhexis edge.
export function bagLines() {
  const pts = [];
  const zP = (r) => -1.6 + 0.0278 * r * r;
  for (let r = 0; r <= 3.9; r += 0.05) pts.push([r, zP(r) - (r > 3 ? 0.02 * (r - 3) ** 2 : 0)]);
  // equator round
  const ce = [4.25, -1.24];
  for (let t = -90; t <= 90; t += 6) { const a = t * DEG; pts.push([ce[0] + 0.42 * Math.cos(a), ce[1] + 0.2 * Math.sin(a)]); }
  // anterior leaflet back toward the rhexis edge (resting on the optic front)
  for (let r = 4.2; r >= 2.6; r -= 0.05) { const t = (4.2 - r) / 1.6; pts.push([r, -1.05 + 0.08 * Math.sin(t * Math.PI / 2) - 0.0 * t]); }
  return pts;
}
function bagProfileClosed() {
  const l = bagLines();
  const inner = offsetLine(l, 0.03);
  return [...l, ...inner.reverse()];
}
export function paintBag(k) {
  const l = bagLines();
  k.stroke(l, C.capsule, 2.4, false);
  k.stroke(mirrorX(l), C.capsule, 2.4, false);
}

export function paintZonules(k, lens) {
  const tip = ciliaryTip();
  const targets = lens === 'bag'
    ? [[4.45, -1.08], [4.67, -1.24], [4.45, -1.42]]
    : [[4.25, lensAntZ(4.25)], [4.55, lensAntZ(4.55)], [4.75, EYE.lensEqZ], [4.55, lensPostZ(4.55)], [4.2, lensPostZ(4.2)]];
  const anchors = [33.6, 35.0, 36.2, 37.6, 39.4].map((d) => shellPoint(EYE.Ri - spline([[33.6, 1.0], [35.6, 1.26], [39.4, 0.75]])(d) + 0.02, d * DEG));
  for (const s of [1, -1]) {
    targets.forEach((t, i) => {
      // posterior anchors run to anterior targets and vice versa (crossing fibres)
      const a = anchors[anchors.length - 1 - Math.min(anchors.length - 1, Math.round(i * (anchors.length - 1) / (targets.length - 1)))];
      k.stroke([[s * a[0], a[1]], [s * t[0], t[1]]], C.zonule, 0.9, false);
    });
  }
  void tip;
}

// ---------------------------------------------------------------------------------------------
function zonules3D(lens) {
  const pos = [];
  const anchorsDeg = [33.8, 35.4, 37.2, 39.2];
  const targetsRZ = lens === 'bag'
    ? [[4.45, -1.08], [4.67, -1.24], [4.45, -1.42]]
    : [[4.3, lensAntZ(4.3)], [4.75, EYE.lensEqZ], [4.3, lensPostZ(4.3)]];
  for (let i = 1; i < 72; i++) {
    const phi = (i / 72) * Math.PI;
    const c = Math.cos(phi), s = Math.sin(phi);
    targetsRZ.forEach((t, j) => {
      const d = anchorsDeg[(j * 2 + i) % anchorsDeg.length];
      const [ar, az] = shellPoint(EYE.Ri - 0.95, d * DEG);
      pos.push(ar * c, ar * s, az, t[0] * c, t[0] * s, t[1]);
    });
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const m = new THREE.LineBasicMaterial({ color: '#CFC3A8', transparent: true, opacity: 0.55, depthWrite: false });
  const l = new THREE.LineSegments(g, m); l.renderOrder = 1;
  return l;
}

// Optic nerve leaving the globe ~15 degrees nasal (lower half of the image) to the posterior pole.
export const NERVE_A = 157 * DEG; // optic disc ~4.4 mm nasal to the fovea
export const nerveW = spline([[EYE.Ri - 0.6, 0.78], [EYE.scleraR, 0.8], [EYE.scleraR + 1.6, 1.45], [EYE.scleraR + 9, 1.5]]);
function nerveFrame() {
  const dx = -Math.sin(NERVE_A), dz = Math.cos(NERVE_A); // left (x < 0) half
  return { d: [dx, dz], p: [dz, -dx], O: [0, EYE.cz] };
}
function nervePoly(sheath) {
  const { d, p, O } = nerveFrame();
  const t0 = sheath ? EYE.scleraR - 0.1 : EYE.Ri - EYE.choroidT - 0.25, t1 = EYE.scleraR + 9;
  const a = [], b = [];
  for (let t = t0; t <= t1; t += 0.1) {
    const w = nerveW(t) + (sheath ? 0.5 * Math.min(1, (t - t0) / 0.8) : 0);
    a.push([O[0] + d[0] * t + p[0] * w, O[1] + d[1] * t + p[1] * w]);
    b.push([O[0] + d[0] * t - p[0] * w, O[1] + d[1] * t - p[1] * w]);
  }
  return [...a, ...b.reverse()];
}
export function paintOpticNerve(k) {
  const sheath = nervePoly(true), core = nervePoly(false);
  k.fill(sheath, C.nerveSheath); k.shade(sheath, C.scleraShade, 5, 5); k.stroke(sheath);
  k.fill(core, C.nerve);
  const { d, p, O } = nerveFrame();
  k.clipTo(core, () => {
    for (let w = -1.3; w <= 1.3; w += 0.22) {
      const line = [];
      for (let t = EYE.Ri - 0.6; t <= EYE.scleraR + 9; t += 0.2) line.push([O[0] + d[0] * t + p[0] * w, O[1] + d[1] * t + p[1] * w]);
      k.stroke(line, 'rgba(170,150,120,0.25)', 0.7, false);
    }
    // central retinal vessels
    for (const [w, col] of [[0.1, 'rgba(176,58,46,0.85)'], [-0.12, 'rgba(92,70,120,0.75)']]) {
      const line = [];
      for (let t = EYE.Ri - 0.5; t <= EYE.scleraR + 9; t += 0.2) line.push([O[0] + d[0] * t + p[0] * w, O[1] + d[1] * t + p[1] * w]);
      k.stroke(line, col, 1.6, false);
    }
    // physiological cup
    const c = [O[0] + d[0] * (EYE.Ri - 0.55), O[1] + d[1] * (EYE.Ri - 0.55)];
    const [cx, cy] = k.P(c);
    k.ctx.fillStyle = 'rgba(255,250,240,0.9)';
    k.ctx.beginPath(); k.ctx.ellipse(cx, cy, k.mm(0.45), k.mm(0.3), Math.atan2(-d[0], -d[1]), 0, Math.PI * 2); k.ctx.fill();
  });
  k.stroke(core, C.inkSoft, 1.0);
}
function opticNerve3D(mats) {
  const prof = [];
  const t0 = EYE.scleraR - 0.3, t1 = EYE.scleraR + 9;
  prof.push([0, t0]);
  for (let t = t0; t <= t1; t += 0.2) prof.push([nerveW(t) + 0.5 * Math.min(1, (t - t0) / 0.8), t]);
  prof.push([0, t1]);
  const g = lathe(prof.reverse(), { segments: 64 });
  const m = new THREE.Mesh(g, mats.sclera);
  const { d } = nerveFrame();
  m.rotation.y = Math.atan2(d[0], d[1]);
  m.position.set(0, 0, EYE.cz);
  return m;
}
