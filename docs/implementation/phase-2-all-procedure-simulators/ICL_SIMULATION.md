# ICL simulation: `/procedures/icl/`

| | |
|---|---|
| Model | `ssim-icl`, version `2026.11-r1` |
| File | `src/surgical-sim/procedures/icl.js` |
| Clinical status | **pending review** |
| Content source | the ICL page: intro, anatomy (anterior chamber, iris, natural lens), steps (assessment of chamber depth and corneal lining, local anaesthetic, folded lens inserted through a small opening, unfolds, positioned behind the iris, pressure checks, second eye another day) |

## Stages

| # | id | Title (en) | What the scene shows |
|---|---|---|---|
| 1 | space | The narrow space behind the iris | Section: the space between the iris and the clear natural lens |
| 2 | assessment | Assessment before the operation | The anterior chamber and corneal lining highlighted (the measurements named on the page) |
| 3 | anaesthetic | Local anaesthetic | Text step, with the eye in view |
| 4 | insert | The folded lens goes in and unfolds | The folded lens enters at the temporal edge of the cornea and unfolds in front of the iris |
| 5 | position | Positioned behind the iris | The ends are tucked behind the iris into the sulcus |
| 6 | result | The natural lens stays | The natural lens stays in place, and a shaded band marks the clearance (vault) |
| 7 | after | After the operation | Pressure checks; the second eye on another day (text from the page) |

**Interactions:**
- toggles: ICL, natural lens, iris;
- camera buttons: whole eye, front view, front section, side section;
- labels: cornea, anterior chamber, corneal lining, iris, space, ICL, natural lens, clearance;
- all shared tools.

## Distinct from the IOL module

- The natural lens is never removed.
- The implant sits in the posterior chamber, in front of the lens, not in the capsule.
- The iris rests on the implant.

Test (`surgical-sim.spec.js`): at the result stage, the lens is visible, the ICL apex is above the lens apex, the vault is > 0.2 mm, and the iris margin is above the ICL.

## Engineering notes

- The plate is built in `icl.js` and not with the shared `buildICL`. The shared vaulted shape cut through the iris near the cut plane.
- The module's plate keeps `ICL.apexZ` and the outline, ends in the sulcus, and follows the lens curve across its width.
- A Node check confirmed the iris always clears the plate and the plate never touches the lens once in place.
- **Known limit:** while the ends are being tucked behind the iris (stage 5, mid-way), the plate briefly passes through the iris away from the cut plane. The end state is correct.

## Evidence

`evidence/icl/`: 8 images:
- stages 1, 2, 4, 5, 6, 7;
- Arabic;
- 390 px phone.

Console errors: 0. Triangles: about 107k–119k.

## Simplifications (shown in the simulator)

These are in addition to the common ones:
- the dimensions and vault are illustrative of the lens family, not a model or size;
- the central port of some designs is not drawn;
- the lens lies horizontally, so the section shows its width.
