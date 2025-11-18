/**
 * Cook Trout
 * Pan-fry tender trout fillets with a touch of herbs and butter until golden brown.
 */

import { Recipe } from '@shared/types';

export const CookTrout: Recipe = {
  "recipeId": "cook-trout",
  "name": "Cook Trout",
  "description": "Pan-fry tender trout fillets with a touch of herbs and butter until golden brown.",
  "skill": "cooking",
  "requiredLevel": 1,
  "duration": 8,
  "ingredients": [
    {
      "itemId": "trout",
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "cooked_trout",
      "quantity": 1,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 20
} as const;
