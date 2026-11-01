// Procedural anterior-segment eye at real proportions (mm), plus the IOL, instruments, light rays and
// fragment effects. `apply(params)` maps the deterministic stage parameters onto the scene graph.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  EYE, lensProfile, corneaProfile, scleraProfile, irisProfile, lensAntZ, lensPostZ, corneaAntZ
} from './anatomy.js';
import { latheGeometry, writeLathe, capGeometry } from './lathe.js';
import { rayMaterial, rng } from './materials.js';
import { keratome, forceps, phaco, injector, poseInstrument } from './instruments.js';

const CUT_START = Math.PI / 4;         // cut-away wedge: phi in (-45°, +45°), facing +X (temporal side)
const CUT_LEN = Math.PI * 1.5;

// A lathe that can show a cut-away wedge with closed cross-section faces.
function cutawayLathe(profile, v, mat, capMat, segments) {
  const g = new THREE.Group();
  const main = new THREE.Mesh(latheGeometry(profile, { segments: Math.round(segments * 0.75), phiStart: CUT_START, phiLength: CUT_LEN, v }), mat);
  const wedge = new THREE.Mesh(latheGeometry(profile, { segments: Math.round(segments * 0.25), phiStart: -Math.PI / 4, phiLength: Math.PI / 2, v }), mat);
  const caps = new THREE.Group();
  caps.add(new THREE.Mesh(capGeometry(profile, CUT_START, false), capMat));
  caps.add(new THREE.Mesh(capGeometry(profile, CUT_START + CUT_LEN, true), capMat));
  g.add(main, wedge, caps);
  return { group: g, setCut(on) { wedge.visible = !on; caps.visible = on; } };
}

function ciliaryProfile() {
  const { scleraR: R, scleraT: T, scleraCenterZ: cz } = EYE;
  const rOut = (z) => Math.sqrt((R - T) ** 2 - (z - cz) ** 2) - 0.02;
  const lerp = (a, b, t) => a + (b - a) * t;
  const rIn = (z) => {
    if (z > -1.2) return lerp(5.35, 5.55, (0.3 - z) / 1.5);                         // ciliary muscle -> crown of processes
    if (z > -2.6) return lerp(5.55, rOut(-2.6) - 0.5, Math.pow((-1.2 - z) / 1.4, 0.8)); // posterior face (pars plicata)
    return rOut(z) - 0.5 + 0.32 * Math.min(1, (-2.6 - z) / 1.5);                     // thin pars plana
  };
  const zs = [];
  for (let k = 0; k <= 28; k++) zs.push(0.3 - (4.4 * k) / 28);
  const pts = [];
  for (let k = zs.length - 1; k >= 0; k--) pts.push([rOut(zs[k]), zs[k]]);       // outer, bottom -> top
  pts.push([rOut(zs[0]), zs[0]]);
  pts.push([rIn(zs[0]), zs[0]]);
  for (let k = 0; k < zs.length; k++) pts.push([rIn(zs[k]), zs[k]]); // inner, top -> bottom
  pts.push([rIn(zs[zs.length - 1]), zs[zs.length - 1]]);
  pts.push([rOut(zs[zs.length - 1]), zs[zs.length - 1]]);
  return pts;
}

class RhexisCurve extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2, R = EYE.rhexisR;
    return target.set(R * Math.cos(a), R * Math.sin(a), lensAntZ(R) + 0.025);
  }
}

function polyPath(points) {
  const path = new THREE.CurvePath();
  for (let i = 1; i < points.length; i++) path.add(new THREE.LineCurve3(points[i - 1], points[i]));
  return path;
}

