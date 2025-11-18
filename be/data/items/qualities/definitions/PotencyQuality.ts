/**
 * Potency (PT)
 * The alchemical effectiveness of herbs and flowers, affecting potion strength
 */

import { QualityDefinition as Quality } from '@shared/types';

export const PotencyQuality: Quality = {
  "qualityId": "potency",
  "name": "Potency",
  "shorthand": "PT",
  "description": "The alchemical effectiveness of herbs and flowers, affecting potion strength",
  "applicableCategories": [
    "resource"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Potent",
      "description": "Enhanced alchemical properties provide modest boost",
      "effects": {
        "vendorPrice": {
          "modifier": 1.08
        },
        "alchemy": {
          "potencyMultiplier": 1.10
        }
      }
    },
    "2": {
      "name": "Concentrated",
      "description": "Concentrated essence increases potion effectiveness",
      "effects": {
        "vendorPrice": {
          "modifier": 1.16
        },
        "alchemy": {
          "potencyMultiplier": 1.20
        }
      }
    },
    "3": {
      "name": "Enriched",
      "description": "Enriched with power, significantly enhances potions",
      "effects": {
        "vendorPrice": {
          "modifier": 1.24
        },
        "alchemy": {
          "potencyMultiplier": 1.30
        }
      }
    },
    "4": {
      "name": "Sublime",
      "description": "Sublime quality produces exceptional alchemical results",
      "effects": {
        "vendorPrice": {
          "modifier": 1.32
        },
        "alchemy": {
          "potencyMultiplier": 1.40
        }
      }
    },
    "5": {
      "name": "Transcendent",
      "description": "Transcendent alchemical power creates legendary potions",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "alchemy": {
          "potencyMultiplier": 1.50
        }
      }
    }
  }
} as const;
