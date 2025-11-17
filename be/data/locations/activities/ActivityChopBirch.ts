/**
 * Chop Birch Trees
 * Fell distinctive birch trees for their prized light-colored wood
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityChopBirch: ActivityUnion = {
  "activityId": "activity-chop-birch",
  "name": "Chop Birch Trees",
  "description": "Fell distinctive birch trees for their prized light-colored wood and flexible bark",
  "type": "resource-gathering",
  "duration": 10,
  "requirements": {
    "skills": {
      "woodcutting": 5
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
      "woodcutting-birch",
      "rare-woodcutting-birch",
      "rare-woodcutting-finds"
    ]
  }
} as const;
