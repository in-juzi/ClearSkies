/**
 * Rare Woodcutting Finds
 * Rare items that can be found while woodcutting
 */

import { DropTable } from '../../../types/locations';

export const RareWoodcutting: DropTable = {
  "dropTableId": "rare-woodcutting",
  "name": "Rare Woodcutting Finds",
  "description": "Rare items that can be found while woodcutting",
  "drops": [
    {
      "itemId": "copper_ore",
      "weight": 8,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Exposed in tree roots"
    },
    {
      "dropNothing": true,
      "weight": 92,
      "comment": "Most of the time, no rare drop"
    }
  ]
} as const;
