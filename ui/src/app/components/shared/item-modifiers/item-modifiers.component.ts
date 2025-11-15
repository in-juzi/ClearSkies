import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-item-modifiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-modifiers.component.html',
  styleUrls: ['./item-modifiers.component.scss']
})
export class ItemModifiersComponent {
  @Input() item: any; // Item with qualities/traits
  @Input() displayMode: 'badge-level' | 'badge-tier' | 'badge-name' | 'inline-text' = 'badge-level';
  @Input() showQualities: boolean = true;
  @Input() showTraits: boolean = true;
  @Input() size: 'mini' | 'normal' | 'large' = 'normal';

  // Inject inventory service for quality/trait definitions
  private inventoryService = inject(InventoryService);

  // Expose Object for template use
  Object = Object;

  /**
   * Get quality full name
   */
  getQualityName(qualityId: string): string {
    const qualityNames: { [key: string]: string } = {
      'purity': 'Purity',
      'freshness': 'Freshness',
      'woodGrain': 'Wood Grain',
      'moisture': 'Moisture',
      'age': 'Age',
      'potency': 'Potency',
      'grain': 'Grain',
      'luster': 'Luster',
      'sheen': 'Sheen'
    };

    return qualityNames[qualityId] || qualityId.charAt(0).toUpperCase() + qualityId.slice(1);
  }

  /**
   * Get quality shorthand (first letter uppercase or from definition)
   */
  getQualityShorthand(qualityId: string): string {
    // Map of known quality shorthands
    const shorthands: { [key: string]: string } = {
      'purity': 'P',
      'freshness': 'F',
      'woodGrain': 'W',
      'moisture': 'M',
      'age': 'A',
      'potency': 'Po',
      'grain': 'G',
      'luster': 'L',
      'sheen': 'S'
    };

    return shorthands[qualityId] || qualityId.charAt(0).toUpperCase();
  }

  /**
   * Get trait full name
   */
  getTraitName(traitId: string): string {
    const traitNames: { [key: string]: string } = {
      'fragrant': 'Fragrant',
      'knotted': 'Knotted',
      'weathered': 'Weathered',
      'pristine': 'Pristine',
      'cursed': 'Cursed',
      'blessed': 'Blessed',
      'masterwork': 'Masterwork',
      'restorative': 'Restorative',
      'empowering': 'Empowering',
      'invigorating': 'Invigorating',
      'warding': 'Warding',
      'hardened': 'Hardened',
      'reinforced': 'Reinforced',
      'balanced': 'Balanced'
    };

    return traitNames[traitId] || traitId.charAt(0).toUpperCase() + traitId.slice(1);
  }

  /**
   * Get trait shorthand (first letter uppercase or from definition)
   */
  getTraitShorthand(traitId: string): string {
    // Map of known trait shorthands
    const shorthands: { [key: string]: string } = {
      'fragrant': 'Fr',
      'knotted': 'Kn',
      'weathered': 'We',
      'pristine': 'Pr',
      'cursed': 'Cu',
      'blessed': 'Bl',
      'masterwork': 'Ma',
      'restorative': 'Re',
      'empowering': 'Em',
      'invigorating': 'In',
      'warding': 'Wa',
      'hardened': 'Ha',
      'reinforced': 'Rf',
      'balanced': 'Ba'
    };

    return shorthands[traitId] || traitId.charAt(0).toUpperCase();
  }

  /**
   * Get quality level color class
   */
  getQualityColor(level: number): string {
    if (level >= 5) return 'level-5'; // Purple - Perfect
    if (level >= 4) return 'level-4'; // Green - Fine
    if (level >= 3) return 'level-3'; // Blue - Good
    if (level >= 2) return 'level-2'; // Yellow - Fair
    return 'level-1';                  // Red - Poor
  }

  /**
   * Get trait level color class
   */
  getTraitColor(level: number): string {
    if (level >= 3) return 'trait-3'; // Purple - Max level
    if (level >= 2) return 'trait-2'; // Blue - Mid level
    return 'trait-1';                  // Green - Base level
  }

