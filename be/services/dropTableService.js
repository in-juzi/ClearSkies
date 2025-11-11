const fs = require('fs').promises;
const path = require('path');

class DropTableService {
  constructor() {
    this.dropTables = new Map();
    this.loaded = false;
  }

  /**
   * Load all drop table definitions from JSON files
   */
  async loadAll() {
    try {
      const dropTablesDir = path.join(__dirname, '../data/locations/drop-tables');
      const files = await fs.readdir(dropTablesDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(dropTablesDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const dropTable = JSON.parse(data);
          this.dropTables.set(dropTable.dropTableId, dropTable);
        }
      }

      this.loaded = true;
      console.log(`Drop table data loaded successfully - ${this.dropTables.size} drop tables`);
    } catch (error) {
      console.error('Error loading drop table data:', error);
      throw error;
    }
  }

  /**
   * Get a drop table by ID
   */
  getDropTable(dropTableId) {
    return this.dropTables.get(dropTableId);
  }

  /**
   * Get all drop tables
   */
  getAllDropTables() {
    return Array.from(this.dropTables.values());
  }

  /**
   * Roll on a drop table using weighted random selection
   * Supports nested drop tables (drop tables that reference other drop tables)
   * @param {string} dropTableId - The drop table to roll on
   * @param {object} options - Optional modifiers (luck, quality multipliers, etc.)
   * @param {number} depth - Current nesting depth (used internally for recursion protection)
   * @returns {object|null} The selected drop or null if dropNothing was rolled
   */
  rollDropTable(dropTableId, options = {}, depth = 0) {
    const MAX_DEPTH = 5; // Maximum nesting depth to prevent infinite loops

    // Check for excessive nesting depth
    if (depth > MAX_DEPTH) {
      console.warn(`⚠️ Max nesting depth (${MAX_DEPTH}) reached for drop table: ${dropTableId}`);
      return null;
    }

    const dropTable = this.dropTables.get(dropTableId);
    if (!dropTable) {
      console.warn(`Drop table not found: ${dropTableId}`);
      return null;
    }

    // Calculate total weight
    const totalWeight = dropTable.drops.reduce((sum, drop) => sum + drop.weight, 0);

    // Roll random number between 0 and totalWeight
    let roll = Math.random() * totalWeight;

    // Find which drop was selected
    for (const drop of dropTable.drops) {
      roll -= drop.weight;
      if (roll <= 0) {
        // Check if this is a "drop nothing" entry
        if (drop.dropNothing) {
          return null;
        }

        // Check if this is a nested drop table
        // Support explicit type: "dropTable" or implicit detection (has dropTableId but no itemId)
        const isNestedTable = drop.type === 'dropTable' || (drop.dropTableId && !drop.itemId);

        if (isNestedTable) {
          // Recursively roll on the nested drop table
          return this.rollDropTable(drop.dropTableId, options, depth + 1);
        }

        // Otherwise, this is a normal item drop
        // Calculate quantity
        const quantity = drop.quantity.min +
          Math.floor(Math.random() * (drop.quantity.max - drop.quantity.min + 1));

        // Build the drop result
        const result = {
          itemId: drop.itemId,
          quantity,
          qualities: {},
          traits: []
        };

        // Apply quality bonuses if specified
        if (drop.qualityBonus) {
          result.qualityBonus = drop.qualityBonus;
        }

        // Apply any option modifiers
        if (options.qualityMultiplier) {
          result.qualityMultiplier = options.qualityMultiplier;
        }

        return result;
      }
    }

    // Fallback (shouldn't reach here)
    console.warn(`Drop table roll failed unexpectedly for ${dropTableId}`);
    return null;
  }

  /**
   * Roll on multiple drop tables
   * @param {string[]} dropTableIds - Array of drop table IDs to roll on
   * @param {object} options - Optional modifiers
   * @returns {object[]} Array of drop results (excluding null drops)
   */
  rollMultipleDropTables(dropTableIds, options = {}) {
    const results = [];

    for (const dropTableId of dropTableIds) {
      const drop = this.rollDropTable(dropTableId, options);
      if (drop) {
        results.push(drop);
      }
    }

    return results;
  }

  /**
   * Get drop table statistics (useful for balancing)
   * @param {string} dropTableId - The drop table to analyze
   * @returns {object} Statistics about the drop table
   */
  getDropTableStats(dropTableId) {
    const dropTable = this.dropTables.get(dropTableId);
    if (!dropTable) {
      return null;
    }

    const totalWeight = dropTable.drops.reduce((sum, drop) => sum + drop.weight, 0);

    const stats = {
      dropTableId,
      name: dropTable.name,
      totalWeight,
      drops: dropTable.drops.map(drop => ({
        itemId: drop.itemId || 'nothing',
        weight: drop.weight,
        probability: (drop.weight / totalWeight * 100).toFixed(2) + '%',
        quantityRange: drop.quantity ? `${drop.quantity.min}-${drop.quantity.max}` : 'N/A',
        comment: drop.comment
      }))
    };

    return stats;
  }

  /**
   * Reload all drop tables (useful for hot-reloading during development)
   */
  async reload() {
    this.dropTables.clear();
    await this.loadAll();
    return { success: true, count: this.dropTables.size };
  }
}

// Create singleton instance
const dropTableService = new DropTableService();

module.exports = dropTableService;
