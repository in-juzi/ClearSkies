/**
 * Oak Woodcutting Drops
 * Common drops from chopping oak trees
 */

import { DropTable } from '@shared/types';

export const WoodcuttingOak: DropTable = {
  "dropTableId": "woodcutting-oak",
  "name": "Oak Woodcutting Drops",
  "description": "Common drops from chopping oak trees",
  "drops": [
    {
      "itemId": "oak_log",
      "weight": 80,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "oak_log",
      "weight": 20,
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
