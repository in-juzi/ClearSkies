import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../../services/inventory.service';
import { RarityColorPipe } from '../../../../pipes/rarity-color.pipe';

@Component({
  selector: 'app-item-modifiers-display',
  standalone: true,
  imports: [CommonModule, RarityColorPipe],
  templateUrl: './item-modifiers-display.component.html',
  styleUrl: './item-modifiers-display.component.scss'
})
export class ItemModifiersDisplayComponent {
  @Input() qualityDetails: any = null;
  @Input() traitDetails: any = null;

  constructor(public inventoryService: InventoryService) {}

  getQualityKeys(qualities: Record<string, any> | null | undefined): string[] {
    if (!qualities) return [];
    return Object.keys(qualities);
  }

  getLegacyEffectKeys(effects: Record<string, unknown> | null | undefined): string[] {
    if (!effects) return [];
    return Object.keys(effects).filter(key => key !== 'applicators');
  }

  getApplicators(effects: { applicators?: unknown } | null | undefined): Array<{ context?: string; description?: string; [key: string]: any }> {
    if (!effects || !effects.applicators) return [];
    if (Array.isArray(effects.applicators)) {
      return effects.applicators;
    }
    return Object.values(effects.applicators);
  }

  getApplicatorsLabel(effects: { applicators?: unknown } | null | undefined): string {
    const applicators = this.getApplicators(effects);
    if (applicators.length === 0) return 'Effects';

    const firstContext = applicators[0]?.context;
    if (firstContext) {
      if (firstContext.startsWith('combat.')) {
        return 'Combat Effects';
      } else if (firstContext.startsWith('activity.')) {
        return 'Activity Effects';
      } else if (firstContext.startsWith('crafting.')) {
        return 'Crafting Effects';
      } else if (firstContext.startsWith('vendor.')) {
        return 'Vendor Effects';
      }
    }

    return 'Effects';
  }

  formatEffectType(effectKey: string): string {
    const typeMap: { [key: string]: string } = {
      'vendorPrice': 'Vendor Price',
      'alchemy': 'Alchemy Effect',
      'smithing': 'Smithing',
      'cooking': 'Cooking',
      'burning': 'Burning',
      'combat': 'Combat Effect',
      'consumption': 'Consumption',
      'activity': 'Activity Effect',
      'activityTime': 'Activity Time'
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

    if (effectData.yieldMultiplier !== undefined) {
      const percentNum = (effectData.yieldMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Yield ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.damageBonus !== undefined) {
      effects.push(`+${effectData.damageBonus} Damage`);
    }

    if (effectData.healthDrain !== undefined) {
      effects.push(`Health Drain -${effectData.healthDrain}/sec`);
    }

    if (effectData.difficultyIncrease !== undefined) {
      effects.push(`Difficulty +${effectData.difficultyIncrease}%`);
    }

    if (effectData.bonusProperties !== undefined && Array.isArray(effectData.bonusProperties)) {
      effects.push(`Grants: ${effectData.bonusProperties.join(', ')}`);
    }

    if (effectData.reductionPercent !== undefined) {
      const percent = (effectData.reductionPercent * 100).toFixed(0);
      effects.push(`-${percent}% Activity Time`);
    }

    if (effectData.timeReduction !== undefined) {
      effects.push(`-${effectData.timeReduction}s Activity Time`);
    }

    if (effectData.hotEffect !== undefined) {
      const hot = effectData.hotEffect;
      const totalHealing = hot.healPerTick * hot.ticks;
      const totalDuration = (hot.ticks * hot.tickInterval).toFixed(0);
      effects.push(`${hot.healPerTick} HP per tick × ${hot.ticks} ticks (${totalHealing} HP over ${totalDuration}s)`);
    }

    if (effectData.buffEffect !== undefined) {
      const buff = effectData.buffEffect;
      const statName = this.formatStatName(buff.stat);
      let valueStr: string;

      if (buff.isPercentage) {
        const percent = (buff.value * 100).toFixed(0);
        valueStr = `+${percent}%`;
      } else {
        valueStr = `+${buff.value}`;
      }

      effects.push(`${valueStr} ${statName} for ${buff.duration}s`);
    }

    return effects.join(', ');
  }

  formatStatName(stat: string): string {
    const statMap: { [key: string]: string } = {
      'damage': 'Damage',
      'attackSpeed': 'Attack Speed',
      'armor': 'Armor',
      'evasion': 'Evasion',
      'critChance': 'Crit Chance',
      'healthRegen': 'Health Regen',
      'manaRegen': 'Mana Regen'
    };
    return statMap[stat] || stat;
  }
}
