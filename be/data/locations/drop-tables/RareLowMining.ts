/**
 * Low-Tier Mining Rare Drops
 * Shared rare drop table for tier 1 mining activities (copper and tin). Contains low-tier gemstones.
 */

import { DropTable } from '../../../types/locations';

export const RareLowMining: DropTable = {
  "dropTableId": "rare-low-mining",
  "name": "Low-Tier Mining Rare Drops",
  "description": "Shared rare drop table for tier 1 mining activities (copper and tin). Contains low-tier gemstones.",
  "drops": [
    {
      "type": "item",
      "itemId": "quartz",
      "weight": 45,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": 0,
      "comment": "Most common T1 gemstone - clear quartz"
    },
    {
      "type": "item",
      "itemId": "citrine",
      "weight": 30,
      "quantity": {
        "min": 1,
        "max": 2
      },
      "qualityBonus": 0,
      "comment": "Golden-yellow quartz variety"
    },
    {
      "type": "item",
      "itemId": "amethyst",
      "weight": 25,
      "quantity": {
        "min": 1,
        "max": 1
      },
      "qualityBonus": 1,
      "comment": "Purple quartz - slightly rarer with quality bonus"
    }
  ]
} as const;
