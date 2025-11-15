/**
 * Basic Health Tincture
 * A simple herbal remedy that restores minor health
 * Level: 1 Alchemy | Duration: 8s | XP: 20
 * Uses any 2 herbs - great for beginners learning alchemy
 */

import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const HealthTinctureRecipe: Recipe = {
  recipeId: 'health_tincture',
  name: 'Health Tincture',
  description: 'A simple herbal remedy that restores minor health. Any combination of herbs will work.',
  skill: 'alchemy',
  requiredLevel: 1,
  duration: 8,
  ingredients: [
    { subcategory: SUBCATEGORY.HERB, quantity: 2 }  // Any 2 herbs!
  ],
  outputs: [
    { itemId: 'health_tincture', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 20,
  unlockConditions: {
    discoveredByDefault: true
  }
} as const;
