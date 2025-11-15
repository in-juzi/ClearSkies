/**
 * Enhanced Health Potion
 * A refined herbal concoction with improved healing properties
 * Level: 5 Alchemy | Duration: 10s | XP: 35
 * Combines chamomile's soothing properties with any additional herb
 * Unlocked after crafting Basic Health Tincture
 */

import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const HealthPotionRecipe: Recipe = {
  recipeId: 'health_potion',
  name: 'Health Potion',
  description: 'A refined herbal concoction with improved healing properties. Chamomile\'s calming essence is key.',
  skill: 'alchemy',
  requiredLevel: 5,
  duration: 10,
  ingredients: [
    { itemId: 'chamomile', quantity: 2 },     // Specific: calming properties
    { subcategory: SUBCATEGORY.HERB, quantity: 1 }      // Any additional herb for potency
  ],
  outputs: [
    { itemId: 'health_potion', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 35,
  unlockConditions: {
    discoveredByDefault: false,
    requiredRecipes: ['health_tincture']  // Unlock by crafting basic version
  }
} as const;
