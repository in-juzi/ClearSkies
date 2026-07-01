import { Injectable } from '@angular/core';
import { ItemDetails } from '../models/inventory.model';

/**
 * Centralized service for filtering item collections.
 * Provides consistent filtering logic across inventory, bank, crafting, and vendor components.
 */
@Injectable({
  providedIn: 'root'
})
export class ItemFilterService {

  /**
   * Filter items by category
   * @param items - Array of items to filter
   * @param category - Category to filter by ('all' for no filtering)
   * @returns Filtered array of items
   */
  filterByCategory(items: ItemDetails[], category: string): ItemDetails[] {
    if (category === 'all') {
      return items;
    }
    return items.filter(item => item.definition?.category === category);
  }

  /**
   * Filter items by subcategory
   * @param items - Array of items to filter
   * @param subcategory - Subcategory to filter by
   * @returns Filtered array of items
   */
  filterBySubcategory(items: ItemDetails[], subcategory: string): ItemDetails[] {
    return items.filter(item =>
      item.definition?.subcategories?.includes(subcategory)
    );
  }

  /**
   * Filter items by multiple subcategories (any match)
   * @param items - Array of items to filter
   * @param subcategories - Array of subcategories to match
   * @returns Filtered array of items
   */
  filterBySubcategories(items: ItemDetails[], subcategories: string[]): ItemDetails[] {
    return items.filter(item =>
      subcategories.some(subcategory =>
        item.definition?.subcategories?.includes(subcategory)
      )
    );
  }

  /**
   * Filter items by rarity
   * @param items - Array of items to filter
   * @param rarity - Rarity level to filter by
   * @returns Filtered array of items
   */
  filterByRarity(items: ItemDetails[], rarity: string): ItemDetails[] {
    return items.filter(item => item.definition?.rarity === rarity);
  }

  /**
   * Filter items by search query (searches name and itemId)
   * @param items - Array of items to filter
   * @param query - Search query string
   * @returns Filtered array of items
   */
  filterBySearch(items: ItemDetails[], query: string): ItemDetails[] {
    if (!query.trim()) {
      return items;
    }

    const searchTerm = query.toLowerCase();
    return items.filter(item =>
      item.definition?.name.toLowerCase().includes(searchTerm) ||
      item.itemId.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filter items by quality level
   * @param items - Array of items to filter
   * @param qualityId - Quality identifier
   * @param minLevel - Minimum quality level (1-5)
   * @returns Filtered array of items
   */
  filterByQuality(items: ItemDetails[], qualityId: string, minLevel: number = 1): ItemDetails[] {
    return items.filter(item => {
      if (!item.qualities || !(item.qualities instanceof Map)) {
        return false;
      }
      const level = item.qualities.get(qualityId);
      return level !== undefined && level >= minLevel;
    });
  }

  /**
   * Filter items by trait
   * @param items - Array of items to filter
   * @param traitId - Trait identifier
   * @param minLevel - Minimum trait level (1-3)
   * @returns Filtered array of items
   */
  filterByTrait(items: ItemDetails[], traitId: string, minLevel: number = 1): ItemDetails[] {
    return items.filter(item => {
      if (!item.traits || !(item.traits instanceof Map)) {
        return false;
      }
      const level = item.traits.get(traitId);
      return level !== undefined && level >= minLevel;
    });
  }

  /**
   * Filter out equipped items
   * @param items - Array of items to filter
   * @returns Filtered array of non-equipped items
   */
  filterUnequipped(items: ItemDetails[]): ItemDetails[] {
    return items.filter(item => !item.equipped);
  }

  /**
   * Filter for equipped items only
   * @param items - Array of items to filter
   * @returns Filtered array of equipped items
   */
  filterEquipped(items: ItemDetails[]): ItemDetails[] {
    return items.filter(item => item.equipped);
  }

  /**
   * Filter items by specific itemId
   * @param items - Array of items to filter
   * @param itemId - Item identifier to match
   * @returns Filtered array of items
   */
  filterByItemId(items: ItemDetails[], itemId: string): ItemDetails[] {
    return items.filter(item => item.itemId === itemId);
  }

  /**
   * Combined filter applying multiple criteria
   * @param items - Array of items to filter
   * @param criteria - Filter criteria object
   * @returns Filtered array of items
   */
  applyFilters(items: ItemDetails[], criteria: FilterCriteria): ItemDetails[] {
    let filtered = items;

    // Apply category filter
    if (criteria.category && criteria.category !== 'all') {
      filtered = this.filterByCategory(filtered, criteria.category);
    }

    // Apply subcategory filter
    if (criteria.subcategory) {
      filtered = this.filterBySubcategory(filtered, criteria.subcategory);
    }

    // Apply subcategories filter (array)
    if (criteria.subcategories && criteria.subcategories.length > 0) {
      filtered = this.filterBySubcategories(filtered, criteria.subcategories);
    }

    // Apply rarity filter
    if (criteria.rarity) {
      filtered = this.filterByRarity(filtered, criteria.rarity);
    }

    // Apply search query filter
    if (criteria.searchQuery) {
      filtered = this.filterBySearch(filtered, criteria.searchQuery);
    }

    // Apply quality filter
    if (criteria.qualityId) {
      filtered = this.filterByQuality(filtered, criteria.qualityId, criteria.minQualityLevel);
    }

    // Apply trait filter
    if (criteria.traitId) {
      filtered = this.filterByTrait(filtered, criteria.traitId, criteria.minTraitLevel);
    }

    // Apply equipped filter
    if (criteria.excludeEquipped) {
      filtered = this.filterUnequipped(filtered);
    }

    if (criteria.onlyEquipped) {
      filtered = this.filterEquipped(filtered);
    }

    // Apply itemId filter
    if (criteria.itemId) {
      filtered = this.filterByItemId(filtered, criteria.itemId);
    }

    return filtered;
  }
}

/**
 * Interface for combined filter criteria
 */
export interface FilterCriteria {
  category?: string;
  subcategory?: string;
  subcategories?: string[];
  rarity?: string;
  searchQuery?: string;
  qualityId?: string;
  minQualityLevel?: number;
  traitId?: string;
  minTraitLevel?: number;
  excludeEquipped?: boolean;
  onlyEquipped?: boolean;
  itemId?: string;
}
