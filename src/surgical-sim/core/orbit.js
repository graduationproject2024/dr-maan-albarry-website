// Orbit camera for the procedure simulators: rotate, zoom and camera presets around a target, with eased transitions
// that the visitor can interrupt at any moment (a drag stops a running transition and continues from where it is).
// Input: mouse drag, one-finger drag (horizontal only unless "explore" mode is on, so the page still scrolls),
// two-finger pinch, Ctrl/⌘ + wheel, keyboard (arrows, + / −). Pure camera maths lives in sphericalOf()/positionOf().
//
// Framing (2026-11 camera pass): a preset may declare `fit` — the half width and half height (mm) of its subject in
// the view plane through the target. The distance is then computed from the canvas size, the field of view and the
// "safe" area left free by the overlaid controls (fitDistance), so the same preset frames the same subject on a
// 1440x900 desktop, a 390x844 phone held upright and an 844x390 phone on its side. The preset position gives the
// viewing direction only. Zoom limits are relative to that fitted distance; the elevation is kept off the poles.
import * as THREE from 'three';

/** Zoom range relative to the preset's fitted distance, and the absolute bounds (mm). */
export const ZOOM = { min: 0.45, max: 2.6, absMin: 1.5, absMax: 140 };
/** Elevation limit (radians from the poles): the camera never flips over the top or bottom of the eye. */
export const PHI_MARGIN = 0.15;

/**
 * Distance (mm) at which a subject of half extents fit = [hw, hh] (or one number) fills the safe area of a view.
 * view: { w, h, safe: { l, r, t, b } } in CSS pixels; fovDeg: vertical field of view.
 */
export function fitDistance(fit, fovDeg, view) {
  const [hw, hh] = Array.isArray(fit) ? fit : [fit, fit];
  const f = (view.h / 2) / Math.tan((fovDeg * Math.PI) / 360);
  const sw = Math.max(60, view.w - view.safe.l - view.safe.r) / 2;
  const sh = Math.max(60, view.h - view.safe.t - view.safe.b) / 2;
  return Math.max((hw * f) / sw, (hh * f) / sh);
}

