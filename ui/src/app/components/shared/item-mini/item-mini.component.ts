import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemModifiersComponent } from '../item-modifiers/item-modifiers.component';
import { IconComponent } from '../icon/icon.component';
import { ItemInstance } from '@shared/types';

@Component({
  selector: 'app-item-mini',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, IconComponent],
  templateUrl: './item-mini.component.html',
  styleUrls: ['./item-mini.component.scss']
})
export class ItemMiniComponent {
  @Input() item?: ItemInstance | any; // Item with itemId, quantity, qualities, traits, name, definition (with icon) - accepts ItemInstance or ItemDetails
  @Input() showIcon: boolean = true; // Show SVG icon
  @Input() showQuantity: boolean = true; // Show quantity (x3)
  @Input() showItemId: boolean = true; // Show item text (name or itemId)
  @Input() showDisplayName: boolean = true; // Prefer item.name over item.itemId (if name exists)
  @Input() showModifiers: boolean = true; // Show quality/trait badges
  @Input() iconSize: number = 24; // Icon size in pixels

  // Get the display text for the item (name if available and showDisplayName is true, otherwise itemId)
  get displayText(): string {
    if (!this.item) return '';
    if (this.showDisplayName && this.item.name) {
      return this.item.name;
    }
    return this.item.itemId || '';
  }

  // Get icon configuration from item definition
  get itemIcon() {
    return this.item?.definition?.icon || this.item?.icon;
  }

  // Check if item has a valid icon
  get hasIcon(): boolean {
    return !!this.itemIcon;
  }
}
