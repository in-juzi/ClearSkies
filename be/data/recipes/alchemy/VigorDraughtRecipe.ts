/**
 * Nettle Vigor Draught
 * An energizing concoction that quickens reflexes and sharpens strikes
 * Level: 5 Alchemy | Duration: 12s | XP: 35
 * Nettle's energizing properties increase attack speed
 * Unlocked after crafting Basic Health Tincture
 */

import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const NettleVigorDraught: Recipe = {
  recipeId: 'nettle_vigor_draught',
  name: 'Nettle Vigor Draught',
  description: 'An energizing concoction made from nettle that quickens reflexes. Increases attack speed temporarily.',
  skill: 'alchemy',
  requiredLevel: 5,
  duration: 12,
  ingredients: [
    { itemId: 'nettle', quantity: 2 },               // Nettle for vigor
    { subcategory: SUBCATEGORY.HERB, quantity: 1 }  // Any herb for base
  ],
  outputs: [
    { itemId: 'vigor_draught', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 35
} as const;
