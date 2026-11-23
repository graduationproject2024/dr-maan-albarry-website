// Three.js builders for the shared anatomical library. Every builder returns { object, update?, ... } and draws with
// the shared materials (rendering.js). Geometry comes from geometry.js (pure maths, tested in Node).
//
// Building blocks
//   layeredPatch   a corneal solid between ordered surfaces (anterior → posterior), with layered section caps. The
//                  host cornea, a LASIK flap, a SMILE lenticule and transplant grafts are all layered patches.
//   lathe parts    sclera, iris, crystalline lens, capsule, ciliary body, retina/choroid, vitreous (rotational solids)
//   implants       IOL (optic + C-loop haptics, optional diffractive rings / toric marks) and ICL (vaulted plate lens)
//   effects        laser / UV beams, drops, needle, light rays — exempt from the section plane so they stay readable.
import * as THREE from 'three';
import { latheGeometry, writeLathe, capGeometry } from '../../cataract-sim/lathe.js';
import {
  EYE, CORNEA_A0, corneaRadii, corneaDefaults, corneaPoint, irisProfileZ, irisOnLensZ, lensProfile, capsuleProfile, scleraProfile,
  iolHalfT, ICL, iclZ, iclHalfWidth, POSTERIOR, vitreousProfile, globeInnerPoint, lerp
} from './geometry.js';

const HALF_PI = Math.PI / 2;

// ---------------- Layered corneal patch ----------------
/**
 * @param {object} o
 *   rMin, rMax   radial extent on the anterior reference sphere (mm); rMin > 0 makes an annulus (host after trephination)
 *   surfaces     (a, phi) => [rho0, rho1, …]  radii of the layer surfaces, anterior first
 *   bands        materials of the section bands between consecutive surfaces (length = surfaces − 1)
 *   top, bottom, edge   surface materials
 *   colorAt      optional (a, phi) => [r, g, b] vertex colours for the top surface (tomography map)
 */
