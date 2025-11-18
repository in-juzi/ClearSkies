/**
 * Forge Iron Boots
 * Craft heavy iron greaves and sabatons, offering superior protection for legs and feet.
 */

import { Recipe } from '@shared/types';

export const ForgeIronBoots: Recipe = {
  "recipeId": "forge-iron-boots",
  "name": "Forge Iron Boots",
  "description": "Craft heavy iron greaves and sabatons, offering superior protection for legs and feet.",
  "skill": "smithing",
  "requiredLevel": 16,
  "duration": 11,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 2
    },
    {
      "itemId": "leather_scraps",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "iron_boots",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 62
} as const;
