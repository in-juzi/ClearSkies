/**
 * Reinforced (RNF)
 * Armor has been reinforced with additional protection layers
 */

import { TraitDefinition as Trait } from '@shared/types';
import { EffectContext, ModifierType, ConditionType } from '@shared/types/effect-system';

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
        },
        "applicators": [
          {
            context: EffectContext.COMBAT_ARMOR,
            modifierType: ModifierType.FLAT,
            value: 3,
            condition: { type: ConditionType.ALWAYS },
            description: "+3 flat armor"
          }
        ]
      }
    },
    "2": {
      "name": "Fortified",
      "description": "Heavy reinforcement provides +6 flat armor",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "applicators": [
          {
            context: EffectContext.COMBAT_ARMOR,
            modifierType: ModifierType.FLAT,
            value: 6,
            condition: { type: ConditionType.ALWAYS },
            description: "+6 flat armor"
          }
        ]
      }
    },
    "3": {
      "name": "Impenetrable",
      "description": "Legendary craftsmanship provides +10 flat armor",
      "effects": {
        "vendorPrice": {
          "modifier": 1.6
        },
        "applicators": [
          {
            context: EffectContext.COMBAT_ARMOR,
            modifierType: ModifierType.FLAT,
            value: 10,
            condition: { type: ConditionType.ALWAYS },
            description: "+10 flat armor"
          }
        ]
      }
    }
  }
} as const;
