import itemService from './itemService';
import { Vendor, StockItem, ItemInstance } from '@shared/types';
import { VendorRegistry } from '../data/vendors/VendorRegistry';
import effectEvaluator from './effectEvaluator';

/**
 * VendorService - Manages vendor data and transactions
 * Singleton pattern like LocationService and ItemService
 */
class VendorService {
  /**
   * Get vendor definition by ID
   */
  getVendor(vendorId: string): Vendor | null {
    return VendorRegistry.get(vendorId) || null;
  }

  /**
   * Get vendor stock with populated item definitions and calculated prices
   */
  getVendorStock(vendorId: string): any[] {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return [];
    }

    // Batch fetch item definitions to avoid N+1 queries
    const itemIds = vendor.stock.map(item => item.itemId);
    const itemDefinitions = itemService.getItemDefinitions(itemIds);

    // Populate stock items with item definitions
    return vendor.stock.map(stockItem => {
      const itemDef = itemDefinitions.get(stockItem.itemId);

      if (!itemDef) {
        console.warn(`⚠️  Vendor ${vendorId} references unknown item: ${stockItem.itemId}`);
        return null;
      }

      return {
        ...stockItem,
        itemDefinition: itemDef
      };
    }).filter(item => item !== null);
  }

  /**
   * Calculate the price a player pays to buy an item from a vendor
   * Now integrates effect system for player-based price modifiers (e.g., Charisma attribute bonus)
   */
  calculateBuyPrice(vendorId: string, itemId: string, player?: any): number | null {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return null;
    }

    const stockItem = vendor.stock.find(item => item.itemId === itemId);
    if (!stockItem) {
      return null;
    }

    // Get base buy price from vendor stock
    let buyPrice = stockItem.buyPrice ?? stockItem.price ?? null;
    if (buyPrice === null) {
      return null;
    }

    // Apply effect system modifiers from player's equipped items (e.g., Merchant trait, high charisma)
    if (player) {
      const priceEffects = effectEvaluator.getVendorBuyPriceModifier(
        player,
        itemId,
        vendor
      );

      // Apply modifiers: (base + flat) * (1 + percentage) * multiplier
      buyPrice = effectEvaluator.calculateFinalValue(buyPrice, {
        flatBonus: priceEffects.flat,
        percentageBonus: priceEffects.percentage,
        multiplier: priceEffects.multiplier,
        appliedEffects: [],
        skippedEffects: []
      });
    }

    return Math.floor(buyPrice);
  }

  /**
   * Calculate the price a player receives when selling an item to a vendor
   * Uses the item's calculated vendor price (from ItemService) multiplied by vendor's sell multiplier
   * Now integrates effect system for player-based price modifiers (e.g., Merchant trait)
   */
  calculateSellPrice(vendorId: string, itemInstance: any, player?: any): number {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return 0;
    }

    // Get the item's full vendor price (with quality/trait bonuses from the item itself)
    const baseVendorPrice = itemService.calculateVendorPrice(itemInstance);

    // Apply vendor's sell multiplier (default 0.5 = 50%)
    let sellPrice = baseVendorPrice * vendor.sellPriceMultiplier;

    // Apply effect system modifiers from player's equipped items (e.g., Merchant trait)
    if (player) {
      const priceEffects = effectEvaluator.getVendorSellPriceModifier(
        player,
        itemInstance,
        vendor
      );

      // Apply modifiers: (base + flat) * (1 + percentage) * multiplier
      sellPrice = effectEvaluator.calculateFinalValue(sellPrice, {
        flatBonus: priceEffects.flat,
        percentageBonus: priceEffects.percentage,
        multiplier: priceEffects.multiplier,
        appliedEffects: [],
        skippedEffects: []
      });
    }

    return Math.floor(sellPrice);
  }

  /**
   * Check if a vendor accepts a specific item
   */
  canVendorAcceptItem(vendorId: string, itemId: string): boolean {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return false;
    }

    // Check if vendor accepts all items (buyback or acceptsAllItems)
    if (vendor.buyback || vendor.acceptsAllItems) {
      return true;
    }

    // Future implementation: check accepted categories
    // const itemDef = itemService.getItemDefinition(itemId);
    // return vendor.acceptedCategories.includes(itemDef.category);

    return false;
  }

  /**
   * Check if vendor has an item in stock
   */
  hasItemInStock(vendorId: string, itemId: string): boolean {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return false;
    }

    return vendor.stock.some(item => item.itemId === itemId);
  }

  /**
   * Get all vendors (for debugging/admin purposes)
   */
  getAllVendors(): Vendor[] {
    return VendorRegistry.getAll();
  }

  /**
   * Reload vendor definitions (for hot-reload during development)
   * Note: With compile-time registries, hot-reload requires server restart
   */
  reload(): { message: string; count: number } {
    return {
      message: 'Vendor definitions are compiled at build time. Restart server to reload.',
      count: VendorRegistry.size
    };
  }
}

// Export singleton instance
export default new VendorService();
