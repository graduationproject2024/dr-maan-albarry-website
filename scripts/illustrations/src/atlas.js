// Atlas render page: renders one "anatomical atlas" shot (scripts/illustrations/src/atlas/shots.js) at its master size,
// composes a transparent (alpha) master and a neutral-background master, projects the shot's 3D label anchors into
// the frame, and hands WebP / JPEG data URLs at any width to the Playwright driver (scripts/illustrations/atlas.mjs).
//
// It shares the scene modules, materials, palette and the camera-space light rig with the legacy renderer (main.js);
// only the frame size, the per-shot camera and the resolution controls (style.js RES) differ.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { materials } from './kit.js';
import { SS, BG, LIGHT_RIG, RES } from './style.js';
import { SHOTS } from './atlas/shots.js';
import { CAMERAS } from './atlas/cameras.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);
const pmrem = new THREE.PMREMGenerator(renderer);
const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const v3 = (a) => new THREE.Vector3(...a);

function cameraFactory(W, H, shot) {
  return (params) => {
    const over = typeof shot.cam === 'function' ? shot.cam(params) : (shot.cam || {});
    const { target, dir, up = [0, 1, 0], H: vis, fov = 18, ortho = false, shift = [0, 0] } = { ...params, ...over };
    const aspect = W / H;
    const t = v3(target), d = v3(dir).normalize();
    let cam;
    if (ortho) {
      cam = new THREE.OrthographicCamera(-vis * aspect / 2, vis * aspect / 2, vis / 2, -vis / 2, 0.1, 4000);
      cam.position.copy(t).addScaledVector(d, 400);
    } else {
      cam = new THREE.PerspectiveCamera(fov, aspect, 1, 4000);
      cam.position.copy(t).addScaledVector(d, (vis / 2) / Math.tan((fov / 2) * Math.PI / 180));
    }
    cam.up.copy(v3(up)); cam.lookAt(t); cam.updateMatrixWorld();
    if (shift[0] || shift[1]) {
      const r = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), u = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
      const off = r.multiplyScalar(shift[0]).add(u.multiplyScalar(shift[1]));
      cam.position.add(off); t.add(off); cam.updateMatrixWorld();
    }
    cam.near = ortho ? 0.1 : Math.max(1, cam.position.distanceTo(t) - 60);
    cam.updateProjectionMatrix();
    cam.userData.target = t;
    cam.userData.spec = { target: [...target], dir: [...dir], up: [...up], visibleHeightMm: vis, fov: ortho ? null : fov, ortho, shift: [...shift] };
    return cam;
  };
}

// The series light rig, in camera space (identical to main.js).
function lightScene(cam) {
  const s = new THREE.Scene();
  const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  const back = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 2);
  const t = cam.userData.target;
  const at = (v) => t.clone().addScaledVector(right, v[0] * 50).addScaledVector(up, v[1] * 50).addScaledVector(back, v[2] * 50);
  const hemi = new THREE.HemisphereLight(LIGHT_RIG.hemi.sky, LIGHT_RIG.hemi.ground, LIGHT_RIG.hemi.i);
  hemi.position.copy(up); s.add(hemi);
  for (const L of LIGHT_RIG.dirs) {
    const l = new THREE.DirectionalLight(L.color, L.i);
    l.position.copy(at(L.v)); l.target.position.copy(t);
    s.add(l, l.target);
  }
  return s;
}

function canvas2d(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }

function renderPass(p, W, H) {
  const rect = p.rect || [0, 0, W, H];
  renderer.setSize(Math.round(rect[2] * SS), Math.round(rect[3] * SS), false);
  if (p.globalPlanes) renderer.clippingPlanes = p.globalPlanes;
  renderer.render(p.scene, p.camera);
  renderer.clippingPlanes = [];
  const [c, g] = canvas2d(W, H);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(renderer.domElement, rect[0], rect[1], rect[2], rect[3]);
  if (p.mask) {
    const [m, mg] = canvas2d(W, H);
    p.mask(mg);
    g.save(); g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0); g.restore();
  }
  return c;
}

