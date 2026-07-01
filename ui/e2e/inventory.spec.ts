import { test, expect } from '@playwright/test';
import { gotoGame } from './helpers';

/**
 * Captures the three inventory information densities. Doubles as a smoke test
 * (auth + shell render) and produces reviewable screenshots under
 * e2e/screenshots/.
 */

const DENSITIES = [
  { key: 'comfortable', title: 'Comfortable' },
  { key: 'compact', title: 'Compact' },
  { key: 'grid', title: 'Grid' },
] as const;

test.describe('Inventory density views', () => {
  test('capture each density', async ({ page }) => {
    await gotoGame(page);
    const inventory = page.locator('app-inventory');

    for (const d of DENSITIES) {
      await page.locator(`app-inventory-header button[title^="${d.title}"]`).click();
      // Wait for the density view to (re)render its scroll body before shooting.
      await expect(inventory.locator('.dv-scroll')).toBeVisible();
      await inventory.screenshot({ path: `e2e/screenshots/inventory-${d.key}.png` });
    }

    // Also grab the whole left rail for grouping/context.
    await page.locator('aside.left-sidebar').screenshot({
      path: 'e2e/screenshots/inventory-rail.png',
    });
  });
});
