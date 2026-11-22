# PRK simulation: laser vision correction, "PRK" tab

| | |
|---|---|
| Model | `ssim-laser` (variant `prk`), version `2026.11-r1` |
| File | `src/surgical-sim/procedures/laser.js` |
| Clinical status | **pending review** |
| Content source | the laser vision correction page (PRK type text) and its listed AAO source for the bandage contact lens |

## Stages

| # | id | Title (en) | What the scene shows |
|---|---|---|---|
| 1 | anatomy | The cornea and its layers | Section of the layers |
| 2 | epithelium | The surface layer is removed | The epithelium is absent in the centre (`epiGone`) |
| 3 | reshape | The surface is reshaped | The laser acts on the surface of the stroma. There is no flap. |
| 4 | bandage | A protective contact lens | A thin bandage lens is lowered onto the cornea |
| 5 | regrow | The surface layer grows back | The epithelium returns from the edge inwards |
| 6 | result | A flatter front surface | The bandage lens is removed. The original curve is shown dashed. |

How it differs from LASIK: no flap, and the treatment is on the surface. The epithelium regrows, and a bandage lens is placed.

Probe: the epithelium amount goes 0 → 1 → 0. Central thickness 0.54 → 0.39. Tests: the epithelium is fully removed in stage 2 and back in stage 5; the centre is thinner at the end; no flap.

Evidence: `evidence/prk/`.
