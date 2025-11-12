import { DropTable } from '../types';
import { DropTableRegistry } from '../data/locations/DropTableRegistry';

interface DropResult {
  itemId: string;
  quantity: number;
  qualities?: Record<string, number>;
  traits?: string[];
  qualityBonus?: Record<string, number>;
  qualityMultiplier?: number;
}

interface DropOptions {
  qualityMultiplier?: number;
  [key: string]: any;
}

class DropTableService {
  private dropTables: Map<string, DropTable> = new Map();
  private loaded: boolean = false;

  /**
   * Load all drop table definitions from DropTableRegistry
   */
  async loadAll(): Promise<void> {
    try {
      // Load from TypeScript registry instead of JSON files
      const allDropTables = DropTableRegistry.getAll();

      this.dropTables.clear();
      for (const dropTable of allDropTables) {
        this.dropTables.set(dropTable.dropTableId, dropTable);
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
  getDropTable(dropTableId: string): DropTable | undefined {
    return this.dropTables.get(dropTableId);
  }

  /**
   * Get all drop tables
   */
  getAllDropTables(): DropTable[] {
    return Array.from(this.dropTables.values());
  }

  /**
   * Roll on a drop table using weighted random selection
   * Supports nested drop tables (drop tables that reference other drop tables)
   */
  rollDropTable(dropTableId: string, options: DropOptions = {}, depth: number = 0): DropResult | null {
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
        if ((drop as any).dropNothing) {
          return null;
        }

        // Check if this is a nested drop table
        // Support explicit type: "dropTable" or implicit detection (has dropTableId but no itemId)
        const isNestedTable = (drop as any).type === 'dropTable' || ((drop as any).dropTableId && !drop.itemId);

        if (isNestedTable) {
          // Recursively roll on the nested drop table
          return this.rollDropTable((drop as any).dropTableId, options, depth + 1);
        }

        // Otherwise, this is a normal item drop
        // Calculate quantity (handle both number and QuantityRange)
        const quantity = typeof drop.quantity === 'number'
          ? drop.quantity
          : drop.quantity.min + Math.floor(Math.random() * (drop.quantity.max - drop.quantity.min + 1));

        // Build the drop result
        const result: DropResult = {
          itemId: drop.itemId,
          quantity,
          qualities: {},
          traits: []
        };

        // Apply quality bonuses if specified
        if (drop.qualityBonus) {
          result.qualityBonus = typeof drop.qualityBonus === 'number'
            ? { default: drop.qualityBonus }
            : drop.qualityBonus;
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
   */
  rollMultipleDropTables(dropTableIds: string[], options: DropOptions = {}): DropResult[] {
    const results: DropResult[] = [];

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
   */
  getDropTableStats(dropTableId: string): any {
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
        quantityRange: drop.quantity
          ? (typeof drop.quantity === 'number' ? drop.quantity.toString() : `${drop.quantity.min}-${drop.quantity.max}`)
          : 'N/A',
        comment: (drop as any).comment
      }))
    };

    return stats;
  }

  /**
   * Reload all drop tables (useful for hot-reloading during development)
   */
  async reload(): Promise<{ success: boolean; count: number }> {
    this.dropTables.clear();
    await this.loadAll();
    return { success: true, count: this.dropTables.size };
  }
}

// Create singleton instance
const dropTableService = new DropTableService();

export default dropTableService;
