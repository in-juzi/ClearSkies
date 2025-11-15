import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../services/location.service';
import { CombatService } from '../../../../services/combat.service';
import { Activity } from '../../../../models/location.model';
import { SkillName } from '../../../../models/user.model';
import { SKILL_ICONS, SKILL_DISPLAY_NAMES, formatEquipmentSubtype } from '../../../../constants/game-data.constants';

@Component({
  selector: 'app-location-activity-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-activity-detail.component.html',
  styleUrl: './location-activity-detail.component.scss'
})
export class LocationActivityDetailComponent {
  private locationService = inject(LocationService);
  combatService = inject(CombatService);

  // Inputs
  selectedActivity = input<Activity | null>(null);
  startingActivity = input<boolean>(false);

  // Outputs
  backRequested = output<void>();
  startRequested = output<void>();

  // Expose skill constants for template
  skillIcons = SKILL_ICONS;
  skillNames = SKILL_DISPLAY_NAMES;
  formatEquipmentSubtype = formatEquipmentSubtype;

  // Exposed signals from service
  inCombat = this.combatService.inCombat;

  /**
   * Check if activity has valid duration
   */
  hasValidDuration(activity: Activity | null): boolean {
    return !!(activity?.duration && activity.duration > 0);
  }

  /**
   * Get skill icon path
   */
  getSkillIcon(skillName: string | unknown): string {
    const name = String(skillName);
    return this.skillIcons[name as SkillName] || '';
  }

  /**
   * Get skill display name
   */
  getSkillDisplayName(skillName: string | unknown): string {
    const name = String(skillName);
    return this.skillNames[name as SkillName] || name;
  }

  /**
   * Check if activity has any requirements to display
   */
  hasRequirements(activity: Activity | null): boolean {
    if (!activity?.requirements) {
      return false;
    }

    const req = activity.requirements;

    // Check if any requirement type has entries
    const hasSkills = req.skills && Object.keys(req.skills).length > 0;
    const hasAttributes = req.attributes && Object.keys(req.attributes).length > 0;
    const hasEquipped = req.equipped && req.equipped.length > 0;
    const hasInventory = req.inventory && req.inventory.length > 0;

    return !!(hasSkills || hasAttributes || hasEquipped || hasInventory);
  }

  /**
   * Format requirement failure message to use skill display names
   */
  formatFailureMessage(failure: string): string {
    // Pattern: "Requires {skillName} level {number}"
    const skillMatch = failure.match(/Requires (\w+) level (\d+)/);
    if (skillMatch) {
      const [, skillName, level] = skillMatch;
      const displayName = this.getSkillDisplayName(skillName);
      return `Requires ${displayName} level ${level}`;
    }
    return failure;
  }

  /**
   * Go back to activity list
   */
  backToActivities() {
    this.backRequested.emit();
  }

  /**
   * Start the selected activity
   */
  startActivity() {
    this.startRequested.emit();
  }
}
