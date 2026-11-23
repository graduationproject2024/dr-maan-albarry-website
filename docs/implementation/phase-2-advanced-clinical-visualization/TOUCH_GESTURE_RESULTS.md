# Touch and gesture results

| Gesture | Android Emulator (adb, OS-level) | Chromium touch emulation | Real devices |
|---|---|---|---|
| Single tap on every Lens Lab control | Pass (page moved 0 px, both AVDs) | Pass | Pass (taps via WebDriver) |
| Scrubber drag | Pass (515 → 633–639) | Pass | — |
| One-finger swipe over the 3D picture scrolls the page | Pass (+69 to +80 px) | Pass | — |
| Explore 3D + horizontal drag rotates, page still | Pass (screen changed, page 0 px) | Pass | — |
| Pinch zoom on the 3D picture | NOT TESTED (adb has no multi-touch) | Pass (`journeys/touch-gestures.spec.js`) | NOT TESTED |
| Fast repeated taps / open-close | — | Pass (`cataract-stress` ×4, 44/44) | — |
| Hardware Back | Pass | — | Safari Back: fail → fixed |
| Home and return | Pass (context kept; tab discard once on 2 GB) | — | — |

Wrong taps found during the work were mostly in the test script (taps placed under the sticky header or a stuck picture); the script now brings a control into view the way the browser does and refuses to tap a covered control. Two real defects came out of it: P2-08 and P2-10.
