/**
 * Basic Mana Tincture
 * A simple herbal infusion that restores minor mana
 * Level: 1 Alchemy | Duration: 8s | XP: 20
 * Uses any 2 herbs - teaches the basics of mana restoration
 */

import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const ManaTinctureRecipe: Recipe = {
  recipeId: 'mana_tincture',
  name: 'Mana Tincture',
  description: 'A simple herbal infusion that restores minor mana. Any combination of herbs will work.',
  skill: 'alchemy',
  requiredLevel: 1,
  duration: 8,
  ingredients: [
    { subcategory: SUBCATEGORY.HERB, quantity: 2 }  // Any 2 herbs!
  ],
  outputs: [
    { itemId: 'mana_tincture', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 20,
  unlockConditions: {
    discoveredByDefault: true
  }
} as const;
