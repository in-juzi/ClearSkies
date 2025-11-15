/**
 * Dragon's Fury Brew
 * A fiery elixir that ignites the warrior spirit and sharpens killing intent
 * Level: 15 Alchemy | Duration: 20s | XP: 75
 * Dragon's Breath's fiery properties increase critical strike chance
 * Unlocked after crafting Mandrake Power Elixir
 */

import { Recipe } from '../../../types';

export const DragonsFuryBrew: Recipe = {
  recipeId: 'dragons_fury_brew',
  name: "Dragon's Fury Brew",
  description: "A fiery elixir made from dragon's breath that ignites the warrior spirit. Increases critical strike chance.",
  skill: 'alchemy',
  requiredLevel: 15,
  duration: 20,
  ingredients: [
    { itemId: 'dragons_breath', quantity: 2 },  // Dragon's Breath for fury
    { itemId: 'mandrake_root', quantity: 1 }    // Mandrake for potency
  ],
  outputs: [
    { itemId: 'fury_brew', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 75,
  unlockConditions: {
    discoveredByDefault: false,
    requiredRecipes: ['mandrake_power_elixir']  // Unlock by crafting power elixir
  }
} as const;
