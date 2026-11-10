// Persona H — patient comparing lens options (emulated iPad Mini, Chromium, touch, Arabic RTL).
// vision simulator → switch lenses → distance → lighting → read the explanations → compare →
// /procedures/lens-implants/. Asserts the disclaimer and the absence of certainty wording.
import { test } from '@playwright/test';
import { startJourney, prepare, device, rect, swipe, smallTargets } from './harness.js';
import { openUrl, docState, vsimState, waitVsim, NAME, certaintyClaims } from './site.js';

test.use({ ...device('iPad Mini') });
test.setTimeout(180_000);

const lbl = (page, group, value) => page.locator(`#simulator-host label[for$="-${group}-${value}"]`);

test('Persona H — comparing lens options', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const j = await startJourney(page, testInfo, {
    id: 'persona-h', persona: 'H — comparing lens options', objective: 'Use the vision simulator to understand how lens types differ by distance and lighting, then read the lens implant page — without being promised an outcome.',
    device: 'iPad Mini (Playwright descriptor: 768×1024, DPR 2, iPadOS UA) — rendered by Chromium', language: 'ar', theme: 'light', startUrl: '/',
  });

  await j.step('Open the home page, tap "مختبر العدسات" in the navigation, then "محاكي الرؤية بكل أدواته"', 'Opens the Lens Lab page and jumps to the simulator section; the simulator loads in place', async () => {
    await openUrl(page, '/');
    const navLink = page.locator('.header-nav a[data-section="lens-lab"]');
    if (await navLink.isVisible()) await navLink.tap();
    else { await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300); await page.locator('#mobile-nav a[data-section="lens-lab"]').tap(); }
    await page.waitForURL(/\/lens-lab\/$/);
    await page.locator('#sim-jump').tap();
    const s = await waitVsim(page, 40000);
    await page.waitForFunction(() => { const t = document.getElementById('simulator').getBoundingClientRect().top; return t > -20 && t < 140; }, null, { timeout: 10000 }).catch(() => {}); // the jump is a smooth scroll: wait for it to arrive; a miss is reported below
    const top = (await rect(page.locator('#simulator'))).y;
    return { actual: `mounted=${s.mounted} dir=${s.dir} canvases=${s.canvases}; #simulator top=${Math.round(top)}px`, ok: s.mounted && s.dir === 'rtl' && s.canvases === 1 && top > -20 && top < 140 };
  }, { shot: true });

  await j.step('Read the disclaimer under the viewer', 'An educational, not-a-prediction disclaimer is visible', async () => {
    const s = await vsimState(page);
    const vis = await page.locator('#simulator-host [data-ref="disclaimer"]').isVisible();
    return { actual: `visible=${vis}: "${s.disclaimer}"`, ok: vis && /ليس توقعاً/.test(s.disclaimer) };
  });

  await j.step('Tap the lens buttons: EDOF, then trifocal, then monofocal', 'Each tap selects that lens; the explanation card follows', async () => {
    const seen = [];
    for (const id of ['edof', 'trifocal', 'monofocal']) {
      await lbl(page, 'lensA', id).tap(); await page.waitForTimeout(250);
      const s = await vsimState(page); seen.push(`${s.lens}:"${s.cards[0]}"`);
    }
    return { actual: seen.join(' | '), ok: seen[0].startsWith('edof') && seen[1].startsWith('trifocal') && seen[2].startsWith('monofocal') };
  }, { shot: true });

  await j.step('Tap the distance presets: near, intermediate, distance', 'Preset selected and the distance read-out changes each time', async () => {
    const outs = [];
    for (const id of ['near', 'intermediate', 'distance']) {
      await lbl(page, 'preset', id).tap(); await page.waitForTimeout(250);
      const s = await vsimState(page); outs.push(`${s.preset}:${s.rangeOut}`);
    }
    return { actual: outs.join(' | '), ok: outs[0].startsWith('near') && outs[1].startsWith('intermediate') && outs[2].startsWith('distance') && new Set(outs.map((o) => o.split(':')[1])).size === 3 };
  });

  await j.step('Tap the lighting options: dusk, night, then back to day', 'Lighting changes and the live region announces it', async () => {
    const outs = [];
    for (const id of ['dusk', 'night', 'day']) {
      await lbl(page, 'lighting', id).tap(); await page.waitForTimeout(250);
      const s = await vsimState(page); outs.push(s.lighting);
    }
    const live = (await vsimState(page)).live;
    return { actual: `${outs.join(' → ')}; live: "${live.slice(0, 80)}"`, ok: outs.join() === 'dusk,night,day' && live.length > 0 };
  });

  await j.step('Open "كيف تعمل هذه المحاكاة؟" and the sharpness meters', 'Explanation text and a labelled curve chart appear', async () => {
    const how = page.locator('#simulator-host details.vsim-how summary');
    await how.scrollIntoViewIfNeeded(); await how.tap(); await page.waitForTimeout(250);
    const info = await page.locator('#simulator-host details.vsim-how').evaluate((d) => ({ open: d.open, paras: d.querySelectorAll('p').length, chart: !!d.querySelector('svg.vsim-chart title') }));
    return { actual: `open=${info.open} paragraphs=${info.paras} chart with title=${info.chart}`, ok: info.open && info.paras > 0 && info.chart };
  }, { shot: true });

  await j.step('Check the sharpness bars fill from the reading direction (RTL → from the right)', 'In Arabic every bar fill starts at the bar\'s right edge', async () => {
    const clarity = page.locator('#simulator-host details.vsim-clarity summary'); await clarity.scrollIntoViewIfNeeded(); await clarity.tap(); await page.waitForTimeout(250); // expandable since the workbench rebuild
    const bars = await page.locator('#simulator-host .vsim-bar').evaluateAll((els) => els.filter((b) => b.getClientRects().length).map((b) => {
      const r = b.getBoundingClientRect(), f = b.firstElementChild.getBoundingClientRect();
      return { fillW: Math.round(f.width), barW: Math.round(r.width), gapRight: Math.round(r.right - f.right), gapLeft: Math.round(f.left - r.left) };
    }));
    const partial = bars.filter((b) => b.fillW < b.barW - 4 && b.fillW > 2);
    const wrong = partial.filter((b) => b.gapRight > 2);
    return { actual: `${bars.length} bars, ${partial.length} partly filled; filled from the left (wrong in RTL): ${wrong.length} ${JSON.stringify(partial.slice(0, 3))}`, ok: partial.length > 0 && wrong.length === 0 };
  }, { critical: false });

  await j.step('Turn on "قارن بين عدستين" and drag the divider with a finger', 'Second lens shown (two cards, B field); divider moves with the finger', async () => {
    const moreBtn = page.locator('#simulator-host .vsim-more'); await moreBtn.scrollIntoViewIfNeeded(); await moreBtn.tap(); // compare lives in More settings since the workbench rebuild
    await page.locator('#simulator-host .vsim-switch').scrollIntoViewIfNeeded();
    await page.locator('#simulator-host .vsim-switch').tap(); await page.waitForTimeout(300);
    const s = await vsimState(page);
    const div = page.locator('#simulator-host [data-ref="divider"]');
    await div.scrollIntoViewIfNeeded();
    const r = await rect(div);
    const v0 = await div.getAttribute('aria-valuenow');
    await swipe(page, { x: r.x + r.w / 2, y: r.y + r.h / 2, dx: -120, steps: 10 });
    await page.waitForTimeout(250);
    const v1 = await div.getAttribute('aria-valuenow');
    return { actual: `compare=${s.compare} cards=${s.cards.length} lensB=${s.lensB}; divider ${v0}% → ${v1}%`, ok: s.compare && s.cards.length === 2 && Number(v1) < Number(v0) - 5 };
  }, { shot: true });

  await j.step('Check the simulator controls are finger-sized', 'All controls ≥44px', async () => {
    const small = await smallTargets(page, '#simulator-host');
    return { actual: small.length ? `${small.length}: ${small.slice(0, 4).join('; ')}` : 'all ≥44px', ok: small.length === 0 };
  }, { critical: false });

  await j.step('Scan the simulator and its section for certainty wording', 'No "guarantee", "you will see", "20/20" or success percentages', async () => {
    const text = await page.locator('#simulator').innerText();
    const m = certaintyClaims(text);
    return { actual: m.length ? `claims: ${m.slice(0, 3).join(' | ')}` : `no certainty claims in ${text.length} characters (negated statements such as "cannot be guaranteed" are allowed)`, ok: !m.length };
  });

  await j.step('Tap "اقرأ عن أنواع العدسات المزروعة"', 'Lens implants page opens; review-status disclaimer present; no certainty wording', async () => {
    const link = page.locator('#simulator .disclaimers a[href$="procedures/lens-implants/"]');
    await link.scrollIntoViewIfNeeded(); await link.tap();
    await page.waitForURL(/procedures\/lens-implants\/$/);
    await page.locator('#p-types').waitFor();
    const s = await docState(page);
    const text = await page.locator('main').innerText();
    const m = certaintyClaims(text);
    const review = await page.locator('.review-status').count();
    const sim = await vsimState(page);
    return { actual: `h1="${s.h1}"; review notes=${review}; certainty claims: ${m.length ? m.slice(0, 2).join(' | ') : 'none'}; vision simulator still mounted=${sim.mounted}`, ok: s.h1 === NAME['lens-implants'].ar && review > 0 && !m.length && !sim.mounted };
  }, { shot: true });

  await j.finish();
});
