/**
 * Cook Salmon
 * Grill fresh salmon over an open flame until the flesh turns a delicate pink and flakes easily.
 */

import { Recipe } from '../../../types/crafting';

export const CookSalmon: Recipe = {
  "recipeId": "cook-salmon",
  "name": "Cook Salmon",
  "description": "Grill fresh salmon over an open flame until the flesh turns a delicate pink and flakes easily.",
  "skill": "cooking",
  "requiredLevel": 5,
  "duration": 10,
  "ingredients": [
    {
      "itemId": "salmon",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "cooked_salmon",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 35
} as const;