// Soft elliptical edge fade. The transparent master uses a narrower feather than the neutral one: a wide fade of
// bright tissue into alpha reads as a glowing halo on dark surfaces (the weak spot of the previous dark images).
function faded(layer, f, W, H, tight) {
  const [c, g] = canvas2d(W, H);
  g.drawImage(layer, 0, 0);
  if (!f) return c;
  const inner = f.inner, span = 1 - inner;
  {
    g.save(); g.globalCompositeOperation = 'destination-in';
    g.translate(f.cx, f.cy); g.scale(1, f.ry / f.rx);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, f.rx);
    gr.addColorStop(0, 'rgba(0,0,0,1)');
    if (tight) { // same ellipse, but the falloff is compressed into a short band (no long translucent rim)
      gr.addColorStop(inner + span * 0.12, 'rgba(0,0,0,1)'); gr.addColorStop(inner + span * 0.32, 'rgba(0,0,0,0.62)');
      gr.addColorStop(inner + span * 0.5, 'rgba(0,0,0,0.16)'); gr.addColorStop(inner + span * 0.62, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    } else {
      gr.addColorStop(inner, 'rgba(0,0,0,1)'); gr.addColorStop(inner + span * 0.55, 'rgba(0,0,0,0.42)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    }
    g.fillStyle = gr; g.fillRect(-W * 4, -H * 4, W * 8, H * 8);
    g.restore();
  }
  return c;
}

// Neutral background: the series' warm off-white, as a very soft radial gradient (no vignette, no texture).
function neutral(g, W, H) {
  const b = BG.light;
  const gr = g.createRadialGradient(W * 0.48, H * 0.44, 0, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.6);
  gr.addColorStop(0, b.inner); gr.addColorStop(1, b.outer);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

const state = { masters: {}, cache: {}, W: 0, H: 0 };
window.SHOTS = SHOTS.map((s) => ({ id: s.id, slug: s.slug, level: s.level, W: s.W, H: s.H, sizes: s.sizes, camera: s.camera }));
window.CAMERAS = CAMERAS;

window.renderShot = (id) => {
  const shot = SHOTS.find((s) => s.id === id);
  const { W, H } = shot;
  RES.ink = Math.sqrt((W * H) / (1600 * 1000)) * (shot.ink ?? 1);
  RES.ppm = shot.ppm ?? 1;
  RES.tex = shot.tex ?? 1;
  const mats = materials(envMap);
  const ctx = {
    mats, envMap, THREE, W, H, opts: shot.opts || {}, atlas: true,
    camera: cameraFactory(W, H, shot),
    scene: lightScene,
    project: (cam, p, rect = [0, 0, W, H]) => { const v = v3(p).project(cam); return [rect[0] + (v.x * 0.5 + 0.5) * rect[2], rect[1] + (-v.y * 0.5 + 0.5) * rect[3]]; },
    fade: (def) => (shot.fade === undefined ? def : shot.fade && { cx: shot.fade.cx * W, cy: shot.fade.cy * H, rx: shot.fade.rx * W, ry: shot.fade.ry * H, inner: shot.fade.inner })
  };
  const def = shot.build(ctx);
  for (const p of def.passes) if (p.fade !== undefined) p.fade = ctx.fade(p.fade);
  const layers = def.passes.map((p) => renderPass(p, W, H));
  const masters = {};
  for (const bg of ['alpha', 'neutral']) {
    const [c, g] = canvas2d(W, H);
    if (bg === 'neutral') neutral(g, W, H);
    if (def.under) { g.save(); def.under(g, 'light'); g.restore(); }
    layers.forEach((l, i) => {
      const p = def.passes[i];
      if (p.before) { g.save(); p.before(g, 'light'); g.restore(); }
      g.drawImage(faded(l, p.fade, W, H, bg === 'alpha'), 0, 0);
    });
    if (def.over) { g.save(); def.over(g, 'light'); g.restore(); }
    masters[bg] = c;
  }
  // label anchors: 3D points projected through the pass camera, normalised to the frame
  const anchors = (shot.anchors || []).map((a) => {
    const p = def.passes[a.pass || 0];
    const [x, y] = ctx.project(p.camera, typeof a.p === 'string' ? def.points[a.p] : a.p, p.rect);
    return { id: a.id, structure: a.structure || a.id, x: +(x / W).toFixed(4), y: +(y / H).toFixed(4) };
  }).filter((a) => { const ok = a.x > 0.02 && a.x < 0.98 && a.y > 0.02 && a.y < 0.98; if (!ok) console.warn(`anchor ${a.id} outside the frame of ${id}`); return ok; });
  const cam = def.passes[0].camera.userData.spec;
  for (const p of def.passes) p.scene.traverse((o) => { o.geometry?.dispose?.(); if (o.material) { for (const m of [].concat(o.material)) { m.map?.dispose?.(); m.dispose?.(); } } });
  state.masters = masters; state.cache = {}; state.W = W; state.H = H;
  const alphaCoverage = coverage(masters.alpha);
  return { anchors, camera: cam, coverage: alphaCoverage };
};

// Fraction of the frame the subject covers (alpha > 0.5), a framing check.
function coverage(c) {
  const [s, g] = canvas2d(200, Math.round(200 * c.height / c.width));
  g.drawImage(c, 0, 0, s.width, s.height);
  const d = g.getImageData(0, 0, s.width, s.height).data;
  let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 127) n++;
  return +(n / (s.width * s.height)).toFixed(3);
}

// Downsample by repeated halving (then one final high-quality step) for clean small sizes.
function sized(bg, w) {
  const key = `${bg}-${w}`;
  if (state.cache[key]) return state.cache[key];
  let src = state.masters[bg];
  const h = Math.round(w * state.H / state.W);
  while (src.width / 2 >= w * 1.0001 && src.width / 2 > w) {
    const [c, g] = canvas2d(Math.round(src.width / 2), Math.round(src.height / 2));
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height); src = c;
  }
  if (src.width !== w) {
    const [c, g] = canvas2d(w, h);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, w, h); src = c;
  }
  state.cache[key] = src;
  return src;
}
// WebP keeps the alpha plane lossless, so soft fades and shadows cost far more than the colour. The alpha is
// quantised to `aq` levels per step (4 = 64 levels, invisible on soft edges) and near-zero alpha is cleared.
window.encode = (bg, w, type, q, blur = 0, aq = 4) => {
  const src = sized(bg, w);
  if (!blur && (bg !== 'alpha' || !aq)) return src.toDataURL(type, q);
  const [c, g] = canvas2d(src.width, src.height);
  if (blur) g.filter = `blur(${blur}px)`; // last resort for the size budget: soften sub-pixel texture
  g.drawImage(src, 0, 0);
  if (bg === 'alpha' && aq) {
    const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
    for (let i = 3; i < d.length; i += 4) {
      const a = d[i];
      if (a < 3) { d[i] = 0; d[i - 1] = d[i - 2] = d[i - 3] = 0; } else if (a < 255) d[i] = Math.min(255, Math.round(a / aq) * aq);
    }
    g.putImageData(img, 0, 0);
  }
  return c.toDataURL(type, q);
};

// QA overlay (evidence only, never shipped): anchors drawn over the neutral image.
window.debugAnchors = (anchors, w) => {
  const src = sized('neutral', w);
  const [c, g] = canvas2d(src.width, src.height);
  g.drawImage(src, 0, 0);
  g.font = `600 ${Math.round(w / 70)}px system-ui`; g.lineWidth = 3;
  for (const a of anchors) {
    const x = a.x * c.width, y = a.y * c.height;
    g.fillStyle = '#E0157A'; g.strokeStyle = '#fff';
    g.beginPath(); g.arc(x, y, w / 220, 0, Math.PI * 2); g.fill(); g.stroke();
    g.strokeText(a.id, x + w / 150, y - w / 200); g.fillStyle = '#7A0B45'; g.fillText(a.id, x + w / 150, y - w / 200);
  }
  return c.toDataURL('image/jpeg', 0.86);
};
window.READY = true;
