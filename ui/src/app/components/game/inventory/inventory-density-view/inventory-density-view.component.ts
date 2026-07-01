import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemModifiersComponent } from '../../../shared/item-modifiers/item-modifiers.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ItemDetails } from '../../../../models/inventory.model';

export type InventoryDensity = 'comfortable' | 'compact' | 'grid';

interface CategoryGroup {
  key: string;
  label: string;
  items: ItemDetails[];
}

/**
 * Renders the inventory at one of three information densities:
 * - comfortable: icon + name + quality/trait badges + qty, category-grouped
 * - compact: thin zebra rows (dot + icon + name + quality + qty), category-grouped
 * - grid: dense icon cells with rarity border + qty, flat
 *
 * Emits the same item interaction events as the other inventory views so the
 * parent's click / right-click / drag / alt-mode wiring is unchanged.
 */
@Component({
  selector: 'app-inventory-density-view',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, IconComponent],
  templateUrl: './inventory-density-view.component.html',
  styleUrls: ['./inventory-density-view.component.scss']
})
export class InventoryDensityViewComponent {
  @Input() items: ItemDetails[] = [];
  @Input() density: InventoryDensity = 'comfortable';
  @Input() isAltKeyHeld: boolean = false;
  @Input() isVendorOpen: boolean = false;

  @Output() itemClick = new EventEmitter<{ event: MouseEvent; item: ItemDetails }>();
  @Output() itemRightClick = new EventEmitter<{ event: MouseEvent; item: ItemDetails }>();
  /** Emits the hovered item + its viewport rect on mouseenter, null on mouseleave (drives the hover preview). */
  @Output() itemHover = new EventEmitter<{ item: ItemDetails; anchorRect: DOMRect } | null>();
  @Output() itemDragStart = new EventEmitter<{ event: DragEvent; item: ItemDetails }>();
  @Output() itemDragEnd = new EventEmitter<DragEvent>();

  private static readonly CATEGORY_ORDER = ['equipment', 'consumable', 'resource'];
  private static readonly CATEGORY_LABELS: Record<string, string> = {
    equipment: 'Equipment',
    consumable: 'Consumables',
    resource: 'Resources'
  };

  /** Category-grouped items (preserves the parent's incoming sort order within each group). */
  get categoryGroups(): CategoryGroup[] {
    const buckets = new Map<string, ItemDetails[]>();
    for (const item of this.items) {
      const key = item.definition?.category || 'other';
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(item);
    }

    const order = InventoryDensityViewComponent.CATEGORY_ORDER;
    return Array.from(buckets.entries())
      .sort(([a], [b]) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib) || a.localeCompare(b);
      })
      .map(([key, items]) => ({
        key,
        label: InventoryDensityViewComponent.CATEGORY_LABELS[key] || this.titleCase(key),
        items
      }));
  }

  private titleCase(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  /** CSS rarity color var for borders and item names. */
  rarityColor(item: ItemDetails): string {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const rarity = item.definition?.rarity;
    return `var(--color-rarity-${rarity && rarities.includes(rarity) ? rarity : 'common'})`;
  }

  /** Whether an item carries any quality or trait modifiers (drives the grid mod dot). */
  hasModifiers(item: any): boolean {
    const qualities = item?.qualities;
    const traits = item?.traits;
    const qCount = qualities instanceof Map ? qualities.size : Object.keys(qualities || {}).length;
    const tCount = traits instanceof Map ? traits.size : Object.keys(traits || {}).length;
    return qCount > 0 || tCount > 0;
  }

  getItemTooltip(item: ItemDetails): string {
    const altAction = this.isVendorOpen ? 'Quick sell' : 'Quick drop';
    let quick = 'No action';
    if (item.definition?.category === 'equipment') {
      quick = item.equipped ? 'Unequip' : 'Equip';
    } else if (item.definition?.category === 'consumable') {
      quick = 'Use item';
    }
    return `Right-click: ${quick}\nAlt+Click: ${altAction}`;
  }

  onItemClick(event: MouseEvent, item: ItemDetails): void {
    this.itemClick.emit({ event, item });
  }

  onItemRightClick(event: MouseEvent, item: ItemDetails): void {
    this.itemRightClick.emit({ event, item });
  }

  onItemDragStart(event: DragEvent, item: ItemDetails): void {
    this.itemDragStart.emit({ event, item });
  }

  onItemDragEnd(event: DragEvent): void {
    this.itemDragEnd.emit(event);
  }

  onItemHover(event: MouseEvent, item: ItemDetails): void {
    const anchorRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.itemHover.emit({ item, anchorRect });
  }
}
