/**
 * Forge Bronze Sword
 * Shape heated bronze into a sturdy sword blade, suitable for combat and reliable in the hands of any warrior.
 */

import { Recipe } from '@shared/types';

export const ForgeBronzeSword: Recipe = {
  "recipeId": "forge-bronze-sword",
  "name": "Forge Bronze Sword",
  "description": "Shape heated bronze into a sturdy sword blade, suitable for combat and reliable in the hands of any warrior.",
  "skill": "smithing",
  "requiredLevel": 5,
  "duration": 12,
  "ingredients": [
    {
      "itemId": "bronze_ingot",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_sword",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 50
} as const;
