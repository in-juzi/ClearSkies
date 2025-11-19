/**
 * Fish for Salmon
 * Try your luck catching prized salmon in deeper waters
 */

import { ActivityUnion } from '@shared/types';

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
      "fishing": 20
    },
    "dropTables": [
      "fishing-salmon"
    ]
  }
} as const;
