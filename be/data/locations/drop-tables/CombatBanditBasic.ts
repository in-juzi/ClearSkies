/**
 * Bandit Thug Basic Drops
 * Standard loot from bandit thugs
 */

import { DropTable } from '../../../types/locations';

export const CombatBanditBasic: DropTable = {
  "dropTableId": "combat-bandit-basic",
  "name": "Bandit Thug Basic Drops",
  "description": "Standard loot from bandit thugs",
  "drops": [
    {
      "itemId": "tattered_cloth",
      "weight": 60,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "leather_scraps",
      "weight": 50,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "bronze_woodcutting_axe",
      "weight": 15,
      "quantity": {
        "min": 1,
        "max": 1
      }
    },
    {
      "itemId": "bronze_sword",
      "weight": 10,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "qualityBonus": 1
    },
    {
      "itemId": "leather_tunic",
      "weight": 8,
      "quantity": {
        "min": 1,
        "max": 1
      }
    }
  ]
} as const;
