// Procedural anterior-segment eye at real proportions (mm), plus the IOL, instruments, light rays and the
// surgical tissue effects. Every moving part is driven by the pure functions in surgery.js / anatomy.js, which
// are the same functions the constraint validator (constraints.js) samples. `apply(params)` maps the
// deterministic stage parameters onto the scene graph.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  EYE, WOUND, lensProfile, corneaProfile, scleraProfile, irisProfile, irisMarginZ, irisBoundsAt, capsuleProfile,
  capsuleAntZ, capsulePostZ, corneaAntZ, scleraInnerR, iolHalfT
} from './anatomy.js';
import {
  TAU, flapPoint, nucleusProfile, QUAD_ANGLES, QUAD_CENTROIDS, nucleusPieces, N_PARTICLES, hapticCentreline, iolDeform
} from './surgery.js';
import { traceAxial } from './optics.js';
import { latheGeometry, writeLathe, capGeometry } from './lathe.js';
import { rayMaterial, rng } from './materials.js';
import { keratome, forceps, phaco, injector, poseInstrument } from './instruments.js';

const CUT_START = Math.PI / 4;         // cut-away wedge: phi in (-45°, +45°), facing +X (temporal side)
const CUT_LEN = Math.PI * 1.5;
const CUT_END = CUT_START + CUT_LEN;

// A lathe that can show a cut-away wedge with closed cross-section faces (sclera, ciliary body).
function cutawayLathe(profile, v, mat, capMat, segments) {
  const g = new THREE.Group();
  const main = new THREE.Mesh(latheGeometry(profile, { segments: Math.round(segments * 0.75), phiStart: CUT_START, phiLength: CUT_LEN, v }), mat);
  const wedge = new THREE.Mesh(latheGeometry(profile, { segments: Math.round(segments * 0.25), phiStart: -Math.PI / 4, phiLength: Math.PI / 2, v }), mat);
  const caps = new THREE.Group();
  caps.add(new THREE.Mesh(capGeometry(profile, CUT_START, false), capMat));
  caps.add(new THREE.Mesh(capGeometry(profile, CUT_END, true), capMat));
  g.add(main, wedge, caps);
  return { group: g, setCut(on) { wedge.visible = !on; caps.visible = on; } };
}

// Two cap faces (at both wedge planes) for an axisymmetric profile; rebuilt in place when the profile changes.
function capPair(mat, renderOrder = 4) {
  const g = new THREE.Group();
  const a = new THREE.Mesh(new THREE.BufferGeometry(), mat), b = new THREE.Mesh(new THREE.BufferGeometry(), mat);
  a.renderOrder = b.renderOrder = renderOrder;
  g.add(a, b);
  g.visible = false;
  let key = null;
  return {
    group: g,
    set(profile, k) {
      if (k === key) return;
      key = k;
      for (const [m, phi, flip] of [[a, CUT_START, false], [b, CUT_END, true]]) {
        m.geometry.dispose();
        m.geometry = profile ? capGeometry(profile, phi, flip) : new THREE.BufferGeometry();
      }
    }
  };
}
// Cap with a hole (cortex ring around the nucleus).
function capWithHole(outer, hole, phi) {
  const toV = (pts) => pts.map(([r, z]) => new THREE.Vector2(r, z));
  const shape = new THREE.Shape(toV(outer));
  shape.holes.push(new THREE.Path(toV(hole)));
  const g = new THREE.ShapeGeometry(shape);
  const pos = g.attributes.position, c = Math.cos(phi), s = Math.sin(phi);
  for (let i = 0; i < pos.count; i++) { const r = pos.getX(i), z = pos.getY(i); pos.setXYZ(i, r * c, r * s, z); }
  g.computeVertexNormals();
  return g;
}
// Thin capsule band for the cut face: outer capsule curve + inner offset (a membrane has no volume to cap).
function capsuleBand(collapse, open) {
  const prof = capsuleProfile(collapse, 48);
  const R = EYE.rhexisR;
  const curve = prof.filter(([r, z]) => !(open && z > EYE.lensEqZ + 0.01 && r < R - 1e-6));
  const t = 0.035;
  const inner = curve.map(([r, z]) => {
    const zc = EYE.lensEqZ;
    const s = Math.max(0.0001, Math.hypot(r, z - zc));
    return [Math.max(0, r - t * r / s), z - t * (z - zc) / s];
  }).reverse();
  return curve.concat(inner);
}

