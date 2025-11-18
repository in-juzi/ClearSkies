/**
 * Goblin Warrior Basic Drops
 * Standard loot from goblin warriors
 */

import { DropTable } from '@shared/types';

export const CombatGoblinBasic: DropTable = {
  "dropTableId": "combat-goblin-basic",
  "name": "Goblin Warrior Basic Drops",
  "description": "Standard loot from goblin warriors",
  "drops": [
    {
      "itemId": "scrap_metal",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "goblin_tooth",
      "weight": 55,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "copper_ore",
      "weight": 40,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "iron_sword",
      "weight": 12,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "qualityBonus": 1
    },
    {
      "itemId": "iron_helm",
      "weight": 10,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "qualityBonus": 1
    },
    {
      "itemId": "wooden_shield",
      "weight": 15,
      "quantity": {
        "min": 1,
        "max": 1
      }
    }
  ]
} as const;
