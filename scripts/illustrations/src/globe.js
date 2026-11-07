// Full (360 degree) 3D eye for the cut-away compositions. Tissues are closed lathe solids; a wedge is removed
// with clipping planes and its two cut faces are covered by painted half-plane "caps" (see kit.capPlane),
// painted with the same section painters as the rest of the series (eye.js).
import * as THREE from 'three';
import { EYE, DEG, lensProfile, lensAntZ, lensPostZ, scleraProfile, ciliaryProfile, choroidProfile, retinaProfile, irisProfile, shellPoint, smoothstep, retinaThickness } from './anatomy.js';
import { lathe, corneaSpec, corneaMesh, irisTexture, irisUV, rng, colorize, clipAll, wedgePlanes, capPlane, paintedQuad, makeSection, offsetLine } from './kit.js';
import { paintSclera, paintChoroid, paintRetina, paintCiliary, paintIris, paintCornea, paintLens, paintBag, paintZonules, paintOpticNerve, bagLines, NERVE_A, nerveW } from './eye.js';
import { iol } from './instruments.js';
import { C, RES } from './style.js';

export const FULL = Math.PI * 2;

export function buildGlobe(mats, opt = {}) {
  const o = {
    lens: 'clear', // 'clear' | 'cataract' | 'iol' | 'none'
    pupilR: EYE.pupilR,
    irisLift: 0,
    cornea: corneaSpec(),
    corneaRadii: [],
    corneaMaterial: mats.cornea,
    opticNerve: false,
    posterior: true, // choroid + retina
    cut: null, // [phi0, phi1] removed wedge
    iolOpts: {},
    irisSeed: 3,
    ...opt
  };
  const group = new THREE.Group();
  const add = (g, m, order = 0) => { const mesh = new THREE.Mesh(g, m.clone()); mesh.renderOrder = order; group.add(mesh); return mesh; };

  add(lathe(scleraProfile(160), { segments: 256, phiLength: FULL }), mats.sclera);
  if (o.posterior) {
    add(lathe(choroidProfile(), { segments: 256, phiLength: FULL }), mats.choroid);
    const rg = lathe(retinaProfile(), { segments: 256, phiLength: FULL });
    fundusUV(rg);
    const rm = new THREE.MeshStandardMaterial({ map: fundusTexture(), color: o.fundusTint || '#ffffff', roughness: 0.62, envMap: mats.sclera.envMap, envMapIntensity: 0.35, side: THREE.DoubleSide });
    add(rg, rm);
  }
  add(lathe(ciliaryProfile(), { segments: 256, phiLength: FULL, closed: true }), mats.ciliary);
  const irisProf = irisProfile(o.pupilR, o.irisLift);
  const ig = lathe(irisProf, { segments: 384, phiLength: FULL, closed: true }); irisUV(ig, o.pupilR);
  const im = mats.iris.clone(); im.map = irisTexture(o.irisSeed); im.map.wrapS = THREE.RepeatWrapping; add(ig, im);
  for (const g of corneaMesh(o.cornea, { radii: o.corneaRadii, phiLength: FULL, segments: 320 })) add(g, o.corneaMaterial, 3);

  if (o.lens === 'clear') { const lm = add(lathe(lensProfile(1, 64), { segments: 256, phiLength: FULL }), mats.lensClear, 2); if (o.lensOpacity != null) lm.material.opacity = o.lensOpacity; }
  if (o.lens === 'cataract') add(cataractLensGeometry(), cataractMaterial(mats));
  if (o.lens === 'iol') {
    add(lathe(bagShell(), { segments: 256, phiLength: FULL, closed: true }), mats.capsule, 2);
    group.add(iol(mats, { zc: -1.25, span: 4.45, phi0: 20 * DEG, ...o.iolOpts }));
  }
  if (o.lens !== 'none') group.add(zonules(o.lens));
  if (o.opticNerve) group.add(opticNerve(mats));

  // Cuts: { mode: 'half' } removes y > 0; { mode: 'wedge', phi0, phi1 } removes that sector; an optional zc
  // limits the removal to z > zc (anterior part only), leaving a coronal "floor" face at z = zc.
  let planes = null;
  const cut = o.cut;
  if (cut) {
    planes = cut.mode === 'wedge' ? wedgePlanes(cut.phi0, cut.phi1) : [new THREE.Plane(new THREE.Vector3(0, cut.keep === '+y' ? 1 : -1, 0), 0)]; // half: keep y <= 0 (default) or y >= 0
    if (cut.zc != null) planes.push(new THREE.Plane(new THREE.Vector3(0, 0, -1), cut.zc));
    if (cut.zb != null) planes.push(new THREE.Plane(new THREE.Vector3(0, 0, 1), -cut.zb)); // remove z < zb only
    clipAll(group, planes);
  }

  const paint = (k, phi = 0) => {
    if (o.humors !== false) paintHumors(k, o.gelAlpha);
    paintSclera(k);
    if (o.posterior) { paintChoroid(k); paintRetina(k); }
    if (o.opticNerve) paintOpticNerve(k);
    paintCiliary(k);
    if (o.lens !== 'none') paintZonules(k, o.lens === 'iol' ? 'bag' : o.lens);
    if (o.lens === 'clear') paintLens(k, false, false);
    if (o.lens === 'cataract') paintLens(k, true, false);
    if (o.lens === 'iol') { paintBag(k); paintIOLSection(k); }
    if (o.paintExtra) o.paintExtra(k, phi);
    paintIris(k, irisProf);
    const cs = o.corneaAt ? o.corneaAt(phi) : o.cornea; // cornea spec rotated into this cut face
    if (o.paintCornea) o.paintCornea(k, cs, phi); else paintCornea(k, cs);
  };

  // Painted caps for the cut faces. r1 = radial extent, z1 = front limit (mm), ppm = canvas px per mm.
  const caps = ({ r1 = 11.6, z1: zFront = 4.3, ppm = 160, tones = [1, 0.9, 0.96], floorPpm = 120, zMin = -Infinity }) => {
    const back = -EYE.axialLength + EYE.corneaApexZ - 0.4;
    const z0 = Math.max(zMin, cut.zb != null ? back : (cut.zc ?? back)); // zMin: paint only what a close-up frames
    const z1 = cut.zb != null ? cut.zb : zFront;
    const out = [];
    if (cut.mode === 'wedge') {
      [cut.phi0, cut.phi1].forEach((phi, i) => {
        const k = makeSection({ x0: 0, x1: r1, z0, z1 }, ppm);
        paint(k, phi);
        out.push(capPlane(k, phi, { tone: tones[i] }));
      });
    } else {
      const k = makeSection({ x0: -r1, x1: r1, z0, z1 }, ppm);
      paint(k);
      out.push(sectionPlane(k, tones[0]));
    }
    if (cut.zc != null || cut.zb != null) out.push(coronalFloor({ gelAlpha: o.gelAlpha, ...cut }, floorPpm, tones[2]));
    return out;
  };
  return { group, paint, caps, planes, irisProf, opts: o };
}

