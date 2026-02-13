import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Facility } from '@shared/types';
import { FacilityRegistry } from '@be/data/locations/FacilityRegistry';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent {
  // All facilities from registry
  allFacilities: Facility[] = [];

  // Filtered facilities for list display
  filteredFacilities = signal<Facility[]>([]);

  // Selected facility for detail panel
  selectedFacility = signal<Facility | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterType = signal<'all' | 'crafting' | 'trading' | 'bank' | 'gathering'>('all');
  sortBy = signal<'name' | 'type' | 'vendorCount'>('name');

  constructor() {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.allFacilities = FacilityRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allFacilities];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(search) ||
        facility.facilityId.toLowerCase().includes(search) ||
        facility.description.toLowerCase().includes(search)
      );
    }

    // Type filter
    const type = this.filterType();
    if (type !== 'all') {
      filtered = filtered.filter(facility => facility.type === type);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'vendorCount':
          return this.getVendorCount(b) - this.getVendorCount(a);
        default:
          return 0;
      }
    });

    this.filteredFacilities.set(filtered);
  }

  selectFacility(facility: Facility): void {
    this.selectedFacility.set(facility);
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'crafting': '#8b5cf6', // purple
      'trading': '#f59e0b', // amber
      'bank': '#3b82f6', // blue
      'gathering': '#10b981' // green
    };
    return colors[type] || '#6b7280';
  }

  getVendorCount(facility: Facility): number {
    return facility.vendorIds?.length || 0;
  }

  getCraftingSkillsCount(facility: Facility): number {
    return facility.craftingSkills?.length || 0;
  }

  hasVendors(facility: Facility): boolean {
    return !!facility.vendorIds && facility.vendorIds.length > 0;
  }

  hasCraftingSkills(facility: Facility): boolean {
    return !!facility.craftingSkills && facility.craftingSkills.length > 0;
  }

  hasActivities(facility: Facility): boolean {
    return !!facility.activities && facility.activities.length > 0;
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getTypeDisplay(type: string): string {
    const displays: Record<string, string> = {
      'crafting': 'Crafting',
      'trading': 'Trading',
      'bank': 'Bank',
      'gathering': 'Gathering'
    };
    return displays[type] || type;
  }
}
