import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Monster } from '@shared/types';
import { MonsterRegistry } from '@be/data/monsters/MonsterRegistry';

@Component({
  selector: 'app-monsters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.scss']
})
export class MonstersComponent {
  // All monsters from registry
  allMonsters: Monster[] = [];

  // Filtered monsters for list display
  filteredMonsters = signal<Monster[]>([]);

  // Selected monster for detail panel
  selectedMonster = signal<Monster | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  sortBy = signal<'name' | 'level' | 'health' | 'damage'>('name');

  // Edit mode (disabled for now)
  editMode = signal(false);

  constructor() {
    this.loadMonsters();
  }

  loadMonsters(): void {
    this.allMonsters = MonsterRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allMonsters];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(monster =>
        monster.name.toLowerCase().includes(search) ||
        monster.monsterId.toLowerCase().includes(search)
      );
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'level':
          return a.level - b.level;
        case 'health':
          return this.getHealth(a) - this.getHealth(b);
        case 'damage':
          const aDmg = this.getAverageDamage(a);
          const bDmg = this.getAverageDamage(b);
          return aDmg - bDmg;
        default:
          return 0;
      }
    });

    this.filteredMonsters.set(filtered);
  }

  selectMonster(monster: Monster): void {
    this.selectedMonster.set(monster);
  }

  getAverageDamage(monster: Monster): number {
    const damageRoll = (monster.stats as any).damageRoll;
    if (!damageRoll) return 0;

    const parts = damageRoll.split('d');
    if (parts.length === 2) {
      const numDice = parseInt(parts[0]);
      const diceSize = parseInt(parts[1]);
      return (numDice * (diceSize + 1)) / 2; // Average roll
    }
    return 0;
  }

  getSkillKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  // Helper methods for optional properties
  getLoot(monster: Monster): any {
    return (monster as any).loot;
  }

  getIcon(monster: Monster): any {
    return (monster as any).icon;
  }

  getHealth(monster: Monster): number {
    return (monster.stats as any).health || 0;
  }

  getDamageRoll(monster: Monster): string {
    return (monster.stats as any).damageRoll || '0d0';
  }

  getAbilities(monster: Monster): string[] {
    return (monster as any).abilities || [];
  }

  // Stub methods for future editing functionality
  toggleEditMode(): void {
    console.log('Edit mode not yet implemented');
  }

  saveChanges(): void {
    console.log('Save functionality not yet implemented');
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }
}
