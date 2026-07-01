import { test, expect } from '@playwright/test';
import { gotoGame } from './helpers';

/**
 * Captures the facilities list at the current location. The grid packs multiple
 * facility cards per row (minmax(200px, 1fr)); this doubles as a regression
 * guard on the --container/spacing token that grid-template-columns depends on.
 */
test.describe('Location facilities', () => {
  test('capture facilities grid', async ({ page }) => {
    await gotoGame(page);

    const list = page.locator('app-location-facility-list .facilities-list');
    await expect(list.locator('.facility-card').first()).toBeVisible({ timeout: 30_000 });

    await page.locator('app-location-facility-list').screenshot({
      path: 'e2e/screenshots/facilities.png',
    });
  });
});