// Vitreous gel (behind the lens) and a faint aqueous tint (in front), painted under the tissues so a cut face
// reads as a solid section instead of a window into the eye.
export const GEL = 'rgba(228,236,238,0.93)';
export function paintHumors(k, alpha = 0.93) {
  const R = EYE.Ri - EYE.choroidT - 0.05;
  const circle = [];
  for (let i = 0; i <= 240; i++) { const a = (i / 240) * FULL; circle.push([R * Math.sin(a), EYE.cz + R * Math.cos(a)]); }
  k.clipTo(circle, () => {
    const [, yTop] = k.P([k.bounds.x1, 0]);
    const zSplit = EYE.lensEqZ - 0.15;
    const xL = k.P([0, zSplit])[0];
    k.ctx.fillStyle = GEL.replace('0.93', alpha); k.ctx.fillRect(xL, yTop, k.canvas.width - xL, k.canvas.height);
    k.ctx.fillStyle = 'rgba(232,240,242,0.5)'; k.ctx.fillRect(0, yTop, xL, k.canvas.height);
    const Rn = rng(8);
    for (let i = 0; i < 40; i++) {
      const x = (Rn() * 2 - 1) * 9, z = EYE.cz + (Rn() * 2 - 1) * 9;
      if (z > zSplit - 1) continue;
      k.stroke([[x, z], [x + (Rn() - 0.5) * 2, z + 1.5 + Rn()], [x + (Rn() - 0.5) * 3, z + 3 + Rn() * 2]], `rgba(186,204,210,${0.14 + Rn() * 0.12})`, 1.1, false);
    }
  });
}

