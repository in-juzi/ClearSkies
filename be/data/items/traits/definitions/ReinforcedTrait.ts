/**
 * Reinforced (RNF)
 * Armor has been reinforced with additional protection layers
 * NOTE: Combat armor bonuses will be implemented in combat service layer
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const ReinforcedTrait: Trait = {
  "traitId": "reinforced",
  "name": "Reinforced",
  "shorthand": "RNF",
  "description": "Reinforced with additional layers for superior protection",
  "rarity": "uncommon",
  "applicableCategories": [
    "equipment"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Reinforced",
      "description": "Additional layers provide +3 flat armor",
      "effects": {
        "vendorPrice": {
          "modifier": 1.2
        }
      }
    },
    "2": {
      "name": "Fortified",
      "description": "Heavy reinforcement provides +6 flat armor",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        }
      }
    },
    "3": {
      "name": "Impenetrable",
      "description": "Legendary craftsmanship provides +10 flat armor",
      "effects": {
        "vendorPrice": {
          "modifier": 1.6
        }
      }
    }
  }
} as const;
