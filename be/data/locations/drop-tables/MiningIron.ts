/**
 * Iron Ore Mining Drops
 * Common drops from iron ore mining
 */

import { DropTable } from '@shared/types';

export const MiningIron: DropTable = {
  "dropTableId": "mining-iron",
  "name": "Iron Ore Mining Drops",
  "description": "Common drops from iron ore mining",
  "drops": [
    {
      "itemId": "iron_ore",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": {
        "purity": 0.1
      },
      "comment": "Common iron ore"
    },
    {
      "itemId": "iron_ore",
      "weight": 20,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": {
        "purity": 0.2
      },
      "comment": "Good iron vein"
    },
    {
      "itemId": "iron_ore",
      "weight": 5,
      "quantity": {
        "min": 3,
        "max": 4
      },
      "qualityBonus": {
        "purity": 0.3
      },
      "comment": "Rich iron deposit"
    },
    {
      "dropNothing": true,
      "weight": 5,
      "comment": "Vein played out"
    }
  ]
} as const;
