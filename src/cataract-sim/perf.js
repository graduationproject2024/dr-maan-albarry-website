// Frame-rate sampling with adaptive device-pixel-ratio, plus visibility tracking (IntersectionObserver +
// document.visibilitychange) so the render loop does no work when the simulator is off-screen or the tab is hidden.

export function createAdaptiveQuality({ initialDpr, onChange, windowMs = 2000, minFps = 40 }) {
  const levels = [initialDpr, 1, 0.75].filter((v, i, a) => (i === 0 || v < a[0]) && a.indexOf(v) === i);
  let level = 0;
  let frames = 0, start = 0;
  let lastFps = 0;
  // The first window after a (re)start is a warm-up (shader compilation, texture upload) and is ignored, and the
  // quality only steps down after two consecutive slow windows, so one hitch never blurs the view for good.
  let warm = false, slow = 0;
  return {
    get dpr() { return levels[level]; },
    get fps() { return lastFps; },
    get level() { return level; },
    reset() { frames = 0; start = 0; warm = false; slow = 0; },
    tick(now) {
      if (!start) { start = now; frames = 0; return; }
      frames++;
      const span = now - start;
      if (span >= windowMs) {
        lastFps = (frames * 1000) / span;
        frames = 0; start = now;
        if (!warm) { warm = true; return; }
        slow = lastFps < minFps ? slow + 1 : 0;
        if (slow >= 2 && level < levels.length - 1) {
          level++; slow = 0;
          onChange(levels[level], lastFps);
        }
      }
    }
  };
}

export function observeVisibility(el, onChange, track) {
  let inView = true;
  let pageVisible = document.visibilityState !== 'hidden';
  const emit = () => onChange(inView && pageVisible);
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) inView = e.isIntersecting;
      emit();
    }, { threshold: 0 });
    io.observe(el);
    track.observer(+1);
  }
  const onVis = () => { pageVisible = document.visibilityState !== 'hidden'; emit(); };
  const off = track.listen(document, 'visibilitychange', onVis);
  return () => {
    off();
    if (io) { io.disconnect(); track.observer(-1); }
  };
}
