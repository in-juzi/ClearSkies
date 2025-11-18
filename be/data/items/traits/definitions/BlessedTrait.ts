/**
 * Blessed (BLS)
 * Blessed by divine forces
 */

import { TraitDefinition as Trait } from '@shared/types';

export const BlessedTrait: Trait = {
  "traitId": "blessed",
  "name": "Blessed",
  "shorthand": "BLS",
  "description": "Blessed by divine forces",
  "rarity": "epic",
  "applicableCategories": [
    "equipment",
    "consumable",
    "crafted"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Touched",
      "description": "Touched by divine grace",
      "effects": {
        "vendorPrice": {
          "modifier": 1.5
        },
        "combat": {
          "damageBonus": 0.1
        },
        "consumption": {
          "healingMultiplier": 1.3
        }
      }
    },
    "2": {
      "name": "Blessed",
      "description": "Blessed by divine forces",
      "effects": {
        "vendorPrice": {
          "modifier": 2
        },
        "combat": {
          "damageBonus": 0.2
        },
        "consumption": {
          "healingMultiplier": 1.7
        }
      }
    },
    "3": {
      "name": "Divinely Blessed",
      "description": "Empowered by divine will",
      "effects": {
        "vendorPrice": {
          "modifier": 3
        },
        "combat": {
          "damageBonus": 0.35
        },
        "consumption": {
          "healingMultiplier": 2.5
        }
      }
    }
  }
} as const;
