/**
 * Wood Grain (WG)
 * The structural integrity and magical properties of wood
 */

import { QualityDefinition as Quality } from '../../../../types/items';

export const WoodGrainQuality: Quality = {
  "qualityId": "woodGrain",
  "name": "Wood Grain",
  "shorthand": "WG",
  "description": "The structural integrity and magical properties of wood",
  "applicableCategories": [
    "resource",
    "crafted"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Fine Grain",
      "description": "Smooth, uniform grain with excellent structure",
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
      "name": "Superior Grain",
      "description": "Exceptional grain pattern with superior properties",
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
      "name": "Pristine Grain",
      "description": "Near-flawless grain with remarkable properties",
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
      "name": "Perfect Grain",
      "description": "Flawless grain pattern with exceptional properties",
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
      "name": "Mythical Grain",
      "description": "Legendary grain pattern of unparalleled perfection",
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