function buildRays() {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const focus = [], incoming = [], scatter = [];
  const R = rng(5);
  const iolZ = EYE.lensEqZ + 0.05;
  const rings = [[0, 1], [0.6, 6], [1.15, 8]];
  for (const [r, n] of rings) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      const pts = [V(x, y, 17), V(x, y, corneaAntZ(r)), V(x * 0.9, y * 0.9, iolZ + 0.43 * (1 - (0.9 * r / 3) ** 2)),
        V(x * 0.78, y * 0.78, iolZ - 0.43 * (1 - (0.78 * r / 3) ** 2)), V(0, 0, EYE.focusZ)];
      focus.push(new THREE.TubeGeometry(polyPath(pts), 160, 0.045, 5, false));
      const S = V(x * 0.45 + (R() - 0.5) * 0.6, y * 0.45 + (R() - 0.5) * 0.6, -1.0 + (R() - 0.5) * 0.8);
      incoming.push(new THREE.TubeGeometry(polyPath([V(x, y, 17), V(x, y, corneaAntZ(r)), V(x * 0.95, y * 0.95, lensAntZ(r * 0.95)), S]), 90, 0.045, 5, false));
      for (let b = 0; b < 3; b++) {
        const th = 0.25 + R() * 1.1, ph = R() * Math.PI * 2, len = 4 + R() * 9;
        const dir = V(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), -Math.cos(th));
        scatter.push(new THREE.TubeGeometry(polyPath([S, S.clone().addScaledVector(dir, len)]), 40, 0.035, 5, false));
      }
    }
  }
  const mk = (list, mat) => {
    const geo = mergeGeometries(list);
    list.forEach((g) => g.dispose());
    const m = new THREE.Mesh(geo, mat);
    m.renderOrder = 8; m.frustumCulled = false;
    return m;
  };
  const focusMesh = mk(focus, rayMaterial(0xfff1c9));
  const scatterGroup = new THREE.Group();
  scatterGroup.add(mk(incoming, rayMaterial(0xffeec2)), mk(scatter, rayMaterial(0xf6d79a, { fadeTail: true })));
  return { focusMesh, scatterGroup };
}

