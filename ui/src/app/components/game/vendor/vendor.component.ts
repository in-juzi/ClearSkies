import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../services/vendor.service';
import { InventoryService } from '../../../services/inventory.service';
import { VendorStockItem } from '../../../models/vendor.model';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  vendorService = inject(VendorService);
  inventoryService = inject(InventoryService);

  // Signals
  activeTab = signal<'buy' | 'sell'>('buy');
  selectedBuyItem = signal<VendorStockItem | null>(null);
  buyQuantity = signal<number>(1);
  message = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  // Computed signals
  vendor = this.vendorService.currentVendor;
  inventory = this.inventoryService.inventory;
  playerGold = computed(() => this.inventoryService.gold());

  /**
   * Switch between buy and sell tabs
   */
  setTab(tab: 'buy' | 'sell'): void {
    this.activeTab.set(tab);
    this.clearMessage();
  }

  /**
   * Select an item to buy
   */
  selectBuyItem(item: VendorStockItem): void {
    this.selectedBuyItem.set(item);
    this.buyQuantity.set(1);
    this.clearMessage();
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
          this.inventoryService.setGold(response.gold);
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
          this.inventoryService.setGold(response.gold);
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
    // This is a simplified calculation - the backend will calculate the exact price
    // including quality and trait bonuses
    return Math.floor((item.baseValue || 0) * 0.5);
  }

  /**
   * Close vendor interface
   */
  closeVendor(): void {
    this.vendorService.closeVendor();
  }

  /**
   * Show message to user
   */
  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message.set({ text, type });
    setTimeout(() => this.clearMessage(), 3000);
  }

  /**
   * Clear message
   */
  private clearMessage(): void {
    this.message.set(null);
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
}
