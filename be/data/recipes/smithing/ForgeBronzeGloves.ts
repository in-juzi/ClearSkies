/**
 * Forge Bronze Gloves
 * Shape bronze plates into protective gauntlets, safeguarding the hands without sacrificing dexterity.
 */

import { Recipe } from '@shared/types';

export const ForgeBronzeGloves: Recipe = {
  "recipeId": "forge-bronze-gloves",
  "name": "Forge Bronze Gloves",
  "description": "Shape bronze plates into protective gauntlets, safeguarding the hands without sacrificing dexterity.",
  "skill": "smithing",
  "requiredLevel": 5,
  "duration": 8,
  "ingredients": [
    {
      "itemId": "bronze_ingot",
      "quantity": 1
    },
    {
      "itemId": "leather_scraps",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_gloves",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 38
} as const;
