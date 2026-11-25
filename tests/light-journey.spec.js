// "How Vision Works: Interactive Light Journey" (src/light-journey), run against the isolated harness
// /light-journey-preview.html, which mounts the module and exposes window.__lj (controller), window.__ljModule
// (module, including the teardown counters) and window.__ljEvents.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CAMERA, VB } from '../src/light-journey/diagram.js';

const PAGE = 'light-journey-preview.html';
const S = (page) => page.evaluate(() => window.__lj.getState());
const steps = (page) => page.evaluate(() => window.__ljModule.STEPS.map((s) => ({ id: s.id, part: s.part, en: s.en, ar: s.ar, wrong: s.wrong.map((w) => w.slug) })));

function watchConsole(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
async function open(page, query = 'lang=en') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => document.body.dataset.ready === '1' && !!document.querySelector('.lj-svg'));
}

let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

test.describe('light journey: content and steps', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const lang of ['en', 'ar']) {
    test(`walks every step in ${lang} with matching panel, rail, diagram and live region`, async ({ page }) => {
      await open(page, `lang=${lang}`);
      const all = await steps(page);
      expect(all).toHaveLength(9);
      const root = page.locator('.lj');
      await expect(root).toHaveAttribute('lang', lang);
      await expect(root).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      const next = page.locator('.lj-next');
      for (let i = 0; i < all.length; i++) {
        const c = all[i][lang];
        await expect(page.locator('.lj-step-title')).toHaveText(c.title);
        await expect(page.locator('.lj-body')).toHaveText(c.body);
        await expect(page.locator('.lj-count-n')).toHaveText(String(i + 1).padStart(2, '0'));
        await expect(page.locator('.lj-stop[aria-current="step"]')).toHaveAttribute('data-step', String(i));
        await expect(page.locator(`.lj-part[data-part="${all[i].part}"]`)).toHaveClass(/is-active/);
        await expect(page.locator('.lj-part.is-active')).toHaveCount(1);
        await expect(page.locator('.lj-wrong a')).toHaveCount(all[i].wrong.length);
        expect(await page.locator('.lj-svg desc').textContent()).toContain(c.name);
        if (i > 0) await expect(page.locator('.lj-live')).toContainText(c.name);
        expect((await S(page)).stepId).toBe(all[i].id);
        if (i < all.length - 1) await next.click();
      }
      await expect(next).toBeDisabled();
      await expect(page.locator('.lj-prev')).toBeEnabled();
      // the whole journey is also available as plain text
      await expect(page.locator('.lj-text li')).toHaveCount(9);
      await expect(page.locator('.lj-text li').first()).toContainText(all[0][lang].title);
    });
  }

  test('rays are revealed stage by stage and labelled illustrative', async ({ page }) => {
    await open(page, 'lang=en');
    const on = () => page.locator('.lj-ray.is-on').count();
    const first = await on();
    expect(first).toBeGreaterThan(0);
    await page.evaluate(() => window.__lj.goTo(6));
    expect(await on()).toBeGreaterThan(first);
    await expect(page.locator('.lj-note')).toHaveText(/^Light rays are illustrative and not to scale\./); // + the autoplay hint (2026-11-23)
    await expect(page.locator('.lj-illus text')).toHaveText('Illustrative');
    await page.evaluate(() => window.__lj.goTo(7));
    await expect(page.locator('.lj-inset')).toHaveClass(/is-on/); // photoreceptor inset on the retina step
    await page.evaluate(() => window.__lj.goTo(8));
    await expect(page.locator('.lj-inset')).not.toHaveClass(/is-on/);
    await expect(page.locator('.lj-signal')).toHaveClass(/is-on/);
  });

  // Visual reconstruction (2026-11-24): continuous motion while playing, frozen while paused.
  test('rays move continuously while playing and hold still while paused', async ({ page }) => {
    await open(page, 'lang=en&step=6');
    const snap = () => page.evaluate(() => [...document.querySelectorAll('.lj-flow.is-on, .lj-signal')].map((el) => el.getAttribute('stroke-dashoffset')).join('|'));
    const frames = () => page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 120)))));
    await page.evaluate(() => window.__lj.play());
    await expect(page.locator('.lj')).toHaveAttribute('data-playing', 'true');
    expect(await page.locator('.lj-flow.is-on').count()).toBeGreaterThan(10);
    const a = await snap(); await frames(); const b = await snap(); await frames(); const c = await snap();
    expect(b).not.toBe(a);
    expect(c).not.toBe(b);
    // the photon pulses are visible while playing (full motion)
    await expect.poll(() => page.locator('.lj-flow.is-on:not(.lj-flow--halo)').first().evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.5);
    await page.evaluate(() => window.__lj.pause());
    await expect(page.locator('.lj')).toHaveAttribute('data-playing', 'false');
    const p1 = await snap(); await frames(); await page.waitForTimeout(400); const p2 = await snap();
    expect(p2).toBe(p1);
    // on the last step the nerve signal moves too
    await page.evaluate(() => { window.__lj.seek(8.2 / 9); window.__lj.play(); });
    const s1 = await page.locator('.lj-signal').getAttribute('stroke-dashoffset');
    await frames(); await frames();
    expect(await page.locator('.lj-signal').getAttribute('stroke-dashoffset')).not.toBe(s1);
  });

  test('each step renders and highlights its anatomy', async ({ page }) => {
    await open(page, 'lang=en&reduced=1');
    const anatomy = {
      scene: ['.lj-obj.is-on', '.lj-sun.is-on', '.lj-src'],
      tear: ['.lj-tear'],
      cornea: ['.lj-cornea', '.lj-cornea-epi', '.lj-cornea-endo', '.lj-refract.is-on'],
      aqueous: ['.lj-aqueous'],
      iris: ['.lj-iris', '.lj-iris-pe', '.lj-ciliary path', '.lj-ray--blocked.is-on'],
      lens: ['.lj-lens', '.lj-lens-nucleus', '.lj-zonules line', '.lj-refract.is-on'],
      vitreous: ['.lj-vitreous', '.lj-vit-shade'],
      retina: ['.lj-retina', '.lj-retina-cells', '.lj-macula', '.lj-fovea', '.lj-disc', '.lj-choroid', '.lj-focus.is-on', '.lj-inset.is-on'],
      nerve: ['.lj-nerve', '.lj-sheath', '.lj-brain', '.lj-cortex.is-on', '.lj-signal.is-on']
    };
    const all = await steps(page);
    for (let i = 0; i < all.length; i++) {
      await page.evaluate((n) => window.__lj.goTo(n), i);
      const part = all[i].part;
      await expect(page.locator(`.lj-part[data-part="${part}"]`)).toHaveClass(/is-active/);
      await expect(page.locator(`.lj-label[data-part="${part}"]`)).toHaveClass(/is-active/);
      for (const sel of anatomy[part]) {
        // rendered and actually visible: a box, displayed, and a non-zero opacity all the way up to the drawing
        const v = await page.locator(sel).first().evaluate((el) => {
          const r = el.getBoundingClientRect();
          let op = 1, shown = true;
          for (let n = el; n && n.tagName !== 'svg'; n = n.parentElement) { const cs = getComputedStyle(n); op *= Number(cs.opacity); if (cs.display === 'none' || cs.visibility === 'hidden') shown = false; }
          return { size: r.width + r.height, op, shown };
        });
        expect(v.size, `${part}: ${sel} box`).toBeGreaterThan(0);
        expect(v.shown, `${part}: ${sel} displayed`).toBe(true);
        expect(v.op, `${part}: ${sel} opacity`).toBeGreaterThan(0.3);
      }
      // the refraction highlight belongs to the cornea and lens steps only
      expect(await page.locator('.lj-refract.is-on').count()).toBe(part === 'cornea' || part === 'lens' ? 1 : 0);
    }
    // by the vitreous step the beam (cone of light) and every ray segment reach the macula
    await page.evaluate(() => window.__lj.goTo(6));
    expect(await page.locator('.lj-beam.is-on').count()).toBe(5);
    expect(await page.locator('.lj-ray.is-on:not(.lj-ray--blocked)').count()).toBe(25);
  });

  // Review fixes (2026-11-25)
  test('no drawing writes while paused or under reduced motion', async ({ page }) => {
    const watch = () => page.evaluate(() => new Promise((res) => {
      let n = 0;
      const mo = new MutationObserver((l) => { n += l.length; });
      mo.observe(document.querySelector('.lj-svg'), { attributes: true, subtree: true });
      setTimeout(() => { mo.disconnect(); res(n); }, 700);
    }));
    await open(page, 'lang=en&step=6');
    await page.evaluate(() => window.__lj.play());
    expect(await watch()).toBeGreaterThan(0); // playing: the pulses move
    await page.evaluate(() => window.__lj.pause());
    await page.waitForTimeout(100);
    expect(await watch()).toBe(0); // paused: not one attribute write, the camera included
    await open(page, 'lang=en&step=6&reduced=1');
    await page.evaluate(() => window.__lj.play()); // even when asked to play, reduced motion keeps the drawing still
    await page.waitForTimeout(100);
    expect(await watch()).toBe(0);
  });

  for (const lang of ['en', 'ar']) {
    test(`the camera keeps every drawn part and label inside the frame on every step (${lang})`, async ({ page }) => {
      await open(page, `lang=${lang}`);
      for (const focus of ['far', 'near']) {
        await page.evaluate((f) => window.__lj.setFocus(f), focus);
        const box = await page.evaluate(() => {
          const svg = document.querySelector('.lj-svg');
          const w = svg.querySelector('.lj-world').getBBox(), l = svg.querySelector('.lj-labels').getBBox();
          return { w: { x: w.x, y: w.y, r: w.x + w.width, b: w.y + w.height }, l: { x: l.x, y: l.y, r: l.x + l.width, b: l.y + l.height } };
        });
        // the world is mirrored in Arabic (its own transform); labels are drawn in final coordinates
        const wx = lang === 'ar' ? [VB.w - box.w.r, VB.w - box.w.x] : [box.w.x, box.w.r];
        const ext = { x: Math.min(wx[0], box.l.x), r: Math.max(wx[1], box.l.r), y: Math.min(box.w.y, box.l.y), b: Math.max(box.w.b, box.l.b) };
        CAMERA.forEach(([fx, fy, s], step) => {
          const px = lang === 'ar' ? VB.w - fx : fx;
          const map = (x, p) => p * (1 - s) + s * x;
          expect(map(ext.x, px), `step ${step + 1} left, content ${JSON.stringify(ext)}`).toBeGreaterThanOrEqual(0);
          expect(map(ext.r, px), `step ${step + 1} right, content ${JSON.stringify(ext)}`).toBeLessThanOrEqual(VB.w);
          expect(map(ext.y, fy), `step ${step + 1} top`).toBeGreaterThanOrEqual(0);
          expect(map(ext.b, fy), `step ${step + 1} bottom`).toBeLessThanOrEqual(VB.h);
        });
      }
    });
  }

  test('"what goes wrong" links use the host-supplied linkFor', async ({ page }) => {
    await open(page, 'lang=en');
    const hrefs = async (i) => { await page.evaluate((n) => window.__lj.goTo(n), i); return page.locator('.lj-wrong a').evaluateAll((as) => as.map((a) => a.getAttribute('href'))); };
    expect(await hrefs(2)).toEqual(['./en/procedures/keratoconus-cxl/', './en/procedures/laser-vision-correction/']);
    expect(await hrefs(5)).toEqual(['./en/procedures/cataract-surgery/']);
    expect(await hrefs(7)).toEqual(['./en/procedures/intravitreal-injections/']);
    expect(await hrefs(4)).toEqual([]);
    // without linkFor the module falls back to basePath + language prefix
    await page.evaluate(() => { window.__lj = window.__ljModule.mount(document.getElementById('lj-host'), { lang: 'ar', basePath: '/site/', step: 5 }); });
    await expect(page.locator('.lj-wrong a')).toHaveAttribute('href', '/site/procedures/cataract-surgery/');
  });
});

