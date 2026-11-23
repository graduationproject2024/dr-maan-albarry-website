# Library integration audit (gates)

| Gate | Lenis | GSAP | React Bits (techniques) | 21st.dev (pattern) |
|---|---|---|---|---|
| Visual | glide on wheel only; no visual change | short reveals and a dialog cross-fade in the existing editorial style | spotlight is a faint warm light on plates | lightbox-style dialog transition (scale-from-button tried, replaced by a cross-fade: transforms shrank tap targets) |
| Functional | site jumps, Back restore, dialogs and menu verified (`motion.spec.js`) | all items end visible; no trigger build-up | none affected | Escape, backdrop, close button, focus return kept |
| Mobile | not created on touch | not loaded on phones (A/B: +50–200 ms TBT on a throttled phone for fades only) | desktop pointer only | phones: instant native dialog, as before |
| Accessibility | keyboard scroll unchanged; off with reduced motion | off with reduced motion; nothing waits for animation | no motion | focus behaviour unchanged |
| Performance | 5.2 KB, desktop only, after load | 27.9 KB, desktop only, after load; never on the critical path | ~0 KB (CSS + 6 lines) | 0 KB |
| Architecture | one module, one ticker | one module, per-page context | no React | no React |
| Medical | not applied to simulators | not applied to simulators | not applied to medical meaning | — |
| Maintenance | `src/motion/index.js`, `pageScrollTo` | same file | `style.css` § 25 | `main.js closePlateZoom` |
| **Result** | accepted (desktop) | accepted | 2 techniques used, 3 rejected | 1 pattern used, 2 rejected |

Detail: `LENIS_INTEGRATION.md`, `GSAP_MOTION_SYSTEM.md`, `REACT_BITS_COMPONENT_RESEARCH.md`, `21ST_DEV_COMPONENT_RESEARCH.md`. Performance numbers: `PERFORMANCE_COMPARISON.md`.
