import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemModifiersComponent } from '../item-modifiers/item-modifiers.component';

@Component({
  selector: 'app-item-mini',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent],
  templateUrl: './item-mini.component.html',
  styleUrls: ['./item-mini.component.scss']
})
export class ItemMiniComponent {
  @Input() item: any; // Item with itemId, quantity, qualities, traits
  @Input() showIcon: boolean = true; // Show emoji icon (📦)
  @Input() showQuantity: boolean = true; // Show quantity (x3)
  @Input() showItemId: boolean = true; // Show itemId text
  @Input() showModifiers: boolean = true; // Show quality/trait badges
  @Input() icon: string = '📦'; // Default icon emoji
}
