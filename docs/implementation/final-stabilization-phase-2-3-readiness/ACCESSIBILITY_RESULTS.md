# Accessibility results

Automated and scripted checks only. No screen reader was used with a real person, and no physical device.

| Check | Result | Evidence |
|---|---|---|
| axe-core on every page type, light and dark | 0 violations | `journeys/axe.spec.js` (full suite) |
| New "Whole scene" button | Real `<button>`, visible text (icon-only with a hidden label on very short pictures), 44 px target, focus ring, translated | `lens-lab-distance.spec.js` |
| New grouped settings | Group headings are `h3` with `aria-labelledby`; folded groups are native `<details>`/`<summary>` (keyboard and screen-reader support built in); each control keeps its group name | `lens-lab-distance.spec.js` "More settings is grouped" |
| Closer view announced | The live region says "Closer view: phone. …" before the usual lens/distance/lighting announcement | `index.js announce` |
| Reduced motion | The closer view and the frame move without animation | `lens-lab-distance.spec.js` "reduced motion" |
| Enlarged text 125 % / 150 % | Short landscape: every essential option reachable and tappable; no sideways scroll. Phones 320/360 px: existing journeys pass | `lens-lab-distance.spec.js`, `premium-journeys` E |
| Touch targets | ≥44 px for every Lens Lab control at every tested size, incl. short landscape | same |
| Anatomy key text | 13 px → 15 px | `ANATOMICAL_IMAGE_REVIEW.md` |
| Not-found page | One `h1`, page title, links in a labelled `nav`, keyboard reachable; `lang`/`dir` follow the language switch | `routing.spec.js` "Unknown addresses" |
| Non-3D alternatives | Static comparison when WebGL is missing; illustrated fallback for the 3D viewer; prerendered text for no-JS readers | existing specs (full suite) |
| Keyboard | Radio groups, sliders, divider, 3D controls | `vision-sim` keyboard, `persona-f` |

Not verified: VoiceOver / TalkBack with real users, Windows high-contrast mode, switch access.
