/**
 * Harvest Mandrake Root
 * Carefully unearth mystical mandrake roots, mindful of their legendary screams
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityGatherMandrake: ActivityUnion = {
  "activityId": "activity-gather-mandrake",
  "name": "Harvest Mandrake Root",
  "description": "Carefully unearth mystical mandrake roots, mindful of their legendary screams",
  "type": "resource-gathering",
  "duration": 50,
  "requirements": {
    "skills": {
      "herbalism": 8
    }
  },
  "rewards": {
    "experience": {
      "herbalism": 45
    },
    "dropTables": [
      "herbalism-mandrake"
    ]
  }
} as const;
