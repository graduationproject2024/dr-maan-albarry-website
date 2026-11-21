# Device test matrix

| Feature | iPhone 15 Safari (cloud real) | Pixel 8 Chrome (cloud real) | AVD high-end (OS sim) | AVD mid-range (OS sim) | Chromium mobile (emulation) | WebKit (emulation) |
|---|---|---|---|---|---|---|
| Home, portrait, booking bar | Pass | — | Pass | Pass | Pass | Pass |
| Arabic RTL | Pass | Pass | Pass (3D) | Pass (3D) | Pass | — |
| Lens Lab lens / distance / lighting | Pass | Pass | Pass | Pass | Pass | Pass |
| Lens Lab More / Reset | — | — | Pass | Pass | Pass | — |
| Lens Lab landscape | — | — | Pass | Pass (after P2-08, P2-10) | Pass | — |
| 3D start, WebGL | Pass | Pass | Pass | Pass | Pass | Pass |
| 3D play / pause / stage / scrubber | Stage, scrubber | Play | Pass | Pass | Pass | Pass |
| 3D drag-rotate, page swipe | NOT TESTED | NOT TESTED | Pass | Pass | Pass | — |
| Pinch zoom | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | Pass (`touch-gestures.spec.js`) | — |
| Rotation with 3D open | NOT TESTED | NOT TESTED | Pass | Pass | Pass | — |
| Background / foreground | NOT TESTED | NOT TESTED | Pass | Pass (tab discard handled) | — | — |
| Browser / hardware Back | Fail → fixed (P2-01) | Pass | Pass | Pass | Pass | Pass |
| Keyboard focus visible | — | — | — | — | Fail → fixed (P2-09) | — |

"—" = not part of that run. Real-device cells are production; emulator and emulation cells are the branch.
