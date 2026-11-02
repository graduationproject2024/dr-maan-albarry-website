# Cataract simulator: clinical approval status

Model version under review: `csim-anatomy-2026.11-r2`

**No stage has been approved.** Every stage is **Pending review**. No reviewer, date or signature has been recorded, and none may be added until Dr. Maan Albarry has actually reviewed the stage.

| # | Stage id | Visual / motion status | Text status | Reviewed by | Date |
|---|---|---|---|---|---|
| 1 | `cloudy-lens` | Pending review | Pending review (`draft-pending-clinical-review`) | — | — |
| 2 | `preparation` | Pending review | Pending review | — | — |
| 3 | `incision` | Pending review | Pending review | — | — |
| 4 | `capsulorhexis` | Pending review | Pending review | — | — |
| 5 | `phaco` | Pending review | Pending review | — | — |
| 6 | `iol` | Pending review | Pending review | — | — |
| 7 | `completion` | Pending review | Pending review | — | — |

## How to review (clinical review mode)

1. Open the harness with `?review=1`, for example `cataract-sim-preview.html?lang=en&review=1`. An integrator can also call `mount(host, { review: true })`.
2. For each stage, use the review tools:
   - select the stage;
   - play it at 0.25× or 0.5×, or step frame by frame (±1/30 s);
   - use the Stage / Surgeon / Side cameras, or orbit freely;
   - toggle the layers (cornea, iris, lens & capsule, IOL, instruments, rays);
   - save screenshots.
3. Record your findings:
   - add notes for the stage;
   - add issue annotations, each of which stores the current p and camera;
   - set the status: **Pending review**, **Approved**, **Approved with corrections** or **Rejected**.
4. Click **Export JSON**. The file includes the model version, and it is the review record to hand back. **Import JSON** restores a review. If a file was made for a different model version, a warning appears, and any unknown status is read as Pending.

## Rules

- A status saved in a browser (localStorage) is a working note only. This document is the authoritative record and is updated only from an exported review that Dr. Maan Albarry has signed off.
- Every stage defaults to Pending. The code never pre-fills or infers an approval.
- Approving the visuals does not approve the wording, and the reverse is also true. Both columns must be approved before the public "pending physician review" badge and disclaimer phrase can be removed (see `docs/implementation/master-redesign-phase-2-3/CLINICAL_REVIEW.md`).
- If the model version changes, earlier approvals must be re-confirmed for the stages that changed.
