import { test, expect } from '@playwright/test';
import { gotoGame } from './helpers';

/**
 * The bank modal should surface the same read-only item-details preview on
 * hover, anchored beside the hovered item.
 */
test.describe('Bank hover preview', () => {
  test('shows preview when hovering a bank item', async ({ page }) => {
    await gotoGame(page);

    // Facilities → Kennik Bank → Access Bank Storage.
    await page.locator('app-location-facility-list .facility-card', { hasText: 'Kennik Bank' }).click();
    await page.getByRole('button', { name: /Access Bank Storage/i }).click();

    const modal = page.locator('app-bank .bank-modal');
    await expect(modal).toBeVisible();

    // The inventory (right) panel is populated for e2e_bot; hover its first row.
    const firstRow = modal.locator('.lrow').first();
    await expect(firstRow).toBeVisible();
    await firstRow.hover();

    const preview = modal.locator('app-item-details-panel .item-details-panel.preview');
    await expect(preview).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'e2e/screenshots/bank-hover-preview.png' });
  });
});
