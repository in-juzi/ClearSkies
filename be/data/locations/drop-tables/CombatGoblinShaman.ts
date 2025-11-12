/**
 * Goblin Shaman Basic Drops
 * Standard loot from goblin shamans
 */

import { DropTable } from '../../../types/locations';

export const CombatGoblinShaman: DropTable = {
  "dropTableId": "combat-goblin-shaman",
  "name": "Goblin Shaman Basic Drops",
  "description": "Standard loot from goblin shamans",
  "drops": [
    {
      "itemId": "goblin_tooth",
      "weight": 60,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "sage",
      "weight": 55,
      "quantity": {
        "min": 2,
        "max": 4
      }
    },
    {
      "itemId": "nettle",
      "weight": 50,
      "quantity": {
        "min": 2,
        "max": 4
      }
    },
    {
      "itemId": "chamomile",
      "weight": 45,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "amethyst",
      "weight": 25,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": 1
    },
    {
      "itemId": "health_potion_minor",
      "weight": 30,
      "quantity": {
        "min": 1,
        "max": 2
      }
    },
    {
      "itemId": "mana_potion_minor",
      "weight": 35,
      "quantity": {
        "min": 1,
        "max": 3
      }
    },
    {
      "itemId": "scrap_metal",
      "weight": 40,
      "quantity": {
        "min": 1,
        "max": 2
      }
    }
  ]
} as const;
