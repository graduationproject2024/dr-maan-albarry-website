# Existing branch reconciliation

| Branch | Relation to this work | Action |
|---|---|---|
| `main` (9e1773f, live) | Base of everything | Not touched |
| `feat/phase-2` (b9aada8) | Contained in `feat/legacy-zero` | Not touched |
| `feat/legacy-zero` (3c2da42, pushed 2026-11-22) | Base of `feat/phase-2-simulators`. Its PR to `main` is waiting for the owner. | Not touched. If it is merged first, `feat/phase-2-simulators` follows it without conflicts, because it only adds commits on top. |
| `feat/phase-2-simulators` (new, local) | This milestone | All Phase 2 simulator commits |
| Older feature branches (`feat/final-stabilization`, `feat/premium-*`, `feat/master-redesign-phase-2-3`, …) | Already merged into `main` or superseded | Not touched |
| `claude/*`, `worktree-agent-*`, `recovery/*` | Temporary branches from earlier agent sessions | Not touched. Deleting them is the owner's decision. |

No existing work was overwritten. The cataract simulator changed in two places only, and both are covered by tests:
- the wheel policy;
- full-screen mode.

The rest of the cataract simulator, its stages and its anatomy are unchanged.