function ciliaryProfile() {
  const cz = EYE.lensEqZ; // pars plicata centred on the lens equator plane (circumlental space ~0.6 mm)
  const rOut = (z) => scleraInnerR(z) - 0.02;
  const lerp = (a, b, t) => a + (b - a) * t;
  const top = EYE.irisRootZ + 0.05;
  const rIn = (z) => {
    if (z > cz + 0.3) return lerp(5.3, 5.5, (top - z) / (top - cz - 0.3));                          // ciliary muscle -> crown
    if (z > cz - 1.1) return lerp(5.5, rOut(cz - 1.1) - 0.5, Math.pow((cz + 0.3 - z) / 1.4, 0.8)); // pars plicata
    return rOut(z) - 0.5 + 0.32 * Math.min(1, (cz - 1.1 - z) / 1.5);                              // thin pars plana
  };
  const zs = [];
  for (let k = 0; k <= 28; k++) zs.push(top - (4.4 * k) / 28);
  const pts = [];
  for (let k = zs.length - 1; k >= 0; k--) pts.push([rOut(zs[k]), zs[k]]);
  pts.push([rOut(zs[0]), zs[0]]);
  pts.push([rIn(zs[0]), zs[0]]);
  for (let k = 0; k < zs.length; k++) pts.push([rIn(zs[k]), zs[k]]);
  pts.push([rIn(zs[zs.length - 1]), zs[zs.length - 1]]);
  pts.push([rOut(zs[zs.length - 1]), zs[zs.length - 1]]);
  return pts;
}

class RhexisCurve extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * TAU, R = EYE.rhexisR;
    return target.set(R * Math.cos(a), R * Math.sin(a), capsuleAntZ(R, 0) + 0.02);
  }
}

function polyTube(points, radius, segs) {
  const path = new THREE.CurvePath();
  const V = points.map((p) => new THREE.Vector3(...p));
  for (let i = 1; i < V.length; i++) path.add(new THREE.LineCurve3(V[i - 1], V[i]));
  return new THREE.TubeGeometry(path, segs, radius, 5, false);
}

