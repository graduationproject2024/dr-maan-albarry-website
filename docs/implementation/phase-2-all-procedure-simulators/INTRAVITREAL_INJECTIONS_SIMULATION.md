# Intravitreal injection simulation: `/procedures/intravitreal-injections/`

| | |
|---|---|
| Model | `ssim-ivt`, version `2026.11-r1` |
| File | `src/surgical-sim/procedures/intravitreal.js` |
| Clinical status | **pending review** |
| Content source | the intravitreal injections page: intro, anatomy (vitreous, retina, macula), steps (examination and retinal imaging, numbing drops and careful cleaning, quick injection into the white of the eye with a very fine needle, short check, home the same day) |

## Stages

| # | id | Title (en) | What the scene shows |
|---|---|---|---|
| 1 | back | The back of the eye | Posterior composition: vitreous, retina, macula, optic disc, vessels |
| 2 | exam | Examination and retinal imaging | Macula close-up, with a generic "affected area (illustrative)" at the macula. No disease is named. |
| 3 | numbing | Numbing drops and careful cleaning | Drops fall on the eye surface |
| 4 | injection | A quick injection into the white of the eye | A fine needle enters the sclera behind the limbus, aimed at the centre of the vitreous and away from the lens |
| 5 | spread | The medicine in the vitreous | Soft translucent puffs drift towards the back of the eye. Driven by the timeline only. |
| 6 | after | A short check, then home | The needle is gone. The affected area fades slightly. The text promises no result. |

- **Interactions:** toggles for vitreous, lens and cornea; camera buttons for whole eye, back of the eye and macula close-up; all shared tools.
- **Test:**
  - the macula is present;
  - there is no needle or medicine at the start;
  - the needle enters behind the limbus with its tip inside the globe;
  - medicine appears only after the injection;
  - the needle is gone at the end.

## Evidence

`evidence/intravitreal-injections/`: 8 images (all 6 stages, Arabic, phone). Console errors: 0. Triangles: about 170k–181k.

## Simplifications (shown in the simulator)

These are in addition to the common ones:
- no medicine, dose, needle length, depth or angle is shown;
- the injection is drawn in the inferior part of the section plane so it can be seen in the cut;
- the medicine is drawn as a cloud for the idea only;
- the fovea is on the axis.

**Known limit:** on a 390 px phone the "Back of the eye" view is framed tightly. Zooming out works.