test.describe('light journey: interaction', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('keyboard: arrows follow the reading direction, Home/End jump, focus stays visible', async ({ page }) => {
    await open(page, 'lang=en');
    const stop0 = page.locator('.lj-stop[data-step="0"]');
    await stop0.focus();
    await page.keyboard.press('ArrowRight');
    expect((await S(page)).step).toBe(1);
    await expect(page.locator('.lj-stop[data-step="1"]')).toBeFocused();
    await page.keyboard.press('End');
    expect((await S(page)).step).toBe(8);
    await page.keyboard.press('ArrowRight'); // clamps at the end
    expect((await S(page)).step).toBe(8);
    await page.keyboard.press('Home');
    expect((await S(page)).step).toBe(0);
    const outline = await page.locator('.lj-stop[data-step="0"]').evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
    // Tab reaches the Next button and Enter activates it
    await page.locator('.lj-next').focus();
    await page.keyboard.press('Enter');
    expect((await S(page)).step).toBe(1);
    // Arabic: the journey flows right to left, so ArrowLeft moves forward
    await page.evaluate(() => window.__lj.setLang('ar'));
    await page.locator('.lj-stop[data-step="1"]').focus();
    await page.keyboard.press('ArrowLeft');
    expect((await S(page)).step).toBe(2);
    await page.keyboard.press('ArrowRight');
    expect((await S(page)).step).toBe(1);
  });

  test('selecting a structure in the drawing or on the rail opens its step', async ({ page }) => {
    await open(page, 'lang=en');
    const all = await steps(page);
    // click inside each structure (thin curved parts are hit near their outer edge, not their box centre)
    const at = { cornea: [0.3, 0.5], retina: [0.97, 0.5], tear: [0.03, 0.5] };
    for (const part of ['lens', 'cornea', 'retina', 'nerve', 'vitreous', 'scene', 'tear']) {
      const hit = page.locator(`.lj-hits [data-hit="${part}"]`);
      // geometry box without the invisible hit stroke (locator.boundingBox() would include it)
      const box = await hit.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
      const [fx, fy] = at[part] || [0.5, 0.5];
      const [x, y] = [box.x + box.width * fx, box.y + box.height * fy];
      const under = await page.evaluate(([px, py]) => document.elementFromPoint(px, py)?.getAttribute('data-hit'), [x, y]);
      expect(under, `${part} at ${Math.round(x)},${Math.round(y)} box ${JSON.stringify(box)}`).toBe(part);
      await page.mouse.click(x, y);
      expect((await S(page)).stepId).toBe(all.find((s) => s.part === part).id);
    }
    await page.locator('.lj-stop[data-step="3"]').click();
    expect((await S(page)).stepId).toBe('aqueous');
    const ev = await page.evaluate(() => window.__ljEvents.filter((e) => e.ev === 'step').length);
    expect(ev).toBeGreaterThanOrEqual(7);
  });

  test('light level changes the pupil; focus changes the lens (accommodation)', async ({ page }) => {
    await open(page, 'lang=en&step=4');
    const iris = () => page.locator('.lj-iris').first().getAttribute('d');
    const lens = () => page.locator('.lj-lens').getAttribute('d');
    const i0 = await iris(), l0 = await lens();
    await page.getByRole('button', { name: 'Dim', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Dim', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Bright', exact: true })).toHaveAttribute('aria-pressed', 'false');
    expect(await iris()).not.toBe(i0);
    expect((await S(page)).light).toBe('dim');
    await page.getByRole('button', { name: 'Near', exact: true }).click();
    expect(await lens()).not.toBe(l0);
    expect((await S(page)).focus).toBe('near');
    await expect(page.locator('.lj-obj[data-focus="near"]')).toHaveClass(/is-on/);
    expect(await page.locator('.lj-svg desc').textContent()).toMatch(/dim light, wide pupil.*near/i);
    expect((await S(page)).step).toBe(4); // the switches never move the step
  });

  test('setLang / setTheme keep the state and emit events', async ({ page }) => {
    await open(page, 'lang=en&step=3&light=dim');
    await page.evaluate(() => { window.__lj.setTheme('dark'); window.__lj.setLang('ar'); });
    const s = await S(page);
    expect(s).toMatchObject({ lang: 'ar', theme: 'dark', step: 3, light: 'dim' });
    await expect(page.locator('.lj')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.lj-step-title')).toHaveText((await steps(page))[3].ar.title);
    const evs = await page.evaluate(() => window.__ljEvents.map((e) => e.ev));
    expect(evs).toContain('langchange');
    expect(evs).toContain('themechange');
  });
});

