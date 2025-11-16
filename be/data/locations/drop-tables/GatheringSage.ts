/**
 * Sage Harvest
 * Silvery sage leaves plucked from wild bushes
 */

import { DropTable } from '../../../types/locations';

export const GatheringSage: DropTable = {
  "dropTableId": "gathering-sage",
  "name": "Sage Harvest",
  "description": "Silvery sage leaves plucked from wild bushes",
  "drops": [
    {
      "itemId": "sage",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 3
      },
      "qualityBonus": {
        "freshness": 0.1,
        "purity": 0.1
      },
      "comment": "Standard sage gathering"
    },
    {
      "itemId": "sage",
      "weight": 20,
      "quantity": {
        "min": 3,
        "max": 5
      },
      "qualityBonus": {
        "freshness": 0.2,
        "purity": 0.2
      },
      "comment": "Healthy sage bush"
    },
    {
      "itemId": "sage",
      "weight": 7,
      "quantity": {
        "min": 5,
        "max": 7
      },
      "qualityBonus": {
        "freshness": 0.3,
        "purity": 0.3
      },
      "comment": "Ancient sage grove"
    },
    {
      "dropNothing": true,
      "weight": 3,
      "comment": "Sage withered from drought"
    }
  ]
} as const;
