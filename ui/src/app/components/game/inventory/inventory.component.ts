import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { EquipmentService } from '../../../services/equipment.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { ItemDetails } from '../../../models/inventory.model';
import { ItemModifiersComponent } from '../../shared/item-modifiers/item-modifiers.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ItemDetailsPanelComponent } from '../../shared/item-details-panel/item-details-panel.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemModifiersComponent, IconComponent, ItemDetailsPanelComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private confirmDialog = inject(ConfirmDialogService);
  private equipmentService = inject(EquipmentService);

  selectedItem: ItemDetails | null = null;
  selectedCategory: string = 'all';

  categories = [
    { value: 'all', label: 'All Items', shortLabel: 'All' },
    { value: 'resource', label: 'Resources', shortLabel: 'Resources' },
    { value: 'equipment', label: 'Equipment', shortLabel: 'Equipment' },
    { value: 'consumable', label: 'Consumables', shortLabel: 'Consumables' }
  ];

  constructor(
    public inventoryService: InventoryService
  ) {}

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
      return this.inventoryService.getSortedInventory();
    }
    return this.inventoryService.getSortedItemsByCategory(this.selectedCategory);
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

  async removeItem(instanceId: string, quantity?: number): Promise<void> {
    const quantityToRemove = quantity || 1;
    const itemName = this.selectedItem?.definition.name || 'this item';

    const confirmed = await this.confirmDialog.confirm({
      title: 'Drop Item',
      message: `Are you sure you want to drop ${quantityToRemove}x ${itemName}?`,
      confirmLabel: 'Drop',
      cancelLabel: 'Keep'
    });

    if (!confirmed) {
      return;
    }

    this.inventoryService.removeItem({ instanceId, quantity: quantityToRemove }).subscribe({
      next: () => {
        console.log('Item removed');
        // Close panel if all items were dropped
        if (this.selectedItem && quantityToRemove >= this.selectedItem.quantity) {
          this.selectedItem = null;
        } else {
          // Partial drop - update selected item with new quantity
          setTimeout(() => {
            const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
            if (updatedItem) {
              this.selectedItem = updatedItem;
            } else {
              // Item no longer exists (all were dropped)
              this.selectedItem = null;
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  async removeAllItems(instanceId: string): Promise<void> {
    const itemName = this.selectedItem?.definition.name || 'this item';
    const quantity = this.selectedItem?.quantity || 0;

    const confirmed = await this.confirmDialog.confirm({
      title: 'Drop All',
      message: `Are you sure you want to drop all ${quantity}x ${itemName}?`,
      confirmLabel: 'Drop All',
      cancelLabel: 'Keep'
    });

    if (!confirmed) {
      return;
    }

    this.inventoryService.removeItem({ instanceId }).subscribe({
      next: () => {
        console.log('All items removed');
        this.selectedItem = null;
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  /**
   * Equip an item
   */
  equipItem(instanceId: string): void {
    if (!this.selectedItem) return;

    const slot = this.selectedItem.definition.slot;
    if (!slot) {
      console.error('Item has no slot defined');
      return;
    }

    this.inventoryService.equipItem(instanceId, slot).subscribe({
      next: () => {
        console.log('Item equipped');
        // Reload equipment service to update equipment display
        this.equipmentService.loadEquippedItems().subscribe();
        // Wait for inventory to reload, then update selected item
        setTimeout(() => {
          const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
          if (updatedItem) {
            this.selectedItem = updatedItem;
          }
        }, 100);
      },
      error: (error: any) => {
        console.error('Error equipping item:', error);
      }
    });
  }

  /**
   * Unequip an item
   */
  unequipItem(instanceId: string): void {
    if (!this.selectedItem) return;

    const slot = this.selectedItem.definition.slot;
    if (!slot) {
      console.error('Item has no slot defined');
      return;
    }

    this.inventoryService.unequipItem(slot).subscribe({
      next: () => {
        console.log('Item unequipped');
        // Reload equipment service to update equipment display
        this.equipmentService.loadEquippedItems().subscribe();
        // Wait for inventory to reload, then update selected item
        setTimeout(() => {
          const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
          if (updatedItem) {
            this.selectedItem = updatedItem;
          }
        }, 100);
      },
      error: (error: any) => {
        console.error('Error unequipping item:', error);
      }
    });
  }

  /**
   * Use a consumable item
   */
  useItem(instanceId: string): void {
    if (!this.selectedItem) return;

    this.inventoryService.useItem(instanceId).subscribe({
      next: (response: any) => {
        console.log('Item used successfully:', response);

        // Close the details panel if item quantity is now 0
        setTimeout(() => {
          const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
          if (!updatedItem) {
            // Item was completely consumed
            this.closeItemDetails();
          } else {
            // Update selected item with new quantity
            this.selectedItem = updatedItem;
          }
        }, 100);
      },
      error: (error: any) => {
        console.error('Error using item:', error);
        // Optionally show error message to user
        alert(error.error?.message || 'Failed to use item');
      }
    });
  }

  // Item drag-and-drop handlers for equipment and vendor selling
  onItemDragStart(event: DragEvent, item: ItemDetails): void {
    // Allow all items to be dragged (for equipment slots or vendor selling)
    // Set the drag data as JSON
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('application/json', JSON.stringify(item));

    // Add visual feedback
    const target = event.target as HTMLElement;
    target.classList.add('dragging-item');
  }

  onItemDragEnd(event: DragEvent): void {
    // Remove visual feedback
    const target = event.target as HTMLElement;
    target.classList.remove('dragging-item');
  }

  // Dev helper: Drop all items in inventory
  async dropAllItems(): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Drop All Items',
      message: 'Are you sure you want to drop ALL items in your inventory? This cannot be undone!',
      confirmLabel: 'Drop All',
      cancelLabel: 'Cancel'
    });

    if (!confirmed) {
      return;
    }


    const items = this.inventoryService.inventory();
    if (items.length === 0) {
      console.log('No items to drop');
      return;
    }

    // Remove all items sequentially to avoid race conditions
    console.log(`Dropping ${items.length} items...`);
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        await this.inventoryService.removeItem({ instanceId: item.instanceId }).toPromise();
        successCount++;
      } catch (error) {
        console.error(`Error dropping item ${item.instanceId}:`, error);
        errorCount++;
      }
    }

    console.log(`Dropped ${successCount} items successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
    this.selectedItem = null;
  }
}
