import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ItemMiniComponent } from '../../../shared/item-mini/item-mini.component';
import { ItemDetails } from '../../../../models/inventory.model';
import { InventoryService } from '../../../../services/inventory.service';
import { RarityClassPipe } from '../../../../pipes/rarity-class.pipe';
import { RarityColorPipe } from '../../../../pipes/rarity-color.pipe';

// Interface for grouped items
export interface ItemGroup {
  itemId: string;
  definition: ItemDetails['definition'];
  instances: ItemDetails[];
  totalQuantity: number;
  isExpanded: boolean;
}

@Component({
  selector: 'app-inventory-grouped-view',
  standalone: true,
  imports: [CommonModule, IconComponent, ItemMiniComponent, RarityClassPipe, RarityColorPipe],
  templateUrl: './inventory-grouped-view.component.html',
  styleUrls: ['./inventory-grouped-view.component.scss']
})
export class InventoryGroupedViewComponent {
  @Input() groups: ItemGroup[] = [];
  @Input() isAltKeyHeld: boolean = false;
  @Input() isVendorOpen: boolean = false;

  @Output() groupToggle = new EventEmitter<ItemGroup>();
  @Output() itemClick = new EventEmitter<{ event: MouseEvent; item: ItemDetails }>();
  @Output() itemRightClick = new EventEmitter<{ event: MouseEvent; item: ItemDetails }>();
  @Output() itemDragStart = new EventEmitter<{ event: DragEvent; item: ItemDetails }>();
  @Output() itemDragEnd = new EventEmitter<DragEvent>();

  constructor(public inventoryService: InventoryService) {}

  getItemTooltip(item: ItemDetails): string {
    return `Right-click: ${this.getQuickActionLabel(item)}\nAlt+Click: ${this.isVendorOpen ? 'Quick sell' : 'Quick drop'}`;
  }

  private getQuickActionLabel(item: ItemDetails): string {
    if (item.definition.category === 'equipment') {
      return item.equipped ? 'Unequip' : 'Equip';
    } else if (item.definition.category === 'consumable') {
      return 'Use item';
    }
    return 'No action';
  }

  onGroupToggle(group: ItemGroup): void {
    this.groupToggle.emit(group);
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
}
