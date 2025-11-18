/**
 * Forge Nails
 * Heat and shape iron ingots into sturdy nails for construction projects.
 */

import { Recipe } from '@shared/types';

export const ForgeNails: Recipe = {
  "recipeId": "forge-nails",
  "name": "Forge Nails",
  "description": "Heat and shape iron ingots into sturdy nails for construction projects.",
  "skill": "smithing",
  "requiredLevel": 3,
  "duration": 5,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "nails",
      "quantity": 10,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 25
} as const;
