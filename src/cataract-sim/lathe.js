// Lathe geometry around the Z (optical) axis with profile-derived normals, rewritable in place
// (used for the iris, whose shape changes with pupil dilation).
// Profile: array of [r, z]. A counter-clockwise loop in the (r, z) plane gives outward-facing normals.
// Duplicate consecutive points produce a crisp (hard) edge.
import * as THREE from 'three';

export function latheGeometry(profile, opts = {}) {
  const segments = opts.segments ?? 96;
  const n = profile.length;
  const cols = segments + 1;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * cols * 3), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * cols * 3), 3));
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * cols * 2), 2));
  const idx = [];
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < n - 1; j++) {
      const a = i * n + j, b = (i + 1) * n + j, c = i * n + j + 1, d = (i + 1) * n + j + 1;
      idx.push(a, b, d, a, d, c);
    }
  }
  g.setIndex(idx);
  g.userData.lathe = { segments, n, phiStart: opts.phiStart ?? 0, phiLength: opts.phiLength ?? Math.PI * 2 };
  writeLathe(g, profile, opts.v);
  return g;
}

export function writeLathe(g, profile, vValues) {
  const { segments, n, phiStart, phiLength } = g.userData.lathe;
  if (profile.length !== n) throw new Error('profile length mismatch');
  // texture v: explicit or normalised arc length
  let vs = vValues;
  if (!vs) {
    vs = [0];
    let acc = 0;
    for (let j = 1; j < n; j++) { acc += Math.hypot(profile[j][0] - profile[j - 1][0], profile[j][1] - profile[j - 1][1]); vs.push(acc); }
    vs = vs.map((v) => (acc > 0 ? v / acc : 0));
  }
  // profile normals: length-weighted average of adjacent segment normals (dz, -dr)
  const segN = [];
  for (let j = 0; j < n - 1; j++) segN.push([profile[j + 1][1] - profile[j][1], -(profile[j + 1][0] - profile[j][0])]);
  const pn = [];
  for (let j = 0; j < n; j++) {
    let nr = 0, nz = 0;
    if (j > 0) { nr += segN[j - 1][0]; nz += segN[j - 1][1]; }
    if (j < n - 1) { nr += segN[j][0]; nz += segN[j][1]; }
    const l = Math.hypot(nr, nz) || 1;
    pn.push([nr / l, nz / l]);
  }
  const pos = g.attributes.position.array, nor = g.attributes.normal.array, uv = g.attributes.uv.array;
  for (let i = 0; i <= segments; i++) {
    const phi = phiStart + (i / segments) * phiLength;
    const c = Math.cos(phi), s = Math.sin(phi);
    const u = phi / (Math.PI * 2);
    for (let j = 0; j < n; j++) {
      const k = i * n + j;
      const [r, z] = profile[j];
      pos[k * 3] = r * c; pos[k * 3 + 1] = r * s; pos[k * 3 + 2] = z;
      nor[k * 3] = pn[j][0] * c; nor[k * 3 + 1] = pn[j][0] * s; nor[k * 3 + 2] = pn[j][1];
      uv[k * 2] = u; uv[k * 2 + 1] = vs[j];
    }
  }
  g.attributes.position.needsUpdate = true;
  g.attributes.normal.needsUpdate = true;
  g.attributes.uv.needsUpdate = true;
  g.computeBoundingSphere();
  g.computeBoundingBox();
}

// Flat cap closing a partial lathe at angle phi (used for the cut-away wedge faces).
// `flip` reverses winding so the cap faces towards increasing phi.
export function capGeometry(profile, phi, flip = false) {
  const pts = [];
  for (const p of profile) {
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(last.x - p[0], last.y - p[1]) > 1e-5) pts.push(new THREE.Vector2(p[0], p[1]));
  }
  if (pts.length > 2 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-5) pts.pop();
  const shape = new THREE.Shape(pts);
  const g = new THREE.ShapeGeometry(shape);
  const pos = g.attributes.position;
  const c = Math.cos(phi), s = Math.sin(phi);
  for (let i = 0; i < pos.count; i++) {
    const r = pos.getX(i), z = pos.getY(i);
    pos.setXYZ(i, r * c, r * s, z);
  }
  if (flip) {
    const ix = g.index.array;
    for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
  }
  g.computeVertexNormals();
  return g;
}
