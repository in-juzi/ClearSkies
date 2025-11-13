/**
 * Weak Mana Potion - A basic alchemical tincture that restores minor mana
 * Tier: 1 | Alchemy
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SUBCATEGORIES } from '../../../constants/item-constants';

export const ManaPotionWeak: ConsumableItem = {
  itemId: 'weak_mana_potion',
  name: 'Weak Mana Tincture',
  description: 'A basic alchemical tincture that restores a small amount of mana. Crafted from common herbs.',
  category: CATEGORY.CONSUMABLE,
  subcategories: SUBCATEGORIES.MANA_TINCTURE,
  baseValue: 25,
  rarity: RARITY.COMMON,
  stackable: true,
  properties: {
    weight: 0.2,
    material: MATERIAL.GENERIC,
    tier: TIER.T1,
    manaRestore: 20
  },
  allowedQualities: QUALITY_SETS.NONE,
  allowedTraits: TRAIT_SETS.POTION,
  icon: {
    path: 'item-categories/item_cat_potion_1.svg',
    material: 'mana_potion'
  }
} as const;
