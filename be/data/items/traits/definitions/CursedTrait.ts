/**
 * Cursed (CRS)
 * Bears a mysterious curse with dangerous power
 */

import { TraitDefinition as Trait } from '../../../../types/items';

export const CursedTrait: Trait = {
  "traitId": "cursed",
  "name": "Cursed",
  "shorthand": "CRS",
  "description": "Bears a mysterious curse with dangerous power",
  "rarity": "rare",
  "applicableCategories": [
    "equipment",
    "crafted"
  ],
  "maxLevel": 1,
  "levels": {
    "1": {
      "name": "Cursed",
      "description": "Bears a mysterious curse - powerful but dangerous",
      "effects": {
        "combat": {
          "damageBonus": 0.3,
          "healthDrain": 5
        }
      }
    }
  }
} as const;
