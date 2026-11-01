# Phase 3: Procedural anatomy and surgical stages

Every model is generated at runtime from code in `src/cataract-sim/`. Units are millimetres. The optical axis is +Z, toward the viewer or surgeon, and the iris plane is near z = 0.

## Dimensions

These are typical adult reference values. Sources:
- Gullstrand / Le Grand schematic eyes.
- Atchison & Smith, *Optics of the Human Eye* (2000).
- AAO *Basic and Clinical Science Course*, Section 11 "Lens and Cataract" and Section 2 "Fundamentals".
- The public pages listed in `CLINICAL_REVIEW.md`.

| Structure | Model value | Typical reference |
|---|---|---|
| Cornea diameter | 11.7 mm | ~11.5–12 mm (white-to-white) |
| Cornea anterior radius | 7.8 mm | ~7.7–7.8 mm |
| Cornea thickness | 0.55 mm centre → 0.65 mm periphery | ~0.52–0.55 / ~0.65–0.7 mm |
| Anterior chamber depth (endothelium → lens) | 3.0 mm | ~3 mm |
| Pupil | 3.2 mm normal, 7.0 mm dilated, 3.8 mm after surgery | ~2–4 / 6–8 mm |
| Iris diameter | 11.1 mm root | ~12 mm |
| Lens | 9.5 mm diameter, 4.0 mm thick (1.6 anterior + 2.4 posterior of the equator) | ~9–10 mm, ~4 mm |
| Lens apical radii | anterior 10 mm, posterior 6 mm | ~10 / ~6 mm |
| Nucleus | ~6.3 mm diameter, ~2.5 mm thick | age-dependent |
| Globe | sclera sphere R 11.5 mm through the limbus, wall 0.8 mm, axial length ≈ 24 mm | ~23.5–24 mm |
| IOL | 6 mm biconvex optic (0.85 centre / 0.3 mm square edge), C-loop haptics 13 mm overall uncompressed, compressed to ~9.3 mm in the bag | typical one-piece acrylic |

## How each part is built

- **Lens surfaces.** Each surface uses `z = z_eq ± T·(1 − (r/R)²)^p`, with `p = R²/(2·T·R_apex)`. This reproduces the apical radius of curvature exactly and gives a smoothly rounded equator. The capsule, cortex (0.97/0.95 scale) and nucleus (0.66/0.62) are lathes of the same profile.
- **Lathe helper.** `lathe.js` builds lathes with 96–180 segments. Normals come from the profile tangents, not from `computeVertexNormals`, so surfaces are smooth. Duplicated profile points create crisp edges at the corneal edge, the IOL square edge and the sclera cut. Closed counter-clockwise profiles give outward normals.
- **Cornea.** A meniscus lathe: the anterior sphere, with the posterior surface offset inward along the normal by a thickness that grows from 0.55 to 0.65 mm. The material is a transparent `MeshPhysicalMaterial` (ior 1.376, clearcoat 1, roughness 0.04). A shader patch adds:
  - Fresnel-weighted alpha, so the dome reads as glass at grazing angles.
  - A grey-blue limbal haze.
  - The clear-corneal incision mark at the temporal limbus.
- **Why transparency instead of `transmission`.** three.js's transmission pass renders only opaque objects, so the lens, capsule, IOL and rays behind the cornea would disappear. The physically plausible look therefore comes from IBL reflections, clearcoat and Fresnel alpha, with `depthWrite:false` and explicit `renderOrder` (nucleus 2 → cortex 3 → capsule 5 → IOL 6 → flap 7 → rays 8 → pupil ring 9 → cornea 10).
- **Sclera and globe.** A closed shell lathe from the limbus to the posterior pole. One canvas texture covers:
  - The outer sclera: ivory, with random-walk branching conjunctival vessels that thin toward the limbus, and a grey-blue limbal band.
  - The cut face.
  - The inner globe: choroid and orange-red retina, which produces the red reflex through the pupil under the microscope view.

  A removable 90° wedge plus two ShapeGeometry caps form the cross-section, which is on in stages 1 and 7 and user-toggleable.
- **Ciliary body.** A lathe whose cross-section is triangular, following the inner sclera, also with a wedge and caps. It carries 72 instanced ciliary processes.
- **Zonules.** 288 instanced thin cylinders from the processes to the anterior, equatorial and posterior capsule. Anterior and posterior fibres cross, as in real anatomy. The whole set is one draw call.
- **Iris.** A solid lathe (front stroma, rounded pupil rim, posterior pigment layer) rewritten in place when the pupil radius changes. The pupil margin rests 0.16 mm in front of the lens surface at every dilation. The polar canvas texture (x = angle, y = radius) contains:
  - Radial stromal fibres.
  - A jagged collarette.
  - Radially elongated crypts.
  - Circumferential contraction furrows.
  - A beaded pupillary ruff.

  The same texture is used as the bump map.
