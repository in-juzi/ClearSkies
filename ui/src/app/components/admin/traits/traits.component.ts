import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraitDefinition } from '@shared/types';
import { TraitRegistry } from '@be/data/items/traits/TraitRegistry';

@Component({
  selector: 'app-traits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss']
})
export class TraitsComponent {
  // All traits from registry
  allTraits: TraitDefinition[] = [];

  // Filtered traits for list display
  filteredTraits = signal<TraitDefinition[]>([]);

  // Selected trait for detail panel
  selectedTrait = signal<TraitDefinition | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterCategory = signal<'all' | 'resource' | 'equipment' | 'consumable'>('all');
  filterRarity = signal<'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('all');
  sortBy = signal<'name' | 'rarity' | 'maxLevel'>('name');

  // Utility for templates
  Object = Object;

  constructor() {
    this.loadTraits();
  }

  loadTraits(): void {
    this.allTraits = TraitRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allTraits];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(trait =>
        trait.name.toLowerCase().includes(search) ||
        trait.traitId.toLowerCase().includes(search) ||
        trait.description.toLowerCase().includes(search) ||
        trait.shorthand.toLowerCase().includes(search)
      );
    }

    // Category filter
    const category = this.filterCategory();
    if (category !== 'all') {
      filtered = filtered.filter(trait =>
        trait.applicableCategories.includes(category)
      );
    }

    // Rarity filter
    const rarity = this.filterRarity();
    if (rarity !== 'all') {
      filtered = filtered.filter(trait => trait.rarity === rarity);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return this.getRarityOrder(a.rarity) - this.getRarityOrder(b.rarity);
        case 'maxLevel':
          return b.maxLevel - a.maxLevel;
        default:
          return 0;
      }
    });

    this.filteredTraits.set(filtered);
  }

  selectTrait(trait: TraitDefinition): void {
    this.selectedTrait.set(trait);
  }

  getRarityOrder(rarity: string): number {
    const order: Record<string, number> = {
      'common': 1,
      'uncommon': 2,
      'rare': 3,
      'epic': 4,
      'legendary': 5
    };
    return order[rarity] || 0;
  }

  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      'common': '#9ca3af',
      'uncommon': '#22c55e',
      'rare': '#3b82f6',
      'epic': '#a855f7',
      'legendary': '#fbbf24'
    };
    return colors[rarity] || '#6b7280';
  }

  getLevelKeys(trait: TraitDefinition): string[] {
    return Object.keys(trait.levels).sort((a, b) => parseInt(a) - parseInt(b));
  }

  getLevelName(trait: TraitDefinition, level: string): string {
    return trait.levels[level]?.name || '';
  }

  getLevelDescription(trait: TraitDefinition, level: string): string {
    return trait.levels[level]?.description || '';
  }

  getLevelEffects(trait: TraitDefinition, level: string): any {
    return trait.levels[level]?.effects || {};
  }

  hasEffects(trait: TraitDefinition, level: string): boolean {
    const effects = this.getLevelEffects(trait, level);
    return Object.keys(effects).length > 0;
  }

  getEffectDisplay(effectKey: string, effectValue: any): string {
    // Handle nested effect objects
    if (typeof effectValue === 'object' && effectValue !== null) {
      const parts: string[] = [];
      for (const [key, value] of Object.entries(effectValue)) {
        if (typeof value === 'object') {
          // Nested objects like hotEffect
          for (const [nestedKey, nestedValue] of Object.entries(value as any)) {
            parts.push(`${nestedKey}: ${this.formatEffectValue(nestedValue)}`);
          }
        } else {
          parts.push(`${key}: ${this.formatEffectValue(value)}`);
        }
      }
      return parts.join(', ');
    }
    return this.formatEffectValue(effectValue);
  }

  formatEffectValue(value: any): string {
    if (typeof value === 'number') {
      if (value > 1 && value < 10) {
        return `${((value - 1) * 100).toFixed(0)}%`;
      }
      return value.toString();
    }
    return String(value);
  }

  hasContextualNames(trait: TraitDefinition): boolean {
    return !!trait.nameByCategory || !!trait.shorthandByCategory || !!trait.descriptionByCategory;
  }

  getContextualNames(trait: TraitDefinition): any {
    return trait.nameByCategory || {};
  }

  getContextualShorthands(trait: TraitDefinition): any {
    return trait.shorthandByCategory || {};
  }

  getContextualDescriptions(trait: TraitDefinition): any {
    return trait.descriptionByCategory || {};
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
