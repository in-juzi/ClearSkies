import { test, expect } from '@playwright/test';
import { gotoGame } from './helpers';

/**
 * Hovering an inventory row should surface the read-only item details panel
 * anchored beside the rail (preview mode). Captures a screenshot for review.
 */
test.describe('Inventory hover preview', () => {
  test('shows anchored preview on hover', async ({ page }) => {
    await gotoGame(page);

    // Comfortable density shows named rows; hover the first one.
    await page.locator('app-inventory-header button[title^="Comfortable"]').click();
    const firstRow = page.locator('app-inventory-density-view .row').first();
    await expect(firstRow).toBeVisible();
    await firstRow.hover();

    // Preview panel (read-only) should appear.
    const preview = page.locator('app-item-details-panel .item-details-panel.preview');
    await expect(preview).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'e2e/screenshots/item-hover-preview.png' });
  });
});
