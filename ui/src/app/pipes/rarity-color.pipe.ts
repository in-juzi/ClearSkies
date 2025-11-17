import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform rarity string to corresponding text color CSS class.
 * Used for item names and text styling across the application.
 *
 * @example
 * <div [class]="item.rarity | rarityColor">...</div>
 * <span [ngClass]="item.rarity | rarityColor">...</span>
 */
@Pipe({
  name: 'rarityColor',
  standalone: true
})
export class RarityColorPipe implements PipeTransform {
  private readonly rarityColors: { [key: string]: string } = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400'
  };

  transform(rarity: string): string {
    return this.rarityColors[rarity] || 'text-gray-400';
  }
}
