/**
 * Humanoid Sigil - a gem-vessel with an outlaw's crystallized essence bound
 * into it. Crafted via enchanting (essence_humanoid + a gemstone vessel).
 * Socketed into gear, it carries a bandit's martial opportunism: a chance to
 * recover health when the wearer lands a killing blow. The effect lives here in
 * `socketEffect` (the effectEvaluator reads it off this definition when walking
 * a host item's filled sockets).
 *
 * See project/ideas/enchanting.md (family→effect table). Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';
import { TriggerType, TriggerActionType } from '@shared/types/effect-system';

export const SigilHumanoid: ResourceItem = {
  "itemId": "sigil_humanoid",
  "name": "Humanoid Sigil",
  "description": "A cut gem with an outlaw's essence bound into its lattice. Socketed into gear, it lends a bandit's opportunism - a chance to recover health after striking down a foe.",
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
        "trigger": TriggerType.ON_KILL,
        "chance": 0.5,
        "action": {
          "type": TriggerActionType.HEAL,
          "value": 10
        },
        "description": "50% chance on kill to recover 10 health."
      }
    ]
  },
  "icon": {
    "path": "item-categories/item_cat_gem.svg",
    "material": "emerald"
  }
} as const;
