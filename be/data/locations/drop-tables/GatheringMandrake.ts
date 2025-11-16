/**
 * Mandrake Root Harvest
 * Mystical mandrake roots unearthed with care
 */

import { DropTable } from '../../../types/locations';

export const GatheringMandrake: DropTable = {
  "dropTableId": "gathering-mandrake",
  "name": "Mandrake Root Harvest",
  "description": "Mystical mandrake roots unearthed with care",
  "drops": [
    {
      "itemId": "mandrake_root",
      "weight": 55,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": {
        "freshness": 0.2,
        "purity": 0.15
      },
      "comment": "Standard mandrake extraction"
    },
    {
      "itemId": "mandrake_root",
      "weight": 30,
      "quantity": {
        "min": 2,
        "max": 4
      },
      "qualityBonus": {
        "freshness": 0.3,
        "purity": 0.25
      },
      "comment": "Mature mandrake cluster"
    },
    {
      "itemId": "mandrake_root",
      "weight": 10,
      "quantity": {
        "min": 4,
        "max": 6
      },
      "qualityBonus": {
        "freshness": 0.4,
        "purity": 0.35
      },
      "comment": "Ancient mandrake grove"
    },
    {
      "dropNothing": true,
      "weight": 5,
      "comment": "Mandrake screamed and escaped"
    }
  ]
} as const;
