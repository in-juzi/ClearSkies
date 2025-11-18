/**
 * Masterwork (MST)
 * Crafted by a skilled artisan
 */

import { TraitDefinition as Trait } from '@shared/types';

export const MasterworkTrait: Trait = {
  "traitId": "masterwork",
  "name": "Masterwork",
  "shorthand": "MST",
  "description": "Crafted by a skilled artisan",
  "rarity": "epic",
  "applicableCategories": [
    "crafted",
    "equipment"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Expertly Crafted",
      "description": "Made with exceptional skill",
      "effects": {
        "vendorPrice": {
          "modifier": 1.8
        },
        "combat": {
          "damageBonus": 0.2
        }
      }
    },
    "2": {
      "name": "Masterwork",
      "description": "Crafted by a master artisan",
      "effects": {
        "vendorPrice": {
          "modifier": 2.5
        },
        "combat": {
          "damageBonus": 0.35
        }
      }
    },
    "3": {
      "name": "Legendary Craft",
      "description": "The pinnacle of craftsmanship",
      "effects": {
        "vendorPrice": {
          "modifier": 4
        },
        "combat": {
          "damageBonus": 0.6
        }
      }
    }
  }
} as const;
