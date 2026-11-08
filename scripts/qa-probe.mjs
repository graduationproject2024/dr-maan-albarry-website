// Ad-hoc layout probe: node scripts/qa-probe.mjs <url> <width> "<js expression returning JSON>"
import { chromium } from '@playwright/test';
const [url, w = '1440', expr = 'document.title'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
console.log(JSON.stringify(await page.evaluate(expr), null, 1));
await browser.close();
