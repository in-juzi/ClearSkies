/**
 * Forge Bronze Plate Armor
 * Forge interlocking bronze plates into a full suit of body armor, offering substantial protection.
 */

import { Recipe } from '@shared/types';

export const ForgeBronzePlate: Recipe = {
  "recipeId": "forge-bronze-plate",
  "name": "Forge Bronze Plate Armor",
  "description": "Forge interlocking bronze plates into a full suit of body armor, offering substantial protection.",
  "skill": "smithing",
  "requiredLevel": 10,
  "duration": 15,
  "ingredients": [
    {
      "itemId": "bronze_ingot",
      "quantity": 4
    },
    {
      "itemId": "leather_scraps",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_plate",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 60
} as const;
