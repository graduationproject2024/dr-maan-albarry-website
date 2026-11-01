// Procedure timeline: per-stage playback durations, global progress 0..1, exact seeking.

export function createTimeline(durations) {
  const starts = [];
  let total = 0;
  for (const d of durations) { starts.push(total); total += d; }
  let elapsed = 0;
  const clampE = (e) => Math.min(total, Math.max(0, e));

  return {
    total,
    durations,
    starts,
    get elapsed() { return elapsed; },
    get progress() { return elapsed / total; },
    set(e) { elapsed = clampE(e); },
    seek(t01) { elapsed = clampE(t01 * total); },
    advance(dt) { elapsed = clampE(elapsed + dt); return elapsed >= total; },
    stageStart(i) { return starts[i]; },
    // Stage index and local progress 0..1 for the current (or given) elapsed time.
    locate(e = elapsed) {
      let i = durations.length - 1;
      for (let k = 0; k < durations.length; k++) {
        if (e < starts[k] + durations[k]) { i = k; break; }
      }
      return { index: i, p: Math.min(1, Math.max(0, (e - starts[i]) / durations[i])) };
    },
    // Global progress where stage i begins / ends.
    stageRange(i) { return [starts[i] / total, (starts[i] + durations[i]) / total]; }
  };
}
