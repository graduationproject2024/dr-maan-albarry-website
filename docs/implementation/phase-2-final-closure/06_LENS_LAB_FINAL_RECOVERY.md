# 06 — Lens Lab final recovery and visual reconstruction

Branch `wt/ll` (from `feat/phase-2-final-closure`). Scope: `/lens-lab/` and `/en/lens-lab/` — the full vision simulator
(`src/vision-sim/`) and the Lens Lab comparison module (`src/lens-lab/`) that embeds it on wide screens.

## Part 1 — "Lens Lab is not working"

The owner's report could not be reproduced in desktop Chromium on the current build (before screenshots: 34/34 views
rendered, no console errors). The investigation therefore enumerated every way the picture can fail on a production
build and checked what a visitor sees in each. Before this change, three of them could leave a visitor without a
working picture and without a way out; one could leave a blank picture.

| # | Failure path | Exact condition | Before | After |
|---|---|---|---|---|
| F1 | **Stale page after a deploy** — the most likely real-world cause of "not working" right after a release | A tab opened (or HTML served from a browser / CDN cache, GitHub Pages sends `max-age=600`) before a deploy still references the old hashed chunks (`vision-sim-<old>.js`, `pipeline-<old>.js`, `lens-lab-<old>.js`). Those files no longer exist, so the dynamic import 404s. | "Could not load … Try again". Every retry re-requested the same dead URL, so it failed forever. The Lens Lab comparison slot showed a dead-end sentence with no retry at all. | `src/chunk-recovery.js`: after a chunk failure the page fetches its own HTML with `cache: 'no-store'` and compares the entry script (`/assets/index-<hash>.js`). If the server has a newer build the tab reloads **once** (sessionStorage guard keyed on the new build — no loop). If the build is current, the normal message + retry is shown. Wired into `main.js` (simulator), `src/feature-loaders.js` (Lens Lab module), `src/lens-lab/index.js` (embedded picture) and `src/vision-sim/index.js` (picture code). |
| F1b | Lens Lab comparison picture chunk fails (desktop) | `import('../vision-sim/index.js')` rejects (network / 404) | Text "cannot be shown on this device", no retry (and wrong: it was the connection) | "Could not load on this connection" + **Try again** button (44 px), written comparison unaffected |
| F2 | WebGL 2 unavailable | `canvas.getContext('webgl2')` returns null (old iOS < 15, blocklisted GPU, enterprise policy, hardware acceleration off) | Static comparison (already correct) | Unchanged; now covered on the public page: defocus-curve chart, every lens's range and trade-offs, disclaimer, no spinner, no pointless retry |
| F3 | **Shader compile / link failure** | The GPU driver rejects one of the pipeline's shaders (`LINK_STATUS` false). three.js only logs it and keeps drawing nothing. | **Blank / black picture** with working controls — looks "broken" | `renderer.debug.onShaderError` records the failure; the first frame (or any later frame, e.g. when the night-light sprites compile) switches to the static comparison (`fallbackReason: 'shader-error'`, no retry since it cannot help) |
| F4 | WebGL context lost | GPU reset, driver update, too many contexts, background tab memory pressure | "Restoring…" note; after 10 s the static comparison **without** a retry — a dead end for the rest of the visit | Same note and 10 s wait (`restoreTimeoutMs`), then the static comparison **with Try again**, which builds a fresh canvas + pipeline (viewport observers are not duplicated) |
| F5 | Start interrupted by navigation | The visitor leaves (client-side link, Back) while the picture code or the module is still downloading | Mostly correct; a late result could race a new load | Load tokens in `main.js` (as in `feature-loaders.js`): a load that finishes after the visitor left is discarded; coming back starts cleanly. Test proves one live WebGL context afterwards |
| F6 | **Slow or stalled network** | A chunk request that never completes (captive portal, stalled mobile connection) | **Endless "Loading…"** — the import promise never settles | Timeouts: simulator / Lens Lab module 20 s (`main.js`, `feature-loaders.js`, `lens-lab`), picture code 20 s (`loadTimeoutMs`). Then the static comparison / message with **Try again**; the download keeps going, so a retry after it arrives succeeds at once |
| F7 | Picture-code chunk fails (network) | `pipeline.js` / `scenes.js` import rejects | Static comparison + retry (already correct) | Unchanged, plus F1 stale-build check before showing it |

