/**
 * Mine Copper Ore
 * Extract copper ore from shallow veins in the mountain rock
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityMineCopper: ActivityUnion = {
  "activityId": "activity-mine-copper",
  "name": "Mine Copper Ore",
  "description": "Extract copper ore from shallow veins in the mountain rock",
  "type": "resource-gathering",
  "duration": 6,
  "requirements": {
    "skills": {
      "mining": 1
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
      "mining-copper"
    ]
  }
} as const;
