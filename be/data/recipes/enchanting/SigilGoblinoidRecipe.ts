/**
 * Bind Goblinoid Sigil
 * Enchanting: bind a goblin's crystallized essence into a gemstone vessel,
 * producing a socketable sigil. The essence decides the EFFECT (steal gold on
 * hit); the gem is the vessel (any gemstone works in v1). See enchanting.md.
 * Level: 1 Enchanting | Duration: 10s | XP: 25
 */

import { Recipe } from '@shared/types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const SigilGoblinoidRecipe: Recipe = {
  recipeId: 'sigil_goblinoid',
  name: 'Bind Goblinoid Sigil',
  description: 'Bind a goblin\'s essence into a gemstone vessel, capturing its greedy cunning as a socketable sigil.',
  skill: 'enchanting',
  requiredLevel: 1,
  duration: 10,
  ingredients: [
    { itemId: 'essence_goblinoid', quantity: 1 }, // the effect (goblin's greed)
    { subcategory: SUBCATEGORY.GEMSTONE, quantity: 1 } // the vessel (any gemstone)
  ],
  outputs: [
    { itemId: 'sigil_goblinoid', quantity: 1, qualityModifier: 'fixed' }
  ],
  experience: 25
} as const;
