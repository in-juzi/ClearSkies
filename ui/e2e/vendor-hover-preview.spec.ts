import { test, expect } from '@playwright/test';
import { gotoGame } from './helpers';

/**
 * The vendor's Sell pane should surface the same read-only item-details
 * preview on hover (sell items are real inventory instances).
 */
test.describe('Vendor hover preview', () => {
  test('shows preview when hovering a sell item', async ({ page }) => {
    await gotoGame(page);

    // Facilities → Village Market → first merchant.
    await page.locator('app-location-facility-list .facility-card', { hasText: 'Village Market' }).click();
    await page.locator('app-location-facility-detail .vendor-card').first().click();

    const vendor = page.locator('app-vendor');
    await expect(vendor).toBeVisible();

    // Switch to the Sell tab (populated from inventory), hover the first item.
    await vendor.getByRole('button', { name: 'Sell', exact: true }).click();
    const firstRow = vendor.locator('.sell-list .row').first();
    await expect(firstRow).toBeVisible();
    await firstRow.hover();

    const preview = vendor.locator('app-item-details-panel .item-details-panel.preview');
    await expect(preview).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'e2e/screenshots/vendor-hover-preview.png' });
  });
});
