/**
 * Balanced (BAL)
 * Tool has been expertly crafted for optimal ergonomics and efficiency
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const BalancedTrait: Trait = {
  "traitId": "balanced",
  "name": "Balanced",
  "shorthand": "BAL",
  "description": "Expertly crafted for optimal ergonomics and efficiency",
  "rarity": "uncommon",
  "applicableCategories": [
    "equipment"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Balanced",
      "description": "Well-balanced construction reduces activity time slightly",
      "effects": {
        "vendorPrice": {
          "modifier": 1.2
        },
        "activity": {
          "timeReduction": 1
        }
      }
    },
    "2": {
      "name": "Ergonomic",
      "description": "Superior ergonomics provide notable time savings",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "activity": {
          "timeReduction": 2
        }
      }
    },
    "3": {
      "name": "Masterwork",
      "description": "Legendary craftsmanship maximizes efficiency",
      "effects": {
        "vendorPrice": {
          "modifier": 1.6
        },
        "activity": {
          "timeReduction": 4
        }
      }
    }
  }
} as const;
