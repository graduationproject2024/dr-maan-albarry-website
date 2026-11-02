# Cataract simulator: motion review and constraints

Model version: `csim-anatomy-2026.11-r2`. **Status: Pending clinical review.**

Every motion is a deterministic function of `(stage, p)`, where p is local progress from 0 to 1. Stage animations are defined in `src/cataract-sim/stages.js`. The underlying kinematics are in `src/cataract-sim/surgery.js`, which is pure JavaScript. The renderer (`eye-model.js`) and the validator (`constraints.js`) call the same functions, so the motion that is drawn is exactly the motion that is checked.

> **Collision-free is not the same as surgically accurate.** The validator only proves that this simplified, rigid model shows no physically impossible overlaps: no instrument tip or IOL passing through the cornea, iris or posterior capsule, and no instrument entering anywhere except through the incision. It says nothing about surgical technique, and it is not a clinical approval.

## Rules that apply to every stage

- **Single entry point.** Instruments enter and leave only along the tunnel axis, through the clear-corneal incision at the temporal limbus (+X).
- **Fulcrum.** Inside the eye, the shaft always passes through the fulcrum at the tunnel mid-point. Pose and validator share `anatomy.instrumentAxis`, so they cannot disagree. The pivot away from the tunnel axis is at most 40°.
- **Appearing and disappearing.** Instruments appear and vanish only when the tip is outside the eye (more than 0.5 mm out along the tunnel axis).
- **Speed limits.** Tip speed is at most 30 mm/s of animation time at or inside the eye, and at most 150 mm/s outside it. Nothing teleports.
- **Stage boundaries.** Persistent anatomy fields are identical at stage i, p = 1 and stage i+1, p = 0: pupil, cataract, cortex, rhexis, incision, bag settling, nucleus state and IOL pose.
- **Determinism.** `paramsAt(stage, p)` always returns the same state, whatever was called before it.

## Per-stage review

### Stage 1: The cloudy natural lens (`cloudy-lens`)

- **Purpose.** Show where the lens sits and why a cloudy lens scatters light.
- **Anatomy.** Whole eye in cross-section: cornea, iris, lens (nucleus and cortex), capsule, zonules, ciliary body, retina.
- **Start / end.** Pupil 3.2 mm, lens intact. Rays fade in over p 0.08–0.35.
- **Motion.** No instruments. Rays travel toward the retina along the optical axis (−Z).
- **Tissue.** Static.
- **Problems found (before).**
  - The iris and lens were not sectioned: the full iris disc sat inside the cut-away.
  - The rays were hand-drawn.
  - The camera at 50 mm made the anterior segment small.
- **Corrections.**
  - All layers are clipped, with capped faces.
  - The incoming rays are refracted with Snell's law through both corneal surfaces and the anterior lens surface. They then scatter from a point inside the lens; this scattering is labelled illustrative.
  - The camera is closer (40 mm, target z −3.5).

### Stage 2: Preparing and viewing (`preparation`)

- **Purpose.** Pupil dilation and the surgeon's microscope view.
- **Anatomy.** Iris and pupil.
- **Start / end.** Pupil 3.2 → 7.0 mm (p 0.15–0.8).
- **Motion.** The pupil margin moves outward. The iris profile is regenerated so the margin slides down the anterior lens surface while keeping 0.16 mm clearance.
- **Problems found.** None, except that the iris root was too far anterior (fixed in the anatomy).
- **Corrections.** The iris root is now at r 5.45 / z 0.0. The validator shows no contact between iris and cornea or lens at any pupil size.

### Stage 3: Small opening at the edge of the cornea (`incision`)

- **Purpose.** A self-sealing clear-corneal incision.
- **Anatomy.** Cornea and limbus.
- **Start / end.** No wound → wound mark visible (p 0.4–0.58).
- **Motion.**
  - The keratome approaches along the tunnel axis (p 0–0.32).
  - It passes through the stroma into the anterior chamber, with the tip stopping 1.6 mm past the fulcrum, above the iris (p 0.32–0.58).
  - It holds briefly, then withdraws along the same axis.
  - The blade is flat, roughly parallel to the iris plane.
