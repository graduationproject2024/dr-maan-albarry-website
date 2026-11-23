# Lens Lab recovery

## Reproduction
| Where | Result |
|---|---|
| Live site, desktop Chromium | simulator and comparison render |
| Live site, 375 px phone width | both render |
| Local Vite dev server | stuck on "Loading": dependency optimisation stalls the module requests; not a production fault |

The owner's report **could not be reproduced** in production Chromium. Possible causes on the owner's device:
- iOS Safari WebGL memory limits;
- a cached pre-Phase 2 bundle;
- Low Power Mode;
- a content blocker.

**Next step:** the owner shares the device, browser and a screenshot.

## Changes made
- The comparison shows the doctor's five categories in his wording.
- Simulator (in More settings, so the phone layout is unchanged):
  - an enhanced monofocal lens;
  - a toric switch;
  - intermediate distance set to 65 cm.
- An ocular-surface section between the simulator and the comparison.
- The homepage preview art shows four bars.

## Not done
- **Visual redesign** of the comparison. The approved design system was kept.
- **Testing on the owner's own phone.**
