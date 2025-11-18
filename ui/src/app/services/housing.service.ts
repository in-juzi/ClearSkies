/**
 * Housing Service
 * Handles property management and construction projects
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  Property,
  ConstructionProject,
  PropertyTier,
  PropertyTierConfig,
  ProjectType
} from '@shared/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/housing`;
  private socket: Socket | null = null;

  // Signals for reactive state
  properties = signal<Property[]>([]);
  maxProperties = signal<number>(1);
  activeProjects = signal<ConstructionProject[]>([]);
  locationProjects = signal<ConstructionProject[]>([]);
  propertyTiers = signal<Record<string, PropertyTierConfig>>({});
  currentProperty = signal<Property | null>(null);

  constructor() {
    this.connectSocket();
  }

  // ============================================================================
  // Socket Connection
  // ============================================================================

  private connectSocket() {
    const token = this.authService.getToken();
    if (!token) return;

    this.socket = io(environment.apiUrl.replace('/api', ''), {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Housing socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Housing socket disconnected');
    });

    // Listen for real-time project updates
    this.socket.on('construction:projectCreated', (data) => {
      console.log('New construction project created:', data.project);
      // Add to location projects if we're viewing that location
      const current = this.locationProjects();
      this.locationProjects.set([...current, data.project]);
    });

    this.socket.on('construction:projectProgress', (data) => {
      console.log('Construction progress update:', data);
      // Update project in location projects list
      this.updateProjectProgress(data.projectId, data.completedActions);
    });

    this.socket.on('construction:projectCompleted', (data) => {
      console.log('Construction project completed:', data);
      // Remove from active projects
      this.removeFromActiveProjects(data.projectId);
      // If this was our project, add property to list
      if (data.property) {
        this.loadPlayerProperties();
      }
    });

    this.socket.on('construction:projectAbandoned', (data) => {
      console.log('Construction project abandoned:', data.projectId);
      this.removeFromActiveProjects(data.projectId);
    });
  }

  // ============================================================================
  // HTTP Endpoints
  // ============================================================================

  /**
   * Load all properties owned by the player
   */
  async loadPlayerProperties(): Promise<void> {
    try {
      const response: any = await this.http.get(`${this.apiUrl}/properties`).toPromise();
      this.properties.set(response.properties || []);
      this.maxProperties.set(response.maxProperties || 1);
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  }

  /**
   * Get detailed information about a specific property
   */
  async getPropertyDetails(propertyId: string): Promise<Property | null> {
    try {
      const response: any = await this.http.get(`${this.apiUrl}/properties/${propertyId}`).toPromise();
      this.currentProperty.set(response.property);
      return response.property;
    } catch (error) {
      console.error('Failed to get property details:', error);
      return null;
    }
  }

  /**
   * Load property tier information
   */
  async loadPropertyTiers(): Promise<void> {
    try {
      const response: any = await this.http.get(`${this.apiUrl}/tiers`).toPromise();
      this.propertyTiers.set(response.tiers || {});
    } catch (error) {
      console.error('Failed to load property tiers:', error);
    }
  }

  /**
   * Purchase a plot of land
   */
  async purchasePlot(locationId: string, tier: PropertyTier): Promise<{ success: boolean; message?: string }> {
    try {
      const response: any = await this.http.post(`${this.apiUrl}/purchase-plot`, {
        locationId,
        tier
      }).toPromise();

      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Failed to purchase plot:', error);
      return { success: false, message: error.error?.message || 'Failed to purchase plot' };
    }
  }

  /**
   * Load player's construction projects
   */
  async loadPlayerProjects(status?: string): Promise<void> {
    try {
      const url = status ? `${this.apiUrl}/projects?status=${status}` : `${this.apiUrl}/projects`;
      const response: any = await this.http.get(url).toPromise();
      this.activeProjects.set(response.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  /**
   * Load active projects at a location
   */
  async loadLocationProjects(locationId: string): Promise<void> {
    try {
      const response: any = await this.http.get(`${this.apiUrl}/projects/location/${locationId}`).toPromise();
      this.locationProjects.set(response.projects || []);
    } catch (error) {
      console.error('Failed to load location projects:', error);
    }
  }

  /**
   * Abandon a construction project
   */
  async abandonProject(projectId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response: any = await this.http.post(`${this.apiUrl}/projects/abandon/${projectId}`, {}).toPromise();
      this.removeFromActiveProjects(projectId);
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Failed to abandon project:', error);
      return { success: false, message: error.error?.message || 'Failed to abandon project' };
    }
  }

  // ============================================================================
  // WebSocket Events
  // ============================================================================

  /**
   * Browse construction projects at a location
   */
  browseProjects(locationId: string): Promise<ConstructionProject[]> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('construction:browseProjects', { locationId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          this.locationProjects.set(response.projects || []);
          resolve(response.projects || []);
        }
      });
    });
  }

  /**
   * Create a new construction project
   */
  createProject(
    projectType: ProjectType,
    location: string,
    tier?: PropertyTier,
    propertyId?: string,
    roomType?: string
  ): Promise<ConstructionProject> {
    return new Promise((resolve, reject) => {
      const data: any = { projectType, location };
      if (tier) data.tier = tier;
      if (propertyId) data.propertyId = propertyId;
      if (roomType) data.roomType = roomType;

      this.socket?.emit('construction:createProject', data, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.project);
        }
      });
    });
  }

  /**
   * Join a construction project
   */
  joinProject(projectId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('construction:joinProject', { projectId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Contribute to a construction project
   */
  contribute(projectId: string, actionCount: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('construction:contribute', { projectId, actionCount }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Get project status
   */
  getProjectStatus(projectId: string): Promise<ConstructionProject> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('construction:getStatus', { projectId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.project);
        }
      });
    });
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private updateProjectProgress(projectId: string, completedActions: number) {
    // Update in location projects
    const projects = this.locationProjects();
    const updated = projects.map(p =>
      p.projectId === projectId ? { ...p, completedActions } : p
    );
    this.locationProjects.set(updated);

    // Update in active projects
    const activeProjects = this.activeProjects();
    const updatedActive = activeProjects.map(p =>
      p.projectId === projectId ? { ...p, completedActions } : p
    );
    this.activeProjects.set(updatedActive);
  }

  private removeFromActiveProjects(projectId: string) {
    const projects = this.activeProjects();
    this.activeProjects.set(projects.filter(p => p.projectId !== projectId));

    const locationProjects = this.locationProjects();
    this.locationProjects.set(locationProjects.filter(p => p.projectId !== projectId));
  }

  /**
   * Calculate progress percentage
   */
  getProgress(project: ConstructionProject): number {
    return Math.floor((project.completedActions / project.totalActions) * 100);
  }

  /**
   * Check if player can afford a tier
   */
  canAffordTier(tier: PropertyTier, playerGold: number, constructionLevel: number): boolean {
    const config = this.propertyTiers()[tier];
    if (!config) return false;

    return playerGold >= config.plotCost && constructionLevel >= config.requiredLevel;
  }

  disconnect() {
    this.socket?.disconnect();
  }
}
