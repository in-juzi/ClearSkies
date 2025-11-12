/**
 * Gather Sage
 * Harvest silvery sage leaves from wild bushes, taking care not to damage the plants
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityGatherSage: ActivityUnion = {
  "activityId": "activity-gather-sage",
  "name": "Gather Sage",
  "description": "Harvest silvery sage leaves from wild bushes, taking care not to damage the plants",
  "type": "resource-gathering",
  "duration": 12,
  "requirements": {
    "skills": {
      "herbalism": 3
    }
  },
  "rewards": {
    "experience": {
      "herbalism": 25
    },
    "dropTables": [
      "herbalism-sage"
    ]
  }
} as const;
