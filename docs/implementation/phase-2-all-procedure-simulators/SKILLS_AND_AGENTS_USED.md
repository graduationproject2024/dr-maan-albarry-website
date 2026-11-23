# Skills, agents and tools used

| What | How it was used |
|---|---|
| 3 parallel general-purpose subagents | Each owned only its own procedure files and its own Vite port (5181, 5182, 5183), and checked its own screenshots: (1) ICL + intravitreal, (2) LASIK / PRK / SMILE, (3) keratoconus / CXL + corneal transplant. None edited shared files. Their recommendations were applied by the main session: normal-blended beams, and a section-plane fix found while reviewing their screenshots. The third agent stopped at a usage limit and was resumed from where it stopped. |
| Main session | Engine, anatomical library, UI shell, IOL module, page integration, cataract refinements, tests, review of every module's screenshots, docs and Trello |
| Playwright (`@playwright/test` 1.64) | `surgical-sim.spec.js` (30 tests × 6 procedures' worth of checks), `cataract-refinement.spec.js`, the full regression run (2 workers), and the screenshot scripts (`scripts/sim-shots.mjs`) |
| Android Emulator + adb | `tests/devices/android-procedure-sims.mjs` (see `ANDROID_RESULTS.md`) |
| `@axe-core/playwright` | Accessibility of the open simulator, in English and Arabic |
| three.js 0.170 | Already a dependency. No new runtime dependency was added. |
| Lenis / GSAP | Studied and kept as they are (desktop page motion only). The simulators deliberately do **not** use GSAP: the engine's timeline is the only authority over model state (brief §17). |
| React Bits / 21st.dev | Studied for toolbar, tab and stage-list patterns. The segmented tabs, compact tool column and stage list follow those common patterns, built in plain DOM inside the existing tokens. No component code was copied (React Bits' licence forbids ported copies) and React was not added. |
| Skills | `apple-design` principles (interruptible camera transitions that continue from the current value, 44 px targets, reduced motion), `playwright-skill`, `caveman` (final report style, as the owner prefers) |
| Not available or not used | Xcode / iOS Simulator (no Mac); paid device clouds (not authorised); Blender (procedural geometry needs no asset pipeline) |
