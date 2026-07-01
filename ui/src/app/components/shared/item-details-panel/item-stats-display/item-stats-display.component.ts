import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Combat stats interface
export interface CombatStats {
  damage?: number;
  armor?: number;
  evasion?: number;
  scaledDamageRoll?: string;
  scaledDamageRange?: string;
  avgScaledDamage?: number;
  attackSpeed: number;
  critChance: number;
  totalLevelBonus?: number;
  skillLevel?: number;
  attributeLevel?: number;
  attrLevel?: number;
  traitDamageBonus?: number;
  traitCritBonus?: number;
  traitAttackSpeedBonus?: number;
  traitArmorBonus?: number;
  armorTraitBonus?: number;
  evasionTraitBonus?: number;
  blockChance?: number;
  requiredLevel?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-item-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-stats-display.component.html',
  styleUrl: './item-stats-display.component.scss'
})
export class ItemStatsDisplayComponent {
  @Input() category: string = '';
  @Input() subcategories: readonly string[] = [];
  @Input() properties: any = {};
  @Input() combatStats: CombatStats | null = null;
  @Input() loadingCombatStats: boolean = false;
  @Input() scaledHealthRestore: number = 0;
  @Input() scaledManaRestore: number = 0;
  @Input() hasPotencyQuality: boolean = false;

  get isWeapon(): boolean {
    return this.category === 'equipment' && this.subcategories.includes('weapon');
  }

  get isArmor(): boolean {
    return this.category === 'equipment' && this.subcategories.includes('armor');
  }

  get isConsumable(): boolean {
    return this.category === 'consumable';
  }

  // ----- Weapon numbers (prefer backend-scaled combat stats, else base) -----

  private get rawRoll(): string {
    return (this.combatStats?.scaledDamageRoll ?? this.properties?.['damageRoll'] ?? '') as string;
  }

  /** Base dice portion of the damage roll, e.g. "1d4". */
  get damageBase(): string {
    const roll = this.rawRoll;
    const idx = roll.indexOf('+');
    return idx >= 0 ? roll.slice(0, idx).trim() : roll;
  }

  /** Flat bonus portion of the damage roll, e.g. "+4" (empty when none). */
  get damageBonus(): string {
    const roll = this.rawRoll;
    const idx = roll.indexOf('+');
    return idx >= 0 ? roll.slice(idx).replace(/\s+/g, '') : '';
  }

  get attackSpeed(): number {
    return this.combatStats?.attackSpeed ?? this.properties?.['attackSpeed'] ?? 0;
  }

  get critChance(): number {
    return this.combatStats?.critChance ?? this.properties?.['critChance'] ?? 0;
  }

  /** DPS derived from scaled avg damage when available, else from the base roll. */
  get dps(): string {
    const speed = this.attackSpeed;
    if (!speed) return '—';
    let avg = this.combatStats?.avgScaledDamage;
    if (avg == null) avg = this.averageFromRoll(this.properties?.['damageRoll']) ?? undefined;
    if (avg == null) return '—';
    return (avg / speed).toFixed(1);
  }

  private averageFromRoll(roll?: string): number | null {
    if (!roll) return null;
    const match = /^\s*(\d+)d(\d+)\s*(?:\+\s*(\d+))?/i.exec(roll);
    if (!match) return null;
    const count = +match[1];
    const sides = +match[2];
    const flat = match[3] ? +match[3] : 0;
    return (count * (sides + 1)) / 2 + flat;
  }

  // ----- Armor numbers (prefer scaled combat stats, else base) -----

  get armorValue(): number | null {
    const value = this.combatStats?.armor ?? this.properties?.['armor'];
    return value ?? null;
  }

  get evasionValue(): number | null {
    const value = this.combatStats?.evasion ?? this.properties?.['evasion'];
    return value ?? null;
  }

  get blockValue(): number | null {
    const value = this.combatStats?.blockChance ?? this.properties?.['blockChance'];
    return value ?? null;
  }

  /** Fraction (0.05) -> "5" (drops trailing ".0"). */
  formatPercent(value: number): string {
    const pct = value * 100;
    return Number.isInteger(pct) ? pct.toFixed(0) : pct.toFixed(1);
  }

  abs(value: number): number {
    return Math.abs(value);
  }
}
