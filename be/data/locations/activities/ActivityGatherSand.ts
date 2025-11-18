/**
 * Gather Sand
 * Collect fine sand from beaches and riverbanks for glassmaking
 */

import { ActivityUnion } from '@shared/types';

export const ActivityGatherSand: ActivityUnion = {
  "activityId": "activity-gather-sand",
  "name": "Gather Sand",
  "description": "Collect fine sand from beaches and riverbanks for glassmaking",
  "type": "resource-gathering",
  "duration": 5,
  "requirements": {
    "skills": {
      "gathering": 5
    }
  },
  "rewards": {
    "experience": {
      "gathering": 15
    },
    "dropTables": [
      "gathering-sand"
    ]
  }
} as const;
