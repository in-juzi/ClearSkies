/**
 * Mine Tin Ore
 * Extract tin ore from shallow veins in the mountain rock
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityMineTin: ActivityUnion = {
  "activityId": "activity-mine-tin",
  "name": "Mine Tin Ore",
  "description": "Extract tin ore from shallow veins in the mountain rock",
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
      "mining-tin",
      "rare-low-mining"
    ]
  }
} as const;
