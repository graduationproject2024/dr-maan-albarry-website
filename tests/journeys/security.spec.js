// Security checks on the rendered pages: every new-tab link carries rel="noopener", external hosts are inventoried,
// only the expected localStorage keys are written. Results: test-results/journeys/security.json (+ mirror).
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { PAGES } from '../../site-routes.js';
import { LOG_DIR, LOG_MIRROR } from './harness.js';

test.use({ viewport: { width: 390, height: 844 } });
const report = { pages: [], externalHosts: {}, storageKeys: [] };

test('external links, rel=noopener and storage keys on all 16 pages', async ({ page }) => {
  test.setTimeout(180_000);
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.fulfill({ status: 204, body: '' }));
  for (const p of PAGES) {
    await page.goto(`/${p.path}`); await page.locator('#app main h1').waitFor();
    if (p.slug) await page.locator('#p-faq').waitFor();
    const r = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a[href]')];
      const blank = links.filter((a) => a.target === '_blank');
      const unsafe = blank.filter((a) => !/\bnoopener\b/.test(a.rel)).map((a) => a.href);
      const hosts = {};
      for (const a of links) { try { const u = new URL(a.href); if (u.origin !== location.origin) { const k = u.protocol === 'tel:' ? 'tel:' : u.host; hosts[k] = (hosts[k] || 0) + 1; } } catch { /* ignore */ } }
      const insecure = links.filter((a) => a.href.startsWith('http:') && !a.href.startsWith(location.origin)).map((a) => a.href);
      return { blank: blank.length, unsafe, hosts, insecure, iframes: [...document.querySelectorAll('iframe')].map((f) => f.src.split('?')[0]) };
    });
    report.pages.push({ page: `/${p.path}`, newTabLinks: r.blank, withoutNoopener: r.unsafe, insecureHttp: r.insecure, iframes: r.iframes });
    for (const [h, n] of Object.entries(r.hosts)) report.externalHosts[h] = (report.externalHosts[h] || 0) + n;
  }
  // storage: toggle theme + language, then list what was written
  await page.goto('/'); await page.locator('#theme-toggle-btn').click(); await page.locator('.site-header .lang-switch').click();
  await page.waitForURL(/\/en\/$/);
  report.storageKeys = await page.evaluate(() => Object.keys(localStorage).map((k) => `${k}=${localStorage.getItem(k)}`));
  for (const dir of [LOG_DIR, LOG_MIRROR]) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(`${dir}/security.json`, JSON.stringify(report, null, 2)); }
  expect(report.pages.flatMap((x) => x.withoutNoopener)).toEqual([]);
  expect(report.pages.flatMap((x) => x.insecureHttp)).toEqual([]);
  expect(report.storageKeys.map((k) => k.split('=')[0]).sort()).toEqual(['lang', 'theme']);
});
