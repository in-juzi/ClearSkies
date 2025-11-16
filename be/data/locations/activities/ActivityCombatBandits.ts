/**
 * Fight Bandits
 * Engage forest bandits in combat
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityCombatBandits: ActivityUnion = {
  "activityId": "activity-combat-bandits",
  "name": "Fight Bandits",
  "description": "Engage forest bandits in combat",
  "type": "combat",
  "duration": 60,
  "requirements": {
    "skills": {
      "oneHanded": 1
    },
    "attributes": {
      "strength": 3
    }
  },
  "rewards": {
    "items": [
      {
        "itemId": "bronze_sword",
        "quantity": {
          "min": 1,
          "max": 1
        },
        "chance": 0.1
      }
    ],
    "gold": {
      "min": 10,
      "max": 30
    }
  },
  "stub": true,
  "stubMessage": "Combat system not yet implemented. You fought bravely against the bandits!"
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
