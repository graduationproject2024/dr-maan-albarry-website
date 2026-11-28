# Trello full inventory (read 2026-11-24)

Board: https://trello.com/b/8CkEGIqW/dr-maan-website. One list ("software"), 32 cards, 0 archived, no checklists, no comments on any card.
Read with `trelloReadCard list_by_board filter=all` (one page, `hasNextPage: false`).

"Marked complete" = Trello's complete flag today. "Stale text" = the description contradicts GitHub (main `4e55b40`, deployed by run 45242684926).

| # | Card | Complete flag | What the card asks / says | Real state found | Class |
|---|---|---|---|---|---|
| 1 | update UI/UX | no | (empty) | Superseded by #18/#21/#25; design owner-approved 2026-11-09 | SUPERSEDED (by #18, #25) |
| 2 | security | no | (empty) | Gate runs npm audit + security spec; Semgrep/Gitleaks/OSV/CodeQL/ZAP never run | OPEN — ENGINEERING |
| 3 | buying domain and server | no | (empty) | GitHub Pages only; drmaanalbarry.com does not resolve (D-14) | BLOCKED — EXTERNAL (purchase) |
| 4 | update pics | no | (empty) | Portrait done; device + gallery photos missing | BLOCKED — EXTERNAL (photos) |
| 5 | feeding website with real data | no | (empty) | doctor-data.js + clinical-profile.js live; open facts on #13/#32 | PARTLY BLOCKED — EXTERNAL |
| 6 | link with real Links | yes | (empty) | Real Magrabi phone/WhatsApp/booking portal links live | DONE (verify links) |
| 7 | Make Automatiom | no | (empty) | Not defined anywhere | SCOPE QUESTION |
| 8 | MAKE RESERVATION SYSTEM | no | (empty) | Site links to Magrabi booking portal; no own booking | SCOPE QUESTION |
| 9 | make bot in website | no | (empty) | No bot | SCOPE QUESTION |
| 10 | make animation for procedures and services | no | (empty) | 7 procedures with 3D simulators live | Engineering mostly done; camera work open (see #32 brief §20) |
| 11 | Phase 0 — doctor data integrity | yes | "local, not pushed" | Live on main | DONE; stale text |
| 12 | Phase 1 — booking & mobile UX | yes | verified | Live | DONE |
| 13 | PENDING EXTERNAL APPROVAL D-1…D-14 | no | clinic decisions | Owner says Dr. Maan approved existing info; D-items still unanswered individually | BLOCKED — EXTERNAL |
| 14 | Booking fixes | yes | done | Live | DONE |
| 15 | Mobile regression tests | yes | 92 tests | Now 383 gate tests | DONE |
| 16 | Independent review | yes | done | — | DONE |
| 17 | Phase 0+1 verification | yes | "not pushed" | Live | DONE; stale text |
| 18 | REOPENED premium redesign | no | owner rejected old UI | Owner approved new design 2026-11-09 | Ready to close after owner sees evidence |
| 19 | Clinical & visual reconstruction | no | "NOT pushed" | Live | Engineering DONE; stale text; clinical approval on #22 |
| 20 | Bug register 17 defects | yes | BUG-05 open | BUG-05 status to recheck | Recheck BUG-05 |
| 21 | Premium experience reconstruction | no | "NOT pushed" | Live | Engineering DONE; stale text |
| 22 | PENDING PHYSICIAN REVIEW | no | plates + simulators | No review record yet | BLOCKED — EXTERNAL (Dr. Maan) |
| 23 | Bug register BUG-19…28 | yes | fixed on branch | Live | DONE |
| 24 | Throttled LCP | yes | open item | Fixed by prerender adoption (#27) | DONE (re-measure) |
| 25 | Premium UX refinement | yes | live | Live | DONE |
| 26 | Lens Lab distance views | yes | "local, not pushed" | Live; owner still reports Lens Lab problem | Reopen work under brief §18 |
| 27 | Stability fixes | yes | FS-10 open | FS-10 to recheck | Recheck FS-10 |
| 28 | CI quality gate | no | full regression never run | Full regression failed 52/840 (run 45169661762); sharded rerun 45402597982 | OPEN — ENGINEERING |
| 29 | Real-device check | no | physical phone pending | Branch changes since then untested on devices | OPEN (device QA) |
| 30 | Phase 2 clinical visualization | no | "NOT pushed" | Live (PR #3) | Engineering DONE; stale text |
| 31 | Bug register Phase 2 devices | no | "NOT live" | Live (PR #3) | DONE; stale text |
| 32 | Clinical profile expansion | no | "NOT pushed, NOT live" | Live (PR #4 + #5, run 45242684926) | Engineering partly done; photos/claims external; visual items open |

Nothing closed in this pass. Closure happens per card once its evidence is in `21_TRELLO_CLOSURE_EVIDENCE.md`.
