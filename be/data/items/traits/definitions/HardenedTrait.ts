/**
 * Hardened (HRD)
 * Weapon has been tempered to perfection, granting increased damage
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const HardenedTrait: Trait = {
  "traitId": "hardened",
  "name": "Hardened",
  "shorthand": "HRD",
  "description": "Tempered to perfection for enhanced combat performance",
  "rarity": "uncommon",
  "applicableCategories": [
    "equipment"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Hardened",
      "description": "Basic tempering provides modest damage increase",
      "effects": {
        "vendorPrice": {
          "modifier": 1.2
        },
        "combat": {
          "damageBonus": 2
        }
      }
    },
    "2": {
      "name": "Tempered",
      "description": "Expert tempering grants significant combat advantage",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "combat": {
          "damageBonus": 4
        }
      }
    },
    "3": {
      "name": "Battle-Forged",
      "description": "Legendary forging creates a devastating weapon",
      "effects": {
        "vendorPrice": {
          "modifier": 1.6
        },
        "combat": {
          "damageBonus": 7
        }
      }
    }
  }
} as const;
