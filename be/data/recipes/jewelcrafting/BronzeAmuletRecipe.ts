/**
 * Bronze Amulet
 * Jewelcrafting: draw and shape a bronze ingot into a pendant and chain. The
 * first wearable jewelry base — fills the necklace slot and, being uncommon,
 * comes with one socket for an enchanter to charge. See jewelcrafting.md.
 * Level: 1 Jewelcrafting | Duration: 12s | XP: 30
 */

import { Recipe } from '@shared/types';

export const BronzeAmuletRecipe: Recipe = {
  recipeId: 'bronze_amulet',
  name: 'Bronze Amulet',
  description: 'Shape a bronze ingot into a pendant and chain — a plain amulet with a single socket, ready to be enchanted.',
  skill: 'jewelcrafting',
  requiredLevel: 1,
  duration: 12,
  ingredients: [
    { itemId: 'bronze_ingot', quantity: 1 }
  ],
  outputs: [
    { itemId: 'bronze_amulet', quantity: 1, qualityModifier: 'fixed' }
  ],
  experience: 30
} as const;
