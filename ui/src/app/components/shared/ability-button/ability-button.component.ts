import { Component, input, output, computed, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Base ability interface for all ability types (combat, gathering, crafting)
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
  type?: string;
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
