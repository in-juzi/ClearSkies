import { Component, Input, Output, EventEmitter, inject, computed, effect, viewChild, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicNode, Edge, EdgeChange, NodeChange, Vflow, VflowComponent } from 'ngx-vflow';
import { LocationService } from '../../../services/location.service';
import { QuestService } from '../../../services/quest.service';
import type { NavigationLink, NavigationRequirements } from '@shared/types';
import type { Location } from '../../../models/location.model';
import type { ActiveQuest } from '@shared/types';

// Edge data interface
interface TravelEdgeData {
  link: NavigationLink;
  travelTime: number;
  requirements: NavigationRequirements;
  available: boolean;
  label: string;
}

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule, Vflow],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.scss',
})
export class WorldMap implements OnInit {
  private locationService = inject(LocationService);
  private questService = inject(QuestService);

  @Input() mode: 'minimap' | 'fullscreen' = 'fullscreen';
  @Output() travelRequested = new EventEmitter<string>();

  // Get reference to vflow component
  vflow = viewChild(VflowComponent);

  // Signals from service
  currentLocation = this.locationService.currentLocation;
  discoveredLocations = this.locationService.discoveredLocations;
  travelState = this.locationService.travelState;

  // Signal for all locations (populated on init)
  allLocations = signal<Location[]>([]);

  // Signal for active quests (populated from service)
  activeQuests = signal<ActiveQuest[]>([]);

  // Computed: Transform locations to ngx-vflow nodes
  nodes = computed<any[]>(() => {
    const current = this.currentLocation();
    const quests = this.activeQuests();
    const nodes = this.allLocations()
      .filter(loc => loc.mapPosition) // Only show locations with coordinates
      .map(loc => ({
        id: loc.locationId,
        point: signal({ x: loc.mapPosition!.x, y: loc.mapPosition!.y }),
        type: 'html-template',
        data: signal({
          customType: 'gradient',
          location: loc,
          isCurrent: loc.locationId === current?.locationId,
          biome: loc.biome,
          hasQuestObjective: this.hasQuestObjectiveAt(loc.locationId, quests)
        }),
        draggable: signal(false),
      }));
    console.log(`Nodes:`, nodes);
    return nodes;
  });

  // Computed: Transform navigation links to edges
  edges = computed<Edge<TravelEdgeData>[]>(() => {
    const edges: Edge<TravelEdgeData>[] = [];
    const current = this.currentLocation();
    const allLocs = this.allLocations();

    // Create edges for all navigation links between all locations
    for (const sourceLocation of allLocs) {
      if (!sourceLocation.mapPosition || !sourceLocation.navigationLinks) continue;

      for (const link of sourceLocation.navigationLinks) {
        const targetLocation = allLocs.find(loc => loc.locationId === link.targetLocationId);

        // Only create edge if target location exists and has map position
        if (targetLocation?.mapPosition) {
          // Check if edge already exists (avoid duplicates)
          const edgeExists = edges.some(e =>
            (e.source === sourceLocation.locationId && e.target === targetLocation.locationId) ||
            (e.source === targetLocation.locationId && e.target === sourceLocation.locationId)
          );

          if (!edgeExists) {
            // Check if this edge is part of current location's navigation links
            const isCurrentLocationEdge = current?.navigationLinks?.some(
              navLink =>
                (navLink.targetLocationId === targetLocation.locationId && sourceLocation.locationId === current.locationId) ||
                (navLink.targetLocationId === sourceLocation.locationId && targetLocation.locationId === current.locationId)
            ) ?? false;

            const available = isCurrentLocationEdge && this.checkRequirements(link);

            edges.push({
              id: `${sourceLocation.locationId}-${targetLocation.locationId}`,
              source: sourceLocation.locationId,
              target: targetLocation.locationId,
              type: 'template',
              data: {
                link,
                travelTime: link.travelTime,
                requirements: link.requirements,
                available,
                label: link.name
              },
              floating: true
            });
          }
        }
      }
    }

    console.log(`Edges:`, edges);
    return edges;
  });

