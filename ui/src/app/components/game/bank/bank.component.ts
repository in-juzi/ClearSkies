import { Component, OnInit, OnDestroy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { InventoryService } from '../../../services/inventory.service';
import { ItemFilterService } from '../../../services/item-filter.service';
import { QuantityDialogService } from '../../../services/quantity-dialog.service';
import { ItemDetails } from '../../../models/inventory.model';
import { ItemMiniComponent } from '../../shared/item-mini/item-mini.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemMiniComponent, IconComponent],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss'
})
export class BankComponent implements OnInit, OnDestroy {
  public storageService = inject(StorageService);
  public inventoryService = inject(InventoryService);
  private itemFilterService = inject(ItemFilterService);
  private quantityDialogService = inject(QuantityDialogService);

  // Bank container ID (could be made dynamic for multi-container support)
  private readonly BANK_CONTAINER_ID = 'bank';

  // Bank filters (signals for reactivity)
  selectedBankCategory = signal<string>('all');
  bankSearchQuery = signal<string>('');

  // Inventory filters (signals for reactivity)
  selectedInventoryCategory = signal<string>('all');
  inventorySearchQuery = signal<string>('');

  storingStacks = signal<boolean>(false);

  // Drag functionality
  isDragging: boolean = false;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;
  currentX: number = 0;
  currentY: number = 0;

  categories = [
    { value: 'all', label: 'All Items' },
    { value: 'resource', label: 'Resources' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'consumable', label: 'Consumables' }
  ];

  // Computed filtered bank items
  filteredBankItems = computed(() => {
    return this.itemFilterService.applyFilters(
      this.storageService.containerItems(),
      {
        category: this.selectedBankCategory(),
        searchQuery: this.bankSearchQuery()
      }
    );
  });

  // Computed filtered inventory items
  filteredInventoryItems = computed(() => {
    return this.itemFilterService.applyFilters(
      this.inventoryService.inventory(),
      {
        category: this.selectedInventoryCategory(),
        searchQuery: this.inventorySearchQuery()
      }
    );
  });

  // Capacity percentage for progress bar
  capacityPercentage = computed(() => {
    const used = this.storageService.containerUsedSlots();
    const total = this.storageService.containerCapacity();
    return total > 0 ? (used / total) * 100 : 0;
  });

  // Color class for capacity bar
  capacityColorClass = computed(() => {
    const percentage = this.capacityPercentage();
    if (percentage >= 95) return 'capacity-critical';
    if (percentage >= 80) return 'capacity-warning';
    return 'capacity-normal';
  });

  ngOnInit(): void {
    // Items are loaded when bank is opened via storageService.openStorage()
  }

  ngOnDestroy(): void {
    // Clean up: leave storage room when component is destroyed
    if (this.storageService.currentContainerId()) {
      this.storageService.closeStorage();
    }
  }

  /**
   * Close the bank modal
   */
  close(): void {
    this.storageService.closeStorage();
  }

  /**
   * Handle item drag start from inventory
   */
  onInventoryItemDragStart(event: DragEvent, item: ItemDetails): void {
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('application/json', JSON.stringify({
      source: 'inventory',
      item: item
    }));
  }

  /**
   * Handle item drag start from bank
   */
  onBankItemDragStart(event: DragEvent, item: ItemDetails): void {
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('application/json', JSON.stringify({
      source: 'bank',
      item: item
    }));
  }

  /**
   * Handle drop on bank area (deposit from inventory)
   */
  onBankDrop(event: DragEvent): void {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer!.getData('application/json'));

