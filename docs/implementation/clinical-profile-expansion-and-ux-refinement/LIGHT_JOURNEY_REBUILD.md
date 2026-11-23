# Light Journey: autoplay

- **Steps:** nine steps, each held for 7 s at 1× speed.
- **Controls:**
  - speed 0.75×, 1× or 1.5×;
  - Play / Pause / Replay;
  - a progress bar with step marks that can be scrubbed (a range input).
- **When it plays:**
  - Starts on its own when at least 35 % of it is on screen.
  - Pauses when it scrolls off screen or the tab is hidden.
  - A pause by the visitor holds until they press Play again.
- **Reduced motion:** never starts on its own.
- **Navigation:** Previous / Next and the step rail still work, and they reset the step timer.
- **Not changed:** the SVG anatomy and the ray drawing. Improving the illustration (brief §11) is still open.
- **Tests:**
  - autoplay advances;
  - pause holds;
  - scrubbing to the end shows the last step;
  - speed changes;
  - reduced motion keeps it still.
