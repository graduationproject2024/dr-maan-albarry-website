# Simulator clinical review: overview

This page explains how the two simulators are reviewed and what their review status is today.

Detailed workflows:

- [CATARACT_REVIEW_WORKFLOW.md](CATARACT_REVIEW_WORKFLOW.md)
- [VISION_REVIEW_WORKFLOW.md](VISION_REVIEW_WORKFLOW.md)

Authoritative record: [CLINICAL_APPROVAL_STATUS.md](../clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md).

## 1. Technical gates and clinical gates

| Kind | Who sets it | Where | Examples |
|---|---|---|---|
| **Technical** (automated) | Engineering, through automated tests | `tests/*.spec.js` | The optics are internally consistent (`vision-optics.spec.js`), anatomy constraints hold (`cataract-constraints.spec.js`), rendering is not blank, there is no overflow at 390 px, the controls work by keyboard. |
| **Technical** (manual) | An engineer, in review mode | Cataract "Engineering verification" gate | The stage renders and plays as the engineering notes describe. |
| **Clinical** | **Only Dr. Maan Albarry**, in review mode | Cataract: anatomical, motion, medical text. Vision: optical model, visual representation, Arabic text, English text. | Whether the anatomy, motion, optics, picture and wording are medically acceptable. |
| **Final physician approval** | **Only Dr. Maan Albarry** | Per stage or preset | Can only be chosen once every clinical gate is approved (or approved with corrections) for the current version. |
| **Official approval** | **Only Dr. Maan Albarry**, by signing | A signed entry in `CLINICAL_APPROVAL_STATUS.md` | The only thing that counts as approval. It allows the "pending physician review" labels to be removed. |

Passing tests is **not** clinical approval. A gate set in a browser, or an exported JSON file, is **not** official approval. Every export carries a `notOfficialApproval` statement and has no reviewer or signature field.

Both simulators share these rules (`src/sim-review/core.js`):

- Every gate starts as Pending review.
- No gate is ever set by the code.
- The final gate is guarded and gives its reasons when blocked.
- Each gate records the model version and content version when it is set. A change flags "Needs re-review" and the old record is kept.
- Legacy data is migrated without becoming an approval.

## 2. Current status

This was checked against `CLINICAL_APPROVAL_STATUS.md` on 2026-11-07. That file records **no approval, no reviewer, no date and no signature** for any stage, effect or text. Both its sections say "Pending review". No other evidence of physician review exists in the repository. **Every stage and every preset below is therefore Pending review for every gate.**

### Cataract simulator: model `csim-anatomy-2026.11-r2`

| # | Stage | Engineering verification | Anatomical | Motion | Medical text (AR + EN) | Final physician approval |
|---|---|---|---|---|---|---|
| 1 | `cloudy-lens` | Pending review | Pending review | Pending review | Pending review | Pending review |
| 2 | `preparation` | Pending review | Pending review | Pending review | Pending review | Pending review |
| 3 | `incision` | Pending review | Pending review | Pending review | Pending review | Pending review |
| 4 | `capsulorhexis` | Pending review | Pending review | Pending review | Pending review | Pending review |
| 5 | `phaco` | Pending review | Pending review | Pending review | Pending review | Pending review |
| 6 | `iol` | Pending review | Pending review | Pending review | Pending review | Pending review |
| 7 | `completion` | Pending review | Pending review | Pending review | Pending review | Pending review |

The engineering verification gate is new. Nobody has recorded it yet, so it is also Pending review. The automated cataract tests pass, but that is tracked separately in the test reports.

### Vision simulator: model `vsim-optics-2026.11-r1`

All 51 presets listed in [VISION_REVIEW_WORKFLOW.md §3](VISION_REVIEW_WORKFLOW.md#3-presets) have every gate at Pending review: optical model, visual representation, Arabic text, English text and final physician approval. This covers:

- 36 situation and lighting presets (6 lens profiles × signs, laptop, phone, book, night driving and distance at dusk);
- 6 refraction and astigmatism presets;
- 9 comparison presets.

The open clinical questions Q1–Q7 in `docs/phase-1/VISION_SIMULATOR_AUDIT.md` §6 are unanswered.

## 3. How a status becomes official

1. Dr. Maan reviews the material in review mode and sets the gates himself.
2. He exports the JSON file.
3. Dr. Maan, or someone acting on his written instruction, records the outcome in `CLINICAL_APPROVAL_STATUS.md`, signed by him. That record states the model version and the content version of each stage or preset, and the exported file can be attached.
4. If the model or a stage or preset changes afterwards, review mode flags it for re-review, and the record must be renewed for the changed items.
