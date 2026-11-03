// Shared builders: half-lathe tissue solids, function-defined corneas, the painted section plane and
// the canvas "section painter" helpers. Everything here is procedural; no external models or textures.
import * as THREE from 'three';
import { EYE, corneaAntZ, corneaThickness } from './anatomy.js';
import { C, M, INK_PX, SS } from './style.js';

// ---------------------------------------------------------------------------------------------
// Lathe around the optical (Z) axis, adapted from src/cataract-sim/lathe.js (copied, not imported).
// phi runs 0..phiLength; the default half lathe keeps the y >= 0 half of the eye.
export function lathe(profile, { segments = 128, phiStart = 0, phiLength = Math.PI, closed = false } = {}) {
  const prof = closed ? [...profile, profile[0]] : profile;
  const n = prof.length, cols = segments + 1;
  const pos = new Float32Array(n * cols * 3), nor = new Float32Array(n * cols * 3), uv = new Float32Array(n * cols * 2);
  const segN = [];
  for (let j = 0; j < n - 1; j++) segN.push([prof[j + 1][1] - prof[j][1], -(prof[j + 1][0] - prof[j][0])]);
  const pn = [];
  for (let j = 0; j < n; j++) {
    let nr = 0, nz = 0;
    if (j > 0) { nr += segN[j - 1][0]; nz += segN[j - 1][1]; }
    if (j < n - 1) { nr += segN[j][0]; nz += segN[j][1]; }
    if (closed && (j === 0 || j === n - 1)) { nr = segN[0][0] + segN[n - 2][0]; nz = segN[0][1] + segN[n - 2][1]; }
    const l = Math.hypot(nr, nz) || 1;
    pn.push([nr / l, nz / l]);
  }
  for (let i = 0; i <= segments; i++) {
    const phi = phiStart + (i / segments) * phiLength, c = Math.cos(phi), s = Math.sin(phi);
    for (let j = 0; j < n; j++) {
      const k = i * n + j, [r, z] = prof[j];
      pos[k * 3] = r * c; pos[k * 3 + 1] = r * s; pos[k * 3 + 2] = z;
      nor[k * 3] = pn[j][0] * c; nor[k * 3 + 1] = pn[j][0] * s; nor[k * 3 + 2] = pn[j][1];
      uv[k * 2] = i / segments; uv[k * 2 + 1] = j / (n - 1);
    }
  }
  const idx = [];
  for (let i = 0; i < segments; i++) for (let j = 0; j < n - 1; j++) {
    const a = i * n + j, b = (i + 1) * n + j, c2 = i * n + j + 1, d = (i + 1) * n + j + 1;
    idx.push(a, b, d, a, d, c2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// ---------------------------------------------------------------------------------------------
// Corneas defined by functions of (x, y): F = reference anterior surface (drives the posterior surface),
// G = actual anterior surface (defaults to F), T = thickness. Posterior = F - T * n(F).
export function corneaSpec(over = {}) {
  const F = over.F || ((x, y) => corneaAntZ(Math.hypot(x, y)));
  const T = over.T || ((x, y) => corneaThickness(Math.hypot(x, y)));
  const G = over.G || F;
  const R = EYE.corneaRadius;
  const normal = (x, y) => {
    const h = 1e-3;
    const dx = (F(x + h, y) - F(x - h, y)) / (2 * h), dy = (F(x, y + h) - F(x, y - h)) / (2 * h);
    const l = Math.hypot(dx, dy, 1);
    return [-dx / l, -dy / l, 1 / l];
  };
  const post = (x, y) => { const n = normal(x, y), t = T(x, y); return [x - n[0] * t, y - n[1] * t, F(x, y) - n[2] * t]; };
  // Section polygon in (x, z) at y = 0: anterior from -R to R, then posterior back.
  const section = (samples = 260, extraX = []) => {
    const xs = [];
    for (let k = 0; k <= samples; k++) xs.push(-R + (2 * R * k) / samples);
    xs.push(...extraX); xs.sort((a, b) => a - b);
    const ant = xs.map((x) => [x, G(x, 0)]);
    const pst = xs.map((x) => { const p = post(x, 0); return [p[0], p[2]]; });
    return { ant, post: pst, poly: [...ant, ...pst.slice().reverse()] };
  };
  return { F, G, T, R, normal, post, section };
}

// Half (y >= 0) 3D cornea solid from a corneaSpec. `radii` lets callers add sample rings at sharp features.
export function corneaMesh(spec, { radii = [], segments = 160, rings = 90, phiLength = Math.PI } = {}) {
  const R = spec.R;
  let rs = [];
  for (let k = 0; k <= rings; k++) rs.push(R * Math.sin((k / rings) * Math.PI / 2));
  rs.push(...radii); rs = [...new Set(rs.map((r) => +r.toFixed(5)))].sort((a, b) => a - b);
  const nR = rs.length, cols = segments + 1;
  const mk = (fn) => {
    const pos = [];
    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * phiLength;
      for (let j = 0; j < nR; j++) pos.push(...fn(rs[j] * Math.cos(phi), rs[j] * Math.sin(phi)));
    }
    return pos;
  };
  const surf = (pos, flip) => {
    const idx = [];
    for (let i = 0; i < segments; i++) for (let j = 0; j < nR - 1; j++) {
      const a = i * nR + j, b = (i + 1) * nR + j, c = i * nR + j + 1, d = (i + 1) * nR + j + 1;
      if (flip) idx.push(a, d, b, a, c, d); else idx.push(a, b, d, a, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };
  const ant = surf(mk((x, y) => [x, y, spec.G(x, y)]), true);
  const post = surf(mk((x, y) => spec.post(x, y)), false);
  // rim strip at r = R
  const rim = [];
  for (let i = 0; i <= segments; i++) {
    const phi = (i / segments) * phiLength, x = R * Math.cos(phi), y = R * Math.sin(phi);
    rim.push(x, y, spec.G(x, y), ...spec.post(x, y));
  }
  const ridx = [];
  for (let i = 0; i < segments; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; ridx.push(a, c, b, b, c, d); }
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.Float32BufferAttribute(rim, 3));
  rg.setIndex(ridx); rg.computeVertexNormals();
  return [ant, post, rg];
}

// ---------------------------------------------------------------------------------------------
// Materials
export function materials(envMap) {
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, side: THREE.DoubleSide, envMap, envMapIntensity: 0.45, ...o });
  return {
    sclera: std(M.sclera, { roughness: 0.55 }),
    iris: std('#ffffff', { roughness: 0.75 }),
    ciliary: std(M.ciliary, { roughness: 0.7 }),
    choroid: std(M.choroid, { roughness: 0.8 }),
    retina: std('#ffffff', { roughness: 0.72, vertexColors: true }),
    cornea: new THREE.MeshPhysicalMaterial({ color: M.cornea, roughness: 0.06, metalness: 0, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide, envMap, envMapIntensity: 0.9, clearcoat: 1, clearcoatRoughness: 0.05 }),
    lensClear: new THREE.MeshPhysicalMaterial({ color: M.lensClear, roughness: 0.3, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide, envMap, envMapIntensity: 0.6 }),
    cataract: std(M.cataract, { roughness: 0.85 }),
    capsule: new THREE.MeshStandardMaterial({ color: '#EFE6D2', roughness: 0.4, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide, envMap, envMapIntensity: 0.6 }),
    metal: new THREE.MeshStandardMaterial({ color: M.metal, metalness: 1, roughness: 0.28, envMap, envMapIntensity: 1.25 }),
    metalDark: new THREE.MeshStandardMaterial({ color: '#3A3F45', metalness: 0.6, roughness: 0.5, envMap, envMapIntensity: 0.6, side: THREE.DoubleSide }),
    sleeve: new THREE.MeshStandardMaterial({ color: M.sleeve, roughness: 0.55, envMap, envMapIntensity: 0.5 }),
    implant: new THREE.MeshPhysicalMaterial({ color: M.implant, roughness: 0.08, transparent: true, opacity: 0.62, depthWrite: false, side: THREE.DoubleSide, envMap, envMapIntensity: 1.1, clearcoat: 1, clearcoatRoughness: 0.04 }),
    haptic: new THREE.MeshStandardMaterial({ color: M.implantHaptic, roughness: 0.32, envMap, envMapIntensity: 0.8 }),
    suture: new THREE.MeshStandardMaterial({ color: M.suture, roughness: 0.35, envMap, envMapIntensity: 0.5 })
  };
}

// Iris front-surface colour pattern (radial stromal fibres), painted procedurally.
export function irisTexture(seed = 3) {
  const W = 1024, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const R = rng(seed);
  const grad = g.createLinearGradient(0, 0, 0, H); // y: 0 = pupil margin, H = root
  grad.addColorStop(0, '#2a1810'); grad.addColorStop(0.06, '#4a2e1c'); grad.addColorStop(0.28, '#8a5f39');
  grad.addColorStop(0.36, '#6f4a2c'); grad.addColorStop(0.7, '#7a5232'); grad.addColorStop(1, '#3d2617');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 1600; i++) {
    const x = R() * W, y0 = R() * H * 0.3, y1 = H * (0.5 + R() * 0.5);
    g.strokeStyle = R() < 0.6 ? `rgba(205,160,105,${0.06 + R() * 0.1})` : `rgba(30,15,6,${0.08 + R() * 0.12})`;
    g.lineWidth = 0.6 + R() * 1.6;
    g.beginPath(); g.moveTo(x, y0); g.quadraticCurveTo(x + (R() - 0.5) * 8, (y0 + y1) / 2, x + (R() - 0.5) * 6, y1); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Iris uv: u along phi (0..1 over the half), v = radial position pupil (0) -> root (1).
export function irisUV(g, pupilR) {
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y);
    uv.setXY(i, Math.atan2(y, x) / Math.PI * 3, (r - pupilR) / (EYE.irisRootR - pupilR));
  }
  uv.needsUpdate = true;
}

