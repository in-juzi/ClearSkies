/**
 * Goblin Scout Basic Drops
 * Standard loot from goblin scouts
 */

import { DropTable } from '@shared/types';

export const CombatGoblinScout: DropTable = {
  "dropTableId": "combat-goblin-scout",
  "name": "Goblin Scout Basic Drops",
  "description": "Standard loot from goblin scouts",
  "drops": [
    {
      "itemId": "goblin_tooth",
      "weight": 65,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "leather_scraps",
      "weight": 60,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "raw_meat",
      "weight": 50,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "bamboo_fishing_rod",
      "weight": 15,
      "quantity": {
        "min": 1,
        "max": 1
      }
    },
    {
      "itemId": "copper_ore",
      "weight": 35,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "scrap_metal",
      "weight": 45,
      "quantity": {
        "min": 1,
        "max": 2
      }
    }
  ]
} as const;
