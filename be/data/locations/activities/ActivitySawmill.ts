/**
 * Process Logs at Sawmill
 * Convert raw logs into usable planks for construction
 */

import { ActivityUnion } from '@shared/types';
import { SUBCATEGORY } from '@shared/constants/item-constants';

export const ActivitySawmill: ActivityUnion = {
  "activityId": "activity-sawmill",
  "name": "Process Logs at Sawmill",
  "description": "Convert raw logs into usable planks for construction",
  "type": "crafting",
  "duration": 6,
  "requirements": {
    "skills": {
      "construction": 1
    },
    "inventory": [
      {
        "subcategory": SUBCATEGORY.LOG,
        "quantity": 1
      }
    ]
  },
  "rewards": {
    "experience": {
      "construction": 15
    },
    "dropTables": [
      "sawmill-planks"
    ]
  },
  "consumes": [
    {
      "subcategory": SUBCATEGORY.LOG,
      "quantity": 1
    }
  ]
};
