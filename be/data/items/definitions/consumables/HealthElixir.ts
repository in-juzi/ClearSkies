/**
 * Strong Health Potion - A potent alchemical elixir that restores substantial health
 * Tier: 3 | Alchemy
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SUBCATEGORIES } from '../../../constants/item-constants';

export const HealthElixir: ConsumableItem = {
  itemId: 'health_elixir',
  name: 'Health Elixir',
  description: 'A potent alchemical elixir that restores substantial health. Combines multiple herbs for maximum efficacy.',
  category: CATEGORY.CONSUMABLE,
  subcategories: SUBCATEGORIES.HEALTH_ELIXIR,
  baseValue: 75,
  rarity: RARITY.UNCOMMON,
  stackable: true,
  properties: {
    weight: 0.4,
    material: MATERIAL.GENERIC,
    tier: TIER.T3,
    healthRestore: 75
  },
  allowedQualities: QUALITY_SETS.NONE,
  allowedTraits: TRAIT_SETS.POTION,
  icon: {
    path: 'item-categories/item_cat_potion_1.svg',
    material: 'health_potion'
  }
} as const;
