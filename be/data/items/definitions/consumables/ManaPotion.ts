/**
 * Mana Potion - A refined alchemical brew that restores moderate mana
 * Tier: 2 | Alchemy
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SUBCATEGORIES } from '../../../constants/item-constants';

export const ManaPotion: ConsumableItem = {
  itemId: 'mana_potion',
  name: 'Mana Potion',
  description: 'A refined alchemical brew that restores moderate mana. Enhanced with sage for mental clarity.',
  category: CATEGORY.CONSUMABLE,
  subcategories: SUBCATEGORIES.MANA_POTION,
  baseValue: 50,
  rarity: RARITY.UNCOMMON,
  stackable: true,
  properties: {
    weight: 0.3,
    material: MATERIAL.GENERIC,
    tier: TIER.T2,
    manaRestore: 50
  },
  allowedQualities: QUALITY_SETS.NONE,
  allowedTraits: TRAIT_SETS.POTION,
  icon: {
    path: 'item-categories/item_cat_potion_1.svg',
    material: 'mana_potion'
  }
} as const;
