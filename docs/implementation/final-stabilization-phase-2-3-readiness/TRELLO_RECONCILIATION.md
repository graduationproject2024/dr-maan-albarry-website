# Trello reconciliation (2026-11-17)

Board: https://trello.com/b/8CkEGIqW/dr-maan-website. Read before and after the changes; after the changes the "software" list holds 30 open cards (was 25), verified with a full list read.

## Updated

| Card | Change |
|---|---|
| #25 Premium UX refinement | Description corrected: the mobile Lens Lab rebuild and the other refinements are **live** since `c7cdbed` (2026-11-14). The old text said "on the branch, NOT live yet". |

## Created (no duplicates existed)

| Card | Scope | State |
|---|---|---|
| #26 Lens Lab: each distance brings a closer view; More settings in groups | Distance-selection experience + Advanced-mode refinement | Engineering done on the branch, not live; wording to Dr. Maan via #22 |
| #27 Stability fixes: Back position, short landscape, 404 page, loading reserve, faster first paint, 3D startup | Loading placeholders, landscape, routing, simulator performance | Done on the branch, not live; FS-10 open |
| #28 CI quality gate | Release pipeline | Written; not yet run on GitHub |
| #29 Real-device check | iPhone Safari, Android Chrome | Not done; no device used |
| #30 PROVISIONAL — next Phase 2 and Phase 3 | Phase planning | Needs the owner's scope; do not start |

## Comments added

| Card | Comment |
|---|---|
| #22 Pending physician review | The generated review queue (`CLINICAL_APPROVAL_QUEUE.md`) and the two new Lens Lab items |
| #4 update pics | No larger portrait exists; the replacement setting and script; the photo requirement |
| #20 Bug register (17 defects) | BUG-05 measured CLS ≤0.003 (lab); BUG-11 fixed on the branch. Suggested the owner closes it; not marked done |

## Not changed on purpose

- No card was marked done or archived. No clinical item was ticked.
- #13 (doctor/clinic decisions D-1 to D-14): unchanged.
- #10, #8, #9 and the other short owner cards: unchanged; referenced from #30 as candidates.
- #21 says "NOT pushed, merged or deployed" for an older branch whose work later went live through other merges; left for the owner, since the branch itself was never merged as such.
