// Clinical profile expansion and UX refinement (owner brief 2026-11-23): hero, 25,000+ counter, procedure gallery,
// doctor profile (qualifications, timeline, contributions, devices, publications), five IOL categories, ocular-surface
// guidance, Light Journey autoplay, simulator details toggle and Before / After, Femto-LASIK wording, photo gallery.
import { test, expect } from '@playwright/test';
import { ACHIEVEMENTS, PUBLICATIONS, QUALIFICATIONS, SURGERY_STAT, isPublishablePhoto, GALLERY } from '../clinical-profile.js';
import { STEPS } from '../src/light-journey/content.js';
import { layerOptics } from '../src/vision-sim/optics/model.js';

const errorsOf = (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
};

test.describe('registry integrity', () => {
  test('every supplied achievement is inventoried with its original wording and a publication decision', () => {
    for (const id of ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'L01', 'D01', 'D02']) {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      expect(a, id).toBeTruthy();
      expect(a.original.length, id).toBeGreaterThan(10);
      expect(['public', 'qualified', 'internal']).toContain(a.display);
      if (a.display !== 'internal') { expect(a.public.ar, id).toBeTruthy(); expect(a.public.en, id).toBeTruthy(); }
    }
  });
  test('no public text makes an unverified first-in-region or pioneer claim', () => {
    // L01 (first president of the association) is a leadership role published before this brief (doctor-data.js
    // sscc-president, owner-supplied); it stays, with its provenance and the open verification noted in the registry.
    for (const a of ACHIEVEMENTS.filter((x) => x.display !== 'internal' && x.type !== 'leadership')) {
      expect(a.public.ar, a.id).not.toMatch(/أول من|أول جهاز|رائد|رواد|من أوائل/);
      expect(a.public.en, a.id).not.toMatch(/\bfirst\b|pioneer/i);
    }
  });
  test('only verified publications carry citations; the dropless paper is not invented', () => {
    for (const p of PUBLICATIONS) if (!p.verified) expect(p.citation).toBeNull();
    expect(PUBLICATIONS.find((p) => p.id === 'P-dropless').verified).toBe(false);
    const av = PUBLICATIONS.find((p) => p.id === 'P-antivegf-uveitis');
    expect(av.verified).toBe(true);
    expect(av.pubmed).toContain('25136452');
  });
  test('qualifications keep the supplied years; the statistic is 25,000+', () => {
    expect(QUALIFICATIONS.map((q) => q.years[0])).toEqual([2002, 2004, 2005]);
    expect(SURGERY_STAT.value).toBe(25000);
  });
  test('the gallery publishes nothing without permission, stripped metadata and (operating room) a privacy review', () => {
    expect(GALLERY.filter(isPublishablePhoto)).toHaveLength(GALLERY.filter((p) => p.published).length);
    const ok = { id: 'x', category: 'operating-room', image: 'a.jpg', alt: { ar: 'أ', en: 'a' }, permission: { documented: true, reference: 'r' }, exifStripped: true, published: true };
    expect(isPublishablePhoto(ok)).toBe(false); // no privacy review
    expect(isPublishablePhoto({ ...ok, permission: { ...ok.permission, patientPrivacyReviewed: true } })).toBe(true);
    expect(isPublishablePhoto({ ...ok, category: 'conferences', exifStripped: false })).toBe(false);
  });
});

