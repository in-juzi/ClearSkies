import { Component, OnInit, OnDestroy, inject, effect, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import { VendorService } from '../../../services/vendor.service';
import { InventoryService } from '../../../services/inventory.service';
import { ChatService } from '../../../services/chat.service';
import { SkillsService } from '../../../services/skills.service';
import { Location, Facility, Activity, ActivityRewards } from '../../../models/location.model';
import { Vendor } from '../../../models/vendor.model';
import { SkillWithProgress, SkillName } from '../../../models/user.model';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { VendorComponent } from '../vendor/vendor.component';
import { CombatComponent } from '../combat/combat.component';
import { LocationTravelComponent } from './location-travel/location-travel.component';
import { LocationFacilityListComponent } from './location-facility-list/location-facility-list.component';
import { LocationActivityProgressComponent } from './location-activity-progress/location-activity-progress.component';
import { LocationActivityDetailComponent } from './location-activity-detail/location-activity-detail.component';
import { LocationFacilityDetailComponent } from './location-facility-detail/location-facility-detail.component';
import { SKILL_ICONS, SKILL_DISPLAY_NAMES, formatEquipmentSubtype } from '../../../constants/game-data.constants';
import { CombatService } from '../../../services/combat.service';

@Component({
  selector: 'app-location',
  imports: [CommonModule, VendorComponent, CombatComponent, LocationTravelComponent, LocationFacilityListComponent, LocationActivityProgressComponent, LocationActivityDetailComponent, LocationFacilityDetailComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  standalone: true
})
export class LocationComponent implements OnInit, OnDestroy {
  private confirmDialog = inject(ConfirmDialogService);
  private locationService = inject(LocationService);
  private inventoryService = inject(InventoryService);
  private chatService = inject(ChatService);
  private skillsService = inject(SkillsService);
  combatService = inject(CombatService);
  vendorService = inject(VendorService);

  // Expose Object for template use
  Object = Object;

  // Expose skill constants for template
  skillIcons = SKILL_ICONS;
  skillNames = SKILL_DISPLAY_NAMES;
  formatEquipmentSubtype = formatEquipmentSubtype;

  // Exposed signals from service
  currentLocation = this.locationService.currentLocation;
  activeActivity = this.locationService.activeActivity;
  travelState = this.locationService.travelState;
  selectedFacility = this.locationService.selectedFacility;
  activityProgress = this.locationService.activityProgress;
  skills = this.skillsService.skills;
  activeCombat = this.combatService.activeCombat;
  inCombat = this.combatService.inCombat;

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

  // Local state
  selectedActivityId = signal<string | null>(null); // Store activityId instead of full Activity object
  startingActivity = signal<boolean>(false); // Track when activity start is pending
  cachedActivityForStarting = signal<Activity | null>(null); // Cache activity data during start transition
  lastRewards: ActivityRewards | null = null;
  activityLog: Array<{ timestamp: Date; rewards: ActivityRewards; activityName: string }> = [];
  facilityVendors: Map<string, Vendor> = new Map(); // Cache vendor data by vendorId
  private lastEquippedItems: string = '';
  private refreshTimeout: any = null;

  // Computed signal to get the selected activity from the facility (always fresh)
  selectedActivity = computed<Activity | null>(() => {
    const facility = this.selectedFacility();
    const activityId = this.selectedActivityId(); // Read from signal
    const isStarting = this.startingActivity();
    const cached = this.cachedActivityForStarting();

    // If we're starting and have cached data, use that
    if (isStarting && cached) {
      return cached;
    }

    if (!facility || !activityId || !facility.activities) {
      return null;
    }

    return facility.activities.find(a => a.activityId === activityId) || null;
  });

  constructor() {
    // Use effect to reactively update facility requirements when equipment changes
    effect(() => {
      const inventory = this.inventoryService.inventory();
      const currentFacility = this.selectedFacility();

      // Only track equipped items (not all inventory)
      const equippedItems = inventory
        .filter(item => item.equipped)
        .map(item => item.instanceId)
        .sort()
        .join(',');

      // Only refresh if facility is open AND equipped items changed
      if (currentFacility && currentFacility.facilityId && equippedItems !== this.lastEquippedItems) {
        this.lastEquippedItems = equippedItems;

        // Debounce to avoid spam (wait 500ms after last change)
        if (this.refreshTimeout) {
          clearTimeout(this.refreshTimeout);
        }

        this.refreshTimeout = setTimeout(() => {
          this.refreshFacilityRequirements(currentFacility.facilityId);
        }, 500);
      }
    });

    // Use effect to clean up when activity/combat actually starts
    effect(() => {
      const activeActivityState = this.activeActivity();
      const inCombatState = this.inCombat();
      const isStarting = this.startingActivity();
      const hasProgress = this.activityProgress();

      // If we're in "starting" state and activity has actually started with progress data, clean up
      // We wait for activityProgress to ensure the active activity view can render properly
      if (isStarting && activeActivityState?.activityId && hasProgress) {
        // Clear selections first, keep startingActivity true momentarily
        this.selectedActivityId.set(null);
        this.locationService.selectedFacility.set(null);

        // Clear startingActivity and cached data after a brief delay to ensure smooth transition
        setTimeout(() => {
          this.startingActivity.set(false);
          this.cachedActivityForStarting.set(null);
        }, 50);
      }

      // For combat, clear immediately when combat state is active
      if (isStarting && inCombatState) {
        this.selectedActivityId.set(null);
        this.locationService.selectedFacility.set(null);
        setTimeout(() => {
          this.startingActivity.set(false);
          this.cachedActivityForStarting.set(null);
        }, 50);
      }
    });
  }

  ngOnInit() {
    // Load current location on component init
    this.locationService.getCurrentLocation().subscribe({
      error: (err) => {
        this.logToChat('Failed to load location data', 'error');
        console.error('Error loading location:', err);
      }
    });

    // Load skills on component init
    this.skillsService.getSkills().subscribe({
      error: (err) => {
        console.error('Error loading skills:', err);
      }
    });

    // Subscribe to activity completion events
    this.locationService.activityCompleted$.subscribe(completion => {
      this.activityLog.unshift({
        timestamp: new Date(),
        rewards: completion.rewards,
        activityName: completion.activityName
      });

      // Keep only the last 10 entries
      if (this.activityLog.length > 10) {
        this.activityLog = this.activityLog.slice(0, 10);
      }

      // Refresh skills after activity completion to update XP display
      this.skillsService.getSkills().subscribe();
    });

    // Subscribe to activity error events
    this.locationService.activityError$.subscribe(error => {
      this.logToChat(error.error, 'error');
    });
  }

  ngOnDestroy() {
    // Service handles cleanup of polling

    // Clear refresh timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  /**
   * Get XP needed to reach next level
   */
  getExperienceToNext(experience: number): number {
    return this.skillsService.getExperienceToNext(experience);
  }

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
   * Format XP display with scaling information
   * @param skillName - Name of the skill
   * @param expResult - Experience result object from activity completion
   * @param rawExperience - Raw experience values before scaling
   * @returns Formatted string for UI display
   */
  formatXPDisplay(skillName: string, expResult: any, rawExperience?: { [key: string]: number }): string {
    const scaledXP = expResult.skill?.experience || expResult.experience;
    const rawXP = rawExperience?.[skillName];

    if (rawXP && rawXP !== scaledXP) {
      return `${skillName}: ${rawXP} XP → ${scaledXP} XP`;
    }
    return `${skillName}: +${scaledXP} XP`;
  }

  /**
   * Refresh facility requirements (silently re-fetch to update activity availability)
   */
  private refreshFacilityRequirements(facilityId: string) {
    this.locationService.getFacility(facilityId).subscribe({
      error: (err) => {
        // Silently fail - this is just a background refresh
        console.error('Failed to refresh facility requirements:', err);
      }
    });
  }

  /**
   * Handle facility selection from child component
   */
  onFacilitySelected(facility: Facility) {
    this.selectedActivityId.set(null);
    // Close any open vendor when switching facilities
    this.vendorService.closeVendor();

    // Load vendor data for this facility
    this.loadFacilityVendors(facility);
  }

  /**
   * Load vendor data for a facility
   */
  private loadFacilityVendors(facility: Facility) {
    const vendorIds = this.getVendorIds(facility);

    if (vendorIds.length === 0) {
      return;
    }

    // Load each vendor's data
    vendorIds.forEach(vendorId => {
      // Skip if already cached
      if (this.facilityVendors.has(vendorId)) {
        return;
      }

      this.vendorService.getVendor(vendorId).subscribe({
        next: (response) => {
          this.facilityVendors.set(vendorId, response.vendor);
          // Close the vendor immediately (we just want the data, not to open it)
          this.vendorService.closeVendor();
        },
        error: (err) => {
          console.error(`Failed to load vendor ${vendorId}:`, err);
        }
      });
    });
  }

  /**
   * Get vendor data from cache
   */
  getVendor(vendorId: string): Vendor | undefined {
    return this.facilityVendors.get(vendorId);
  }

  /**
   * Open vendor interface
   */
  openVendor(vendorId: string) {
    this.vendorService.getVendor(vendorId).subscribe({
      next: () => {
        // Vendor is loaded and signal is set by the service
      },
      error: (err) => {
        this.logToChat(err.error?.message || 'Failed to load vendor', 'error');
        console.error('Error loading vendor:', err);
      }
    });
  }

  /**
   * Close vendor and return to facility view
   */
  closeVendor() {
    this.vendorService.closeVendor();
  }

  /**
   * Get vendor IDs for a facility (supports both old vendorId and new vendorIds)
   */
  getVendorIds(facility: Facility | null): string[] {
    if (!facility) return [];

    // Support new vendorIds array
    if (facility.vendorIds && facility.vendorIds.length > 0) {
      return facility.vendorIds;
    }

    // Backward compatibility with old vendorId
    if (facility.vendorId) {
      return [facility.vendorId];
    }

    return [];
  }

  /**
   * Get crafting skill for a facility
   */
  getCraftingSkill(facility: Facility | null): string {
    if (!facility || !facility.craftingSkills || facility.craftingSkills.length === 0) {
      return 'cooking'; // Default to cooking
    }
    return facility.craftingSkills[0]; // Use first crafting skill
  }

  /**
   * Go back to facility list
   */
  backToFacilities() {
    this.locationService.selectedFacility.set(null);
    this.selectedActivityId.set(null);
    this.vendorService.closeVendor();
  }

  /**
   * Select an activity
   */
  selectActivity(activity: Activity) {
    this.selectedActivityId.set(activity.activityId);
  }

  /**
   * Go back to activity list
   */
  backToActivities() {
    this.selectedActivityId.set(null);
  }

  /**
   * Start the selected activity
   */
  startActivity() {
    const activity = this.selectedActivity();
    if (!activity || !this.selectedFacility()) {
      return;
    }

    if (activity.stub) {
      this.logToChat(activity.stubMessage || 'This activity is not yet available', 'info');
      return;
    }

    if (!activity.available) {
      this.logToChat('Requirements not met for this activity', 'error');
      return;
    }

    // Cache activity data for display during transition
    this.cachedActivityForStarting.set(activity);

    // Set starting state to prevent UI flash
    this.startingActivity.set(true);

    // All activities (including combat) now go through the activity system
    // Combat activities are detected server-side and delegated to combat service
    this.locationService.startActivity(
      activity.activityId,
      this.selectedFacility()!.facilityId
    ).then((response) => {
      this.logToChat(response.message, 'success');
      // Don't clear selections here - wait for activeActivity/inCombat signal to update
      // The effect in constructor will handle cleanup when activity/combat actually starts
    }).catch((err) => {
      this.logToChat(err.message || 'Failed to start activity', 'error');
      this.startingActivity.set(false);
      this.cachedActivityForStarting.set(null);
    });
  }

  /**
   * Complete the current activity
   * NOTE: With Socket.io, activities complete automatically via events
   * This method is no longer needed but kept for reference
   */
  completeActivity() {
    // Activities now complete automatically via socket events
    // The activityCompleted$ observable in locationService handles rewards display
    console.log('completeActivity() called but activities now auto-complete via sockets');
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
   * Flee from combat or return to facility (after combat ends)
   */
  async fleeCombat() {
    // If combat has ended, just dismiss without confirmation
    if (this.combatService.combatEnded()) {
      this.combatService.dismissCombat();
      return;
    }

    // Active combat - show confirmation dialog
    const confirmed = await this.confirmDialog.confirm({
      title: 'Flee from Combat',
      message: 'Are you sure you want to flee? You will not receive any rewards.',
      confirmLabel: 'Yes, Flee',
      cancelLabel: 'No, Continue Fighting'
    });

    if (!confirmed) {
      return;
    }

    this.combatService.flee().then((response: any) => {
      this.logToChat(response.message || 'You fled from combat!', 'success');
    }).catch((err: any) => {
      this.logToChat(err.message || 'Failed to flee from combat', 'error');
    });
  }

  /**
   * Start traveling to a location
   */
  travel(targetLocationId: string) {
    this.locationService.startTravel(targetLocationId).then((response) => {
      this.logToChat(response.message, 'success');
    }).catch((err) => {
      this.logToChat(err.message || 'Failed to start travel', 'error');
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
   * Log a message to chat instead of showing UI message
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
