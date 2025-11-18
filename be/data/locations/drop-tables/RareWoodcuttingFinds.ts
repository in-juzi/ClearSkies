/**
 * Rare Woodcutting Finds
 * Universal rare items that can be found while woodcutting any tree type
 */

import { DropTable } from '@shared/types';

export const RareWoodcuttingFinds: DropTable = {
  "dropTableId": "rare-woodcutting-finds",
  "name": "Rare Woodcutting Finds",
  "description": "Universal rare items that can be found while woodcutting any tree type",
  "drops": [
    {
      "itemId": "amber",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "comment": "Fossilized tree sap found in ancient wood"
    },
    {
      "dropNothing": true,
      "weight": 95,
      "comment": "Most of the time, no rare find"
    }
  ]
} as const;