- **Cataract.** A mottled brunescent nucleus (canvas texture) and a cortex whose alpha map holds the haze plus peripheral cortical spokes. Stage 1 shows incoming light rays scattering in random directions from the lens.
- **IOL.** A biconvex lathe optic and two CatmullRom C-loop `TubeGeometry` haptics. Folding and unfolding is a CPU deformation:
  - The haptics are compressed radially: tucked (0.16), then in the bag (0.47).
  - The IOL is rolled around the haptic axis with curvature k (rolled at k ≈ 1.05 mm⁻¹, flat at 0).

  Normals are recomputed only when the parameters change.
- **Instruments.** All instruments are posed so that the tip is at the target and the shaft passes through the incision (fulcrum). The blade or bevel faces the cornea.
  - Keratome: bevelled extruded blade, neck and ridged handle.
  - Utrata-style forceps: two tube arms with tips bent toward the capsule.
  - Phaco: hollow titanium needle with a dark bore, silicone sleeve and handpiece.
  - Injector: translucent nozzle, finger flanges, plunger.
- **Light.** RoomEnvironment through PMREM (no HDR download), with a warm key light, a cool rim light, a fill light, a hemisphere light and a weak coaxial point light on the camera (microscope feel). Output uses ACES Filmic tone mapping in the sRGB colour space.

## Stages: animation matched to text

| # | Title (en) | What the animation shows | Camera |
|---|---|---|---|
| 1 | The cloudy natural lens | Cross-section; light rays enter, hit the cloudy nucleus/cortex and scatter in all directions; lens highlighted | oblique side cut-away |
| 2 | Preparing and viewing the front of the eye | Pupil dilates 3.2 → 7 mm with a highlighted pupil ring; camera moves to the straight-down microscope view; red reflex appears around the cataract | surgeon's view |
| 3 | A small opening at the edge of the cornea | Keratome approaches along the tunnel axis, enters the anterior chamber and withdraws; a small clear-corneal slit appears at the temporal limbus | close oblique on the limbus |
| 4 | Opening the front of the lens capsule | Forceps enter, then the tip traces a circle while a bright tear line grows 0 → 360°; the central capsule disc lifts away with the forceps and the opening remains | near-axial |
| 5 | Removing the cloudy lens | Phaco tip enters through the opening; the nucleus shrinks while fragments stream into the tip; cortex clears; red reflex becomes bright; tip withdraws | oblique |
| 6 | Placing the artificial lens | Injector nozzle enters the wound; rolled IOL emerges, descends through the opening, unrolls, haptics open under the iris, IOL rotates to centre; injector withdraws | oblique |
| 7 | Completion: a clear path for light | Pupil constricts; incision mark fades (sealed); cross-section shows parallel rays passing the IOL and converging on the retina | side cut-away |

Playback durations are 9/8/8/10/12/12/9 s of animation. They are not surgical timings.

## Known simplifications (honest list)

- **Not a training simulator.** Instrument geometry, wound size, rhexis size and IOL dimensions are illustrative only, and none are presented to the user as numbers.
- **Light rays are schematic.** They are drawn polylines with plausible kinks, not computed refraction. The focus point is the posterior pole of the model.
- **No volumetric scattering.** Cataract opacity is texture plus alpha.
- **Phaco is simplified.** No sculpting grooves or chop: the nucleus shrinks while fragments are aspirated. Irrigation, viscoelastic, cortex aspiration (I/A), hydrodissection and side-port incisions are omitted to keep 7 calm steps.
- **IOL placement is idealised.** The rolled IOL descends straight into the bag and the bag does not deform around the haptics.
- **Approximate geometry.** The posterior corneal radius results from the thickness profile (≈7.2 mm) rather than the ~6.5 mm anatomical value. The globe is a single sphere with no scleral sulcus. Eyelids, speculum, conjunctiva, tear film and the optic nerve are not modelled.
- **No collision detection.** Instruments follow scripted fulcrum paths.
- **Some layers are not cut.** The cornea, iris and lens are not sectioned by the cross-section view; only the sclera and ciliary body are.
- **Hotspot labels are not occlusion-tested.**
