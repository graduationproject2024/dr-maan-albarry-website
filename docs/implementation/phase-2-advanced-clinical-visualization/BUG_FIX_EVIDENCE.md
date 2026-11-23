# Bug fix evidence

Each fix was checked twice: the new test fails on the code before the fix and passes after.

| ID | Before | After | Files |
|---|---|---|---|
| P2-01 | real iPhone screenshot `evidence/real-device-cloud/iphone15-ios26.6-safari/10-back-to-lens-lab-lands-at-top.png`; WebKit test 0 px | WebKit and Chromium at the saved position; AVD hardware Back 1552/1552 and 1669/1669 | `main.js` |
| P2-02 / 03 | `…/iphone15…/07-3d-controls-chip7-clipped.png`, `…/pixel8…/03-3d-ar-playing-pause-label-wraps.png` | `evidence/bugs/P2-02-03-after-*.png` (six sizes) | `src/cataract-sim/styles.css`, `ui.js` |
| P2-05 | console error ×11 per run on the AVD | 0 console errors in the final AVD run | `manifest.webmanifest` |
| P2-07 | `evidence/android-emulator/pixel7-profile-android14-chrome113/11-tap-near-in-landscape.png` (two buttons in one corner) | 0/60 overlaps | `src/vision-sim/ui.js` |
| P2-08 | 11 px (AVD and Chromium) | 0 px (AVD final run, test) | `src/vision-sim/styles.css` |
| P2-09 | 6–12 hidden focus stops per page | 0 | `style.css`, `main.js` |
| P2-10 | distance row under the picture | not stuck; reachable | `src/vision-sim/ui.js` |
| 3D start | 8 programs linked in the first frame | 0 | `src/cataract-sim/scene.js`, `index.js`, `eye-model.js` |

Commit messages carry the measurements: `git log 6b2dc50..feat/phase-2`.
