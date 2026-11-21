# Trello closure evidence (2026-11-21)

Process used for each closed card:
1. Read the card in full (`_trello_full_read.md`).
2. Check every open requirement against code and tests on `feat/legacy-zero` at commit `7381728`.
3. Run the final suite: 752 passed, 0 failed, 0 flaky, 4 opt-in samples skipped (32 suites, 2 workers).
4. Post an evidence comment that names the tests and what is not claimed.
5. Mark the card complete.
6. Read the whole board back.

| # | Card | Evidence comment id | Key evidence | Not claimed |
|---|---|---|---|---|
| 11 | Phase 0 — doctor data integrity | 6b01d8e1ec21b608ee18b94c | phase0-content 14, content-registry 6, seo 4 | clinic approvals (#13) |
| 12 | Phase 1 — booking & mobile UX | 6b01d8e23bc5eab5bad3425b | phase1-mobile 52, phase1-pages 39, closure 40 | — |
| 14 | Booking fixes | 6b01d8e21d9c45de77d17a1e | phase1-mobile 52, closure 40 | — |
| 15 | Mobile regression tests | 6b01d8e302a5370b87faaf45 | suites in the CI gate; all pass | — |
| 16 | Independent review | 6b01d8e48470df1a841967b4 | REVIEWER_FINDINGS.md exists; new review LZ-05…08 fixed | — |
| 17 | Phase 0+1 verification | 6b01d8e5ef92bd39fd61c52b | deployed (402bc49); full run clean; npm audit 0 | clinic approvals (#13) |
| 20 | Bug register — patient journeys | 6b01d8e6311d16def06629e1 | BUG-11: routing 20/20, 404 live; BUG-18: 40/40 repeated intravitreal axe scans + axe 60/60 in 3 full runs. Both checklist items ticked. | — |
| 23 | Bug register — premium journeys | 6b01d8e7b7103510f054ae51 | premium-regressions 11, premium-journeys 38 | — |
| 24 | Throttled LCP | 6b01d8e8f5b680b9dd46fa82 | first-render 25; LCP home AR 2,756–3,036 ms, cataract AR 2,400–2,408 ms (was 4,272 / 5,796) | field data (needs tracking authorization) |
| 25 | Premium UX refinement | 6b01d8e9112cb72aaee7adb1 | hero-portrait 22, plates-clarity 46, lens-lab-mobile 57, returning-visitor 22 | real-phone check (#29), portrait (#4), physician review (#22) |
| 26 | Lens Lab closer view | 6b01d8eaefa57dc1c237a2bf | lens-lab-distance 38, lens-lab 25, lens-lab-jump 13, vision-sim 19 | wording review (#22), phone (#29) |
| 27 | Stability fixes | 6b01d8ebe283584613926442 | routing 20, technical-fixes 29, first-render 25, cataract-warmup 7 | — |

Status comments (cards kept open, stale "Closed by the owner" note corrected): #1, #2, #3, #4, #5, #7, #8, #9, #10, #13, #18, #19, #21, #22, #28, #29, #30, #31.

Checklist items ticked: #20 "P3 BUG-11 …" and "P3 BUG-18 …". No clinical, owner-acceptance or external item was ticked.
