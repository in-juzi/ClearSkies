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
      "gathering": 15
    }
  },
  "rewards": {
    "experience": {
      "gathering": 75
    },
    "dropTables": [
      "gathering-dragons-breath"
    ]
  }
} as const;
