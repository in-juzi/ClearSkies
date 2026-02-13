import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QualityDefinition } from '@shared/types';
import { QualityRegistry } from '@be/data/items/qualities/QualityRegistry';

@Component({
  selector: 'app-qualities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qualities.component.html',
  styleUrls: ['./qualities.component.scss']
})
export class QualitiesComponent {
  // All qualities from registry
  allQualities: QualityDefinition[] = [];

  // Filtered qualities for list display
  filteredQualities = signal<QualityDefinition[]>([]);

  // Selected quality for detail panel
  selectedQuality = signal<QualityDefinition | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterCategory = signal<'all' | 'resource' | 'crafted' | 'equipment' | 'consumable'>('all');
  sortBy = signal<'name' | 'maxLevel' | 'qualityId'>('name');

  // Utility for templates
  Object = Object;

  constructor() {
    this.loadQualities();
  }

  loadQualities(): void {
    this.allQualities = QualityRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allQualities];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(quality =>
        quality.name.toLowerCase().includes(search) ||
        quality.qualityId.toLowerCase().includes(search) ||
        quality.description.toLowerCase().includes(search) ||
        quality.shorthand.toLowerCase().includes(search)
      );
    }

    // Category filter
    const category = this.filterCategory();
    if (category !== 'all') {
      filtered = filtered.filter(quality =>
        quality.applicableCategories.includes(category)
      );
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'maxLevel':
          return b.maxLevel - a.maxLevel;
        case 'qualityId':
          return a.qualityId.localeCompare(b.qualityId);
        default:
          return 0;
      }
    });

    this.filteredQualities.set(filtered);
  }

  selectQuality(quality: QualityDefinition): void {
    this.selectedQuality.set(quality);
  }

  getLevelKeys(quality: QualityDefinition): string[] {
    return Object.keys(quality.levels).sort((a, b) => parseInt(a) - parseInt(b));
  }

  getLevelName(quality: QualityDefinition, level: string): string {
    return quality.levels[level]?.name || '';
  }

  getLevelDescription(quality: QualityDefinition, level: string): string {
    return quality.levels[level]?.description || '';
  }

  getLevelEffects(quality: QualityDefinition, level: string): any {
    return quality.levels[level]?.effects || {};
  }

  hasEffects(quality: QualityDefinition, level: string): boolean {
    const effects = this.getLevelEffects(quality, level);
    return Object.keys(effects).length > 0;
  }

  getEffectDisplay(effectKey: string, effectValue: any): string {
    // Handle nested effect objects
    if (typeof effectValue === 'object' && effectValue !== null) {
      const parts: string[] = [];
      for (const [key, value] of Object.entries(effectValue)) {
        parts.push(`${key}: ${this.formatEffectValue(value)}`);
      }
      return parts.join(', ');
    }
    return this.formatEffectValue(effectValue);
  }

  formatEffectValue(value: any): string {
    if (typeof value === 'number') {
      if (value > 1) {
        return `${((value - 1) * 100).toFixed(0)}%`;
      } else if (value < 1) {
        return `${(value * 100).toFixed(0)}%`;
      }
      return value.toString();
    }
    return String(value);
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
