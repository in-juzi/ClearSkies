/**
 * Glassblowing
 * Heat sand to extreme temperatures to create clear glass panes for construction.
 */

import { Recipe } from '../../../types/crafting';

export const GlassblowingRecipe: Recipe = {
  "recipeId": "glassblowing",
  "name": "Glassblowing",
  "description": "Heat sand to extreme temperatures to create clear glass panes for construction.",
  "skill": "alchemy",
  "requiredLevel": 15,
  "duration": 12,
  "ingredients": [
    {
      "itemId": "sand",
      "quantity": 3
    }
  ],
  "outputs": [
    {
      "itemId": "glass",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 40
} as const;
