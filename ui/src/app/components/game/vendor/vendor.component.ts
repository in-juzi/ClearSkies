import { Component, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../services/vendor.service';
import { InventoryService } from '../../../services/inventory.service';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';
import { VendorStockItem } from '../../../models/vendor.model';
import { ItemDetails } from '../../../models/inventory.model';
import { ItemModifiersComponent } from '../../shared/item-modifiers/item-modifiers.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ItemDetailsPanelComponent } from '../../shared/item-details-panel/item-details-panel.component';
import { ItemInstance } from '@shared/types';

type SortMode = 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, IconComponent, ItemDetailsPanelComponent],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  vendorService = inject(VendorService);
  inventoryService = inject(InventoryService);
  authService = inject(AuthService);
  chatService = inject(ChatService);
  private destroyRef = inject(DestroyRef);

  // Expose Object for template use
  Object = Object;

  // Read-only hover preview (shared item-details panel) for sellable items,
  // anchored beside the hovered row. Debounced to avoid thrash.
  hoveredItem = signal<ItemDetails | null>(null);
  hoverAnchorRect = signal<DOMRect | null>(null);
  private hoverSubject = new Subject<{ item: ItemDetails; anchorRect: DOMRect } | null>();

  constructor() {
    this.hoverSubject.pipe(
      debounceTime(150),
      // Key on instanceId (real items) falling back to itemId (vendor stock has
      // no instance, so all synthesized buy items share instanceId '').
      distinctUntilChanged((a, b) =>
        (a?.item.instanceId || a?.item.itemId || null) ===
        (b?.item.instanceId || b?.item.itemId || null)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(payload => {
      this.hoveredItem.set(payload?.item ?? null);
      this.hoverAnchorRect.set(payload?.anchorRect ?? null);
    });
  }

  onItemHover(event: MouseEvent | null, item: ItemDetails | null): void {
    if (!event || !item) {
      this.hoverSubject.next(null);
      return;
    }
    const anchorRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.hoverSubject.next({ item, anchorRect });
  }

  /** Hover handler for Buy rows: synthesize a preview item from vendor stock. */
  onBuyItemHover(event: MouseEvent | null, stock: VendorStockItem | null): void {
    const item = stock ? this.buyStockToItemDetails(stock) : null;
    this.onItemHover(item ? event : null, item);
  }

  /**
   * Build a minimal, read-only ItemDetails from vendor stock so the shared
   * preview can render it. Stock is unrolled (no quality/trait modifiers) and
   * has no item instance; the empty instanceId makes the panel skip the
   * combat-stats fetch, and stats-display falls back to base `properties`.
   */
  private buyStockToItemDetails(stock: VendorStockItem): ItemDetails | null {
    const definition = stock.itemDefinition;
    if (!definition) return null;
    return {
      instanceId: '',
      itemId: stock.itemId,
      quantity: 1,
      qualities: {},
      traits: {},
      equipped: false,
      acquiredAt: new Date(),
      sockets: [],
      definition,
      subcategories: definition.subcategories ? [...definition.subcategories] : undefined,
      vendorPrice: stock.buyPrice,
      qualityDetails: {},
      traitDetails: {},
    };
  }

  // Signals — existing
  activeTab = signal<'buy' | 'sell'>('buy');
  selectedBuyItem = signal<VendorStockItem | null>(null);
  buyQuantity = signal<number>(1);
  isDragOver = signal<boolean>(false);

  // Signals — v2 additions
  searchText = signal<string>('');
  sortMode = signal<SortMode>('price-asc');
  expandedBuyId = signal<string | null>(null);   // vendor stock itemId
  expandedSellId = signal<string | null>(null);  // inventory instanceId
  stepQty = signal<number>(1);                    // quantity for the open row's stepper
  hint = signal<string>('Select an item to buy');

  // Computed signals — data sources
  vendor = this.vendorService.currentVendor;
  inventory = this.inventoryService.inventory;
  playerGold = computed(() => this.inventoryService.gold());

  // Count of sellable items (drives the sell pane's empty state)
  sellCount = computed(() => this.inventory().filter(i => !i.equipped).length);

  // Filtered + sorted panes
  filteredBuyStock = computed<VendorStockItem[]>(() => {
    const v = this.vendor();
    if (!v) return [];
    const q = this.searchText().trim().toLowerCase();
    const mode = this.sortMode();
    let list = [...v.stock];
    if (q) {
      list = list.filter(s => (s.itemDefinition?.name ?? '').toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
      if (mode === 'name') {
        return (a.itemDefinition?.name ?? '').localeCompare(b.itemDefinition?.name ?? '');
      }
      return mode === 'price-desc' ? b.buyPrice - a.buyPrice : a.buyPrice - b.buyPrice;
    });
  });

  filteredSellItems = computed<ItemDetails[]>(() => {
    const q = this.searchText().trim().toLowerCase();
    const mode = this.sortMode();
    let list = this.getSortedSellableItems();
    if (q) {
      list = list.filter(i => (i.definition?.name ?? '').toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (mode === 'name') {
        return (a.definition?.name ?? '').localeCompare(b.definition?.name ?? '');
      }
      const pa = this.calculateSellPrice(a);
      const pb = this.calculateSellPrice(b);
      return mode === 'price-desc' ? pb - pa : pa - pb;
    });
  });

  sortLabel = computed(() => {
    switch (this.sortMode()) {
      case 'name': return 'Name';
      case 'price-desc': return 'Price ↓';
      default: return 'Price ↑';
    }
  });

  // The currently-open row for whichever pane is active
  private expandedBuyItem = computed<VendorStockItem | null>(() => {
    const id = this.expandedBuyId();
    if (!id) return null;
    return this.vendor()?.stock.find(s => s.itemId === id) ?? null;
  });

  private expandedSellItem = computed<ItemDetails | null>(() => {
    const id = this.expandedSellId();
    if (!id) return null;
    return this.inventory().find(i => i.instanceId === id) ?? null;
  });

  // Stepper-derived values for the active pane's open row
  stepUnit = computed<number>(() => {
    if (this.activeTab() === 'buy') return this.expandedBuyItem()?.buyPrice ?? 0;
    const s = this.expandedSellItem();
    return s ? this.calculateSellPrice(s) : 0;
  });

  stepCap = computed<number>(() => {
    if (this.activeTab() === 'buy') {
      const b = this.expandedBuyItem();
      return b ? this.getBuyCap(b) : 1;
    }
    const s = this.expandedSellItem();
    return s ? s.quantity : 1;
  });

  stepTotal = computed<number>(() => this.stepUnit() * this.stepQty());
  canAffordStep = computed<boolean>(() => this.activeTab() === 'sell' || this.stepTotal() <= this.playerGold());

  /**
   * Switch between buy and sell tabs. Resets any open accordion + stepper.
   */
  setTab(tab: 'buy' | 'sell'): void {
    this.activeTab.set(tab);
    this.expandedBuyId.set(null);
    this.expandedSellId.set(null);
    this.stepQty.set(1);
    this.hint.set(tab === 'buy' ? 'Select an item to buy' : 'Select an item to sell');
    // Clear any lingering preview: the hovered row is removed with the old tab,
    // so its mouseleave never fires.
    this.onItemHover(null, null);
  }

  /**
   * Cycle the sort mode: Price ascending → Price descending → Name.
   */
  cycleSort(): void {
    const order: SortMode[] = ['price-asc', 'price-desc', 'name'];
    const next = order[(order.indexOf(this.sortMode()) + 1) % order.length];
    this.sortMode.set(next);
  }

  /**
   * Update the client-side search filter.
   */
  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  /**
   * Remaining stock for a limited item, or null when unknown.
   */
  getStockRemaining(item: VendorStockItem): number | null {
    if (typeof item.currentStock === 'number') return item.currentStock;
    if (typeof item.stock === 'number') return item.stock;
    return null;
  }

  /**
   * Max quantity a player can buy in one go (limited stock cap, else 99).
   */
  private getBuyCap(item: VendorStockItem): number {
    if (item.stockType === 'limited') {
      const rem = this.getStockRemaining(item);
      return rem && rem > 0 ? rem : 1;
    }
    return 99;
  }

  /**
   * Whether the player can afford at least one of this item.
   */
  canAfford(item: VendorStockItem): boolean {
    return item.buyPrice <= this.playerGold();
  }

  /**
   * Toggle the buy accordion for a stock row. Unaffordable rows don't expand.
   */
  toggleBuy(item: VendorStockItem): void {
    if (!this.canAfford(item)) return;
    if (this.expandedBuyId() === item.itemId) {
      this.expandedBuyId.set(null);
      return;
    }
    this.expandedBuyId.set(item.itemId);
    this.stepQty.set(1);
  }

  /**
   * Toggle the sell accordion for an inventory row.
   */
  toggleSell(item: ItemDetails): void {
    if (this.expandedSellId() === item.instanceId) {
      this.expandedSellId.set(null);
      return;
    }
    this.expandedSellId.set(item.instanceId);
    this.stepQty.set(1);
  }

  // ---- Stepper controls (operate on the active pane's open row) ----

  private clampStep(q: number): void {
    const cap = this.stepCap();
    if (q < 1) q = 1;
    if (q > cap) q = cap;
    this.stepQty.set(q);
  }

  incQty(): void { this.clampStep(this.stepQty() + 1); }
  decQty(): void { this.clampStep(this.stepQty() - 1); }
  setQty(n: number): void { this.clampStep(n); }
  maxQty(): void { this.clampStep(this.stepCap()); }

  /**
   * Directly-typed quantity: keep digits only and clamp to [1, cap] live.
   * An empty field is allowed mid-edit and finalized on blur.
   */
  onQtyInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/[^0-9]/g, '');
    if (digits === '') return;
    const cap = this.stepCap();
    let n = parseInt(digits, 10);
    if (n < 1) n = 1;
    if (n > cap) n = cap;
    this.stepQty.set(n);
    // Sync the field when we stripped/clamped what was typed.
    const clamped = String(n);
    if (el.value !== clamped) el.value = clamped;
  }

  /**
   * On blur, guarantee the field holds a valid quantity (fall back to 1).
   */
  onQtyBlur(event: Event): void {
    const el = event.target as HTMLInputElement;
    const n = parseInt(el.value, 10);
    if (isNaN(n) || n < 1) this.stepQty.set(1);
    el.value = String(this.stepQty());
  }

  /**
   * Confirm a buy from the open stepper.
   */
  confirmBuy(item: VendorStockItem): void {
    const qty = this.stepQty();
    if (this.stepTotal() > this.playerGold()) return;
    this.hint.set(`Bought ${qty} × ${item.itemDefinition?.name ?? 'item'}`);
    this.buyItem(item.itemId, qty);
    // Keep the row expanded so the player can buy again; reset the quantity.
    this.stepQty.set(1);
  }

  /**
   * Confirm a sell from the open stepper.
   */
  confirmSell(item: ItemDetails): void {
    const qty = this.stepQty();
    this.hint.set(`Sold ${qty} × ${item.definition?.name ?? 'item'}`);
    this.sellItem(item.instanceId, qty);
    // Keep the row expanded (if any stack remains); reset the quantity.
    this.stepQty.set(1);
  }

  /**
   * Select an item to buy (retained for compatibility)
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
  calculateSellPrice(item: ItemInstance | { vendorPrice?: number }): number {
    // Delegate to service for centralized price calculation logic
    return this.vendorService.calculateSellPrice(item);
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
