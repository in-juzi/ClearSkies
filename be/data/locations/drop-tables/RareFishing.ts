/**
 * Rare Fishing Finds
 * Rare treasures pulled from the water
 */

import { DropTable } from '../../../types/locations';

export const RareFishing: DropTable = {
  "dropTableId": "rare-fishing",
  "name": "Rare Fishing Finds",
  "description": "Rare treasures pulled from the water",
  "drops": [
    {
      "itemId": "bronze_sword",
      "weight": 3,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "comment": "Ancient weapon from the riverbed"
    },
    {
      "dropNothing": true,
      "weight": 97,
      "comment": "Just fish today"
    }
  ]
} as const;
