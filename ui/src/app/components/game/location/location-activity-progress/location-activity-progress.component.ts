import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../services/location.service';
import { SkillsService } from '../../../../services/skills.service';
import { ConfirmDialogService } from '../../../../services/confirm-dialog.service';
import { ChatService } from '../../../../services/chat.service';
import { ActivityLogComponent, ActivityLogEntry } from '../../../shared/activity-log/activity-log.component';
import { SkillWithProgress, SkillName } from '../../../../models/user.model';
import { ActivityRewards } from '../../../../models/location.model';
import { SKILL_ICONS, SKILL_DISPLAY_NAMES } from '../../../../constants/game-data.constants';

@Component({
  selector: 'app-location-activity-progress',
  standalone: true,
  imports: [CommonModule, ActivityLogComponent],
  templateUrl: './location-activity-progress.component.html',
  styleUrl: './location-activity-progress.component.scss'
})
export class LocationActivityProgressComponent {
  private locationService = inject(LocationService);
  private skillsService = inject(SkillsService);
  private confirmDialog = inject(ConfirmDialogService);
  private chatService = inject(ChatService);

  // Expose skill constants for template
  skillIcons = SKILL_ICONS;
  skillNames = SKILL_DISPLAY_NAMES;

  // Exposed signals from service
  activeActivity = this.locationService.activeActivity;
  activityProgress = this.locationService.activityProgress;
  skills = this.skillsService.skills;
  currentLocation = this.locationService.currentLocation;

  // Local state
  lastRewards: ActivityRewards | null = null;
  activityLog = signal<ActivityLogEntry[]>([]);

  // Computed signal to get the skill being trained by current activity
  activeSkill = computed<{ name: string; skill: SkillWithProgress } | null>(() => {
    const activity = this.activeActivity();
    const location = this.currentLocation();
    const allSkills = this.skills();

    if (!activity?.activityId || !activity?.facilityId || !location || !allSkills) {
      return null;
    }

    // Find the facility in the current location
    const facility = location.facilities.find(f => f.facilityId === activity.facilityId);
    if (!facility?.activities) {
      return null;
    }

    // Find the full activity definition from the facility
    const fullActivity = facility.activities.find(a => a.activityId === activity.activityId);
    if (!fullActivity?.rewards?.experience) {
      return null;
    }

    // Get the first skill being trained (activities typically train one primary skill)
    const skillName = Object.keys(fullActivity.rewards.experience)[0];
    if (!skillName || !(skillName in allSkills)) {
      return null;
    }

    return {
      name: skillName,
      skill: allSkills[skillName as keyof typeof allSkills]
    };
  });

  // Computed signal to get the current activity name
  activeActivityName = computed<string | null>(() => {
    const activity = this.activeActivity();
    const location = this.currentLocation();

    if (!activity?.activityId || !activity?.facilityId || !location) {
      return null;
    }

    // Find the facility in the current location
    const facility = location.facilities.find(f => f.facilityId === activity.facilityId);
    if (!facility?.activities) {
      return null;
    }

    // Find the full activity definition from the facility
    const fullActivity = facility.activities.find(a => a.activityId === activity.activityId);
    return fullActivity?.name || null;
  });

  constructor() {
    // Subscribe to activity completion events
    this.locationService.activityCompleted$.subscribe(completion => {
      // Transform ActivityRewards to ActivityLogEntry format
      const logEntry: ActivityLogEntry = {
        timestamp: new Date(),
        activityName: completion.activityName,
        rewards: {
          items: completion.rewards.items || [],
          experience: completion.rewards.experience
            ? Object.entries(completion.rewards.experience).map(([skill, data]: [string, any]) => ({
                skill,
                xp: data.experience,
                leveledUp: data.leveledUp,
                newLevel: data.newLevel
              }))
            : [],
          attributes: completion.rewards.attributes
            ? Object.entries(completion.rewards.attributes).map(([attribute, data]: [string, any]) => ({
                attribute,
                xp: data.experience,
                leveledUp: data.leveledUp,
                newLevel: data.newLevel
              }))
            : [],
          gold: completion.rewards.gold
        }
      };

      // Add new entry to the beginning and keep only last 10 entries
      const currentLog = this.activityLog();
      const newLog = [logEntry, ...currentLog].slice(0, 10);
      this.activityLog.set(newLog);

      // Refresh skills after activity completion to update XP display
      this.skillsService.getSkills().subscribe();
    });
  }

  /**
   * Get XP needed to reach next level
   */
  getExperienceToNext(skill: SkillWithProgress): number {
    return this.skillsService.getExperienceToNext(skill);
  }

  /**
   * Get skill progress as a percentage (0-100)
   */
  getSkillProgressPercent(skill: SkillWithProgress): number {
    return this.skillsService.getSkillProgressPercent(skill);
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
   * Cancel the current activity
   */
  async cancelActivity() {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Cancel Activity',
      message: 'Are you sure you want to cancel this activity? Progress will be lost.',
      confirmLabel: 'Yes, Cancel',
      cancelLabel: 'No, Continue'
    });

    if (!confirmed) {
      return;
    }

    this.locationService.cancelActivity().then((response) => {
      this.logToChat(response.message, 'success');
    }).catch((err) => {
      this.logToChat(err.message || 'Failed to cancel activity', 'error');
    });
  }

  /**
   * Format time remaining in seconds to MM:SS
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get progress percentage for activity
   */
  getActivityProgressPercent(): number {
    const activity = this.activeActivity();
    const progress = this.activityProgress();

    if (!activity || !progress || !activity.startTime || !activity.endTime) {
      return 0;
    }

    // Calculate total duration from start/end times
    const start = new Date(activity.startTime).getTime();
    const end = new Date(activity.endTime).getTime();
    const totalDuration = (end - start) / 1000; // Convert to seconds

    // Calculate elapsed time based on remaining time from server
    const remainingTime = progress.remainingTime || 0;
    const elapsed = totalDuration - remainingTime;

    // Return percentage (elapsed / total * 100)
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  /**
   * Log a message to chat
   */
  private logToChat(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
    const prefix = type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ';
    this.chatService.addLocalMessage({
      userId: 'system',
      username: 'System',
      message: `${prefix}${message}`,
      createdAt: new Date()
    });
  }
}
