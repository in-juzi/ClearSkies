import { Component, input, computed } from '@angular/core';
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
  // Inputs as signals
  item = input<ItemInstance | any>(); // Item with itemId, quantity, qualities, traits, name, definition (with icon) - accepts ItemInstance or ItemDetails
  showIcon = input<boolean>(true); // Show SVG icon
  showQuantity = input<boolean>(true); // Show quantity (x3)
  showItemId = input<boolean>(true); // Show item text (name or itemId)
  showDisplayName = input<boolean>(true); // Prefer item.name over item.itemId (if name exists)
  showModifiers = input<boolean>(true); // Show quality/trait badges
  iconSize = input<number>(24); // Icon size in pixels

  // Computed signals (replacing getters)
  displayText = computed(() => {
    const itemValue = this.item();
    if (!itemValue) return '';
    if (this.showDisplayName() && itemValue.name) {
      return itemValue.name;
    }
    return itemValue.itemId || '';
  });

  itemIcon = computed(() => {
    const itemValue = this.item();
    return itemValue?.definition?.icon || itemValue?.icon;
  });

  hasIcon = computed(() => {
    return !!this.itemIcon();
  });
}
