// Worst layout shift (CLS) on a plain first load, per page and width, desktop pointer (3 loads each).
// Usage: npm run build && npx vite preview --port 4671  then  node scripts/measure-load-cls.mjs http://localhost:4671
import { chromium } from '@playwright/test';

const base = (process.argv[2] || 'http://localhost:4671').replace(/\/$/, '');
const PAGES = ['/', '/en/', '/lens-lab/', '/en/lens-lab/', '/how-vision-works/', '/procedures/cataract-surgery/', '/about/'];
const WIDTHS = [390, 800, 1024, 1440];
const b = await chromium.launch();
for (const path of PAGES) {
  const row = [];
  for (const w of WIDTHS) {
    let worst = 0;
    for (let i = 0; i < 3; i++) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      await p.addInitScript(() => { window.__c = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__c += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
      await p.goto(base + path, { waitUntil: 'load' });
      await p.waitForTimeout(1800);
      worst = Math.max(worst, await p.evaluate(() => window.__c));
      await p.close();
    }
    row.push(`${w}:${worst.toFixed(3)}`);
  }
  console.log(path.padEnd(32), row.join('  '));
}
await b.close();