export function layeredPatch(o) {
  const nR = o.nR ?? 36, nPhi = o.nPhi ?? 96;
  const group = new THREE.Group();
  const grid = () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((nR + 1) * (nPhi + 1) * 3), 3));
    const idx = [];
    for (let j = 0; j < nR; j++) for (let i = 0; i < nPhi; i++) {
      const a = j * (nPhi + 1) + i, b = a + 1, c = a + nPhi + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    g.setIndex(idx);
    return g;
  };
  const strip = (n) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((n + 1) * 2 * 3), 3));
    const uv = new Float32Array((n + 1) * 2 * 2);
    for (let k = 0; k <= n; k++) { uv[k * 4] = k / n; uv[k * 4 + 1] = 1; uv[k * 4 + 2] = k / n; uv[k * 4 + 3] = 0; }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const idx = [];
    for (let k = 0; k < n; k++) { const a = k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    g.setIndex(idx);
    return g;
  };
  const topG = grid(), botG = grid();
  if (o.colorAt) topG.setAttribute('color', new THREE.BufferAttribute(new Float32Array((nR + 1) * (nPhi + 1) * 3), 3));
  const top = new THREE.Mesh(topG, o.top); top.renderOrder = 30;
  const bottom = new THREE.Mesh(botG, o.bottom); bottom.renderOrder = 28;
  const outerWall = new THREE.Mesh(strip(nPhi), o.edge); outerWall.renderOrder = 29;
  const innerWall = o.rMin > 0 ? new THREE.Mesh(strip(nPhi), o.edge) : null;
  group.add(top, bottom, outerWall);
  if (innerWall) { innerWall.renderOrder = 29; group.add(innerWall); }
  // section caps: one strip per band on each side of the cut (phi = +90° and −90°)
  const caps = new THREE.Group(); caps.name = 'caps'; caps.visible = false;
  const capMeshes = [];
  for (const side of [HALF_PI, -HALF_PI]) {
    o.bands.forEach((mat, b) => {
      const m = new THREE.Mesh(strip(nR), mat);
      m.userData = { side, band: b }; m.renderOrder = 31;
      capMeshes.push(m); caps.add(m);
    });
  }
  group.add(caps);

  const aAt = (r) => Math.asin(Math.min(0.9999, r / EYE.corneaRc));
  const ringR = (j, rMin, rMax) => rMin + (rMax - rMin) * (j / nR);
  let rMin = o.rMin || 0, rMax = o.rMax;

  function update(surfaces = o.surfaces, colorAt = o.colorAt) {
    const tp = topG.attributes.position.array, bp = botG.attributes.position.array, col = topG.attributes.color?.array;
    let last = 0;
    for (let j = 0; j <= nR; j++) {
      const a = aAt(ringR(j, rMin, rMax));
      for (let i = 0; i <= nPhi; i++) {
        const phi = (i / nPhi) * Math.PI * 2;
        const rho = surfaces(a, phi); last = rho.length - 1;
        const k = (j * (nPhi + 1) + i) * 3;
        const p0 = corneaPoint(a, phi, rho[0]), p1 = corneaPoint(a, phi, rho[last]);
        tp[k] = p0[0]; tp[k + 1] = p0[1]; tp[k + 2] = p0[2];
        bp[k] = p1[0]; bp[k + 1] = p1[1]; bp[k + 2] = p1[2];
        if (col && colorAt) { const c = colorAt(a, phi); col[k] = c[0]; col[k + 1] = c[1]; col[k + 2] = c[2]; }
      }
    }
    const wall = (mesh, r) => {
      const wp = mesh.geometry.attributes.position.array, a = aAt(r);
      for (let i = 0; i <= nPhi; i++) {
        const phi = (i / nPhi) * Math.PI * 2, rho = surfaces(a, phi);
        const p0 = corneaPoint(a, phi, rho[0]), p1 = corneaPoint(a, phi, rho[rho.length - 1]);
        wp.set(p0, i * 6); wp.set(p1, i * 6 + 3);
      }
      mesh.geometry.attributes.position.needsUpdate = true; mesh.geometry.computeVertexNormals(); mesh.geometry.computeBoundingSphere();
    };
    wall(outerWall, rMax);
    if (innerWall) wall(innerWall, rMin);
    for (const m of capMeshes) {
      const cp = m.geometry.attributes.position.array, b = m.userData.band;
      for (let k = 0; k <= nR; k++) {
        const a = aAt(ringR(k, rMin, rMax)), rho = surfaces(a, m.userData.side);
        cp.set(corneaPoint(a, m.userData.side, rho[b]), k * 6);
        cp.set(corneaPoint(a, m.userData.side, rho[b + 1]), k * 6 + 3);
      }
      m.geometry.attributes.position.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
    }
    for (const g of [topG, botG]) { g.attributes.position.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere(); }
    if (col) topG.attributes.color.needsUpdate = true;
  }
  update();
  return {
    object: group, top, bottom, caps, capMeshes, update,
    setExtent(min, max) { rMin = min; rMax = max; },
    get extent() { return [rMin, rMax]; }
  };
}

// The reference cornea as a layered patch whose shape follows a cornea state (corneaDefaults()).
export function buildCornea(mats, state = corneaDefaults(), extra = {}) {
  let st = corneaDefaults(state);
  const radii = (a, phi) => { const k = corneaRadii(a, phi, st); return [k.ant, k.epi, k.endo, k.post]; };
  const patch = layeredPatch({
    rMin: extra.rMin || 0, rMax: EYE.corneaRadius, surfaces: radii,
    bands: [mats.epithelium, mats.stroma, mats.endothelium],
    top: extra.top || mats.corneaSurface, bottom: mats.corneaBack, edge: mats.corneaEdge, colorAt: extra.colorAt, nR: extra.nR
  });
  patch.object.name = 'cornea';
  return {
    ...patch,
    get state() { return st; },
    setState(next) { st = corneaDefaults(next); patch.update(radii, extra.colorAt); },
    radii
  };
}

