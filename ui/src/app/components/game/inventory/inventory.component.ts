import { Component, OnInit, HostListener, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { EquipmentService } from '../../../services/equipment.service';
import { VendorService } from '../../../services/vendor.service';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { ItemDetails } from '../../../models/inventory.model';
import { ItemModifiersComponent } from '../../shared/item-modifiers/item-modifiers.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ItemDetailsPanelComponent } from '../../shared/item-details-panel/item-details-panel.component';
import { ItemMiniComponent } from '../../shared/item-mini/item-mini.component';
import { isEquipmentItem, isConsumableItem } from '@shared/types';

// Interface for grouped items
interface ItemGroup {
  itemId: string;
  definition: ItemDetails['definition'];
  instances: ItemDetails[];
  totalQuantity: number;
  isExpanded: boolean;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemModifiersComponent, IconComponent, ItemDetailsPanelComponent, ItemMiniComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  private confirmDialog = inject(ConfirmDialogService);
  private equipmentService = inject(EquipmentService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  public vendorService = inject(VendorService); // Public for template access

  selectedItem: ItemDetails | null = null;
  selectedCategory: string = 'all';
  searchQuery: string = ''; // Search filter
  isAltKeyHeld: boolean = false; // Track Alt key state for visual feedback
  viewMode: 'list' | 'grouped' = 'list'; // Toggle between list and grouped view

  categories = [
    { value: 'all', label: 'All Items', shortLabel: 'All' },
    { value: 'resource', label: 'Resources', shortLabel: 'Resources' },
    { value: 'equipment', label: 'Equipment', shortLabel: 'Equipment' },
    { value: 'consumable', label: 'Consumables', shortLabel: 'Consumables' }
  ];

  // Floating gold gain notifications
  floatingGold = signal<Array<{ id: string; amount: number }>>([]);
  private lastGoldAmount = 0;

  // Watch for gold changes and trigger floating notification
  private goldWatcherEffect = effect(() => {
    const currentGold = this.inventoryService.gold();

    if (this.lastGoldAmount > 0 && currentGold > this.lastGoldAmount) {
      const goldGained = currentGold - this.lastGoldAmount;
      this.addFloatingGold(goldGained);
    }

    this.lastGoldAmount = currentGold;
  });

  constructor(
    public inventoryService: InventoryService
  ) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.altKey) {
      this.isAltKeyHeld = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (!event.altKey) {
      this.isAltKeyHeld = false;
    }
  }

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
    let items: ItemDetails[];

    // Filter by category
    if (this.selectedCategory === 'all') {
      items = this.inventoryService.getSortedInventory();
    } else {
      items = this.inventoryService.getSortedItemsByCategory(this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.definition?.name.toLowerCase().includes(query) ||
        item.itemId.toLowerCase().includes(query)
      );
    }

    return items;
  }

  /**
   * Toggle between list and grouped view modes
   */
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grouped' : 'list';
  }

  /**
   * Get grouped inventory items organized by item definition
   */
  getGroupedInventory(): ItemGroup[] {
    const filteredItems = this.getFilteredInventory();
    const groups = new Map<string, ItemGroup>();

    // Group items by itemId
    for (const item of filteredItems) {
      const itemId = item.itemId;

      if (!groups.has(itemId)) {
        groups.set(itemId, {
          itemId: itemId,
          definition: item.definition,
          instances: [],
          totalQuantity: 0,
          isExpanded: true // Default to expanded
        });
      }

      const group = groups.get(itemId)!;
      group.instances.push(item);
      group.totalQuantity += item.quantity;
    }

    // Convert map to array and sort by item name
    return Array.from(groups.values()).sort((a, b) =>
      a.definition.name.localeCompare(b.definition.name)
    );
  }

  /**
   * Toggle expansion state of a group
   */
  toggleGroup(group: ItemGroup): void {
    group.isExpanded = !group.isExpanded;
  }

  /**
   * Handle item click with Alt key support for quick actions
   * Alt+Click: Drop item (or sell to vendor if vendor is open)
   * Regular click: Open item details panel
   */
  onItemClick(event: MouseEvent, item: ItemDetails): void {
    // Alt+Click: Quick drop or quick sell
    if (event.altKey) {
      event.preventDefault();
      event.stopPropagation();

      // Check if vendor is open
      if (this.vendorService.isVendorOpen()) {
        this.quickSellItem(item);
      } else {
        this.quickDropItem(item);
      }
    } else {
      // Normal click: Select item to show details
      this.selectItem(item);
    }
  }

  /**
   * Handle item right-click (context menu) for quick actions
   * Right-click equipment: Equip/unequip
   * Right-click consumable: Use item
   */
  onItemRightClick(event: MouseEvent, item: ItemDetails): void {
    event.preventDefault();
    event.stopPropagation();

    // Don't trigger right-click actions if Alt key is held
    if (event.altKey) {
      return;
    }

    // Check item category and perform appropriate action
    if (isEquipmentItem(item.definition)) {
      // Equipment: Toggle equip/unequip
      if (item.equipped) {
        this.unequipItem(item.instanceId);
      } else {
        this.equipItem(item.instanceId);
      }
    } else if (isConsumableItem(item.definition)) {
      // Consumable: Use item
      this.useItem(item.instanceId);
    }
    // Note: Resources and other items don't have right-click actions
  }

  selectItem(item: ItemDetails): void {
    this.selectedItem = item;
  }

  closeItemDetails(): void {
    this.selectedItem = null;
  }

  /**
   * Quick drop item without confirmation (Alt+Click)
   * Drops one item from the stack
   */
  private quickDropItem(item: ItemDetails): void {
    const quantityToDrop = 1;

    this.inventoryService.removeItem({ instanceId: item.instanceId, quantity: quantityToDrop }).subscribe({
      next: () => {
        console.log(`Quick dropped 1x ${item.definition.name}`);
        // Close panel if this was the selected item and all were dropped
        if (this.selectedItem?.instanceId === item.instanceId && quantityToDrop >= item.quantity) {
          this.selectedItem = null;
        }
      },
      error: (error) => {
        console.error('Error quick dropping item:', error);
      }
    });
  }

  /**
   * Quick sell item to vendor without confirmation (Alt+Click)
   * Sells the entire stack
   */
  private quickSellItem(item: ItemDetails): void {
    const vendorId = this.vendorService.currentVendor()?.vendorId;
    const vendorName = this.vendorService.currentVendor()?.name || 'vendor';

    if (!vendorId) {
      console.error('No vendor open');
      return;
    }

    const quantityToSell = item.quantity; // Sell entire stack

    this.vendorService.sellItem(vendorId, item.instanceId, quantityToSell).subscribe({
      next: (response) => {
        const goldAmount = response.transaction?.totalPrice || 0;
        const pricePerItem = response.transaction?.pricePerItem || 0;

        // Send message to chat
        const message = `You sold ${quantityToSell}x ${item.definition.name} to ${vendorName} for ${goldAmount}g (${pricePerItem}g each)`;
        this.chatService.addLocalMessage({
          userId: 'system',
          username: 'System',
          message: message,
          createdAt: new Date()
        });

        // Update gold (triggers floating gold notification)
        if (response.gold !== undefined) {
          this.authService.updatePlayerGold(response.gold);
        }

        // Update inventory
        this.inventoryService.getInventory().subscribe();

        // Close panel if this was the selected item (all were sold)
        if (this.selectedItem?.instanceId === item.instanceId) {
          this.selectedItem = null;
        }
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Failed to sell item';
        this.chatService.addLocalMessage({
          userId: 'system',
          username: 'System',
          message: `❌ ${errorMsg}`,
          createdAt: new Date()
        });
        console.error('Error quick selling item:', error);
      }
    });
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

  /**
   * Get tooltip text for item based on its category
   */
  getItemTooltip(item: ItemDetails): string {
    const altAction = this.vendorService.isVendorOpen() ? 'sell' : 'drop';
    let rightClickAction = '';

    if (isEquipmentItem(item.definition)) {
      rightClickAction = item.equipped ? 'unequip' : 'equip';
    } else if (isConsumableItem(item.definition)) {
      rightClickAction = 'use';
    }

    if (rightClickAction) {
      return `Right-click to ${rightClickAction} | Alt+Click to ${altAction}`;
    } else {
      return `Alt+Click to ${altAction}`;
    }
  }

  getTotalWeight(): number {
    return this.inventoryService.inventory().reduce((total, item) => {
      return total + (item.definition.properties.weight * item.quantity);
    }, 0);
  }

  getWeightPercent(): number {
    const capacity = this.inventoryService.carryingCapacity();
    const current = this.inventoryService.currentWeight();
    return capacity > 0 ? (current / capacity) * 100 : 0;
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
    // Get item from inventory
    const item = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
    if (!item) {
      console.error('Item not found in inventory');
      return;
    }

    const slot = item.definition.slot;
    if (!slot) {
      console.error('Item has no slot defined');
      return;
    }

    this.inventoryService.equipItem(instanceId, slot).subscribe({
      next: () => {
        console.log('Item equipped');
        // Reload equipment service to update equipment display
        this.equipmentService.loadEquippedItems().subscribe();
        // Wait for inventory to reload, then update selected item if this was the selected item
        setTimeout(() => {
          const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
          if (updatedItem && this.selectedItem?.instanceId === instanceId) {
            this.selectedItem = updatedItem;
          }
        }, 100);
      },
      error: (error: Error) => {
        console.error('Error equipping item:', error);
      }
    });
  }

  /**
   * Unequip an item
   */
  unequipItem(instanceId: string): void {
    // Get item from inventory
    const item = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
    if (!item) {
      console.error('Item not found in inventory');
      return;
    }

    const slot = item.definition.slot;
    if (!slot) {
      console.error('Item has no slot defined');
      return;
    }

    this.inventoryService.unequipItem(slot).subscribe({
      next: () => {
        console.log('Item unequipped');
        // Reload equipment service to update equipment display
        this.equipmentService.loadEquippedItems().subscribe();
        // Wait for inventory to reload, then update selected item if this was the selected item
        setTimeout(() => {
          const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
          if (updatedItem && this.selectedItem?.instanceId === instanceId) {
            this.selectedItem = updatedItem;
          }
        }, 100);
      },
      error: (error: Error) => {
        console.error('Error unequipping item:', error);
      }
    });
  }

  /**
   * Use a consumable item
   */
  useItem(instanceId: string): void {
    this.inventoryService.useItem(instanceId).subscribe({
      next: (response: { message: string }) => {
        console.log('Item used successfully:', response);

        // Close the details panel if item quantity is now 0 and it was the selected item
        setTimeout(() => {
          const updatedItem = this.inventoryService.inventory().find(i => i.instanceId === instanceId);
          if (!updatedItem) {
            // Item was completely consumed - close details if it was selected
            if (this.selectedItem?.instanceId === instanceId) {
              this.closeItemDetails();
            }
          } else {
            // Update selected item with new quantity if it was selected
            if (this.selectedItem?.instanceId === instanceId) {
              this.selectedItem = updatedItem;
            }
          }
        }, 100);
      },
      error: (error: { error?: { message: string } }) => {
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

  /**
   * Add a floating gold gain notification
   */
  private addFloatingGold(amount: number): void {
    const id = `gold-${Date.now()}-${Math.random()}`;
    const floatingGoldNotification = { id, amount };

    // Add to signal
    this.floatingGold.update(notifications => [...notifications, floatingGoldNotification]);

    // Remove after animation completes (1000ms)
    setTimeout(() => {
      this.floatingGold.update(notifications => notifications.filter(n => n.id !== id));
    }, 1000);
  }
}