// Per-vertex retina colour: warm orange-pink, yellow macula and a slightly darker fovea at the posterior pole.
export function retinaColors(g) {
  const p = g.attributes.position, col = new Float32Array(p.count * 3);
  const base = new THREE.Color(M.retina), mac = new THREE.Color('#D9A24E'), fov = new THREE.Color('#B5653F'), tmp = new THREE.Color();
  const pole = new THREE.Vector3(0, 0, EYE.cz - EYE.Ri);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const d = v.distanceTo(pole);
    tmp.copy(base).lerp(mac, 0.75 * Math.exp(-((d / 2.2) ** 2))).lerp(fov, 0.55 * Math.exp(-((d / 0.5) ** 2)));
    tmp.multiplyScalar(1 - 0.22 * Math.min(1, d / 16)); // gently darker towards the ora for depth
    col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
}

// ---------------------------------------------------------------------------------------------
// Section painter: a canvas mapped onto the y = 0 cut plane. Canvas left = anterior (+z), top = +x.
export function makeSection(bounds, ppm) {
  const { x0, x1, z0, z1 } = bounds;
  const W = Math.round((z1 - z0) * ppm), H = Math.round((x1 - x0) * ppm);
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const P = ([x, z]) => [(z1 - z) * ppm, (x1 - x) * ppm];
  const px = INK_PX * SS; // ink width in canvas px (canvas ppm is chosen to equal the render ppm)
  const path = (poly, closed = true) => {
    const p = new Path2D();
    poly.forEach((pt, i) => { const [a, b] = P(pt); if (i) p.lineTo(a, b); else p.moveTo(a, b); });
    if (closed) p.closePath();
    return p;
  };
  const k = {
    canvas, ctx, ppm, P, path, bounds, ink: px,
    mm: (v) => v * ppm,
    fill(poly, style) { ctx.fillStyle = style; ctx.fill(path(poly)); },
    shade(poly, color, widthPx = 16, blurPx = 10) {
      ctx.save(); ctx.clip(path(poly)); ctx.filter = `blur(${blurPx * SS}px)`;
      ctx.lineWidth = 2 * widthPx * SS; ctx.strokeStyle = color; ctx.lineJoin = 'round'; ctx.stroke(path(poly)); ctx.restore();
    },
    stroke(poly, color = C.ink, widthPx = INK_PX, closed = true, dash = null) {
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = widthPx * SS; ctx.strokeStyle = color; if (dash) ctx.setLineDash(dash.map((d) => d * SS));
      ctx.stroke(path(poly, closed)); ctx.restore();
    },
    clipTo(poly, fn) { ctx.save(); ctx.clip(path(poly)); fn(); ctx.restore(); }
  };
  return k;
}

