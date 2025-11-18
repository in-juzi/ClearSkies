/**
 * Size (SZ)
 * The physical size of the fish - larger specimens yield more meat
 */

import { QualityDefinition as Quality } from '@shared/types';

export const SizeQuality: Quality = {
  "qualityId": "size",
  "name": "Size",
  "shorthand": "SZ",
  "description": "The physical size of the fish - larger specimens yield more meat",
  "applicableCategories": [
    "consumable"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Large",
      "description": "A notably large specimen",
      "effects": {
        "cooking": {
          "yieldMultiplier": 1.1
        },
        "vendorPrice": {
          "modifier": 1.1
        }
      }
    },
    "2": {
      "name": "Jumbo",
      "description": "An impressively large catch",
      "effects": {
        "cooking": {
          "yieldMultiplier": 1.2
        },
        "vendorPrice": {
          "modifier": 1.2
        }
      }
    },
    "3": {
      "name": "Trophy",
      "description": "A trophy-sized catch worth bragging about",
      "effects": {
        "cooking": {
          "yieldMultiplier": 1.3
        },
        "vendorPrice": {
          "modifier": 1.3
        }
      }
    },
    "4": {
      "name": "Colossal",
      "description": "A massive specimen rarely seen",
      "effects": {
        "cooking": {
          "yieldMultiplier": 1.4
        },
        "vendorPrice": {
          "modifier": 1.4
        }
      }
    },
    "5": {
      "name": "Leviathan",
      "description": "A legendary giant, the stuff of fishermen's tales",
      "effects": {
        "cooking": {
          "yieldMultiplier": 1.5
        },
        "vendorPrice": {
          "modifier": 1.5
        }
      }
    }
  }
} as const;
