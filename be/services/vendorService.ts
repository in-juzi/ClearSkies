import * as fs from 'fs';
import * as path from 'path';
import itemService from './itemService';
import { Vendor, StockItem, ItemInstance } from '../types';

/**
 * VendorService - Manages vendor data and transactions
 * Singleton pattern like LocationService and ItemService
 */
class VendorService {
  private vendors: Map<string, Vendor> = new Map();
  private vendorsLoaded: boolean = false;

  /**
   * Load all vendor definitions from JSON files
   */
  loadVendorDefinitions(): void {
    if (this.vendorsLoaded) {
      return;
    }

    const vendorsDir = path.join(__dirname, '../data/vendors');

    if (!fs.existsSync(vendorsDir)) {
      console.warn('⚠️  Vendors directory not found:', vendorsDir);
      this.vendorsLoaded = true;
      return;
    }

    const files = fs.readdirSync(vendorsDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
      try {
        const filePath = path.join(vendorsDir, file);
        const vendorData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Vendor;

        // Validate vendor definition
        if (!vendorData.vendorId) {
          console.error(`❌ Vendor definition missing vendorId: ${file}`);
          return;
        }

        this.vendors.set(vendorData.vendorId, vendorData);
      } catch (error: any) {
        console.error(`❌ Error loading vendor ${file}:`, error.message);
      }
    });

    console.log(`✓ Loaded ${this.vendors.size} vendor definitions`);
    this.vendorsLoaded = true;
  }

  /**
   * Get vendor definition by ID
   */
  getVendor(vendorId: string): Vendor | null {
    if (!this.vendorsLoaded) {
      this.loadVendorDefinitions();
    }

    return this.vendors.get(vendorId) || null;
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

    return stockItem.price;
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

    // Current implementation: all vendors accept all items if buyback is true
    // Future: can add category filtering here
    if (vendor.buyback) {
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
    if (!this.vendorsLoaded) {
      this.loadVendorDefinitions();
    }

    return Array.from(this.vendors.values());
  }

  /**
   * Reload vendor definitions (for hot-reload during development)
   */
  reload(): { message: string; count: number } {
    this.vendors.clear();
    this.vendorsLoaded = false;
    this.loadVendorDefinitions();
    return { message: 'Vendor definitions reloaded', count: this.vendors.size };
  }
}

// Export singleton instance
export default new VendorService();
