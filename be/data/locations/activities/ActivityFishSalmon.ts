/**
 * Fish for Salmon
 * Try your luck catching prized salmon in deeper waters
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityFishSalmon: ActivityUnion = {
  "activityId": "activity-fish-salmon",
  "name": "Fish for Salmon",
  "description": "Try your luck catching prized salmon in deeper waters",
  "type": "resource-gathering",
  "duration": 15,
  "requirements": {
    "skills": {
      "fishing": 5
    },
    "equipped": [
      {
        "subtype": "fishing-rod"
      }
    ]
  },
  "rewards": {
    "experience": {
      "fishing": 40
    },
    "dropTables": [
      "fishing-salmon",
      "rare-fishing"
    ]
  }
} as const;
