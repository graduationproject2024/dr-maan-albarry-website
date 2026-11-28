# 10 — Before / After verification (all seven simulators)

The owner asked for Before / After on every procedure (brief 2026-11-23, §13). Earlier rule and wording:
`clinical-profile-expansion-and-ux-refinement/BEFORE_AFTER_VALIDATION.md`. This pass adds it to the one simulator that
lacked it, the dedicated cataract simulator.

Common rule (all seven):

- **Two moments of the same model**, seen from the **same camera**, with playback paused, so the only difference on
  screen is what the treatment changes in the eye.
- The camera is the first stage's camera. Since the 2026-11 camera pass (`08_SURGICAL_SIMULATOR_CAMERA_QA.md`), it is fitted to the screen and to the area left free by
  the controls, so the two views also match on phones.
- **Leaving the comparison:** Play, a seek, a stage choice or Restart; for the procedure simulators also a technique
  change, and for the cataract simulator also Replay stage.
- The caption describes the anatomical change only. It never promises a visual result or an instant cure, and every
  "after" carries a safeguard.
- Buttons are native `<button>` with `aria-pressed`, reachable by keyboard, 44 px tall or more on phones (cataract) and 40 px in the
  procedure simulators.
- Status of the wording: **draft, pending Dr. Maan's review**. Nothing is marked approved.

| # | Simulator | Before shows | After shows | Camera | "After" safeguard |
|---|---|---|---|---|---|
| 1 | **Cataract** (`src/cataract-sim`, cataract page and `/surgical-education/`) — **new** | end of stage 1: the clouded natural lens in its capsule, with the illustrative scattered light path | end of stage 7: the clear artificial lens (IOL) in the capsular bag, with the illustrative focused light path | stage 1 section view (whole globe) | depends on the health of the eye; glasses may still be needed for some distances |
| 2 | Lens implants (`ssim-iol`) | start of stage 1: the clouded natural lens in its capsule | end of the last stage: a clear artificial lens in the same capsule | stage 1 section | lens type decides the range of vision; glasses may still be needed |
| 3 | ICL (`ssim-icl`) | start: the eye with its clear natural lens, no added lens | end: ICL behind the iris, natural lens in place | stage 1 close section | natural lens stays; regular follow-up |
| 4 | Laser vision correction (`ssim-laser`, Femto-LASIK / PRK / SMILE tabs) | start: the cornea with its original curve | end: the cornea after its middle layer is reshaped | stage 1 corneal close-up | settles over days to weeks depending on the technique; results vary |
| 5 | Keratoconus / CXL (`ssim-cxl`, **CXL tab only**) | start: thin cornea bulging into a cone | end: corneal fibres more cross-linked | stage 1 front (tomography) | aims to slow or halt progression; **does not restore a normal shape instantly**; glasses / lenses may still be needed |
| 6 | Corneal transplant (`ssim-kpl`, PK / DALK / EK tabs) | start: the damaged corneal layer | end: donor tissue in its place | stage 1 front (exam) | recovery gradual, can take months; follow-up and anti-rejection drops |
| 7 | Intravitreal injections (`ssim-ivt`) | start: vitreous and retina before the injection | end: medicine in the vitreous near the retina | stage 1 posterior view | works gradually, often a series of injections; **not an instant cure** |

Keratoconus tab of `ssim-cxl`: there is no Before / After on that tab, because it shows the disease progressing and
that is not a treatment comparison.

Wording sources:

- Procedure simulators 2–7: `src/surgical-sim/procedures/compare.js`, both languages; unchanged in this pass.
- Cataract: `src/cataract-sim/ui.js` (`I18N.*.compare*`).

## Cataract simulator — details (new)

- **UI:** a "Before and after" / «قبل وبعد» group under the playback bar, with Before and After buttons and a caption.
  It is hidden while loading and in the illustrated (no-WebGL) fallback.
- **Controller:** `compare('before' | 'after')`; `getState().compare`.
- **States reused, no new anatomy:**
  - "Before" is stage 1 at 99.9 %: cataract density 1, no IOL, scattered rays on.
  - "After" is stage 7 at 99.9 %: IOL settled in the bag (fold 0), focused rays on.
  - The stage highlight glow is switched off in both, so the two views differ only in the lens and the light path.
  - The illustrative light-path caption ("not a vision test") shows in both.
- **Camera:**
  - Both views use stage 1's fitted camera. The covered area is identical: both are light-ray stages, and the caption is reserved in both.
  - Reset view inside the comparison returns to this camera.
  - A seek leaves the comparison and lands on that stage's own camera.
- **Announcements:** the caption is read once through the simulator's polite live region; the language switch keeps
  the comparison and translates the caption.

Wording (draft, pending review):

