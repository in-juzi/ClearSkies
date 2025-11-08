import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';
import { ItemDetails } from '../../../models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  selectedItem: ItemDetails | null = null;
  selectedCategory: string = 'all';

  categories = [
    { value: 'all', label: 'All Items' },
    { value: 'resource', label: 'Resources' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'consumable', label: 'Consumables' }
  ];

  constructor(public inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (response) => {
        console.log('Inventory loaded:', response);
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
      }
    });
  }

  getFilteredInventory(): ItemDetails[] {
    if (this.selectedCategory === 'all') {
      return this.inventoryService.inventory();
    }
    return this.inventoryService.getItemsByCategory(this.selectedCategory);
  }

  selectItem(item: ItemDetails): void {
    this.selectedItem = item;
  }

  closeItemDetails(): void {
    this.selectedItem = null;
  }

  getRarityClass(rarity: string): string {
    const rarityClasses: { [key: string]: string } = {
      common: 'border-gray-500',
      uncommon: 'border-green-500',
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      legendary: 'border-orange-500'
    };
    return rarityClasses[rarity] || 'border-gray-500';
  }

  getTotalWeight(): number {
    return this.inventoryService.inventory().reduce((total, item) => {
      return total + (item.definition.properties.weight * item.quantity);
    }, 0);
  }

  // Dev helper: Add test item with random qualities
  addTestItem(itemId: string): void {
    this.inventoryService.addRandomItem(itemId, 1).subscribe({
      next: (response) => {
        console.log('Test item added:', response);
      },
      error: (error) => {
        console.error('Error adding test item:', error);
      }
    });
  }

  removeItem(instanceId: string, quantity?: number): void {
    if (confirm(`Are you sure you want to remove this item?`)) {
      this.inventoryService.removeItem({ instanceId, quantity }).subscribe({
        next: () => {
          console.log('Item removed');
          this.selectedItem = null;
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
    }
  }

  getQualityKeys(qualities: any): string[] {
    if (!qualities) return [];
    return Object.keys(qualities);
  }
}
