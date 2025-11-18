/**
 * Purity (PR)
 * The purity of ore or metal
 */

import { QualityDefinition as Quality } from '@shared/types';

export const PurityQuality: Quality = {
  "qualityId": "purity",
  "name": "Purity",
  "shorthand": "PR",
  "description": "The purity of ore or metal",
  "applicableCategories": [
    "resource",
    "crafted"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "High Purity",
      "description": "Excellent purity, very clean",
      "effects": {
        "smithing": {
          "qualityBonus": 1.1
        },
        "vendorPrice": {
          "modifier": 1.1
        }
      }
    },
    "2": {
      "name": "Refined",
      "description": "Expertly refined with exceptional purity",
      "effects": {
        "smithing": {
          "qualityBonus": 1.2
        },
        "vendorPrice": {
          "modifier": 1.2
        }
      }
    },
    "3": {
      "name": "Superior",
      "description": "Near-perfect purity with minimal impurities",
      "effects": {
        "smithing": {
          "qualityBonus": 1.3
        },
        "vendorPrice": {
          "modifier": 1.3
        }
      }
    },
    "4": {
      "name": "Flawless",
      "description": "Perfect purity with no visible impurities",
      "effects": {
        "smithing": {
          "qualityBonus": 1.4
        },
        "vendorPrice": {
          "modifier": 1.4
        }
      }
    },
    "5": {
      "name": "Transcendent",
      "description": "Impossibly pure, defying natural limits",
      "effects": {
        "smithing": {
          "qualityBonus": 1.5
        },
        "vendorPrice": {
          "modifier": 1.5
        }
      }
    }
  }
} as const;