- **Problems found.**
  - The fulcrum was an arbitrary point (5.45, 0, 1.3) with no tunnel.
  - The wound mark sat at r 5.25, not at a real tunnel.
- **Corrections.**
  - A real tunnel: external opening r 5.48, internal opening r 4.58, pitch 11.5°.
  - The wound mark spans the tunnel between its two openings.
  - The camera frames the temporal limbus (target [3.4, 0, 0.9], 22 mm).

### Stage 4: Opening the front of the lens capsule (`capsulorhexis`)

- **Purpose.** Continuous curvilinear capsulorhexis.
- **Anatomy.** Anterior capsule.
- **Start / end.** Intact capsule → a circular 5 mm opening, with the free flap removed through the incision.
- **Motion.**
  - The forceps enter through the incision (p 0–0.16) and grasp the capsule at the start of the tear (angle 0, temporal).
  - From p 0.16 to 0.80, the **tear front runs once around the circle** (counter-clockwise as seen by the surgeon). The torn edge line on the remaining rim grows with the tear front.
  - Behind the front, the torn flap is **folded over onto itself** along a hinge that moves inward. The fold is a reflection about the hinge, up to 158°, implemented in `surgery.flapPoint`.
  - The forceps tip holds the folded flap just behind the tear front (`forcepsGrasp`).
  - Once the circle closes, the free flap is **gathered (bunched)** at the forceps tip (p 0.80–0.86). It leaves the eye with the forceps along the tunnel axis.
- **Problems found (before).**
  - The opening "appeared" via a line plus a disc that was scaled and translated: a scale transform, not a tear.
  - The forceps traced a circle 0.12 mm above the capsule, with nothing to hold.
- **Corrections.**
  - A CPU-deformed polar flap mesh, driven by a progressive fold.
  - The capsule shader removes the central disc as soon as the flap mesh takes it over, so there is no gap and no double layer.
  - The validator checks that the flap stays inside the anterior chamber at every sample.
- **Simplifications.**
  - No cystotome puncture or viscoelastic is shown.
  - The tear direction and the starting point are illustrative.
  - The rim is rigid.

### Stage 5: Removing the cloudy lens (`phaco`)

- **Purpose.** Phacoemulsification inside the capsular bag.
- **Anatomy.** Nucleus, cortex, bag.
- **Start / end.** Intact nucleus and cortex → empty, clear bag; red reflex.
- **Motion.**
  1. **p 0–0.14.** The probe enters through the incision and the capsular opening, staying above the iris.
  2. **p 0.14–0.32.** Central sculpting: the probe sweeps across the nucleus centre at a decreasing height. It stays at least 0.12 mm in front of the posterior capsule (validated).
  3. **p 0.30–0.38.** The nucleus **cracks into four quadrants**, which separate radially by 0.22 mm and stay inside the bag (validated against the capsule surfaces).
  4. **p 0.38–0.80.** One quadrant at a time is **mobilised toward the probe tip and emulsified there**: it shrinks into the tip position, while small particles leave it and travel to the tip, where they vanish. All particles stay inside the bag or anterior chamber (validated).
  5. **p 0.80–0.88.** The remaining cortex clears while the tip moves in a gentle arc inside the bag.
  6. **p 0.88–1.** The probe withdraws along the tunnel axis.
- **Problems found (before).**
  - The whole nucleus shrank and vanished, with a "stream" of fragments starting outside the lens.
  - The tip moved along a free spiral.
- **Corrections.** Real fragmentation geometry: four closed quadrant solids, a piece transform shared with the validator, and particles that are born on the active fragment and absorbed at the tip.
- **Simplifications.**
  - The chop/quadrant pattern is a generic patient-education depiction, not a recommended technique.
  - Irrigation, viscoelastic, hydrodissection, the second instrument and the separate irrigation/aspiration step are not drawn. Cortex removal is shown as a fade.

### Stage 6: Placing the artificial lens (`iol`)

