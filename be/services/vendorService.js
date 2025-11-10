const fs = require('fs');
const path = require('path');
const itemService = require('./itemService');

/**
 * VendorService - Manages vendor data and transactions
 * Singleton pattern like LocationService and ItemService
 */
class VendorService {
  constructor() {
    this.vendors = new Map(); // vendorId -> vendor definition
    this.vendorsLoaded = false;
  }

  /**
   * Load all vendor definitions from JSON files
   */
  loadVendorDefinitions() {
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
        const vendorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Validate vendor definition
        if (!vendorData.vendorId) {
          console.error(`❌ Vendor definition missing vendorId: ${file}`);
          return;
        }

        this.vendors.set(vendorData.vendorId, vendorData);
      } catch (error) {
        console.error(`❌ Error loading vendor ${file}:`, error.message);
      }
    });

    console.log(`✓ Loaded ${this.vendors.size} vendor definitions`);
    this.vendorsLoaded = true;
  }

  /**
   * Get vendor definition by ID
   * @param {string} vendorId
   * @returns {object|null} Vendor definition or null if not found
   */
  getVendor(vendorId) {
    if (!this.vendorsLoaded) {
      this.loadVendorDefinitions();
    }

    return this.vendors.get(vendorId) || null;
  }

  /**
   * Get vendor stock with populated item definitions and calculated prices
   * @param {string} vendorId
   * @returns {Array} Stock items with item definitions attached
   */
  getVendorStock(vendorId) {
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
   * @param {string} vendorId
   * @param {string} itemId
   * @returns {number|null} Buy price or null if item not in stock
   */
  calculateBuyPrice(vendorId, itemId) {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return null;
    }

    const stockItem = vendor.stock.find(item => item.itemId === itemId);
    if (!stockItem) {
      return null;
    }

    return stockItem.buyPrice;
  }

  /**
   * Calculate the price a player receives when selling an item to a vendor
   * Uses the item's calculated vendor price (from ItemService) multiplied by vendor's sell multiplier
   * @param {string} vendorId
   * @param {object} itemInstance - Item instance from player inventory
   * @returns {number} Sell price
   */
  calculateSellPrice(vendorId, itemInstance) {
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
   * @param {string} vendorId
   * @param {string} itemId
   * @returns {boolean} True if vendor accepts the item
   */
  canVendorAcceptItem(vendorId, itemId) {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return false;
    }

    // Current implementation: all vendors accept all items if acceptsAllItems is true
    // Future: can add category filtering here
    if (vendor.acceptsAllItems) {
      return true;
    }

    // Future implementation: check accepted categories
    // const itemDef = itemService.getItemDefinition(itemId);
    // return vendor.acceptedCategories.includes(itemDef.category);

    return false;
  }

  /**
   * Check if vendor has an item in stock
   * @param {string} vendorId
   * @param {string} itemId
   * @returns {boolean} True if item is in stock
   */
  hasItemInStock(vendorId, itemId) {
    const vendor = this.getVendor(vendorId);
    if (!vendor) {
      return false;
    }

    return vendor.stock.some(item => item.itemId === itemId);
  }

  /**
   * Get all vendors (for debugging/admin purposes)
   * @returns {Array} All vendor definitions
   */
  getAllVendors() {
    if (!this.vendorsLoaded) {
      this.loadVendorDefinitions();
    }

    return Array.from(this.vendors.values());
  }

  /**
   * Reload vendor definitions (for hot-reload during development)
   */
  reload() {
    this.vendors.clear();
    this.vendorsLoaded = false;
    this.loadVendorDefinitions();
    return { message: 'Vendor definitions reloaded', count: this.vendors.size };
  }
}

// Export singleton instance
module.exports = new VendorService();
