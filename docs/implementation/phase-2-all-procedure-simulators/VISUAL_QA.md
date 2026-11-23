# Visual QA

Every stage of every simulator and technique was screenshotted at 1366×900, plus Arabic (dark theme where noted) and a 390×844 phone view. The screenshots are in `evidence/<module>/`.

The main session reviewed one or more images per module. Each builder reviewed every image of its own modules.

## Real defects found in the screenshots, and fixed

| ID | Defect | Fix |
|---|---|---|
| VQ-01 | The simulator title and stage heading were invisible: they inherited the page band's heading colour | `.ssim h3, .ssim h4` use the simulator's own text colour |
| VQ-02 | The empty capsular bag was drawn as a filled grey face in the section, so it looked like a lens was still there | The capsule section is drawn as its outline only |
| VQ-03 | Moiré on the retina and choroid (coincident surfaces) | 0.03–0.04 mm gaps between sclera, choroid and retina |
| VQ-04 | Banding through the transparent vitreous | Vitreous drawn front-faces only, at lower opacity |
| VQ-05 | **White speckle on every section face** (lens, cornea bands) in all modules | The cut faces lay exactly on the clipping plane, so rounding clipped random pixels. The plane now sits 3 µm beyond them. |
| VQ-06 | Laser and UV beams washed the background to white | Normal blending at low opacity |
| VQ-07 | IOL light paths converged where the optic disc projected in the side view | Camera raised; "Macula (centre of vision)" label at the focus |
| VQ-08 | Labels of inner structures showed on the closed eye | Inner labels appear only when the section is on |
| VQ-09 | Transplant stitch ring looked offset from the graft (oblique parallax) | Stitches stage uses the front view |
| VQ-10 | ICL plate cut through the iris in the shared shape | The module builds its own plate that clears the iris; checked in Node |
| VQ-11 | A builder's transplant image was taken during a GPU context loss (blank view) | Recaptured; a context-loss / restore test was added |

## Remaining visual limits (accepted, documented in the module docs)

- The ICL plate briefly passes through the iris while its ends are being tucked (stage 5, mid-way).
- On a 390 px phone the intravitreal "Back of the eye" view is framed tightly. Zoom out works.
- In laser close-ups the iris fills part of the right side. "Rest of the eye" hides it.
- Labels can overlap for a moment during camera moves.
