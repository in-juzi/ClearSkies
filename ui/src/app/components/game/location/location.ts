import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import { VendorService } from '../../../services/vendor.service';
import { Location, Facility, Activity, ActivityRewards } from '../../../models/location.model';
import { Vendor } from '../../../models/vendor.model';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { VendorComponent } from '../vendor/vendor.component';

@Component({
  selector: 'app-location',
  imports: [CommonModule, VendorComponent],
  templateUrl: './location.html',
  styleUrl: './location.scss',
  standalone: true
})
export class LocationComponent implements OnInit, OnDestroy {
  private confirmDialog = inject(ConfirmDialogService);
  private locationService = inject(LocationService);
  vendorService = inject(VendorService);

  // Exposed signals from service
  currentLocation = this.locationService.currentLocation;
  activeActivity = this.locationService.activeActivity;
  travelState = this.locationService.travelState;
  selectedFacility = this.locationService.selectedFacility;
  activityProgress = this.locationService.activityProgress;

  // Local state
  selectedActivity: Activity | null = null;
  lastRewards: ActivityRewards | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  activityLog: Array<{ timestamp: Date; rewards: ActivityRewards; activityName: string }> = [];
  facilityVendors: Map<string, Vendor> = new Map(); // Cache vendor data by vendorId

  ngOnInit() {
    // Load current location on component init
    this.locationService.getCurrentLocation().subscribe({
      error: (err) => {
        this.errorMessage = 'Failed to load location data';
        console.error('Error loading location:', err);
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
    });

    // Subscribe to activity error events
    this.locationService.activityError$.subscribe(error => {
      this.errorMessage = error.error;
      setTimeout(() => this.errorMessage = null, 5000);
    });
  }

  ngOnDestroy() {
    // Service handles cleanup of polling
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
   * Select a facility to view its activities and vendors
   */
  selectFacility(facility: Facility) {
    if (facility.stub) {
      this.successMessage = facility.stubMessage || 'This facility is not yet available';
      setTimeout(() => this.successMessage = null, 3000);
      return;
    }

    // Always load facility activities (vendors are shown alongside, not instead of)
    this.locationService.getFacility(facility.facilityId).subscribe({
      next: () => {
        this.selectedActivity = null;
        // Close any open vendor when switching facilities
        this.vendorService.closeVendor();

        // Load vendor data for this facility
        this.loadFacilityVendors(facility);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load facility';
        console.error('Error loading facility:', err);
      }
    });
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
        this.errorMessage = err.error?.message || 'Failed to load vendor';
        console.error('Error loading vendor:', err);
        setTimeout(() => this.errorMessage = null, 3000);
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
   * Go back to facility list
   */
  backToFacilities() {
    this.locationService.selectedFacility.set(null);
    this.selectedActivity = null;
    this.vendorService.closeVendor();
  }

  /**
   * Select an activity
   */
  selectActivity(activity: Activity) {
    this.selectedActivity = activity;
  }

  /**
   * Go back to activity list
   */
  backToActivities() {
    this.selectedActivity = null;
  }

  /**
   * Start the selected activity
   */
  startActivity() {
    if (!this.selectedActivity || !this.selectedFacility()) {
      return;
    }

    if (this.selectedActivity.stub) {
      this.successMessage = this.selectedActivity.stubMessage || 'This activity is not yet available';
      setTimeout(() => this.successMessage = null, 3000);
      return;
    }

    if (!this.selectedActivity.available) {
      this.errorMessage = 'Requirements not met for this activity';
      setTimeout(() => this.errorMessage = null, 3000);
      return;
    }

    this.locationService.startActivity(
      this.selectedActivity.activityId,
      this.selectedFacility()!.facilityId
    ).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.selectedActivity = null;
        this.locationService.selectedFacility.set(null);
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to start activity';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  /**
   * Complete the current activity
   */
  completeActivity() {
    this.locationService.completeActivity().subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.lastRewards = response.rewards || null;
        setTimeout(() => {
          this.successMessage = null;
          this.lastRewards = null;
        }, 5000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to complete activity';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
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

    this.locationService.cancelActivity().subscribe({
      next: (response) => {
        this.successMessage = response.message;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to cancel activity';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  /**
   * Cancel current travel
   */
  async cancelTravel() {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Cancel Travel',
      message: 'Are you sure you want to cancel travel? You will return to your previous location.',
      confirmLabel: 'Yes, Cancel',
      cancelLabel: 'No, Continue'
    });

    if (!confirmed) {
      return;
    }

    this.locationService.cancelTravel().subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.locationService.getCurrentLocation().subscribe(); // Refresh location
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to cancel travel';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  /**
   * Start traveling to a location
   */
  travel(targetLocationId: string) {
    this.locationService.startTravel(targetLocationId).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to start travel';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  /**
   * Skip travel (dev feature)
   */
  skipTravel() {
    this.locationService.skipTravel().subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Travel skipped to near completion';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to skip travel';
        setTimeout(() => this.errorMessage = null, 3000);
      }
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
   * Get progress percentage for travel
   */
  getTravelProgressPercent(): number {
    const travel = this.travelState();

    if (!travel || !travel.isTravel || !travel.startTime || !travel.endTime) {
      return 0;
    }

    const start = new Date(travel.startTime).getTime();
    const end = new Date(travel.endTime).getTime();
    const now = Date.now();

    const total = end - start;
    const elapsed = now - start;

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }
}