// ---------------- Lathe parts ----------------
function latheWithCaps(profile, material, capMaterial, opts = {}) {
  const g = latheGeometry(profile, { segments: opts.segments ?? 96, v: opts.v });
  const mesh = new THREE.Mesh(g, material);
  const group = new THREE.Group();
  group.add(mesh);
  const caps = new THREE.Group(); caps.name = 'caps'; caps.visible = false;
  const mk = () => [capGeometry(profile, HALF_PI, true), capGeometry(profile, -HALF_PI)];
  let capGs = capMaterial ? mk() : [];
  for (const cg of capGs) caps.add(new THREE.Mesh(cg, capMaterial));
  group.add(caps);
  return {
    object: group, mesh, caps,
    update(p, v) {
      writeLathe(g, p, v);
      if (!capMaterial) return;
      const next = mk();
      caps.children.forEach((m, i) => { m.geometry.dispose(); m.geometry = next[i]; });
    }
  };
}

export function buildSclera(mats) {
  const { pts, vs } = scleraProfile(72);
  const s = latheWithCaps(pts, mats.sclera, mats.scleraCut, { v: vs, segments: 128 });
  s.object.name = 'sclera';
  return s;
}

export function buildIris(mats, pupilR = EYE.pupilNormal, marginZ = irisOnLensZ(pupilR)) {
  const { pts, vs } = irisProfileZ(pupilR, marginZ);
  const s = latheWithCaps(pts, mats.iris, mats.irisCap, { v: vs });
  s.object.name = 'iris';
  return { ...s, set(p, z) { const n = irisProfileZ(p, z); s.update(n.pts, n.vs); } };
}

export function buildLens(mats) {
  const s = latheWithCaps(lensProfile(1, 1, 36), mats.lens, mats.lensCap);
  s.mesh.renderOrder = 12;
  s.object.name = 'lens';
  return s;
}

export function buildCapsule(mats, collapse = 0) {
  // The capsule is a thin membrane: in the cross-section it is drawn as its cut outline (a fine tube), never as a
  // filled face, so an empty bag never reads as a lens.
  const s = latheWithCaps(capsuleProfile(collapse), mats.capsule, null);
  s.mesh.renderOrder = 14;
  // the full bag coincides with the lens surface: drawn 1.5 % larger so the two never z-fight
  s.mesh.scale.setScalar(1.015); s.mesh.position.z = -EYE.lensEqZ * 0.015;
  const outline = (prof) => {
    for (const m of s.caps.children) { m.geometry.dispose(); }
    s.caps.clear();
    for (const side of [1, -1]) {
      const pts = prof.map(([r, z]) => new THREE.Vector3(0, side * r * 1.015, z * 1.015 - EYE.lensEqZ * 0.015));
      s.caps.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, 0.035, 5, false), mats.capsuleCap));
    }
  };
  outline(capsuleProfile(collapse));
  s.object.name = 'capsule';
  return { ...s, set(c) { const p = capsuleProfile(c); s.update(p); outline(p); } };
}
// Ciliary body (ring behind the iris root) with the zonular fibres that hold the lens.
export function buildCiliary(mats) {
  const prof = [[5.35, -0.35], [6.05, -0.25], [6.15, -1.2], [5.95, -3.4], [5.55, -1.6], [5.35, -0.9]];
  const s = latheWithCaps(prof, mats.ciliary, mats.ciliaryCut, { segments: 96 });
  const pos = [];
  for (let i = 0; i < 72; i++) {
    const phi = (i / 72) * Math.PI * 2, c = Math.cos(phi), sn = Math.sin(phi);
    for (const dz of [0.55, -0.15, -0.75]) {
      pos.push(5.45 * c, 5.45 * sn, -1.05, (EYE.lensEqR - 0.05) * c, (EYE.lensEqR - 0.05) * sn, EYE.lensEqZ + dz * 0.9);
    }
  }
  const zg = new THREE.BufferGeometry();
  zg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const zonules = new THREE.LineSegments(zg, mats.zonule);
  zonules.name = 'zonules';
  s.object.add(zonules);
  s.object.name = 'ciliary';
  return { ...s, zonules };
}

