/**
 * Chop Oak Trees
 * Fell sturdy oak trees for quality timber
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityChopOak: ActivityUnion = {
  "activityId": "activity-chop-oak",
  "name": "Chop Oak Trees",
  "description": "Fell sturdy oak trees for quality timber",
  "type": "resource-gathering",
  "duration": 6,
  "requirements": {
    "skills": {
      "woodcutting": 1
    },
    "equipped": [
      {
        "subtype": "woodcutting-axe"
      }
    ]
  },
  "rewards": {
    "experience": {
      "woodcutting": 30
    },
    "dropTables": [
      "woodcutting-oak",
      "rare-woodcutting"
    ]
  }
} as const;
