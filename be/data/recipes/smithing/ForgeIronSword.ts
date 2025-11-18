/**
 * Forge Iron Sword
 * Hammer refined iron into a razor-sharp blade, stronger and more durable than its bronze predecessor.
 */

import { Recipe } from '@shared/types';

export const ForgeIronSword: Recipe = {
  "recipeId": "forge-iron-sword",
  "name": "Forge Iron Sword",
  "description": "Hammer refined iron into a razor-sharp blade, stronger and more durable than its bronze predecessor.",
  "skill": "smithing",
  "requiredLevel": 15,
  "duration": 14,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "iron_sword",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 70
} as const;
