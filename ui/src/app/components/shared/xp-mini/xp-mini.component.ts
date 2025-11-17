import { Component, input, computed } from '@angular/core';
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
  // Inputs as signals
  skillName = input<string>(); // Skill or attribute name (e.g., 'woodcutting', 'strength')
  xp = input.required<number>(); // XP amount gained
  rawXp = input<number>(); // Raw XP before scaling (optional)
  showIcon = input<boolean>(true); // Show star icon (⭐)
  showSkillName = input<boolean>(true); // Show skill/attribute name
  showScaling = input<boolean>(true); // Show raw → scaled XP (if different)
  icon = input<string>('⭐'); // Default icon emoji
  compact = input<boolean>(false); // Compact mode (smaller text, no line breaks)

  // Computed signals (replacing getters)
  wasScaled = computed(() => {
    return this.showScaling() && this.rawXp() !== undefined && this.rawXp() !== this.xp();
  });

  formattedSkillName = computed(() => {
    const skillNameValue = this.skillName();
    if (!skillNameValue) return '';

    // Try to use centralized display names first
    const asSkill = skillNameValue as SkillName;
    if (asSkill in SKILL_DISPLAY_NAMES) {
      return SKILL_DISPLAY_NAMES[asSkill];
    }

    const asAttribute = skillNameValue as AttributeName;
    if (asAttribute in ATTRIBUTE_DISPLAY_NAMES) {
      return ATTRIBUTE_DISPLAY_NAMES[asAttribute];
    }

    // Fallback to camelCase conversion for unknown names
    return skillNameValue
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  });
}
