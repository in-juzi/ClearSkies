/**
 * Smelt Iron Ingot
 * Heat raw iron ore in the scorching flames until impurities burn away, leaving a heavy iron ingot.
 */

import { Recipe } from '@shared/types';

export const SmeltIronIngot: Recipe = {
  "recipeId": "smelt-iron-ingot",
  "name": "Smelt Iron Ingot",
  "description": "Heat raw iron ore in the scorching flames until impurities burn away, leaving a heavy iron ingot.",
  "skill": "smithing",
  "requiredLevel": 5,
  "duration": 10,
  "ingredients": [
    {
      "itemId": "iron_ore",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "iron_ingot",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 45
} as const;
