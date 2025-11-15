/**
 * Enhanced Mana Potion
 * A refined herbal infusion with improved mana restoration
 * Level: 5 Alchemy | Duration: 10s | XP: 35
 * Combines sage's clarity properties with any additional herb
 * Unlocked after crafting Basic Mana Tincture
 */

import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const ManaPotionRecipe: Recipe = {
  recipeId: 'mana_potion',
  name: 'Mana Potion',
  description: 'A refined herbal infusion with improved mana restoration. Sage provides mental clarity.',
  skill: 'alchemy',
  requiredLevel: 5,
  duration: 10,
  ingredients: [
    { itemId: 'sage', quantity: 2 },          // Specific: clarity properties
    { subcategory: SUBCATEGORY.HERB, quantity: 1 }      // Any additional herb for potency
  ],
  outputs: [
    { itemId: 'mana_draught', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 35
} as const;
