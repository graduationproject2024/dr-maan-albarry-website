# Vision simulator improvements

Phase 2 made no optical change. Changes are layout and interaction only:

- placement of "Whole scene" (P2-07), `src/vision-sim/ui.js`
- sticking rule for the picture on very short screens (P2-10), `src/vision-sim/ui.js`
- scroll margin of the distance row in short landscape (P2-08), `src/vision-sim/styles.css`

Model version, equations, parameters and the review harness are untouched. A real optical change (for example depth within a layer) would need a cited model, numeric tests, a new model version and physician review (`PHASE_2_3_BACKLOG.md`, P2-04 there) — not started.
