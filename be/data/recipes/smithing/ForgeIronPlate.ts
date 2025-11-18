/**
 * Forge Iron Plate Armor
 * Create a full suit of iron plate armor, the pinnacle of defensive metalwork for seasoned warriors.
 */

import { Recipe } from '@shared/types';

export const ForgeIronPlate: Recipe = {
  "recipeId": "forge-iron-plate",
  "name": "Forge Iron Plate Armor",
  "description": "Create a full suit of iron plate armor, the pinnacle of defensive metalwork for seasoned warriors.",
  "skill": "smithing",
  "requiredLevel": 20,
  "duration": 18,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 4
    },
    {
      "itemId": "leather_scraps",
      "quantity": 3
    }
  ],
  "outputs": [
    {
      "itemId": "iron_plate",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 85
} as const;
