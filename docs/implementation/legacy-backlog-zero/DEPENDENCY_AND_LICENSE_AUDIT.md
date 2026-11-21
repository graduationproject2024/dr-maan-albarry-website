# Dependency and licence audit

| Package | Version (pinned) | Licence | Where | Size (gzip) | Loaded |
|---|---|---|---|---|---|
| three | 0.170.0 | MIT | 3D viewer, vision simulator | (existing) | lazily per feature |
| gsap (core only; ScrollTrigger tried and removed) | 3.15.1 | Standard "no charge" licence (gsap.com/standard-license); commercial websites allowed; prohibited only: tools competing with Webflow's no-code builder | `src/motion` | 27.9 KB (`motion-*.js`) | desktop pointer only, after page load + idle |
| lenis | 1.3.27 | MIT | `src/motion` (desktop pointers) | 5.2 KB (`lenis-*.js`) | desktop pointer only, after the motion chunk |

`npm audit`: 0 vulnerabilities (production and full) after the install.

Not added: React, framer-motion, Radix, Tailwind, any React Bits or 21st.dev package. React Bits code was not copied (MIT + Commons Clause forbids redistributing ported versions); only general techniques were re-implemented.
