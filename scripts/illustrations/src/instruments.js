// Illustrative instruments and implants (procedural, brand-free).
import * as THREE from 'three';
import { lathe } from './kit.js';
import { EYE } from './anatomy.js';

// Place an object built along local +Z so that local origin sits at `tip` and +Z points along `outDir`.
export function orient(obj, tip, outDir) {
  const d = new THREE.Vector3(...outDir).normalize();
  obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d);
  obj.position.set(...tip);
  obj.userData.instrument = true;
  return obj;
}

// Phaco needle (bevelled hollow tip) with silicone irrigation sleeve and handpiece nose.
export function phacoTip(mats) {
  const g = new THREE.Group();
  const needle = lathe([[0.3, 0], [0.45, 0], [0.45, 7], [0.3, 7]], { phiLength: Math.PI * 2, closed: true, segments: 64 });
  const p = needle.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getZ(i) < 0.01) p.setZ(i, (p.getX(i) + 0.45) * 0.62); // 30-degree-ish bevel
  needle.computeVertexNormals();
  g.add(new THREE.Mesh(needle, mats.metal));
  const lumen = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), mats.metalDark);
  g.add(lumen); lumen.position.z = 0.25; lumen.visible = false;
  const sleeve = lathe([[0, 1.3], [0.5, 1.3], [0.62, 1.45], [0.66, 2], [0.72, 8.5], [0, 8.5]], { phiLength: Math.PI * 2, segments: 64 });
  g.add(new THREE.Mesh(sleeve, mats.sleeve));
  const nose = lathe([[0, 8.4], [0.74, 8.4], [1.05, 9.6], [1.7, 11.5], [1.75, 40], [0, 40]], { phiLength: Math.PI * 2, segments: 64 });
  g.add(new THREE.Mesh(nose, mats.metal));
  return g;
}

// 30-gauge needle with translucent hub and syringe barrel (built along +Z from the tip).
export function injectionNeedle(mats, exposed = 12.7) {
  const g = new THREE.Group();
  const r = 0.155;
  const nd = lathe([[0.0, 0], [r, 0], [r, exposed], [0, exposed]], { phiLength: Math.PI * 2, segments: 40 });
  const p = nd.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getZ(i) < 0.01) p.setZ(i, (p.getX(i) + r) * 2.4);
  nd.computeVertexNormals();
  g.add(new THREE.Mesh(nd, mats.metal));
  const hubMat = new THREE.MeshPhysicalMaterial({ color: '#D7E3EA', roughness: 0.25, transparent: true, opacity: 0.8, envMap: mats.metal.envMap, envMapIntensity: 0.8 });
  const hub = lathe([[0, exposed - 0.4], [0.45, exposed - 0.4], [0.9, exposed + 1.2], [1.25, exposed + 6], [1.6, exposed + 6.2], [1.6, exposed + 7], [0, exposed + 7]], { phiLength: Math.PI * 2, segments: 64 });
  g.add(new THREE.Mesh(hub, hubMat));
  const barrelMat = new THREE.MeshPhysicalMaterial({ color: '#EEF3F6', roughness: 0.12, transparent: true, opacity: 0.55, depthWrite: false, envMap: mats.metal.envMap, envMapIntensity: 1, clearcoat: 1 });
  const barrel = lathe([[0, exposed + 7], [1.9, exposed + 7], [2.3, exposed + 7.6], [2.3, exposed + 40], [0, exposed + 40]], { phiLength: Math.PI * 2, segments: 64 });
  const bm = new THREE.Mesh(barrel, barrelMat); bm.renderOrder = 4; g.add(bm);
  return g;
}

// Foldable one-piece IOL: biconvex 6 mm optic with square edge and two C-loop haptics.
export function iol(mats, { zc = -1.2, span = 4.55, phi0 = 60 * Math.PI / 180, rings = false, half = false } = {}) {
  const g = new THREE.Group();
  const k = 0.25 / 9;
  const prof = [];
  for (let r = 0; r <= 3.0001; r += 0.1) prof.push([r, zc - 0.36 + k * r * r]);
  prof.push([3, zc + 0.36 - k * 9]);
  for (let r = 3; r >= -0.0001; r -= 0.1) prof.push([Math.max(0, r), zc + 0.36 - k * r * r]);
  const og = lathe(prof, { phiLength: half ? Math.PI : Math.PI * 2, segments: 128 });
  g.userData.profile = prof;
  const mat = mats.implant.clone();
  if (rings) {
    const p = og.attributes.position, uv = og.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 6.4 + 0.5, p.getY(i) / 6.4 + 0.5);
    mat.map = ringTexture(); mat.opacity = 0.8;
  }
  const optic = new THREE.Mesh(og, mat); optic.renderOrder = 5; g.add(optic);
  for (const off of [0, Math.PI]) {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const r = 2.75 + (span - 2.75) * Math.pow(Math.sin(t * Math.PI / 2), 0.9) - 0.25 * Math.pow(t, 6);
      const ph = phi0 + off + t * 2.0 + 0.25 * Math.pow(t, 4);
      pts.push(new THREE.Vector3(r * Math.cos(ph), r * Math.sin(ph), zc - 0.02 * t));
    }
    // in the sectioned eye only the kept half (y >= 0) of each haptic is drawn
    const kept = half ? pts.filter((p) => p.y >= 0) : pts;
    if (kept.length < 3) continue;
    const tg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(kept), 80, 0.12, 12, false);
    g.add(new THREE.Mesh(tg, mats.haptic));
    if (!half || pts[pts.length - 1].y >= 0) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), mats.haptic);
      cap.position.copy(kept[kept.length - 1]); g.add(cap);
    }
  }
  return g;
}

