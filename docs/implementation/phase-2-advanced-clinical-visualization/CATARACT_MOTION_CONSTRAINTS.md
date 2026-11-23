# Cataract motion constraints

`src/cataract-sim/constraints.js` samples every stage (1,000 steps each, 7,007 frames) against volumes built from the renderer's own anatomy.

## Already checked (before Phase 2)

Shaft through the wound fulcrum, pivot ≤ 40°, tip speed limits, tip not in cornea / iris / behind the posterior capsule, IOL, flap and fragments contained, no jumps at stage boundaries, layer order, deterministic replay.

## Added in Phase 2 (`132c1e4`)

| Check | Rule |
|---|---|
| `tip-in-lens-keratome` | the keratome never goes behind the anterior capsule |
| `tip-in-lens-forceps` | the capsulorhexis forceps may press at most 0.15 mm (grip on the flap) |
| `tip-in-lens-injector` | the injector nozzle stays in the anterior chamber |
| phaco | exempt: it works inside the bag |

`checkFrame()` is exported; tests put each instrument tip 0.5 mm inside the lens and require the new check to report it.

## Result

The existing animation: 0 violations. No motion was changed. These checks show the illustration has no physically impossible overlap in a simplified rigid model; they do not show surgical accuracy.
