/**
 * Housing Component
 * Displays player properties and construction projects
 */

import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingService } from '../../../services/housing.service';
import { LocationService } from '../../../services/location.service';
import { InventoryService } from '../../../services/inventory.service';
import { Property, ConstructionProject, PropertyTier } from '@shared/types';

@Component({
  selector: 'app-housing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './housing.component.html',
  styleUrls: ['./housing.component.scss']
})
export class HousingComponent implements OnInit, OnDestroy {
  private housingService = inject(HousingService);
  private locationService = inject(LocationService);
  private inventoryService = inject(InventoryService);

  // Reactive state
  properties = this.housingService.properties;
  maxProperties = this.housingService.maxProperties;
  propertyTiers = this.housingService.propertyTiers;
  currentLocation = this.locationService.currentLocation;
  playerGold = this.inventoryService.gold;

  // Property tier options for template
  availableTiers: PropertyTier[] = ['cottage', 'house', 'manor', 'estate', 'grand-estate'];

  selectedView = signal<'properties' | 'purchase' | 'projects'>('properties');
  selectedProperty = signal<Property | null>(null);
  selectedTier = signal<PropertyTier>('cottage');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      await Promise.all([
        this.housingService.loadPlayerProperties(),
        this.housingService.loadPropertyTiers(),
        this.housingService.loadPlayerProjects('in-progress')
      ]);
    } catch (error) {
      console.error('Failed to load housing data:', error);
      this.errorMessage.set('Failed to load housing data');
    } finally {
      this.isLoading.set(false);
    }
  }

  selectView(view: 'properties' | 'purchase' | 'projects') {
    this.selectedView.set(view);
    this.errorMessage.set(null);
  }

  async viewProperty(property: Property) {
    this.selectedProperty.set(property);
    this.selectedView.set('properties');
  }

  async purchasePlot() {
    const location = this.currentLocation();
    const tier = this.selectedTier();

    if (!location || !location.locationId) {
      this.errorMessage.set('You must be at a location to purchase a plot');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.housingService.purchasePlot(location.locationId, tier);

      if (result.success) {
        // Plot purchased, now create the construction project
        await this.housingService.createProject('house', location.locationId, tier);
        this.errorMessage.set('Plot purchased! Construction project started.');
        this.selectView('projects');
        await this.loadData();
      } else {
        this.errorMessage.set(result.message || 'Failed to purchase plot');
      }
    } catch (error: any) {
      console.error('Error purchasing plot:', error);
      this.errorMessage.set(error.message || 'Failed to purchase plot');
    } finally {
      this.isLoading.set(false);
    }
  }

  canAffordTier(tier: PropertyTier): boolean {
    const tiers = this.propertyTiers();
    const tierConfig = tiers[tier];
    const gold = this.playerGold();

    if (!tierConfig) return false;
    return gold >= tierConfig.plotCost;
  }

  getTierRequirementText(tier: PropertyTier): string {
    const tiers = this.propertyTiers();
    const tierConfig = tiers[tier];

    if (!tierConfig) return '';

    return `Level ${tierConfig.requiredLevel} Construction, ${tierConfig.plotCost}g`;
  }

  getTierDisplayName(tier: PropertyTier): string {
    const names: Record<PropertyTier, string> = {
      'cottage': 'Cottage',
      'house': 'House',
      'manor': 'Manor',
      'estate': 'Estate',
      'grand-estate': 'Grand Estate'
    };
    return names[tier] || tier;
  }

  getPropertyCapacityText(property: Property): string {
    const tiers = this.propertyTiers();
    const tierConfig = tiers[property.tier];

    if (!tierConfig) return '';

    return `Rooms: ${property.rooms.length}/${tierConfig.maxRooms} | Storage: ${property.storageContainers.length}/${tierConfig.maxStorage} | Gardens: ${property.gardens.length}/${tierConfig.maxGardens}`;
  }
}
