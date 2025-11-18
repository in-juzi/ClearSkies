/**
 * Harvest Mandrake Root
 * Carefully unearth mystical mandrake roots, mindful of their legendary screams
 */

import { ActivityUnion } from '@shared/types';

export const ActivityGatherMandrake: ActivityUnion = {
  "activityId": "activity-gather-mandrake",
  "name": "Harvest Mandrake Root",
  "description": "Carefully unearth mystical mandrake roots, mindful of their legendary screams",
  "type": "resource-gathering",
  "duration": 50,
  "requirements": {
    "skills": {
      "gathering": 8
    }
  },
  "rewards": {
    "experience": {
      "gathering": 20
    },
    "dropTables": [
      "gathering-mandrake"
    ]
  }
} as const;
