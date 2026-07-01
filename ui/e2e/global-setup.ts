import { request, type FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Authenticates a dedicated E2E account and seeds it with a diverse inventory,
 * then persists the auth token as Playwright storageState so specs start
 * logged in. No real user credentials are required — the account is created on
 * first run via the open /auth/register endpoint.
 */

const API = process.env.E2E_API ?? 'http://localhost:3000/api';
const ORIGIN = process.env.E2E_BASE_URL ?? 'http://localhost:4200';
const TOKEN_KEY = 'clearskies_token';

const CREDS = {
  username: 'e2e_bot',
  email: 'e2e_bot@clearskies.test',
  password: 'E2eBot!2026',
};

const STATE_DIR = path.join(__dirname, '.auth');
const STATE_PATH = path.join(STATE_DIR, 'state.json');

/** Spread picks across rarities so rarity borders are visible in screenshots. */
function pickDiverse(pool: any[], n: number): any[] {
  const byRarity = new Map<string, any[]>();
  for (const item of pool) {
    const r = item?.rarity ?? 'common';
    if (!byRarity.has(r)) byRarity.set(r, []);
    byRarity.get(r)!.push(item);
  }
  const rarities = [...byRarity.keys()];
  const chosen: any[] = [];
  let i = 0;
  while (chosen.length < n && rarities.some(r => byRarity.get(r)!.length > 0)) {
    const bucket = byRarity.get(rarities[i % rarities.length])!;
    if (bucket.length) chosen.push(bucket.shift());
    i++;
  }
  return chosen;
}

async function globalSetup(_config: FullConfig): Promise<void> {
  const ctx = await request.newContext();

  // 1. Authenticate — log in, or register the e2e account on first run.
  let token: string;
  const login = await ctx.post(`${API}/auth/login`, {
    data: { email: CREDS.email, password: CREDS.password },
  });
  if (login.ok()) {
    token = (await login.json()).data.token;
  } else {
    const reg = await ctx.post(`${API}/auth/register`, { data: CREDS });
    if (!reg.ok()) {
      throw new Error(
        `[e2e] auth failed — is the backend up at ${API}? ` +
        `login=${login.status()}, register=${reg.status()} ${await reg.text()}`
      );
    }
    token = (await reg.json()).data.token;
  }
  const headers = { Authorization: `Bearer ${token}` };

  // 2. Seed a diverse inventory only when the account is sparse (keeps re-runs
  //    from ballooning the stash).
  try {
    const invRes = await ctx.get(`${API}/inventory`, { headers });
    const count = invRes.ok() ? ((await invRes.json())?.inventory?.length ?? 0) : 0;
    if (count < 8) {
      const itemsRes = await ctx.get(`${API}/manual/items`, { headers });
      if (itemsRes.ok()) {
        const cats = (await itemsRes.json())?.categories ?? {};
        const pool = [
          ...(cats.equipment ?? []),
          ...(cats.consumables ?? []),
          ...(cats.resources ?? []),
        ];
        const chosen = pickDiverse(pool, 12);
        for (const item of chosen) {
          await ctx.post(`${API}/inventory/items/random`, {
            headers,
            data: { itemId: item.itemId, quantity: 3 },
          });
        }
        console.log(`[e2e] seeded ${chosen.length} item stacks`);
      }
    } else {
      console.log(`[e2e] inventory already has ${count} stacks — skipping seed`);
    }
  } catch (err) {
    console.warn('[e2e] seeding skipped:', err);
  }

  // 3. Persist auth token as storageState localStorage for the app origin.
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        cookies: [],
        origins: [{ origin: ORIGIN, localStorage: [{ name: TOKEN_KEY, value: token }] }],
      },
      null,
      2
    )
  );

  await ctx.dispose();
}

export default globalSetup;