// Full-width section plane at y = 0 (both halves), for 'half' cuts.
function sectionPlane(k, tone = 1) {
  const { x0, x1, z0, z1 } = k.bounds;
  return paintedQuad(k.canvas, [x1, 0, z1], [x1, 0, z0], [x0, 0, z1], { tone });
}

// Coronal face at z = zc inside the removed region: sclera, choroid and retina rings around the vitreous gel.
function coronalFloor(cut, ppm0, tone) {
  const ppm = Math.min(ppm0 * RES.ppm, 7000 / 23), lw = RES.ink * (ppm / ppm0) / RES.ppm;
  const zc = cut.zc ?? cut.zb, dz = zc - EYE.cz;
  const rad = (R) => Math.sqrt(Math.max(0, R * R - dz * dz));
  const a = Math.atan2(rad(EYE.Ri), dz);
  const rOut = rad(EYE.scleraR), rIn = rad(EYE.Ri), rCh = rad(EYE.Ri - EYE.choroidT);
  const rRet = rad(EYE.Ri - EYE.choroidT - retinaThickness(a) * 1.4);
  const S = rOut + 0.3, N = Math.round(2 * S * ppm);
  const c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  const P = (x, y) => [(x + S) * ppm, (S - y) * ppm];
  g.save();
  g.beginPath(); // removed region in the xy plane
  if (cut.mode === 'wedge') { g.moveTo(...P(0, 0)); g.arc(...P(0, 0), S * ppm, -cut.phi0, -cut.phi1, true); g.closePath(); }
  else if (cut.keep === '+y') g.rect(0, N / 2, N, N / 2); else g.rect(0, 0, N, N / 2);
  g.clip();
  const ring = (r0, r1, fill) => { g.beginPath(); g.arc(...P(0, 0), r1 * ppm, 0, FULL); g.arc(...P(0, 0), r0 * ppm, 0, FULL, true); g.fillStyle = fill; g.fill(); };
  if (cut.floor === 'aqueous') { // just behind the limbus: scleral ring around clear aqueous
    g.beginPath(); g.arc(...P(0, 0), rIn * ppm, 0, FULL); g.fillStyle = 'rgba(232,240,242,0.35)'; g.fill();
    ring(rIn, rOut, C.sclera);
    g.lineWidth = 4.2 * lw; g.strokeStyle = C.ink;
    for (const r of [rOut, rIn]) { g.beginPath(); g.arc(...P(0, 0), r * ppm, 0, FULL); g.stroke(); }
    g.restore();
    return paintedQuad(c, [-S, S, zc], [S, S, zc], [-S, -S, zc], { tone });
  }
  // vitreous gel: pale, faintly blue, with soft fibrillar streaks
  const vg = g.createRadialGradient(...P(0, 0), 0, ...P(0, 0), rRet * ppm);
  const ga = cut.floorAlpha ?? cut.gelAlpha ?? 0.92;
  vg.addColorStop(0, `rgba(236,241,242,${ga * 0.97})`); vg.addColorStop(1, `rgba(222,231,233,${ga})`);
  g.beginPath(); g.arc(...P(0, 0), rRet * ppm, 0, FULL); g.fillStyle = vg; g.fill();
  const R = rng(4);
  g.lineWidth = 1.2 * lw;
  for (let i = 0; i < 26; i++) {
    const r0 = R() * rRet * 0.9, a0 = R() * FULL;
    g.strokeStyle = `rgba(190,206,212,${0.12 + R() * 0.12})`;
    g.beginPath(); g.moveTo(...P(r0 * Math.cos(a0), r0 * Math.sin(a0)));
    g.quadraticCurveTo(...P((r0 + 2) * Math.cos(a0 + 0.3), (r0 + 2) * Math.sin(a0 + 0.3)), ...P((r0 + 3.5) * Math.cos(a0 + 0.1), (r0 + 3.5) * Math.sin(a0 + 0.1)));
    g.stroke();
  }
  ring(rRet, rCh, C.retina);
  ring(rCh, rIn, C.choroid);
  ring(rIn, rOut, C.sclera);
  g.lineWidth = 2.1 * 2 * lw; g.strokeStyle = C.ink;
  for (const r of [rOut, rIn]) { g.beginPath(); g.arc(...P(0, 0), r * ppm, 0, FULL); g.stroke(); }
  g.lineWidth = 2 * lw; g.strokeStyle = C.inkSoft;
  for (const r of [rCh, rRet]) { g.beginPath(); g.arc(...P(0, 0), r * ppm, 0, FULL); g.stroke(); }
  g.restore();
  return paintedQuad(c, [-S, S, zc], [S, S, zc], [-S, -S, zc], { tone });
}

