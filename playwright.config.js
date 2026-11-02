import { defineConfig } from '@playwright/test';

// The vision simulator renders continuously with WebGL. Headless Chromium falls back to SwiftShader
// (software GL), which saturates the main thread and makes every interaction take ~9 s. On Windows we
// route WebGL to the real GPU through ANGLE/Direct3D 11 so the tests exercise realistic behaviour.
const gpuArgs = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];

// Tests run against the production build served by `vite preview`.
// PW_PORT lets parallel worktrees run the suite side by side without port clashes.
const port = Number(process.env.PW_PORT || 4173);

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.js/,
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: `http://localhost:${port}/`, launchOptions: { args: gpuArgs } },
  webServer: {
    command: `npm run build && npx vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}/`,
    env: { CSIM_HARNESS: '1' }, // also build the 3D simulator test harness page
    reuseExistingServer: !!process.env.PW_REUSE, // always rebuild (tests also scan dist/ directly); PW_REUSE=1 only for local iteration against a running preview
    timeout: 120_000
  }
});
