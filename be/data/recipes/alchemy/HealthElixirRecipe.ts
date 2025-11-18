/**
 * Concentrated Vitality Elixir
 * A potent mixture combining three herbs for maximum health restoration
 * Level: 10 Alchemy | Duration: 12s | XP: 50
 * Uses pure herb-based formula - no specific ingredients required
 * Teaches advanced herb combination techniques
 */

import { Recipe } from '@shared/types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const HealthElixirRecipe: Recipe = {
  recipeId: 'health_elixir',
  name: 'Health Elixir',
  description: 'A potent mixture combining three herbs for maximum health restoration. Quality matters greatly.',
  skill: 'alchemy',
  requiredLevel: 10,
  duration: 12,
  ingredients: [
    { subcategory: SUBCATEGORY.HERB, quantity: 3 }  // Any 3 herbs - choose wisely!
  ],
  outputs: [
    { itemId: 'health_elixir', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 50
} as const;
