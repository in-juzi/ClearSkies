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
  "duration": 8,
  "requirements": {
    "skills": {
      "woodcutting": 3
    },
    "equipped": [
      {
        "subtype": "woodcutting-axe"
      }
    ]
  },
  "rewards": {
    "experience": {
      "woodcutting": 20
    },
    "dropTables": [
      "woodcutting-oak",
      "rare-woodcutting-oak",
      "rare-woodcutting-finds"
    ]
  }
} as const;
