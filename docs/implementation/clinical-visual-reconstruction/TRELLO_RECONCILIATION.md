# Trello reconciliation — 2026-11-02

Board: https://trello.com/b/8CkEGIqW/dr-maan-website, list "software".

**How this was verified:** after all writes, the board activity feed and both new cards' checklists were re-read. The table below reflects that re-read, not the write responses.

## Discovered at start (18 cards)
All 18 cards were read before any change. Relevant to this work:
- #1 "update UI/UX": its complete flag is set, but it carries a REOPENED comment.
- #18 REOPENED redesign.
- #10 animations.
- #5 real data.
- #13 PENDING EXTERNAL APPROVAL.
- #2 security.
- #4 update pics.

## Created
| Card | Checklist (re-read) | State |
|---|---|---|
| [#19 Clinical & visual reconstruction](https://trello.com/c/zuYZ8RCL) | Acceptance gates **7/11**. Open: clinical review by Dr. Maan, owner visual acceptance, real-device and screen-reader testing, push/deploy authorization. | **Open** |
| [#20 Bug register — patient-journey QA](https://trello.com/c/8qITIvEl) | Defects **5/7**. Open: BUG-05 (font-swap layout shift, P2) and BUG-11 (404 fallback, P3, partly fixed). | **Open** |

## Updated (comments; no card was marked complete)
| Card | Update |
|---|---|
| #1 update UI/UX | Still reopened. Both earlier UI results were rejected. The API cannot clear the complete flag, so it carries a "treat as not done" comment. |
| #18 REOPENED redesign | The navy/gold design was also rejected and replaced by the "clinical atlas" design. Stays open until the owner accepts. |
| #10 animations | Cataract 3D and vision simulator rebuilt, and illustrations added. Stays open: clinical review is pending. |
| #5 real data | Procedure scope recorded. Stays open: the written record and the page review are pending. |
| #13 pending approvals | Added external items (a)–(f): page, stage, model and illustration reviews; the scope record; the BUG-05 decision. |
| #2 security | Security results posted. Stays open: hosting and HTTP headers are not covered. |
| #4 update pics | Procedure illustrations added. Stays open: a studio portrait is still wanted. |

## Not touched
- **Unrelated cards:** buying domain and server, Make Automatiom, MAKE RESERVATION SYSTEM, make bot in website.
- **Phase 0/1 historical cards:** #6, #11, #12, #14–#17.

## Failed operations
None. The only limitation is the one already known: the API cannot reset a card's complete flag (#1).
