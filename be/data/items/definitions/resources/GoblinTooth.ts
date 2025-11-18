/**
 * Goblin Tooth - A jagged tooth from a goblin warrior. Goblins are known for their sharp teeth and fiercer bite.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const GoblinTooth: ResourceItem = {
  "itemId": "goblin_tooth",
  "name": "Goblin Tooth",
  "description": "A jagged tooth from a goblin warrior. Goblins are known for their sharp teeth and fiercer bite.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP,
  "rarity": RARITY.COMMON,
  "baseValue": 7,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.SHEEN,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "items/fangs.svg",
    "material": "bone"
  }
} as const;
