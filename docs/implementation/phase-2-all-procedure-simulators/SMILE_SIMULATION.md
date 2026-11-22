# SMILE simulation: laser vision correction, "SMILE" tab

| | |
|---|---|
| Model | `ssim-laser` (variant `smile`), version `2026.11-r1` |
| File | `src/surgical-sim/procedures/laser.js` |
| Clinical status | **pending review** |
| Content source | the laser vision correction page: SMILE type ("a laser shapes a thin piece of tissue inside the cornea, removed through a small opening with no flap") |

## Stages

| # | id | Title (en) | What the scene shows |
|---|---|---|---|
| 1 | anatomy | The cornea and its layers | Section of the layers |
| 2 | lenticule | A thin piece is shaped inside the cornea | A lens-shaped piece inside the stroma, plus a short arc opening at the superior edge with a channel in the section |
| 3 | remove | Removed through a small opening | The lenticule follows the inner interface, shrinks and leaves through the channel. It never passes through the surface. |
| 4 | result | A flatter front surface, with no flap | The original curve is shown dashed |

How it differs from LASIK: there is no flap. The tissue is shaped inside the cornea and taken out through a small opening.

Probe: the lenticule is outside the cornea at the end of removal. Central thickness 0.54 → 0.39. Test: the lenticule leaves through the opening; no flap; the centre is thinner.

Evidence: `evidence/smile/`, including a 390 px phone shot.

The page does not say which technique is better, and neither does the simulator. Each tab's extra line repeats the page's own one-sentence description.
