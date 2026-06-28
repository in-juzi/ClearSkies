/**
 * Bind Humanoid Sigil
 * Enchanting: bind an outlaw's crystallized essence into a gemstone vessel,
 * producing a socketable sigil. The essence decides the EFFECT (heal on kill);
 * the gem is the vessel (any gemstone works in v1). See enchanting.md.
 * Level: 1 Enchanting | Duration: 10s | XP: 25
 */

import { Recipe } from '@shared/types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const SigilHumanoidRecipe: Recipe = {
  recipeId: 'sigil_humanoid',
  name: 'Bind Humanoid Sigil',
  description: 'Bind an outlaw\'s essence into a gemstone vessel, capturing its martial opportunism as a socketable sigil.',
  skill: 'enchanting',
  requiredLevel: 1,
  duration: 10,
  ingredients: [
    { itemId: 'essence_humanoid', quantity: 1 }, // the effect (heal on kill)
    { subcategory: SUBCATEGORY.GEMSTONE, quantity: 1 } // the vessel (any gemstone)
  ],
  outputs: [
    { itemId: 'sigil_humanoid', quantity: 1, qualityModifier: 'fixed' }
  ],
  experience: 25
} as const;
