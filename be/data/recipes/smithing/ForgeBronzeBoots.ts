/**
 * Forge Bronze Boots
 * Craft bronze greaves and boots, protecting the legs and feet in battle.
 */

import { Recipe } from '@shared/types';

export const ForgeBronzeBoots: Recipe = {
  "recipeId": "forge-bronze-boots",
  "name": "Forge Bronze Boots",
  "description": "Craft bronze greaves and boots, protecting the legs and feet in battle.",
  "skill": "smithing",
  "requiredLevel": 6,
  "duration": 9,
  "ingredients": [
    {
      "itemId": "bronze_ingot",
      "quantity": 2
    },
    {
      "itemId": "leather_scraps",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_boots",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 42
} as const;