States never left: a stuck "Loading", a blank picture, a reserved empty box. Every path ends in a retry or in the
static, non-WebGL explanation with the educational content.

### Tests (new: `tests/lens-lab-recovery.spec.js`, 10 tests)

- F1 stale deploy: chunk 404 + server HTML pointing at a new entry → exactly one reload, then the guard stops a loop and
  the retry message is shown; and a 404 on the current build → no reload, message, retry works.
- F1b Lens Lab comparison chunk fails (1440 px) → explanation + retry, retry mounts the canvas.
- F2 `getContext('webgl2')` stubbed to null on the public page (390 px) → static comparison, no spinner, no retry.
- F3 `getProgramParameter(LINK_STATUS)` stubbed to false → `shader-error` fallback, no console error, no leaked renderer.
- F4 `WEBGL_lose_context.loseContext()` without restore → note, fallback with retry, retry restores rendering, counters
  back to their earlier values (no duplicated observers / loops).
- F5 client-side navigation away while the picture code is held, then Back → working picture, ≤ 1 live context.
- F6 picture code held indefinitely with `loadTimeoutMs: 1500` → `load-timeout` fallback with retry; after release the
  retry gives a ready picture.
- Canvas readback: all five categories (standard monofocal, enhanced monofocal, EDOF, trifocal, toric) give five
  different pixel statistics at 65 cm with 1.5 D astigmatism; at far, the toric versions (monofocal-toric and
  EDOF-toric) are measurably sharper than the same designs without toric correction.
- Cross-fade determinism: after a fade the finished frame equals the frame before (A → B → A).

## Part 2 — visual reconstruction

The optics are untouched: `optics/model.js` and `optics/params.js` are unchanged (`vision-optics.spec.js` is the
contract and passes), `VISION_MODEL_VERSION` is unchanged, the three layers keep their distances (40 cm, 65 cm, 6 m +
the subject distance), and halos/glare are still drawn only from the model by `pipeline.js`. Nothing exaggerated, no
"glasses-free" claim was added; captions and texts are unchanged.

What changed (`src/vision-sim/scenes.js`, procedural only — no images or models downloaded):

- **Lighting and materials**: every layer is lit by a sky/ground hemisphere light and a sun (day: high, warm-white;
  dusk: low, orange; night: faint moonlight) with Lambert materials, instead of flat unlit colours. Aerial-perspective
  fog in the distance layer. Screens and the road sign stay self-lit.
- **Distance (6 m+)**: a palm-lined city boulevard — shopfronts with lettered fascias (Arabic / English), glazing and
  awnings; upper storeys with window reveals, sills, mullions, balconies, cornice and parapet; tiled pavements with a
  kerb; a zebra crossing; cars with cabins, wheels and contact shadows; a sky with clouds and sun glow (day), sunset
  glow (dusk) or moon and stars (night); distant hills with baked aerial perspective. Night: lit windows of varied
  colour, lit shop windows, lamp light pools on the road. The road-sign gantry (reading target) is unchanged in size
  and position.
- **Intermediate (65 cm)**: the laptop now has its aluminium shell, keyboard base and contact shadow on a wooden café
  table with plank grain; a cup and saucer stand beside it (same layer, same focus).
- **Near (40 cm)**: the phone has rounded corners and a camera notch and is held in a hand (thumb on the near edge,
  finger tips round the far edge).
- **Smooth transitions**: a 220 ms cross-fade on lens, distance, lighting, situation, eye-setting and reset changes
  (`pipeline.js` output stage: composite into one of two 8-bit targets, blend pass to the screen). Display-only; off
  with reduced motion and in the review harness; test read-backs (`sample`, `screenshot`) always see the finished frame.
