# 09 — Medical illustration QA: ICL plate rebuild

Status: **pending physician review** (Dr. Maan Albarry). Nothing here is approved. All three ICL atlas assets are
`reviewStatus: "pending"`, `approval: "not approved"`, `reApprovalNeeded: true`, version `atlas-2026.11-r3`.

Scope: the patient-facing ICL (implantable collamer lens) illustration on `/procedures/icl/` and `/en/procedures/icl/`
(L2 hero "Fig. 1" and the L3 close-up behind "More detail") and the ICL card in the homepage procedure gallery (L1).
The legacy fallback card `public/images/procedures/icl[-dark][-800].webp` was re-rendered from the same scene.

## 1. Problems before (owner: "confusing")

Evidence: `evidence/icl/before/` (images + page screenshots).

- 3/4 oblique wedge cut-away: two cut faces at different angles plus 3D tissue in between; the eye's orientation was
  hard to read (the hero showed the cornea as a diagonal slab across the top).
- The implant was a **translucent 3D mesh** (opacity ~0.6) over a painted section of it, so the same lens appeared
  twice, as a pale sheet and as a thin line.
- The vault (gap between implant and natural lens) was **tinted aqua at 62 % opacity**, the same family of colour as
  the implant and the cornea: it read as a thick blue slab, i.e. as part of the implant.
