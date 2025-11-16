/**
 * Shrimp Catch
 * Fresh shrimp from the shallow waters
 */

import { DropTable } from '../../../types/locations';

export const FishingShrimp: DropTable = {
  "dropTableId": "fishing-shrimp",
  "name": "Shrimp Catch",
  "description": "Fresh shrimp from the shallow waters",
  "drops": [
    {
      "itemId": "shrimp",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": {
        "freshness": 0.1
      },
      "comment": "Common shrimp catch"
    },
    {
      "itemId": "shrimp",
      "weight": 20,
      "quantity": {
        "min": 2,
        "max": 4
      },
      "qualityBonus": {
        "freshness": 0.2
      },
      "comment": "Good haul of shrimp"
    },
    {
      "itemId": "shrimp",
      "weight": 5,
      "quantity": {
        "min": 4,
        "max": 6
      },
      "qualityBonus": {
        "freshness": 0.3
      },
      "comment": "Exceptional shrimp bounty"
    },
    {
      "dropNothing": true,
      "weight": 5,
      "comment": "The shrimp got away"
    }
  ]
} as const;
