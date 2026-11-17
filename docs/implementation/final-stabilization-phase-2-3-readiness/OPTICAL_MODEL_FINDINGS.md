# Optical model findings: why Near / Intermediate / Far did not change the picture

## Question

On the live site, choosing Near, Intermediate or Far in the Lens Lab moved a white frame and changed the caption, but the rendered scene stayed the same. Was that a defect?

## What the code does

Files: `src/vision-sim/optics/model.js` (`computeView`, `layerOptics`, `bandOf`), `src/vision-sim/pipeline.js` (render), `src/vision-sim/scenes.js`, `src/vision-sim/index.js` (`setDistance`, `targetBox`).

1. The scene has three depth layers that are always drawn together: the phone (40 cm), the laptop (66 cm) and the street with the road sign (6 m).
2. For the chosen lens, `computeView` works out the defocus of **each** layer: `ΔD = 1/d − (V_focus − S)` per focus of the lens, then the blur angle from the pupil (`blurAngleRad`), and blurs each layer with its own Gaussian per focus, weighted by the light share of that focus.
3. The chosen distance only picks the **subject**: which layer the patient is looking at. `computeView` moves that one layer to the exact chosen distance; at the three preset distances the layer is already there, so nothing changes.

## Cause

**Correct model behaviour, combined with a scene composition that made it invisible.** A fixed lens implant does not refocus when the patient looks at something else. A monofocal lens set for distance blurs the phone whether the patient looks at the phone or at the road sign. So, at the preset distances, every layer already has the right blur, and choosing another distance must not change the blur. The model is right not to change it.

What was missing was presentation: the whole scene stayed the same size, so the object the patient chose was a small part of a busy picture, and the only cue was a thin frame.

| Possible cause | Finding |
|---|---|
| Correct model behaviour | Yes: all distances are modelled at once and do not depend on the chosen one |
| Scene composition | Yes: the chosen object stayed small; the frame was the only change |
| Rendering logic | No defect |
| Parameter propagation | No defect: `distanceM` reaches `computeView`; the subject and the captions change |
| Educational simplification | The three fixed depth layers are a simplification; unchanged |
| Genuine defect | No |

## What was changed (presentation only)

**Closer view.** Choosing a distance now moves the camera to the object at that distance so that it fills most of the viewer. "Whole scene" (in the viewer) and Reset go back.

- Implemented with `camera.setViewOffset` (the camera shows a sub-rectangle of the same picture) in `index.js applyFraming`.
- In `pipeline.js` every angular size is converted to pixels with the **magnified** focal length (`focalPx(H) × zoom`). A blur of 10 arcmin is therefore 2× more pixels at 2× zoom: the closer view is the same picture seen closer, not a sharper one. Lights are kept or dropped by their position in the **full** picture, so halos and glare match too.
- No optics parameter, no model value and `VISION_MODEL_VERSION` (`vsim-optics-2026.11-r1`) are unchanged. The review harness (`?review=1`) never uses the closer view.

## Proof

`tests/lens-lab-distance.spec.js`:

- "choosing a distance changes no model value for any lens or lighting": for monofocal, EDOF and trifocal, day and night, the defocus, blur angle, sharpness, halo, contrast and pupil of every layer are identical in the whole scene and in each closer view.
- "the closer view is the same picture seen closer": inside the object's frame, brightness differs by less than 8 of 255 and contrast by less than ±40 %; the edge energy times the zoom stays within 0.6 to 1.6 of the whole-scene value (it would rise sharply if the blur were not scaled). The trifocal phone still has more than 1.3× the edge energy of the monofocal phone in the closer view.
- "the comparison divider still splits the picture": with A monofocal and B trifocal, B is sharper at Near in the closer view.

## What would be needed to change the optical behaviour

Nothing in this milestone changes simulated blur, sharpness or aberrations. A change of that kind (for example, modelling the eye's own remaining accommodation, or depth of field inside one layer) would need: a cited model and parameters, numeric tests against published defocus curves, a new `VISION_MODEL_VERSION`, and Dr. Maan's review of the result before release.
