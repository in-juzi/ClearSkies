import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityUnion } from '@shared/types';
import { ActivityRegistry } from '@be/data/locations/ActivityRegistry';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
  // All activities from registry
  allActivities: ActivityUnion[] = [];

  // Filtered activities for list display
  filteredActivities = signal<ActivityUnion[]>([]);

  // Selected activity for detail panel
  selectedActivity = signal<ActivityUnion | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterType = signal<'all' | 'resource-gathering' | 'combat' | 'crafting'>('all');
  sortBy = signal<'name' | 'type' | 'duration'>('name');

  // Utility for templates
  Object = Object;

  constructor() {
    this.loadActivities();
  }

  loadActivities(): void {
    this.allActivities = ActivityRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allActivities];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(search) ||
        activity.activityId.toLowerCase().includes(search) ||
        activity.description.toLowerCase().includes(search)
      );
    }

    // Type filter
    const type = this.filterType();
    if (type !== 'all') {
      filtered = filtered.filter(activity => activity.type === type);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'duration':
          const durA = this.getActivityDuration(a);
          const durB = this.getActivityDuration(b);
          return durA - durB;
        default:
          return 0;
      }
    });

    this.filteredActivities.set(filtered);
  }

  selectActivity(activity: ActivityUnion): void {
    this.selectedActivity.set(activity);
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'resource-gathering': '#10b981', // green
      'combat': '#ef4444', // red
      'crafting': '#8b5cf6' // purple
    };
    return colors[type] || '#6b7280';
  }

  getActivityDuration(activity: ActivityUnion): number {
    // Combat activities don't have duration field
    return (activity as any).duration || 0;
  }

  hasRequirements(activity: ActivityUnion): boolean {
    const reqs = activity.requirements;
    return !!(
      reqs?.skills ||
      reqs?.equipped ||
      reqs?.inventory
    );
  }

  hasRewards(activity: ActivityUnion): boolean {
    // Combat activities have combatConfig instead of rewards
    if (activity.type === 'combat') {
      return !!(activity as any).combatConfig;
    }
    const rewards = (activity as any).rewards;
    return !!(rewards?.experience || rewards?.dropTables);
  }

  getExperienceRewards(activity: ActivityUnion): Array<{ skill: string; amount: number }> {
    const rewards = (activity as any).rewards;
    if (!rewards?.experience) return [];
    return Object.entries(rewards.experience).map(([skill, amount]) => ({
      skill,
      amount: amount as number
    }));
  }

  getDropTables(activity: ActivityUnion): string[] {
    const rewards = (activity as any).rewards;
    return rewards?.dropTables || [];
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getTypeDisplay(type: string): string {
    const displays: Record<string, string> = {
      'resource-gathering': 'Resource Gathering',
      'combat': 'Combat',
      'crafting': 'Crafting'
    };
    return displays[type] || type;
  }

  getEquipmentDisplay(item: any): string {
    return item.subtype || item.itemId || 'Unknown';
  }

  getCombatMonsterId(activity: ActivityUnion): string | undefined {
    return (activity as any).combatConfig?.monsterId;
  }
}
