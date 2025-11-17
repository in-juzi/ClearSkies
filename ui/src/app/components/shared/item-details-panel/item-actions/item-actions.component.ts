import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.scss'
})
export class ItemActionsComponent {
  @Input() category: string = '';
  @Input() quantity: number = 1;
  @Input() isEquipped: boolean = false;
  @Input() showActions: boolean = true;
  @Input() showDropControls: boolean = true;
  @Input() isUsingItem: boolean = false;
  @Input() dropQuantity: number = 1;
  @Input() maxDropQuantity: number = 1;

  @Output() use = new EventEmitter<void>();
  @Output() equip = new EventEmitter<void>();
  @Output() unequip = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() removeAll = new EventEmitter<void>();
  @Output() dropQuantityChange = new EventEmitter<number>();

  onUse(): void {
    this.use.emit();
  }

  onEquip(): void {
    this.equip.emit();
  }

  onUnequip(): void {
    this.unequip.emit();
  }

  onRemove(): void {
    this.remove.emit();
  }

  onRemoveAll(): void {
    this.removeAll.emit();
  }

  updateDropQuantity(value: number): void {
    this.dropQuantityChange.emit(value);
  }
}
