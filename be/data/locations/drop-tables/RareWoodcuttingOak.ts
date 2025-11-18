/**
 * Rare Oak Woodcutting Finds
 * Rare items that can be found while chopping oak trees
 */

import { DropTable } from '@shared/types';

export const RareWoodcuttingOak: DropTable = {
  "dropTableId": "rare-woodcutting-oak",
  "name": "Rare Oak Woodcutting Finds",
  "description": "Rare items that can be found while chopping oak trees",
  "drops": [
    {
      "itemId": "potato_seeds",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "itemId": "onion_seeds",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "itemId": "cabbage_seeds",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "dropNothing": true,
      "weight": 85,
      "comment": "Most of the time, no rare drop"
    }
  ]
} as const;
