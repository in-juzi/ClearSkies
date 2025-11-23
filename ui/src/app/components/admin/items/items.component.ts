import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '@shared/types';
import { ItemDataService } from '../../../services/item-data.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  // All items from registry
  allItems: Item[] = [];

  // Filtered items for list display
  filteredItems = signal<Item[]>([]);

  // Selected item for detail panel
  selectedItem = signal<Item | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  selectedCategory = signal<string>('all');
  selectedSubcategory = signal<string>('all');
  selectedRarity = signal<string>('all');
  sortBy = signal<'name' | 'category' | 'rarity' | 'tier'>('name');

  // Edit mode (disabled for now)
  editMode = signal(false);

  constructor(private itemDataService: ItemDataService) {
    this.loadItems();
  }

  loadItems(): void {
    this.allItems = this.itemDataService.getAllItems();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allItems];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.itemId.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory());
    }

    // Subcategory filter
    if (this.selectedSubcategory() !== 'all') {
      filtered = filtered.filter(item => item.subcategories?.includes(this.selectedSubcategory()));
    }

    // Rarity filter
    if (this.selectedRarity() !== 'all') {
      filtered = filtered.filter(item => item.rarity === this.selectedRarity());
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        case 'tier':
          const aTier = (a as any).properties?.tier || 0;
          const bTier = (b as any).properties?.tier || 0;
          return aTier - bTier;
        default:
          return 0;
      }
    });

    this.filteredItems.set(filtered);
  }

  selectItem(item: Item): void {
    this.selectedItem.set(item);
  }

  getCategories(): string[] {
    const categories = new Set(this.allItems.map(item => item.category));
    return ['all', ...Array.from(categories).sort()];
  }

  getSubcategories(): string[] {
    const subcategories = new Set(
      this.allItems.flatMap(item => item.subcategories || [])
    );
    return ['all', ...Array.from(subcategories).sort()];
  }

  getRarities(): string[] {
    return ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
  }

  // Helper method to get weight property (some items have it, some don't)
  getWeight(item: Item): number | undefined {
    return (item as any).weight;
  }

  // Stub methods for future editing functionality
  toggleEditMode(): void {
    // TODO: Implement edit mode
    console.log('Edit mode not yet implemented');
  }

  saveChanges(): void {
    // TODO: Implement save functionality
    console.log('Save functionality not yet implemented');
  }

  cancelEdit(): void {
    this.editMode.set(false);
    // TODO: Revert changes
  }
}