// Posterior segment: choroid + retina shells (ora → pole), macula and fovea, optic disc and the main vessels.
export function buildPosterior(mats) {
  const group = new THREE.Group(); group.name = 'posterior';
  const cz = EYE.scleraCenterZ;
  const shell = (rOut, rIn, zFront) => {
    const aF = Math.acos(Math.max(-1, Math.min(1, (zFront - cz) / rOut)));
    const aFi = Math.acos(Math.max(-1, Math.min(1, (zFront - cz) / rIn)));
    const pts = [];
    const n = 56;
    for (let k = 0; k <= n; k++) { const a = Math.PI - (Math.PI - aF) * (k / n); pts.push([rOut * Math.sin(a), cz + rOut * Math.cos(a)]); }
    pts.push([rIn * Math.sin(aFi), cz + rIn * Math.cos(aFi)]);
    for (let k = 0; k <= n; k++) { const a = aFi + (Math.PI - aFi) * (k / n); pts.push([rIn * Math.sin(a), cz + rIn * Math.cos(a)]); }
    return pts;
  };
  const Rr = EYE.retinaR;
  const choroid = latheWithCaps(shell(Rr - 0.03, Rr - 0.13, POSTERIOR.oraZ + 0.4), mats.choroid, mats.choroid, { segments: 96 });
  const retina = latheWithCaps(shell(Rr - 0.16, Rr - 0.16 - POSTERIOR.retinaT, POSTERIOR.oraZ), mats.retina, mats.retinaCut, { segments: 96 });
  choroid.object.name = 'choroid'; retina.object.name = 'retina';
  group.add(choroid.object, retina.object);
  // Posterior pole mapped from a flat chart (x, y in mm on the retina around the pole) onto the inner globe.
  const inner = Rr - 0.16 - POSTERIOR.retinaT;
  const onRetina = (x, y, lift = 0) => {
    const R = inner - lift, l = Math.hypot(x, y, inner);
    return [R * x / l, R * y / l, cz - R * inner / l];
  };
  const disc = (cx, cy, radius, mat, lift) => {
    const seg = 48, rings = 6, pos = [], idx = [];
    for (let j = 0; j <= rings; j++) for (let i = 0; i <= seg; i++) {
      const rr = radius * (j / rings), ang = (i / seg) * Math.PI * 2;
      pos.push(...onRetina(cx + rr * Math.cos(ang), cy + rr * Math.sin(ang), lift));
    }
    for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
      const a = j * (seg + 1) + i, b = a + 1, c = a + seg + 1, d = c + 1; idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return new THREE.Mesh(g, mat);
  };
  const macula = disc(0, 0, POSTERIOR.maculaR, mats.macula, 0.01); macula.name = 'macula';
  const fovea = disc(0, 0, POSTERIOR.foveaR, mats.fovea, 0.015); fovea.name = 'fovea';
  const opticDisc = disc(-POSTERIOR.discOffset, 0, POSTERIOR.discR, mats.opticDisc, 0.02); opticDisc.name = 'opticDisc';
  group.add(macula, fovea, opticDisc);
  // main retinal vessels (schematic): temporal arcades around the macula and nasal branches, leaving the disc
  const vessels = new THREE.Group(); vessels.name = 'vessels';
  const xd = -POSTERIOR.discOffset;
  const paths = [
    [[xd, 0.25], [xd + 1.6, 1.9], [0.5, 3.4], [3.8, 3.1], [6.4, 1.9]],
    [[xd, 0.15], [xd + 1.9, 1.5], [0.2, 2.9], [3.4, 2.6], [5.8, 1.4]],
    [[xd, -0.25], [xd + 1.6, -1.9], [0.5, -3.4], [3.8, -3.1], [6.4, -1.9]],
    [[xd, -0.15], [xd + 1.9, -1.5], [0.2, -2.9], [3.4, -2.6], [5.8, -1.4]],
    [[xd, 0.2], [xd - 2.2, 1.6], [xd - 4.6, 2.6]],
    [[xd, -0.2], [xd - 2.2, -1.6], [xd - 4.6, -2.6]]
  ];
  paths.forEach((p, i) => {
    const pts = p.map(([x, y]) => new THREE.Vector3(...onRetina(x, y, 0.06)));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, i % 2 ? 0.05 : 0.065, 6, false), i % 2 ? mats.artery : mats.vessel);
    vessels.add(tube);
  });
  group.add(vessels);
  const vit = latheWithCaps(vitreousProfile(48), mats.vitreous, mats.vitreousCap, { segments: 96 });
  vit.mesh.renderOrder = 8;
  vit.object.name = 'vitreous';
  group.add(vit.object);
  return { object: group, retina, choroid, macula, fovea, opticDisc, vessels, vitreous: vit };
}

