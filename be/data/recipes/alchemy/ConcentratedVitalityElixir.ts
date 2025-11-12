/**
 * Concentrated Vitality Elixir
 * A potent mixture combining three herbs for maximum health restoration
 * Level: 10 Alchemy | Duration: 12s | XP: 50
 * Uses pure herb-based formula - no specific ingredients required
 * Teaches advanced herb combination techniques
 */

import { Recipe } from '../../../types';

export const ConcentratedVitalityElixir: Recipe = {
  recipeId: 'concentrated_vitality_elixir',
  name: 'Concentrated Vitality Elixir',
  description: 'A potent mixture combining three herbs for maximum health restoration. Quality matters greatly.',
  skill: 'alchemy',
  requiredLevel: 10,
  duration: 12,
  ingredients: [
    { subcategory: 'herb', quantity: 3 }  // Any 3 herbs - choose wisely!
  ],
  outputs: [
    { itemId: 'strong_health_potion', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 50,
  unlockConditions: {
    discoveredByDefault: true  // Available at level 10
  }
} as const;
