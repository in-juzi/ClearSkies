/**
 * Juiciness (JC)
 * The moisture content and tenderness of the fish meat
 */

import { QualityDefinition as Quality } from '@shared/types';

export const JuicyQuality: Quality = {
  "qualityId": "juicy",
  "name": "Juiciness",
  "shorthand": "JC",
  "description": "The moisture content and tenderness of the fish meat",
  "applicableCategories": [
    "consumable"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Moist",
      "description": "Well-hydrated with good texture",
      "effects": {
        "cooking": {
          "qualityBonus": 1.08
        },
        "vendorPrice": {
          "modifier": 1.08
        }
      }
    },
    "2": {
      "name": "Succulent",
      "description": "Tender and flavorful with excellent moisture",
      "effects": {
        "cooking": {
          "qualityBonus": 1.16
        },
        "vendorPrice": {
          "modifier": 1.16
        }
      }
    },
    "3": {
      "name": "Luscious",
      "description": "Exceptionally tender and juicy",
      "effects": {
        "cooking": {
          "qualityBonus": 1.24
        },
        "vendorPrice": {
          "modifier": 1.24
        }
      }
    },
    "4": {
      "name": "Exquisite",
      "description": "Perfectly textured with ideal moisture",
      "effects": {
        "cooking": {
          "qualityBonus": 1.32
        },
        "vendorPrice": {
          "modifier": 1.32
        }
      }
    },
    "5": {
      "name": "Divine",
      "description": "Impossibly tender, melts in the mouth",
      "effects": {
        "cooking": {
          "qualityBonus": 1.4
        },
        "vendorPrice": {
          "modifier": 1.4
        }
      }
    }
  }
} as const;
