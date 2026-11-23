# Skills and agents used

| Skill / agent | Used for | Outcome |
|---|---|---|
| `apple-design` | motion rules: purpose, short decelerating curves, same path in and out, interruptible, reduced motion = none | `MOTION_DESIGN_RULES.md`, durations 0.14–0.45 s, no motion under a tapping finger |
| `caveman` | chat style only | — |
| `graphify` | code-only knowledge graph of the repo (earlier in the session) to find every scroll call and render path | all `window.scrollTo` sites found and routed through `pageScrollTo` |
| General-purpose agent | read all 31 Trello cards with descriptions, checklists and comments | `_trello_full_read.md` (source for the card audit) |
| Independent review agent | read-only review of the motion layer and security meta | see `REGRESSION_TEST_RESULTS.md` § Independent review |

Listed in the brief but not used, with reason:
- `21st-ui-build`, `21st-ui-explore`: the design is approved; no new UI to build or explore. 21st.dev was studied directly (`21ST_DEV_COMPONENT_RESEARCH.md`); its CLI needs an API key (not purchased).
- `21st-ui-review`, `ui-design`, `frontend`: covered by the regression suites and the review agent.
- `tailwind-ui`, `pick-ui-library`: the site has no Tailwind and needs no new UI library.
- `fullstack-guardian`, `backend`: no backend exists or was added (brief forbids creating one for Trello's sake).
- `ponytail ultra`: not available in this environment.
