import { type Page, expect } from '@playwright/test';

/**
 * Navigate to the game shell and wait for the inventory sidebar to render.
 * Relies on the storageState token (see global-setup) to boot authenticated.
 */
export async function gotoGame(page: Page): Promise<void> {
  await page.goto('/game');
  await expect(page.locator('app-inventory')).toBeVisible({ timeout: 30_000 });
}
