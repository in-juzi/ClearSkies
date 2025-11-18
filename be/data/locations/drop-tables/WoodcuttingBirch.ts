/**
 * Birch Woodcutting Drops
 * Common drops from chopping birch trees
 */

import { DropTable } from '@shared/types';

export const WoodcuttingBirch: DropTable = {
  "dropTableId": "woodcutting-birch",
  "name": "Birch Woodcutting Drops",
  "description": "Common drops from chopping birch trees",
  "drops": [
    {
      "itemId": "birch_log",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "birch_log",
      "weight": 30,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": {
        "woodGrain": 0.2
      }
    }
  ]
} as const;
