// Reusable atlas compositions built on the shared globe (globe.js): the sagittal close-up, the quadrant cut-away and
// helpers that turn cut-face (r, z) coordinates into 3D anchor points.
import * as THREE from 'three';
import { buildGlobe } from '../globe.js';
import { EYE } from '../anatomy.js';
import { SS } from '../style.js';
import { dirFrom, DEG } from './cameras.js';

// Painted-canvas resolution that matches the render: canvas px per mm = render px per mm at the camera target.
export const ppmFor = (ctx, visH, k = 1.1) => Math.round((SS * ctx.H / visH) * k);

// A point on the meridional cut face at polar angle phi (radians around Z), radius r from the axis, depth z.
export const onFace = (phi, r, z) => [r * Math.cos(phi), r * Math.sin(phi), z];
// A point on the y = 0 face of a half cut (x is "up" in eye coordinates).
export const onHalf = (x, z, y = 0) => [x, y, z];

// Sagittal close-up: the eye halved along y = 0 (y >= 0 kept), the camera on the cut side, anterior to the LEFT and
// superior up. `focus` is [x, z] on the face; `tilt` swings the camera towards the anterior (+) side.
export function sagittal(ctx, o) {
  const { focus, H, tilt = 16, lift = 8, fov = 12, globe = {}, caps = {}, extra } = o;
  const cam = ctx.camera({ target: [focus[0], 0, focus[1]], dir: dirFrom(90 - tilt, -90 + lift), up: [1, 0, 0], H, fov });
  const scene = ctx.scene(cam);
  const eye = buildGlobe(ctx.mats, { fundusTint: '#6E5652', ...globe, cut: { mode: 'half', keep: '+y', ...(globe.cut || {}) } });
  scene.add(eye.group, ...eye.caps({ r1: 11.8, z1: 4.4, ppm: ppmFor(ctx, H), tones: [1, 1, 0.94], ...caps }));
  if (extra) extra(scene, eye, cam);
  return { passes: [{ scene, camera: cam, fade: px(ctx, o.fade) }], eye, cam };
}

// Quadrant (or any wedge) cut-away of the globe seen 3/4. The wedge [phi0, phi1] is removed (optionally only in front
// of zc); the camera looks into the notch from polar angle `polar` (from the anterior axis) at azimuth `az`.
export function quadrant(ctx, o) {
  const { phi0 = 0, phi1 = 90, zc = null, polar = 55, az = 45, up = [0, 0, 1], target = [0, 0, EYE.cz + 2], H = 30, fov = 18, shift = [0, 0], globe = {}, caps = {}, extra } = o;
  const cam = ctx.camera({ target, dir: dirFrom(polar, az), up, H, fov, shift });
  const scene = ctx.scene(cam);
  const cut = { mode: 'wedge', phi0: phi0 * DEG, phi1: phi1 * DEG, ...(zc != null ? { zc } : {}), ...(globe.cut || {}) };
  const eye = buildGlobe(ctx.mats, { fundusTint: '#6E5652', ...globe, cut });
  scene.add(eye.group, ...eye.caps({ r1: 12.4, z1: 4.4, ppm: ppmFor(ctx, H, 1.2), floorPpm: ppmFor(ctx, H, 1.0), tones: [0.94, 1, 0.92], ...caps }));
  if (extra) extra(scene, eye, cam);
  return { passes: [{ scene, camera: cam, fade: px(ctx, o.fade) }], eye, cam };
}

// Fade given as fractions of the frame -> output px (null = no fade).
const px = (ctx, f) => (f ? { cx: f.cx * ctx.W, cy: f.cy * ctx.H, rx: f.rx * ctx.W, ry: f.ry * ctx.H, inner: f.inner } : null);

// Half (or wedge) cut-away seen from any direction: the generic atlas cut-away with an explicit camera.
export function cutaway(ctx, o) {
  const { cut = { mode: 'half', zc: -4.0, floorAlpha: 0.6 }, dir, up = [0, 1, 0], target, H, fov = 16, shift = [0, 0], globe = {}, caps = {}, extra } = o;
  const cam = ctx.camera({ target, dir, up, H, fov, shift });
  const scene = ctx.scene(cam);
  const eye = buildGlobe(ctx.mats, { fundusTint: '#6E5652', ...globe, cut });
  scene.add(eye.group, ...eye.caps({ r1: 11.8, z1: 4.4, ppm: ppmFor(ctx, H, 1.1), floorPpm: ppmFor(ctx, H, 0.8), tones: [1, 1, 0.93], ...caps }));
  if (extra) extra(scene, eye, cam);
  return { passes: [{ scene, camera: cam, fade: px(ctx, o.fade) }], eye, cam };
}

// Soft contact shadow under a free-standing subject (drawn in 2D under the render, alpha-only so it sits on any surface).
export function groundShadow(ctx, cam, p, rx, squash = 0.13, a = 0.2) {
  return (g) => {
    const [cx, cy] = ctx.project(cam, p);
    g.translate(cx, cy); g.scale(1, squash);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, `rgba(60,50,42,${a})`); gr.addColorStop(0.5, `rgba(60,50,42,${a * 0.45})`); gr.addColorStop(1, 'rgba(60,50,42,0)');
    g.fillStyle = gr; g.fillRect(-rx, -rx, 2 * rx, 2 * rx);
  };
}

export { THREE, EYE, DEG, dirFrom };
