import { Component, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../services/location.service';
import { VendorService } from '../../../../services/vendor.service';
import { CombatService } from '../../../../services/combat.service';
import { ChatService } from '../../../../services/chat.service';
import { Facility } from '../../../../models/location.model';

@Component({
  selector: 'app-location-facility-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-facility-list.component.html',
  styleUrl: './location-facility-list.component.scss'
})
export class LocationFacilityListComponent {
  private locationService = inject(LocationService);
  private chatService = inject(ChatService);
  vendorService = inject(VendorService);
  combatService = inject(CombatService);

  // Inputs
  startingActivity = input<boolean>(false);

  // Exposed signals from service
  currentLocation = this.locationService.currentLocation;
  selectedFacility = this.locationService.selectedFacility;
  inCombat = this.combatService.inCombat;

  // Outputs
  facilitySelected = output<Facility>();
  travelRequested = output<string>();

  /**
   * Select a facility to view its activities and vendors
   */
  selectFacility(facility: Facility) {
    if (facility.stub) {
      this.logToChat(facility.stubMessage || 'This facility is not yet available', 'info');
      return;
    }

    // Always load facility activities (vendors are shown alongside, not instead of)
    this.locationService.getFacility(facility.facilityId).subscribe({
      next: () => {
        // Emit to parent
        this.facilitySelected.emit(facility);
      },
      error: (err) => {
        this.logToChat('Failed to load facility', 'error');
        console.error('Error loading facility:', err);
      }
    });
  }

  /**
   * Start traveling to a location
   */
  travel(targetLocationId: string) {
    this.travelRequested.emit(targetLocationId);
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
