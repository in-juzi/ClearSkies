/**
 * Age (AG)
 * How aged the wood is - older wood has enhanced properties
 */

import { QualityDefinition as Quality } from '../../../../types/items';

export const AgeQuality: Quality = {
  "qualityId": "age",
  "name": "Age",
  "shorthand": "AG",
  "description": "How aged the wood is - older wood has enhanced properties",
  "applicableCategories": [
    "resource"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Aged",
      "description": "Well-aged with developing character",
      "effects": {
        "alchemy": {
          "potencyMultiplier": 1.1
        },
        "vendorPrice": {
          "modifier": 1.1
        }
      }
    },
    "2": {
      "name": "Mature",
      "description": "Years of aging have enhanced properties",
      "effects": {
        "alchemy": {
          "potencyMultiplier": 1.2
        },
        "vendorPrice": {
          "modifier": 1.2
        }
      }
    },
    "3": {
      "name": "Veteran",
      "description": "Decades old with excellent properties",
      "effects": {
        "alchemy": {
          "potencyMultiplier": 1.3
        },
        "vendorPrice": {
          "modifier": 1.3
        }
      }
    },
    "4": {
      "name": "Ancient",
      "description": "Centuries old with rare properties",
      "effects": {
        "alchemy": {
          "potencyMultiplier": 1.4
        },
        "vendorPrice": {
          "modifier": 1.4
        }
      }
    },
    "5": {
      "name": "Primordial",
      "description": "Millennia old with legendary properties",
      "effects": {
        "alchemy": {
          "potencyMultiplier": 1.5
        },
        "vendorPrice": {
          "modifier": 1.5
        }
      }
    }
  }
} as const;