// ---------------------------------------------------------------------------------------------
// Cataract: brunescent (amber-brown) nucleus seen through a milky cortex with wedge-shaped cortical spokes.
function cataractLensGeometry() {
  const g = lathe(lensProfile(1, 72), { segments: 360, phiLength: FULL });
  const cortex = new THREE.Color('#DCCBA4'), nucleus = new THREE.Color('#8E5A2A'), milk = new THREE.Color('#FAF5E8'), t = new THREE.Color();
  const R = rng(9), spokes = Array.from({ length: 13 }, (_, i) => ({ a: (i / 13) * FULL + (R() - 0.5) * 0.35, w: 0.06 + R() * 0.07, len: 0.45 + R() * 0.35 }));
  return colorize(g, (x, y, z, c) => {
    const r = Math.hypot(x, y), phi = Math.atan2(y, x);
    const nuc = Math.exp(-((r / 2.55) ** 2));
    c.copy(cortex).lerp(nucleus, 0.92 * nuc);
    let s = 0;
    for (const sp of spokes) {
      let d = Math.abs(((phi - sp.a + 3 * Math.PI) % FULL) - Math.PI);
      const reach = smoothstep(EYE.lensEqR * (1 - sp.len), EYE.lensEqR * 0.98, r);
      s = Math.max(s, reach * Math.exp(-((d / (sp.w * (0.4 + reach))) ** 2)));
    }
    c.lerp(milk, 0.78 * s);
    c.lerp(t.set('#ffffff'), 0.1 * smoothstep(3.6, 4.7, r));
  });
}
function cataractMaterial(mats) {
  return new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.25, envMap: mats.sclera.envMap, envMapIntensity: 0.5, side: THREE.DoubleSide });
}

// Thin closed shell of the emptied capsular bag (posterior capsule, equator, anterior leaflet).
export function bagShell() {
  const l = bagLines();
  return [...l, ...offsetLine(l, 0.035).reverse()];
}

