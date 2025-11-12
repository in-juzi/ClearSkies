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
      "herbalism": 1
    }
  },
  "rewards": {
    "experience": {
      "herbalism": 20
    },
    "dropTables": [
      "herbalism-chamomile"
    ]
  }
} as const;
