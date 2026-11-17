# Skills, agents and tools actually used

Honest list. The brief names many skills; only what really did work is listed as used.

## Used

| Tool | What it did |
|---|---|
| Claude Code (one session, no sub-agents) | All code, tests and documents in this milestone |
| Playwright (`@playwright/test` 1.64) | Every test, the measurement scripts (perf, 3D startup, landscape, reservation, atlas audit, captures), CPU profile via the Chrome DevTools Protocol |
| Built-in browser pane | Debugging the simulator mount error; checking the preview server |
| `git worktree` | Building the live commit `c7cdbed` side by side for fair before/after measurements |
| Trello connector | Reading the board; updates listed in `TRELLO_RECONCILIATION.md` |
| GitHub CLI (`gh run list`) | Verifying the last deployment |
| Python + Pillow | Image sizes, contact sheets, the portrait script |

## Listed in the brief but not invoked in this milestone

`/caveman` (used earlier in the session for chat style only), `/graphify`, `/ui-design`, `/21st-ui-explore`, `/21st-ui-build`, `/21st-ui-review`, `/tailwind-ui`, `/playwright-skill`, `/apple-design`, `/fullstack-guardian`. None was invoked as a skill in this milestone. Their subject areas were covered directly (UI review by measurement and screenshots; Playwright by the test runner; security by the CI permissions and audit), but no claim is made that those skills ran.

No sub-agents, design agents or external design tools (Stitch, Claude Design) were used. No medical reviewer took part: every clinical item is pending.
