# Clinical review: cataract surgery simulator content

**Status of every stage: `draft-pending-clinical-review`.** No stage has been reviewed or approved. In `src/cataract-sim/stages.js`, `review.reviewedBy` and `review.reviewedAt` are `null` for all seven stages. No review date or signature exists, and none should be added until Dr. Maan Albarry actually signs off.

The UI shows a persistent disclaimer (in both languages): illustrative education only, not a substitute for consultation, content pending physician review. Each stage also shows a "Draft — pending physician review" badge.

## Content to sign off (Arabic and English)

| # | Stage id | Points the physician must confirm |
|---|---|---|
| 1 | `cloudy-lens` | Description of cataract (clouding, yellowing, scattered light; blurred, dim or glary vision). Use of "الساد (الماء الأبيض)". |
| 2 | `preparation` | Dilating drops; "the eye is usually numbed" (matches Dr. Maan's anaesthesia practice?); operating microscope. |
| 3 | `incision` | "Very small incision where the clear cornea meets the white of the eye" and "often self-sealing". Does this match his technique (clear-corneal vs scleral tunnel, temporal vs superior)? |
| 4 | `capsulorhexis` | Capsule description; round opening in the front; rest kept to hold the new lens. |
| 5 | `phaco` | "Fine ultrasound probe … gentle suction … phacoemulsification", and the Arabic term "استحلاب العدسة (الفاكو)". Does he also offer other techniques (for example MSICS or femtosecond) that patients should be told about? |
| 6 | `iol` | Folded IOL, unfolds, flexible arms keep it centred in the capsule. Lens types and choices are deliberately not discussed. |
| 7 | `completion` | Instruments removed; pupil returns toward usual size; "recovery and results differ … your doctor will guide your follow-up". No outcome promise is made. |
| — | Anatomy descriptions | The seven structure descriptions in `STRUCTURES` (cornea, iris, pupil, lens and nucleus, capsule, zonules, IOL). |
| — | Visuals | That the animation sequence and instrument depictions are acceptable as a simplified illustration; see the simplifications listed in `PHASE_3_SIMULATION.md`. |

All content avoids:
- instrument settings, energies or sizes;
- procedure durations (playback seconds are animation only);
- success rates and outcome promises;
- eligibility advice.

## Sources cited in the UI

Every stage carries a subset of these general patient-education references. They are cited by name and URL only; nothing is quoted.

- American Academy of Ophthalmology (EyeSmart), "What Is Cataract Surgery?": https://www.aao.org/eye-health/diseases/what-is-cataract-surgery
- American Academy of Ophthalmology (EyeSmart), "What Are Cataracts?": https://www.aao.org/eye-health/diseases/what-are-cataracts
- NHS (UK), "Cataract surgery": https://www.nhs.uk/conditions/cataract-surgery/
- National Eye Institute (NIH), "Cataracts": https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts

## Recommended gating until sign-off

1. Ship the simulator behind a feature flag, for example `CATARACT_SIM_ENABLED`, or a `?preview=1` query parameter checked by `main.js` before it calls `import('./src/cataract-sim/index.js')`. Keep it off in production, or label it clearly as a preview.
2. After review, set each stage's `review` to `{ status: 'approved', reviewedBy: 'Dr. Maan Albarry', reviewedAt: '<real date>' }`, applying any wording changes in both languages in the same commit.
3. Remove the "pending physician review" phrase from the disclaimer only after all seven stages are approved. Keep the "not a substitute for consultation" sentence.
4. Do not include `cataract-sim-preview.html` (an internal test harness, `noindex`) in the public deploy unless it is needed for CI.
