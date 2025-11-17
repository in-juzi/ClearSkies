import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-stats.component.html',
  styleUrls: ['./inventory-stats.component.scss']
})
export class InventoryStatsComponent {
  @Input() currentWeight: number = 0;
  @Input() carryingCapacity: number = 0;
  @Input() inventorySize: number = 0;
  @Input() gold: number = 0;
  @Input() floatingGold = signal<Array<{ id: string; amount: number }>>([]);

  getWeightPercent(): number {
    if (this.carryingCapacity === 0) return 0;
    return (this.currentWeight / this.carryingCapacity) * 100;
  }
}