- **Purpose.** Folded IOL injected, unfolding inside the bag.
- **Anatomy.** IOL, bag, iris.
- **Start / end.** Empty bag → IOL centred in the bag behind the iris, with the bag settled around it.
- **Motion.**
  1. **p 0–0.16.** The injector moves along the tunnel axis until its nozzle tip is 1.25 mm inside the fulcrum, in the chamber.
  2. **p 0.18–0.42.** The rolled IOL (about 2 mm across, rolled about its haptic axis) **emerges from the nozzle** along the nozzle axis. While it is inside the nozzle bore it is exempt from tissue checks.
  3. **p 0.42–0.66.** It descends through the pupil and capsular opening toward the bag centre while **unrolling** (fold 1 → 0.15) and levelling (tilt → 0).
  4. **p 0.66–0.82.** It settles to the bag centre, finishes unfolding, and the **haptics open into the bag equator** (centre-line radius 4.45 mm in a 4.7 mm bag).
  5. **p 0.80–0.92.** The IOL rotates ("dials") to its final orientation.
  6. **p 0.45–0.60.** The injector withdraws (this overlaps the steps above).
  7. **p 0.90–1.** The empty bag settles around the IOL and the zonules follow.
- **Final state** (validated):
  - centred within 0.02 mm;
  - fully unfolded;
  - haptic reach 4.52 mm, inside the equator and within 0.35 mm of it;
  - every IOL sample beyond the rhexis radius is inside the bag;
  - no sample is in front of the iris back surface;
  - no intersection with the cornea, iris or posterior capsule at any p.
- **Problems found (before).**
  - The IOL emerged at a point (`inside(1.3)`) with a nozzle bore too small for the rolled lens.
  - It descended straight down.
  - It sat in an inflated bag, with its posterior surface about 2 mm from the posterior capsule.
- **Corrections.** All of the steps above. The bag settles. The nozzle bore is 2 mm.
- **Known gap.** While the IOL passes the capsular opening, the **anterior capsule rim** is drawn rigid, so the descending IOL can briefly overlap the rim membrane. The validator checks the IOL against the cornea, iris and posterior capsule only, not against the rim, because a real rim deforms around the IOL.

### Stage 7: Completion (`completion`)

- **Purpose.** Instruments are gone, the pupil returns toward normal and the light path is clear.
- **Anatomy.** Whole eye in cross-section.
- **Motion.**
  - The pupil goes from 7.0 to 3.8 mm.
  - The incision mark fades to 30 % (sealed).
  - The focus rays fade in.
- **Problems found.** The rays were hand-drawn to a "focus point", and the IOL sat in an inflated bag.
- **Corrections.**
  - The rays are traced through the cornea and the IOL with Snell's law. They converge on the model retina; the paraxial focus is 0.002 mm from it.
  - The caption reads "Illustrative light path — simplified model eye, not a vision test".
  - The camera target is at z −7.

## Camera framing per stage

| Stage | Target | Azimuth / polar / distance | Rationale |
|---|---|---|---|
| 1 | (0, 0, −3.5) | 1.0 / 1.32 / 40 | Oblique cut-away; anterior segment and lens readable |
| 2 | (0, 0, 0.4) | 0 / π/2 / 34 | Surgeon (microscope) view |
| 3 | (3.4, 0, 0.9) | 0.5 / 1.2 / 22 | Temporal limbus and tunnel |
| 4 | (0, 0, 0.2) | 0.12 / 1.36 / 25 | Near-axial over the capsule |
| 5 | (0, 0, −1.0) | 0.38 / 1.12 / 24 | Oblique, so the depth of the fragments inside the bag reads |
| 6 | (0, 0, −1.0) | −0.3 / 1.15 / 25 | Oblique from the other side, so the IOL is not hidden by the injector |
| 7 | (0, 0, −7) | 1.0 / 1.36 / 58 | Whole-eye cut-away for the light path |

## Constraint validator (`src/cataract-sim/constraints.js`)

**Bounding volumes**, built from the same anatomy functions the renderer uses:

