/**
 * Pine Woodcutting Drops
 * Common drops from chopping pine trees
 */

import { DropTable } from '@shared/types';

export const WoodcuttingPine: DropTable = {
  "dropTableId": "woodcutting-pine",
  "name": "Pine Woodcutting Drops",
  "description": "Common drops from chopping pine trees",
  "drops": [
    {
      "itemId": "pine_log",
      "weight": 80,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "pine_log",
      "weight": 20,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": {
        "woodGrain": 0.2
      }
    },
    {
      "type": "dropTable",
      "dropTableId": "rare-woodcutting-pine",
      "weight": 15,
      "comment": "Pine-specific rare finds (15% chance - resin, seeds)"
    },
    {
      "type": "dropTable",
      "dropTableId": "rare-woodcutting-finds",
      "weight": 5,
      "comment": "Universal woodcutting finds (5% chance - amber)"
    }
  ]
} as const;