- Simple Mode (three designs, distance, lighting) remains the default; enhanced monofocal, the toric switch and all
  technical settings remain in More settings. The mobile workbench layout (picture + essential controls together,
  `lens-lab-distance.spec.js` "15-step lens comparison needs no scrolling") is unchanged.

Five categories: standard monofocal (one sharp far focus; near/intermediate blur), enhanced monofocal (slightly better
65 cm), EDOF (good far + intermediate, near softer), trifocal (three foci, faint ghosting, more halo at night), toric
(the chosen design + cylinder correction, visibly removing the directional astigmatic blur). Verified by readback test
and screenshots.

Bundle: `scenes` chunk 9.5 KB → 20.9 KB, `pipeline` 10.0 KB → 11.3 KB, `vision-sim` 60.7 KB → 61.9 KB (minified, before
gzip); `chunk-recovery` adds ≈1 KB to the entry. three.js unchanged.

## Evidence

`docs/implementation/phase-2-final-closure/evidence/lens-lab/before/` and `after/` — 34 views each, same script
(`scripts/lens-lab-shots.mjs`, production build + `vite preview`, Chromium with ANGLE/D3D11): 1440×900, 390×844,
844×390; Arabic and English; light and dark; monofocal, enhanced, EDOF, trifocal, toric (and EDOF-toric); near,
intermediate, far; day, dim, night; More settings open; the Lens Lab A/B comparison.

## Test results

`PW_PORT=4731 PRERENDER_PORT=4736 npx playwright test tests/lens-lab.spec.js tests/lens-lab-mobile.spec.js
tests/lens-lab-distance.spec.js tests/vision-sim.spec.js tests/vision-optics.spec.js tests/vision-review.spec.js
tests/first-render.spec.js tests/lens-lab-recovery.spec.js --workers 2` — **210 passed, 0 failed** after the review fixes (7.8 min, Windows,
Chromium on the GPU via ANGLE/D3D11). 198 existing tests unchanged + 12 new recovery / pixel tests.

Two issues found and fixed during verification: (1) the near layer's lights had become its first child, which broke
the closer-view framing (`targetBox` reads `near.children[0]`) — lights are now added after the phone; (2) the existing
test "the closer view is the same picture seen closer" measures contrast inside the phone and was already borderline
(ratio 0.712 against a 0.70 limit on the old scene); the new phone screen has a message bubble, a large low-contrast
feature that makes the measure robust (0.746). No test was edited to pass.

The ocular-surface section placement is untouched by this change (main.js only changes `loadVisionSim`).

## Review fixes (independent review of 3fc3655)

1. **The stale-build check could wait on the stalled network itself.** `serverEntry()` now aborts its no-store HTML fetch
   after 4 s (AbortController + timeout on the body read) and treats it as "cannot tell", so the retry message always
   follows. New test F6b: the chunk AND the HTML check both hang → the retry message appears (≈ 24 s).
2. **Cross-fade pop on rapid changes.** The output stage now keeps three 8-bit targets (current, previous, spare). A
   change during a fade freezes the blended frame on screen as the new starting point, so a quick second change
   continues smoothly; a change before any new frame was drawn lets the running fade continue (no restart).
3. Shop-fascia lettering enlarged (22 → 30 px bold on the 512 px texture).
4. New absolute near-defocus check: with the eye set for far, the 40 cm phone under a monofocal stays below a fixed
   edge-energy bound (1.45; measured 1.27) and below 0.75 × the trifocal value (measured ratio 0.69).

## Gaps

- The owner's original failure was not reproduced; the fixes cover every plausible production cause found, but the
  owner's device/browser should be checked against this build (F1 is the most likely after a release).
- There is no separate 50 cm (tablet) layer: the model has three layers (near / intermediate / far); a 50 cm view is
  shown by moving the near layer with the exact-distance slider (More settings). Adding a fourth layer would change the
  model contract (`computeView`) and needs Dr. Maan's review.
- The 20 s download timeout on the public page is not exercised end-to-end at full length (the picture-code timeout
  is, with a shortened value through the public `loadTimeoutMs` option).
- WebKit / real iOS Safari were not run in this pass (Chromium only).
