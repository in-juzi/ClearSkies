import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
  selector: 'app-item-detail-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-detail-header.component.html',
  styleUrl: './item-detail-header.component.scss'
})
export class ItemDetailHeaderComponent {
  @Input() itemName: string = '';
  @Input() rarity: string = '';
  @Input() isDragging: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() dragStart = new EventEmitter<MouseEvent>();

  constructor(public inventoryService: InventoryService) {}

  onClose(): void {
    this.close.emit();
  }

  onDragStart(event: MouseEvent): void {
    this.dragStart.emit(event);
  }
}
