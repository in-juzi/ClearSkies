/**
 * Invigorating (INV)
 * Energizing properties that quicken reflexes and actions
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const InvigoratingTrait: Trait = {
  "traitId": "invigorating",
  "name": "Invigorating",
  "shorthand": "INV",
  "description": "Energizing properties that quicken reflexes and actions",
  "rarity": "uncommon",
  "applicableCategories": [
    "resource"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Quickening",
      "description": "Increases attack speed when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 1.3
        },
        "alchemy": {
          "buffEffect": {
            "stat": "attackSpeed",
            "value": 0.1,
            "duration": 20,
            "isPercentage": true
          }
        }
      }
    },
    "2": {
      "name": "Hastening",
      "description": "Greatly increases attack speed when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 1.7
        },
        "alchemy": {
          "buffEffect": {
            "stat": "attackSpeed",
            "value": 0.2,
            "duration": 20,
            "isPercentage": true
          }
        }
      }
    },
    "3": {
      "name": "Blur",
      "description": "Massively increases attack speed when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 2.5
        },
        "alchemy": {
          "buffEffect": {
            "stat": "attackSpeed",
            "value": 0.3,
            "duration": 20,
            "isPercentage": true
          }
        }
      }
    }
  }
} as const;
