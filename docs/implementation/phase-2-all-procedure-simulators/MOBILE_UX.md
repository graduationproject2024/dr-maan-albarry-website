# Mobile UX of the simulators

The simulators use the cataract simulator's mobile rules, which earlier phases verified on real devices. They also avoid the earlier Lens Lab problem, where the controls and the picture could not be seen together.

| Rule | How |
|---|---|
| The model and its essential controls share one screen | At ≤ 560 px the viewport is 4:5 and at most 62 vh. The playbar (previous / play / next) sits directly under it, and the timeline wraps to a full-width row. Test: at 390×844 and 844×390, the distance from the viewport top to the play button bottom is at most the screen height. |
| Page scrolling keeps working over the model | `touch-action: pan-y`. One finger sideways turns the model; up/down scrolls the page. |
| Free rotation when wanted | "One-finger rotate" (touch screens only) switches to `touch-action: none`. Full screen does the same. |
| Pinch to zoom | Two-pointer distance drives the camera radius |
| Full screen on iPhone | CSS `position: fixed`, `100dvh`, `env(safe-area-inset-*)` padding, so no Fullscreen API is needed. Escape exits. |
| Short landscape (≤ 500 px tall) | The viewport takes `100dvh − 140 px` beside a narrow panel, and the hint is hidden |
| Targets | Every button, tab, toggle and stage is ≥ 44 px (40 px view tools at ≤ 560 px, inside a 48 px column) |
| Controls never cover the model | The view tools are a slim column at the inline end. Camera, toggle and option rows scroll horizontally instead of wrapping under the model. |
| RTL | The shell mirrors with `dir="rtl"`. Arrow icons flip. Arrow-key tab navigation follows the reading direction. |
| Reduced motion | Camera moves become instant. The spinner slows. Playback is the content, so it stays under the visitor's control. |
| Slow network / failure | The section's Start button shows "Loading…". A failed import shows a retry message. Missing WebGL gives the full written stage list. |
