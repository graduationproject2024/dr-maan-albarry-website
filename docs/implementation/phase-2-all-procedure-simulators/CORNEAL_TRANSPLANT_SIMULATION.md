# Corneal transplant simulation: `/procedures/corneal-transplant/`

| | |
|---|---|
| Model | `ssim-kpl`, version `2026.11-r1` |
| File | `src/surgical-sim/procedures/corneal-transplant.js` |
| Clinical status | **pending review** |
| Content source | the corneal-transplant page: anatomy (epithelium, stroma, endothelium); types PK, DALK and DSAEK/DMEK; steps (examination identifies the damaged layer; anaesthetic; damaged tissue removed and donor tissue secured with stitches, or with an air bubble in endothelial transplants; close follow-up) |

## The techniques are not shown as one procedure

Each variant replaces a different layer, as the page explains.

| Variant | Stages | What is replaced |
|---|---|---|
| PK | exam → anaesthetic → remove (cloudy full-thickness centre) → donor → stitches → follow-up | Full thickness of the centre |
| DALK | exam → anaesthetic → remove (front layers; own endothelium highlighted and kept) → donor front layers → stitches → follow-up | Front layers |
| DSAEK / DMEK | exam (swollen, hazy cornea) → anaesthetic → remove (old inner layer) → donor thin layer inside the eye → air bubble holds it → the cornea clears and thins | Inner layer only |

- **Toggles:** rest of the eye.
- **Cameras:** cornea section close-up, front view, whole eye.
- **Labels:** layers, donor tissue, stitches, air bubble.
- **Probe:** layers replaced, swelling, haze, graft, stitches and bubble visibility. For EK, central thickness goes 0.78 → 0.54.

## Evidence

- `evidence/corneal-transplant/`: every second stage of each variant, plus Arabic dark and phone.
- **Defects found and fixed:**
  - An image captured by the builder during a GPU context loss was blank. It was deleted and recaptured, and a context-loss test was added.
  - In the oblique view the stitch ring looked offset from the graft edge, because of parallax through the transparent cornea. The stitches stage now uses the front view.

## Simplifications

- The graft radius is illustrative.
- The stitches are a ring with no stated count or pattern.
- No incision sizes or suturing steps are shown.
- The air bubble is not shown being absorbed. The page does not describe it, so it is queued as review item R-08.
