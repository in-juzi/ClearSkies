/**
 * Forge Iron Helm
 * Shape iron into a sturdy helmet with reinforced plates, providing excellent head protection.
 */

import { Recipe } from '@shared/types';

export const ForgeIronHelm: Recipe = {
  "recipeId": "forge-iron-helm",
  "name": "Forge Iron Helm",
  "description": "Shape iron into a sturdy helmet with reinforced plates, providing excellent head protection.",
  "skill": "smithing",
  "requiredLevel": 17,
  "duration": 12,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "iron_helm",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 65
} as const;
