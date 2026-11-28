// Test layers (owner decision 2026-11-25: "local GPU run per release").
//
// GitHub-hosted runners have no GPU, so WebGL runs on a software renderer and the 3D suites time out there (BUG-C01).
//  - GPU layer: spec files that drive a live WebGL scene. Run on a machine with a real GPU before every release:
//      npm run test:gpu      (record the result in docs/implementation/<release>/ — see CLAUDE.md)
//  - CPU layer: everything else. Runs on GitHub in the weekly / manual full regression:
//      npm run test:cpu
// `npm run test:full` (no TEST_LAYER) still runs every file, as before.
export const GPU_SPECS = [
  'cataract-integration.spec.js',
  'cataract-refinement.spec.js',
  'cataract-review.spec.js',
  'cataract-sim.spec.js',
  'cataract-stress.spec.js',
  'cataract-warmup.spec.js',
  'clinical-profile-expansion.spec.js',
  'lens-lab.spec.js',
  'lens-lab-distance.spec.js',
  'lens-lab-mobile.spec.js',
  'lens-lab-recovery.spec.js',
  'module-reserve.spec.js', // mounts the Lens Lab module (WebGL comparison)
  'surgical-sim.spec.js',
  'surgical-sim-webkit.spec.js',
  'vision-review.spec.js',
  'vision-sim.spec.js',
  'journeys/core-journeys.spec.js',
  'journeys/persona-c.spec.js', // persona C, D, F, premium C/F and touch gestures open the cataract 3D viewer
  'journeys/persona-d.spec.js', // (CPU-layer run 45640303933 shard 2: 12 of 13 failures were 3D step timeouts)
  'journeys/persona-f.spec.js',
  'journeys/premium-journeys.spec.js',
  'journeys/touch-gestures.spec.js',
  'journeys/stress.spec.js',
  'journeys/webkit.spec.js', // drives both simulators in WebKit (CPU-layer run 45640303933 timed out on the vision simulator)
];

const toRe = (f) => new RegExp(`[\\\\/]tests[\\\\/]${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\//g, '[\\\\/]')}$`);
export const GPU_PATTERNS = GPU_SPECS.map(toRe);
