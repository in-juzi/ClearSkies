/**
 * Forge Bronze Helm
 * Mold bronze into a protective helmet, offering decent defense for those venturing into danger.
 */

import { Recipe } from '../../../types/crafting';

export const ForgeBronzeHelm: Recipe = {
  "recipeId": "forge-bronze-helm",
  "name": "Forge Bronze Helm",
  "description": "Mold bronze into a protective helmet, offering decent defense for those venturing into danger.",
  "skill": "smithing",
  "requiredLevel": 7,
  "duration": 10,
  "ingredients": [
    {
      "itemId": "bronze_ingot",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "bronze_helm",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 45
} as const;
