import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ItemMiniComponent } from '../../../shared/item-mini/item-mini.component';
import { ActivityLogComponent, ActivityLogEntry } from '../../../shared/activity-log/activity-log.component';
import { Recipe } from '@shared/types';

// Interface for ingredient group display
interface IngredientGroup {
  itemId: string;
  instances: Array<{
    instanceId: string;
    itemId: string;
    definition?: { name: string };
    usedQuantity: number;
    remainingQuantity: number;
    [key: string]: any;
  }>;
}

@Component({
  selector: 'app-crafting-progress',
  standalone: true,
  imports: [CommonModule, IconComponent, ItemMiniComponent, ActivityLogComponent],
  templateUrl: './crafting-progress.component.html',
  styleUrls: ['./crafting-progress.component.scss']
})
export class CraftingProgressComponent {
  @Input() activeRecipe: Recipe | null = null;
  @Input() activeOutputIcon: any = null;
  @Input() craftingProgress: number = 0;
  @Input() remainingTime: number = 0;
  @Input() activeIngredientItems: IngredientGroup[] = [];
  @Input() autoRestartEnabled: boolean = false;
  @Input() isRestarting: boolean = false;
  @Input() craftingLog: ActivityLogEntry[] = [];
  @Input() lastResult: any = null;

  @Output() autoRestartToggled = new EventEmitter<void>();
  @Output() craftingCancelled = new EventEmitter<void>();
  @Output() resultCleared = new EventEmitter<void>();

  formatTime(seconds: number): string {
    if (seconds <= 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  toggleAutoRestart(): void {
    this.autoRestartToggled.emit();
  }

  cancelCrafting(): void {
    this.craftingCancelled.emit();
  }

  clearResult(): void {
    this.resultCleared.emit();
  }

  createItemForDisplay(instance: any, usedQuantity: number): any {
    return {
      ...instance,
      quantity: usedQuantity
    };
  }
}
