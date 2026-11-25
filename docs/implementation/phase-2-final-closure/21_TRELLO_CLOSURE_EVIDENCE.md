# Trello closure evidence (2026-11-25)

Owner authorization: brief of 2026-11-24 §2 (close a card only after its work is genuinely done and verified).
Each closed card got a "STATUS: DONE — VERIFIED" comment first, then `mark_done`, then a read-back (`complete: true` confirmed).

| Card | Closed as | Basis |
|---|---|---|
| #31 Bug register — Phase 2 devices | DONE — VERIFIED | 8 fixes live since PR #3; 0 open; full GPU suite 914/914 at `90dcb94` |
| #19 Clinical & visual reconstruction | DONE — VERIFIED (engineering) | live; full suite green; clinical review stays on #22 (comment says so) |
| #21 Premium experience reconstruction | DONE — VERIFIED (engineering) | live; owner approved design; clinical review stays on #22 |
| #18 Premium original redesign (reopened) | DONE — VERIFIED | owner approved the current design 2026-11-09, restated 2026-11-24 |
| #1 update UI/UX | DONE — SUPERSEDED | replaced by #18 / #25 |

Other updates (not closed):
- Titles corrected (stale "NOT live"): #30, #31, #32.
- #30 checklist: only "Push, PR, merge and deploy" ticked (PR #3 merged, deployed). Real-device QA and Dr. Maan's review of the 9 models stay unticked.
- Correction comments 2026-11-24: #19, #21, #28, #30, #31, #32.

Kept open, with reason:
| Card | Why open |
|---|---|
| #2 security | scanners run and findings fixed (15_SECURITY_RESULTS.md); response headers need a host that can set them (#3) |
| #3 domain/server | purchase — owner |
| #4 update pics, #5 real data | device and gallery photos, claim evidence — owner / Dr. Maan |
| #7 automation, #8 reservation system, #9 bot | scope undefined (empty cards) — owner to define or cancel |
| #10 procedure animations | camera/Light Journey/Lens Lab/ICL work merged on the closure branch, not yet live |
| #13 D-1…D-14, #22 physician review | external (clinic / Dr. Maan) |
| #28 CI gate | GitHub full regression still fails on GPU-less runners (19_FULL_REGRESSION_RESULTS.md) |
| #29 real devices, #30 | physical-phone / real-device check of the new build not done |
| #32 clinical profile | photos, claim evidence, physician review |
