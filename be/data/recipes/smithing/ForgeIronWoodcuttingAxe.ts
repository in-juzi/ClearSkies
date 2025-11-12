/**
 * Forge Iron Woodcutting Axe
 * Craft an iron axe head with superior edge retention, able to fell even the mightiest trees.
 */

import { Recipe } from '../../../types/crafting';

export const ForgeIronWoodcuttingAxe: Recipe = {
  "recipeId": "forge-iron-woodcutting-axe",
  "name": "Forge Iron Woodcutting Axe",
  "description": "Craft an iron axe head with superior edge retention, able to fell even the mightiest trees.",
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
      "itemId": "iron_woodcutting_axe",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 60
} as const;
