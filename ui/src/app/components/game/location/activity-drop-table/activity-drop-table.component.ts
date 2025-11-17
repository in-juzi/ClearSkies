import { Component, input, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../../../models/location.model';
import { DropTable, Item } from '@shared/types';
import { LocationService } from '../../../../services/location.service';
import { ItemMiniComponent } from '../../../shared/item-mini/item-mini.component';

interface EnrichedDropEntry {
  itemId?: string;
  itemDef?: Item | null;
  weight: number;
  dropChance: number;
  quantityRange: string;
  qualityBonus?: any;
  possibleQualities: string[];
  possibleTraits: string[];
  comment?: string;
  dropNothing?: boolean;
}

interface ProcessedDropTable {
  dropTableId: string;
  name: string;
  description: string;
  entries: EnrichedDropEntry[];
}

@Component({
  selector: 'app-activity-drop-table',
  standalone: true,
  imports: [CommonModule, ItemMiniComponent],
  templateUrl: './activity-drop-table.component.html',
  styleUrl: './activity-drop-table.component.scss'
})
export class ActivityDropTableComponent implements OnInit {
  private locationService = inject(LocationService);

  // Input
  activity = input.required<Activity>();

  // State
  dropTables = signal<ProcessedDropTable[]>([]);
  selectedTableIndex = signal<number>(0);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Computed
  selectedDropTable = computed(() => {
    const tables = this.dropTables();
    const index = this.selectedTableIndex();
    return tables[index] || null;
  });

  hasMultipleTables = computed(() => this.dropTables().length > 1);

  ngOnInit(): void {
    this.loadDropTables();
  }

  /**
   * Load all drop tables for the activity
   */
  private async loadDropTables(): Promise<void> {
    const dropTableIds = this.activity().rewards?.dropTables;

    if (!dropTableIds || dropTableIds.length === 0) {
      this.loading.set(false);
      return;
    }

    try {
      const tables: ProcessedDropTable[] = [];

      for (const dropTableId of dropTableIds) {
        const response = await this.locationService.getDropTable(dropTableId).toPromise();

        if (response?.dropTable) {
          const processed = this.processDropTable(response.dropTable);
          tables.push(processed);
        }
      }

      this.dropTables.set(tables);
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading drop tables:', err);
      this.error.set('Failed to load drop table information');
      this.loading.set(false);
    }
  }

  /**
   * Process drop table with probability calculations
   */
  private processDropTable(dropTable: DropTable & { enrichedDrops: any[] }): ProcessedDropTable {
    // Calculate total weight
    const totalWeight = dropTable.drops.reduce((sum, drop) => sum + drop.weight, 0);

    // Process each entry
    const entries: EnrichedDropEntry[] = dropTable.enrichedDrops.map((drop, index) => {
      const dropChance = (drop.weight / totalWeight) * 100;

      // Format quantity range
      let quantityRange = '1';
      if (drop.quantity) {
        if (typeof drop.quantity === 'object' && 'min' in drop.quantity && 'max' in drop.quantity) {
          quantityRange = drop.quantity.min === drop.quantity.max
            ? `${drop.quantity.min}`
            : `${drop.quantity.min}-${drop.quantity.max}`;
        } else if (typeof drop.quantity === 'number') {
          quantityRange = `${drop.quantity}`;
        }
      }

      // Get possible qualities and traits from item definition
      const possibleQualities = drop.itemDef?.allowedQualities || [];
      const possibleTraits = drop.itemDef?.allowedTraits || [];

      return {
        itemId: drop.itemId,
        itemDef: drop.itemDef,
        weight: drop.weight,
        dropChance,
        quantityRange,
        qualityBonus: drop.qualityBonus,
        possibleQualities,
        possibleTraits,
        comment: drop.comment,
        dropNothing: drop.dropNothing
      };
    });

    return {
      dropTableId: dropTable.dropTableId,
      name: dropTable.name,
      description: dropTable.description,
      entries
    };
  }

  /**
   * Select a drop table by index
   */
  selectTable(index: number): void {
    this.selectedTableIndex.set(index);
  }

  /**
   * Get color class for drop chance percentage
   */
  getDropChanceColor(chance: number): string {
    if (chance >= 50) return 'very-common';
    if (chance >= 20) return 'common';
    if (chance >= 5) return 'uncommon';
    if (chance >= 1) return 'rare';
    return 'very-rare';
  }

  /**
   * Format drop chance percentage
   */
  formatDropChance(chance: number): string {
    return chance >= 1 ? chance.toFixed(1) : chance.toFixed(2);
  }
}
