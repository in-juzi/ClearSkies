/**
 * Forge Iron Gloves
 * Forge articulated iron gauntlets that protect the hands while allowing full mobility.
 */

import { Recipe } from '@shared/types';

export const ForgeIronGloves: Recipe = {
  "recipeId": "forge-iron-gloves",
  "name": "Forge Iron Gloves",
  "description": "Forge articulated iron gauntlets that protect the hands while allowing full mobility.",
  "skill": "smithing",
  "requiredLevel": 14,
  "duration": 10,
  "ingredients": [
    {
      "itemId": "iron_ingot",
      "quantity": 1
    },
    {
      "itemId": "leather_scraps",
      "quantity": 2
    }
  ],
  "outputs": [
    {
      "itemId": "iron_gloves",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 58
} as const;
