/**
 * Sawmill Plank Production
 * Planks produced from processing logs at the sawmill
 */

import { DropTable } from '../../../types/locations';

export const SawmillPlanks: DropTable = {
  "dropTableId": "sawmill-planks",
  "name": "Sawmill Plank Production",
  "description": "Planks produced from processing logs at the sawmill",
  "drops": [
    {
      "itemId": "planks",
      "weight": 100,
      "quantity": {
        "min": 3,
        "max": 5
      }
    }
  ]
} as const;
