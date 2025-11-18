/**
 * Pristine (PRS)
 * In excellent condition
 */

import { TraitDefinition as Trait } from '@shared/types';

export const PristineTrait: Trait = {
  "traitId": "pristine",
  "name": "Pristine",
  "shorthand": "PRS",
  "description": "In excellent condition",
  "rarity": "rare",
  "applicableCategories": [
    "resource",
    "crafted"
  ],
  "maxLevel": 3,
  "levels": {
    "1": {
      "name": "Clean",
      "description": "Well-maintained with no major flaws",
      "effects": {
        "vendorPrice": {
          "modifier": 1.2
        },
        "smithing": {
          "qualityBonus": 0.1
        },
        "cooking": {
          "qualityBonus": 0.1
        }
      }
    },
    "2": {
      "name": "Pristine",
      "description": "In perfect condition with no flaws",
      "effects": {
        "vendorPrice": {
          "modifier": 1.5
        },
        "smithing": {
          "qualityBonus": 0.2
        },
        "cooking": {
          "qualityBonus": 0.2
        }
      }
    },
    "3": {
      "name": "Immaculate",
      "description": "Flawless perfection, beyond pristine",
      "effects": {
        "vendorPrice": {
          "modifier": 2
        },
        "smithing": {
          "qualityBonus": 0.35
        },
        "cooking": {
          "qualityBonus": 0.35
        }
      }
    }
  }
} as const;
