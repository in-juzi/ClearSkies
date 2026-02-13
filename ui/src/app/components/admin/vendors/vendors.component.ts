import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vendor } from '@shared/types';
import { VendorRegistry } from '@be/data/vendors/VendorRegistry';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent {
  // All vendors from registry
  allVendors: Vendor[] = [];

  // Filtered vendors for list display
  filteredVendors = signal<Vendor[]>([]);

  // Selected vendor for detail panel
  selectedVendor = signal<Vendor | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterBuyback = signal<'all' | 'accepts' | 'no-buyback'>('all');
  sortBy = signal<'name' | 'stockCount' | 'sellMultiplier'>('name');

  constructor() {
    this.loadVendors();
  }

  loadVendors(): void {
    this.allVendors = VendorRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allVendors];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(search) ||
        vendor.vendorId.toLowerCase().includes(search) ||
        vendor.description.toLowerCase().includes(search)
      );
    }

    // Buyback filter
    const buyback = this.filterBuyback();
    if (buyback === 'accepts') {
      filtered = filtered.filter(vendor => vendor.buyback || vendor.acceptsAllItems);
    } else if (buyback === 'no-buyback') {
      filtered = filtered.filter(vendor => !vendor.buyback && !vendor.acceptsAllItems);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stockCount':
          return b.stock.length - a.stock.length;
        case 'sellMultiplier':
          return b.sellPriceMultiplier - a.sellPriceMultiplier;
        default:
          return 0;
      }
    });

    this.filteredVendors.set(filtered);
  }

  selectVendor(vendor: Vendor): void {
    this.selectedVendor.set(vendor);
  }

  getStockTypeColor(stockType: string): string {
    return stockType === 'infinite' ? '#10b981' : '#f59e0b';
  }

  getSellPricePercentage(vendor: Vendor): number {
    return vendor.sellPriceMultiplier * 100;
  }

  getBuyPricePercentage(vendor: Vendor): number {
    return (vendor.buyPriceMultiplier || 1.0) * 100;
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
