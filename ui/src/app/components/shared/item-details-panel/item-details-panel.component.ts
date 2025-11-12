import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemDetails } from '../../../models/inventory.model';
import { IconComponent } from '../icon/icon.component';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-item-details-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './item-details-panel.component.html',
  styleUrls: ['./item-details-panel.component.scss']
})
export class ItemDetailsPanelComponent implements OnChanges {
  @Input() item: ItemDetails | null = null;
  @Input() showActions: boolean = true; // Show equip/use/drop buttons
  @Input() showDropControls: boolean = true; // Show quantity slider for dropping
  @Output() close = new EventEmitter<void>();
  @Output() equipItem = new EventEmitter<string>();
  @Output() unequipItem = new EventEmitter<string>();
  @Output() useItem = new EventEmitter<string>();
  @Output() removeItem = new EventEmitter<{ instanceId: string; quantity: number }>();
  @Output() removeAllItems = new EventEmitter<string>();

  dropQuantity: number = 1;
  isUsingItem: boolean = false;
  combatStats: any = null;
  loadingCombatStats: boolean = false;

  // Drag functionality
  isDragging: boolean = false;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;
  currentX: number = 0;
  currentY: number = 0;

  constructor(public inventoryService: InventoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      if (this.item) {
        // Reset drop quantity to 1 (but cap it to available quantity)
        this.dropQuantity = Math.min(1, this.item.quantity);

        // If item quantity changed (after a partial drop), ensure dropQuantity doesn't exceed new max
        if (changes['item'].previousValue &&
            changes['item'].previousValue.instanceId === this.item.instanceId &&
            changes['item'].previousValue.quantity !== this.item.quantity) {
          // Item quantity changed - cap dropQuantity to new maximum
          this.dropQuantity = Math.min(this.dropQuantity, this.item.quantity);
        }

        // Load combat stats if it's a weapon or armor
        this.combatStats = null;
        const isWeapon = this.item.definition.subcategories?.includes('weapon');
        const isArmor = this.item.definition.subcategories?.includes('armor');
        if (this.item.definition.category === 'equipment' && (isWeapon || isArmor)) {
          this.loadCombatStats(this.item.instanceId);
        }
      } else {
        // Item cleared
        this.dropQuantity = 1;
      }
    }
  }

  /**
   * Load combat stats from backend API
   */
  loadCombatStats(instanceId: string): void {
    this.loadingCombatStats = true;
    this.inventoryService.getItemCombatStats(instanceId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.combatStats = response.stats;
        }
        this.loadingCombatStats = false;
      },
      error: (error) => {
        console.error('Error loading combat stats:', error);
        this.loadingCombatStats = false;
        this.combatStats = null;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onEquip(): void {
    if (this.item) {
      this.equipItem.emit(this.item.instanceId);
    }
  }

  onUnequip(): void {
    if (this.item) {
      this.unequipItem.emit(this.item.instanceId);
    }
  }

  onUse(): void {
    if (this.item) {
      this.isUsingItem = true;
      this.useItem.emit(this.item.instanceId);
      // Parent component should reset isUsingItem after use completes
    }
  }

  onRemove(): void {
    if (this.item) {
      this.removeItem.emit({
        instanceId: this.item.instanceId,
        quantity: this.dropQuantity
      });
    }
  }

  onRemoveAll(): void {
    if (this.item) {
      this.removeAllItems.emit(this.item.instanceId);
    }
  }

  updateDropQuantity(value: number): void {
    if (!this.item) return;
    this.dropQuantity = Math.max(1, Math.min(value, this.item.quantity));
  }

  getMaxDropQuantity(): number {
    return this.item?.quantity || 1;
  }

  getQualityKeys(qualities: any): string[] {
    if (!qualities) return [];
    return Object.keys(qualities);
  }

  formatEffectType(effectKey: string): string {
    const typeMap: { [key: string]: string } = {
      'vendorPrice': 'Vendor Price',
      'alchemy': 'Alchemy',
      'smithing': 'Smithing',
      'cooking': 'Cooking',
      'burning': 'Burning',
      'combat': 'Combat',
      'consumption': 'Consumption'
    };
    return typeMap[effectKey] || effectKey;
  }

  formatEffectValue(effectData: any): string {
    if (!effectData) return '';

    const effects: string[] = [];

    if (effectData.modifier !== undefined) {
      const percentNum = (effectData.modifier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.potencyMultiplier !== undefined) {
      const percentNum = (effectData.potencyMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Potency ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.qualityBonus !== undefined) {
      const percent = (effectData.qualityBonus * 100).toFixed(0);
      effects.push(`Quality +${percent}%`);
    }

    if (effectData.efficiencyMultiplier !== undefined) {
      const percentNum = (effectData.efficiencyMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Efficiency ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.healingMultiplier !== undefined) {
      const percentNum = (effectData.healingMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Healing ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.damageBonus !== undefined) {
      const percent = (effectData.damageBonus * 100).toFixed(0);
      effects.push(`Damage +${percent}%`);
    }

    if (effectData.healthDrain !== undefined) {
      effects.push(`Health Drain -${effectData.healthDrain}/sec`);
    }

    if (effectData.durabilityMultiplier !== undefined) {
      const percentNum = (effectData.durabilityMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Durability ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.difficultyIncrease !== undefined) {
      effects.push(`Difficulty +${effectData.difficultyIncrease}%`);
    }

    if (effectData.bonusProperties !== undefined && Array.isArray(effectData.bonusProperties)) {
      effects.push(`Grants: ${effectData.bonusProperties.join(', ')}`);
    }

    return effects.join(', ');
  }

  /**
   * Start dragging the panel
   */
  onDragStart(event: MouseEvent): void {
    this.isDragging = true;
    const panel = (event.target as HTMLElement).closest('.item-details-panel') as HTMLElement;
    if (panel) {
      const rect = panel.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      this.currentX = rect.left;
      this.currentY = rect.top;
    }
  }

  /**
   * Handle dragging movement
   */
  onDrag(event: MouseEvent): void {
    if (this.isDragging) {
      event.preventDefault();
      this.currentX = event.clientX - this.dragOffsetX;
      this.currentY = event.clientY - this.dragOffsetY;
    }
  }

  /**
   * Stop dragging the panel
   */
  onDragEnd(): void {
    this.isDragging = false;
  }

  /**
   * Get the transform style for the panel position
   */
  getPanelStyle(): any {
    if (this.isDragging || (this.currentX !== 0 || this.currentY !== 0)) {
      return {
        transform: 'none',
        left: `${this.currentX}px`,
        top: `${this.currentY}px`
      };
    }
    return {};
  }
}
