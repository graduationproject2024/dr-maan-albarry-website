# Skills and agents used

Date: 2026-11-07. Branch: `feat/premium-experience-reconstruction`, created from `main` at `9322dd9` (the live build).

## 1. Discovery

The environment was checked at the start of the work. Everything below was found in the session's skill list or tool list, not assumed.

| Need (brief §1.1) | Found | Status |
|---|---|---|
| Visual design | `ui-design`, `apple-design`, `typography`, `color-theory`, `design-systems`, `landing-page-design`, `web-design-guidelines`, `taste-and-craft` | Installed |
| 21st.dev | `21st-ui-build`, `21st-ui-review`, `21st-ui-explore`, `21st-ai`, `21st-cli-use` | Skills are installed, but the `21st` CLI they call is **not**. `npx 21st` returns npm 404; the real package is `@21st-dev/cli`, and installing it was blocked in Phase 1. Their checklists were applied by hand, and 21st.dev was researched in a browser. |
| Claude Design | `DesignSync` tool; Artifact "Design" type | `DesignSync` only syncs an existing component library to claude.ai/design, so it cannot make designs. The hosted Design artifact was **not used**, because a hosted page bearing a real physician's name and photo should not be published outside the project. **Substitution:** the three directions were built as local HTML prototypes from the real content and photos, rendered in Chromium and screenshotted. |
| 12ui-design | Not present | Not installed. Its steps were followed by hand: analyse, then 3 candidates, inspect the renders, select, expand, integrate, and compare. |
| Image generation | None | No image-generation tool is available. Anatomical images come from the project's own three.js render pipeline (`scripts/illustrations/`). |
| Engineering | `threejs-*` (geometry, materials, lighting, camera, shaders, performance), `3d-web-experience`, `frontend`, `javascript-pro`, `i18n`, `animation-systems`, `scroll-experience` | Installed |
| Verification | `playwright-skill`, `playwright-expert`, `fullstack-guardian`, `performance-optimization`, `seo`, `web-design-guidelines` | Installed. The project's own Playwright and `@axe-core/playwright` are in `node_modules`. |
| Browser | Built-in browser pane; Playwright Chromium | Available |
| GitHub | GitHub MCP | Available. The `gh` CLI is not installed. Nothing is pushed without the owner's go-ahead. |
| Trello | Trello MCP | Available. The board was read on 2026-11-07. |
| Knowledge graph | `graphify` | `graphify update .` was run on 2026-11-07: 1,968 nodes, 4,174 edges, 133 communities. |

## 2. Skills the user named and how each was used

| Skill | Use |
|---|---|
| `caveman:caveman` | Chat replies only; the docs are written in plain English. |
| `graphify` | Refreshed the code graph before the structural changes. |
| `ui-design` | Hierarchy, spacing and consistency rules for the three directions and the final system. |
| `apple-design` | Typography (size-specific tracking and leading), motion, reduced motion, materials, wayfinding and feedback. |
| `21st-ui-build` | Workflow: search 21st.dev first, reuse project primitives, and adapt patterns to the real stack (vanilla JS/CSS, no React port). |
| `21st-ui-review` | Review checklist for the visual QA passes. The CLI is missing, so the checks were done by hand. |
| `playwright-skill` | Browser scripts for research, screenshots and journeys. |
| `fullstack-guardian` | Security pass, so that no private review evidence ships publicly. Review modes are kept to harness pages, and no secrets are stored. |

## 3. Agents

The table is filled in as each agent finishes.

| Agent | Type | Task | Output |
|---|---|---|---|
| Reference research | general-purpose | Madinah Cultivator AR/EN, dramralamin.com: full-page desktop and phone screenshots, plus measured DOM facts | `REFERENCE_SITE_AUDIT.md`, `MADINAH_CULTIVATOR_SECTION_MAP.md`, `MEDICAL_SITE_BENCHMARK.md` |
| 21st.dev research | general-purpose | Category browsing and a component shortlist | `21ST_COMPONENT_RESEARCH.md` |
| Baseline | general-purpose | Before screenshots at 7 widths, mobile-hiding audit, content inventory | `evidence/before/`, `BEFORE_AFTER.md`, `HOMEPAGE_CONTENT_MATRIX.md`, `MOBILE_DESIGN.md` |
| Simulator review modes | general-purpose (own worktree) | Cataract review gates and versioning; new vision-simulator review mode; tests | `CATARACT_REVIEW_WORKFLOW.md`, `VISION_REVIEW_WORKFLOW.md`, `SIMULATOR_CLINICAL_REVIEW.md` |
