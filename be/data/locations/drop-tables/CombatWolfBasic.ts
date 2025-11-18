/**
 * Forest Wolf Basic Drops
 * Standard loot from forest wolves
 */

import { DropTable } from '@shared/types';

export const CombatWolfBasic: DropTable = {
  "dropTableId": "combat-wolf-basic",
  "name": "Forest Wolf Basic Drops",
  "description": "Standard loot from forest wolves",
  "drops": [
    {
      "itemId": "wolf_pelt",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "wolf_fang",
      "weight": 50,
      "quantity": {
        "min": 1,
        "max": 1
      }
    },
    {
      "itemId": "raw_meat",
      "weight": 40,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "hemp_coif",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "qualityBonus": 1
    }
  ]
} as const;
