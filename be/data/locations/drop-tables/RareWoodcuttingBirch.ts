/**
 * Rare Birch Woodcutting Finds
 * Rare items that can be found while chopping birch trees
 */

import { DropTable } from '../../../types/locations';

export const RareWoodcuttingBirch: DropTable = {
  "dropTableId": "rare-woodcutting-birch",
  "name": "Rare Birch Woodcutting Finds",
  "description": "Rare items that can be found while chopping birch trees",
  "drops": [
    {
      "itemId": "birch_bark",
      "weight": 12,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Strips of distinctive white bark harvested from the tree"
    },
    {
      "itemId": "strawberry_seeds",
      "weight": 4,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "itemId": "tomato_seeds",
      "weight": 4,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "itemId": "pumpkin_seeds",
      "weight": 4,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "dropNothing": true,
      "weight": 76,
      "comment": "Most of the time, no rare drop"
    }
  ]
} as const;
