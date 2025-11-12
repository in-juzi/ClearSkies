/**
 * Forge Bronze Mining Pickaxe
 * Hammer bronze into a sturdy pickaxe head, designed to break through stone and extract precious ores.
 */

import { Recipe } from '../../../types/crafting';

export const ForgeBronzeMiningPickaxe: Recipe = {
  "recipeId": "forge-bronze-mining-pickaxe",
  "name": "Forge Bronze Mining Pickaxe",
  "description": "Hammer bronze into a sturdy pickaxe head, designed to break through stone and extract precious ores.",
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
      "itemId": "bronze_mining_pickaxe",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 40
} as const;
