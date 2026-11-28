// Runs one test layer (tests/layers.mjs): `node scripts/test-layer.mjs gpu|cpu [playwright args...]`.
// Cross-platform way to set TEST_LAYER without an extra dependency.
import { spawnSync } from 'node:child_process';

const [layer, ...args] = process.argv.slice(2);
if (!['gpu', 'cpu'].includes(layer)) { console.error('usage: node scripts/test-layer.mjs gpu|cpu [playwright args]'); process.exit(2); }
const r = spawnSync('npx', ['playwright', 'test', ...args], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, TEST_LAYER: layer } });
process.exit(r.status ?? 1);