- Translucent humours (aqueous 50 %, gel floor 50 %) made the cut face a window onto the 3D eye behind it.
- Plate thickness 0.09-0.26 mm in a pale tint (#C2E4E6) close to the cornea colour; at 390 px it disappeared.
- The footplate ran into the ciliary body tissue (plate arch R = 17 mm reached z = -0.13 at r = 5.75).

## 2. New composition

One flat **sagittal section, camera square to the cut face** (fov 12, polar 89-90 degrees), the existing atlas
pipeline, palette, ink and light rig.

- L2 hero (16:9, anterior UP): the whole anterior segment, cornea dome on top, iris on both sides, the implant as one
  teal arch from sulcus to sulcus, the clear vault, the whole natural lens below. Essential pins (max 4): implant,
  vault, natural lens (kept), iris; behind "Show all labels": cornea, footplate, ciliary body.
- L1 card (4:5, anterior UP): the right half of the same section (centre to sulcus), so card and hero read as the
  same picture. Essential pins: implant, natural lens (kept).
- L3 close-up (4:3, anterior LEFT, the series' sagittal convention): cornea, iris, implant, vault, footplate in the
  sulcus, ciliary body, natural lens.
- No translucent 3D implant; fluids painted opaque (aqueous and vitreous), so there are no stacked transparent layers.
- Implant colour: saturated teal `#63BAC1` with a dark teal ink outline, distinct from the pale blue cornea, the brown
  iris and the cream lens. Vault left as clear fluid, same colour as the front chamber.
- Patient wording (key, AR/EN, pending review): "Implanted lens (ICL), behind the iris" / "العدسة المزروعة (ICL) خلف
  القزحية"; "Small clear gap above the natural lens (vault)" / "مسافة صغيرة صافية فوق العدسة الطبيعية"; new structure
  `natural-lens-kept`: "Your natural lens, which stays" / "عدستك الطبيعية، وتبقى في مكانها" (contrast with cataract
  surgery, where the lens implant replaces the lens inside the capsular bag; said in the caption and key, not drawn as
  a second figure).
- Captions: L2 "An ICL sits behind the iris and in front of your natural lens, which stays in place." (AR equivalent);
  alt texts rewritten (<= 160 characters, AR + EN) in `scripts/illustrations/atlas-meta.mjs`.

## 3. Geometry references (no new dimensions invented)

| Quantity | Value drawn | Source |
|---|---|---|
| Vault (back of plate to lens front, centre) | 0.50 mm | `src/surgical-sim/anatomy/geometry.js` `ICL.vault` |
| Plate thickness | 0.20 mm drawn (**2x** the 0.10 mm `ICL.plateT`) | legibility at 390 px; recorded in `knownSimplifications` |
| Optic bulge / optic radius | 0.08 mm / 2.9 mm | `src/surgical-sim/procedures/icl.js` `OPTIC_BULGE`, `ICL.opticR` |
| Arch profile | `(1 - u^2)^2` | `procedures/icl.js` `plateMid`, `ARCH = 2` |
| Iris rests on the implant | lift 0.816 mm, iris back >= plate top + 0.05 mm | `procedures/icl.js` `irisOnIclZ` rule (`IRIS_GAP = 0.05`), applied to `irisProfile` |
| Footplate | tip r = 5.30 mm, z = 0.20 mm, in the nook between the iris root (r 5.55) and the ciliary-body face (r ~5.34 at z ~0.15) | `scripts/illustrations/src/anatomy.js` (ciliary profile, iris root); sim `HALF_L = 5.5`, `ICL.sulcusR = 5.6` in its own eye |
| Cornea, lens, iris, ciliary body | unchanged series schematic eye | `scripts/illustrations/src/anatomy.js` (Gullstrand / Navarro / Liou-Brennan, see manifest `references`) |

Each ICL asset in `public/images/procedures/manifest.json` carries a `model` block (`icl-section-r3`: scene,
eye model, implant source with library `ssim-anatomy-2026.11-r1`, drawn exaggeration, vault / half-length / iris lift),
`references`, `knownSimplifications`, `changeNote` and `questionsForDrMaan`.

## 4. Files

- `scripts/illustrations/src/scenes/icl.js` — rewritten: ICL geometry from the simulator constants, `iclSection()`
  composition, `paintAqueous`, `paintICL`; default export (legacy card) uses the same section.
- `scripts/illustrations/src/atlas/scenes-extra.js` — `iclSagittal` now uses `iclSection` (anterior left).
- `scripts/illustrations/src/atlas/shots.js` — ICL L1/L2/L3 shots: camera `sagittal`, frames, anchors, `model` record.
- `scripts/illustrations/src/atlas/structures.js` — `natural-lens-kept`; ICL and vault patient wording.
- `scripts/illustrations/src/atlas/cameras.js` — sagittal rule allows anterior UP for the ICL hero and card.
- `scripts/illustrations/src/globe.js` — optional `aqueousAlpha` and `paintUnder` (defaults unchanged for other shots).
- `scripts/illustrations/src/atlas.js`, `atlas-manifest.mjs`, `atlas-meta.mjs` — r3 version / change notes, `model`
  pass-through, ICL alt / captions / simplifications / questions.
- Images: `public/images/procedures/atlas/icl-*` (L2 640/1024/1600/2400 alpha + neutral WebP, JPEG 1024/1600;
  L1 480/800/1200 WebP, JPEG 800; L3 640/1024/1600 WebP, JPEG 1024; anchors JSON), `public/images/procedures/icl*.webp`
  (legacy), `public/images/procedures/manifest.json`. All within budget (L2 1600 alpha 83 KB <= 250 KB; L1 1200 alpha
  103 KB <= 120 KB; L3 1600 66 KB <= 150 KB).
- `tests/plates-clarity.spec.js` — accepts r3 assets (change note + re-approval required) and pins the r3 list to the
  three ICL assets.

Regenerate: `node scripts/illustrations/atlas.mjs icl` and `node scripts/illustrations/render.mjs icl`.

## 5. Evidence

`docs/implementation/phase-2-final-closure/evidence/icl/`

- `capture.mjs` — reproducible capture (Chromium, ANGLE d3d11, production build on `vite preview --port 4751`).
- `before/`, `after/` — for 1440 x 900 and 390 x 844 (DPR 2), AR and EN, light and dark: page first screen
  (`page-*`), L2 figure (`hero-figure-*`), L2 with all labels (`hero-figure-all-labels-*`), opened L3
  (`closeup-*`), homepage gallery card (`home-card-*`); `images/` holds the shipped ICL image files.
- `after/review/` — render previews with the projected label anchors (`*.anchors.jpg`).

Inspected by the author: at 390 px the implant reads as a distinct teal band between the brown iris and the cream lens,
the gap is visible, pins do not overlap, the key reads in AR and EN; dark theme uses the transparent master like the
other plates.

## 6. Tests

`PW_PORT=4741 PRERENDER_PORT=4746 npx playwright test tests/plates-clarity.spec.js tests/procedures.spec.js
tests/phase1-pages.spec.js tests/first-render.spec.js tests/content-registry.spec.js --workers 2` — **136 passed**
(4.8 min, Windows, Chromium via ANGLE, production build), run on the final images.

## 7. Open points for the physician (also in the manifest)

- Is a ~0.5 mm central vault the right "ideal" to depict? Is the 2x plate thickness acceptable?
- Footplate position in the ciliary sulcus; iris shown resting on the implant (simplified drape).
- Patient wording of the three new / changed labels (AR + EN), especially "القبة"-free phrasing of the vault.
- Whether a side-by-side "ICL vs cataract lens implant" figure is wanted (not drawn; the contrast is in text only).
