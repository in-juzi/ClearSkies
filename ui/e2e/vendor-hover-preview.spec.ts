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
    const preview = vendor.locator('app-item-details-panel .item-details-panel.preview');

    // Buy tab (vendor stock, synthesized from the item definition). The preview
    // header should match the hovered stock item.
    const buyRow = vendor.locator('.list .row .rmain').first();
    await expect(buyRow).toBeVisible();
    const buyName = (await buyRow.locator('.nm').innerText()).trim();
    await buyRow.hover();
    await expect(preview.locator('h3')).toHaveText(buyName, { timeout: 5000 });
    await page.screenshot({ path: 'e2e/screenshots/vendor-hover-preview-buy.png' });

    // Switch to the Sell tab (real inventory instances). The preview must
    // update to the hovered sell item, not linger on the old buy item.
    await vendor.getByRole('button', { name: 'Sell', exact: true }).click();
    const sellRow = vendor.locator('.sell-list .row').first();
    await expect(sellRow).toBeVisible();
    const sellName = (await sellRow.locator('.nm').innerText()).trim();
    await sellRow.hover();
    await expect(preview.locator('h3')).toHaveText(sellName, { timeout: 5000 });
    await page.screenshot({ path: 'e2e/screenshots/vendor-hover-preview-sell.png' });
  });
});
