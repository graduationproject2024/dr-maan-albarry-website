# Bug register

| ID | Title | Sev | Feature | Found on (class) | Viewport | Root cause | Fix | Test (fails on old code) | Status |
|---|---|---|---|---|---|---|---|---|---|
| P2-01 | Back after a full navigation lands at the top | P2 | navigation | iPhone 15, iOS 26.6, Safari (cloud real) | 393×695 | WebKit fires `pagehide` after history has moved; the save there overwrote the destination entry | `ba82c30`: save on scroll stop and on pointer/key; never in `pagehide` | `returning-visitor.spec.js` full navigation, Chromium + WebKit (WebKit 0 px before) | Fixed, verified locally + AVD |
| P2-02 | Stage button 7 cut off | P2 | 3D | iPhone 15 Safari (cloud real) | 393 px | 7×44 + gaps = 320 px, 315 available, hidden sideways scroll | `7442644`: 1 px gaps, tighter padding; 4+3 grid below 314 px | `cataract-sim.spec.js` six phone sizes (6/6 fail before) | Fixed |
| P2-03 | Arabic "Pause" wraps to two lines | P3 | 3D | Pixel 8 Chrome (cloud real) | 412 px | label too long for the button | `7442644`: never wraps; icon-only only when it does not fit; name unchanged | same test | Fixed |
| P2-04 | 3D viewer not in view after Start | — | 3D | iPhone 15 (cloud real) | 393 px | screenshot taken while loading; viewer scrolls in when ready | — | WebKit check | Withdrawn (not a bug) |
| P2-05 | Manifest icon 404 (console error on every page) | P3 | PWA metadata | AVD Chrome 113 (OS sim) | all | built manifest moves to `assets/`, icon path relative to it | `09a5f59` | `technical-fixes.spec.js` manifest (3/3 fail before) | Fixed |
| P2-06 | Lens Lab never mounts in landscape | — | Lens Lab | AVD (OS sim) | 863×304 | probe reused the same address (no reload) | — | 4 clean loads mount in ~2.5 s | Withdrawn (test artefact) |
| P2-07 | "Whole scene" over the enlarge button | P2 | Lens Lab | AVD high-end (OS sim) | 863×304, 568×320 | low corner assumed the enlarge button within 62 px of the bottom | `a7a59fe`: measured | `lens-lab-distance.spec.js` six sizes (12/60 overlaps before) | Fixed |
| P2-08 | First tap on a distance nudges the page 11 px | P3 | Lens Lab | AVD mid-range (OS sim) | 732×256 | stuck-picture scroll margin out-ranked the short-landscape one | `6af65cb` | tap test at 732×256 (11 px before) | Fixed, AVD 0 px |
| P2-09 | Keyboard focus hidden behind the booking bar | P2 | site-wide a11y | found via AVD; confirmed in Chromium | ≤1023 px | only the header was kept clear | `ef6d4e6`: bottom scroll margin on focusable elements = measured bar + 12 px | `technical-fixes.spec.js` 8 cases (8/8 fail before) | Fixed |
| P2-10 | Stuck picture covers the distance row | P2 | Lens Lab | AVD mid-range (OS sim) | 732×256 | 98 px stuck picture in a 122 px band | `b9aada8`: sticks only when picture + distances fit | test fails before | Fixed |
| FS-10 | Breadcrumb click does not navigate under 8-worker load | P3 | test | earlier milestone | — | not found | — | 0/52 (current) and 0/40 (old code) loaded repeats | Not reproducible; test unchanged |
| — | `isReady` error when closing the 3D viewer mid-compile | — | 3D | own change, caught by stress test before commit | — | three's `compileAsync` timer after dispose | own poll with cancel | `cataract-warmup.spec.js` | Fixed before commit |

Totals: 10 Phase 2 IDs — P0 0, P1 0, P2 5 (P2-01, 02, 07, 09, 10), P3 3 (P2-03, 05, 08), withdrawn 2 (P2-04, 06). Fixed 8, retested 8, open 0, blocked 0. Known limits (not defects): `LANDSCAPE_TEST_RESULTS.md`.
