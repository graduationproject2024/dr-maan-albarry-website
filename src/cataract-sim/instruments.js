// Stylised but recognisable ophthalmic instruments, built procedurally. Each group has its working tip at the
// local origin and its shaft/handle along local +Z; local +Y is the "up" side (blade face / bevel up).
import * as THREE from 'three';
import { latheGeometry } from './lathe.js';
import { instrumentAxis } from './anatomy.js';
import { NOZZLE_BORE } from './surgery.js';

function ridgedHandle(r0, r1, z0, z1, ridges) {
  const pts = [[0, z0], [r0 * 0.6, z0], [r0, z0 + 0.6]];
  const step = (z1 - z0 - 1.2) / ridges;
  for (let i = 0; i < ridges; i++) {
    const z = z0 + 0.6 + i * step;
    pts.push([r1, z + step * 0.15], [r1, z + step * 0.6], [r0, z + step * 0.8]);
  }
  pts.push([r0, z1 - 0.4], [r0 * 0.7, z1], [0, z1]);
  return pts;
}

export function keratome(m) {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  const half = [[0, 0], [0.62, 0.55], [1.18, 1.55], [1.36, 2.45], [0.6, 3.25], [0.34, 3.7]];
  s.moveTo(0, 0);
  for (let i = 1; i < half.length; i++) s.lineTo(half[i][0], half[i][1]);
  for (let i = half.length - 1; i >= 1; i--) s.lineTo(-half[i][0], half[i][1]);
  s.closePath();
  const blade = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.06, bevelSegments: 3, curveSegments: 4 });
  blade.translate(0, 0, -0.025);
  blade.rotateX(Math.PI / 2);
  blade.rotateZ(0.35); // slight roll so the polished faces catch the light
  blade.computeVertexNormals();
  g.add(new THREE.Mesh(blade, m.steel));
  const neck = latheGeometry([[0, 3.55], [0.22, 3.55], [0.26, 6], [0.3, 9], [0.62, 10.5], [0.75, 13], [0, 13]], { segments: 24 });
  g.add(new THREE.Mesh(neck, m.steel));
  const handle = latheGeometry(ridgedHandle(1.9, 2.05, 13, 70, 18), { segments: 32 });
  g.add(new THREE.Mesh(handle, m.handle));
  return g;
}

export function forceps(m) {
  const g = new THREE.Group();
  for (const sgn of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sgn * 0.05, 0, 0), new THREE.Vector3(sgn * 0.07, 0.3, 0.22), new THREE.Vector3(sgn * 0.12, 0.48, 0.9),
      new THREE.Vector3(sgn * 0.2, 0.46, 3), new THREE.Vector3(sgn * 0.42, 0.4, 9), new THREE.Vector3(sgn * 0.85, 0.36, 16)
    ]);
    const arm = new THREE.TubeGeometry(curve, 64, 0.075, 8, false);
    g.add(new THREE.Mesh(arm, m.steel));
    const pad = new THREE.SphereGeometry(0.085, 12, 8);
    pad.scale(1, 0.6, 1.4);
    const pm = new THREE.Mesh(pad, m.steel);
    pm.position.set(sgn * 0.05, 0, 0);
    g.add(pm);
  }
  const handle = latheGeometry(ridgedHandle(1.5, 1.62, 16, 70, 16), { segments: 32 });
  const hm = new THREE.Mesh(handle, m.handle);
  hm.position.y = 0.36;
  g.add(hm);
  return g;
}

export function phaco(m) {
  const g = new THREE.Group();
  const needle = latheGeometry([[0.3, 0], [0.3, 0], [0.43, 0], [0.43, 0], [0.43, 2.0], [0.43, 2.0], [0.3, 2.0], [0.3, 2.0], [0.3, 0]], { segments: 32 });
  g.add(new THREE.Mesh(needle, m.titanium));
  const bore = new THREE.CircleGeometry(0.3, 24);
  bore.rotateX(Math.PI);
  bore.translate(0, 0, 0.3);
  g.add(new THREE.Mesh(bore, m.bore));
  const sleeve = latheGeometry([[0.45, 1.25], [0.58, 1.45], [0.72, 2.2], [0.74, 9], [1.4, 11.5], [1.5, 13], [0, 13]], { segments: 32 });
  g.add(new THREE.Mesh(sleeve, m.sleeve));
  const body = latheGeometry([[0, 12.6], [1.4, 12.6], [2.2, 15], [2.7, 17], ...ridgedHandle(2.7, 2.85, 17, 80, 10).slice(3)], { segments: 40 });
  g.add(new THREE.Mesh(body, m.titanium));
  return g;
}

export function injector(m) {
  const g = new THREE.Group();
  const b = NOZZLE_BORE, o = NOZZLE_BORE + 0.18; // ~2 mm bore, ~2.4 mm tip: passes the ~2.2–2.4 mm wound
  const nozzle = latheGeometry([[b, 4], [b, 0], [b, 0], [o, 0], [o, 0], [o, 4], [1.9, 8], [2.4, 9.5], [2.4, 22], [0, 22]], { segments: 40 });
  const nm = new THREE.Mesh(nozzle, m.plastic);
  nm.renderOrder = 12;
  g.add(nm);
  const wings = new THREE.BoxGeometry(9, 0.6, 2.6);
  wings.translate(0, 0, 13);
  const wm = new THREE.Mesh(wings, m.plastic);
  wm.renderOrder = 12;
  g.add(wm);
  const rod = new THREE.CylinderGeometry(0.35, 0.35, 40, 16);
  rod.rotateX(Math.PI / 2);
  rod.translate(0, 0, 24);
  g.add(new THREE.Mesh(rod, m.plunger));
  const body = latheGeometry(ridgedHandle(3.0, 3.1, 22, 80, 6), { segments: 40 });
  g.add(new THREE.Mesh(body, m.handle));
  return g;
}

const _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3(), _m = new THREE.Matrix4();
const HINT = new THREE.Vector3(0, 0, 1);

// Place an instrument so its tip is at `tip` and its shaft passes through the incision (fulcrum). The axis comes
// from anatomy.instrumentAxis, the same function the constraint validator checks.
export function poseInstrument(obj, tipArr) {
  obj.position.set(tipArr[0], tipArr[1], tipArr[2]);
  _z.set(...instrumentAxis(tipArr));
  _x.crossVectors(HINT, _z).normalize();
  _y.crossVectors(_z, _x).normalize();
  _m.makeBasis(_x, _y, _z);
  obj.quaternion.setFromRotationMatrix(_m);
}
