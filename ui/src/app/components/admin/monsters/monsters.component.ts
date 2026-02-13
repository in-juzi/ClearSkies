import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Monster, SkillName, AttributeName } from '@shared/types';
import { MonsterRegistry } from '@be/data/monsters/MonsterRegistry';
import { SKILL_DISPLAY_NAMES, SKILL_ICONS, ATTRIBUTE_ICONS } from '../../../constants/game-data.constants';

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

  // Constants for display
  skillIcons = SKILL_ICONS;
  skillNames = SKILL_DISPLAY_NAMES;
  attributeIcons = ATTRIBUTE_ICONS;

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
    const damageRoll = this.getDamageRoll(monster);
    if (!damageRoll || damageRoll === '0d0') return 0;

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
    return monster.stats.health.max || 0;
  }

  getDamageRoll(monster: Monster): string {
    return monster.equipment.weapon?.damageRoll || monster.equipment.natural?.damageRoll || '0d0';
  }

  getAbilities(monster: Monster): string[] {
    return (monster as any).abilities || [];
  }

  getSkills(monster: Monster): { name: SkillName; skill: { level: number; experience: number } }[] {
    if (!monster.skills) return [];
    return Object.entries(monster.skills).map(([name, skill]) => ({
      name: name as SkillName,
      skill
    }));
  }

  getAttributes(monster: Monster): { name: AttributeName; attribute: { level: number; experience: number } }[] {
    if (!monster.attributes) return [];
    return Object.entries(monster.attributes).map(([name, attr]) => ({
      name: name as AttributeName,
      attribute: attr
    }));
  }

  getSkillIcon(skillName: SkillName): string {
    return this.skillIcons[skillName as keyof typeof this.skillIcons] || 'assets/icons/ui/ui_question.svg';
  }

  getSkillDisplayName(skillName: SkillName): string {
    return this.skillNames[skillName as keyof typeof this.skillNames] || this.capitalizeFirst(skillName);
  }

  getAttributeIcon(attributeName: AttributeName): string {
    return this.attributeIcons[attributeName];
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getArmor(monster: Monster): number {
    return monster.combatStats.armor || 0;
  }

  getEvasion(monster: Monster): number {
    return monster.combatStats.evasion || 0;
  }

  getCritChance(monster: Monster): number {
    const weapon = monster.equipment.weapon || monster.equipment.natural;
    return weapon?.critChance || 0;
  }

  getAttackSpeed(monster: Monster): number {
    const weapon = monster.equipment.weapon || monster.equipment.natural;
    return weapon?.attackSpeed || 0;
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
