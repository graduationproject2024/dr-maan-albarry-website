# Cataract simulator: clinical review workflow

**Status of every stage: Pending review.** Nothing in this document, in the code or in any exported file is a clinical approval. See "What counts as official approval" below.

Code: `src/cataract-sim/review.js` (panel and data), `src/sim-review/core.js` (gate rules shared with the vision simulator), `src/sim-review/styles.css`.
Tests: `tests/cataract-review.spec.js`.

## 1. How Dr. Maan opens review mode

Review mode is never shown on public pages. It opens in two ways:

- The internal harness page: `cataract-sim-preview.html?lang=en&review=1` (or `lang=ar`). Add `&reduced=1` to start without motion. The harness page is only built when `CSIM_HARNESS=1` is set, which the test runner sets. To use it locally, run `CSIM_HARNESS=1 npm run build` and then `npx vite preview`.
- From code: `mount(host, { review: true })`.

The review panel appears below the simulator. It works in Arabic and English (the harness has a "Toggle language" button), in light and dark themes, by keyboard, and on a 390 px wide phone.

## 2. Controls

| Control | What it does |
|---|---|
| Stage | Selects one of the 7 stages. The gates, notes, issues and screenshots below always belong to the selected stage. |
| Speed | Playback at 0.25×, 0.5× or 1×. |
| −1 / +1 | Pause and step one frame (1/30 s of animation time) back or forward. |
| Position read-out | `p` (progress through the stage, 0 to 1), the frame number within the stage and the animation time in seconds. |
| Stage view / Surgeon (front) / Side | Camera presets. You can also orbit freely with the mouse. |
| Save screenshot | Downloads a PNG of the 3D view, named `cataract-sim-stage{n}-p{p}.png`, and records a reference to it (file name, frame, time, camera, model version) under the stage. The image itself stays on your computer. |
| Layers | Show or hide cornea, iris, lens and capsule, IOL, instruments and light rays. |
| Review gates | Five separate gates for the stage (section 3). |
| Notes for this stage | Free text, saved as you type. |
| Add issue at current frame | Saves the text with the current `p`, frame, time, camera (target, distance, azimuth, polar angle), model version and stage content version. |
| Export JSON / Import JSON | Section 5. Both buttons work with the keyboard. |

## 3. Review gates (separate per stage)

Each stage has five gates. Each one is set independently, and only by the reviewer clicking an option or pressing an arrow key in that gate. No gate is ever set by the code.

| Gate | States | What it covers |
|---|---|---|
| Engineering verification | Pending review, Verified, Failed | The rendering works as the engineering notes describe (no glitches, correct stage boundaries). This is a technical gate. |
| Anatomical review | Pending review, Approved, Approved with corrections, Rejected | Anatomy shown in the stage. |
| Motion review | same four states | Instrument paths and tissue motion. |
| Medical text review (AR + EN) | same four states | The stage title, explanation and focus text in both languages. |
| Final physician approval | same four states | The physician's overall sign-off for the stage, recorded in this browser. |

Rules:

- **Every gate starts as Pending review.**
- **Final physician approval cannot be set to Approved or Approved with corrections** while the anatomical, motion or text gate is pending, rejected, or was recorded for an older version. Those two options are disabled, and a yellow box lists the reasons, for example "Motion review is rejected". The code also refuses the change if the disabled option is forced. Rejected can always be chosen.
- Engineering verification is recorded separately. It does not block the final clinical gate.
- If a clinical gate is changed to Rejected after final approval was recorded, the final approval is **not** changed automatically. Instead, a red notice says the conditions are no longer met and asks the reviewer to reconsider it.
- Each time a gate changes, the earlier record is moved to "Earlier gate records". It is kept as evidence and is not deleted.
- The time shown next to a gate is the moment the reviewer clicked it in this browser. It is not an approval date.

## 4. Versioning and re-review

Each gate stores two versions at the moment it is set:

- the **model version** (`MODEL_VERSION` in `src/cataract-sim/anatomy.js`, currently `csim-anatomy-2026.11-r2`);
- the **stage content version** (`stg-xxxxxxxx`). This is a hash of the stage's titles, texts, focus text, camera preset, highlight, sources, playback duration, and the scene parameters the stage produces at p = 0, 0.1, … 1. Changing the stage's anatomy or motion code changes those parameters, so it changes the hash. The panel shows the current value under "Stage content version".

If either value differs from the current one, the stage shows **"Needs re-review (changed since vX)"** and each affected gate is flagged. The old status stays visible and stays in the export. The final gate is blocked until each flagged clinical gate is set again. To confirm the same status for the new version, use the "Confirm … again for the current version" button under that gate. A status set again moves the old record to the history.

## 5. Export and import

**Export JSON** downloads `cataract-sim-review-{model version}.json`, containing:

- `format: "csim-clinical-review"`, `formatVersion: 2`, `simulator: "cataract-sim"`, `modelVersion`, and `exportedAt` (the time of the export click);
- `notOfficialApproval` and `notOfficialApprovalAr`: a disclaimer stating that the file is not an official approval, carries no signature and names no reviewer;
- per stage:
  - `title` (AR/EN), `currentModelVersion` and `currentContentHash`;
  - `needsReReview`, `staleGates` and `changedSinceModelVersions`;
  - `finalApprovalAllowedNow`, `finalApprovalBlockedBy` (reasons) and `finalApprovalInconsistent`;
  - `gates` (each with `status`, `modelVersion`, `contentHash` and `setAt`) and `history`;
  - `notes`, `issues` (text, `p`, `frame`, `timeS`, `camera`, versions) and `screenshots` (file name, frame, time, camera, versions);
  - `legacy`.

The file has **no reviewer name, signature or approval-date field**. A test checks this.

**Import JSON** replaces the review in this browser with the file's contents:

- An unknown status becomes Pending review. It never becomes an approval.
- A file made for another model version is accepted. Stages that changed since then are flagged for re-review.
- **Old files (format 1, one status per stage)** are migrated:
  - The old status is kept as `legacy` and shown as "Earlier single status from an old review file (format 1): …". It is **not** converted into any gate.
  - Every gate stays Pending review.
  - Notes and issues are kept. The frame and time of old issues are calculated from their `p`.
- The same migration is applied to an old record already saved in the browser (localStorage key `csim-clinical-review`).

## 6. What counts as official approval

Only a **signed record placed by the physician in `docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md`** is an official approval.

- Statuses saved in a browser are working notes. They can be lost, edited or copied.
- An exported JSON file is supporting evidence that the physician can attach to that record. It is not the approval itself.
- No one other than Dr. Maan Albarry may write a reviewer name, date or signature into that file for him.
- The public "pending physician review" badge and disclaimer stay until that signed record exists for both the visuals and the wording.
