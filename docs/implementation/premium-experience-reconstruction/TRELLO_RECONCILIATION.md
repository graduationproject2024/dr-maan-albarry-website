# Trello reconciliation

Board: https://trello.com/b/8CkEGIqW/dr-maan-website. Reconciled on 2026-11-08 through the Trello integration.

The board was read before any change (20 cards) and read again after the changes (24 open cards). No card was archived or duplicated, and no existing card's description was edited.

## New cards

All are in the list "software".

| # | Card | State | Why it is a new card |
|---|---|---|---|
| [21](https://trello.com/c/okVpWtNG) | Premium experience reconstruction — engineering tracker (branch only, not live) | Open | No existing card tracked this work. It holds a 17-item checklist, one item per track in the brief. 16 are ticked on their engineering criteria. "External clinical approvals" is not ticked. It stays open until the branch is merged on the owner's instruction. |
| [22](https://trello.com/c/ITG2Msu0) | PENDING PHYSICIAN REVIEW — anatomical plates and both simulators | Open | Keeps clinical work apart from engineering defects. 8 checklist items, none ticked. Card #13 covers doctor data decisions D-1 to D-14, which is a different subject. |
| [23](https://trello.com/c/0XIKRgqA) | Bug register — premium journeys (BUG-19 to BUG-28, all fixed on the branch) | Complete | Its own criteria passed: each bug has a named regression test, and the full suite passed. This does not imply that the redesign is accepted. |
| [24](https://trello.com/c/KaxZd1wg) | Throttled LCP got worse — app replaces the prerendered page on first load | Fixed on 2026-11-09 | Engineering item; numbers in a comment on the card. |

## Existing cards updated (comment only)

| # | Card | Change | State |
|---|---|---|---|
| [18](https://trello.com/c/5BmdrjxS) | REOPENED — Premium original redesign | Status comment | **Stays open until owner acceptance** |
| [19](https://trello.com/c/zuYZ8RCL) | Clinical & visual reconstruction | Status comment; notes that "not pushed" in its description is out of date | Stays open (clinical and owner acceptance) |
| [20](https://trello.com/c/8qITIvEl) | Bug register — patient-journey QA (17 defects) | Comment: its close condition is met (BUG-05 Fixed; CLS re-measured as 0 in 3/3 runs at 320 and at 360 px on this build) | **Still open.** Marking it complete was refused by the session's permission check, so the owner decides (see below). |
| [4](https://trello.com/c/x5dmJu82) | update pics | Comment: portrait, image permission and the do-not-restore decision needed from the owner | Stays open |

## Left unchanged on purpose

Cards #1, #2, #3, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #15, #16 and #17. This work does not change their state. Card #10 (animation for procedures and services) is not finished by the static plates, so it stays open.

## Tracks asked for in the brief

| Track | Where |
|---|---|
| Reference research, skill discovery, three directions, chosen direction, typography, homepage, procedure gallery, secondary pages, mobile design, simulator presentation, browser tests | Card #21, ticked |
| Anatomical images | Card #21 (rendered and integrated), card #22 (physician review, pending) |
| Cataract review mode, vision review mode | Card #21 (the tool), card #22 (the decisions, pending) |
| Visual QA | Card #21 (four engineering passes), card #18 (owner acceptance, pending) |
| Bug fixes | Card #23; open engineering item on card #24 |
| External clinical approvals | Card #22 and card #13, both open |

## Decision for the owner

Card #20's own text says it stays open until BUG-05 is resolved, and BUG-05 is resolved. The owner can mark it complete, or keep it open for the BUG-11 partial fix.
