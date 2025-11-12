/**
 * Weathered (WTH)
 * Exposed to the elements, giving it unique properties
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const WeatheredTrait: Trait = {
  "traitId": "weathered",
  "name": "Weathered",
  "shorthand": "WTH",
  "description": "Exposed to the elements, giving it unique properties",
  "rarity": "uncommon",
  "applicableCategories": [
    "resource"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Lightly Weathered",
      "description": "Minor exposure to the elements",
      "effects": {
        "vendorPrice": {
          "modifier": 1.05
        },
        "alchemy": {
          "bonusProperties": [
            "durability"
          ]
        }
      }
    },
    "2": {
      "name": "Weathered",
      "description": "Significant weathering with character",
      "effects": {
        "vendorPrice": {
          "modifier": 1.15
        },
        "alchemy": {
          "bonusProperties": [
            "durability",
            "resilience"
          ]
        }
      }
    },
    "3": {
      "name": "Storm-Weathered",
      "description": "Survived harsh conditions, deeply changed",
      "effects": {
        "vendorPrice": {
          "modifier": 1.3
        },
        "alchemy": {
          "bonusProperties": [
            "durability",
            "resilience",
            "elemental"
          ]
        }
      }
    }
  }
} as const;
