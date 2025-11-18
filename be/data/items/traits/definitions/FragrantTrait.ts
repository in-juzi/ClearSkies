/**
 * Fragrant (FRG)
 * Has a pleasant, aromatic scent
 */

import { TraitDefinition as Trait } from '@shared/types';

export const FragrantTrait: Trait = {
  "traitId": "fragrant",
  "name": "Fragrant",
  "shorthand": "FRG",
  "description": "Has a pleasant, aromatic scent",
  "rarity": "uncommon",
  "applicableCategories": [
    "resource",
    "consumable"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Lightly Fragrant",
      "description": "A subtle, pleasant aroma",
      "effects": {
        "vendorPrice": {
          "modifier": 1.1
        },
        "alchemy": {
          "bonusProperties": [
            "calming"
          ]
        }
      }
    },
    "2": {
      "name": "Fragrant",
      "description": "A noticeable, pleasing scent",
      "effects": {
        "vendorPrice": {
          "modifier": 1.25
        },
        "alchemy": {
          "bonusProperties": [
            "calming",
            "soothing"
          ]
        }
      }
    },
    "3": {
      "name": "Highly Fragrant",
      "description": "An intense, captivating aroma",
      "effects": {
        "vendorPrice": {
          "modifier": 1.5
        },
        "alchemy": {
          "bonusProperties": [
            "calming",
            "soothing",
            "rejuvenating"
          ]
        }
      }
    }
  }
} as const;
