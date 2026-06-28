import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketEffect } from '@shared/types';
import { summarizeSocketEffect, hasSocketEffect } from '../../../../utils/socket-effect.utils';

/**
 * Renders a socketable item's (sigil's) own effect — "what this does when
 * socketed" — in the item detail panel. Distinct from item-sockets-display,
 * which renders the sockets ON a host equipment item.
 */
@Component({
  selector: 'app-item-socket-effect-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-socket-effect-display.component.html',
  styleUrl: './item-socket-effect-display.component.scss'
})
export class ItemSocketEffectDisplayComponent {
  @Input() socketEffect?: SocketEffect;

  get hasEffect(): boolean {
    return hasSocketEffect(this.socketEffect);
  }

  get lines(): string[] {
    return summarizeSocketEffect(this.socketEffect);
  }
}