  /**
   * Calculate average quality level
   */
  getAverageQuality(item: any): number {
    if (!item.qualities || Object.keys(item.qualities).length === 0) return 0;
    const qualities = Object.values(item.qualities) as number[];
    if (qualities.length === 0) return 0;
    return qualities.reduce((sum, level) => sum + level, 0) / qualities.length;
  }

  /**
   * Get quality tier based on average quality level
   */
  getQualityTier(avgQuality: number): string {
    if (avgQuality >= 4.5) return 'Legendary';
    if (avgQuality >= 3.5) return 'Epic';
    if (avgQuality >= 2.5) return 'Rare';
    if (avgQuality >= 1.5) return 'Uncommon';
    return 'Common';
  }

  /**
   * Get tier color class
   */
  getTierColor(tier: string): string {
    return tier.toLowerCase();
  }

  /**
   * Format qualities and traits as inline text
   */
  formatInlineText(item: any): string {
    const parts: string[] = [];

    // Add qualities
    if (item.qualities && Object.keys(item.qualities).length > 0) {
      const qualityParts = Object.entries(item.qualities)
        .map(([name, level]) => `${name}: ${level}`)
        .join(', ');
      parts.push(qualityParts);
    }

    // Add traits
    if (item.traits && Object.keys(item.traits).length > 0) {
      const traitParts = Object.entries(item.traits)
        .map(([name, level]) => `${name}: ${level}`)
        .join(', ');
      parts.push(traitParts);
    }

    return parts.length > 0 ? `(${parts.join(' | ')})` : '';
  }

  /**
   * Check if item has qualities
   */
  hasQualities(): boolean {
    return this.item?.qualities && Object.keys(this.item.qualities).length > 0;
  }

  /**
   * Check if item has traits
   */
  hasTraits(): boolean {
    return this.item?.traits && Object.keys(this.item.traits).length > 0;
  }

  /**
   * Get quality entries with proper typing
   */
  getQualityEntries(): Array<[string, number]> {
    if (!this.item?.qualities) return [];
    return Object.entries(this.item.qualities) as Array<[string, number]>;
  }

  /**
   * Get trait entries with proper typing
   */
  getTraitEntries(): Array<[string, number]> {
    if (!this.item?.traits) return [];
    return Object.entries(this.item.traits) as Array<[string, number]>;
  }

  /**
   * Get rich tooltip for quality badge
   */
  getQualityTooltip(qualityId: string, level: number): string {
    const qualityNames: { [key: string]: string } = {
      'purity': 'Purity',
      'freshness': 'Freshness',
      'woodGrain': 'Wood Grain',
      'moisture': 'Moisture',
      'age': 'Age'
    };

    const levelNames: { [key: number]: string } = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Fine',
      5: 'Perfect'
    };

    const qualityName = qualityNames[qualityId] || qualityId;
    const levelName = levelNames[level] || `Level ${level}`;

    return `${qualityName} - ${levelName}\nAffects: Vendor Price, Alchemy Potency, Crafting Quality`;
  }

  /**
   * Get rich tooltip for trait badge
   */
  getTraitTooltip(traitId: string, level: number): string {
    const traitNames: { [key: string]: string } = {
      'fragrant': 'Fragrant',
      'knotted': 'Knotted',
      'weathered': 'Weathered',
      'pristine': 'Pristine',
      'cursed': 'Cursed',
      'blessed': 'Blessed',
      'masterwork': 'Masterwork'
    };

    const traitDescriptions: { [key: string]: string } = {
      'fragrant': 'Pleasant aroma enhances alchemy',
      'knotted': 'Structural defects reduce effectiveness',
      'weathered': 'Age and exposure add character',
      'pristine': 'Exceptional condition boosts value',
      'cursed': 'Dark magic reduces quality',
      'blessed': 'Divine touch increases potency',
      'masterwork': 'Crafted with exceptional skill'
    };

    const traitName = traitNames[traitId] || traitId;
    const description = traitDescriptions[traitId] || 'Special property';

    return `${traitName} (Level ${level})\n${description}\nAffects: Vendor Price, Crafting Outcomes`;
  }
}