test.describe('light journey: lifecycle', () => {
  test('mount / destroy leaves nothing behind and remounting works', async ({ page }) => {
    await open(page, 'lang=en');
    const counters = () => page.evaluate(() => ({ ...window.__ljModule.counters }));
    expect((await counters()).live).toBe(1);
    expect((await counters()).listeners).toBeGreaterThan(0);
    const result = await page.evaluate(() => {
      const fired = [];
      window.__lj.on('destroy', () => fired.push('destroy'));
      const off = window.__lj.on('step', () => fired.push('step'));
      off();
      window.__lj.goTo(2);
      window.__lj.destroy();
      window.__lj.destroy(); // idempotent
      const host = document.getElementById('lj-host');
      return { fired, children: host.children.length, lj: document.querySelectorAll('.lj').length };
    });
    expect(result).toEqual({ fired: ['destroy'], children: 0, lj: 0 });
    expect(await counters()).toMatchObject({ live: 0, listeners: 0 });
    // calls after destroy are harmless
    await page.evaluate(() => { window.__lj.goTo(4); window.__lj.setLang('ar'); window.__lj.setTheme('dark'); });
    // remount, and mounting twice on one host replaces the first instance
    await page.evaluate(() => { window.__lj = window.__ljMount(); window.__lj = window.__ljMount(); });
    expect((await counters()).live).toBe(1);
    await expect(page.locator('.lj')).toHaveCount(1);
    await page.evaluate(() => window.__lj.destroy());
    expect(await counters()).toMatchObject({ live: 0, listeners: 0 });
  });
});

