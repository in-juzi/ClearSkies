import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-modifiers-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-modifiers-display.component.html',
  styleUrl: './item-modifiers-display.component.scss'
})
export class ItemModifiersDisplayComponent {
  @Input() qualityDetails: any = null;
  @Input() traitDetails: any = null;

  /** Set of open modifier keys ("q:<id>" / "t:<id>"). */
  private readonly openIds = signal<Set<string>>(new Set());

  private readonly rarityVarMap: Record<string, string> = {
    common: 'var(--color-rarity-common)',
    uncommon: 'var(--color-rarity-uncommon)',
    rare: 'var(--color-rarity-rare)',
    epic: 'var(--color-rarity-epic)',
    legendary: 'var(--color-rarity-legendary)'
  };

  get qualityKeys(): string[] {
    return this.qualityDetails ? Object.keys(this.qualityDetails) : [];
  }

  get traitKeys(): string[] {
    return this.traitDetails ? Object.keys(this.traitDetails) : [];
  }

  /** Accent color for a trait, keyed by its rarity. */
  rarityVar(rarity: string): string {
    return this.rarityVarMap[rarity] ?? this.rarityVarMap['common'];
  }

  // ----- Collapse / expand interaction -----

  toggle(key: string): void {
    const next = new Set(this.openIds());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.openIds.set(next);
  }

  isOpen(key: string): boolean {
    return this.openIds().has(key);
  }

  onKey(event: KeyboardEvent, key: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle(key);
    }
  }

  // ----- Effect formatting (chips + one-line summary) -----

  /** Individual effect chips for a quality/trait's levelData.effects. */
  getEffectChips(effects: any): string[] {
    if (!effects) return [];
    const chips: string[] = [];

    for (const key of this.getLegacyEffectKeys(effects)) {
      const value = this.formatEffectValue(effects[key]);
      const label = this.formatEffectType(key);
      chips.push(value ? `${label} ${value}` : label);
    }

    for (const applicator of this.getApplicators(effects)) {
      if (applicator?.description) chips.push(applicator.description);
    }

    return chips;
  }

  /** Collapsed one-line summary joining the chips. */
  effectSummary(effects: any): string {
    return this.getEffectChips(effects).join(' · ');
  }

  private getLegacyEffectKeys(effects: Record<string, unknown> | null | undefined): string[] {
    if (!effects) return [];
    return Object.keys(effects).filter((key) => key !== 'applicators');
  }

  private getApplicators(
    effects: { applicators?: unknown } | null | undefined
  ): Array<{ context?: string; description?: string; [key: string]: any }> {
    if (!effects || !effects.applicators) return [];
    if (Array.isArray(effects.applicators)) {
      return effects.applicators;
    }
    return Object.values(effects.applicators);
  }

  private formatEffectType(effectKey: string): string {
    const typeMap: { [key: string]: string } = {
      vendorPrice: 'Vendor Price',
      alchemy: 'Alchemy',
      smithing: 'Smithing',
      cooking: 'Cooking',
      burning: 'Burning',
      combat: 'Combat',
      consumption: 'Consumption',
      activity: 'Activity',
      activityTime: 'Activity Time'
    };
    return typeMap[effectKey] || effectKey;
  }

  private formatEffectValue(effectData: any): string {
    if (!effectData) return '';

    const effects: string[] = [];

    if (effectData.modifier !== undefined) {
      const percentNum = (effectData.modifier - 1) * 100;
      effects.push(`${percentNum >= 0 ? '+' : ''}${percentNum.toFixed(0)}%`);
    }

    if (effectData.potencyMultiplier !== undefined) {
      const percentNum = (effectData.potencyMultiplier - 1) * 100;
      effects.push(`Potency ${percentNum >= 0 ? '+' : ''}${percentNum.toFixed(0)}%`);
    }

    if (effectData.qualityBonus !== undefined) {
      effects.push(`Quality +${(effectData.qualityBonus * 100).toFixed(0)}%`);
    }

    if (effectData.efficiencyMultiplier !== undefined) {
      const percentNum = (effectData.efficiencyMultiplier - 1) * 100;
      effects.push(`Efficiency ${percentNum >= 0 ? '+' : ''}${percentNum.toFixed(0)}%`);
    }

    if (effectData.healingMultiplier !== undefined) {
      const percentNum = (effectData.healingMultiplier - 1) * 100;
      effects.push(`Healing ${percentNum >= 0 ? '+' : ''}${percentNum.toFixed(0)}%`);
    }

    if (effectData.yieldMultiplier !== undefined) {
      const percentNum = (effectData.yieldMultiplier - 1) * 100;
      effects.push(`Yield ${percentNum >= 0 ? '+' : ''}${percentNum.toFixed(0)}%`);
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
      effects.push(`-${(effectData.reductionPercent * 100).toFixed(0)}% Activity Time`);
    }

    if (effectData.timeReduction !== undefined) {
      effects.push(`-${effectData.timeReduction}s Activity Time`);
    }

    if (effectData.hotEffect !== undefined) {
      const hot = effectData.hotEffect;
      const totalHealing = hot.healPerTick * hot.ticks;
      const totalDuration = (hot.ticks * hot.tickInterval).toFixed(0);
      effects.push(
        `${hot.healPerTick} HP per tick × ${hot.ticks} ticks (${totalHealing} HP over ${totalDuration}s)`
      );
    }

    if (effectData.buffEffect !== undefined) {
      const buff = effectData.buffEffect;
      const statName = this.formatStatName(buff.stat);
      const valueStr = buff.isPercentage ? `+${(buff.value * 100).toFixed(0)}%` : `+${buff.value}`;
      effects.push(`${valueStr} ${statName} for ${buff.duration}s`);
    }

    return effects.join(', ');
  }

  private formatStatName(stat: string): string {
    const statMap: { [key: string]: string } = {
      damage: 'Damage',
      attackSpeed: 'Attack Speed',
      armor: 'Armor',
      evasion: 'Evasion',
      critChance: 'Crit Chance',
      healthRegen: 'Health Regen',
      manaRegen: 'Mana Regen'
    };
    return statMap[stat] || stat;
  }
}
