// Orbit camera for the procedure simulators: rotate, zoom and camera presets around a target, with eased transitions
// that the visitor can interrupt at any moment (a drag stops a running transition and continues from where it is).
// Input: mouse drag, one-finger drag (horizontal only unless "explore" mode is on, so the page still scrolls),
// two-finger pinch, Ctrl/⌘ + wheel, keyboard (arrows, + / −). Pure camera maths lives in sphericalOf()/positionOf().
import * as THREE from 'three';

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

export function createOrbit(camera, el, { onChange, reducedMotion = () => false, minR = 6, maxR = 80, track }) {
  const state = { target: [0, 0, 0], s: { r: 40, theta: 0, phi: Math.PI / 2 }, tween: null, explore: false };
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
    const to = { target: preset.target.slice(), s: sphericalOf(preset.pos, preset.target) };
    if (instant || reducedMotion()) { state.target = to.target; state.s = to.s; state.tween = null; apply(); return; }
    const from = { target: state.target.slice(), s: { ...state.s } };
    to.s.theta = from.s.theta + wrapPi(to.s.theta - from.s.theta);
    state.tween = { from, to, t: 0, dur: 0.85 };
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
    stopTween();
    state.s.theta += dTheta;
    state.s.phi = Math.max(0.12, Math.min(Math.PI - 0.12, state.s.phi + dPhi));
    apply();
  }
  function zoom(factor) {
    stopTween();
    state.s.r = Math.max(minR, Math.min(maxR, state.s.r * factor));
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
      if (pinch0 > 0) { stopTween(); state.s.r = Math.max(minR, Math.min(maxR, r0 * pinch0 / Math.max(1, d))); apply(); }
      return;
    }
    const k = 2.6 / Math.max(240, el.clientWidth);
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
    goTo, tick, rotate, zoom, apply,
    get moving() { return !!state.tween; },
    get spherical() { return { ...state.s }; },
    get target() { return state.target.slice(); },
    setExplore(on) { state.explore = !!on; },
    dispose() { offs.forEach((off) => off()); pointers.clear(); }
  };
}
