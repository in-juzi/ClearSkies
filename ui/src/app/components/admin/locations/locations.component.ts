import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location, Facility } from '@shared/types';
import { LocationRegistry } from '@be/data/locations/LocationRegistry';
import { FacilityRegistry } from '@be/data/locations/FacilityRegistry';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
  // All locations from registry
  allLocations: Location[] = [];

  // Filtered locations for list display
  filteredLocations = signal<Location[]>([]);

  // Selected location for detail panel
  selectedLocation = signal<Location | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  selectedBiome = signal<string>('all');
  sortBy = signal<'name' | 'biome' | 'facilities'>('name');

  // Edit mode (disabled for now)
  editMode = signal(false);

  constructor() {
    this.loadLocations();
  }

  loadLocations(): void {
    this.allLocations = LocationRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allLocations];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(search) ||
        location.locationId.toLowerCase().includes(search)
      );
    }

    // Biome filter
    if (this.selectedBiome() !== 'all') {
      filtered = filtered.filter(location => location.biome === this.selectedBiome());
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'biome':
          return a.biome.localeCompare(b.biome);
        case 'facilities':
          return (b.facilities?.length || 0) - (a.facilities?.length || 0);
        default:
          return 0;
      }
    });

    this.filteredLocations.set(filtered);
  }

  selectLocation(location: Location): void {
    this.selectedLocation.set(location);
  }

  getBiomes(): string[] {
    const biomes = new Set(this.allLocations.map(loc => loc.biome));
    return ['all', ...Array.from(biomes).sort()];
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  // Helper methods for optional properties
  getCoordinates(location: Location): any {
    return (location as any).coordinates;
  }

  getRequiredItems(location: Location): any[] {
    return (location as any).requiredItems || [];
  }

  getIcon(location: Location): any {
    return (location as any).icon;
  }

  // Get full facility details from registry
  getFacility(facilityId: string): Facility | undefined {
    return FacilityRegistry.get(facilityId);
  }

  // Get facility type badge color
  getFacilityTypeClass(type: string): string {
    const typeMap: Record<string, string> = {
      'gathering': 'type-gathering',
      'crafting': 'type-crafting',
      'vendor': 'type-vendor',
      'combat': 'type-combat',
      'storage': 'type-storage',
      'housing': 'type-housing'
    };
    return typeMap[type] || 'type-default';
  }

  // Map facility icon names to actual icon paths
  getFacilityIconPath(iconName: string): string {
    const iconMap: Record<string, string> = {
      // Skill-based icons
      'smithing': 'skills/skill_blacksmithing.svg',
      'cooking': 'skills/skill_cooking.svg',
      'alchemy': 'skills/skill_alchemy.svg',
      'woodcutting': 'skills/skill_woodcutting.svg',
      'herbalism': 'skills/skill_herbalism.svg',
      'gathering': 'skills/skill_herbalism.svg',
      'construction': 'skills/skill_construction.svg',
      'farming': 'skills/skill_farming.svg',

      // Activity/UI icons
      'fishing': 'ui/ui_activity_fishing.svg',
      'mining': 'ui/ui_activity_mining.svg',
      'combat': 'ui/ui_activity_combat.svg',
      'vendor': 'ui/ui_vendor.svg',
      'storage': 'ui/ui_storage.svg',
      'bank': 'ui/ui_bank.svg',

      // Fallback to generic icon
      'default': 'ui/ui_placeholder.svg'
    };

    return iconMap[iconName.toLowerCase()] || iconMap['default'];
  }

  // Get material color for facility icon (based on type)
  getFacilityIconMaterial(type: string): string {
    const materialMap: Record<string, string> = {
      'gathering': 'nature',
      'crafting': 'iron',
      'vendor': 'gold',
      'combat': 'danger',
      'storage': 'sapphire',
      'housing': 'amethyst'
    };
    return materialMap[type] || 'generic';
  }

  // Stub methods for future editing functionality
  toggleEditMode(): void {
    console.log('Edit mode not yet implemented');
  }

  saveChanges(): void {
    console.log('Save functionality not yet implemented');
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }
}
