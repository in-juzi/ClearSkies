/**
 * Quarry Stone Blocks
 * Extract solid stone blocks from rock faces for construction
 */

import { ActivityUnion } from '@shared/types';

export const ActivityQuarryStone: ActivityUnion = {
  "activityId": "activity-quarry-stone",
  "name": "Quarry Stone Blocks",
  "description": "Extract solid stone blocks from rock faces for construction",
  "type": "resource-gathering",
  "duration": 10,
  "requirements": {
    "skills": {
      "mining": 10
    },
    "equipped": [
      {
        "subtype": "mining-pickaxe"
      }
    ]
  },
  "rewards": {
    "experience": {
      "mining": 30
    },
    "dropTables": [
      "mining-stone"
    ]
  }
} as const;
