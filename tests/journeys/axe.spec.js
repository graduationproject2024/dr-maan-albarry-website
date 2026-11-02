// axe-core scan of all 16 pages × light/dark at a phone width (390×844) — automated rule checks only; this is
// not a screen-reader or manual accessibility audit. Results: test-results/journeys/axe.json (+ evidence mirror).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { PAGES } from '../../site-routes.js';
import { LOG_DIR, LOG_MIRROR } from './harness.js';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const results = [];

for (const theme of ['light', 'dark']) {
  for (const p of PAGES) {
    test(`axe ${theme} /${p.path}`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* ignore */ } }, theme);
      await page.goto(`/${p.path}`);
      await page.locator('#app main h1').waitFor();
      if (!p.slug) { // let the lazy vision simulator mount so its controls are scanned too
        await page.locator('#simulator-host').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('#simulator-host .vsim'), null, { timeout: 30000 });
      } else await page.locator('#p-faq').waitFor();
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(400);
      // BUG-18: let running transitions (section fade-ins, theme colours) settle so colour-contrast never samples a
      // half-faded frame on a loaded machine; a finished frame is what visitors see.
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))));
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      const v = r.violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, nodes: x.nodes.length, targets: x.nodes.slice(0, 4).map((n) => n.target.join(' ')) }));
      results.push({ page: `/${p.path}`, theme, violations: v, passes: r.passes.length, incomplete: r.incomplete.length });
      if (v.length) { // keep failure details across runs (BUG-18: one unexplained failure was overwritten by the next run)
        fs.mkdirSync(LOG_DIR, { recursive: true });
        fs.appendFileSync(`${LOG_DIR}/axe-failures.jsonl`, JSON.stringify({ at: new Date().toISOString(), page: `/${p.path}`, theme, violations: v }) + '\n');
      }
      expect(v, `axe violations on /${p.path} (${theme})`).toEqual([]);
    });
  }
}

test.afterAll(() => {
  if (!results.length) return;
  for (const dir of [LOG_DIR, LOG_MIRROR]) {
    fs.mkdirSync(dir, { recursive: true });
    const f = `${dir}/axe.json`;
    const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
    const merged = [...prev.filter((x) => !results.some((y) => y.page === x.page && y.theme === x.theme)), ...results];
    fs.writeFileSync(f, JSON.stringify(merged, null, 2));
  }
});