| | English | العربية |
|---|---|---|
| Before | Before: the natural lens has become clouded (a cataract), so light is scattered on its way to the retina. | قبل: أصبحت العدسة الطبيعية معتمة (الماء الأبيض)، فيتشتّت الضوء في طريقه إلى الشبكية. |
| After | After: the clouded lens has been replaced by a clear artificial lens in the same capsule. How well you see afterwards depends on the health of your eye, and glasses may still be needed for some distances. | بعد: استُبدلت العدسة المعتمة بعدسة صناعية شفافة داخل المحفظة نفسها. تعتمد جودة الرؤية بعد العملية على صحة العين، وقد تبقى الحاجة إلى النظارة لبعض المسافات. |

The "before" sentence restates the already-drafted stage 1 text: light is scattered instead of being focused.

Evidence:

- `evidence/cataract/after/<en|ar>/<desktop|portrait|landscape>/ba-before.jpg` and `ba-after.jpg`, also on the contact
  sheets `evidence/cataract/after/_sheet-*.jpg`;
- the controls with the caption: `evidence/cataract/after/_ba-controls-en-desktop.jpg` and `_ba-controls-ar-portrait.jpg`.

Phone note: on a 390x844 phone the viewer is revealed so its playback bar ends above the site's booking bar. The Before /
After buttons sit just above that bar, and the caption below it is read out (live region) and appears after a short
scroll.

## Tests

| Simulator | Test (file › name) | What it proves |
|---|---|---|
| Cataract | `cataract-camera.spec.js` › `cataract Before / After <1440x900 / 390x844> › <en / ar>: toggles two moments from one identical camera, with the wording, and leaves cleanly` (×4) | Checks, in both languages and at desktop and phone sizes:<br>• the group is named, the caption is hidden at first, and both buttons are ≥ 44 × 44 px;<br>• Before is stage 1, paused, with cataract 1, no IOL, scattered rays and no highlight;<br>• After (via keyboard Enter) is stage 7, with the IOL settled, focused rays and no highlight;<br>• the After camera and free area are identical to Before's, and equal stage 1's own camera;<br>• `aria-pressed` and the caption are correct in EN and AR;<br>• Reset view inside the comparison restores its camera;<br>• the language switch keeps the comparison and translates it;<br>• Play leaves it, and a seek leaves it and lands on the stage camera;<br>• one render loop. |
| Cataract | `cataract-camera.spec.js` › `Before / After is hidden when the 3D view is unavailable` | fallback hides it; the API is a no-op |
| 2–4, 6, 7 | `clinical-profile-expansion.spec.js` › `procedure simulators › <slug>: Before / After with responsible wording` (×5) | After = last stage, Before = first stage, caption visible, no "cure"/"guarantee" promise |
| 5 | `clinical-profile-expansion.spec.js` › `keratoconus: Before / After only on the cross-linking tab, without an instant-shape promise` | hidden on the keratoconus tab; CXL "after" carries the instant-shape safeguard |
| 2, 3, 6 | `surgical-sim.spec.js` › `camera <390x844 / 1440x900>: Before / After show two different moments from one fitted camera` | identical fitted camera for both moments, two different model states |

Run (this pass, Windows GPU via ANGLE, 2 workers):

`PW_PORT=4811 PRERENDER_PORT=4816 npx playwright test tests/cataract-sim.spec.js tests/cataract-stress.spec.js tests/cataract-review.spec.js tests/cataract-warmup.spec.js tests/cataract-refinement.spec.js tests/cataract-integration.spec.js tests/cataract-constraints.spec.js tests/clinical-profile-expansion.spec.js tests/cataract-camera.spec.js --workers 2`
→ **126 passed, 0 failed, 4 skipped** (the opt-in evidence / performance captures), 5.7 min. Of these, `cataract-camera.spec.js` contributes 14 tests, and `cataract-constraints.spec.js` reports 0 violations. An earlier run of the same set had one failure: the stress test's 80 mm desktop zoom ceiling was exceeded at 1280x800 with a 1.55 relative factor. The factor was set to 1.45 and the suite was rerun green.

Gap: in `surgical-sim.spec.js` the camera-identity check covers IOL, ICL and transplant. Laser, CXL and injections use the
same engine path (`compare()` → `goToCamera`), but they are covered only by the wording / state tests above.

## Physician review (added to `14_CLINICAL_REVIEW_PACKAGE.md`, N-09)

- The cataract Before / After wording in both languages.
- "After" shows the illustrative focused light path through the IOL to the retina, next to the scattered path in
  "Before". It carries the existing caption ("illustrative light path — simplified model eye, not a vision test") and the
  caption's safeguard. Please confirm that this contrast is acceptable and does not read as a promised result.
- "Before" is the end of stage 1 rather than its very first moment. At the first moment the light path is not drawn yet,
  and the rays are what makes the clouding understandable.
