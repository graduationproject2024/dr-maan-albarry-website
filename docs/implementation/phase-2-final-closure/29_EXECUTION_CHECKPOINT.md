# Execution checkpoint — Phase 2 final closure

Updated: 2026-11-24. Branch `feat/phase-2-final-closure` (from main `4e55b40`), draft PR #6.

## Done
- Baseline: main `4e55b40` deployed by run 45242684926 (success). Last full regression 45169661762 (on PR-#3 code): 52 failed, 3 flaky, 788 passed, 24 skipped — mostly 3D timeouts on Linux SwiftShader, job near its 2 h cap (BUG-C01).
- `full-regression.yml` → 4 shards × (ubuntu, windows). Run 45402597982 dispatched on the branch.
- `security.yml` (CodeQL, Semgrep, Gitleaks redacted, OSV-Scanner, npm audit, ZAP baseline) — runs on PR #6.
- AI Kitchen: 12 agents in `.claude/agents/`, routing in `CLAUDE.md`, `.claude/settings.json` (sonnet/medium). Project agents load on the next session start; in this session the same roles ran as `general-purpose` with `model: opus`.
- Trello read: `03_TRELLO_FULL_INVENTORY.md`. Nothing closed yet.
- graphify graph refreshed (3,950 nodes; screenshots skipped).

## In progress (Opus agents, own worktrees, no shared files)
| Workstream | Worktree / branch | Doc |
|---|---|---|
| Light Journey visuals | `C:\w\lj` / `wt/lj` | 07 |
| Surgical cameras | `C:\w\cam` / `wt/cam` | 08 |
| Lens Lab recovery + visuals | `C:\w\ll` / `wt/ll` | 06 |
| ICL illustration | `C:\w\icl` / `wt/icl` | 09 |

## Next
1. Review each agent branch (Sonnet cross-model review), merge into `feat/phase-2-final-closure`, rerun gate + touched suites.
2. Read sharded full-regression + security results; fix real failures/findings.
3. Recheck BUG-05 (font CLS), FS-10, P3 items; performance re-measure.
4. Before/After + labels-hidden check on cataract sim; doctor-content verification.
5. Trello: evidence comments, close verified cards, fix stale text, read back.
6. Device QA (BrowserStack needs owner OK for minutes), final acceptance audit.

## External (cannot be done by engineering)
Device photos, gallery photos, "first" claim evidence, EDOF year, dropless paper, 25,000+ attribution, association name, D-1…D-14, physician review, domain purchase, scope of cards #7/#8/#9.

## Update 2026-11-25
- All four rebuilds reviewed (Sonnet cross-model) and merged: ICL `5d249c0`, Light Journey `82e51f3`, Lens Lab `ad66ec0`, cameras `412c1a4`.
- Fixes found by full runs: Lens Lab section order + restore loads pending modules (`90dcb94`), focus in fade-in blocks, journey test drift (`ffed997`), CodeQL (`c65c548`, clinical-queue).
- Full GPU suite at `90dcb94`: 914 passed, 0 failed (19).
- Security: all scanners run, findings fixed (15).
- Trello: 5 cards closed with evidence (21); titles corrected.
- Next: GitHub full regression 45635244805 (Linux `lj-label` width); decide CI GPU layer (owner); performance re-measure (17); device QA (18, needs owner OK for BrowserStack); physician review package (14); final acceptance audit; owner OK to merge PR #6 / deploy.

## Update 2026-11-28 — gate B "every simulator": cataract cameras + Before / After
- Branch `wt/cat` (worktree `C:\w\cat`, from `7322bde`; not yet merged).
- The cataract simulator now uses the fitted-camera approach (08, "Cataract simulator"): free-area framing, RTL-aware,
  deterministic camera on seek, relative zoom limits, re-fit on resize.
- Fixed in the same pass:
  - view tools cut off on 844x390;
  - tool row 2 px past the edge on 390;
  - stale frame after a paused seek;
  - camera could enter the globe in stage 7.
- Before / After added (10). Wording pending physician review (14: N-10, N-11).
- Tests: the required cataract + clinical set plus the new `cataract-camera.spec.js` → 126 passed (e31fad6). After the independent-review fixes: 132 passed, 0 failed, 4 skipped.
- Evidence: `evidence/cataract/before/`, `evidence/cataract/after/`.