test.describe('home page', () => {
  test('hero: no decorative eye plate; portrait, name and booking stay; one 25,000+ statistic', async ({ page }) => {
    const errors = errorsOf(page);
    await page.goto('/en/');
    await expect(page.locator('.hero-plate')).toHaveCount(0);
    await expect(page.locator('.hero-portrait img')).toBeVisible();
    await expect(page.locator('#hero-title')).toBeVisible();
    await expect(page.locator('#hero-primary-cta')).toBeVisible();
    await expect(page.locator('.hero-fact .stat-count')).toHaveAttribute('data-count', '25000');
    await expect(page.locator('.hero-fact .sr-only')).toHaveText('25,000+');
    expect(await page.locator('main').innerText()).not.toContain('15,000');
    expect(errors).toEqual([]);
  });
  test('the count-up lands exactly on 25,000+ and runs once', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/en/');
    await page.waitForTimeout(2500); // the count-up runs for 1.4 s once the number is on screen
    await expect(page.locator('.hero-fact .stat-num')).toHaveAttribute('data-n', '25,000+');
    const seen = await page.evaluate(async () => {
      const el = document.querySelector('.hero-fact .stat-num'); const vals = new Set();
      const t0 = performance.now(); while (performance.now() - t0 < 800) { vals.add(el.dataset.n); await new Promise((r) => setTimeout(r, 50)); }
      return [...vals];
    });
    expect(seen).toEqual(['25,000+']); // no reset, no overshoot after it lands
  });
  test('reduced motion shows the final value without animating', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('.hero-fact .stat-num')).toHaveAttribute('data-n', '25,000+');
    await ctx.close();
  });
  test('procedure gallery: seven large images with the name only, each one link, with a 3D badge', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('#procedures .pgal-item');
    await expect(items).toHaveCount(7);
    await expect(page.locator('#procedures .pc-sum')).toHaveCount(0);
    for (let i = 0; i < 7; i++) {
      const it = items.nth(i);
      await expect(it.locator('a.pgal-link')).toHaveCount(1);
      await expect(it.locator('.pgal-3d')).toHaveCount(1);
      expect((await it.locator('.pgal-name').innerText()).length).toBeGreaterThan(3);
    }
  });
  for (const w of [320, 360, 375, 390, 430]) {
    test(`no horizontal overflow at ${w}px (home, about, lens lab)`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      for (const u of ['/', '/en/about/', '/lens-lab/']) {
        await page.goto(u);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), u).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe('doctor profile', () => {
  test('qualifications, KKESH 2001–2009, contributions, devices and verified publications', async ({ page }) => {
    const errors = errorsOf(page);
    await page.goto('/en/about/');
    const main = page.locator('main');
    await expect(main).toContainText('International Council of Ophthalmology');
    await expect(main).toContainText('King Saud University Fellowship in Ophthalmology');
    await expect(main).toContainText('King Khaled Eye Specialist Hospital subspecialty fellowship');
    await expect(page.locator('#record')).toContainText('2001–2009');
    await expect(page.locator('#innovation .innov')).not.toHaveCount(0);
    await expect(page.locator('#diagnostics .dev-card')).toHaveCount(2);
    await expect(page.locator('#diagnostics')).toContainText('iTrace');
    await expect(page.locator('#diagnostics')).toContainText('Pentacam® AXL Wave');
    await expect(page.locator('#diagnostics img')).toHaveCount(0); // no unlicensed or substitute device photo
    await expect(page.locator('#publications a[href*="pubmed.ncbi.nlm.nih.gov/25136452"]')).toHaveCount(1);
    const text = await main.innerText();
    expect(text).not.toMatch(/\bthe first\b.*\b(Madinah|Saudi)/i);
    expect(text).not.toContain('despite');
    expect(errors).toEqual([]);
  });
  test('Arabic profile shows the KKESH teaching contribution and no superlative first claims', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('main')).toContainText('مستشفى الملك خالد التخصصي للعيون');
    expect(await page.locator('#innovation').innerText()).not.toMatch(/أول من|رائد/);
  });
});

