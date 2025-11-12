/**
 * Cook Shrimp
 * Sauté plump shrimp in garlic and oil until they curl and turn a vibrant pink.
 */

import { Recipe } from '../../../types/crafting';

export const CookShrimp: Recipe = {
  "recipeId": "cook-shrimp",
  "name": "Cook Shrimp",
  "description": "Sauté plump shrimp in garlic and oil until they curl and turn a vibrant pink.",
  "skill": "cooking",
  "requiredLevel": 1,
  "duration": 6,
  "ingredients": [
    {
      "itemId": "shrimp",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "cooked_shrimp",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 25
} as const;
