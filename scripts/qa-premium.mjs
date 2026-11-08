// Visual QA for the premium reconstruction (Direction A): full-page JPEG screenshots, page and chapter heights,
// horizontal overflow, console errors, and elements hidden only on phones.
// Usage: node scripts/qa-premium.mjs <baseUrl> <outDir> [home|pages|all] [filter]
//   e.g. node scripts/qa-premium.mjs http://127.0.0.1:4573/ docs/implementation/premium-experience-reconstruction/evidence/after all
// Home: 320 360 375 390 430 768 1440 × AR/EN × light/dark. Other pages: 390 + 1440 × AR/EN (light; dark for a few).
// Writes <outDir>/<page>-<lang>-<width>-<theme>.jpg (quality 70) and <outDir>/metrics.json.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const [base = 'http://127.0.0.1:4573/', outDir = 'qa-out', mode = 'all', filter = ''] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const PAGES = ['about/', 'procedures/', 'procedures/cataract-surgery/', 'procedures/icl/', 'lens-lab/', 'how-vision-works/', 'surgical-education/', 'education/', 'clinic/'];
const name = p => (p.replace(/\/$/, '').replace(/^procedures\//, '').replace(/\//g, '-') || 'home');
const plan = [];
if (mode !== 'pages') for (const w of [320, 360, 375, 390, 430, 768, 1440]) for (const lang of ['ar', 'en']) for (const theme of ['light', 'dark']) plan.push({ p: '', lang, w, theme });
if (mode !== 'home') for (const p of PAGES) for (const lang of ['ar', 'en']) for (const w of [390, 1440]) for (const theme of ['light', 'dark']) {
  if (theme === 'dark' && !['procedures/', 'procedures/cataract-surgery/', 'about/'].includes(p)) continue;
  plan.push({ p, lang, w, theme });
}
const todo = plan.filter(x => !filter || `${name(x.p)}-${x.lang}-${x.w}-${x.theme}`.includes(filter));
const metricsFile = path.join(outDir, 'metrics.json');
const metrics = fs.existsSync(metricsFile) ? JSON.parse(fs.readFileSync(metricsFile, 'utf8')) : {};

const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
for (const { p, lang, w, theme } of todo) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: theme });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  await page.addInitScript(([t]) => { try { localStorage.setItem('theme', t); localStorage.removeItem('lang'); } catch (e) { /* ignore */ } }, [theme]);
  await page.goto(new URL(`${lang === 'en' ? 'en/' : ''}${p}`, base).href, { waitUntil: 'networkidle' });
  await page.locator('#app main h1').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } scrollTo(0, 0); });
  await page.evaluate(() => Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; }))));
  await page.evaluate(() => { document.querySelectorAll('.fade-in').forEach(n => n.classList.add('visible')); document.getElementById('site-header')?.classList.remove('is-hidden'); });
  await page.waitForTimeout(350);
  const m = await page.evaluate(() => {
    const top = el => Math.round(el.getBoundingClientRect().top + scrollY);
    const chapters = [...document.querySelectorAll('main > section, main > div > section, main > .duo > section, main article > header, main article > section, main article > div, footer.site-footer')]
      .map(el => ({ id: el.id || el.className.split(' ')[0], top: top(el), h: Math.round(el.getBoundingClientRect().height) }));
    const softImgs = [...document.images].filter(i => i.complete && i.naturalWidth && i.getBoundingClientRect().width > i.naturalWidth * 1.01).map(i => `${i.currentSrc.split('/').pop()} ${Math.round(i.getBoundingClientRect().width)}>${i.naturalWidth}`);
    return { height: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, chapters, upscaled: softImgs };
  });
  const key = `${name(p)}-${lang}-${w}-${theme}`;
  metrics[key] = { ...m, errors };
  await page.screenshot({ path: path.join(outDir, `${key}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
  console.log(`${key.padEnd(34)} h=${m.height} ox=${m.overflowX} err=${errors.length}${m.upscaled.length ? ' UPSCALED ' + m.upscaled.join(',') : ''}`);
  await ctx.close();
}
fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 1));
await browser.close();
