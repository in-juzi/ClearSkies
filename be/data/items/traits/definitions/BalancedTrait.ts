/**
 * Balanced (BAL)
 * Tool has been expertly crafted for optimal ergonomics and efficiency
 */

import { TraitDefinition as Trait } from '../../../../types/items';
import { EffectContext, ModifierType, ConditionType } from '@shared/types/effect-system';

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
      "description": "Well-balanced construction reduces activity time by 1 second",
      "effects": {
        "vendorPrice": {
          "modifier": 1.2
        },
        "applicators": [
          {
            context: EffectContext.ACTIVITY_DURATION,
            modifierType: ModifierType.FLAT,
            value: -1,  // Negative = time reduction
            condition: { type: ConditionType.ALWAYS },
            description: "-1 second activity time"
          }
        ]
      }
    },
    "2": {
      "name": "Ergonomic",
      "description": "Superior ergonomics reduce activity time by 2 seconds",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "applicators": [
          {
            context: EffectContext.ACTIVITY_DURATION,
            modifierType: ModifierType.FLAT,
            value: -2,
            condition: { type: ConditionType.ALWAYS },
            description: "-2 seconds activity time"
          }
        ]
      }
    },
    "3": {
      "name": "Masterwork",
      "description": "Legendary craftsmanship reduces activity time by 4 seconds",
      "effects": {
        "vendorPrice": {
          "modifier": 1.6
        },
        "applicators": [
          {
            context: EffectContext.ACTIVITY_DURATION,
            modifierType: ModifierType.FLAT,
            value: -4,
            condition: { type: ConditionType.ALWAYS },
            description: "-4 seconds activity time"
          }
        ]
      }
    }
  }
} as const;
