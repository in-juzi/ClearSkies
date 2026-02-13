import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Quest, QuestCategory, ObjectiveType } from '@shared/types';
import QuestRegistry from '@be/data/quests/QuestRegistry';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss']
})
export class QuestsComponent {
  // All quests from registry
  allQuests: Quest[] = [];

  // Filtered quests for list display
  filteredQuests = signal<Quest[]>([]);

  // Selected quest for detail panel
  selectedQuest = signal<Quest | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterCategory = signal<'all' | QuestCategory>('all');
  filterRepeatable = signal<'all' | 'repeatable' | 'one-time'>('all');
  sortBy = signal<'name' | 'category' | 'autoAccept'>('name');

  // Enums for templates
  QuestCategory = QuestCategory;
  ObjectiveType = ObjectiveType;

  // Utility for templates
  Object = Object;

  constructor() {
    this.loadQuests();
  }

  loadQuests(): void {
    this.allQuests = QuestRegistry.getAllQuests();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allQuests];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(quest =>
        quest.name.toLowerCase().includes(search) ||
        quest.questId.toLowerCase().includes(search) ||
        quest.description.toLowerCase().includes(search)
      );
    }

    // Category filter
    const category = this.filterCategory();
    if (category !== 'all') {
      filtered = filtered.filter(quest => quest.category === category);
    }

    // Repeatable filter
    const repeatable = this.filterRepeatable();
    if (repeatable === 'repeatable') {
      filtered = filtered.filter(quest => quest.isRepeatable);
    } else if (repeatable === 'one-time') {
      filtered = filtered.filter(quest => !quest.isRepeatable);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'autoAccept':
          return Number(b.autoAccept) - Number(a.autoAccept);
        default:
          return 0;
      }
    });

    this.filteredQuests.set(filtered);
  }

  selectQuest(quest: Quest): void {
    this.selectedQuest.set(quest);
  }

  getCategoryColor(category: QuestCategory): string {
    const colors: Record<QuestCategory, string> = {
      [QuestCategory.TUTORIAL]: '#3b82f6', // blue
      [QuestCategory.SKILLS]: '#10b981', // green
      [QuestCategory.EXPLORATION]: '#f59e0b', // amber
      [QuestCategory.COMBAT]: '#ef4444', // red
      [QuestCategory.CRAFTING]: '#8b5cf6', // purple
      [QuestCategory.STORY]: '#ec4899', // pink
      [QuestCategory.OPTIONAL]: '#6b7280' // gray
    };
    return colors[category] || '#6b7280';
  }

  getObjectiveTypeIcon(type: ObjectiveType): string {
    const icons: Record<ObjectiveType, string> = {
      [ObjectiveType.GATHER]: 'shopping_basket',
      [ObjectiveType.CRAFT]: 'construction',
      [ObjectiveType.COMBAT]: 'swords',
      [ObjectiveType.ACQUIRE]: 'inventory',
      [ObjectiveType.VISIT]: 'location_on',
      [ObjectiveType.TALK]: 'chat'
    };
    return icons[type] || 'help';
  }

  hasRequirements(quest: Quest): boolean {
    return !!(
      quest.requirements.level ||
      quest.requirements.skills ||
      quest.requirements.quests ||
      quest.requirements.items ||
      quest.requirements.locations
    );
  }

  hasRewards(quest: Quest): boolean {
    return !!(
      quest.rewards.experience ||
      quest.rewards.items ||
      quest.rewards.gold ||
      quest.rewards.unlocks
    );
  }

  getExperienceRewards(quest: Quest): Array<{ skill: string; amount: number }> {
    if (!quest.rewards.experience) return [];
    return Object.entries(quest.rewards.experience).map(([skill, amount]) => ({
      skill,
      amount
    }));
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
