import { defineConfig } from '@playwright/test';

// The vision simulator renders continuously with WebGL. Headless Chromium falls back to SwiftShader
// (software GL), which saturates the main thread and makes every interaction take ~9 s. On Windows we
// route WebGL to the real GPU through ANGLE/Direct3D 11 so the tests exercise realistic behaviour.
const gpuArgs = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];

// Tests run against the production build served by `vite preview`.
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.js/,
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://localhost:4173/', launchOptions: { args: gpuArgs } },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: false, // always rebuild: tests also scan dist/ directly
    timeout: 120_000
  }
});
