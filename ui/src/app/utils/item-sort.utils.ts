import { ItemDetails } from '../models/inventory.model';

/**
 * Utility functions for sorting item collections.
 * Provides consistent sorting algorithms across inventory, bank, crafting, and vendor components.
 */

/**
 * Calculate quality + trait score for an item
 * Used for sorting items by their overall value
 * @param item - Item to calculate score for
 * @param traitWeight - Multiplier for trait levels (default: 10)
 * @returns Numeric score representing item quality
 */
export function calculateItemScore(item: ItemDetails, traitWeight: number = 10): number {
  let score = 0;

  // Sum all quality levels
  if (item.qualities) {
    const qualities = item.qualities instanceof Map
      ? Array.from(item.qualities.values())
      : Object.values(item.qualities);

    qualities.forEach(level => {
      score += level || 0;
    });
  }

  // Sum all trait levels (with higher weight since traits are rarer)
  if (item.traits) {
    const traits = item.traits instanceof Map
      ? Array.from(item.traits.values())
      : Object.values(item.traits);

    traits.forEach(level => {
      score += (level || 0) * traitWeight;
    });
  }

  return score;
}

/**
 * Sort items by quality + trait score (descending - highest first)
 * @param items - Array of items to sort
 * @param traitWeight - Multiplier for trait levels in scoring
 * @returns Sorted array (does not mutate original)
 */
export function sortByScore(items: ItemDetails[], traitWeight: number = 10): ItemDetails[] {
  return [...items].sort((a, b) =>
    calculateItemScore(b, traitWeight) - calculateItemScore(a, traitWeight)
  );
}

/**
 * Sort items by name (alphabetically)
 * @param items - Array of items to sort
 * @param descending - Sort Z-A instead of A-Z
 * @returns Sorted array (does not mutate original)
 */
export function sortByName(items: ItemDetails[], descending: boolean = false): ItemDetails[] {
  return [...items].sort((a, b) => {
    const comparison = a.definition.name.localeCompare(b.definition.name);
    return descending ? -comparison : comparison;
  });
}

/**
 * Sort items by rarity (legendary → common)
 * @param items - Array of items to sort
 * @returns Sorted array (does not mutate original)
 */
export function sortByRarity(items: ItemDetails[]): ItemDetails[] {
  const rarityOrder: Record<string, number> = {
    'legendary': 5,
    'epic': 4,
    'rare': 3,
    'uncommon': 2,
    'common': 1
  };

  return [...items].sort((a, b) => {
    const aRarity = rarityOrder[a.definition.rarity] || 0;
    const bRarity = rarityOrder[b.definition.rarity] || 0;
    return bRarity - aRarity;
  });
}

/**
 * Sort items by category
 * @param items - Array of items to sort
 * @returns Sorted array (does not mutate original)
 */
export function sortByCategory(items: ItemDetails[]): ItemDetails[] {
  const categoryOrder: Record<string, number> = {
    'equipment': 1,
    'consumable': 2,
    'resource': 3
  };

  return [...items].sort((a, b) => {
    const aOrder = categoryOrder[a.definition.category] || 99;
    const bOrder = categoryOrder[b.definition.category] || 99;
    return aOrder - bOrder;
  });
}

/**
 * Sort items by quantity (descending - most first)
 * @param items - Array of items to sort
 * @returns Sorted array (does not mutate original)
 */
export function sortByQuantity(items: ItemDetails[]): ItemDetails[] {
  return [...items].sort((a, b) => b.quantity - a.quantity);
}

/**
 * Sort items by weight (descending - heaviest first)
 * @param items - Array of items to sort
 * @returns Sorted array (does not mutate original)
 */
export function sortByWeight(items: ItemDetails[]): ItemDetails[] {
  return [...items].sort((a, b) => {
    const aWeight = a.definition.properties?.weight || 0;
    const bWeight = b.definition.properties?.weight || 0;
    return bWeight - aWeight;
  });
}

/**
 * Sort items by value (descending - most valuable first)
 * @param items - Array of items to sort
 * @returns Sorted array (does not mutate original)
 */
export function sortByValue(items: ItemDetails[]): ItemDetails[] {
  return [...items].sort((a, b) => {
    const aValue = a.definition.baseValue || 0;
    const bValue = b.definition.baseValue || 0;
    return bValue - aValue;
  });
}

/**
 * Multi-criteria sort: category → rarity → score
 * Useful for organizing inventory in a logical order
 * @param items - Array of items to sort
 * @returns Sorted array (does not mutate original)
 */
export function sortByCategoryRarityScore(items: ItemDetails[]): ItemDetails[] {
  const categoryOrder: Record<string, number> = {
    'equipment': 1,
    'consumable': 2,
    'resource': 3
  };

  const rarityOrder: Record<string, number> = {
    'legendary': 5,
    'epic': 4,
    'rare': 3,
    'uncommon': 2,
    'common': 1
  };

  return [...items].sort((a, b) => {
    // First by category
    const aCat = categoryOrder[a.definition.category] || 99;
    const bCat = categoryOrder[b.definition.category] || 99;
    if (aCat !== bCat) return aCat - bCat;

    // Then by rarity
    const aRar = rarityOrder[a.definition.rarity] || 0;
    const bRar = rarityOrder[b.definition.rarity] || 0;
    if (aRar !== bRar) return bRar - aRar;

    // Finally by score
    return calculateItemScore(b) - calculateItemScore(a);
  });
}

/**
 * Sort type enum for easier usage
 */
export enum SortType {
  SCORE = 'score',
  NAME = 'name',
  RARITY = 'rarity',
  CATEGORY = 'category',
  QUANTITY = 'quantity',
  WEIGHT = 'weight',
  VALUE = 'value',
  CATEGORY_RARITY_SCORE = 'category_rarity_score'
}

/**
 * Generic sort function that accepts a sort type
 * @param items - Array of items to sort
 * @param sortType - Type of sorting to apply
 * @param descending - Reverse the sort order (only for name)
 * @returns Sorted array (does not mutate original)
 */
export function sortItems(items: ItemDetails[], sortType: SortType, descending: boolean = false): ItemDetails[] {
  switch (sortType) {
    case SortType.SCORE:
      return sortByScore(items);
    case SortType.NAME:
      return sortByName(items, descending);
    case SortType.RARITY:
      return sortByRarity(items);
    case SortType.CATEGORY:
      return sortByCategory(items);
    case SortType.QUANTITY:
      return sortByQuantity(items);
    case SortType.WEIGHT:
      return sortByWeight(items);
    case SortType.VALUE:
      return sortByValue(items);
    case SortType.CATEGORY_RARITY_SCORE:
      return sortByCategoryRarityScore(items);
    default:
      return items;
  }
}
