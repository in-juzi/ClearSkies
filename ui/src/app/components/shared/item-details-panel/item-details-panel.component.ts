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

  constructor(public inventoryService: InventoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      // Reset drop quantity
      this.dropQuantity = 1;

      // Load combat stats if it's a weapon
      this.combatStats = null;
      if (this.item.definition.category === 'equipment' && this.item.definition.subcategories?.includes('weapon')) {
        this.loadCombatStats(this.item.instanceId);
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
}
