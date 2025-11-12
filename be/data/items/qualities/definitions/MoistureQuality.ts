/**
 * Dryness (DR)
 * How well-dried the wood is
 */

import { QualityDefinition as Quality } from '../../../../types/items';

export const MoistureQuality: Quality = {
  "qualityId": "moisture",
  "name": "Dryness",
  "shorthand": "DR",
  "description": "How well-dried the wood is",
  "applicableCategories": [
    "resource"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Well-Seasoned",
      "description": "Properly dried with low moisture",
      "effects": {
        "vendorPrice": {
          "modifier": 1.08
        },
        "burning": {
          "efficiencyMultiplier": 1.08
        }
      }
    },
    "2": {
      "name": "Air-Dried",
      "description": "Naturally dried over time",
      "effects": {
        "vendorPrice": {
          "modifier": 1.16
        },
        "burning": {
          "efficiencyMultiplier": 1.16
        }
      }
    },
    "3": {
      "name": "Kiln-Dried",
      "description": "Expertly dried for enhanced efficiency",
      "effects": {
        "vendorPrice": {
          "modifier": 1.24
        },
        "burning": {
          "efficiencyMultiplier": 1.24
        }
      }
    },
    "4": {
      "name": "Perfectly Dried",
      "description": "Ideally dried for maximum efficiency",
      "effects": {
        "vendorPrice": {
          "modifier": 1.32
        },
        "burning": {
          "efficiencyMultiplier": 1.32
        }
      }
    },
    "5": {
      "name": "Ancient Dry",
      "description": "Centuries-dried wood with zero moisture",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "burning": {
          "efficiencyMultiplier": 1.4
        }
      }
    }
  }
} as const;