  constructor() {
    // Watch for edge selection changes
    effect(() => {
      const vflowComponent = this.vflow();
      if (!vflowComponent) return;

      const edgeChanges = vflowComponent.edgesChange();
      this.handleEdgeChanges(edgeChanges);
    });

    // Watch for node selection changes
    effect(() => {
      const vflowComponent = this.vflow();
      if (!vflowComponent) return;

      const nodeChanges = vflowComponent.nodesChange();
      this.handleNodeChanges(nodeChanges);
    });
  }

  ngOnInit(): void {
    // Fetch all locations for the map
    this.locationService.getAllLocations().subscribe({
      next: (response) => {
        this.allLocations.set(response.locations);

        // Fit view to current location after nodes are rendered
        setTimeout(() => {
          const vflowComponent = this.vflow();
          const current = this.currentLocation();
          if (vflowComponent && current?.mapPosition) {
            // Get all locations the player can travel to from current location
            const nodesInRange = [current.locationId];

            // Add all target locations from navigation links
            if (current.navigationLinks) {
              for (const link of current.navigationLinks) {
                nodesInRange.push(link.targetLocationId);
              }
            }

            vflowComponent.fitView({ nodes: nodesInRange, duration: 800 });
          }
        }, 500);
      },
      error: (err) => console.error('Failed to load all locations:', err)
    });

    // Subscribe to active quests
    this.questService.activeQuests$.subscribe(quests => {
      this.activeQuests.set(quests);
    });
  }

  /**
   * Check if navigation requirements are met
   */
  private checkRequirements(link: NavigationLink): boolean {
    // TODO: Implement actual requirement checking
    // For now, just return true if no requirements
    if (!link.requirements) return true;

    // Check if requirements object is empty
    const hasRequirements = Object.keys(link.requirements).length > 0;

    return !hasRequirements; // Simplified for now
  }

  /**
   * Check if a location has quest objectives
   */
  private hasQuestObjectiveAt(locationId: string, quests: ActiveQuest[]): boolean {
    for (const quest of quests) {
      // Check if quest definition has this location as a target
      // This is a simplified check - in a full implementation, you'd check objective requirements
      if ((quest as any).definition?.targetLocationId === locationId) {
        return true;
      }

      // Check if any objective mentions this location
      for (const objective of quest.objectives) {
        // Check if objective ID references this location
        const locationIdLower = locationId.toLowerCase();
        const objectiveIdLower = objective.objectiveId.toLowerCase();

        if (objectiveIdLower.includes(locationIdLower.replace(/_/g, ' '))) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get biome color for location node
   */
  getBiomeColor(biome: string): string {
    const colors: Record<string, string> = {
      sea: '#4e54c8',
      forest: '#2d6a4f',
      mountain: '#6c757d',
      plains: '#d4af37',
      desert: '#e76f51',
      swamp: '#3d5a3d'
    };
    return colors[biome] || '#4a4a6a';
  }

  /**
   * Handle node changes (selection)
   */
  handleNodeChanges(changes: NodeChange[]): void {
    // Only handle node clicks in minimap mode
    if (this.mode !== 'minimap') {
      return;
    }

    // Find selected node
    for (const change of changes) {
      if (change.type === 'select' && change.selected) {
        const node = this.nodes().find(n => n.id === change.id);
        if (node) {
          const targetLocationId = node.id;
          const current = this.currentLocation();

          // Don't travel if clicking current location
          if (targetLocationId === current?.locationId) {
            return;
          }

          // Check if this location is reachable from current location
          const canTravel = current?.navigationLinks?.some(
            link => link.targetLocationId === targetLocationId
          );

          if (canTravel) {
            console.log(targetLocationId)
            this.travelRequested.emit(targetLocationId);
          } else {
            console.log('Cannot travel to this location from current position');
          }
        }
      }
    }
  }

  /**
   * Handle edge changes (selection)
   */
  private handleEdgeChanges(changes: EdgeChange[]): void {
    // In minimap mode, don't handle edge clicks
    if (this.mode === 'minimap') {
      return;
    }

    // Find selected edge
    for (const change of changes) {
      if (change.type === 'select' && change.selected) {
        const edge = this.edges().find(e => e.id === change.id);
        if (edge?.data) {
          const targetLocationId = edge.target as string;

          // Check if travel is available
          if (edge.data.available) {
            this.travelRequested.emit(targetLocationId);
          } else {
            // TODO: Show requirements error
            console.log('Travel requirements not met:', edge.data.requirements);
          }
        }
      }
    }
  }
}
