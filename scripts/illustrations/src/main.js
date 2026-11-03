// Render page: builds a procedure composition, renders its 3D passes (2x supersampled), composites them on the
// light and dark backgrounds with any 2D overlays, and exposes WebP data URLs to the Playwright driver
// (scripts/illustrations/render.mjs).
//
// A composition is { passes: [{ scene, camera, rect?, mask?, fade? }], under?(g, theme), over?(g, theme) }.
//   pass.rect  [x, y, w, h] in output px (default: full frame)
//   pass.mask  (g) => void, draws an alpha mask in output px; the pass keeps only what the mask covers
//   pass.fade  { cx, cy, rx, ry, inner } soft elliptical edge fade in output px
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SCENES, SLUGS } from './scenes/index.js';
import { materials } from './kit.js';
import { OUT_W, OUT_H, SS, BG, LIGHT_RIG } from './style.js';

const RW = OUT_W * SS, RH = OUT_H * SS;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
renderer.setPixelRatio(1);
renderer.setSize(RW, RH, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const v3 = (a) => new THREE.Vector3(...a);

// Camera from a target, a direction towards the camera, an up vector and the visible height (mm) at the target.
function makeCamera({ target, dir, up = [0, 1, 0], H, fov = 18, ortho = false, aspect = OUT_W / OUT_H, shift = [0, 0] }) {
  const t = v3(target), d = v3(dir).normalize();
  let cam;
  if (ortho) {
    cam = new THREE.OrthographicCamera(-H * aspect / 2, H * aspect / 2, H / 2, -H / 2, 0.1, 4000);
    cam.position.copy(t).addScaledVector(d, 400);
  } else {
    cam = new THREE.PerspectiveCamera(fov, aspect, 1, 4000);
    cam.position.copy(t).addScaledVector(d, (H / 2) / Math.tan((fov / 2) * Math.PI / 180));
  }
  cam.up.copy(v3(up));
  cam.lookAt(t);
  cam.updateMatrixWorld();
  if (shift[0] || shift[1]) { // slide the frame (mm, screen right/up) so the subject sits off-centre
    const r = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), u = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    const off = r.multiplyScalar(shift[0]).add(u.multiplyScalar(shift[1]));
    cam.position.add(off); t.add(off); cam.updateMatrixWorld();
  }
  cam.updateProjectionMatrix();
  cam.userData.target = t;
  return cam;
}

// One light rig for the whole series, defined in CAMERA space so every composition is lit from the same
// screen direction (key from the upper left, cool fill from the right, rim from behind).
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

function project(cam, p, rect = [0, 0, OUT_W, OUT_H]) {
  const v = v3(p).project(cam);
  return [rect[0] + (v.x * 0.5 + 0.5) * rect[2], rect[1] + (-v.y * 0.5 + 0.5) * rect[3]];
}

function renderPass(p) {
  const rect = p.rect || [0, 0, OUT_W, OUT_H];
  const [w, h] = [rect[2], rect[3]];
  renderer.setSize(w * SS, h * SS, false);
  renderer.render(p.scene, p.camera);
  const [c, g] = canvas2d(OUT_W, OUT_H);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(renderer.domElement, rect[0], rect[1], w, h);
  if (p.fade) {
    const f = p.fade;
    g.save(); g.globalCompositeOperation = 'destination-in';
    g.translate(f.cx, f.cy); g.scale(1, f.ry / f.rx);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, f.rx);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(f.inner, 'rgba(0,0,0,1)');
    gr.addColorStop(f.inner + (1 - f.inner) * 0.55, 'rgba(0,0,0,0.42)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(-OUT_W * 4, -OUT_H * 4, OUT_W * 8, OUT_H * 8);
    g.restore();
  }
  if (p.mask) {
    const [m, mg] = canvas2d(OUT_W, OUT_H);
    p.mask(mg);
    g.save(); g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0); g.restore();
  }
  renderer.setSize(RW, RH, false);
  return c;
}

function background(g, theme) {
  const b = BG[theme];
  const gr = g.createRadialGradient(OUT_W * 0.46, OUT_H * 0.42, 0, OUT_W * 0.5, OUT_H * 0.5, OUT_W * 0.78);
  gr.addColorStop(0, b.inner); gr.addColorStop(1, b.outer);
  g.fillStyle = gr; g.fillRect(0, 0, OUT_W, OUT_H);
}

// On the dark background a faded-out bright tissue edge reads as a glowing halo. Tone the fading margin towards
// the background colour so the subject sinks into the dark instead.
function sinkEdges(layer, f) {
  const [c, g] = canvas2d(OUT_W, OUT_H);
  g.drawImage(layer, 0, 0);
  g.globalCompositeOperation = 'source-atop';
  g.translate(f.cx, f.cy); g.scale(1, f.ry / f.rx);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, f.rx);
  const t = Math.max(0, f.inner - 0.22);
  gr.addColorStop(0, 'rgba(22,24,28,0)'); gr.addColorStop(t, 'rgba(22,24,28,0)');
  gr.addColorStop(f.inner, 'rgba(22,24,28,0.4)'); gr.addColorStop(f.inner + (1 - f.inner) * 0.4, 'rgba(22,24,28,0.8)'); gr.addColorStop(1, 'rgba(22,24,28,0.96)');
  g.fillStyle = gr; g.fillRect(-OUT_W * 4, -OUT_H * 4, OUT_W * 8, OUT_H * 8);
  return c;
}

const outputs = {};
window.SLUGS = SLUGS;
window.renderSlug = (slug) => {
  const mats = materials(envMap);
  const ctx = {
    mats, envMap, THREE,
    camera: makeCamera,
    scene: lightScene,
    project,
    W: OUT_W, H: OUT_H
  };
  const def = SCENES[slug](ctx);
  const layers = def.passes.map(renderPass);
  for (const theme of ['light', 'dark']) {
    const [c, g] = canvas2d(OUT_W, OUT_H);
    background(g, theme);
    if (def.under) { g.save(); def.under(g, theme); g.restore(); }
    layers.forEach((l, i) => {
      const p = def.passes[i];
      if (p.before) { g.save(); p.before(g, theme); g.restore(); }
      g.drawImage(theme === 'dark' && p.fade ? sinkEdges(l, p.fade) : l, 0, 0);
    });
    if (def.over) { g.save(); def.over(g, theme); g.restore(); }
    const [s, sg] = canvas2d(OUT_W / 2, OUT_H / 2); sg.imageSmoothingQuality = 'high';
    sg.drawImage(c, 0, 0, OUT_W / 2, OUT_H / 2);
    outputs[theme] = c; outputs[theme + '-800'] = s;
  }
  for (const p of def.passes) p.scene.traverse((o) => { o.geometry?.dispose?.(); if (o.material) { o.material.map?.dispose?.(); o.material.dispose?.(); } });
  return true;
};
window.encode = (name, q, type = 'image/webp') => outputs[name].toDataURL(type, q);
window.READY = true;
