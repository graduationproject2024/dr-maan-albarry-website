# LASIK simulation: laser vision correction, "LASIK" tab

| | |
|---|---|
| Model | `ssim-laser` (variant `lasik`), version `2026.11-r1` |
| File | `src/surgical-sim/procedures/laser.js` |
| Clinical status | **pending review** |
| Content source | the laser vision correction page: types → LASIK ("a thin flap is lifted, the layer beneath is reshaped and the flap is laid back; visual recovery is usually quick"), anatomy (epithelium, stroma, corneal thickness), steps |

## Stages

| # | id | Title (en) | What the scene shows |
|---|---|---|---|
| 1 | anatomy | The cornea and its layers | Section of the cornea: epithelium, stroma (lamellae) and endothelium |
| 2 | flap | A thin flap is made | The flap interface appears in the anterior stroma (orange line in the section) |
| 3 | lift | The flap is lifted | The flap pivots on its superior hinge |
| 4 | reshape | The layer beneath is reshaped | A subtle laser cone; the central stroma is removed (illustrative, exaggerated) |
| 5 | replace | The flap is laid back | The flap settles onto the reshaped bed |
| 6 | result | A flatter front surface | A dashed line shows the original curve for comparison (it can be turned off) |

- **Probe:** flap angle goes 0 → 1.9 rad when lifted → 0. Central thickness goes 0.54 → 0.39 (illustrative).
- **Tests:**
  - the flap is lifted above 1 rad in stage 3;
  - the flap angle is 0 at the end;
  - the centre is thinner at the end.

Evidence: `evidence/lasik/`.

No micrometre value, laser setting or energy appears anywhere.
