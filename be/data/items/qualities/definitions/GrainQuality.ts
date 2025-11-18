/**
 * Grain (GR)
 * The structural integrity and tightness of wood grain, affecting crafted tool performance
 */

import { QualityDefinition as Quality } from '@shared/types';

export const GrainQuality: Quality = {
  "qualityId": "grain",
  "name": "Grain",
  "shorthand": "GR",
  "description": "The structural integrity and tightness of wood grain, affecting crafted tool performance",
  "applicableCategories": [
    "resource"
  ],
  "valueType": "level",
  "maxLevel": 5,
  "levels": {
    "1": {
      "name": "Straight Grain",
      "description": "Uniform grain pattern provides slight performance boost",
      "effects": {
        "vendorPrice": {
          "modifier": 1.08
        },
        "activityTime": {
          "reductionPercent": 0.05
        }
      }
    },
    "2": {
      "name": "Fine Grain",
      "description": "Tight grain structure enhances tool efficiency",
      "effects": {
        "vendorPrice": {
          "modifier": 1.16
        },
        "activityTime": {
          "reductionPercent": 0.10
        }
      }
    },
    "3": {
      "name": "Tight Grain",
      "description": "Dense grain pattern significantly improves performance",
      "effects": {
        "vendorPrice": {
          "modifier": 1.24
        },
        "activityTime": {
          "reductionPercent": 0.15
        }
      }
    },
    "4": {
      "name": "Flawless Grain",
      "description": "Nearly perfect grain structure for superior tools",
      "effects": {
        "vendorPrice": {
          "modifier": 1.32
        },
        "activityTime": {
          "reductionPercent": 0.20
        }
      }
    },
    "5": {
      "name": "Perfect Grain",
      "description": "Legendary grain pattern producing exceptional tools",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "activityTime": {
          "reductionPercent": 0.25
        }
      }
    }
  }
} as const;
