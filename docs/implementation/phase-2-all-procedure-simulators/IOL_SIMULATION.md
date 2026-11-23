# IOL simulation: `/procedures/lens-implants/`

| | |
|---|---|
| Model | `ssim-iol`, version `2026.11-r1` |
| File | `src/surgical-sim/procedures/iol.js` |
| Clinical status | **pending review** |
| Content source | the lens-implants page (`content.js`): intro, anatomy (cornea, lens capsule, macula), types (monofocal, EDOF, multifocal/trifocal, toric), steps |

## Stages

| # | id | Title (en) | Camera | What the scene shows |
|---|---|---|---|---|
| 1 | natural | The natural lens | whole-eye section | Lens in its capsule behind the iris; cornea and retina |
| 2 | cataract | When the lens turns cloudy | front view | The lens tint changes to a cataract; the pupil dilates (drops) |
| 3 | removed | The cloudy lens is removed; its capsule stays | front section | Round opening in the front capsule; the lens shrinks away; the empty bag stays (outline) |
| 4 | insert | The folded lens enters the capsule | front section | The injector approaches from the temporal side; the IOL travels to the centre and unfolds; the haptics open |
| 5 | position | The lens in place | lens close-up | The bag settles around the optic; the iris settles; the optic is centred behind the pupil |
| 6 | designs | How lens designs differ | light path | Light paths for the selected type: monofocal (one focus), EDOF (an elongated focus range), multifocal/trifocal (three foci), toric (two planes meeting; the axis marks and lens rotation are shown) |

The cataract operation itself is summarised in stages 3–4. It is shown in detail by the cataract simulator.

## Interactions

- **Lens type** (4 choices). Changes the optic's surface design and the light paths. The text under the stage comes from the page's `types`.
- **Toggles:**
  - natural lens for comparison (a wireframe ghost);
  - capsule;
  - iris.
- **Views:** whole eye, front view, front of the eye, side section, front section, light path.
- **Shared tools:** section, labels, one-finger rotate, full screen, zoom, reset view, play/pause/previous/next/timeline, restart.
- **Link to the Lens Lab:** the page already links to it next to the types. The Lens Lab's optics are not duplicated.

## Distinct from the ICL module

| | IOL | ICL |
|---|---|---|
| Natural lens | Removed (stage 3) | Stays |
| Implant position | Inside the capsular bag at the equator plane (z = −1.5) | In the posterior chamber, in front of the natural lens (apex z = 0.85) |
| Supported by | The bag (haptics in the fornix) | The ciliary sulcus |

## Verification

- `tests/surgical-sim.spec.js`, lens-implants block: 3 tests passed on the first run. They cover:
  - on-demand load;
  - play/pause freeze;
  - deterministic seek;
  - every stage by list and next/previous;
  - camera drag and zoom;
  - section;
  - toggles;
  - reset;
  - review metadata;
  - language and theme without a new canvas;
  - close and reopen four times.
- Screenshots of every stage, Arabic dark and phone: `evidence/iol/`. Defects found in them and fixed:
  - the stage heading was invisible on the page band;
  - the empty capsule's section was drawn filled, so it looked like a lens;
  - the retina and choroid z-fought;
  - the focus point lined up with the optic disc from the side view, so the camera was raised and the macula labelled.
- Console errors in the screenshot runs: 0.

## Simplifications (shown in the simulator)

These are in addition to the common ones:
- the cataract removal is summarised;
- the light paths are drawings, not optics;
- the implant shown is a generic one-piece lens;
- the toric axis (30°) is illustrative.
