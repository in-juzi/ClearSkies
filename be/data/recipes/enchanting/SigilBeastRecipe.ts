/**
 * Bind Beast Sigil
 * Enchanting: bind a beast's crystallized essence into a gemstone vessel,
 * producing a socketable sigil. The essence decides the EFFECT (a passive crit
 * bonus); the gem is the vessel (any gemstone works in v1). See enchanting.md.
 * Level: 1 Enchanting | Duration: 10s | XP: 25
 */

import { Recipe } from '@shared/types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const SigilBeastRecipe: Recipe = {
  recipeId: 'sigil_beast',
  name: 'Bind Beast Sigil',
  description: 'Bind a beast\'s essence into a gemstone vessel, capturing its predator instinct as a socketable sigil.',
  skill: 'enchanting',
  requiredLevel: 1,
  duration: 10,
  ingredients: [
    { itemId: 'essence_beast', quantity: 1 }, // the effect (predator instinct)
    { subcategory: SUBCATEGORY.GEMSTONE, quantity: 1 } // the vessel (any gemstone)
  ],
  outputs: [
    { itemId: 'sigil_beast', quantity: 1, qualityModifier: 'fixed' }
  ],
  experience: 25
} as const;
