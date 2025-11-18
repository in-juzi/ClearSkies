/**
 * Gather Moonpetal
 * Search moonlit glades for the rare luminescent moonpetals that shimmer in darkness
 */

import { ActivityUnion } from '@shared/types';

export const ActivityGatherMoonpetal: ActivityUnion = {
  "activityId": "activity-gather-moonpetal",
  "name": "Gather Moonpetal",
  "description": "Search moonlit glades for the rare luminescent moonpetals that shimmer in darkness",
  "type": "resource-gathering",
  "duration": 60,
  "requirements": {
    "skills": {
      "gathering": 12
    }
  },
  "rewards": {
    "experience": {
      "gathering": 50
    },
    "dropTables": [
      "gathering-moonpetal"
    ]
  }
} as const;
