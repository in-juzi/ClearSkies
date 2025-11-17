import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform rarity string to .rarity-* CSS class name.
 * Used in components that define their own .rarity-common, .rarity-rare, etc. styles.
 * This pipe simply adds the 'rarity-' prefix for use in component-specific CSS.
 *
 * @example
 * <div [ngClass]="item.rarity | rarityName">...</div>
 * <!-- Outputs: "rarity-common", "rarity-rare", etc. -->
 */
@Pipe({
  name: 'rarityName',
  standalone: true
})
export class RarityNamePipe implements PipeTransform {
  transform(rarity: string): string {
    return `rarity-${rarity.toLowerCase()}`;
  }
}
