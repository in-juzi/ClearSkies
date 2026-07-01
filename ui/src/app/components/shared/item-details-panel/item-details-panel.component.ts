import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetails } from '../../../models/inventory.model';
import { InventoryService } from '../../../services/inventory.service';
import { ItemDetailHeaderComponent } from './item-detail-header/item-detail-header.component';
import { ItemBasicInfoComponent } from './item-basic-info/item-basic-info.component';
import { ItemStatsDisplayComponent, CombatStats } from './item-stats-display/item-stats-display.component';
import { ItemModifiersDisplayComponent } from './item-modifiers-display/item-modifiers-display.component';
import { ItemSocketsDisplayComponent } from './item-sockets-display/item-sockets-display.component';
import { ItemSocketEffectDisplayComponent } from './item-socket-effect-display/item-socket-effect-display.component';
import { ItemActionsComponent } from './item-actions/item-actions.component';

@Component({
  selector: 'app-item-details-panel',
  standalone: true,
  imports: [CommonModule, ItemDetailHeaderComponent, ItemBasicInfoComponent, ItemStatsDisplayComponent, ItemModifiersDisplayComponent, ItemSocketsDisplayComponent, ItemSocketEffectDisplayComponent, ItemActionsComponent],
  templateUrl: './item-details-panel.component.html',
  styleUrls: ['./item-details-panel.component.scss']
})
export class ItemDetailsPanelComponent implements OnChanges {
  @Input() item: ItemDetails | null = null;
  @Input() showActions: boolean = true; // Show equip/use/drop buttons
  @Input() showDropControls: boolean = true; // Show quantity slider for dropping
  @Input() preview: boolean = false; // Read-only anchored hover preview (no drag, non-interactive)
  @Input() anchorTop: number | null = null; // Viewport Y of the hovered item; preview aligns to it

  @ViewChild('panelRoot') panelRoot?: ElementRef<HTMLElement>;

  /** Clamped top (px) for the preview, tracked to the hovered item and kept on-screen. */
  previewTop: number | null = null;

  /** Combat stats are immutable per instance — cache across hovers/clicks to avoid refetching. */
  private static combatStatsCache = new Map<string, CombatStats>();
  @Output() close = new EventEmitter<void>();
  @Output() equipItem = new EventEmitter<string>();
  @Output() unequipItem = new EventEmitter<string>();
  @Output() useItem = new EventEmitter<string>();
  @Output() removeItem = new EventEmitter<{ instanceId: string; quantity: number }>();
  @Output() removeAllItems = new EventEmitter<string>();
  @Output() socketItem = new EventEmitter<{ hostInstanceId: string; socketableInstanceId: string }>();
  @Output() extractSocketItem = new EventEmitter<{ hostInstanceId: string; socketIndex: number }>();

  dropQuantity: number = 1;
  isUsingItem: boolean = false;
  combatStats: CombatStats | null = null;
  loadingCombatStats: boolean = false;

  /** Maps an item rarity to its design-token color, used for the --rarity accent. */
  private readonly rarityColorMap: Record<string, string> = {
    common: 'var(--color-rarity-common)',
    uncommon: 'var(--color-rarity-uncommon)',
    rare: 'var(--color-rarity-rare)',
    epic: 'var(--color-rarity-epic)',
    legendary: 'var(--color-rarity-legendary)'
  };

  /** Rarity accent color bound to the panel's `--rarity` custom property. */
  get rarityColor(): string {
    const rarity = this.item?.definition?.rarity ?? 'common';
    return this.rarityColorMap[rarity] ?? this.rarityColorMap['common'];
  }

  // Drag functionality
  isDragging: boolean = false;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;
  currentX: number = 0;
  currentY: number = 0;
  hasDragged: boolean = false; // Track if panel has been dragged

  constructor(public inventoryService: InventoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      if (this.item) {
        // Reset drop quantity to 1 (but cap it to available quantity)
        this.dropQuantity = Math.min(1, this.item.quantity);

        // If item quantity changed (after a partial drop), ensure dropQuantity doesn't exceed new max
        if (changes['item'].previousValue &&
            changes['item'].previousValue.instanceId === this.item.instanceId &&
            changes['item'].previousValue.quantity !== this.item.quantity) {
          // Item quantity changed - cap dropQuantity to new maximum
          this.dropQuantity = Math.min(this.dropQuantity, this.item.quantity);
        }

        // Reset isUsingItem flag when item changes (after use completes)
        this.isUsingItem = false;

        // Reset drag position when a new item is displayed
        if (!changes['item'].previousValue ||
            changes['item'].previousValue.instanceId !== this.item.instanceId) {
          this.hasDragged = false;
          this.currentX = 0;
          this.currentY = 0;
        }

        // Load combat stats if it's a weapon or armor
        this.combatStats = null;
        const isWeapon = this.item.definition.subcategories?.includes('weapon');
        const isArmor = this.item.definition.subcategories?.includes('armor');
        if (this.item.definition.category === 'equipment' && (isWeapon || isArmor)) {
          this.loadCombatStats(this.item.instanceId);
        }
      } else {
        // Item cleared
        this.dropQuantity = 1;
        this.isUsingItem = false;
        this.hasDragged = false;
        this.currentX = 0;
        this.currentY = 0;
      }
    }

