/**
 * Forge Iron Mining Pickaxe
 * Create a powerful iron pickaxe capable of extracting the hardest ores from deep within the earth.
 */

import { Recipe } from '@shared/types';

export const ForgeIronMiningPickaxe: Recipe = {
  "recipeId": "forge-iron-mining-pickaxe",
  "name": "Forge Iron Mining Pickaxe",
  "description": "Create a powerful iron pickaxe capable of extracting the hardest ores from deep within the earth.",
  "skill": "smithing",
  "requiredLevel": 12,
  "duration": 12,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 1
    },
    {
      "itemId": "willow_log",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "iron_mining_pickaxe",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 60
} as const;
