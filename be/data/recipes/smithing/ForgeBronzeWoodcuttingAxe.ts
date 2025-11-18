/**
 * Forge Bronze Woodcutting Axe
 * Craft a bronze axe head with a keen edge, perfect for felling trees with efficiency.
 */

import { Recipe } from '@shared/types';

export const ForgeBronzeWoodcuttingAxe: Recipe = {
  "recipeId": "forge-bronze-woodcutting-axe",
  "name": "Forge Bronze Woodcutting Axe",
  "description": "Craft a bronze axe head with a keen edge, perfect for felling trees with efficiency.",
  "skill": "smithing",
  "requiredLevel": 3,
  "duration": 10,
  "ingredients": [
    {
      "itemId": "bronze_ingot",
      "quantity": 1
    },
    {
      "itemId": "oak_log",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_woodcutting_axe",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 40
} as const;