// Plane mesh carrying the painted section (both halves of the cut face).
export function sectionPlane(k) {
  const { x0, x1, z0, z1 } = k.bounds;
  const g = new THREE.BufferGeometry();
  const y = -0.003;
  g.setAttribute('position', new THREE.Float32BufferAttribute([x0, y, z1, x0, y, z0, x1, y, z0, x1, y, z1], 3));
  // canvas: u = (z1 - z) / (z1 - z0), v = (x - x0) / (x1 - x0) (flipY puts canvas top at v = 1)
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  const tex = new THREE.CanvasTexture(k.canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16; tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, side: THREE.DoubleSide, premultipliedAlpha: false });
  const mesh = new THREE.Mesh(g, mat);
  mesh.renderOrder = 10;
  return mesh;
}

// Offset a polyline (x, z) by a distance along its left normal.
export function offsetLine(pts, d) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1;
    return [p[0] - (tz / l) * d, p[1] + (tx / l) * d];
  });
}

// ---------------------------------------------------------------------------------------------
// Wedge cut-aways. The removed wedge spans polar angle phi0 -> phi1 (counter-clockwise, < 180 deg) around
// the optical (Z) axis. Materials use clipIntersection, so only the region behind BOTH planes is discarded.
export function wedgePlanes(phi0, phi1) {
  return [
    new THREE.Plane(new THREE.Vector3(Math.sin(phi0), -Math.cos(phi0), 0), 0),
    new THREE.Plane(new THREE.Vector3(-Math.sin(phi1), Math.cos(phi1), 0), 0)
  ];
}
export function clipAll(obj, planes) {
  obj.traverse((o) => {
    if (!o.material) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) { m.clippingPlanes = planes; m.clipIntersection = true; }
  });
  return obj;
}

