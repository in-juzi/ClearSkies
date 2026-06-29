/**
 * Cut Ruby
 * Jewelcrafting: take a rough mined ruby to the bench and facet it into a clean
 * vessel. Precision work, not the forge — this is the dexterity craft that feeds
 * the enchanter (cut gems hold mana better than raw rock). See jewelcrafting.md.
 * Level: 1 Jewelcrafting | Duration: 8s | XP: 20
 */

import { Recipe } from '@shared/types';

export const CutRubyRecipe: Recipe = {
  recipeId: 'cut_ruby',
  name: 'Cut Ruby',
  description: 'Facet a rough ruby into a brilliant cut gem — a finer vessel for an enchanter\'s mana.',
  skill: 'jewelcrafting',
  requiredLevel: 1,
  duration: 8,
  ingredients: [
    { itemId: 'ruby', quantity: 1 }
  ],
  outputs: [
    { itemId: 'cut_ruby', quantity: 1, qualityModifier: 'fixed' }
  ],
  experience: 20
} as const;