// Light paths. Refraction through the cornea and the IOL/lens is computed with Snell's law (optics.js) in this
// simplified schematic eye; the scattering by the cloudy lens is purely illustrative.
function buildRays() {
  const focus = [], incoming = [], scatter = [];
  const R = rng(5);
  const rings = [[0, 1], [0.6, 6], [1.15, 8]];
  for (const [r, n] of rings) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + r;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      focus.push(polyTube(traceAxial(x, y, 'pseudophakic').points, 0.045, 160));
      const tr = traceAxial(x, y, 'phakic', { stopAfter: 3 });
      const last = tr.points[tr.points.length - 1];
      const S = [last[0] + tr.dir[0] * 1.1 + (R() - 0.5) * 0.4, last[1] + tr.dir[1] * 1.1 + (R() - 0.5) * 0.4, last[2] + tr.dir[2] * 1.1];
      incoming.push(polyTube([...tr.points, S], 0.045, 90));
      for (let b = 0; b < 3; b++) {
        const th = 0.25 + R() * 1.1, ph = R() * TAU, len = 4 + R() * 9;
        const d = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), -Math.cos(th)];
        scatter.push(polyTube([S, [S[0] + d[0] * len, S[1] + d[1] * len, S[2] + d[2] * len]], 0.035, 40));
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

  // --- clipping planes for the cross-section (wedge phi in (-45°, 45°)); "off" = pushed far away ---
  const planes = [new THREE.Plane(new THREE.Vector3(-1, 1, 0).normalize(), 0), new THREE.Plane(new THREE.Vector3(-1, -1, 0).normalize(), 0)];
  const clipped = [m.cornea, m.iris, m.nucleus, m.cortex, m.capsule, m.flap, m.rhexisEdge, m.zonule, m.ciliary, m.iol, m.haptic, m.fragment];
  for (const mat of clipped) { mat.clippingPlanes = planes; mat.clipIntersection = true; }
  const setClip = (on) => { for (const p of planes) p.constant = on ? 0 : 1e4; };
  setClip(false);

  // --- sclera (shell with cut-away wedge) ---
  const sp = scleraProfile(72);
  const sclera = cutawayLathe(sp.pts, sp.vs, m.sclera, m.scleraCut, 160);
  root.add(sclera.group);

  // --- ciliary body + processes ---
  const ciliary = cutawayLathe(ciliaryProfile(), null, m.ciliaryBody, m.ciliaryCut, 128);
  root.add(ciliary.group);
  const procGeo = new THREE.SphereGeometry(1, 10, 8);
  procGeo.scale(0.42, 0.1, 0.7);
  const nProc = 72;
  const procs = new THREE.InstancedMesh(procGeo, m.ciliary, nProc);
  {
    const d = new THREE.Object3D();
    for (let i = 0; i < nProc; i++) {
      const a = (i / nProc) * TAU;
      d.position.set(5.72 * Math.cos(a), 5.72 * Math.sin(a), EYE.lensEqZ + 0.05);
      d.rotation.set(0, 0, a);
      d.updateMatrix();
      procs.setMatrixAt(i, d.matrix);
    }
  }
  root.add(procs);

  // --- zonules (instanced fibres from the ciliary processes to the capsule; follow the bag as it settles) ---
  const zGeo = new THREE.CylinderGeometry(0.016, 0.016, 1, 5, 1, true);
  const zr = rng(3);
  const zSeeds = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * TAU;
    for (let kind = 0; kind < 3; kind++) zSeeds.push({ a, kind, j: (zr() - 0.5) * 0.03, dz: (zr() - 0.5) * 0.25 });
  }
  const zonules = new THREE.InstancedMesh(zGeo, m.zonule, zSeeds.length);
  zonules.renderOrder = 1;
  root.add(zonules);
  let zonuleKey = null;
  function layoutZonules(collapse) {
    const key = collapse.toFixed(4);
    if (key === zonuleKey) return;
    zonuleKey = key;
    const d = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0), A = new THREE.Vector3(), B = new THREE.Vector3(), dir = new THREE.Vector3();
    const eq = EYE.lensEqZ;
    zSeeds.forEach((s, i) => {
      // anterior fibres arise posteriorly and posterior fibres anteriorly, so they cross (as in real anatomy)
      const ins = [[4.25, capsuleAntZ(4.25, collapse), 5.42, eq - 0.3], [4.68, eq, 5.35, eq], [4.3, capsulePostZ(4.3, collapse), 5.45, eq + 0.35]][s.kind];
      A.set(ins[0] * Math.cos(s.a + s.j), ins[0] * Math.sin(s.a + s.j), ins[1]);
      B.set(ins[2] * Math.cos(s.a - s.j), ins[2] * Math.sin(s.a - s.j), ins[3] + s.dz);
      dir.subVectors(B, A);
      d.position.addVectors(A, B).multiplyScalar(0.5);
      d.quaternion.setFromUnitVectors(up, dir.clone().normalize());
      d.scale.set(1, dir.length(), 1);
      d.updateMatrix();
      zonules.setMatrixAt(i, d.matrix);
    });
    zonules.instanceMatrix.needsUpdate = true;
  }
  layoutZonules(0);

  // --- iris (dynamic profile: dilation and post-operative settling) ---
  let irisKey = '';
  let pupilR = EYE.pupilNormal, collapse = 0;
  const ip = irisProfile(pupilR, 0);
  const irisGeo = latheGeometry(ip.pts, { segments: 180, v: ip.vs });
  const iris = new THREE.Mesh(irisGeo, m.iris);
  root.add(iris);
  const irisCap = capPair(m.irisCap);
  root.add(irisCap.group);
  const pupilRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 8, 128), m.pupilRing);
  pupilRing.renderOrder = 9;
  root.add(pupilRing);

  // --- crystalline lens: nucleus (4 quadrant solids), cortex, capsule ---
  const nucProf = nucleusProfile(36);
  const pieces = QUAD_ANGLES.map((a, k) => {
    const lathe = latheGeometry(nucProf, { segments: 28, phiStart: a - Math.PI / 4, phiLength: Math.PI / 2 });
    const c1 = capGeometry(nucProf, a - Math.PI / 4, true), c2 = capGeometry(nucProf, a + Math.PI / 4, false);
    for (const g of [c1, c2]) { if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); }
    const geo = mergeGeometries([lathe.toNonIndexed(), c1.toNonIndexed(), c2.toNonIndexed()]);
    lathe.dispose(); c1.dispose(); c2.dispose();
    const c = QUAD_CENTROIDS[k];
    geo.translate(-c[0], -c[1], -c[2]);
    const mesh = new THREE.Mesh(geo, m.nucleus);
    mesh.renderOrder = 2;
    root.add(mesh);
    return mesh;
  });
  const nucleusCap = capPair(m.nucleusCap);
  nucleusCap.set(nucProf, 'n');
  root.add(nucleusCap.group);
  const cortexProf = lensProfile(0.985, 0.975, 40);
  const cortex = new THREE.Mesh(latheGeometry(cortexProf, { segments: 112 }), m.cortex);
  cortex.renderOrder = 3;
  const cortexCapG = new THREE.Group();
  for (const phi of [CUT_START, CUT_END]) cortexCapG.add(new THREE.Mesh(capWithHole(cortexProf, nucProf, phi), m.cortexCap));
  cortexCapG.visible = false;
  root.add(cortexCapG);
  const capsuleGeo = latheGeometry(capsuleProfile(0, 48), { segments: 128 });
  const capsule = new THREE.Mesh(capsuleGeo, m.capsule);
  capsule.renderOrder = 5;
  const capsuleCap = capPair(m.capsuleCap, 6);
  root.add(capsuleCap.group);
  let capsuleKey = '0';
  const rhexisGeo = new THREE.TubeGeometry(new RhexisCurve(), 160, 0.03, 6, true);
  const rhexis = new THREE.Mesh(rhexisGeo, m.rhexisEdge);
  rhexis.renderOrder = 6;
  root.add(cortex, capsule, rhexis);

  // --- anterior capsule flap (continuous curvilinear tear), CPU-deformed polar grid ---
  const FR = 12, FT = 96;
  const flapGeo = new THREE.BufferGeometry();
  flapGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((FR + 1) * (FT + 1) * 3), 3).setUsage(THREE.DynamicDrawUsage));
  {
    const idx = [];
    for (let i = 0; i < FR; i++) for (let j = 0; j < FT; j++) {
      const a = i * (FT + 1) + j, b = (i + 1) * (FT + 1) + j;
      idx.push(a, b, b + 1, a, b + 1, a + 1);
    }
    flapGeo.setIndex(idx);
  }
  const flap = new THREE.Mesh(flapGeo, m.flap);
  flap.renderOrder = 7;
  flap.frustumCulled = false;
  root.add(flap);
  let flapKey = null;
  function writeFlap(F) {
    const key = `${F.arc.toFixed(5)}|${F.bunch.toFixed(5)}|${F.tip.map((v) => v.toFixed(4)).join(',')}`;
    if (key === flapKey) return;
    flapKey = key;
    const pos = flapGeo.attributes.position.array;
    let k = 0;
    for (let i = 0; i <= FR; i++) for (let j = 0; j <= FT; j++) {
      const p = flapPoint(EYE.rhexisR * (i / FR), (j / FT) * TAU, F.arc, F.bunch, F.tip, F.anchor);
      pos[k++] = p[0]; pos[k++] = p[1]; pos[k++] = p[2];
    }
    flapGeo.attributes.position.needsUpdate = true;
    flapGeo.computeVertexNormals();
  }

  // --- emulsified particles streaming into the phaco tip ---
  const fragGeo = new THREE.IcosahedronGeometry(1, 0);
  const frags = new THREE.InstancedMesh(fragGeo, m.fragment, N_PARTICLES);
  frags.frustumCulled = false;
  root.add(frags);

  // --- cornea ---
  const cProf = corneaProfile(64);
  const cornea = new THREE.Mesh(latheGeometry(cProf, { segments: 160 }), m.cornea);
  cornea.renderOrder = 10;
  root.add(cornea);
  const corneaCap = capPair(m.corneaCap, 11);
  corneaCap.set(cProf, 'c');
  root.add(corneaCap.group);

  // --- IOL: biconvex optic + two C-loop haptics, deformed on the CPU (rolled in the cartridge -> flat) ---
  const iol = new THREE.Group();
  const oR = EYE.iolOpticR;
  const optPts = [];
  for (let k = 0; k <= 24; k++) { const r = oR * (k / 24); optPts.push([r, -iolHalfT(r)]); }
  optPts.push([oR, -EYE.iolEdgeT], [oR, EYE.iolEdgeT]);
  for (let k = 24; k >= 0; k--) { const r = oR * (k / 24); optPts.push([r, iolHalfT(r)]); }
  const optic = new THREE.Mesh(latheGeometry(optPts, { segments: 96 }), m.iol);
  optic.renderOrder = 6;
  iol.add(optic);
  const haptics = [0, Math.PI].map((rot) => {
    const curve = new THREE.CatmullRomCurve3(hapticCentreline(rot, 64).map((p) => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, EYE.iolHapticTube, 8, false), m.haptic);
    mesh.renderOrder = 6;
    iol.add(mesh);
    return mesh;
  });
  const iolMeshes = [optic, ...haptics];
  iolMeshes.forEach((mesh) => { mesh.userData.base = mesh.geometry.attributes.position.array.slice(); });
  let iolDeformKey = '';
  function deformIOL(fold, open) {
    const key = `${fold.toFixed(5)}|${open.toFixed(5)}`;
    if (key === iolDeformKey) return;
    iolDeformKey = key;
    for (const mesh of iolMeshes) {
      const base = mesh.userData.base, pos = mesh.geometry.attributes.position.array;
      for (let i = 0; i < base.length; i += 3) {
        const q = iolDeform(base[i], base[i + 1], base[i + 2], fold, open);
        pos[i] = q[0]; pos[i + 1] = q[1]; pos[i + 2] = q[2];
      }
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeBoundingSphere();
    }
  }
  iol.visible = false;
  root.add(iol);
  const iolCap = capPair(m.iolCap, 7);
  iolCap.set(optPts, 'i');
  root.add(iolCap.group);

  // --- instruments ---
  const instruments = { keratome: keratome(m), forceps: forceps(m), phaco: phaco(m), injector: injector(m) };
  for (const obj of Object.values(instruments)) { obj.visible = false; root.add(obj); }

  // --- light rays ---
  const rays = buildRays();
  root.add(rays.focusMesh, rays.scatterGroup);
  const rayMats = { focus: rays.focusMesh.material, scatter: rays.scatterGroup.children.map((c) => c.material) };

  // --- review-mode anatomical layers ---
  const layers = { cornea: true, iris: true, lens: true, iol: true, instruments: true, rays: true };

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

  function setIris(r, c) {
    const key = `${r.toFixed(5)}|${c.toFixed(5)}`;
    if (key === irisKey) return;
    irisKey = key; pupilR = r; collapse = c;
    const pr = irisProfile(r, c);
    writeLathe(irisGeo, pr.pts, pr.vs);
    irisCap.set(pr.pts, key);
  }

  function apply(P, { time = 0, dt = 0.016, reduced = false, focusId = null } = {}) {
    lastP = P;
    setIris(P.pupilR, P.bagCollapse);
    const zFront = irisMarginZ(pupilR, collapse);
    pupilRing.scale.setScalar(pupilR + 0.02);
    pupilRing.position.z = zFront + 0.02;

    const cut = userCut === null ? P.cutaway : userCut;
    sclera.setCut(cut); ciliary.setCut(cut);
    setClip(cut);

    // capsular bag shape (settles around the IOL at the end of stage 6)
    const cKey = `${P.bagCollapse.toFixed(4)}|${P.rhexisOpen ? 1 : 0}`;
    if (cKey !== capsuleKey) {
      capsuleKey = cKey;
      writeLathe(capsuleGeo, capsuleProfile(P.bagCollapse, 48));
      capsuleCap.set(capsuleBand(P.bagCollapse, P.rhexisOpen), cKey);
    }
    layoutZonules(P.bagCollapse);

    // nucleus quadrants (crack, are mobilised to the probe and emulsified there)
    const np = nucleusPieces(P.nucleusP);
    let anyNuc = false;
    np.forEach((pc, k) => {
      const mesh = pieces[k];
      mesh.visible = pc.visible && layers.lens;
      anyNuc = anyNuc || mesh.visible;
      mesh.position.set(pc.centroid[0] + pc.offset[0], pc.centroid[1] + pc.offset[1], pc.centroid[2] + pc.offset[2]);
      mesh.scale.setScalar(Math.max(1e-4, pc.scale));
    });
    const intact = P.nucleusP <= 0.3 && layers.lens;
    nucleusCap.group.visible = cut && intact;
    cortex.visible = P.cortexOpacity > 0.01 && layers.lens;
    m.cortex.opacity = 0.42 * P.cortexOpacity;
    cortexCapG.visible = cut && cortex.visible;
    m.cortexCap.opacity = 0.55 * P.cortexOpacity;
    capsule.visible = layers.lens;
    capsuleCap.group.visible = cut && layers.lens;
    m.capsule.userData.uniforms.uOpen.value = P.rhexisOpen ? 1 : 0;
    m.capsule.userData.uniforms.uRhexisR.value = EYE.rhexisR;
    m.capsule.userData.uniforms.uEqZ.value = EYE.lensEqZ;
    rhexis.visible = P.rhexisArc > 0.001 && layers.lens;
    rhexis.geometry.setDrawRange(0, Math.floor(P.rhexisArc * 160) * 6 * 6);
    rhexis.position.z = capsuleAntZ(EYE.rhexisR, P.bagCollapse) - capsuleAntZ(EYE.rhexisR, 0);
    flap.visible = !!P.flap && layers.lens;
    if (P.flap) writeFlap(P.flap);

    // emulsified particles
    const parts = P.particles || [];
    frags.visible = parts.length > 0 && layers.lens;
    if (frags.visible) {
      for (let i = 0; i < N_PARTICLES; i++) {
        const q = parts[i];
        if (q) { dObj.position.set(q[0], q[1], q[2]); dObj.scale.setScalar(Math.max(1e-4, q[3])); dObj.rotation.set(i * 1.3 + q[3] * 9, i * 0.7, 0); }
        else dObj.scale.setScalar(1e-4);
        dObj.updateMatrix();
        frags.setMatrixAt(i, dObj.matrix);
      }
      frags.instanceMatrix.needsUpdate = true;
    }

    // cornea and incision
    cornea.visible = layers.cornea;
    corneaCap.group.visible = cut && layers.cornea;
    m.cornea.userData.uniforms.uIncision.value = P.incision;
    iris.visible = layers.iris;
    irisCap.group.visible = cut && layers.iris;

    // instruments (shaft through the fulcrum)
    for (const [kind, obj] of Object.entries(instruments)) {
      const on = !!P.instrument && P.instrument.kind === kind && layers.instruments;
      obj.visible = on;
      if (on) poseInstrument(obj, P.instrument.tip);
    }

    // IOL
    iol.visible = !!P.iol && layers.iol;
    iolCap.group.visible = false;
    if (P.iol) {
      deformIOL(P.iol.fold, P.iol.open);
      iol.position.set(...P.iol.pos);
      iol.rotation.set(0, P.iol.tilt || 0, P.iol.spin);
      const settled = P.iol.fold < 1e-3 && Math.abs(P.iol.tilt || 0) < 1e-3 && Math.hypot(P.iol.pos[0], P.iol.pos[1]) < 1e-3;
      iolCap.group.visible = cut && settled && layers.iol;
      iolCap.group.position.set(0, 0, P.iol.pos[2]);
    }

    // rays
    rayMats.focus.uniforms.uOpacity.value = 0.85 * P.focusRays;
    rays.focusMesh.visible = P.focusRays > 0.001 && layers.rays;
    rayMats.scatter.forEach((mt) => { mt.uniforms.uOpacity.value = 0.8 * P.scatterRays; });
    rays.scatterGroup.visible = P.scatterRays > 0.001 && layers.rays;
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
    pupilRing.visible = hl.pupil > 0.01 && layers.iris;
    return { anyNuc };
  }

  function isAnimating() {
    return Object.values(hl).some((v) => v > 0.01) || rays.focusMesh.visible || rays.scatterGroup.visible;
  }

  // label anchors in world space
  function anchors() {
    const P = lastP;
    const ib = irisBoundsAt(4.4, pupilR, collapse);
    const list = [
      { id: 'cornea', pos: [-2.4, 2.4, corneaAntZ(3.39) + 0.05] },
      { id: 'iris', pos: [0, -4.4, ib ? ib.front + 0.05 : 0.2] },
      { id: 'pupil', pos: [-pupilR * 0.72, -pupilR * 0.72, irisMarginZ(pupilR, collapse)] },
      { id: 'lens', pos: [1.6, -1.2, EYE.lensEqZ], hidden: !!(P && P.cortexOpacity < 0.05 && P.nucleusP >= 1) },
      { id: 'capsule', pos: [2.6, 3.4, capsuleAntZ(4.27, P ? P.bagCollapse : 0) + 0.05] },
      { id: 'zonules', pos: [4.95, -1.2, EYE.lensEqZ] },
      { id: 'iol', pos: P && P.iol ? P.iol.pos : [0, 0, EYE.lensEqZ], hidden: !(P && P.iol) }
    ];
    return list;
  }

  return {
    root,
    apply,
    anchors,
    isAnimating,
    setLayers(next) { Object.assign(layers, next); },
    get layers() { return { ...layers }; },
    setUserCutaway(v) { userCut = v; },
    get userCutaway() { return userCut; },
    wound: WOUND
  };
}
