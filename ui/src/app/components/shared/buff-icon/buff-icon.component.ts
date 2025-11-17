import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveBuff } from '@shared/types';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-buff-icon',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './buff-icon.component.html',
  styleUrl: './buff-icon.component.scss'
})
export class BuffIconComponent {
  @Input() buff!: ActiveBuff;
  @Input() size: number = 40; // Icon size in pixels

  /**
   * Get the border color based on buff target
   * Player buffs = green/blue, enemy debuffs = red/purple
   */
  getBorderColor(): string {
    return this.buff.target === 'player' ? '#4ade80' : '#f87171'; // green-400 : red-400
  }

  /**
   * Get tooltip text showing buff details
   */
  getTooltip(): string {
    const lines: string[] = [
      this.buff.name,
      this.buff.description,
      `Duration: ${this.buff.duration} turn${this.buff.duration !== 1 ? 's' : ''} remaining`
    ];

    // Add stat modifiers info
    if (this.buff.statModifiers && this.buff.statModifiers.length > 0) {
      const mods = this.buff.statModifiers.map(mod => {
        const value = mod.type === 'percentage'
          ? `${(mod.value * 100).toFixed(0)}%`
          : `${mod.value > 0 ? '+' : ''}${mod.value}`;
        return `${value} ${mod.stat}`;
      });
      lines.push(mods.join(', '));
    }

    // Add DoT/HoT info
    if (this.buff.damageOverTime) {
      lines.push(`${this.buff.damageOverTime} damage per turn`);
    }
    if (this.buff.healOverTime) {
      lines.push(`${this.buff.healOverTime} healing per turn`);
    }
    if (this.buff.manaRegen) {
      lines.push(`${this.buff.manaRegen} mana per turn`);
    }
    if (this.buff.manaDrain) {
      lines.push(`${this.buff.manaDrain} mana drain per turn`);
    }

    return lines.join('\n');
  }
}