    if (data.source === 'inventory') {
      this.depositItem(data.item);
    }
  }

  /**
   * Handle drop on inventory area (withdraw from bank)
   */
  onInventoryDrop(event: DragEvent): void {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer!.getData('application/json'));

    if (data.source === 'bank') {
      this.withdrawItem(data.item);
    }
  }

  /**
   * Allow drop events
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  /**
   * Deposit item to bank
   */
  async depositItem(item: ItemDetails, showDialog: boolean = false): Promise<void> {
    let quantity: number | null = null;

    // Show quantity dialog for stacks > 1 if requested
    if (showDialog && item.quantity > 1) {
      quantity = await this.quantityDialogService.open({
        itemName: item.definition.name,
        itemIcon: item.definition.icon,
        maxQuantity: item.quantity,
        actionLabel: 'Deposit'
      });

      // User cancelled
      if (quantity === null) {
        return;
      }
    }

    this.storageService.depositItem(this.BANK_CONTAINER_ID, item.instanceId, quantity);
    // Refresh inventory to reflect changes (WebSocket will update storage automatically)
    this.inventoryService.getInventory().subscribe();
  }

  /**
   * Withdraw item from bank
   */
  async withdrawItem(item: ItemDetails, showDialog: boolean = false): Promise<void> {
    let quantity: number | null = null;

    // Show quantity dialog for stacks > 1 if requested
    if (showDialog && item.quantity > 1) {
      quantity = await this.quantityDialogService.open({
        itemName: item.definition.name,
        itemIcon: item.definition.icon,
        maxQuantity: item.quantity,
        actionLabel: 'Withdraw'
      });

      // User cancelled
      if (quantity === null) {
        return;
      }
    }

    this.storageService.withdrawItem(this.BANK_CONTAINER_ID, item.instanceId, quantity);
    // Refresh inventory to reflect changes (WebSocket will update storage automatically)
    this.inventoryService.getInventory().subscribe();
  }

  /**
   * Double-click item in bank to withdraw
   */
  onBankItemDoubleClick(event: MouseEvent, item: ItemDetails): void {
    this.withdrawItem(item, event.shiftKey);
  }

  /**
   * Double-click item in inventory to deposit
   */
  onInventoryItemDoubleClick(event: MouseEvent, item: ItemDetails): void {
    this.depositItem(item, event.shiftKey);
  }

  /**
   * Right-click item in bank to withdraw
   */
  onBankItemRightClick(event: MouseEvent, item: ItemDetails): void {
    event.preventDefault();
    this.withdrawItem(item, event.shiftKey);
  }

  /**
   * Right-click item in inventory to deposit
   */
  onInventoryItemRightClick(event: MouseEvent, item: ItemDetails): void {
    event.preventDefault();
    // Don't deposit equipped items
    if (item.equipped) {
      alert('Cannot deposit equipped items. Unequip the item first.');
      return;
    }
    this.depositItem(item, event.shiftKey);
  }

  /**
   * Store all stackable items that already exist in the bank
   * Now uses bulk deposit via WebSocket instead of multiple HTTP requests
   */
  storeStacks(): void {
    if (this.storingStacks()) return;

    this.storingStacks.set(true);

    // Get all inventory items (not equipped)
    const inventoryItems = this.inventoryService.inventory().filter(item => !item.equipped);

    // Get all bank items
    const bankItems = this.storageService.containerItems();

    // Find items in inventory that can stack with items in bank
    const itemsToDeposit: Array<{ instanceId: string; quantity: null }> = [];

    for (const invItem of inventoryItems) {
      // Check if this item matches any bank item (same itemId, qualities, traits)
      const matchingBankItem = bankItems.find(bankItem =>
        this.canStack(invItem, bankItem)
      );

      if (matchingBankItem) {
        itemsToDeposit.push({
          instanceId: invItem.instanceId,
          quantity: null
        });
      }
    }

    // If no items to deposit, show message
    if (itemsToDeposit.length === 0) {
      this.storingStacks.set(false);
      alert('No stackable items found that already exist in the bank.');
      return;
    }

    // Use bulk deposit via WebSocket (single request instead of N requests!)
    this.storageService.bulkDeposit(this.BANK_CONTAINER_ID, itemsToDeposit);

    // Refresh inventory after bulk deposit
    // Note: We wait a bit for the WebSocket events to process
    setTimeout(() => {
      this.inventoryService.getInventory().subscribe(() => {
        this.storingStacks.set(false);
      });
    }, 500);
  }

  /**
   * Check if two items can stack together
   * Items stack if: same itemId, same quality levels, same trait levels
   */
  private canStack(item1: ItemDetails, item2: ItemDetails): boolean {
    // Must be same itemId
    if (item1.itemId !== item2.itemId) {
      return false;
    }

    // Compare qualities (both must have same quality types and levels)
    const qualities1 = item1.qualities || {};
    const qualities2 = item2.qualities || {};

    const qualityKeys1 = Object.keys(qualities1).sort();
    const qualityKeys2 = Object.keys(qualities2).sort();

    if (qualityKeys1.length !== qualityKeys2.length) {
      return false;
    }

    for (let i = 0; i < qualityKeys1.length; i++) {
      if (qualityKeys1[i] !== qualityKeys2[i] ||
          qualities1[qualityKeys1[i]] !== qualities2[qualityKeys2[i]]) {
        return false;
      }
    }

    // Compare traits (both must have same trait types and levels)
    const traits1 = item1.traits || {};
    const traits2 = item2.traits || {};

    const traitKeys1 = Object.keys(traits1).sort();
    const traitKeys2 = Object.keys(traits2).sort();

    if (traitKeys1.length !== traitKeys2.length) {
      return false;
    }

    for (let i = 0; i < traitKeys1.length; i++) {
      if (traitKeys1[i] !== traitKeys2[i] ||
          traits1[traitKeys1[i]] !== traits2[traitKeys2[i]]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Start dragging the modal
   */
  onDragStart(event: MouseEvent): void {
    this.isDragging = true;
    const modal = (event.target as HTMLElement).closest('.bank-modal') as HTMLElement;
    if (modal) {
      const rect = modal.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      this.currentX = rect.left;
      this.currentY = rect.top;
    }
  }

  /**
   * Handle dragging movement
   */
  onDrag(event: MouseEvent): void {
    if (this.isDragging) {
      event.preventDefault();
      this.currentX = event.clientX - this.dragOffsetX;
      this.currentY = event.clientY - this.dragOffsetY;
    }
  }

  /**
   * Stop dragging the modal
   */
  onDragEnd(): void {
    this.isDragging = false;
  }

  /**
   * Get the transform style for the modal position
   */
  getModalStyle(): any {
    if (this.isDragging || (this.currentX !== 0 || this.currentY !== 0)) {
      return {
        transform: 'none',
        left: `${this.currentX}px`,
        top: `${this.currentY}px`
      };
    }
    return {};
  }
}
