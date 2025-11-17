/**
 * Chop Pine Trees
 * Fell softwood pine trees for basic timber and construction materials
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityChopPine: ActivityUnion = {
  "activityId": "activity-chop-pine",
  "name": "Chop Pine Trees",
  "description": "Fell softwood pine trees for basic timber and construction materials",
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
      "woodcutting": 20
    },
    "dropTables": [
      "woodcutting-pine",
      "rare-woodcutting-pine",
      "rare-woodcutting-finds"
    ]
  }
} as const;