export function paintIOLSection(k, zc = -1.25) {
  const kk = 0.25 / 9, prof = [];
  for (let r = 0; r <= 3.0001; r += 0.1) prof.push([r, zc - 0.36 + kk * r * r]);
  prof.push([3, zc + 0.36 - kk * 9]);
  for (let r = 3; r >= -0.0001; r -= 0.1) prof.push([Math.max(0, r), zc + 0.36 - kk * r * r]);
  const poly = [...prof, ...prof.slice().reverse().map(([r, z]) => [-r, z])];
  k.fill(poly, C.implantSection);
  k.shade(poly, 'rgba(40,110,120,0.35)', 3, 3);
  k.stroke(poly, 'rgba(40,96,106,0.9)', 2.0);
}

export function zonules(lens) {
  const pos = [];
  const anchorsDeg = [33.8, 35.4, 37.2, 39.2];
  const targets = lens === 'iol'
    ? [[4.45, -1.08], [4.67, -1.24], [4.45, -1.42]]
    : [[4.3, lensAntZ(4.3)], [4.75, EYE.lensEqZ], [4.3, lensPostZ(4.3)]];
  for (let i = 0; i < 180; i++) {
    const phi = (i / 180) * FULL, c = Math.cos(phi), s = Math.sin(phi);
    targets.forEach((t, j) => {
      const d = anchorsDeg[(j * 2 + i) % anchorsDeg.length];
      const [ar, az] = shellPoint(EYE.Ri - 0.95, d * DEG);
      pos.push(ar * c, ar * s, az, t[0] * c, t[0] * s, t[1]);
    });
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#D6CBB2', transparent: true, opacity: 0.5, depthWrite: false }));
  l.renderOrder = 1;
  return l;
}

function opticNerve(mats) {
  const prof = [];
  const t0 = EYE.scleraR - 0.3, t1 = EYE.scleraR + 9;
  prof.push([0, t1]);
  for (let t = t1; t >= t0; t -= 0.2) prof.push([nerveW(t) + 0.5 * Math.min(1, (t - t0) / 0.8), t]);
  prof.push([0, t0]);
  const m = new THREE.Mesh(lathe(prof, { segments: 96, phiLength: FULL }), mats.sclera.clone());
  const d = [-Math.sin(NERVE_A), Math.cos(NERVE_A)];
  m.rotation.y = Math.atan2(d[0], d[1]);
  m.position.set(0, 0, EYE.cz);
  return m;
}

// ---------------------------------------------------------------------------------------------
// Fundus: azimuthal-equidistant map around the posterior pole (u, v in [0, 1], centre = fovea).
const D_MAX = (Math.PI - EYE.aOra) * EYE.Ri + 0.5;
function fundusUV(g) {
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(Math.hypot(x, y), z - EYE.cz), d = (Math.PI - a) * EYE.Ri, phi = Math.atan2(y, x);
    uv.setXY(i, 0.5 + 0.5 * (d / D_MAX) * Math.cos(phi), 0.5 + 0.5 * (d / D_MAX) * Math.sin(phi));
  }
  uv.needsUpdate = true;
}
let fundusCache = null, fundusN = 0;
export function fundusTexture() {
  const N = Math.min(8192, Math.round(2048 * RES.tex));
  if (fundusCache && fundusN === N) return fundusCache.clone();
  const px = N / 2048, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  const s = N / (2 * D_MAX); // px per mm
  const P = (dx, dy) => [N / 2 + dx * s, N / 2 - dy * s]; // dx along +x (canvas right), dy along +y (canvas up)
  // base: warm coral, slightly darker and redder towards the periphery
  const base = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
  base.addColorStop(0, '#D98A68'); base.addColorStop(0.35, '#E3A084'); base.addColorStop(1, '#C9826A');
  g.fillStyle = base; g.fillRect(0, 0, N, N);
  const R = rng(17);
  // subtle choroidal mottling
  g.filter = `blur(${Math.round(5 * px)}px)`; // soft mottling (hard-edged discs showed in close-ups)
  for (let i = 0; i < 2600; i++) {
    const [x, y] = [R() * N, R() * N];
    g.fillStyle = R() < 0.5 ? 'rgba(170,80,58,0.06)' : 'rgba(250,200,170,0.06)';
    g.beginPath(); g.arc(x, y, (6 + R() * 20) * px, 0, FULL); g.fill();
  }
  g.filter = 'none';
  // macula and fovea
  const [mx, my] = P(0, 0);
  let gr = g.createRadialGradient(mx, my, 0, mx, my, 3.0 * s);
  gr.addColorStop(0, 'rgba(104,44,26,0.95)'); gr.addColorStop(0.22, 'rgba(146,72,36,0.75)'); gr.addColorStop(0.55, 'rgba(214,156,64,0.5)'); gr.addColorStop(1, 'rgba(214,156,64,0)');
  g.fillStyle = gr; g.fillRect(0, 0, N, N);
  g.fillStyle = 'rgba(255,236,190,0.75)'; g.beginPath(); g.arc(mx, my, 0.09 * s, 0, FULL); g.fill(); // foveal reflex
  // optic disc, nasal (towards -x, the nerve side)
  const dd = (Math.PI - NERVE_A) * EYE.Ri;
  const [ox, oy] = P(-dd, 0);
  gr = g.createRadialGradient(ox, oy, 0, ox, oy, 0.95 * s);
  gr.addColorStop(0, '#FFF6E2'); gr.addColorStop(0.45, '#F4D9A8'); gr.addColorStop(0.8, '#E9B98A'); gr.addColorStop(1, 'rgba(227,160,132,0)');
  g.fillStyle = gr; g.beginPath(); g.ellipse(ox, oy, 0.95 * s, 1.05 * s, 0, 0, FULL); g.fill();
  // vessels: temporal arcades sweeping around the macula, nasal vessels, recursive tapering branches
  const Rv = rng(23);
  const draw = (pts, w0, col) => {
    g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    const steps = 6; // taper in a few opaque runs; each run is one path, so joints do not double up
    for (let k = 0; k < steps; k++) {
      const a = Math.floor((k * (pts.length - 1)) / steps), b = Math.floor(((k + 1) * (pts.length - 1)) / steps);
      g.lineWidth = Math.max(1.4 * px, w0 * (1 - 0.7 * (a + b) / 2 / pts.length) * s);
      g.beginPath(); g.moveTo(...P(...pts[a])); for (let i = a + 1; i <= b; i++) g.lineTo(...P(...pts[i])); g.stroke();
    }
  };
  const grow = (x, y, ang, len, w, col, depth) => {
    const pts = [[x, y]];
    const n = Math.max(4, Math.round(len / 0.18));
    let a = ang;
    for (let i = 0; i < n; i++) {
      a += (Rv() - 0.5) * 0.22;
      // temporal vessels bend around the macula instead of crossing it
      const [px, py] = pts[pts.length - 1], dm = Math.hypot(px, py);
      if (dm < 3.2 && depth < 2) a += Math.sign(py || 1) * 0.06 * (3.2 - dm);
      pts.push([px + 0.18 * Math.cos(a), py + 0.18 * Math.sin(a)]);
    }
    draw(pts, w, col);
    if (depth < 3) for (let b = 0; b < 3 - depth; b++) {
      const i = Math.floor((0.3 + Rv() * 0.6) * pts.length);
      grow(...pts[i], a + (Rv() < 0.5 ? 1 : -1) * (0.5 + Rv() * 0.5), len * 0.5, w * 0.6, col, depth + 1);
    }
  };
  for (const [col, w, off] of [['#9A3A33', 0.15, 0.12], ['#C2584A', 0.115, -0.12]]) {
    for (const sg of [1, -1]) {
      grow(-dd, sg * (0.25 + off * sg), sg * 1.05, 9.5, w, col, 0); // temporal arcade
      grow(-dd, sg * (0.2 + off * sg), Math.PI - sg * 0.6, 6, w * 0.8, col, 1); // nasal
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  fundusCache = t; fundusN = N;
  return t;
}

export { lensAntZ, lensPostZ, EYE, DEG };
