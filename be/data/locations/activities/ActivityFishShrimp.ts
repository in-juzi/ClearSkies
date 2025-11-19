/**
 * Fish for Shrimp
 * Wade in the shallow waters to catch shrimp
 */

import { ActivityUnion } from '@shared/types';

export const ActivityFishShrimp: ActivityUnion = {
  "activityId": "activity-fish-shrimp",
  "name": "Fish for Shrimp",
  "description": "Wade in the shallow waters to catch shrimp",
  "type": "resource-gathering",
  "duration": 7,
  "requirements": {
    "skills": {},
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
      "fishing-shrimp"
    ]
  }
} as const;
