# Mobile user journeys

Scripted journeys, not patient sessions. No real booking, call or message was made.

| Journey | Where run | Class | Result | Bugs |
|---|---|---|---|---|
| A. Older Arabic speaker: home → cataract → 3D → pause → close → booking | Pixel 8 (3D part), AVD both profiles (3D Arabic), `journeys/persona-a.spec.js` | cloud real / OS sim / emulation | Pass | P2-03 (fixed) |
| B. Lens comparison: lenses → Near → Intermediate → Far → Night → Reset | iPhone 15, Pixel 8, AVD both profiles, `lens-lab-distance.spec.js` 15-step flow | cloud real / OS sim / emulation | Pass | P2-07, P2-08, P2-10 (fixed) |
| C. English visitor: language, procedures, 3D, rotate, book | `persona-c.spec.js`, `webkit.spec.js`; iPhone 15 (3D) | emulation / cloud real | Pass | P2-02 (fixed) |
| D. Impatient: fast taps, play/pause, stages, scrub, open/close, language, Back | `persona-d.spec.js`, `cataract-stress.spec.js` ×4, new close-during-start test | emulation | Pass | start-close error found in own change, fixed before commit |
| E. Low-performance Android: Lens Lab, options, 3D, interruption | AVD mid-range 2 GB (Home → back, tab discard once) | OS sim | Pass | — |
| F. iPhone Safari: scroll, Lens Lab, 3D, return | iPhone 15 (no rotation or pinch: connector limit) | cloud real | Pass with findings | P2-01, P2-02 (fixed) |
| G. Returning visitor: deep link, simulator, Back, resume | AVD both (hardware Back twice), `returning-visitor.spec.js` (+ new full-navigation test, Chromium + WebKit) | OS sim / emulation | Pass | P2-01 (fixed) |
| H. Keyboard / accessibility | `journeys/axe.spec.js`, new focus-not-obscured test (390×844, 360×652, four pages) | emulation | Pass after fix | P2-09 (fixed) |

Device, OS, browser, viewport and network for each run: `ANDROID_CHROME_RESULTS.md`, `IPHONE_SAFARI_RESULTS.md`, `CLOUD_DEVICE_TESTING.md`. Step logs with screenshots: `evidence/android-emulator/*/journey-log.json`.
