/**
 * Mandrake Power Elixir
 * A potent brew infused with the mystical essence of mandrake
 * Level: 8 Alchemy | Duration: 15s | XP: 45
 * Mandrake's magical potency amplifies offensive power
 * Unlocked after crafting Nettle Vigor Draught
 */

import { Recipe } from '@shared/types';

export const PowerElixirRecipe: Recipe = {
  recipeId: 'mandrake_power_elixir',
  name: 'Mandrake Power Elixir',
  description: 'A potent brew infused with the mystical essence of mandrake. Amplifies offensive power temporarily.',
  skill: 'alchemy',
  requiredLevel: 8,
  duration: 15,
  ingredients: [
    { itemId: 'mandrake_root', quantity: 1 },  // Mandrake for power
    { itemId: 'sage', quantity: 2 }            // Sage for stability
  ],
  outputs: [
    { itemId: 'power_elixir', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 45
} as const;
