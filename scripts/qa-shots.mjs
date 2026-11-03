// Visual QA capture: full-page JPEG screenshots + page heights for the Phase 1 pages.
// Usage: node scripts/qa-shots.mjs <baseUrl> <outDir> [filter]
//   e.g. node scripts/qa-shots.mjs http://localhost:4980/ docs/phase-1/evidence/after
// Writes <outDir>/<page>-<lang>-<width>-<theme>.jpg (quality 72) and <outDir>/heights.json.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const [base = 'http://localhost:4980/', outDir = 'docs/phase-1/evidence/after', filter = ''] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const PAGES = ['', 'about/', 'procedures/', 'lens-lab/', 'surgical-education/', 'education/', 'how-vision-works/', 'clinic/', 'procedures/cataract-surgery/'];
const name = p => (p.replace(/\/$/, '').replace(/\//g, '-') || 'home');
const plan = [];
for (const p of PAGES) for (const lang of ['ar', 'en']) for (const w of [1440, 390]) for (const theme of ['light', 'dark']) {
  // keep the set reasonable: every page in both languages at both widths in light; dark for home + about + lens lab
  if (theme === 'dark' && !['', 'about/', 'lens-lab/', 'education/'].includes(p)) continue;
  plan.push({ p, lang, w, theme });
}
const todo = plan.filter(x => !filter || `${name(x.p)}-${x.lang}-${x.w}-${x.theme}`.includes(filter));

const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const heights = {};
for (const { p, lang, w, theme } of todo) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: theme });
  const page = await ctx.newPage();
  await page.addInitScript(([t]) => { try { localStorage.setItem('theme', t); localStorage.removeItem('lang'); } catch (e) { /* ignore */ } }, [theme]);
  await page.goto(new URL(`${lang === 'en' ? 'en/' : ''}${p}`, base).href, { waitUntil: 'networkidle' });
  await page.locator('#app main h1').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.querySelectorAll('.fade-in').forEach(n => n.classList.add('visible')));
  await page.waitForTimeout(300);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const key = `${name(p)}-${lang}-${w}-${theme}`;
  heights[key] = { height: h, overflowX: overflow };
  await page.screenshot({ path: path.join(outDir, `${key}.jpg`), fullPage: true, type: 'jpeg', quality: 72 });
  console.log(key, h, overflow ? `OVERFLOW ${overflow}` : '');
  await ctx.close();
}
await browser.close();
const f = path.join(outDir, 'heights.json');
const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
fs.writeFileSync(f, JSON.stringify({ ...prev, ...heights }, null, 2));
