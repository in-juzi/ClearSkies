/**
 * Floral Rejuvenation Draught
 * A delicate potion harnessing the restorative power of flowers
 * Level: 15 Alchemy | Duration: 14s | XP: 65
 * Requires flowers instead of herbs - demonstrates subcategory flexibility
 * Combines herb knowledge with flower essences
 */

import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const FloralRejuvenationDraught: Recipe = {
  recipeId: 'floral_rejuvenation_draught',
  name: 'Floral Rejuvenation Draught',
  description: 'A delicate potion harnessing the restorative power of flowers. Combines herbal and floral essences.',
  skill: 'alchemy',
  requiredLevel: 15,
  duration: 14,
  ingredients: [
    { subcategory: SUBCATEGORY.FLOWER, quantity: 2 },   // Any flowers - different from herbs!
    { subcategory: SUBCATEGORY.HERB, quantity: 1 }      // Base herb for stability
  ],
  outputs: [
    { itemId: 'health_elixir', quantity: 1, qualityModifier: 'inherit' },
    { itemId: 'mana_tincture', quantity: 1, qualityModifier: 'inherit' }  // Bonus output!
  ],
  experience: 65,
  unlockConditions: {
    discoveredByDefault: true  // Available at level 15
  }
} as const;
