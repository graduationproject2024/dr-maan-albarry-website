# Performance results

- **Homepage:** the hero plate image is gone, so there is one fewer image above the fold. No 3D code loads on the homepage.
- **New lazy chunks:**
  - `src/gallery`, only on /gallery/ once it is published;
  - `procedures/compare.js`, a few KB, loaded with the simulator.
- **Main bundle:** grew by the clinical-profile registry, which is mostly bilingual text.
- **Not measured** in this pass: Lighthouse CI and Web Vitals. The Phase 2 measurements remain the reference.
