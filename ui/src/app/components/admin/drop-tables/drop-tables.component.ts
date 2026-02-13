import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropTable } from '@shared/types';
import { DropTableRegistry } from '@be/data/locations/DropTableRegistry';

@Component({
  selector: 'app-drop-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drop-tables.component.html',
  styleUrls: ['./drop-tables.component.scss']
})
export class DropTablesComponent {
  // All drop tables from registry
  allDropTables: DropTable[] = [];

  // Filtered drop tables for list display
  filteredDropTables = signal<DropTable[]>([]);

  // Selected drop table for detail panel
  selectedDropTable = signal<DropTable | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterType = signal<'all' | 'combat' | 'gathering' | 'fishing' | 'woodcutting' | 'mining' | 'rare'>('all');
  sortBy = signal<'name' | 'dropCount' | 'totalWeight'>('name');

  constructor() {
    this.loadDropTables();
  }

  loadDropTables(): void {
    this.allDropTables = DropTableRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allDropTables];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(table =>
        table.name.toLowerCase().includes(search) ||
        table.dropTableId.toLowerCase().includes(search) ||
        (table.description && table.description.toLowerCase().includes(search))
      );
    }

    // Type filter (based on ID prefix)
    const type = this.filterType();
    if (type !== 'all') {
      filtered = filtered.filter(table => {
        const id = table.dropTableId.toLowerCase();
        switch (type) {
          case 'combat':
            return id.startsWith('combat-');
          case 'gathering':
            return id.startsWith('gathering-');
          case 'fishing':
            return id.startsWith('fishing-');
          case 'woodcutting':
            return id.startsWith('woodcutting-');
          case 'mining':
            return id.startsWith('mining-');
          case 'rare':
            return id.startsWith('rare-');
          default:
            return true;
        }
      });
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dropCount':
          return b.drops.length - a.drops.length;
        case 'totalWeight':
          return this.getTotalWeight(b) - this.getTotalWeight(a);
        default:
          return 0;
      }
    });

    this.filteredDropTables.set(filtered);
  }

  selectDropTable(table: DropTable): void {
    this.selectedDropTable.set(table);
  }

  getTotalWeight(table: DropTable): number {
    return table.drops.reduce((sum, drop) => sum + drop.weight, 0);
  }

  getDropProbability(table: DropTable, dropWeight: number): number {
    const total = this.getTotalWeight(table);
    return total > 0 ? (dropWeight / total) * 100 : 0;
  }

  getTypeFromId(dropTableId: string): string {
    const id = dropTableId.toLowerCase();
    if (id.startsWith('combat-')) return 'Combat';
    if (id.startsWith('gathering-')) return 'Gathering';
    if (id.startsWith('fishing-')) return 'Fishing';
    if (id.startsWith('woodcutting-')) return 'Woodcutting';
    if (id.startsWith('mining-')) return 'Mining';
    if (id.startsWith('rare-')) return 'Rare';
    if (id.startsWith('sawmill-')) return 'Crafting';
    return 'Unknown';
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Combat': '#ef4444', // red
      'Gathering': '#10b981', // green
      'Fishing': '#3b82f6', // blue
      'Woodcutting': '#f59e0b', // amber
      'Mining': '#8b5cf6', // purple
      'Rare': '#ec4899', // pink
      'Crafting': '#06b6d4', // cyan
      'Unknown': '#6b7280' // gray
    };
    return colors[type] || '#6b7280';
  }

  isNestedDropTable(drop: any): boolean {
    return drop.type === 'dropTable';
  }

  getQualityBonusValue(drop: any, quality: string): number {
    return drop.qualityBonus?.[quality] || 0;
  }

  getQuantityRange(drop: any): { min: number; max: number } {
    if (typeof drop.quantity === 'object' && drop.quantity !== null) {
      return { min: drop.quantity.min || 0, max: drop.quantity.max || 0 };
    }
    return { min: drop.quantity || 0, max: drop.quantity || 0 };
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Utility for templates
  Object = Object;
}
