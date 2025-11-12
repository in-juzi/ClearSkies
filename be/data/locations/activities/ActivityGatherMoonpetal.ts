/**
 * Gather Moonpetal
 * Search moonlit glades for the rare luminescent moonpetals that shimmer in darkness
 */

import { ActivityUnion } from '../../../types/locations';

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
      "gathering": 60
    },
    "dropTables": [
      "gathering-moonpetal"
    ]
  }
} as const;
