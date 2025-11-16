import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../services/location.service';
import { VendorService } from '../../../../services/vendor.service';
import { CombatService } from '../../../../services/combat.service';
import { StorageService } from '../../../../services/storage.service';
import { CraftingComponent } from '../../crafting/crafting.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { Facility, Activity } from '../../../../models/location.model';
import { Vendor } from '../../../../models/vendor.model';

@Component({
  selector: 'app-location-facility-detail',
  standalone: true,
  imports: [CommonModule, CraftingComponent, IconComponent],
  templateUrl: './location-facility-detail.component.html',
  styleUrl: './location-facility-detail.component.scss'
})
export class LocationFacilityDetailComponent {
  private locationService = inject(LocationService);
  vendorService = inject(VendorService);
  combatService = inject(CombatService);
  storageService = inject(StorageService);

  // Inputs
  selectedFacility = input<Facility | null>(null);
  selectedActivityId = input<string | null>(null);
  startingActivity = input<boolean>(false);
  facilityVendors = input<Map<string, Vendor>>(new Map());

  // Outputs
  backRequested = output<void>();
  vendorOpenRequested = output<string>();
  activitySelected = output<Activity>();

  // Exposed signals from service
  inCombat = this.combatService.inCombat;

  /**
   * Get vendor IDs for a facility
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
   * Get vendor data from cache
   */
  getVendor(vendorId: string): Vendor | undefined {
    return this.facilityVendors().get(vendorId);
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
    this.backRequested.emit();
  }

  /**
   * Open vendor interface
   */
  openVendor(vendorId: string) {
    this.vendorOpenRequested.emit(vendorId);
  }

  /**
   * Select an activity
   */
  selectActivity(activity: Activity) {
    this.activitySelected.emit(activity);
  }

  /**
   * Open bank interface
   */
  openBank() {
    this.storageService.openStorage('bank');
  }
}
