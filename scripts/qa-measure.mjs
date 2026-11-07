// Height budget probe: total page height and the height of each top-level block of <main>, header and footer.
// Usage: node scripts/qa-measure.mjs <baseUrl> [path] [widths=1440,390]
import { chromium } from '@playwright/test';

const [base = 'http://localhost:4980/', p = '', widths = '1440,390'] = process.argv.slice(2);
const browser = await chromium.launch();
for (const lang of ['ar', 'en']) {
  for (const w of widths.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(new URL(`${lang === 'en' ? 'en/' : ''}${p}`, base).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(() => {
      const blocks = [document.querySelector('.site-header'), ...document.querySelectorAll('main > *'), document.querySelector('.site-footer')].filter(Boolean);
      return { total: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, blocks: blocks.map(b => `${b.id || b.className.split(' ')[0]}:${Math.round(b.getBoundingClientRect().height)}`) };
    });
    console.log(`${lang} ${w}: total ${r.total}${r.overflowX ? ` OVERFLOW ${r.overflowX}` : ''}\n   ${r.blocks.join('  ')}`);
    await ctx.close();
  }
}
await browser.close();
