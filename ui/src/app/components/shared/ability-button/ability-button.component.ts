import { Component, input, output, computed, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Base ability interface for all ability types (combat, gathering, crafting)
 * Extended to include full combat ability properties
 */
export interface BaseAbility {
  abilityId: string;
  name: string;
  description: string;
  icon?: {
    path: string;
    material: string;
  };
  manaCost?: number;
  cooldown?: number;
  type?: 'attack' | 'buff' | 'debuff' | 'heal';
  targetType?: 'single' | 'aoe' | 'self';
  powerMultiplier?: number;
  requirements?: {
    weaponTypes?: string[];
    minSkillLevel?: number;
  };
  effects?: {
    damage?: {
      type: 'physical' | 'magical';
      multiplier: number;
    };
    heal?: {
      multiplier: number;
    };
    buff?: {
      stat: string;
      amount: number;
      duration: number;
    };
    critChanceBonus?: number;
  };
}

/**
 * Extended ability state for UI display
 */
export interface AbilityState {
  ability: BaseAbility;
  disabled: boolean;
  cooldownRemaining?: number;
  insufficientResource?: boolean;
  disabledReason?: string;
}

/**
 * Reusable ability button component for combat, gathering, and crafting abilities.
 *
 * Features:
 * - Icon display with material colorization
 * - Cooldown overlay and counter
 * - Resource cost display (mana, stamina, etc.)
 * - Hover tooltip with detailed information
 * - Disabled states with visual feedback
 * - Click handling
 */
@Component({
  selector: 'app-ability-button',
  imports: [IconComponent],
  templateUrl: './ability-button.component.html',
  styleUrls: ['./ability-button.component.scss']
})
export class AbilityButtonComponent {
  // Inputs
  ability = input.required<BaseAbility>();
  disabled = input<boolean>(false);
  cooldownRemaining = input<number>(0);
  insufficientResource = input<boolean>(false);
  resourceLabel = input<string>('Mana'); // 'Mana', 'Stamina', 'Energy', etc.
  size = input<'small' | 'medium' | 'large'>('medium');
  showTooltip = input<boolean>(true);
  showCost = input<boolean>(true);
  showCooldown = input<boolean>(true);

  // Outputs
  abilityClick = output<BaseAbility>();
  abilityHover = output<BaseAbility>();

  // Computed values
  isOnCooldown = computed(() => this.cooldownRemaining() > 0);

  canUse = computed(() => {
    return !this.disabled() &&
           !this.isOnCooldown() &&
           !this.insufficientResource();
  });

  buttonClasses = computed(() => {
    const classes: string[] = ['ability-button', `ability-button-${this.size()}`];

    if (this.disabled()) classes.push('ability-disabled');
    if (this.isOnCooldown()) classes.push('ability-cooldown');
    if (this.insufficientResource()) classes.push('ability-insufficient-resource');
    if (!this.canUse()) classes.push('ability-unusable');

    return classes.join(' ');
  });

  cooldownPercent = computed(() => {
    const ability = this.ability();
    const remaining = this.cooldownRemaining();
    const maxCooldown = ability.cooldown || 0;

    if (maxCooldown === 0 || remaining === 0) return 0;
    return Math.min(100, (remaining / maxCooldown) * 100);
  });

  disabledReasonText = computed(() => {
    if (this.isOnCooldown()) {
      return `Cooldown: ${this.cooldownRemaining()} turns`;
    }
    if (this.insufficientResource()) {
      const cost = this.ability().manaCost || 0;
      return `Insufficient ${this.resourceLabel()}: ${cost} required`;
    }
    if (this.disabled()) {
      return 'Cannot use this ability';
    }
    return '';
  });

  /**
   * Get formatted damage text for display
   */
  damageText = computed(() => {
    const ability = this.ability();
    if (!ability.effects?.damage) return null;

    const mult = ability.effects.damage.multiplier;
    const type = ability.effects.damage.type;
    const percentage = Math.round((mult - 1) * 100);

    if (mult === 1) {
      return `Base ${type} damage`;
    } else if (mult > 1) {
      return `${percentage}% increased ${type} damage`;
    } else {
      return `${Math.abs(percentage)}% reduced ${type} damage`;
    }
  });

  /**
   * Get formatted healing text for display
   */
  healingText = computed(() => {
    const ability = this.ability();
    if (!ability.effects?.heal) return null;

    const mult = ability.effects.heal.multiplier;
    const percentage = Math.round(mult * 100);

    return `Heals for ${percentage}% of power`;
  });

  /**
   * Get formatted buff text for display
   */
  buffText = computed(() => {
    const ability = this.ability();
    if (!ability.effects?.buff) return null;

    const buff = ability.effects.buff;
    return `+${buff.amount} ${buff.stat} for ${buff.duration} turns`;
  });

  /**
   * Get formatted weapon requirements
   */
  weaponRequirementsText = computed(() => {
    const reqs = this.ability().requirements?.weaponTypes;
    if (!reqs || reqs.length === 0) return null;

    return reqs.map(w => this.formatWeaponType(w)).join(' or ');
  });

  /**
   * Get formatted skill requirement
   */
  skillRequirementText = computed(() => {
    const minLevel = this.ability().requirements?.minSkillLevel;
    if (!minLevel) return null;

    return `Requires level ${minLevel}`;
  });

  /**
   * Get ability type badge text
   */
  abilityTypeLabel = computed(() => {
    const type = this.ability().type;
    if (!type) return null;

    const labels: Record<string, string> = {
      attack: 'Attack',
      buff: 'Buff',
      debuff: 'Debuff',
      heal: 'Heal'
    };

    return labels[type] || type;
  });

  /**
   * Get target type display text
   */
  targetTypeLabel = computed(() => {
    const target = this.ability().targetType;
    if (!target) return null;

    const labels: Record<string, string> = {
      single: 'Single Target',
      aoe: 'Area of Effect',
      self: 'Self'
    };

    return labels[target] || target;
  });

  /**
   * Format weapon type for display
   */
  private formatWeaponType(weaponType: string): string {
    const formatted: Record<string, string> = {
      oneHanded: 'One-Handed',
      twoHanded: 'Two-Handed',
      dualWield: 'Dual Wield',
      ranged: 'Ranged',
      casting: 'Casting Staff',
      gun: 'Firearm'
    };

    return formatted[weaponType] || weaponType;
  }

  /**
   * Handle button click
   */
  handleClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.canUse()) {
      this.abilityClick.emit(this.ability());
    }
  }

  /**
   * Handle button hover
   */
  handleHover(): void {
    this.abilityHover.emit(this.ability());
  }
}
