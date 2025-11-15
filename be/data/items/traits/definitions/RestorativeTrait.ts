/**
 * Restorative (RST)
 * Calming and healing properties that restore health over time
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const RestorativeTrait: Trait = {
  "traitId": "restorative",
  "name": "Restorative",
  "shorthand": "RST",
  "description": "Calming and healing properties that restore health over time",
  "rarity": "uncommon",
  "applicableCategories": [
    "resource"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Soothing",
      "description": "Provides gentle healing over time",
      "effects": {
        "vendorPrice": {
          "modifier": 1.3
        },
        "alchemy": {
          "hotEffect": {
            "healPerTick": 2,
            "ticks": 5,
            "tickInterval": 3
          }
        }
      }
    },
    "2": {
      "name": "Regenerative",
      "description": "Provides strong healing over time",
      "effects": {
        "vendorPrice": {
          "modifier": 1.7
        },
        "alchemy": {
          "hotEffect": {
            "healPerTick": 4,
            "ticks": 5,
            "tickInterval": 3
          }
        }
      }
    },
    "3": {
      "name": "Miraculous",
      "description": "Provides exceptional healing over time",
      "effects": {
        "vendorPrice": {
          "modifier": 2.5
        },
        "alchemy": {
          "hotEffect": {
            "healPerTick": 7,
            "ticks": 5,
            "tickInterval": 3
          }
        }
      }
    }
  }
} as const;
