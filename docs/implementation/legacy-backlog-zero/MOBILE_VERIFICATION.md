# Mobile verification

**Result:** phones are unchanged by the motion layer. It is not loaded on touch screens: `motion.spec` checks that no `motion-*.js` or `lenis-*.js` is requested within 5 s after load. The phone performance run requests the same files and bytes as the build with motion disabled (`PERFORMANCE_COMPARISON.md`).

The only change that reaches phones is the CSP and referrer meta. Checked by the final run at 320, 360, 375, 390 and 430 px in touch emulation:
- every phone suite passes: phase1-mobile, lens-lab-mobile, premium-journeys A–G and touch, core-journeys J01–J13, touch-gestures, light-journey, plates-clarity and axe;
- no console errors, including CSP violations (phase1-mobile "no console errors", security suite);
- Google Maps embed allowed by `frame-src`;
- the 3D viewer and the vision simulator start (cataract-sim, vision-sim).

Defect found and fixed on the way (when the layer still ran on phones): LZ-03, Back position at 320 px.

Not done: physical phone, real iOS Safari check of this branch (needs a deploy; card #29). No emulator was run (light mode).
