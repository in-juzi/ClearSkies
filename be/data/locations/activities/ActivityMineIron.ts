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
      "mining": 20
    },
    "dropTables": [
      "mining-iron",
      "rare-low-mining"
    ]
  }
} as const;
