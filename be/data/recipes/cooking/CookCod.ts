/**
 * Cook Cod
 * Bake thick cod steaks until the meat is white and tender, perfect for a hearty meal.
 */

import { Recipe } from '../../../types/crafting';

export const CookCod: Recipe = {
  "recipeId": "cook-cod",
  "name": "Cook Cod",
  "description": "Bake thick cod steaks until the meat is white and tender, perfect for a hearty meal.",
  "skill": "cooking",
  "requiredLevel": 10,
  "duration": 12,
  "ingredients": [
    {
      "itemId": "cod",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "cooked_cod",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 45
} as const;
