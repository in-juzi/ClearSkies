import { Component, inject, input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LocationService } from '../../../../services/location.service';
import { VendorService } from '../../../../services/vendor.service';
import { CombatService } from '../../../../services/combat.service';
import { StorageService } from '../../../../services/storage.service';
import { QuestService } from '../../../../services/quest.service';
import { CraftingComponent } from '../../crafting/crafting.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { Facility, Activity } from '../../../../models/location.model';
import { Vendor } from '../../../../models/vendor.model';
import type { Quest } from '@shared/types';

@Component({
  selector: 'app-location-facility-detail',
  standalone: true,
  imports: [CommonModule, CraftingComponent, IconComponent],
  templateUrl: './location-facility-detail.component.html',
  styleUrl: './location-facility-detail.component.scss'
})
export class LocationFacilityDetailComponent implements OnInit, OnDestroy {
  private locationService = inject(LocationService);
  vendorService = inject(VendorService);
  combatService = inject(CombatService);
  storageService = inject(StorageService);
  private questService = inject(QuestService);

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

  // Quest signals
  availableQuests = signal<Quest[]>([]);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Subscribe to available quests
    this.subscriptions.push(
      this.questService.availableQuests$.subscribe(quests => {
        this.availableQuests.set(quests);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

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

  /**
   * Check if a vendor has available quests
   */
  hasAvailableQuests(vendorId: string): boolean {
    const quests = this.availableQuests();
    const vendor = this.getVendor(vendorId);

    if (!vendor || !quests || quests.length === 0) {
      return false;
    }

    // Check if any available quest mentions this vendor or is at this location
    for (const quest of quests) {
      // Check if quest definition references this vendor
      const questDef = (quest as any).definition;
      if (questDef?.questGiverId === vendorId) {
        return true;
      }

      // Check if quest name or description mentions the vendor name
      const vendorNameLower = vendor.name.toLowerCase();
      const questNameLower = quest.name?.toLowerCase() || '';
      const questDescLower = quest.description?.toLowerCase() || '';

      if (questNameLower.includes(vendorNameLower) || questDescLower.includes(vendorNameLower)) {
        return true;
      }
    }

    return false;
  }
}
