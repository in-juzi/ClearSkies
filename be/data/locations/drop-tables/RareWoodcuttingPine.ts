/**
 * Rare Pine Woodcutting Finds
 * Rare items that can be found while chopping pine trees
 */

import { DropTable } from '@shared/types';

export const RareWoodcuttingPine: DropTable = {
  "dropTableId": "rare-woodcutting-pine",
  "name": "Rare Pine Woodcutting Finds",
  "description": "Rare items that can be found while chopping pine trees",
  "drops": [
    {
      "itemId": "pine_resin",
      "weight": 10,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Sticky sap harvested from the tree"
    },
    {
      "itemId": "lettuce_seeds",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "itemId": "carrot_seeds",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "itemId": "turnip_seeds",
      "weight": 5,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "comment": "Seeds hidden by foraging animals"
    },
    {
      "dropNothing": true,
      "weight": 75,
      "comment": "Most of the time, no rare drop"
    }
  ]
} as const;