// Half-plane quad at polar angle phi carrying a painted section (canvas x = radius r >= 0, so build the
// section with bounds.x0 = 0). `tone` darkens the unlit painting to suggest the face's orientation.
export function capPlane(k, phi, { tone = 1 } = {}) {
  const { x0, x1, z0, z1 } = k.bounds;
  const c = Math.cos(phi), s = Math.sin(phi);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([
    x0 * c, x0 * s, z1, x0 * c, x0 * s, z0, x1 * c, x1 * s, z0, x1 * c, x1 * s, z1
  ], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  const tex = new THREE.CanvasTexture(k.canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const mat = new THREE.MeshBasicMaterial({
    map: tex, color: new THREE.Color(tone, tone, tone), transparent: true, toneMapped: false, depthWrite: false,
    side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.renderOrder = 10;
  return mesh;
}

// Generic planar painted quad: corners in 3D (a = canvas top-left, b = top-right, d = bottom-left).
export function paintedQuad(canvas, a, b, d, { tone = 1, order = 10, depthWrite = false } = {}) {
  const c = [b[0] + d[0] - a[0], b[1] + d[1] - a[1], b[2] + d[2] - a[2]];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
  g.setIndex([0, 3, 2, 0, 2, 1]);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const mat = new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(tone, tone, tone), transparent: true, toneMapped: false, depthWrite, side: THREE.DoubleSide });
  const m = new THREE.Mesh(g, mat); m.renderOrder = order;
  return m;
}

// Per-vertex colours from a function of the vertex position.
export function colorize(g, fn) {
  const p = g.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    fn(p.getX(i), p.getY(i), p.getZ(i), c);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

// Normal map (tangent space) from a height function h(u, v) over [0, 1]^2, painted on a canvas.
export function normalMapFrom(h, N = 1024, strength = 4) {
  const c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'), img = g.createImageData(N, N), d = img.data, e = 1 / N;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const u = (i + 0.5) / N, v = 1 - (j + 0.5) / N;
    const dx = (h(u + e, v) - h(u - e, v)) * strength, dy = (h(u, v + e) - h(u, v - e)) * strength;
    const l = Math.hypot(dx, dy, 1), k = (j * N + i) * 4;
    d[k] = (-dx / l * 0.5 + 0.5) * 255; d[k + 1] = (-dy / l * 0.5 + 0.5) * 255; d[k + 2] = (1 / l * 0.5 + 0.5) * 255; d[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 8;
  return t;
}

// Soft radial sprite (glows, drug bolus, beam hits).
export function glowSprite(pos, size, rgb = [140, 123, 224], alpha = 0.8, { order = 22, depthTest = true } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  const [r, gg, b] = rgb;
  gr.addColorStop(0, `rgba(${r},${gg},${b},${alpha})`); gr.addColorStop(0.3, `rgba(${r},${gg},${b},${alpha * 0.45})`);
  gr.addColorStop(0.65, `rgba(${r},${gg},${b},${alpha * 0.12})`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest, toneMapped: false }));
  s.scale.set(size, size, 1); s.position.set(...pos); s.renderOrder = order;
  return s;
}
