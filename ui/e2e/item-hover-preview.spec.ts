import { test, expect } from '@playwright/test';
import { gotoGame } from './helpers';

/**
 * Hovering an inventory row surfaces the read-only item details panel (preview
 * mode), anchored beside the rail and vertically tracking the hovered item.
 * Captures a screenshot per hover position for review.
 */
test.describe('Inventory hover preview', () => {
  test('preview appears and tracks the hovered item', async ({ page }) => {
    await gotoGame(page);
    await page.locator('app-inventory-header button[title^="Comfortable"]').click();

    const rows = page.locator('app-inventory-density-view .row');
    const preview = page.locator('app-item-details-panel .item-details-panel.preview');

    // Hover a top row.
    await rows.first().hover();
    await expect(preview).toBeVisible({ timeout: 5000 });
    const topWhenHigh = await preview.evaluate((el) => el.getBoundingClientRect().top);
    await page.screenshot({ path: 'e2e/screenshots/item-hover-preview-top.png' });

    // Hover a lower row — the preview should sit lower than before.
    await rows.last().hover();
    await expect(preview).toBeVisible();
    // Allow the debounce + rAF reposition to settle.
    await expect
      .poll(async () => preview.evaluate((el) => el.getBoundingClientRect().top))
      .toBeGreaterThan(topWhenHigh);
    await page.screenshot({ path: 'e2e/screenshots/item-hover-preview-low.png' });
  });
});
