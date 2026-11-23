# Branch reconciliation (2026-11-21)

| Branch | Tip | On origin | State |
|---|---|---|---|
| `main` | `9e1773f` | yes | **live** (GitHub Pages, deployed 2026-11-17 by run 44077997526) |
| `feat/final-stabilization` | `6b2dc50` | yes | docs commit after `9e1773f`; nothing to deploy |
| `feat/phase-2` | `4931c0d` | **no** | 11 commits on top of `6b2dc50`: Phase 2 fixes P2-01…P2-10, 3D start speed, motion validator, docs. Not pushed, not live |
| `feat/legacy-zero` | this milestone | **no** | on top of `feat/phase-2`: motion layer (Lenis, GSAP), security meta tags, docs |
| `feat/premium-ux-refinement`, `feat/premium-experience-reconstruction`, `feat/clinical-visual-reconstruction`, `feat/master-redesign-phase-2-3`, `feat/phase0-phase1-trust-booking-mobile`, `feat/phase-1-premium-experience` | older | yes | all merged into `main` history or superseded by it |
| `recovery/j-spa-complete-quality`, `claude/*`, `worktree-agent-*` | older | no | local experiment/agent branches; not part of the product |

Deployed vs undeployed: everything up to `9e1773f` is live; `feat/phase-2` and `feat/legacy-zero` are not. Deployment needs the owner's instruction.
