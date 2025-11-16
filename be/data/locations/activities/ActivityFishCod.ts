/**
 * Fish for Cod
 * Cast your line into the harbor waters for common cod
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityFishCod: ActivityUnion = {
  "activityId": "activity-fish-cod",
  "name": "Fish for Cod",
  "description": "Cast your line into the harbor waters for common cod",
  "type": "resource-gathering",
  "duration": 10,
  "requirements": {
    "skills": {
      "fishing": 1
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
    "items": [
      {
        "itemId": "trout",
        "quantity": {
          "min": 1,
          "max": 3
        },
        "chance": 0.8
      }
    ]
  }
} as const;
