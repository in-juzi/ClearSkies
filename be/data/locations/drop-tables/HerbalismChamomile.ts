/**
 * Chamomile Harvest
 * Delicate chamomile flowers gathered from meadows
 */

import { DropTable } from '../../../types/locations';

export const HerbalismChamomile: DropTable = {
  "dropTableId": "herbalism-chamomile",
  "name": "Chamomile Harvest",
  "description": "Delicate chamomile flowers gathered from meadows",
  "drops": [
    {
      "itemId": "chamomile",
      "weight": 65,
      "quantity": {
        "min": 3,
        "max": 6
      },
      "qualityBonus": {
        "freshness": 0.1,
        "purity": 0.1
      },
      "comment": "Common chamomile harvest"
    },
    {
      "itemId": "chamomile",
      "weight": 25,
      "quantity": {
        "min": 6,
        "max": 10
      },
      "qualityBonus": {
        "freshness": 0.2,
        "purity": 0.2
      },
      "comment": "Bountiful chamomile patch"
    },
    {
      "itemId": "chamomile",
      "weight": 5,
      "quantity": {
        "min": 10,
        "max": 15
      },
      "qualityBonus": {
        "freshness": 0.3,
        "purity": 0.3
      },
      "comment": "Pristine chamomile field"
    },
    {
      "dropNothing": true,
      "weight": 5,
      "comment": "Flowers already picked clean"
    }
  ]
} as const;
