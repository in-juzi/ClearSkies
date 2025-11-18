import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingService } from '../../../services/housing.service';
import { LocationService } from '../../../services/location.service';
import { InventoryService } from '../../../services/inventory.service';
import { ConstructionProject, PropertyTierConfig } from '@shared/types';

@Component({
  selector: 'app-construction-browser',
  imports: [CommonModule],
  templateUrl: './construction-browser.html',
  styleUrl: './construction-browser.scss',
})
export class ConstructionBrowserComponent implements OnInit, OnDestroy {
  private housingService = inject(HousingService);
  private locationService = inject(LocationService);
  private inventoryService = inject(InventoryService);

  // Make Object available in template
  Object = Object;

  // State
  projects = signal<ConstructionProject[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  isContributing = signal<string | null>(null); // Track which project is being contributed to

  // Current player context
  currentLocation = computed(() => this.locationService.currentLocation());
  playerGold = computed(() => this.inventoryService.gold());

  ngOnInit(): void {
    this.loadProjects();
    // Real-time project updates are handled by the housing service via Socket.io
  }

  ngOnDestroy(): void {
    // Cleanup handled by housing service
  }

  async loadProjects(): Promise<void> {
    const location = this.currentLocation();
    if (!location) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.housingService.loadLocationProjects(location.locationId);
      this.projects.set(this.housingService.locationProjects());
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load construction projects');
    } finally {
      this.loading.set(false);
    }
  }

  async joinProject(projectId: string): Promise<void> {
    try {
      await this.housingService.joinProject(projectId);
      // Success handled by service
    } catch (err: any) {
      this.error.set(err.message || 'Failed to join project');
    }
  }

  async contribute(projectId: string, actionCount: number = 1): Promise<void> {
    this.isContributing.set(projectId);
    this.error.set(null);

    try {
      const result = await this.housingService.contribute(projectId, actionCount);

      if (result.completed) {
        // Project completed - reload list
        await this.loadProjects();
      }
    } catch (err: any) {
      this.error.set(err.message || 'Failed to contribute to project');
    } finally {
      this.isContributing.set(null);
    }
  }

  async abandonProject(projectId: string): Promise<void> {
    if (!confirm('Are you sure you want to abandon this project? You will receive partial refunds.')) {
      return;
    }

    try {
      await this.housingService.abandonProject(projectId);
      await this.loadProjects();
    } catch (err: any) {
      this.error.set(err.message || 'Failed to abandon project');
    }
  }

  // Helper methods for display
  getProgressPercent(project: ConstructionProject): number {
    return Math.floor((project.completedActions / project.totalActions) * 100);
  }

  getTierDisplayName(tier: string): string {
    return tier.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getProjectTypeDisplayName(type: string): string {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getMaterialName(itemId: string): string {
    return itemId.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  canContribute(project: ConstructionProject): boolean {
    return project.status === 'in-progress' && !this.isContributing();
  }

  isPlayerOwner(project: ConstructionProject): boolean {
    // Compare ownerId with current player's userId
    // This will need player context from auth service
    return false; // Placeholder
  }

  getContributorCount(project: ConstructionProject): number {
    return Object.keys(project.contributors).length;
  }

  getMaterialProgress(project: ConstructionProject): Array<{ itemId: string; name: string; contributed: number; required: number; percent: number }> {
    const materials: Array<{ itemId: string; name: string; contributed: number; required: number; percent: number }> = [];

    for (const [itemId, requirement] of Object.entries(project.requiredMaterials)) {
      materials.push({
        itemId,
        name: this.getMaterialName(itemId),
        contributed: requirement.contributed,
        required: requirement.required,
        percent: Math.floor((requirement.contributed / requirement.required) * 100)
      });
    }

    return materials;
  }
}
