/**
 * Sheen (SH)
 * The surface luster and reflectivity of metals and gemstones
 */

import { QualityDefinition as Quality } from '../../../../types/items';

export const SheenQuality: Quality = {
  "qualityId": "sheen",
  "name": "Sheen",
  "shorthand": "SH",
  "description": "The surface luster and reflectivity of metals and gemstones",
  "applicableCategories": [
    "resource"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Polished",
      "description": "Clean surface with good reflectivity",
      "effects": {
        "vendorPrice": {
          "modifier": 1.08
        }
      }
    },
    "2": {
      "name": "Lustrous",
      "description": "Attractive sheen with strong reflectivity",
      "effects": {
        "vendorPrice": {
          "modifier": 1.16
        }
      }
    },
    "3": {
      "name": "Brilliant",
      "description": "Highly reflective with excellent luster",
      "effects": {
        "vendorPrice": {
          "modifier": 1.24
        }
      }
    },
    "4": {
      "name": "Radiant",
      "description": "Perfectly polished, catches light beautifully",
      "effects": {
        "vendorPrice": {
          "modifier": 1.32
        }
      }
    },
    "5": {
      "name": "Celestial",
      "description": "Otherworldly sheen that seems to glow from within",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        }
      }
    }
  }
} as const;
