import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillName, AttributeName } from '../../../models/user.model';
import { SKILL_DISPLAY_NAMES, ATTRIBUTE_DISPLAY_NAMES } from '../../../constants/game-data.constants';

@Component({
  selector: 'app-xp-mini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xp-mini.component.html',
  styleUrls: ['./xp-mini.component.scss']
})
export class XpMiniComponent {
  @Input() skillName?: string; // Skill or attribute name (e.g., 'woodcutting', 'strength')
  @Input() xp!: number; // XP amount gained
  @Input() rawXp?: number; // Raw XP before scaling (optional)
  @Input() showIcon: boolean = true; // Show star icon (⭐)
  @Input() showSkillName: boolean = true; // Show skill/attribute name
  @Input() showScaling: boolean = true; // Show raw → scaled XP (if different)
  @Input() icon: string = '⭐'; // Default icon emoji
  @Input() compact: boolean = false; // Compact mode (smaller text, no line breaks)

  // Check if XP was scaled (raw different from final)
  get wasScaled(): boolean {
    return this.showScaling && this.rawXp !== undefined && this.rawXp !== this.xp;
  }

  // Format skill name for display using centralized constants
  get formattedSkillName(): string {
    if (!this.skillName) return '';

    // Try to use centralized display names first
    const asSkill = this.skillName as SkillName;
    if (asSkill in SKILL_DISPLAY_NAMES) {
      return SKILL_DISPLAY_NAMES[asSkill];
    }

    const asAttribute = this.skillName as AttributeName;
    if (asAttribute in ATTRIBUTE_DISPLAY_NAMES) {
      return ATTRIBUTE_DISPLAY_NAMES[asAttribute];
    }

    // Fallback to camelCase conversion for unknown names
    return this.skillName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  }
}
