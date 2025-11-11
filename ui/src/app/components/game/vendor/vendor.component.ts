import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../services/vendor.service';
import { InventoryService } from '../../../services/inventory.service';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';
import { VendorStockItem } from '../../../models/vendor.model';
import { ItemModifiersComponent } from '../../shared/item-modifiers/item-modifiers.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, IconComponent],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  vendorService = inject(VendorService);
  inventoryService = inject(InventoryService);
  authService = inject(AuthService);
  chatService = inject(ChatService);

  // Expose Object for template use
  Object = Object;

  // Signals
  activeTab = signal<'buy' | 'sell'>('buy');
  selectedBuyItem = signal<VendorStockItem | null>(null);
  buyQuantity = signal<number>(1);
  isDragOver = signal<boolean>(false);

  // Computed signals
  vendor = this.vendorService.currentVendor;
  inventory = this.inventoryService.inventory;
  playerGold = computed(() => this.inventoryService.gold());

  /**
   * Switch between buy and sell tabs
   */
  setTab(tab: 'buy' | 'sell'): void {
    this.activeTab.set(tab);
  }

  /**
   * Select an item to buy
   */
  selectBuyItem(item: VendorStockItem): void {
    this.selectedBuyItem.set(item);
    this.buyQuantity.set(1);
  }

  /**
   * Buy an item from vendor
   */
  buyItem(itemId: string, quantity: number): void {
    const vendor = this.vendor();
    if (!vendor) return;

    this.vendorService.buyItem(vendor.vendorId, itemId, quantity).subscribe({
      next: (response) => {
        this.showMessage(response.message, 'success');
        // Update inventory and gold
        if (response.inventory) {
          this.inventoryService.setInventory(response.inventory);
        }
        if (response.gold !== undefined) {
          this.authService.updatePlayerGold(response.gold);
        }
        this.selectedBuyItem.set(null);
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Failed to purchase item';
        this.showMessage(errorMsg, 'error');
      }
    });
  }

  /**
   * Sell an item to vendor
   */
  sellItem(instanceId: string, quantity: number): void {
    const vendor = this.vendor();
    if (!vendor) return;

    this.vendorService.sellItem(vendor.vendorId, instanceId, quantity).subscribe({
      next: (response) => {
        this.showMessage(response.message, 'success');
        // Update inventory and gold
        if (response.inventory) {
          this.inventoryService.setInventory(response.inventory);
        }
        if (response.gold !== undefined) {
          this.authService.updatePlayerGold(response.gold);
        }
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Failed to sell item';
        this.showMessage(errorMsg, 'error');
      }
    });
  }

  /**
   * Calculate sell price for an item (50% of vendor price)
   */
  calculateSellPrice(item: any): number {
    // Use vendorPrice from ItemDetails (already calculated with quality/trait bonuses)
    // Vendors buy items at 50% of their vendor price
    return Math.floor((item.vendorPrice || 0) * 0.5);
  }

  /**
   * Close vendor interface
   */
  closeVendor(): void {
    this.vendorService.closeVendor();
  }

  /**
   * Show message to user via chat
   */
  private showMessage(text: string, type: 'success' | 'error'): void {
    const prefix = type === 'error' ? '❌ ' : '✅ ';
    this.chatService.addLocalMessage({
      userId: 'system',
      username: 'Vendor',
      message: `${prefix}${text}`,
      createdAt: new Date()
    });
  }

  /**
   * Get rarity color class for item display
   */
  getRarityClass(rarity: string): string {
    const rarityMap: Record<string, string> = {
      'common': 'rarity-common',
      'uncommon': 'rarity-uncommon',
      'rare': 'rarity-rare',
      'epic': 'rarity-epic',
      'legendary': 'rarity-legendary'
    };
    return rarityMap[rarity] || 'rarity-common';
  }

  /**
   * Get sellable items sorted by quality+trait score (descending)
   */
  getSortedSellableItems() {
    // Filter out equipped items, then sort by score
    const sellable = this.inventory().filter(item => !item.equipped);
    return sellable.sort((a, b) => {
      return this.inventoryService.calculateItemScore(b) - this.inventoryService.calculateItemScore(a);
    });
  }

  /**
   * Handle drag over event - allow drop
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  /**
   * Handle drag leave event - remove visual feedback
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Only remove drag-over state if we're actually leaving the drop zone
    // (not just entering a child element)
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    // Check if we're leaving for a non-child element
    if (relatedTarget && !target.contains(relatedTarget)) {
      this.isDragOver.set(false);
    }
  }

  /**
   * Handle drop event - sell the entire stack
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    try {
      const itemData = event.dataTransfer?.getData('application/json');
      if (!itemData) {
        this.showMessage('Invalid item data', 'error');
        return;
      }

      const item = JSON.parse(itemData);
      if (!item.instanceId || !item.quantity) {
        this.showMessage('Invalid item', 'error');
        return;
      }

      // Check if item is equipped
      if (item.equipped) {
        this.showMessage('Cannot sell equipped items. Unequip the item first.', 'error');
        return;
      }

      // Sell entire stack
      this.sellItem(item.instanceId, item.quantity);
    } catch (error) {
      console.error('Error handling drop:', error);
      this.showMessage('Failed to process item', 'error');
    }
  }
}
