import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-inventory-stats',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './inventory-stats.component.html',
  styleUrls: ['./inventory-stats.component.scss']
})
export class InventoryStatsComponent {
  @Input() currentWeight: number = 0;
  @Input() carryingCapacity: number = 0;
  @Input() gold: number = 0;
  @Input() floatingGold = signal<Array<{ id: string; amount: number }>>([]);

  getWeightPercent(): number {
    if (this.carryingCapacity === 0) return 0;
    return (this.currentWeight / this.carryingCapacity) * 100;
  }

  /** Bar fill width, clamped so an over-capacity load can't overflow the track. */
  weightBarWidth(): number {
    return Math.min(100, this.getWeightPercent());
  }
}
