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
}
