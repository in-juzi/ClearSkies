/**
 * Stone Quarrying Drops
 * Common drops from quarrying stone blocks
 */

import { DropTable } from '../../../types/locations';

export const MiningStone: DropTable = {
  "dropTableId": "mining-stone",
  "name": "Stone Quarrying Drops",
  "description": "Common drops from quarrying stone blocks",
  "drops": [
    {
      "itemId": "stone",
      "weight": 80,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "stone",
      "weight": 20,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": {
        "purity": 0.2
      }
    }
  ]
} as const;
