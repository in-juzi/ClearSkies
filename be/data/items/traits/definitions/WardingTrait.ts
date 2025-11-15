/**
 * Warding (WRD)
 * Protective properties that fortify defenses
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const WardingTrait: Trait = {
  "traitId": "warding",
  "name": "Warding",
  "nameByCategory": {
    "resource": "Warding",
    "consumable": "Fortification"
  },
  "shorthand": "WRD",
  "shorthandByCategory": {
    "resource": "WRD",
    "consumable": "FRT"
  },
  "description": "Protective properties that fortify defenses",
  "descriptionByCategory": {
    "resource": "Protective properties that can be infused through alchemy",
    "consumable": "Fortifies defenses when consumed"
  },
  "rarity": "uncommon",
  "applicableCategories": [
    "resource",
    "consumable"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Fortifying",
      "description": "Grants temporary armor when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 1.3
        },
        "alchemy": {
          "buffEffect": {
            "stat": "armor",
            "value": 5,
            "duration": 30
          }
        }
      }
    },
    "2": {
      "name": "Shielding",
      "description": "Grants strong temporary armor when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 1.7
        },
        "alchemy": {
          "buffEffect": {
            "stat": "armor",
            "value": 10,
            "duration": 30
          }
        }
      }
    },
    "3": {
      "name": "Impervious",
      "description": "Grants exceptional temporary armor when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 2.5
        },
        "alchemy": {
          "buffEffect": {
            "stat": "armor",
            "value": 15,
            "duration": 30
          }
        }
      }
    }
  }
} as const;
