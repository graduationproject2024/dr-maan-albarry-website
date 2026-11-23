# iPhone Safari results

| Class | Device / engine | Build | Result |
|---|---|---|---|
| CLOUD REAL DEVICE | iPhone 15, iOS 26.6, Safari | production `9e1773f` | Home, Lens Lab and 3D work; found BUG-P2-01 and P2-02 |
| BROWSER EMULATION | Playwright WebKit on Windows (iPhone UA) | branch | `journeys/webkit.spec.js` passes; Back test (P2-01) passes in WebKit, fails on old code |
| OS SIMULATOR | iOS Simulator | — | NOT TESTED (no macOS) |
| REAL DEVICE | physical iPhone | — | NOT TESTED |

## Real iPhone details

- WebGL: 3D viewer loaded and drew all anatomy; stage jump and scrubber worked.
- Layout: picture, distances, lens, lighting, More/Reset fit with Safari's bottom toolbar (innerHeight 695).
- Back after a full navigation: page landed at 0 instead of ~720 px. Root cause found in WebKit: on Back, the page being left receives `pagehide` after history has already moved, so the old save overwrote the destination's position. Fixed (`ba82c30`).
- Stage 7 button: cut off at 393 px. Fixed (`7442644`).

## Not covered on real Safari

Pinch, drag and rotation (the connector has no gestures); safe areas in landscape; browser-chrome collapse during scroll; text size settings. These remain for the real-device check after deployment (`IOS_SAFARI_TEST_SETUP.md`).
