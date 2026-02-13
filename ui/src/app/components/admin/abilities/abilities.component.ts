import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ability } from '@shared/types';
import { AbilityRegistry } from '@be/data/abilities/AbilityRegistry';

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.scss']
})
export class AbilitiesComponent {
  // All abilities from registry
  allAbilities: Ability[] = [];

  // Filtered abilities for list display
  filteredAbilities = signal<Ability[]>([]);

  // Selected ability for detail panel
  selectedAbility = signal<Ability | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterType = signal<'all' | 'attack' | 'buff' | 'debuff' | 'heal'>('all');
  sortBy = signal<'name' | 'manaCost' | 'cooldown' | 'power'>('name');

  constructor() {
    this.loadAbilities();
  }

  loadAbilities(): void {
    this.allAbilities = AbilityRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allAbilities];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(ability =>
        ability.name.toLowerCase().includes(search) ||
        ability.abilityId.toLowerCase().includes(search) ||
        ability.description.toLowerCase().includes(search)
      );
    }

    // Type filter
    const type = this.filterType();
    if (type !== 'all') {
      filtered = filtered.filter(ability => ability.type === type);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'manaCost':
          return a.manaCost - b.manaCost;
        case 'cooldown':
          return a.cooldown - b.cooldown;
        case 'power':
          return b.powerMultiplier - a.powerMultiplier;
        default:
          return 0;
      }
    });

    this.filteredAbilities.set(filtered);
  }

  selectAbility(ability: Ability): void {
    this.selectedAbility.set(ability);
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'attack': return '#ef4444'; // red
      case 'buff': return '#10b981'; // green
      case 'debuff': return '#f59e0b'; // amber
      case 'heal': return '#3b82f6'; // blue
      default: return '#6b7280'; // gray
    }
  }

  getTargetTypeLabel(targetType: string): string {
    switch (targetType) {
      case 'single': return 'Single Target';
      case 'aoe': return 'Area of Effect';
      case 'self': return 'Self';
      default: return targetType;
    }
  }

  getDamageTypeLabel(damageType?: string): string {
    if (!damageType) return 'N/A';
    return damageType.charAt(0).toUpperCase() + damageType.slice(1);
  }

  getWeaponTypes(ability: Ability): string {
    if (!ability.requirements.weaponTypes.length) return 'Any';
    return ability.requirements.weaponTypes
      .map(type => this.formatWeaponType(type))
      .join(', ');
  }

  formatWeaponType(type: string): string {
    // Convert camelCase to Title Case
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  hasBuffEffects(ability: Ability): boolean {
    return !!ability.effects.applyBuff;
  }

  hasDamageEffects(ability: Ability): boolean {
    return !!ability.effects.damage;
  }

  hasHealEffects(ability: Ability): boolean {
    return !!ability.effects.heal;
  }

  getStatModifiers(ability: Ability): any[] {
    return ability.effects.applyBuff?.statModifiers || [];
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