    // Re-anchor the preview whenever the item or its screen position changes.
    if (this.preview && (changes['item'] || changes['anchorTop'])) {
      this.schedulePreviewPosition();
    }
  }

  /**
   * Position the preview so its top tracks the hovered item, clamped so the
   * card never runs off the top or bottom of the viewport. Measured after
   * layout because the card height varies by item (stats, traits, etc.).
   */
  private schedulePreviewPosition(): void {
    requestAnimationFrame(() => {
      const el = this.panelRoot?.nativeElement;
      if (!el || !this.preview || this.anchorTop == null) {
        this.previewTop = null;
        return;
      }
      const gap = 16; // matches --spacing-l
      const maxTop = window.innerHeight - el.offsetHeight - gap;
      this.previewTop = Math.max(gap, Math.min(this.anchorTop, maxTop));
    });
  }

  /**
   * Load combat stats from backend API
   */
  loadCombatStats(instanceId: string): void {
    const cached = ItemDetailsPanelComponent.combatStatsCache.get(instanceId);
    if (cached) {
      this.combatStats = cached;
      this.loadingCombatStats = false;
      return;
    }

    this.loadingCombatStats = true;
    this.inventoryService.getItemCombatStats(instanceId).subscribe({
      next: (response: { success: boolean; stats?: CombatStats }) => {
        if (response.success && response.stats) {
          this.combatStats = response.stats;
          ItemDetailsPanelComponent.combatStatsCache.set(instanceId, response.stats);
        }
        this.loadingCombatStats = false;
        // Stats add height; re-clamp the preview now that it's rendered.
        if (this.preview) this.schedulePreviewPosition();
      },
      error: (error) => {
        console.error('Error loading combat stats:', error);
        this.loadingCombatStats = false;
        this.combatStats = null;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onEquip(): void {
    if (this.item) {
      this.equipItem.emit(this.item.instanceId);
    }
  }

  onUnequip(): void {
    if (this.item) {
      this.unequipItem.emit(this.item.instanceId);
    }
  }

  onUse(): void {
    if (this.item) {
      this.isUsingItem = true;
      this.useItem.emit(this.item.instanceId);
      // isUsingItem will be reset in ngOnChanges when item updates after use
    }
  }

  onRemove(): void {
    if (this.item) {
      this.removeItem.emit({
        instanceId: this.item.instanceId,
        quantity: this.dropQuantity
      });
    }
  }

  onRemoveAll(): void {
    if (this.item) {
      this.removeAllItems.emit(this.item.instanceId);
    }
  }

  onSocket(event: { hostInstanceId: string; socketableInstanceId: string }): void {
    // Socketing changes the host's combat stats while keeping its instanceId.
    ItemDetailsPanelComponent.combatStatsCache.delete(event.hostInstanceId);
    this.socketItem.emit(event);
  }

  onExtract(event: { hostInstanceId: string; socketIndex: number }): void {
    // Extracting changes the host's combat stats while keeping its instanceId.
    ItemDetailsPanelComponent.combatStatsCache.delete(event.hostInstanceId);
    this.extractSocketItem.emit(event);
  }

  updateDropQuantity(value: number): void {
    if (!this.item) return;
    this.dropQuantity = Math.max(1, Math.min(value, this.item.quantity));
  }

  getMaxDropQuantity(): number {
    return this.item?.quantity || 1;
  }

  /**
   * Calculate scaled health restore (with Potency quality multiplier)
   */
  getScaledHealthRestore(): number {
    if (!this.item?.definition.properties['healthRestore']) return 0;

    const baseRestore = this.item.definition.properties['healthRestore'];
    const potencyMultiplier = this.getPotencyMultiplier();

    return Math.round(baseRestore * potencyMultiplier);
  }

  /**
   * Calculate scaled mana restore (with Potency quality multiplier)
   */
  getScaledManaRestore(): number {
    if (!this.item?.definition.properties['manaRestore']) return 0;

    const baseRestore = this.item.definition.properties['manaRestore'];
    const potencyMultiplier = this.getPotencyMultiplier();

    return Math.round(baseRestore * potencyMultiplier);
  }

  /**
   * Check if item has Potency quality
   */
  hasPotencyQuality(): boolean {
    if (!this.item?.qualityDetails) return false;
    return 'potency' in this.item.qualityDetails;
  }

  /**
   * Get Potency quality multiplier
   */
  private getPotencyMultiplier(): number {
    if (!this.item?.qualityDetails?.['potency']) return 1.0;

    const potencyLevel = this.item.qualityDetails['potency'].level;
    const potencyEffect = this.item.qualityDetails['potency'].levelData.effects?.['alchemy']?.['potencyMultiplier'];

    return potencyEffect || 1.0;
  }

  /**
   * Start dragging the panel
   */
  onDragStart(event: MouseEvent): void {
    if (this.preview) return; // Preview is a transient, non-draggable glance
    this.isDragging = true;
    this.hasDragged = true; // Mark that the panel has been dragged
    const panel = (event.target as HTMLElement).closest('.item-details-panel') as HTMLElement;
    if (panel) {
      const rect = panel.getBoundingClientRect();
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
   * Stop dragging the panel
   */
  onDragEnd(): void {
    this.isDragging = false;
  }

  /**
   * Get the transform style for the panel position
   */
  getPanelStyle(): { transform?: string; left?: string; top?: string } {
    if (this.preview) {
      return this.previewTop != null ? { top: `${this.previewTop}px` } : {};
    }
    if (this.hasDragged) {
      return {
        transform: 'none',
        left: `${this.currentX}px`,
        top: `${this.currentY}px`
      };
    }
    return {};
  }
}
