import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform rarity string to corresponding CSS class for styling.
 * Used for border colors and text styling across the application.
 *
 * @example
 * <div [class]="item.rarity | rarityClass">...</div>
 * <span [ngClass]="item.rarity | rarityClass">...</span>
 */
@Pipe({
  name: 'rarityClass',
  standalone: true
})
export class RarityClassPipe implements PipeTransform {
  private readonly rarityClasses: { [key: string]: string } = {
    common: 'border-gray-500',
    uncommon: 'border-green-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-orange-500'
  };

  transform(rarity: string): string {
    return this.rarityClasses[rarity] || 'border-gray-500';
  }
}
