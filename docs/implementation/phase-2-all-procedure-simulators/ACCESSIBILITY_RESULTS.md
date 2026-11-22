# Accessibility results

| Check | Result | Evidence |
|---|---|---|
| axe on the open simulator, English and Arabic (corneal transplant: tabs, toggles, options, labels) | 0 violations | `surgical-sim.spec.js` "accessibility…" |
| axe on every procedure page (closed state), light and dark | Passed in the full run | `journeys/axe.spec.js` |
| Keyboard: Play from the keyboard, Next with Enter, arrow keys turn the model when the canvas has focus, Space toggles play on the canvas, technique tabs follow arrow keys in the reading direction, Escape leaves full screen | Passes | `surgical-sim.spec.js` "keyboard…" |
| Focus moves into the viewer when it opens from the Start button, and back to Start when it closes | Yes (same pattern as the cataract viewer, BUG-06) | `main.js` `startProcedure3D` / `closeProcedure3D` |
| Non-3D alternative | The stage list is complete text; with no WebGL the whole experience is that list | Fallback test, all six procedures |
| Screen readers | Stage changes are announced (`aria-live="polite"` on the current stage). The canvas has `role="img"` and a name. Toggle buttons use `aria-pressed`, tabs `aria-selected`, the stage list `aria-current="step"`, and the range has an `aria-valuetext` naming the stage. | DOM |
| Reduced motion | Camera moves are instant (test). Nothing moves on its own: playback starts only on Play. | `surgical-sim.spec.js` "reduced motion…" |
| Targets | ≥ 44 px, 40 px view tools on phones | CSS; phone tests |
| Colour | The simulator uses the cataract simulator's tokens (checked for contrast in earlier phases). Labels sit on an opaque pill. | Screenshots |

**Not done:** a real screen-reader pass (VoiceOver or TalkBack). That is on card #19 / #29.