export function sphericalOf(pos, target) {
  const d = [pos[0] - target[0], pos[1] - target[1], pos[2] - target[2]];
  const r = Math.hypot(d[0], d[1], d[2]) || 1;
  return { r, theta: Math.atan2(d[0], d[2]), phi: Math.acos(Math.max(-1, Math.min(1, d[1] / r))) };
}
export function positionOf(s, target) {
  const sp = Math.sin(s.phi);
  return [target[0] + s.r * sp * Math.sin(s.theta), target[1] + s.r * Math.cos(s.phi), target[2] + s.r * sp * Math.cos(s.theta)];
}
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createOrbit(camera, el, { onChange, reducedMotion = () => false, track, view = null }) {
  const state = { target: [0, 0, 0], s: { r: 40, theta: 0, phi: Math.PI / 2 }, tween: null, explore: false, preset: null, base: 40, userMoved: false };
  const limits = () => ({ minR: Math.max(ZOOM.absMin, state.base * ZOOM.min), maxR: Math.min(ZOOM.absMax, state.base * ZOOM.max) });
  const clampR = (r) => { const l = limits(); return Math.max(l.minR, Math.min(l.maxR, r)); };
  /** The spherical position a preset resolves to in the current view (deterministic: depends only on preset + view). */
  function resolve(preset) {
    const s = sphericalOf(preset.pos, preset.target);
    if (preset.fit && view) { const v = view(); if (v && v.w > 0 && v.h > 0) s.r = fitDistance(preset.fit, camera.fov, v); }
    s.phi = Math.max(PHI_MARGIN, Math.min(Math.PI - PHI_MARGIN, s.phi));
    return s;
  }
  const pointers = new Map();
  let pinch0 = 0, r0 = 0;

  function apply() {
    const p = positionOf(state.s, state.target);
    camera.position.set(p[0], p[1], p[2]);
    camera.up.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(...state.target));
    onChange && onChange();
  }
  function stopTween() { state.tween = null; }

  function goTo(preset, instant = false) {
    const to = { target: preset.target.slice(), s: resolve(preset) };
    state.preset = preset; state.base = to.s.r; state.userMoved = false;
    if (instant || reducedMotion()) { state.target = to.target; state.s = to.s; state.tween = null; apply(); return; }
    const from = { target: state.target.slice(), s: { ...state.s } };
    to.s.theta = from.s.theta + wrapPi(to.s.theta - from.s.theta);
    state.tween = { from, to, t: 0, dur: 0.85 };
  }
  /** After a resize: a camera still on its preset is re-fitted to the new view (a visitor's own view is kept). */
  function refit() {
    if (!state.preset) return;
    const r = resolve(state.preset).r;
    state.base = r; // zoom limits follow the new fit even when the visitor has moved the view
    if (state.userMoved) { state.s.r = clampR(state.s.r); apply(); return; }
    if (state.tween) state.tween.to.s.r = r; else { state.s.r = r; apply(); }
  }
  /** Advance a running transition; returns true while the camera is moving. */
  function tick(dt) {
    const tw = state.tween;
    if (!tw) return false;
    tw.t = Math.min(1, tw.t + dt / tw.dur);
    const k = easeInOut(tw.t);
    state.target = tw.from.target.map((v, i) => v + (tw.to.target[i] - v) * k);
    state.s = {
      r: tw.from.s.r * Math.pow(tw.to.s.r / tw.from.s.r, k),
      theta: tw.from.s.theta + (tw.to.s.theta - tw.from.s.theta) * k,
      phi: tw.from.s.phi + (tw.to.s.phi - tw.from.s.phi) * k
    };
    apply();
    if (tw.t >= 1) state.tween = null;
    return true;
  }
  function rotate(dTheta, dPhi) {
    stopTween(); state.userMoved = true;
    state.s.theta = wrapPi(state.s.theta + dTheta);
    state.s.phi = Math.max(PHI_MARGIN, Math.min(Math.PI - PHI_MARGIN, state.s.phi + dPhi));
    apply();
  }
  function zoom(factor) {
    stopTween(); state.userMoved = true;
    state.s.r = clampR(state.s.r * factor);
    apply();
  }

  const onDown = (e) => {
    if (e.button !== undefined && e.button > 0 && e.pointerType === 'mouse') return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, type: e.pointerType });
    try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); r0 = state.s.r; }
  };
  const onMove = (e) => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch0 > 0) { stopTween(); state.userMoved = true; state.s.r = clampR(r0 * pinch0 / Math.max(1, d)); apply(); }
      return;
    }
    // a drag across the whole viewport turns the model half a turn (on a phone, 140 px ≈ 70°)
    const k = 1 / Math.max(280, el.clientWidth);
    // touch without explore mode: only horizontal turning; vertical movement belongs to the page scroll
    const vertical = p.type !== 'touch' || state.explore;
    rotate(-dx * k * Math.PI, vertical ? -dy * k * Math.PI : 0);
  };
  const onUp = (e) => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch0 = 0; };
  const onWheel = (e) => {
    if (!(e.ctrlKey || e.metaKey)) return; // plain wheel scrolls the page; Ctrl/⌘ (and trackpad pinch) zooms
    e.preventDefault();
    zoom(Math.exp(Math.max(-0.5, Math.min(0.5, e.deltaY * 0.004))));
  };
  const onKey = (e) => {
    const step = 0.12;
    const map = { ArrowLeft: () => rotate(step, 0), ArrowRight: () => rotate(-step, 0), ArrowUp: () => rotate(0, -step), ArrowDown: () => rotate(0, step), '+': () => zoom(0.88), '=': () => zoom(0.88), '-': () => zoom(1.14), _: () => zoom(1.14) };
    const fn = map[e.key];
    if (!fn) return;
    e.preventDefault(); fn();
  };
  const offs = [
    track(el, 'pointerdown', onDown), track(el, 'pointermove', onMove), track(el, 'pointerup', onUp),
    track(el, 'pointercancel', onUp), track(el, 'lostpointercapture', onUp), track(el, 'wheel', onWheel, { passive: false }),
    track(el, 'keydown', onKey)
  ];
  apply();
  return {
    goTo, tick, rotate, zoom, apply, refit, resolve,
    get moving() { return !!state.tween; },
    get limits() { return limits(); },
    get userMoved() { return state.userMoved; },
    get spherical() { return { ...state.s }; },
    get target() { return state.target.slice(); },
    setExplore(on) { state.explore = !!on; },
    dispose() { offs.forEach((off) => off()); pointers.clear(); }
  };
}
