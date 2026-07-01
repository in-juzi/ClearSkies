import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-item-detail-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './item-detail-header.component.html',
  styleUrl: './item-detail-header.component.scss'
})
export class ItemDetailHeaderComponent {
  @Input() itemName: string = '';
  @Input() rarity: string = '';
  @Input() isDragging: boolean = false;
  @Input() icon: any;
  @Input() category: string = '';
  @Input() subcategories: readonly string[] = [];
  @Input() slot: string = '';
  @Input() requiredLevel: number | null = null;
  @Input() quantity: number = 1;

  @Output() close = new EventEmitter<void>();
  @Output() dragStart = new EventEmitter<MouseEvent>();

  get isEquipment(): boolean {
    return this.category === 'equipment';
  }

  /** Breadcrumb line: "Rarity · Subtype · Slot" (empty parts dropped). */
  get breadcrumb(): string {
    const parts: string[] = [];
    if (this.rarity) parts.push(this.capitalize(this.rarity));

    const subtype = (this.subcategories ?? [])
      .map((s) => this.capitalize(s))
      .join(' ')
      .trim();
    if (subtype) parts.push(subtype);

    const slotLabel = this.humanize(this.slot);
    if (slotLabel) parts.push(slotLabel);

    return parts.join(' · ');
  }

  /** Equipment shows a required-level tag. */
  get showReqTag(): boolean {
    return this.isEquipment && this.requiredLevel != null;
  }

  /** Stackables show a quantity tag. */
  get showQtyTag(): boolean {
    return !this.isEquipment && this.quantity > 1;
  }

  private capitalize(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  }

  private humanize(value: string): string {
    if (!value) return '';
    const spaced = value.replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  onClose(): void {
    this.close.emit();
  }

  onDragStart(event: MouseEvent): void {
    this.dragStart.emit(event);
  }
}
