import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Playwright E2E config for ClearSkies.
 *
 * Assumes the dev servers are running (Claude manages these):
 *   - UI   → http://localhost:4200  (ng serve)
 *   - API  → http://localhost:3000  (backend)
 *
 * global-setup authenticates a dedicated `e2e-bot` account (registering it on
 * first run), seeds a diverse inventory, and writes the auth token to
 * e2e/.auth/state.json so every test starts logged in.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  globalSetup: './e2e/global-setup.ts',
  reporter: [['list'], ['html', { outputFolder: 'e2e/.report', open: 'never' }]],
  outputDir: 'e2e/.results',

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4200',
    storageState: path.join(__dirname, 'e2e', '.auth', 'state.json'),
    viewport: { width: 1600, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // If 4200 is already up (the managed dev server), Playwright reuses it;
  // otherwise it boots `ng serve` as a fallback.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