| Volume | Definition |
|---|---|
| Cornea solid | Between the anterior and posterior surfaces, for r ≤ 5.23 |
| Anterior to the endothelium | z above the posterior corneal surface |
| Iris solid | Between the iris front and back surfaces, for pupil ≤ r ≤ root; follows dilation and settling |
| Capsular bag | Between the anterior and posterior capsule surfaces (including the settled shape) |
| Behind the posterior capsule | Vitreous side of the posterior capsule |
| Anterior segment | Below the endothelium, outside the iris, in front of the posterior capsule |

**Checks**, sampled at 1001 values of p per stage (7007 states in total):

- **Instrument tip** (sphere, 0.12 mm) against the cornea solid, the iris and the posterior capsule (+0.02 mm clearance). The wound region within 1.6 mm of the fulcrum is exempt, because tissue deformation at the wound is not modelled.
- **Shaft centre-line** from the tip to the fulcrum, against the cornea, iris and posterior capsule (same wound exemption).
- **Fulcrum.**
  - Inside the eye, the shaft axis passes the fulcrum within 1e-6 mm.
  - Pivot is at most 40°.
  - Outside the eye, the tip lies on the tunnel axis within 0.05 mm.
- **Transform consistency.** Instruments appear and vanish only outside the eye; tip speed limits apply.
- **IOL.** 272 sample points on the deformed optic and haptics. None may be at or in the cornea, inside the iris, behind the posterior capsule (+0.02 mm) or beyond the bag equator, unless they are still inside the injector bore. The final pose rules for stage 6 also apply.
- **Flap.** 216 samples must stay within the anterior chamber.
- **Nucleus fragments.** Every quadrant's surface samples must stay inside the bag (0.03 mm slack). Every particle must stay inside the bag or anterior segment.
- **Layer order.** The static anatomy checks described in `CATARACT_ANATOMY_REVIEW.md`.
- **Boundary continuity** between stages, and **determinism**.

**Result** (`tests/cataract-constraints.spec.js`): 7007 sampled states, **0 violations**. Determinism holds. Negative controls confirm the detectors fire on real penetrations.

## Rendering and performance (measured)

- **Measurement.** `CSIM_PERF=1 CSIM_EVIDENCE_DIR=docs/implementation/clinical-visual-reconstruction/evidence/surgery PW_PORT=4373 PRERENDER_PORT=4376 npx playwright test tests/cataract-sim.spec.js -g performance`
- **Hardware.** This Windows machine, NVIDIA GeForce RTX 2060, Chromium through ANGLE / Direct3D 11.
- **Results** (playing, 6 s sample; raw data in `evidence/surgery/perf-*.json`):

  | Viewport | Average FPS | p95 frame | DPR held | Draw calls | Triangles |
  |---|---|---|---|---|---|
  | 1440×900 | 60 | 16.7 ms | 1 | 33 | ~243 k |
  | 390×844 (emulated mobile, DPR 2) | 59.7 | 16.8 ms | 2 | 33 | ~243 k |

  These are vsync-capped desktop-GPU figures. They are **not** measurements on a real phone.
- **Adaptive DPR fix.** The DPR used to drop permanently to 0.75 on desktop because of one start-up hitch (shader compilation). Now the first sampling window is treated as a warm-up, and the DPR only steps down after two consecutive windows below 40 fps.
- **Bundle split.** three.js stays only in the lazy `cataract-sim` chunk. The main bundle does not import it.

## Evidence

Frames are JPEG, quality 82:
- `evidence/surgery/before/`: 21 desktop frames (3 per stage) and 7 mobile frames, captured before this change.
- `evidence/surgery/after/`: the same frames after the change, plus `section-stage*.jpg` cross-section close-ups (cut-away forced on) and `review-mode.jpg`.

Recapture with:

```
CSIM_HARNESS=1 PRERENDER_PORT=4376 npm run build
CAPTURE_PORT=4378 node tests/capture-3d.mjs <outDir> [--mode=stages|page|review]
```
