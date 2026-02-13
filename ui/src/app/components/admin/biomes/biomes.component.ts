import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BiomeDefinition } from '@shared/types';
import { BiomeRegistry } from '@be/data/locations/BiomeRegistry';

@Component({
  selector: 'app-biomes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './biomes.component.html',
  styleUrls: ['./biomes.component.scss']
})
export class BiomesComponent {
  // All biomes from registry
  allBiomes: BiomeDefinition[] = [];

  // Filtered biomes for list display
  filteredBiomes = signal<BiomeDefinition[]>([]);

  // Selected biome for detail panel
  selectedBiome = signal<BiomeDefinition | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  sortBy = signal<'name' | 'biomeId'>('name');

  constructor() {
    this.loadBiomes();
  }

  loadBiomes(): void {
    this.allBiomes = BiomeRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allBiomes];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(biome =>
        biome.name.toLowerCase().includes(search) ||
        biome.biomeId.toLowerCase().includes(search) ||
        biome.description.toLowerCase().includes(search)
      );
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'biomeId':
          return a.biomeId.localeCompare(b.biomeId);
        default:
          return 0;
      }
    });

    this.filteredBiomes.set(filtered);
  }

  selectBiome(biome: BiomeDefinition): void {
    this.selectedBiome.set(biome);
  }

  getThemePreview(biome: BiomeDefinition): string {
    if (!biome.theme) return '';
    return `linear-gradient(135deg, ${biome.theme.primaryColor} 0%, ${biome.theme.secondaryColor} 100%)`;
  }

  hasTheme(biome: BiomeDefinition): boolean {
    return !!biome.theme;
  }

  getPrimaryColor(biome: BiomeDefinition): string {
    return biome.theme?.primaryColor || '#000000';
  }

  getSecondaryColor(biome: BiomeDefinition): string {
    return biome.theme?.secondaryColor || '#000000';
  }

  getAccentColor(biome: BiomeDefinition): string {
    return biome.theme?.accentColor || '#ffffff';
  }
}
