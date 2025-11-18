/**
 * Sage Warding Tonic
 * A protective brew that hardens the skin and fortifies defenses
 * Level: 3 Alchemy | Duration: 10s | XP: 25
 * Sage's protective properties grant temporary armor
 */

import { Recipe } from '@shared/types';

export const WardingTonicRecipe: Recipe = {
  recipeId: 'sage_warding_tonic',
  name: 'Sage Warding Tonic',
  description: 'A protective brew made from sage that hardens the skin and fortifies defenses. Grants temporary armor bonus.',
  skill: 'alchemy',
  requiredLevel: 3,
  duration: 10,
  ingredients: [
    { itemId: 'sage', quantity: 3 }  // Sage-specific for armor buff
  ],
  outputs: [
    { itemId: 'warding_tonic', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 25
} as const;