test.describe('light journey: layout and accessibility', () => {
  for (const width of [320, 390, 768, 1440]) {
    for (const lang of ['en', 'ar']) {
      test(`no horizontal overflow and ≥44 px targets at ${width} px (${lang})`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await open(page, `lang=${lang}&step=2`);
        const m = await page.evaluate(() => {
          const lj = document.querySelector('.lj');
          const r = lj.getBoundingClientRect();
          const wide = [...lj.querySelectorAll('*')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && (b.right > innerWidth + 0.5 || b.left < -0.5); }).map((el) => el.className.baseVal ?? el.className);
          const small = [...lj.querySelectorAll('button, summary, .lj-link')].filter((el) => el.offsetParent !== null)
            .map((el) => { const b = el.getBoundingClientRect(); return { c: el.className, w: Math.round(b.width), h: Math.round(b.height) }; })
            .filter((b) => b.w < 44 || b.h < 44);
          return { doc: document.documentElement.scrollWidth - document.documentElement.clientWidth, right: r.right - innerWidth, wide: wide.filter((c) => !/lj-hits|lj-world|lj-labels/.test(String(c))), small };
        });
        expect(m.doc).toBeLessThanOrEqual(0);
        expect(m.right).toBeLessThanOrEqual(0.5);
        expect(m.wide).toEqual([]);
        expect(m.small).toEqual([]);
      });
    }
  }

  for (const lang of ['en', 'ar']) {
    test(`phone layout at 390 px: tighter crop, legible labels, working targets (${lang})`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(page, `lang=${lang}&step=5`);
      const svg = page.locator('.lj-svg');
      await expect(svg).toHaveAttribute('data-layout', 'compact');
      const m = await page.evaluate(() => {
        const svg = document.querySelector('.lj-svg'), r = svg.getBoundingClientRect();
        const label = document.querySelector('.lj-label.is-active text').getBoundingClientRect();
        const globe = document.querySelector('.lj-vitreous').getBoundingClientRect();
        return { h: r.height, w: r.width, font: parseFloat(getComputedStyle(document.querySelector('.lj-label.is-active text')).fontSize) * r.width / svg.viewBox.baseVal.width,
          labelIn: label.left >= r.left - 0.5 && label.right <= r.right + 0.5, globeShare: globe.width / r.width };
      });
      expect(m.h).toBeGreaterThan(220); // was about 175 px with the wide plate
      expect(m.font).toBeGreaterThanOrEqual(12);
      expect(m.labelIn).toBe(true);
      expect(m.globeShare).toBeGreaterThan(0.45);
      // the scene is drawn closer, and the shortened distance is marked
      expect(await page.locator('.lj-break').evaluate((el) => el.getBBox().height)).toBeGreaterThan(20);
      // a tap on a structure still opens its step
      const cornea = page.locator('.lj-hits [data-hit="cornea"]');
      const fx = lang === 'ar' ? 0.7 : 0.3; // near the outer (front) edge of the crescent; mirrored in Arabic
      const b = await cornea.evaluate((el, f) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width * f, y: r.y + r.height / 2 }; }, fx);
      expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.getAttribute('data-hit'), [b.x, b.y])).toBe('cornea');
      await page.mouse.click(b.x, b.y);
      expect((await S(page)).stepId).toBe('cornea');
      // wide again above the breakpoint
      await page.setViewportSize({ width: 1024, height: 844 });
      await expect(svg).toHaveAttribute('data-layout', 'wide');
    });
  }

  test('reduced motion: no autonomous animation, no transitions, no auto-advance', async ({ page }) => {
    await open(page, 'lang=en&reduced=1&step=6');
    await expect(page.locator('.lj')).toHaveAttribute('data-motion', 'reduce');
    const st = await page.evaluate(() => {
      const ray = document.querySelector('.lj-ray.is-on'), flow = document.querySelector('.lj-flow'), sig = document.querySelector('.lj-signal');
      return {
        rayTransition: getComputedStyle(ray).transitionDuration,
        flowDisplay: getComputedStyle(flow).display,
        anims: document.getAnimations().length,
        sigAnim: getComputedStyle(sig).animationName
      };
    });
    expect(st.rayTransition).toBe('0s');
    expect(st.flowDisplay).toBe('none');
    expect(st.anims).toBe(0);
    expect(st.sigAnim).toBe('none');
    await page.waitForTimeout(1200); // nothing advances on its own
    expect((await S(page)).step).toBe(6);
  });

  test('reduced motion follows the system preference when no option is passed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, 'lang=en');
    await expect(page.locator('.lj')).toHaveAttribute('data-motion', 'reduce');
    expect((await S(page)).reducedMotion).toBe(true);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('.lj')).toHaveAttribute('data-motion', 'full');
  });

  test('the SVG is a single labelled image with a full text description', async ({ page }) => {
    await open(page, 'lang=ar&step=5');
    const svg = page.locator('.lj-svg');
    await expect(svg).toHaveAttribute('role', 'img');
    await expect(page.locator('.lj-svg title')).toHaveText('رسم يوضّح مسار الضوء داخل العين');
    expect((await page.locator('.lj-svg desc').textContent()).length).toBeGreaterThan(80);
    await expect(page.locator('.lj-live')).toHaveAttribute('aria-live', 'polite');
  });

  for (const q of ['lang=en&theme=light', 'lang=en&theme=dark', 'lang=ar&theme=light', 'lang=ar&theme=dark&step=7&light=dim&focus=near']) {
    test(`axe: no WCAG A/AA violations (${q})`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await open(page, q);
      await page.locator('.lj-text summary').click(); // include the text version
      const res = await new AxeBuilder({ page }).include('.lj').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
});
