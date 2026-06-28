/**
 * Goblinoid Sigil - a gem-vessel with a goblin's crystallized essence bound into it.
 * Crafted via enchanting (essence_goblinoid + a gemstone vessel). When socketed
 * into a weapon, it carries the goblin's greedy cunning: a chance to siphon gold
 * on hit. The effect lives here in `socketEffect` (the effectEvaluator reads it
 * off this definition when walking a host item's filled sockets).
 *
 * See project/ideas/enchanting.md. Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';
import { TriggerType, TriggerActionType } from '@shared/types/effect-system';

export const SigilGoblinoid: ResourceItem = {
  "itemId": "sigil_goblinoid",
  "name": "Goblinoid Sigil",
  "description": "A cut gem with a goblin's essence bound into its lattice. Socketed into a weapon, it lends a thief's instinct - a chance to siphon gold from a struck foe.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.SOCKETABLE, SUBCATEGORY.ENCHANTING, SUBCATEGORY.MAGICAL],
  "rarity": RARITY.UNCOMMON,
  "baseValue": 60,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GEMSTONE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.ENCHANTING
  },
  "allowedQualities": QUALITY_SETS.SHEEN,
  "allowedTraits": TRAIT_SETS.NONE,
  "socketEffect": {
    "triggers": [
      {
        "trigger": TriggerType.ON_HIT,
        "chance": 0.25,
        "action": {
          "type": TriggerActionType.STEAL_GOLD,
          "value": 5
        },
        "description": "25% chance on hit to siphon 5 gold from the target."
      }
    ]
  },
  "icon": {
    "path": "item-categories/item_cat_gem.svg",
    "material": "amethyst"
  }
} as const;
