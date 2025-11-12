/**
 * Nettle Harvest
 * Carefully harvested stinging nettles
 */

import { DropTable } from '../../../types/locations';

export const GatheringNettle: DropTable = {
  "dropTableId": "gathering-nettle",
  "name": "Nettle Harvest",
  "description": "Carefully harvested stinging nettles",
  "drops": [
    {
      "itemId": "nettle",
      "weight": 60,
      "quantity": {
        "min": 2,
        "max": 4
      },
      "qualityBonus": {
        "freshness": 0.15,
        "purity": 0.1
      },
      "comment": "Nettle patch gathering"
    },
    {
      "itemId": "nettle",
      "weight": 30,
      "quantity": {
        "min": 4,
        "max": 7
      },
      "qualityBonus": {
        "freshness": 0.25,
        "purity": 0.2
      },
      "comment": "Dense nettle thicket"
    },
    {
      "itemId": "nettle",
      "weight": 5,
      "quantity": {
        "min": 7,
        "max": 10
      },
      "qualityBonus": {
        "freshness": 0.35,
        "purity": 0.3
      },
      "comment": "Wild nettle sanctuary"
    },
    {
      "dropNothing": true,
      "weight": 5,
      "comment": "Nettles too young to harvest"
    }
  ]
} as const;
