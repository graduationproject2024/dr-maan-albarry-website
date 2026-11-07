const { chromium } = require('C:/Users/sam20/dr-maan-albarry-website/node_modules/playwright');
const path = require('path'); const fs = require('fs');
const BASE = 'http://localhost:4520/docs/implementation/premium-experience-reconstruction/directions/';
const OUT = 'C:/Users/sam20/dr-maan-albarry-website/docs/implementation/premium-experience-reconstruction/directions/';
const dirs = process.argv[2].split(',');
const only = process.argv[3] ? process.argv[3].split(',') : null;
const JOBS = [
  ['hero-desktop-ar', 'home-ar.html', 1440, 900, 1, {}],
  ['hero-desktop-en', 'home-en.html', 1440, 900, 1, {}],
  ['hero-desktop-dark', 'home-ar.html?theme=dark', 1440, 900, 1, { dark: true }],
  ['hero-mobile-ar', 'home-ar.html', 390, 844, 2, { mobile: true }],
  ['gallery-desktop', 'home-ar.html', 1440, 900, 1, { sel: '#procedures' }],
  ['gallery-mobile', 'home-ar.html', 390, 844, 2, { mobile: true, sel: '#procedures' }],
  ['type-specimen', 'type.html', 1440, 900, 1, { full: true }],
  ['procedure-hero-desktop', 'procedure-ar.html', 1440, 900, 1, { full: true }],
  ['procedure-hero-mobile', 'procedure-ar.html', 390, 844, 2, { mobile: true, full: true }],
  ['nav', 'nav.html', 1440, 900, 1, { full: true, wait: 2500 }],
  ['colours', 'colours.html', 1440, 900, 1, { full: true }],
];
(async () => {
  const browser = await chromium.launch();
  for (const dir of dirs) {
    fs.mkdirSync(OUT + dir + '/shots', { recursive: true });
    for (const [name, url, w, h, dpr, o] of JOBS) {
      if (only && !only.includes(name)) continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: !!o.mobile, hasTouch: !!o.mobile, colorScheme: o.dark ? 'dark' : 'light' });
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('requestfailed', r => errs.push('FAIL ' + r.url()));
      page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
      await page.goto(BASE + dir + '/' + url, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
      await page.waitForTimeout(o.wait || 400);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const file = OUT + dir + '/shots/' + name + '.jpg';
      if (o.sel) { await page.addStyleTag({ content: '.hdr{position:relative!important}.mbar{display:none!important}' }); }
      if (o.sel) await page.locator(o.sel).screenshot({ path: file, type: 'jpeg', quality: 86 });
      else await page.screenshot({ path: file, type: 'jpeg', quality: 86, fullPage: !!o.full });
      console.log(dir, name, ov ? 'OVERFLOW ' + ov : '', errs.length ? errs.join(' | ') : '');
      await ctx.close();
    }
  }
  await browser.close();
})();
