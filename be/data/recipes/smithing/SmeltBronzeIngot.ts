/**
 * Smelt Bronze Ingot
 * Combine copper and tin ore in the forge, heating them until they meld into a gleaming bronze ingot.
 */

import { Recipe } from '@shared/types';

export const SmeltBronzeIngot: Recipe = {
  "recipeId": "smelt-bronze-ingot",
  "name": "Smelt Bronze Ingot",
  "description": "Combine copper and tin ore in the forge, heating them until they meld into a gleaming bronze ingot.",
  "skill": "smithing",
  "requiredLevel": 1,
  "duration": 8,
  "ingredients": [
    {
      "itemId": "copper_ore",
      "quantity": 1
    },
    {
      "itemId": "tin_ore",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_ingot",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 100
} as const;