// ---------------- Implants ----------------
/** One-piece IOL: biconvex optic (radius EYE.iolOpticR) and two C-loop haptics in the capsular bag. */
export function buildIOL(mats) {
  const group = new THREE.Group(); group.name = 'iol';
  const prof = [];
  const n = 32, oR = EYE.iolOpticR;
  for (let k = 0; k <= n; k++) { const r = oR * Math.sin((k / n) * HALF_PI); prof.push([r, -iolHalfT(r)]); }
  prof.push([oR, -EYE.iolEdgeT]); prof.push([oR, EYE.iolEdgeT]);
  for (let k = n; k >= 0; k--) { const r = oR * Math.sin((k / n) * HALF_PI); prof.push([r, iolHalfT(r)]); }
  const optic = latheWithCaps(prof, mats.iol, mats.iolCap, { segments: 64 });
  optic.mesh.renderOrder = 16;
  group.add(optic.object);
  const haptics = new THREE.Group(); haptics.name = 'haptics';
  for (const sgn of [1, -1]) {
    const pts = [];
    for (let k = 0; k <= 30; k++) {
      const t = k / 30;
      const ang = sgn * (HALF_PI * 0.15) + sgn * t * Math.PI * 0.95;
      const r = lerp(oR - 0.1, EYE.iolHapticBagR, Math.sin(Math.min(1, t * 1.6) * HALF_PI));
      pts.push(new THREE.Vector3(r * Math.cos(ang) * sgn, r * Math.sin(ang), -0.05 * Math.sin(t * Math.PI)));
    }
    haptics.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, EYE.iolHapticTube, 8, false), mats.haptic));
  }
  group.add(haptics);
  // surface design: diffractive rings (EDOF: few, fine, central; multifocal: many across the optic) and toric marks
  const rings = new THREE.Group(); rings.name = 'rings';
  const ringSet = (count, rMaxFrac, mat) => {
    const g = new THREE.Group();
    for (let k = 1; k <= count; k++) {
      const r = oR * rMaxFrac * Math.sqrt(k / count); // equal-area zones, as in diffractive optics
      const curve = new THREE.EllipseCurve(0, 0, r, r);
      const pts = curve.getPoints(96).map((p) => new THREE.Vector3(p.x, p.y, iolHalfT(r) + 0.006));
      g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    return g;
  };
  const edof = ringSet(3, 0.5, mats.iolRing); edof.name = 'edof';
  const multi = ringSet(9, 0.95, mats.iolRing); multi.name = 'multifocal';
  rings.add(edof, multi);
  const toric = new THREE.Group(); toric.name = 'toric';
  for (const sgn of [1, -1]) for (const d of [-0.32, 0, 0.32]) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mats.toricMark);
    dot.position.set(sgn * (oR - 0.45), d, iolHalfT(oR - 0.45) + 0.02);
    toric.add(dot);
  }
  group.add(rings, toric);
  group.position.z = EYE.iolCentreZ;
  return {
    object: group, optic, haptics, rings, toric,
    setDesign(type) {
      edof.visible = type === 'edof';
      multi.visible = type === 'multifocal';
      toric.visible = type === 'toric';
    }
  };
}

