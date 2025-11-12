/**
 * Mine Iron Ore
 * Extract iron ore from the mountain veins
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityMineIron: ActivityUnion = {
  "activityId": "activity-mine-iron",
  "name": "Mine Iron Ore",
  "description": "Extract iron ore from the mountain veins",
  "type": "resource-gathering",
  "duration": 10,
  "requirements": {
    "skills": {
      "mining": 5
    },
    "equipped": [
      {
        "subtype": "mining-pickaxe"
      }
    ]
  },
  "rewards": {
    "experience": {
      "mining": 45
    },
    "items": [
      {
        "itemId": "iron_ore",
        "quantity": {
          "min": 1,
          "max": 3
        },
        "chance": 0.75
      }
    ]
  }
} as const;