test.describe('lens education', () => {
  test('lens lab: ocular-surface section, five categories in Dr. Maan’s order, toric explained as a correction', async ({ page }) => {
    const errors = errorsOf(page);
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/lens-lab/');
    await expect(page.locator('#ocular-surface h2')).toContainText('صحة سطح العين أولًا');
    await expect(page.locator('#ocular-surface .os-points li')).toHaveCount(4);
    await page.locator('#lab').scrollIntoViewIfNeeded();
    await expect(page.locator('.llab-table th[data-lens]')).toHaveCount(5, { timeout: 20_000 });
    const order = await page.locator('.llab-table th[data-lens]').evaluateAll((els) => els.map((e) => e.dataset.lens));
    expect(order).toEqual(['monofocal', 'enhanced', 'edof', 'trifocal', 'toric']);
    await expect(page.locator('#lab')).toContainText('الأحادية المطورة');
    await expect(page.locator('#lab')).toContainText('اللابؤرية');
    expect(errors).toEqual([]);
  });
  test('simulator: enhanced monofocal and a toric switch in More settings, 65 cm intermediate', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/en/lens-lab/');
    await page.locator('#simulator').scrollIntoViewIfNeeded();
    await expect(page.locator('.vsim-field-lens input[data-group="lensA"]')).toHaveCount(3, { timeout: 30_000 });
    await expect(page.locator('.vsim-field-presets')).toContainText('65 cm');
    await page.locator('.vsim-more').click();
    await expect(page.locator('.vsim-field-otherlens input[value="enhanced"]')).toHaveCount(1);
    await page.locator('.vsim-field-lens label[for$="lensA-edof"]').click();
    await page.locator('.vsim-toric').click();
    await expect.poll(() => page.evaluate(() => new URL(location.href).searchParams.get('lens'))).toBe('edof-toric');
    await expect(page.locator('.vsim-toric-note')).toBeVisible();
    await page.locator('.vsim-field-lens label[for$="lensA-trifocal"]').click();
    await expect.poll(() => page.evaluate(() => new URL(location.href).searchParams.get('lens'))).toBe('trifocal-toric'); // the switch stays on
  });
  test('optics: the enhanced monofocal sits between standard monofocal and EDOF at 65 cm; toric only helps with astigmatism', () => {
    const q = (lens, d, cyl = 0) => layerOptics({ lens, distanceM: d, pupilMm: 3, refraction: { sphereD: 0, cylD: cyl, axisDeg: 180 } }).sharpness;
    expect(q('enhanced', 0.65)).toBeGreaterThan(q('monofocal', 0.65));
    expect(q('enhanced', 0.65)).toBeLessThan(q('edof', 0.65));
    expect(q('enhanced', 0.4)).toBeLessThan(q('edof', 0.4)); // near still needs glasses
    expect(q('edof-toric', 6, 0)).toBeCloseTo(q('edof', 6, 0), 6);
    expect(q('edof-toric', 6, -1.5)).toBeGreaterThan(q('edof', 6, -1.5));
  });
  for (const slug of ['lens-implants', 'cataract-surgery']) {
    test(`${slug}: short ocular-surface note links to the full explanation`, async ({ page }) => {
      await page.goto(`/en/procedures/${slug}/`);
      const note = page.locator('.os-note');
      await expect(note).toHaveCount(1);
      await note.locator('a').click();
      await expect(page).toHaveURL(/lens-lab\/#ocular-surface$/);
      await expect(page.locator('#ocular-surface')).toBeVisible();
    });
  }
  test('lens implant page lists the five categories without a spectacle-independence guarantee', async ({ page }) => {
    await page.goto('/en/procedures/lens-implants/');
    const types = page.locator('#p-types .type');
    await expect(types).toHaveCount(5);
    const t = await page.locator('#p-types').innerText();
    expect(t).toContain('Enhanced monofocal');
    expect(t).not.toMatch(/no glasses|never need glasses|glasses-free/i);
  });
});

test.describe('light journey playback', () => {
  test('plays by itself, can be paused, scrubbed and replayed', async ({ page }) => {
    const errors = errorsOf(page);
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/en/how-vision-works/');
    const lj = page.locator('.lj');
    await lj.scrollIntoViewIfNeeded();
    await expect(lj).toHaveAttribute('data-playing', 'true', { timeout: 20_000 });
    const step0 = await lj.getAttribute('data-step');
    await expect.poll(() => lj.getAttribute('data-step'), { timeout: 12_000 }).not.toBe(step0); // advanced on its own
    await page.locator('.lj-playbtn').click();
    await expect(lj).toHaveAttribute('data-playing', 'false');
    const held = await lj.getAttribute('data-step');
    await page.waitForTimeout(1500);
    await expect(lj).toHaveAttribute('data-step', held);
    await page.locator('.lj-range').fill('999');
    await expect(lj).toHaveAttribute('data-step', STEPS[STEPS.length - 1].id); // scrubbing to the end shows the last step
    await page.locator('.lj-speed-b[data-speed="1.5"]').click();
    await expect(page.locator('.lj-speed-b[data-speed="1.5"]')).toHaveAttribute('aria-pressed', 'true');
    expect(errors).toEqual([]);
  });
  test('reduced motion: never starts by itself', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1366, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/en/how-vision-works/');
    const lj = page.locator('.lj');
    await lj.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    await expect(lj).toHaveAttribute('data-playing', 'false');
    await ctx.close();
  });
});

