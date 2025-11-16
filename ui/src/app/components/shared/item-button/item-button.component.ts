import { Component, input, output, computed } from '@angular/core';
import { ItemMiniComponent } from '../item-mini/item-mini.component';

/**
 * Item instance with definition for display
 */
export interface ItemInstance {
  instanceId: string;
  itemId: string;
  quantity: number;
  definition: {
    itemId: string;
    name: string;
    description: string;
    category: string;
    icon?: {
      path: string;
      material: string;
    };
    properties?: Record<string, any>;
  };
}

/**
 * Reusable item button component for consumables and usable items.
 *
 * Features:
 * - Icon display with material colorization
 * - Quantity badge
 * - Hover tooltip with item details
 * - Effect display (health/mana restore, buffs, etc.)
 * - Disabled states with visual feedback
 * - Click handling
 */
@Component({
  selector: 'app-item-button',
  imports: [ItemMiniComponent],
  templateUrl: './item-button.component.html',
  styleUrls: ['./item-button.component.scss']
})
export class ItemButtonComponent {
  // Inputs
  item = input.required<ItemInstance>();
  disabled = input<boolean>(false);
  size = input<'small' | 'medium' | 'large'>('medium');
  showTooltip = input<boolean>(true);

  // Outputs
  itemClick = output<ItemInstance>();
  itemHover = output<ItemInstance>();

  // Computed values
  canUse = computed(() => {
    return !this.disabled() && this.item().quantity > 0;
  });

  buttonClasses = computed(() => {
    const classes: string[] = ['item-button', `item-button-${this.size()}`];

    if (this.disabled()) classes.push('item-disabled');
    if (!this.canUse()) classes.push('item-unusable');
    if (this.item().quantity === 0) classes.push('item-empty');

    return classes.join(' ');
  });

  disabledReasonText = computed(() => {
    if (this.item().quantity === 0) {
      return 'No items remaining';
    }
    if (this.disabled()) {
      return 'Cannot use this item';
    }
    return '';
  });

  // Get effect text for tooltip
  effectText = computed(() => {
    const props = this.item().definition.properties;
    if (!props) return [];

    const effects: string[] = [];

    if (props['healthRestore']) {
      effects.push(`Restores ${props['healthRestore']} HP`);
    }
    if (props['manaRestore']) {
      effects.push(`Restores ${props['manaRestore']} Mana`);
    }
    if (props['staminaRestore']) {
      effects.push(`Restores ${props['staminaRestore']} Stamina`);
    }

    return effects;
  });

  /**
   * Handle button click
   */
  handleClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.canUse()) {
      this.itemClick.emit(this.item());
    }
  }

  /**
   * Handle button hover
   */
  handleHover(): void {
    this.itemHover.emit(this.item());
  }
}
