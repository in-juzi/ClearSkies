import itemService from './itemService';
import { Vendor, StockItem, ItemInstance } from '@shared/types';
import { VendorRegistry } from '../data/vendors/VendorRegistry';

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

    // Populate stock items with item definitions
    return vendor.stock.map(stockItem => {
      const itemDef = itemService.getItemDefinition(stockItem.itemId);

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
   */
  calculateBuyPrice(vendorId: string, itemId: string): number | null {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return null;
    }

    const stockItem = vendor.stock.find(item => item.itemId === itemId);
    if (!stockItem) {
      return null;
    }

    // Use buyPrice field (primary) or fall back to price field (legacy)
    return stockItem.buyPrice ?? stockItem.price ?? null;
  }

  /**
   * Calculate the price a player receives when selling an item to a vendor
   * Uses the item's calculated vendor price (from ItemService) multiplied by vendor's sell multiplier
   */
  calculateSellPrice(vendorId: string, itemInstance: any): number {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return 0;
    }

    // Get the item's full vendor price (with quality/trait bonuses)
    const vendorPrice = itemService.calculateVendorPrice(itemInstance);

    // Apply vendor's sell multiplier (default 0.5 = 50%)
    const sellPrice = Math.floor(vendorPrice * vendor.sellPriceMultiplier);

    return sellPrice;
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
