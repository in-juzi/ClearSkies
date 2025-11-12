/**
 * Moonpetal Harvest
 * Luminescent moonpetals collected under starlight
 */

import { DropTable } from '../../../types/locations';

export const HerbalismMoonpetal: DropTable = {
  "dropTableId": "herbalism-moonpetal",
  "name": "Moonpetal Harvest",
  "description": "Luminescent moonpetals collected under starlight",
  "drops": [
    {
      "itemId": "moonpetal",
      "weight": 50,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": {
        "freshness": 0.25,
        "purity": 0.25
      },
      "comment": "Rare moonpetal find"
    },
    {
      "itemId": "moonpetal",
      "weight": 35,
      "quantity": {
        "min": 2,
        "max": 4
      },
      "qualityBonus": {
        "freshness": 0.35,
        "purity": 0.35
      },
      "comment": "Moonlit clearing bloom"
    },
    {
      "itemId": "moonpetal",
      "weight": 10,
      "quantity": {
        "min": 4,
        "max": 6
      },
      "qualityBonus": {
        "freshness": 0.45,
        "purity": 0.45
      },
      "comment": "Full moon gathering"
    },
    {
      "dropNothing": true,
      "weight": 5,
      "comment": "Moonpetals faded at dawn"
    }
  ]
} as const;
