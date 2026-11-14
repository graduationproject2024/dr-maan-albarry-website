# Baseline

Captured on 2026-11-09 before any change. Repository `graduationproject2024/dr-maan-albarry-website`, `main` at `ea3e44d` (the live build at that time). Work branch: `feat/premium-ux-refinement`, created from that commit.

## Owner decision recorded

The owner approves the current visual design: "A — Premium Medical Editorial" with the anatomical atlas presentation. This work refines it and does not redesign it. No new directions were generated and no Stitch files were used.

## State of the code at the baseline

| Item | Baseline |
|---|---|
| Full Playwright suite (last run on `ea3e44d`) | 521 passed, 1 failed (Persona C scrubber tap, flaky under load), 24 skipped |
| Pages | 30 prerendered, 30 sitemap entries |
| LCP, emulated 390 px, Fast 3G + CPU 4x (2026-11-09) | Home Arabic 2,696 ms; cataract page 2,660 ms; home English 2,340 ms |
| Phone home height at 390 px | 9,153 px Arabic, 9,943 px English |
| Hero portrait | 174×133 px at 390 px, beside a 152 px anatomy image; 230×175 px on desktop, overlapping a 448 px anatomy image |
| `/lens-lab/` at 390 px, Arabic | 13,062 px tall; the simulator started 9,152 px down the page; picture and essential controls spanned 748 px with 708 px available; two WebGL contexts |
| Procedure plates | Up to 9 numbered pins shown at once on the main plate, with medical terms only |
| Portrait source | 295×225 px studio photograph; no larger original in the repository or its history |
| Clinical status | Every image and simulator stage pending physician review |

Evidence: `evidence/hero/before-*.jpg`, `evidence/lens-lab/before-*.jpg`, `evidence/images/*-before.jpg`. Earlier records: `docs/implementation/premium-experience-reconstruction/`.

All measurements are Chromium (and one WebKit journey) through Playwright on one Windows machine. No physical phone was used.

## Skills and agents

Skills loaded and applied: `ui-design`, `apple-design`, `web-design-guidelines`, `playwright-skill`, `21st-ui-build`, `21st-ui-review`, `21st-ui-explore`, `tailwind-ui`, `design-ai-tools`, `graphify` (code graph refreshed), `caveman` (chat replies only).

- The `21st` CLI is not installed, so the 21st skills' checklists were applied by hand; `21st-ui-explore` (three new directions) was not run, because the owner approved the design. `tailwind-ui` does not apply to this code base (plain CSS, no Tailwind) beyond its general responsive rules.
- `typography`, `design-systems`, `taste-and-craft`, `frontend`, `javascript-pro`, `i18n`, `animation-systems`, `performance-optimization`, `playwright-expert`, `seo` and the `threejs-*` skills are installed and were available to the agents. `12ui-design`, `responsive-design`, `css-architecture`, `accessibility` and `visual-regression` are not installed under those names.

Three general-purpose agents worked in separate git worktrees: mobile Lens Lab reconstruction; anatomical image clarity; flaky tests, section registry and returning visitors. The lead did the hero, merged and checked each branch, found and fixed the jump-landing defect and the portrait LCP, and ran the final suites. No agent performed physician review.
