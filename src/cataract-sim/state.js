// Explicit playback state machine. Invalid transitions are ignored (and logged at debug level only).

export const TRANSITIONS = {
  idle: ['loading'],
  loading: ['ready', 'fallback', 'error'],
  ready: ['playing', 'paused', 'transitioning', 'completed', 'error'],
  playing: ['paused', 'transitioning', 'completed', 'error'],
  paused: ['playing', 'transitioning', 'completed', 'error'],
  transitioning: ['playing', 'paused', 'transitioning', 'completed', 'error'],
  completed: ['playing', 'paused', 'transitioning', 'error'],
  // error = WebGL context lost (restoring); it returns to the previous state or degrades to fallback.
  error: ['ready', 'playing', 'paused', 'completed', 'fallback'],
  fallback: []
};

export function createStateMachine({ debug = false, onChange } = {}) {
  let state = 'idle';
  return {
    get state() { return state; },
    can(to) { return TRANSITIONS[state].includes(to); },
    to(to, info) {
      if (!TRANSITIONS[state].includes(to)) {
        if (debug) console.debug(`[cataract-sim] ignored transition ${state} -> ${to}`);
        return false;
      }
      const prev = state;
      state = to;
      if (onChange) onChange(state, prev, info);
      return true;
    }
  };
}
