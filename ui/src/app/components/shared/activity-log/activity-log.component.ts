import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemMiniComponent } from '../item-mini/item-mini.component';
import { XpMiniComponent } from '../xp-mini/xp-mini.component';
import { SkillName, AttributeName } from '../../../models/user.model';
import { SKILL_DISPLAY_NAMES, ATTRIBUTE_DISPLAY_NAMES } from '../../../constants/game-data.constants';

export interface ActivityLogEntry {
  timestamp: Date;
  activityName: string;  // Recipe name, activity name, monster name
  activityType?: string; // 'crafting', 'gathering', 'combat', etc.
  rewards: {
    items?: Array<{
      itemId: string;
      name?: string;
      quantity: number;
      qualities?: { [key: string]: number };
      traits?: { [key: string]: number };
      definition?: any;
    }>;
    experience?: Array<{
      skill: string;
      xp: number;
      leveledUp?: boolean;
      newLevel?: number;
    }>;
    attributes?: Array<{
      attribute: string;
      xp: number;
      leveledUp?: boolean;
      newLevel?: number;
    }>;
    gold?: number;
  };
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, ItemMiniComponent, XpMiniComponent],
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent {
  // Inputs as signals
  entries = input<ActivityLogEntry[]>([]);
  maxEntries = input<number>(10);
  showTimestamp = input<boolean>(true);
  title = input<string>('Recent Completions');

  // Computed signal (replacing getter)
  visibleEntries = computed(() => {
    return this.entries().slice(0, this.maxEntries());
  });

  /**
   * Format skill name for display
   */
  getSkillDisplayName(skillName: string): string {
    const asSkill = skillName as SkillName;
    return SKILL_DISPLAY_NAMES[asSkill] || skillName;
  }

  /**
   * Format attribute name for display
   */
  getAttributeDisplayName(attributeName: string): string {
    const asAttribute = attributeName as AttributeName;
    return ATTRIBUTE_DISPLAY_NAMES[asAttribute] || attributeName;
  }
}
