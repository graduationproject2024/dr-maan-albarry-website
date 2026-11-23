# Lens Lab QA

## Previous behaviour (live `9e1773f`)

Closer view per distance, grouped More settings, short-landscape fallbacks (final-stabilization milestone).

## Found and fixed in Phase 2

| ID | Problem | Fix |
|---|---|---|
| P2-07 | "Whole scene" over the enlarge button on short landscape pictures | corner chosen against the measured enlarge button |
| P2-08 | first tap on a distance nudged the page 11 px at 732×256 | short-landscape scroll margin also when the picture is stuck |
| P2-10 | stuck picture covered the distance row at 732×256 | the picture sticks only when it and the distance row fit |

## Checked on devices

Lens switch, Near / Intermediate / Far, Day / Dim / Night, More settings open and close, Reset (query removed), rotation both ways (state kept), Arabic and English, return with Back (state kept in the address). Classes: cloud real (iPhone 15, Pixel 8), OS sim (both AVDs), emulation (Chromium, WebKit).

Mobile flow: no scrolling between picture and controls in portrait (15-step flow at 7 sizes, existing test, passes). Short landscape: see `LANDSCAPE_TEST_RESULTS.md` for the 256 px limit.

## Optical integrity

Not changed. The closer view moves the camera only; the caption note says so ("the picture only moved nearer … the lens model and its sharpness did not change"). Model `vsim-optics-2026.11-r1` unchanged; `vision-optics.spec.js` passes. No visual change is presented as a clinical prediction; the disclaimer "Educational illustration — not a prediction of your vision" showed on every device.
