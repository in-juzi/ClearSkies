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
    // All registries are classes, so we need to call their static methods
    this.items = new Map();
    ItemRegistry.getAllIds().forEach(id => {
      const item = ItemRegistry.get(id);
      if (item) {
        this.items.set(id, item);
      }
    });

    // Load qualities using static methods
    this.qualities = new Map();
    QualityRegistry.getAllIds().forEach(id => {
      const quality = QualityRegistry.get(id);
      if (quality) {
        this.qualities.set(id, quality);
      }
    });

    // Load traits using static methods
    this.traits = new Map();
    TraitRegistry.getAllIds().forEach(id => {
      const trait = TraitRegistry.get(id);
      if (trait) {
        this.traits.set(id, trait);
      }
    });
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

  /**
   * Enrich an item instance with full definition and quality/trait details
   * @param instance - Minimal item instance from API
   * @returns Enriched item with definition and details
   */
  enrichItemInstance(instance: any): any {
    const definition = this.getItemDefinition(instance.itemId);
    if (!definition) {
      console.warn(`[ItemDataService] Item definition not found for: ${instance.itemId}`);
      return instance;
    }

    // Calculate vendor price (50% of base value + quality/trait bonuses)
    let vendorPrice = Math.floor(definition.baseValue * 0.5);

    // Add quality bonuses to vendor price
    if (instance.qualities) {
      for (const [qualityId, level] of Object.entries(instance.qualities)) {
        const qualityDef = this.getQuality(qualityId);
        const levelStr = String(level);
        if (qualityDef?.levels?.[levelStr]) {
          const levelData = qualityDef.levels[levelStr];
          if (levelData.effects?.['vendor']?.priceMultiplier) {
            vendorPrice = Math.floor(vendorPrice * levelData.effects['vendor'].priceMultiplier);
          }
        }
      }
    }

    // Add trait bonuses to vendor price
    if (instance.traits) {
      for (const [traitId, level] of Object.entries(instance.traits)) {
        const traitDef = this.getTrait(traitId);
        const levelStr = String(level);
        if (traitDef?.levels?.[levelStr]) {
          const levelData = traitDef.levels[levelStr];
          if (levelData.effects?.['vendor']?.priceMultiplier) {
            vendorPrice = Math.floor(vendorPrice * levelData.effects['vendor'].priceMultiplier);
          }
        }
      }
    }

    // Build quality details
    const qualityDetails: any = {};
    if (instance.qualities) {
      for (const [qualityId, level] of Object.entries(instance.qualities)) {
        const qualityDef = this.getQuality(qualityId);
        const levelStr = String(level);
        if (qualityDef?.levels?.[levelStr]) {
          qualityDetails[qualityId] = {
            qualityId,
            name: qualityDef.name,
            level,
            maxLevel: qualityDef.maxLevel,
            levelData: qualityDef.levels[levelStr]
          };
        }
      }
    }

    // Build trait details with context-aware display names
    const traitDetails: any = {};
    if (instance.traits) {
      for (const [traitId, level] of Object.entries(instance.traits)) {
        const traitDef = this.getTrait(traitId);
        const levelStr = String(level);
        if (traitDef?.levels?.[levelStr]) {
          // Use category-specific names/descriptions if available
          const displayName = (traitDef as any).nameByCategory?.[definition.category] || traitDef.name;
          const displayShorthand = (traitDef as any).shorthandByCategory?.[definition.category] || (traitDef as any).shorthand;
          const displayDescription = (traitDef as any).descriptionByCategory?.[definition.category] || traitDef.description;

          traitDetails[traitId] = {
            traitId,
            name: displayName,
            shorthand: displayShorthand,
            description: displayDescription,
            rarity: traitDef.rarity,
            level,
            maxLevel: traitDef.maxLevel,
            levelData: traitDef.levels[levelStr]
          };
        }
      }
    }

    return {
      ...instance,
      name: definition.name, // Add top-level name for convenience
      definition,
      vendorPrice,
      qualityDetails,
      traitDetails
    };
  }

  /**
   * Enrich multiple item instances
   * @param instances - Array of minimal item instances from API
   * @returns Array of enriched items
   */
  enrichItemInstances(instances: any[]): any[] {
    return instances.map(instance => this.enrichItemInstance(instance));
  }
}