test.describe('procedure simulators', () => {
  async function start(page, slug) {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(`/en/procedures/${slug}/`);
    await page.locator('#procedure-3d-start').click();
    await expect.poll(() => page.evaluate(() => window.__procedureSim && window.__procedureSim.getState().state), { timeout: 25_000 }).toBe('ready');
  }
  test('anatomy details are hidden by default and shown on request', async ({ page }) => {
    await start(page, 'icl');
    expect((await page.evaluate(() => window.__procedureSim.getState())).details).toBe(false);
    await expect(page.locator('.ssim-details')).toHaveText(/Show details/);
    expect(await page.locator('.ssim-labels > *:not([hidden])').count()).toBe(0);
    await page.locator('.ssim-details').click();
    await expect(page.locator('.ssim-details')).toHaveText(/Hide details/);
    await expect.poll(() => page.locator('.ssim-labels > *:not([hidden])').count()).toBeGreaterThan(0);
  });
  for (const slug of ['lens-implants', 'icl', 'laser-vision-correction', 'corneal-transplant', 'intravitreal-injections']) {
    test(`${slug}: Before / After with responsible wording`, async ({ page }) => {
      await start(page, slug);
      await page.locator('.ssim-ba-btn[data-value="after"]').click();
      let st = await page.evaluate(() => window.__procedureSim.getState());
      expect(st.compare).toBe('after');
      expect(st.stageIndex).toBe(st.stageCount - 1);
      await expect(page.locator('.ssim-ba-text')).toBeVisible();
      await page.locator('.ssim-ba-btn[data-value="before"]').click();
      st = await page.evaluate(() => window.__procedureSim.getState());
      expect(st.compare).toBe('before');
      expect(st.stageIndex).toBe(0);
      expect(await page.locator('.ssim-ba-text').innerText()).not.toMatch(/cure[sd]?\b(?!.*not)|guarantee/i);
    });
  }
  test('keratoconus: Before / After only on the cross-linking tab, without an instant-shape promise', async ({ page }) => {
    await start(page, 'keratoconus-cxl');
    await expect(page.locator('.ssim-ba')).toBeHidden();
    await page.locator('[data-variant="cxl"]').click();
    await expect(page.locator('.ssim-ba')).toBeVisible();
    await page.locator('.ssim-ba-btn[data-value="after"]').click();
    await expect(page.locator('.ssim-ba-text')).toContainText('does not restore a normal corneal shape instantly');
  });
  test('Femto-LASIK naming in the laser simulator and the procedure page', async ({ page }) => {
    await start(page, 'laser-vision-correction');
    await expect(page.locator('[data-variant="lasik"]')).toHaveText(/Femto-LASIK/);
    await expect(page.locator('#p-types')).toContainText('Femto-LASIK');
  });
});

test.describe('photo gallery', () => {
  test('is not routed, linked or in the sitemap while no photograph is approved', async ({ page, request }) => {
    const sm = await (await request.get('/sitemap.xml')).text();
    expect(sm).not.toContain('/gallery/');
    await page.goto('/en/');
    await expect(page.locator('a[href*="gallery/"]')).toHaveCount(0);
  });
  test('harness: filter, lightbox with next / previous, Esc closes and focus returns', async ({ page }) => {
    const errors = errorsOf(page);
    await page.goto('/gallery-preview.html?lang=en');
    await expect(page.locator('.gal-item')).toHaveCount(4);
    await page.locator('.gal-chip[data-cat="conferences"]').click();
    await expect(page.locator('.gal-item')).toHaveCount(2);
    await page.locator('.gal-chip[data-cat="all"]').click();
    const thumb = page.locator('.gal-thumb').nth(1);
    await thumb.click();
    await expect(page.locator('.gal-box')).toBeVisible();
    await expect(page.locator('.gal-pos')).toHaveText('2 of 4');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.gal-pos')).toHaveText('3 of 4');
    await page.locator('.gal-nav[data-act="prev"]').click();
    await expect(page.locator('.gal-pos')).toHaveText('2 of 4');
    await page.keyboard.press('Escape');
    await expect(page.locator('.gal-box')).toBeHidden();
    await expect(page.locator('.gal-thumb').nth(1)).toBeFocused();
    await page.evaluate(() => window.__gal.destroy());
    expect(await page.evaluate(() => window.__galCounters.live)).toBe(0);
    expect(errors).toEqual([]);
  });
});
