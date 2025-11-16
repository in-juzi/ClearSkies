/**
 * Hardened (HRD)
 * Weapon has been tempered to perfection, granting increased damage
 */

import { TraitDefinition as Trait } from '../../../../types/items';
import { EffectContext, ModifierType, ConditionType } from '@shared/types/effect-system';

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
      "description": "Basic tempering provides +2 damage",
      "effects": {
        "vendorPrice": {
          "modifier": 1.2
        },
        "applicators": [
          {
            context: EffectContext.COMBAT_DAMAGE,
            modifierType: ModifierType.FLAT,
            value: 2,
            condition: { type: ConditionType.ALWAYS },
            description: "+2 flat damage"
          }
        ]
      }
    },
    "2": {
      "name": "Tempered",
      "description": "Expert tempering grants +4 damage",
      "effects": {
        "vendorPrice": {
          "modifier": 1.4
        },
        "applicators": [
          {
            context: EffectContext.COMBAT_DAMAGE,
            modifierType: ModifierType.FLAT,
            value: 4,
            condition: { type: ConditionType.ALWAYS },
            description: "+4 flat damage"
          }
        ]
      }
    },
    "3": {
      "name": "Battle-Forged",
      "description": "Legendary forging creates a devastating weapon (+7 damage)",
      "effects": {
        "vendorPrice": {
          "modifier": 1.6
        },
        "applicators": [
          {
            context: EffectContext.COMBAT_DAMAGE,
            modifierType: ModifierType.FLAT,
            value: 7,
            condition: { type: ConditionType.ALWAYS },
            description: "+7 flat damage"
          }
        ]
      }
    }
  }
} as const;
