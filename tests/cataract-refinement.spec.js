// Phase 2 refinements of the cataract simulator (in the real page): a plain mouse wheel over the viewer scrolls the
// page instead of being captured (Ctrl/⌘ + wheel zooms), and a full-screen mode (CSS, works on iPhone) with Escape.
import { test, expect } from '@playwright/test';

async function start(page, width = 1366, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto('/en/surgical-education/');
  await page.locator('#cataract-3d-start').click();
  await expect(page.locator('#cataract-3d-stage .csim canvas')).toHaveCount(1, { timeout: 25_000 });
  await expect(page.locator('#cataract-3d-stage .csim [data-ref="expand"]')).toBeVisible({ timeout: 25_000 });
}

test('a plain wheel over the 3D viewer scrolls the page', async ({ page }) => {
  await start(page);
  const box = await page.locator('#cataract-3d-stage .csim canvas').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const y0 = await page.evaluate(() => scrollY);
  await page.waitForTimeout(400);
  // keep wheeling until the page has moved: under load the smooth-scroll layer may start a moment later
  await expect.poll(async () => { await page.mouse.wheel(0, 300); await page.waitForTimeout(150); return page.evaluate(() => scrollY); }, { timeout: 10_000 }).toBeGreaterThan(y0 + 200);
});

for (const [w, h] of [[1366, 900], [390, 844]]) {
  test(`full screen ${w}x${h}: fills the screen, keeps the controls, Escape returns`, async ({ page }) => {
    await start(page, w, h);
    const sim = page.locator('#cataract-3d-stage .csim');
    const h0 = await sim.locator('.csim-viewport').evaluate((e) => e.getBoundingClientRect().height);
    await sim.locator('[data-ref="expand"]').click();
    await expect(sim).toHaveClass(/csim--expanded/);
    await expect(sim.locator('[data-ref="expand"]')).toHaveAttribute('aria-pressed', 'true');
    const r = await sim.evaluate((e) => { const b = e.getBoundingClientRect(); const v = e.querySelector('.csim-viewport').getBoundingClientRect(); return { top: b.top, left: b.left, w: b.width, ih: innerHeight, iw: innerWidth, vh: v.height }; });
    expect(r.top).toBe(0); expect(r.left).toBe(0);
    expect(Math.round(r.w)).toBe(r.iw);
    expect(r.vh).toBeGreaterThan(h0 - 1);
    await expect(sim.locator('.csim-playbar, [data-ref="playPause"]').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sim).not.toHaveClass(/csim--expanded/);
    await expect(sim.locator('[data-ref="expand"]')).toHaveAttribute('aria-pressed', 'false');
  });
}
