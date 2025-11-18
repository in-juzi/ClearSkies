/**
 * Tin Ore Mining
 * Common tin ore deposits found in mountain mines
 */

import { DropTable } from '@shared/types';

export const MiningTin: DropTable = {
  "dropTableId": "mining-tin",
  "name": "Tin Ore Mining",
  "description": "Common tin ore deposits found in mountain mines",
  "drops": [
    {
      "type": "item",
      "itemId": "tin_ore",
      "weight": 80,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": 0,
      "comment": "Standard tin ore drop"
    },
    {
      "type": "item",
      "itemId": "tin_ore",
      "weight": 15,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": 1,
      "comment": "Higher quality tin ore"
    },
    {
      "type": "dropTable",
      "dropTableId": "rare-low-mining",
      "weight": 5,
      "comment": "Rare gemstone drops (5% chance) - rolls on shared rare table"
    }
  ]
} as const;
