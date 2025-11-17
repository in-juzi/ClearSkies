import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemModifiersComponent } from '../../../shared/item-modifiers/item-modifiers.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ItemDetails } from '../../../../models/inventory.model';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
  selector: 'app-inventory-list-view',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, IconComponent],
  templateUrl: './inventory-list-view.component.html',
  styleUrls: ['./inventory-list-view.component.scss']
})
export class InventoryListViewComponent {
  @Input() items: ItemDetails[] = [];
  @Input() isAltKeyHeld: boolean = false;
  @Input() isVendorOpen: boolean = false;

  @Output() itemClick = new EventEmitter<{ event: MouseEvent; item: ItemDetails }>();
  @Output() itemRightClick = new EventEmitter<{ event: MouseEvent; item: ItemDetails }>();
  @Output() itemDragStart = new EventEmitter<{ event: DragEvent; item: ItemDetails }>();
  @Output() itemDragEnd = new EventEmitter<DragEvent>();

  constructor(public inventoryService: InventoryService) {}

  getRarityClass(rarity: string): string {
    return `rarity-${rarity.toLowerCase()}`;
  }

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
