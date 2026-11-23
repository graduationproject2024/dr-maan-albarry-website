# React Bits research

Source: https://github.com/DavidHDev/react-bits (README, `LICENSE.md`), https://reactbits.dev . Categories: Text Animations (33), Animations (38), Components (48), Micro (34), Backgrounds (63), per the README.

**Licence:** "MIT + Commons Clause License Condition v1.0". Use in a website is allowed; selling, sublicensing or redistributing the components themselves, "whether alone, in a bundle, or as a ported version", is not. The site is vanilla JS, so **no React Bits code was copied or ported**; only general techniques (which are not the components) were re-implemented from scratch.

| Component | Source path | What it does | Deps | Decision |
|---|---|---|---|---|
| AnimatedContent | src/content/Animations/AnimatedContent | GSAP ScrollTrigger from y 100 / opacity 0, `power3.out`, once, honours reduced motion | gsap | **Technique used**: own staggered reveal (y 14, 0.5 s) in `src/motion` |
| FadeContent | src/content/Animations/FadeContent | autoAlpha fade, optional blur/SVG dissolve | gsap | Rejected: blur and dissolve effects do not suit a medical page |
| SpotlightCard | src/content/Components/SpotlightCard | pointer-following radial-gradient light on a card | none | **Technique used**: own CSS radial gradient + 6-line pointer handler on anatomy plates, desktop only |
| Stepper | src/content/Components/Stepper | multi-step wizard with sliding panes | hugeicons | Rejected: the 3D viewer already has its own stage controls tied to the surgical state machine |
| CountUp | src/content/TextAnimations/CountUp | animated numbers | motion/react | Rejected: the site shows no statistics (removed in Phase 0 for lack of sources) |

No React was added.