function ringTexture() {
  const N = 1024, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, N, N);
  const s = N / 6.4;
  for (let kk = 1; kk <= 14; kk++) {
    const r = 0.58 * Math.sqrt(kk);
    if (r > 2.3) break;
    g.strokeStyle = `rgba(40, 92, 104, ${0.55 - kk * 0.018})`;
    g.lineWidth = Math.max(2, 7 - kk * 0.35);
    g.beginPath(); g.arc(N / 2, N / 2, r * s, 0, Math.PI * 2); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// Phakic posterior-chamber plate lens: vaulted plate with central optic and footplates resting in the sulcus.
export function phakicLens(mats, { L = 5.75, Rb = 17, zApex = 0.84 } = {}) {
  const hw = (x) => {
    const ax = Math.abs(x);
    if (ax <= 2.6) return 3.25;
    if (ax <= 3.4) return 3.25 - 0.65 * Math.sin(((ax - 2.6) / 0.8) * Math.PI / 2);
    if (ax <= 4.7) return 2.6 + 0.3 * Math.sin(((ax - 3.4) / 1.3) * Math.PI / 2);
    const t = Math.min(1, (ax - 4.7) / (L - 4.7));
    return 2.9 * Math.pow(Math.max(0, 1 - t ** 4), 0.25);
  };
  const th = (x, y) => { const r = Math.hypot(x, y); return r < 2.9 ? 0.09 + 0.17 * (r / 2.9) ** 2 : 0.13; };
  const base = (x, y) => zApex - (x * x + y * y) / (2 * Rb);
  const Nu = 180, Nv = 44;
  const topV = [], bot = [];
  for (let i = 0; i <= Nu; i++) {
    const x = -L + (2 * L * i) / Nu, w = hw(x);
    for (let j = 0; j <= Nv; j++) {
      const y = (w * j) / Nv, z = base(x, y); // kept half only (y >= 0), like the tissues
      bot.push(x, y, z); topV.push(x, y, z + th(x, y));
    }
  }
  const cols = Nv + 1;
  const pos = [...topV, ...bot], off = topV.length / 3, idx = [];
  for (let i = 0; i < Nu; i++) for (let j = 0; j < Nv; j++) {
    const a = i * cols + j, b = (i + 1) * cols + j, c = a + 1, d = b + 1;
    idx.push(a, b, d, a, d, c); // top
    idx.push(off + a, off + d, off + b, off + a, off + c, off + d); // bottom
  }
  for (let i = 0; i < Nu; i++) for (const j of [Nv]) { // outer side wall (the y = 0 cut is painted)
    const a = i * cols + j, b = (i + 1) * cols + j;
    idx.push(a, off + a, off + b, a, off + b, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const m = mats.implant.clone(); m.opacity = 0.72;
  const mesh = new THREE.Mesh(g, m); mesh.renderOrder = 5;
  const grp = new THREE.Group(); grp.add(mesh);
  // section strip at y = 0 for the painted cut face
  const top = [], bottom = [];
  for (let i = 0; i <= 200; i++) { const x = -L + (2 * L * i) / 200; bottom.push([x, base(x, 0)]); top.push([x, base(x, 0) + th(x, 0)]); }
  grp.userData.section = [...bottom, ...top.reverse()];
  return grp;
}

// Soft violet light (UV / laser) column along -Z ending on a surface function zEnd(x, y).
export function lightColumn({ radius, zFar, zEnd, opacity = 0.2, color = '#8C7BE0', cx = 0, cy = 0 }) {
  const seg = 96, rows = 40;
  const pos = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2, x = cx + radius * Math.cos(a), y = cy + radius * Math.sin(a);
    const ze = zEnd(x, y);
    for (let j = 0; j <= rows; j++) pos.push(x, y, ze + (zFar - ze) * (j / rows));
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rows; j++) {
    const a = i * (rows + 1) + j, b = (i + 1) * (rows + 1) + j;
    idx.push(a, b, b + 1, a, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity }, uFar: { value: zFar }, uNear: { value: zEnd(cx, cy) } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying float vZ;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); vZ = position.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uOpacity; uniform float uFar; uniform float uNear; varying vec3 vN; varying vec3 vV; varying float vZ;
      void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 1.3);
        float along = smoothstep(uFar, uNear + (uFar-uNear)*0.35, vZ);
        gl_FragColor = vec4(uColor, uOpacity * f * along);
        #include <colorspace_fragment>
      }`
  });
  const m = new THREE.Mesh(g, mat); m.renderOrder = 20;
  return m;
}

export { EYE };
