/**
 * Sand Gathering Drops
 * Common drops from collecting sand
 */

import { DropTable } from '../../../types/locations';

export const GatheringSand: DropTable = {
  "dropTableId": "gathering-sand",
  "name": "Sand Gathering Drops",
  "description": "Common drops from collecting sand at beaches and riverbanks",
  "drops": [
    {
      "itemId": "sand",
      "weight": 100,
      "quantity": {
        "min": 2,
        "max": 4
      }
    }
  ]
} as const;
