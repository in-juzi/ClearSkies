/**
 * Cod Fishing Drops
 * Common drops from cod fishing
 */

import { DropTable } from '@shared/types';

export const FishingCod: DropTable = {
  "dropTableId": "fishing-cod",
  "name": "Cod Fishing Drops",
  "description": "Common drops from cod fishing",
  "drops": [
    {
      "itemId": "cod",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": {
        "freshness": 0.1
      },
      "comment": "Common cod catch"
    },
    {
      "itemId": "cod",
      "weight": 20,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": {
        "freshness": 0.2
      },
      "comment": "Good cod catch"
    },
    {
      "itemId": "cod",
      "weight": 5,
      "quantity": {
        "min": 3,
        "max": 4
      },
      "qualityBonus": {
        "freshness": 0.3
      },
      "comment": "Exceptional cod bounty"
    },
    {
      "itemId": "shrimp",
      "weight": 3,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Shrimp caught along with cod"
    },
    {
      "dropNothing": true,
      "weight": 2,
      "comment": "The one that got away"
    }
  ]
} as const;
