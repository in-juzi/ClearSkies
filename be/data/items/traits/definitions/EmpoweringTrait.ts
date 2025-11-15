/**
 * Empowering (EMP)
 * Magical potency that amplifies offensive power
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const EmpoweringTrait: Trait = {
  "traitId": "empowering",
  "name": "Empowering",
  "shorthand": "EMP",
  "description": "Magical potency that amplifies offensive power",
  "rarity": "rare",
  "applicableCategories": [
    "resource"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Potent",
      "description": "Increases damage output when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 1.5
        },
        "alchemy": {
          "buffEffect": {
            "stat": "damage",
            "value": 0.1,
            "duration": 30,
            "isPercentage": true
          }
        }
      }
    },
    "2": {
      "name": "Empowered",
      "description": "Greatly increases damage output when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 2.0
        },
        "alchemy": {
          "buffEffect": {
            "stat": "damage",
            "value": 0.2,
            "duration": 30,
            "isPercentage": true
          }
        }
      }
    },
    "3": {
      "name": "Devastating",
      "description": "Massively increases damage output when consumed",
      "effects": {
        "vendorPrice": {
          "modifier": 3.0
        },
        "alchemy": {
          "buffEffect": {
            "stat": "damage",
            "value": 0.35,
            "duration": 30,
            "isPercentage": true
          }
        }
      }
    }
  }
} as const;
