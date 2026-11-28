// Viewing-distance buttons of the simulator (UI presets, not optics). Dr. Maan's educational reference distances are
// 40 cm, 50 cm and 65 cm plus far (2026-11-26). 50 cm ("screen": a phone or tablet held a little further away) lies
// inside the near band of the model (BANDS.nearMax 0.52 m) and inside the slider range (0.33–6 m), so it needs no model
// change: the near layer is simply evaluated at 0.50 m. The other three keep their values from optics/params.js.
import { DISTANCES } from './optics/params.js';

export const PRESET_KEYS = Object.freeze(['near', 'screen', 'intermediate', 'distance']);
export const PRESET_DISTANCES = Object.freeze({ near: DISTANCES.near, screen: 0.5, intermediate: DISTANCES.intermediate, distance: DISTANCES.distance });
/** The preset a distance matches exactly (within 5 mm), or ''. */
export const presetFor = (m) => PRESET_KEYS.find((k) => Math.abs(PRESET_DISTANCES[k] - m) < 0.005) || '';