export function buildEye(m) {
  const root = new THREE.Group();
  root.name = 'eye';

  // --- sclera (shell with cut-away wedge) ---
  const sp = scleraProfile(72);
  const sclera = cutawayLathe(sp.pts, sp.vs, m.sclera, m.scleraCut, 160);
  root.add(sclera.group);

  // --- ciliary body + processes ---
  const ciliary = cutawayLathe(ciliaryProfile(), null, m.ciliary, m.ciliaryCut, 128);
  root.add(ciliary.group);
  const procGeo = new THREE.SphereGeometry(1, 10, 8);
  procGeo.scale(0.42, 0.1, 0.7);
  const nProc = 72;
  const procAngles = [...Array(nProc).keys()].map((i) => (i / nProc) * Math.PI * 2);
  const inWedge = (a) => { const w = Math.atan2(Math.sin(a), Math.cos(a)); return Math.abs(w) < Math.PI / 4; };
  const procMain = new THREE.InstancedMesh(procGeo, m.ciliary, procAngles.filter((a) => !inWedge(a)).length);
  const procWedge = new THREE.InstancedMesh(procGeo, m.ciliary, procAngles.filter(inWedge).length);
  {
    const d = new THREE.Object3D();
    let im = 0, iw = 0;
    for (const a of procAngles) {
      d.position.set(5.72 * Math.cos(a), 5.72 * Math.sin(a), -1.2);
      d.rotation.set(0, 0, a);
      d.updateMatrix();
      if (inWedge(a)) procWedge.setMatrixAt(iw++, d.matrix); else procMain.setMatrixAt(im++, d.matrix);
    }
  }
  root.add(procMain, procWedge);

  // --- zonules (instanced fibres from the ciliary processes to the lens capsule) ---
  const zGeo = new THREE.CylinderGeometry(0.016, 0.016, 1, 5, 1, true);
  const zFibres = [];
  const zr = rng(3);
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const ins = [
      [4.3, lensAntZ(4.3), 5.45, -1.55],   // anterior fibres (cross from the posterior processes)
      [4.75, EYE.lensEqZ, 5.4, -1.2],      // equatorial fibres
      [4.35, lensPostZ(4.35), 5.48, -0.85] // posterior fibres
    ];
    for (const [r0, z0, r1, z1] of ins) {
      const j = (zr() - 0.5) * 0.03;
      zFibres.push([new THREE.Vector3(r0 * Math.cos(a + j), r0 * Math.sin(a + j), z0), new THREE.Vector3(r1 * Math.cos(a - j), r1 * Math.sin(a - j), z1 + (zr() - 0.5) * 0.25)]);
    }
  }
  const zonules = new THREE.InstancedMesh(zGeo, m.zonule, zFibres.length);
  {
    const d = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3();
    zFibres.forEach(([A, B], i) => {
      dir.subVectors(B, A);
      d.position.addVectors(A, B).multiplyScalar(0.5);
      d.quaternion.setFromUnitVectors(up, dir.clone().normalize());
      d.scale.set(1, dir.length(), 1);
      d.updateMatrix();
      zonules.setMatrixAt(i, d.matrix);
    });
  }
  zonules.renderOrder = 1;
  root.add(zonules);

  // --- iris (dynamic profile for pupil dilation) ---
  let pupilR = EYE.pupilNormal;
  const ip = irisProfile(pupilR);
  const irisGeo = latheGeometry(ip.pts, { segments: 180, v: ip.vs });
  const iris = new THREE.Mesh(irisGeo, m.iris);
  root.add(iris);
  const pupilRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 8, 128), m.pupilRing);
  pupilRing.renderOrder = 9;
  root.add(pupilRing);

  // --- crystalline lens: nucleus, cortex, capsule ---
  const nucleusGeo = latheGeometry(lensProfile(0.66, 0.62, 36), { segments: 96 });
  nucleusGeo.translate(0, 0, -EYE.lensEqZ);
  const nucleus = new THREE.Mesh(nucleusGeo, m.nucleus);
  nucleus.position.z = EYE.lensEqZ;
  nucleus.renderOrder = 2;
  const cortex = new THREE.Mesh(latheGeometry(lensProfile(0.97, 0.95, 40), { segments: 112 }), m.cortex);
  cortex.renderOrder = 3;
  const capsule = new THREE.Mesh(latheGeometry(lensProfile(1, 1, 48), { segments: 128 }), m.capsule);
  capsule.renderOrder = 5;
  const rhexisGeo = new THREE.TubeGeometry(new RhexisCurve(), 160, 0.03, 6, true);
  const rhexis = new THREE.Mesh(rhexisGeo, m.rhexisEdge);
  rhexis.renderOrder = 6;
  const flapPts = [];
  for (let k = 24; k >= 0; k--) { const r = EYE.rhexisR * (k / 24); flapPts.push([r, lensAntZ(r) + 0.02]); }
  const flapGeo = latheGeometry(flapPts, { segments: 64 });
  const flapCenter = new THREE.Vector3(0, 0, lensAntZ(0));
  flapGeo.translate(0, 0, -flapCenter.z);
  const flap = new THREE.Mesh(flapGeo, m.flap);
  flap.renderOrder = 7;
  root.add(nucleus, cortex, capsule, rhexis, flap);

  // --- nucleus fragments during phacoemulsification ---
  const nFrag = 40;
  const fragGeo = new THREE.IcosahedronGeometry(0.2, 0);
  const frags = new THREE.InstancedMesh(fragGeo, m.fragment, nFrag);
  frags.frustumCulled = false;
  const fr = rng(17);
  const fragSeeds = [...Array(nFrag)].map(() => ({
    dir: new THREE.Vector3(fr() - 0.5, fr() - 0.5, (fr() - 0.5) * 0.6).normalize(), off: fr(), s: 0.6 + fr() * 0.7, spin: fr() * 6
  }));
  root.add(frags);

  // --- cornea ---
  const cornea = new THREE.Mesh(latheGeometry(corneaProfile(64), { segments: 160 }), m.cornea);
  cornea.renderOrder = 10;
  root.add(cornea);

  // --- IOL: biconvex optic + two C-loop haptics, deformed on the CPU for folding/unfolding ---
  const iol = new THREE.Group();
  const oR = EYE.iolOpticR, et = 0.15, ct = 0.425;
  const optPts = [];
  for (let k = 0; k <= 24; k++) { const r = oR * (k / 24); optPts.push([r, -(et + (ct - et) * (1 - (r / oR) ** 2))]); }
  optPts.push([oR, et]);
  for (let k = 24; k >= 0; k--) { const r = oR * (k / 24); optPts.push([r, et + (ct - et) * (1 - (r / oR) ** 2)]); }
  optPts.splice(25, 0, [oR, -et]);
  const optic = new THREE.Mesh(latheGeometry(optPts, { segments: 96 }), m.iol);
  optic.renderOrder = 6;
  iol.add(optic);
  const hapticPolar = [[2.75, 0], [3.35, 14], [4.2, 30], [5.15, 50], [5.95, 75], [6.4, 102], [6.5, 122], [6.3, 140]];
  const haptics = [0, Math.PI].map((rot) => {
    const pts = hapticPolar.map(([r, deg]) => { const a = rot + (deg * Math.PI) / 180; return new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0); });
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.17, 8, false);
    const mesh = new THREE.Mesh(geo, m.haptic);
    mesh.renderOrder = 6;
    iol.add(mesh);
    return mesh;
  });
  const iolMeshes = [optic, ...haptics];
  iolMeshes.forEach((mesh) => { mesh.userData.base = mesh.geometry.attributes.position.array.slice(); });
  let iolDeform = { fold: -1, open: -1 };
  function deformIOL(fold, open) {
    if (Math.abs(fold - iolDeform.fold) < 1e-4 && Math.abs(open - iolDeform.open) < 1e-4) return;
    iolDeform = { fold, open };
    const k = fold * 1.05; // bending curvature (1/mm): rolled along the haptic axis like an injector cartridge
    const c = 0.16 + (EYE.iolBagR - oR) / (EYE.iolOverallR - oR) * 1.0 * open - 0.16 * open;
    for (const mesh of iolMeshes) {
      const base = mesh.userData.base, pos = mesh.geometry.attributes.position.array;
      for (let i = 0; i < base.length; i += 3) {
        let x = base[i], y = base[i + 1], z = base[i + 2];
        const r = Math.hypot(x, y);
        if (r > oR) { const s = (oR + (r - oR) * c) / r; x *= s; y *= s; }
        if (k > 1e-4) { const a = y * k; const rr = 1 / k - z; y = Math.sin(a) * rr; z = 1 / k - Math.cos(a) * rr; }
        pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
      }
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeBoundingSphere();
    }
  }
  iol.visible = false;
  root.add(iol);

  // --- instruments ---
  const instruments = { keratome: keratome(m), forceps: forceps(m), phaco: phaco(m), injector: injector(m) };
  for (const obj of Object.values(instruments)) { obj.visible = false; root.add(obj); }

  // --- light rays ---
  const rays = buildRays();
  root.add(rays.focusMesh, rays.scatterGroup);
  const rayMats = { focus: rays.focusMesh.material, scatter: rays.scatterGroup.children.map((c) => c.material) };

  // --- highlight bookkeeping ---
  const highlightMats = {
    cornea: [m.cornea], iris: [m.iris], lens: [m.nucleus, m.cortex], capsule: [m.capsule],
    zonules: [m.zonule], iol: [m.iol, m.haptic], pupil: []
  };
  const hl = Object.fromEntries(Object.keys(highlightMats).map((k) => [k, 0]));
  const GOLD = new THREE.Color(0xc9a46a);
  let userCut = null;
  let lastP = null;
  const tmp = new THREE.Vector3(), dObj = new THREE.Object3D();

  function setPupil(r) {
    if (Math.abs(r - pupilR) < 1e-4) return;
    pupilR = r;
    const pr = irisProfile(r);
    writeLathe(irisGeo, pr.pts, pr.vs);
  }

  function apply(P, { time = 0, dt = 0.016, reduced = false, focusId = null } = {}) {
    lastP = P;
    setPupil(P.pupilR);
    const zFront = lensAntZ(Math.min(pupilR, EYE.lensEqR - 0.01)) + 0.16;
    pupilRing.scale.setScalar(pupilR + 0.02);
    pupilRing.position.z = zFront + 0.02;

    const cut = userCut === null ? P.cutaway : userCut;
    sclera.setCut(cut); ciliary.setCut(cut);
    procWedge.visible = !cut;

    // lens & cataract
    nucleus.visible = P.nucleusScale > 0.01;
    nucleus.scale.setScalar(Math.max(0.01, P.nucleusScale));
    m.nucleus.opacity = 0.9;
    cortex.visible = P.cortexOpacity > 0.01;
    m.cortex.opacity = 0.42 * P.cortexOpacity;
    m.capsule.userData.uniforms.uOpen.value = P.rhexisOpen > 0 ? 1 : 0;
    m.capsule.userData.uniforms.uRhexisR.value = EYE.rhexisR;
    m.capsule.userData.uniforms.uEqZ.value = EYE.lensEqZ;
    rhexis.visible = P.rhexisArc > 0.001;
    rhexis.geometry.setDrawRange(0, Math.floor(P.rhexisArc * 160) * 6 * 6);
    flap.visible = !!P.flap;
    if (P.flap) {
      const o = P.flap.open;
      tmp.set(...P.flap.tip);
      flap.position.copy(flapCenter).lerp(tmp, Math.min(1, o * 1.2));
      flap.scale.setScalar(1 - 0.75 * o);
      flap.rotation.set(0.6 * o, 0.3 * o, 0);
    }

    // fragments streaming into the phaco tip
    frags.visible = P.fragments > 0 && P.instrument && P.instrument.kind === 'phaco';
    if (frags.visible) {
      const tip = tmp.set(...P.instrument.tip);
      const ns = Math.max(0.15, P.nucleusScale);
      fragSeeds.forEach((s, i) => {
        const t = (P.fragPhase * 10 + s.off) % 1;
        const start = new THREE.Vector3(s.dir.x * (3.2 * ns + 0.35), s.dir.y * (3.2 * ns + 0.35), EYE.lensEqZ + 0.5 + s.dir.z * (1.4 * ns + 0.3));
        dObj.position.copy(start).lerp(tip, t * t);
        const sc = s.s * (1 - 0.7 * t) * Math.max(0.5, ns);
        dObj.scale.setScalar(Math.max(0.0001, sc));
        dObj.rotation.set(s.spin + t * 4, s.spin * 0.5 + t * 3, 0);
        dObj.updateMatrix();
        frags.setMatrixAt(i, dObj.matrix);
      });
      frags.instanceMatrix.needsUpdate = true;
    }

    // cornea incision
    m.cornea.userData.uniforms.uIncision.value = P.incision;

    // instruments
    for (const [kind, obj] of Object.entries(instruments)) {
      const on = !!P.instrument && P.instrument.kind === kind;
      obj.visible = on;
      if (on) poseInstrument(obj, P.instrument.tip);
    }

    // IOL
    iol.visible = !!P.iol;
    if (P.iol) {
      deformIOL(P.iol.fold, P.iol.open);
      iol.position.set(...P.iol.pos);
      iol.rotation.set(0, 0, P.iol.spin);
    }

    // rays
    rayMats.focus.uniforms.uOpacity.value = 0.85 * P.focusRays;
    rays.focusMesh.visible = P.focusRays > 0.001;
    rayMats.scatter.forEach((mt) => { mt.uniforms.uOpacity.value = 0.8 * P.scatterRays; });
    rays.scatterGroup.visible = P.scatterRays > 0.001;
    const tt = reduced ? 0 : time;
    rayMats.focus.uniforms.uTime.value = tt;
    rayMats.scatter.forEach((mt) => { mt.uniforms.uTime.value = tt; });

    // highlights (eased, gentle pulse)
    const targets = new Set(P.highlight);
    if (focusId) targets.add(focusId);
    const pulse = reduced ? 0.8 : 0.65 + 0.35 * Math.sin(time * 2.4);
    const kEase = 1 - Math.exp(-dt * 6);
    for (const id of Object.keys(hl)) {
      hl[id] += ((targets.has(id) ? 1 : 0) - hl[id]) * kEase;
      const v = hl[id] * pulse;
      for (const mat of highlightMats[id]) { mat.emissive.copy(GOLD); mat.emissiveIntensity = v * (id === 'cornea' ? 0.12 : 0.32); }
    }
    m.pupilRing.opacity = hl.pupil * pulse * 0.9;
    pupilRing.visible = hl.pupil > 0.01;
  }

  function isAnimating() {
    return Object.values(hl).some((v) => v > 0.01) || rays.focusMesh.visible || rays.scatterGroup.visible;
  }

  // label anchors in world space
  function anchors() {
    const P = lastP;
    const list = [
      { id: 'cornea', pos: [-2.4, 2.4, corneaAntZ(3.39) + 0.05] },
      { id: 'iris', pos: [0, -4.4, 0.55] },
      { id: 'pupil', pos: [-pupilR * 0.72, -pupilR * 0.72, 0.3] },
      { id: 'lens', pos: [1.6, -1.2, EYE.lensEqZ] },
      { id: 'capsule', pos: [2.6, 3.4, lensAntZ(4.27) + 0.05] },
      { id: 'zonules', pos: [4.95, -1.2, EYE.lensEqZ] },
      { id: 'iol', pos: P && P.iol ? P.iol.pos : [0, 0, EYE.lensEqZ], hidden: !(P && P.iol) }
    ];
    if (P && P.nucleusScale < 0.05 && !P.iol) list[3].hidden = false;
    return list;
  }

  return {
    root,
    apply,
    anchors,
    isAnimating,
    setUserCutaway(v) { userCut = v; },
    get userCutaway() { return userCut; }
  };
}
