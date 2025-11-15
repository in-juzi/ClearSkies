import { Injectable } from '@angular/core';
import { ItemRegistry } from '@be/data/items/ItemRegistry';
import { QualityRegistry } from '@be/data/items/qualities/QualityRegistry';
import { TraitRegistry } from '@be/data/items/traits/TraitRegistry';
import type { Item, QualityDefinition, TraitDefinition } from '@shared/types';

/**
 * Frontend service providing direct access to game item definitions.
 * Imports the backend ItemRegistry directly - no API calls needed.
 *
 * This is a single source of truth - when items are added/modified in the backend,
 * the frontend automatically gets them on the next build.
 */
@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  private items: Map<string, Item>;
  private qualities: Map<string, QualityDefinition>;
  private traits: Map<string, TraitDefinition>;

  constructor() {
    // Import the EXACT same registries the backend uses
    // ItemRegistry is a class, so we need to call its static methods
    this.items = new Map();
    ItemRegistry.getAllIds().forEach(id => {
      const item = ItemRegistry.get(id);
      if (item) {
        this.items.set(id, item);
      }
    });

    // QualityRegistry and TraitRegistry are plain objects
    this.qualities = new Map(Object.entries(QualityRegistry));
    this.traits = new Map(Object.entries(TraitRegistry));

    console.log(`[ItemDataService] Loaded ${this.items.size} items, ${this.qualities.size} qualities, ${this.traits.size} traits`);
  }

  /**
   * Get item definition by itemId
   * @param itemId - The unique identifier for the item
   * @returns Item definition or undefined if not found
   */
  getItemDefinition(itemId: string): Item | undefined {
    return this.items.get(itemId);
  }

  /**
   * Get all item definitions
   * @returns Array of all item definitions
   */
  getAllItems(): Item[] {
    return Array.from(this.items.values());
  }

  /**
   * Get quality definition by qualityId
   * @param qualityId - The unique identifier for the quality
   * @returns Quality definition or undefined if not found
   */
  getQuality(qualityId: string): QualityDefinition | undefined {
    return this.qualities.get(qualityId);
  }

  /**
   * Get trait definition by traitId
   * @param traitId - The unique identifier for the trait
   * @returns Trait definition or undefined if not found
   */
  getTrait(traitId: string): TraitDefinition | undefined {
    return this.traits.get(traitId);
  }

  /**
   * Check if an item exists
   * @param itemId - The unique identifier for the item
   * @returns True if item exists, false otherwise
   */
  hasItem(itemId: string): boolean {
    return this.items.has(itemId);
  }

  /**
   * Get items by category
   * @param category - The item category to filter by
   * @returns Array of items in the specified category
   */
  getItemsByCategory(category: string): Item[] {
    return Array.from(this.items.values()).filter(item => item.category === category);
  }

  /**
   * Get items by subcategory
   * @param subcategory - The item subcategory to filter by
   * @returns Array of items with the specified subcategory
   */
  getItemsBySubcategory(subcategory: string): Item[] {
    return Array.from(this.items.values()).filter(item =>
      item.subcategories?.includes(subcategory)
    );
  }
}