/** Folded implant inside an injector cartridge (shared by IOL and ICL insertion stages). */
export function buildInjector(mats) {
  const group = new THREE.Group(); group.name = 'injector';
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.55, 9, 24, 1, true), mats.plastic);
  tube.rotation.z = HALF_PI; tube.position.x = 4.5;
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 1.6, 20, 1, true), mats.plastic);
  nozzle.rotation.z = HALF_PI; nozzle.position.x = -0.8;
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 3.2, 16), mats.iolSolid);
  roll.rotation.z = HALF_PI; roll.position.x = 1.6; roll.name = 'roll';
  group.add(tube, nozzle, roll);
  return { object: group, roll };
}

/** Implantable collamer lens: vaulted plate with a central optic, footplates in the ciliary sulcus. */
export function buildICL(mats) {
  const group = new THREE.Group(); group.name = 'icl';
  const nx = 64, ny = 12, L = ICL.length / 2;
  const make = (sign) => {
    const pos = [], idx = [];
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
      const x = -L + (2 * L * i) / nx, hw = Math.max(0.02, iclHalfWidth(x)), y = -hw + (2 * hw * j) / ny;
      const r = Math.hypot(x, y);
      const optic = r < ICL.opticR ? 0.11 * (1 - (r / ICL.opticR) ** 2) : 0;
      pos.push(x, y, iclZ(x, y) + sign * (ICL.plateT / 2 + optic));
    }
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const a = i * (ny + 1) + j, b = a + 1, c = a + ny + 1, d = c + 1;
      if (sign > 0) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return new THREE.Mesh(g, mats.icl);
  };
  const front = make(1), back = make(-1);
  front.renderOrder = back.renderOrder = 17;
  // outline (rim) so the thin plate reads clearly against the iris and the lens
  const rim = [];
  for (let k = 0; k <= 160; k++) {
    const t = (k / 160) * Math.PI * 2, x = L * 0.999 * Math.cos(t);
    const y = Math.sign(Math.sin(t)) * iclHalfWidth(x) * Math.min(1, Math.abs(Math.sin(t)) * 6);
    rim.push(new THREE.Vector3(x, y, iclZ(x, y)));
  }
  const rimLine = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim, true), 200, 0.06, 6, true), mats.iclRim);
  const opticRing = new THREE.Mesh(new THREE.TorusGeometry(ICL.opticR, 0.035, 6, 96), mats.iclRim);
  opticRing.position.z = iclZ(0, ICL.opticR) + 0.02;
  group.add(front, back, rimLine, opticRing);
  return { object: group };
}

// ---------------- Effects (not clipped by the section plane) ----------------
export function buildBeam(mat, { radius = 3, length = 14 } = {}) {
  const g = new THREE.CylinderGeometry(radius * 0.15, radius, length, 48, 1, true);
  g.rotateX(HALF_PI);
  g.translate(0, 0, length / 2);
  const m = new THREE.Mesh(g, mat);
  m.renderOrder = 40;
  return m;
}

export function buildNeedle(mats) {
  const group = new THREE.Group(); group.name = 'needle';
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 7, 12), mats.steel);
  shaft.position.y = 3.5;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 12), mats.steel);
  tip.rotation.x = Math.PI; tip.position.y = -0.3;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.45, 1.6, 20), mats.hub);
  hub.position.y = 7.8;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 8, 24, 1, true), mats.plastic);
  barrel.position.y = 12.6;
  group.add(shaft, tip, hub, barrel);
  return { object: group };
}

/** Light rays entering the eye: groups of line segments whose points the procedure sets. */
export function buildRays(mat, count = 7) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3 * 2 * 3), 3));
  const lines = new THREE.LineSegments(g, mat);
  lines.renderOrder = 41;
  lines.frustumCulled = false;
  return {
    object: lines,
    /** paths: arrays of 3 points [[p0, p1, p2], …] drawn as two segments each */
    set(paths) {
      const a = g.attributes.position.array; a.fill(0);
      paths.slice(0, count).forEach((p, i) => {
        a.set(p[0], i * 18); a.set(p[1], i * 18 + 3); a.set(p[1], i * 18 + 6); a.set(p[2], i * 18 + 9);
        if (p[3]) { a.set(p[2], i * 18 + 12); a.set(p[3], i * 18 + 15); }
      });
      g.attributes.position.needsUpdate = true;
    }
  };
}

export { CORNEA_A0 };
