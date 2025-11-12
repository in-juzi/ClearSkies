/**
 * Gather Nettle
 * Brave the stinging leaves to harvest medicinal nettles from the forest undergrowth
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityGatherNettle: ActivityUnion = {
  "activityId": "activity-gather-nettle",
  "name": "Gather Nettle",
  "description": "Brave the stinging leaves to harvest medicinal nettles from the forest undergrowth",
  "type": "resource-gathering",
  "duration": 40,
  "requirements": {
    "skills": {
      "gathering": 5
    }
  },
  "rewards": {
    "experience": {
      "gathering": 35
    },
    "dropTables": [
      "gathering-nettle"
    ]
  }
} as const;
