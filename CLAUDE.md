# Dr. Maan Albarry website — project notes for Claude

Vite vanilla-JS SPA, prerendered (`scripts/prerender.mjs`), Three.js simulators, GSAP + Lenis (desktop only), GitHub Pages.
Arabic RTL default at `/`, English at `/en/`. Light and dark themes.

- Deploy: merge to `main` → `deploy.yml` runs the gate (`verify.yml`) and publishes only if it passes.
- Test layers (`tests/layers.mjs`, owner decision 2026-11-25): GitHub has no GPU, so WebGL suites can't run there.
  - CPU layer: `npm run test:cpu` — GitHub `full-regression.yml` (manual + weekly).
  - GPU layer: `npm run test:gpu` — **run on a machine with a real GPU before every release** and record the result
    (commit, date, passed/failed) in that release's docs and in the PR. A release without a green GPU run is not ready.
- Local tests: `PW_PORT=4671 PRERENDER_PORT=4676 npx playwright test <files> --workers 2` (production build; Windows uses the GPU via ANGLE).
- Design is owner-approved ("Premium Medical Editorial" + anatomical atlas). Do not redesign; refine.
- Never invent clinical facts, publications, credentials or physician approvals. Medical changes go to the physician-review record.
- Trello: close a card only after its work is implemented, tested and verified, with an evidence comment; never bulk-close.

## AI Kitchen — Three-Model Routing

Available model families:
- Haiku
- Sonnet
- Opus

Never require Fable.

Routing:
- Search and inventory → Haiku, low (`code-searcher`).
- Mechanical changes → Haiku, low (`mechanical-editor`).
- Planned implementation → Sonnet, medium (`implementer`).
- Routine tests → Sonnet, low (`test-runner`).
- Complex tests → Sonnet, medium/high.
- Premium frontend design → Opus, medium/high (`frontend-specialist`).
- Three.js, medical visualization and difficult bugs → Opus, high/xhigh (`medical-3d-specialist`, `bug-specialist`).
- Architecture and project planning → Opus, xhigh (`principal-architect`).
- Security audits → Opus, xhigh (`security-auditor`).
- Review Sonnet implementations → independent Opus reviewer (`reviewer`).
- Review Opus implementations → independent Sonnet reviewer (`cross-model-reviewer`),
  with fresh-context Opus verification for critical changes.
- Final acceptance → independent Opus auditor, xhigh (`acceptance-auditor`).

Increase reasoning effort before unnecessary model switching.
Escalate after one substantive failed approach.
Use narrow task-specific context.
Preserve evidence-backed task state (`docs/implementation/phase-2-final-closure/29_EXECUTION_CHECKPOINT.md`).
Never close unfinished Trello cards.
