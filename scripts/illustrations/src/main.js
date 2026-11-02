// Render page: builds a procedure scene, renders it (2x supersampled), composites it onto the light and
// dark backgrounds and exposes WebP data URLs to the Playwright driver (scripts/illustrations/render.mjs).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SCENES, SLUGS } from './scenes.js';
import { materials, makeSection } from './kit.js';
import { OUT_W, OUT_H, SS, CAMERA, BG } from './style.js';

const RW = OUT_W * SS, RH = OUT_H * SS;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
renderer.setPixelRatio(1);
renderer.setSize(RW, RH, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const yaw = CAMERA.yawDeg * Math.PI / 180, pitch = CAMERA.pitchDeg * Math.PI / 180;
const VIEW_DIR = new THREE.Vector3(Math.sin(pitch), -Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw)).normalize();

function makeCamera(frame) {
  const cam = new THREE.PerspectiveCamera(CAMERA.fov, OUT_W / OUT_H, 1, 2000);
  const dist = (frame.H / 2) / Math.tan((CAMERA.fov / 2) * Math.PI / 180);
  const target = new THREE.Vector3(frame.target[0], 0, frame.target[1]);
  cam.position.copy(target).addScaledVector(VIEW_DIR, dist);
  cam.up.set(1, 0, 0);
  cam.lookAt(target);
  cam.updateMatrixWorld();
  return cam;
}

function lights(scene) {
  scene.add(new THREE.HemisphereLight(0xfffaf2, 0xb8b2aa, 1.25));
  const key = new THREE.DirectionalLight(0xfff6ea, 2.0); key.position.set(9, -12, 10); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6eef5, 0.55); fill.position.set(-8, -6, -6); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(5, 10, -8); scene.add(rim);
}

function ctxFor() {
  const mats = materials(envMap);
  return {
    mats,
    scene() { const s = new THREE.Scene(); lights(s); return s; },
    section(frame) {
      const hx = (frame.H / 2) * 1.3, hz = (frame.H * (OUT_W / OUT_H) / 2) * 1.3;
      const ppm = Math.min(RH / frame.H, 4096 / (2 * hx), 4096 / (2 * hz));
      const [tx, tz] = frame.target;
      return makeSection({ x0: tx - hx, x1: tx + hx, z0: tz - hz, z1: tz + hz }, ppm);
    }
  };
}

function canvas2d(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }

function grab() {
  const [c, g] = canvas2d(OUT_W, OUT_H);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(renderer.domElement, 0, 0, OUT_W, OUT_H);
  return c;
}

function project(cam, x, z) {
  const v = new THREE.Vector3(x, 0, z).project(cam);
  return [(v.x * 0.5 + 0.5) * OUT_W, (-v.y * 0.5 + 0.5) * OUT_H];
}

function applyFade(layer, cam, fade) {
  const g = layer.getContext('2d');
  const [cx, cy] = project(cam, fade.center[0], fade.center[1]);
  const [px] = project(cam, fade.center[0], fade.center[1] - fade.rz);
  const [, py] = project(cam, fade.center[0] + fade.rx, fade.center[1]);
  const rxp = Math.abs(px - cx), ryp = Math.abs(cy - py);
  g.save();
  g.globalCompositeOperation = 'destination-in';
  g.translate(cx, cy); g.scale(1, ryp / rxp);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, rxp);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(fade.inner, 'rgba(0,0,0,1)');
  gr.addColorStop(fade.inner + (1 - fade.inner) * 0.5, 'rgba(0,0,0,0.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(-OUT_W * 4, -OUT_H * 4, OUT_W * 8, OUT_H * 8);
  g.restore();
}

function background(g, theme) {
  const b = BG[theme];
  const gr = g.createRadialGradient(OUT_W * 0.45, OUT_H * 0.45, 0, OUT_W * 0.5, OUT_H * 0.5, OUT_W * 0.75);
  gr.addColorStop(0, b.inner); gr.addColorStop(1, b.outer);
  g.fillStyle = gr; g.fillRect(0, 0, OUT_W, OUT_H);
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

const outputs = {};

window.SLUGS = SLUGS;
window.renderSlug = (slug) => {
  const ctx = ctxFor();
  const def = SCENES[slug](ctx);
  const cam = makeCamera(def.frame);

  renderer.render(def.scene, cam);
  const full = grab();
  applyFade(full, cam, def.fade);

  // instruments are drawn again without the edge fade so they enter the frame crisply
  const hidden = [];
  def.scene.traverse((o) => { if ((o.isMesh || o.isLine || o.isSprite) && !isInstrument(o) && o.visible) { hidden.push(o); o.visible = false; } });
  renderer.render(def.scene, cam);
  const inst = grab();
  hidden.forEach((o) => { o.visible = true; });

  let insetLayer = null;
  if (def.inset) {
    const [w, h] = [def.inset.rect[2], def.inset.rect[3]];
    const width = def.inset.width, height = width * (RH / RW);
    const oc = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 200);
    oc.position.set(0, 0, 60); oc.up.set(1, 0, 0); oc.lookAt(0, 0, 0);
    renderer.render(def.inset.scene, oc);
    const [c, g] = canvas2d(w, h); g.imageSmoothingQuality = 'high';
    g.drawImage(renderer.domElement, 0, 0, w, h);
    insetLayer = c;
  }

  for (const theme of ['light', 'dark']) {
    const [c, g] = canvas2d(OUT_W, OUT_H);
    background(g, theme);
    g.drawImage(full, 0, 0);
    g.drawImage(inst, 0, 0);
    if (insetLayer) {
      const [x, y, w, h] = def.inset.rect;
      roundRect(g, x, y, w, h, 18);
      g.fillStyle = theme === 'light' ? 'rgba(255,255,255,0.72)' : 'rgba(40,44,50,0.82)'; g.fill();
      g.lineWidth = 1.5; g.strokeStyle = theme === 'light' ? 'rgba(80,60,50,0.16)' : 'rgba(255,255,255,0.12)'; g.stroke();
      g.beginPath(); g.moveTo(x + w / 2, y + 26); g.lineTo(x + w / 2, y + h - 26);
      g.strokeStyle = theme === 'light' ? 'rgba(80,60,50,0.12)' : 'rgba(255,255,255,0.10)'; g.stroke();
      g.drawImage(insetLayer, x, y);
    }
    const [s, sg] = canvas2d(OUT_W / 2, OUT_H / 2); sg.imageSmoothingQuality = 'high';
    sg.drawImage(c, 0, 0, OUT_W / 2, OUT_H / 2);
    outputs[theme] = c; outputs[theme + '-800'] = s;
  }
  // free GPU memory
  for (const sc of [def.scene, def.inset?.scene].filter(Boolean)) sc.traverse((o) => { o.geometry?.dispose?.(); if (o.material) { o.material.map?.dispose?.(); o.material.dispose?.(); } });
  return true;
};
window.encode = (name, q, type = 'image/webp') => outputs[name].toDataURL(type, q);

function isInstrument(o) {
  for (let p = o; p; p = p.parent) if (p.userData.instrument) return true;
  return false;
}
window.READY = true;
