/**
 * Salmon Fishing Drops
 * Common drops from salmon fishing
 */

import { DropTable } from '@shared/types';

export const FishingSalmon: DropTable = {
  "dropTableId": "fishing-salmon",
  "name": "Salmon Fishing Drops",
  "description": "Common drops from salmon fishing",
  "drops": [
    {
      "itemId": "salmon",
      "weight": 70,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": {
        "freshness": 0.1
      },
      "comment": "Common salmon catch"
    },
    {
      "itemId": "salmon",
      "weight": 20,
      "quantity": {
        "min": 2,
        "max": 3
      },
      "qualityBonus": {
        "freshness": 0.2
      },
      "comment": "Good salmon catch"
    },
    {
      "itemId": "salmon",
      "weight": 5,
      "quantity": {
        "min": 3,
        "max": 4
      },
      "qualityBonus": {
        "freshness": 0.3
      },
      "comment": "Exceptional salmon bounty"
    },
    {
      "itemId": "trout",
      "weight": 3,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Trout sometimes bite salmon bait"
    },
    {
      "dropNothing": true,
      "weight": 2,
      "comment": "The one that got away"
    }
  ]
} as const;
