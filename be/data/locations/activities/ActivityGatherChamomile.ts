/**
 * Gather Chamomile
 * Carefully pick delicate chamomile flowers from sunny meadows
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityGatherChamomile: ActivityUnion = {
  "activityId": "activity-gather-chamomile",
  "name": "Gather Chamomile",
  "description": "Carefully pick delicate chamomile flowers from sunny meadows",
  "type": "resource-gathering",
  "duration": 10,
  "requirements": {
    "skills": {
      "gathering": 1
    }
  },
  "rewards": {
    "experience": {
      "gathering": 20
    },
    "dropTables": [
      "gathering-chamomile"
    ]
  }
} as const;
