/**
 * Gather Dragon's Breath
 * Venture into volcanic regions to collect the rare crimson dragon's breath flowers
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityGatherDragonsBreath: ActivityUnion = {
  "activityId": "activity-gather-dragons-breath",
  "name": "Gather Dragon's Breath",
  "description": "Venture into volcanic regions to collect the rare crimson dragon's breath flowers",
  "type": "resource-gathering",
  "duration": 65,
  "requirements": {
    "skills": {
      "herbalism": 15
    }
  },
  "rewards": {
    "experience": {
      "herbalism": 75
    },
    "dropTables": [
      "herbalism-dragons-breath"
    ]
  }
} as const;
