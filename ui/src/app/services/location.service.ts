import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import {
  Location,
  Facility,
  ActiveActivity,
  TravelState,
  ActivityRewards,
  LocationState
} from '../models/location.model';
import { DropTable } from '@shared/types';
import { SkillsService } from './skills.service';
import { AttributesService } from './attributes.service';
import { InventoryService } from './inventory.service';
import { SocketService } from './socket.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/locations`;
  private skillsService = inject(SkillsService);
  private attributesService = inject(AttributesService);
  private inventoryService = inject(InventoryService);
  private socketService = inject(SocketService);

  // Signals for reactive state
  currentLocation = signal<Location | null>(null);
  discoveredLocations = signal<Location[]>([]);
  activeActivity = signal<ActiveActivity | null>(null);
  travelState = signal<TravelState | null>(null);
  selectedFacility = signal<Facility | null>(null);
  activityProgress = signal<{ active: boolean; completed: boolean; remainingTime: number } | null>(null);

  // Observable for activity completion events
  activityCompleted$ = new Subject<{ rewards: ActivityRewards; activityName: string }>();

  // Observable for activity errors
  activityError$ = new Subject<{ error: string; message: string }>();

  // Progress update timer
  private progressTimer: any = null;

  // Travel progress timer
  private travelTimer: any = null;

  // Store last activity for auto-restart
  private lastActivityId: string | null = null;
  private lastFacilityId: string | null = null;

  /**
   * Get last facility ID (for combat restart)
   */
  getLastFacilityId(): string | null {
    return this.lastFacilityId;
  }

  constructor(private http: HttpClient) {
    // Set up socket event listeners when connected
    effect(() => {
      if (this.socketService.isConnected()) {
        this.setupSocketListeners();
      }
    });
  }

  /**
   * Start progress timer to update remaining time
   */
  private startProgressTimer(endTime: Date): void {
    // Clear any existing timer
    this.stopProgressTimer();

    // Update progress every second
    this.progressTimer = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

      const currentProgress = this.activityProgress();
      if (currentProgress) {
        this.activityProgress.set({
          ...currentProgress,
          remainingTime: remainingTime
        });

        // Stop timer when time is up
        if (remainingTime <= 0) {
          this.stopProgressTimer();
        }
      } else {
        this.stopProgressTimer();
      }
    }, 1000);
  }

  /**
   * Stop progress timer
   */
  private stopProgressTimer(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  /**
   * Start travel timer to update remaining time
   */
  private startTravelTimer(endTime: Date): void {
    // Clear any existing timer
    this.stopTravelTimer();

    // Update travel progress every second
    this.travelTimer = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

      const currentTravel = this.travelState();
      if (currentTravel && currentTravel.isTravel) {
        this.travelState.set({
          ...currentTravel,
          remainingTime: remainingTime
        });

        // Stop timer when time is up
        if (remainingTime <= 0) {
          this.stopTravelTimer();
        }
      } else {
        this.stopTravelTimer();
      }
    }, 1000);
  }

  /**
   * Stop travel timer
   */
  private stopTravelTimer(): void {
    if (this.travelTimer) {
      clearInterval(this.travelTimer);
      this.travelTimer = null;
    }
  }

  /**
   * Set up socket event listeners for activities and travel
   */
  private setupSocketListeners(): void {
    // Activity events
    this.socketService.on('activity:started', (data: any) => {
      const endTime = new Date(data.endTime);
      const remainingTime = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

      this.activeActivity.set({
        activityId: data.activityId,
        facilityId: this.activeActivity()?.facilityId || '',
        locationId: this.currentLocation()?.locationId || null,
        startTime: new Date(data.startTime || Date.now()),
        endTime: endTime
      });

      // Set activity progress so UI knows activity is active
      this.activityProgress.set({
        active: true,
        completed: false,
        remainingTime: remainingTime
      });

      // Start timer to update progress
      this.startProgressTimer(endTime);
    });

    this.socketService.on('activity:completed', (data: any) => {
      // Stop progress timer
      this.stopProgressTimer();

      // Refresh player data
      this.skillsService.getSkills().subscribe();
      this.attributesService.getAllAttributes().subscribe();
      this.inventoryService.getInventory().subscribe();

      // Emit completion event for UI notifications
      // Merge attributeUpdates into rewards for consistent structure
      this.activityCompleted$.next({
        rewards: {
          ...data.rewards,
          attributes: data.attributeUpdates || {}
        },
        activityName: data.activity
      });

      // Auto-restart if we have stored activity details
      if (this.lastActivityId && this.lastFacilityId) {
        // Don't clear active activity yet - keep it visible during auto-restart
        this.startActivity(this.lastActivityId, this.lastFacilityId).catch((error) => {
          console.error('Failed to auto-restart activity:', error);
          // Clear stored activity on error
          this.lastActivityId = null;
          this.lastFacilityId = null;
          // Only clear activity state if auto-restart failed
          this.activeActivity.set(null);
          this.activityProgress.set(null);
        });
      } else {
        // No auto-restart, clear active activity immediately
        this.activeActivity.set(null);
        this.activityProgress.set(null);
      }
    });

    this.socketService.on('activity:cancelled', (data: any) => {
      // Stop progress timer
      this.stopProgressTimer();

      // Clear stored activity (don't auto-restart cancelled activities)
      this.lastActivityId = null;
      this.lastFacilityId = null;

      this.activeActivity.set(null);
      this.activityProgress.set(null);
    });

    this.socketService.on('activity:error', (data: any) => {
      console.error('Activity error event:', data);

      // Stop progress timer
      this.stopProgressTimer();

      // Clear stored activity on error
      this.lastActivityId = null;
      this.lastFacilityId = null;

      this.activityError$.next({
        error: data.message,
        message: data.message
      });
      this.activeActivity.set(null);
      this.activityProgress.set(null);
    });

    // Travel events
    this.socketService.on('travel:started', (data: any) => {
      const endTime = new Date(data.endTime);
      const remainingTime = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

      this.travelState.set({
        isTravel: true,
        targetLocationId: data.destination,
        startTime: new Date(data.startTime || Date.now()),
        endTime: endTime,
        remainingTime: remainingTime
      });

      // Start timer to update travel progress
      this.startTravelTimer(endTime);
    });

    this.socketService.on('travel:completed', (data: any) => {
      // Stop travel timer
      this.stopTravelTimer();

      // Update current location
      this.getCurrentLocation().subscribe();

      // Clear facility selection when arriving at new location
      this.selectedFacility.set(null);

      // Clear travel state
      this.travelState.set({
        isTravel: false,
        targetLocationId: null,
        startTime: null,
        endTime: null,
        remainingTime: 0
      });
    });

    this.socketService.on('travel:cancelled', (data: any) => {
      // Stop travel timer
      this.stopTravelTimer();

      this.travelState.set({
        isTravel: false,
        targetLocationId: null,
        startTime: null,
        endTime: null,
        remainingTime: 0
      });
    });

    this.socketService.on('travel:error', (data: any) => {
      console.error('Travel error event:', data);

      // Stop travel timer
      this.stopTravelTimer();

      this.travelState.set({
        isTravel: false,
        targetLocationId: null,
        startTime: null,
        endTime: null,
        remainingTime: 0
      });
    });
  }

  /**
   * Get all discovered locations
   */
  getDiscoveredLocations(): Observable<{ locations: Location[] }> {
    return this.http.get<{ locations: Location[] }>(this.apiUrl).pipe(
      tap(response => this.discoveredLocations.set(response.locations))
    );
  }

  /**
   * Get all locations (including undiscovered)
   */
  getAllLocations(): Observable<{ locations: Location[] }> {
    return this.http.get<{ locations: Location[] }>(`${this.apiUrl}/all`);
  }

  /**
   * Get current location with full details
   */
  getCurrentLocation(): Observable<{ location: Location; currentActivity: ActiveActivity; travelState: TravelState }> {
    return this.http.get<{ location: Location; currentActivity: ActiveActivity; travelState: TravelState }>(
      `${this.apiUrl}/current`
    ).pipe(
      tap(response => {
        this.currentLocation.set(response.location);
        this.activeActivity.set(response.currentActivity);
        this.travelState.set(response.travelState);

        // Check status on reconnect/page load
        if (response.currentActivity?.activityId) {
          this.checkActivityStatus();
        }

        if (response.travelState?.isTravel && response.travelState.endTime) {
          // Start travel timer to update remaining time
          const endTime = new Date(response.travelState.endTime);
          const remainingTime = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

          // Update travel state with remaining time
          this.travelState.set({
            ...response.travelState,
            remainingTime: remainingTime
          });

          // Start timer
          this.startTravelTimer(endTime);
        }
      })
    );
  }

  /**
   * Get specific location details
   */
  getLocation(locationId: string): Observable<{ location: Location }> {
    return this.http.get<{ location: Location }>(`${this.apiUrl}/${locationId}`);
  }

  /**
   * Start traveling to a new location
   */
  async startTravel(targetLocationId: string): Promise<any> {
    try {
      const response = await this.socketService.emit('travel:start', { locationId: targetLocationId });

      if (!response.success) {
        throw new Error(response.message || 'Failed to start travel');
      }

      return response;
    } catch (error: any) {
      console.error('Error starting travel:', error);
      throw error;
    }
  }

  /**
   * Cancel travel
   */
  async cancelTravel(): Promise<any> {
    try {
      const response = await this.socketService.emit('travel:cancel', {});
      return response;
    } catch (error) {
      console.error('Error cancelling travel:', error);
      throw error;
    }
  }

  /**
   * Get facility details with activities
   */
  getFacility(facilityId: string): Observable<{ facility: Facility }> {
    return this.http.get<{ facility: Facility }>(`${this.apiUrl}/facilities/${facilityId}`).pipe(
      tap(response => this.selectedFacility.set(response.facility))
    );
  }

  /**
   * Start an activity
   */
  async startActivity(activityId: string, facilityId: string): Promise<any> {
    try {
      const response = await this.socketService.emit('activity:start', { activityId, facilityId });

      if (!response.success) {
        throw new Error(response.message || 'Failed to start activity');
      }

      // Store for auto-restart
      this.lastActivityId = activityId;
      this.lastFacilityId = facilityId;

      // Set active activity immediately (will be updated by socket event)
      // Note: Combat activities return 'combat' instead of 'activity' in the response
      if (response.activity) {
        this.activeActivity.set({
          activityId,
          facilityId,
          locationId: this.currentLocation()?.locationId || null,
          startTime: new Date(response.activity.startTime || Date.now()),
          endTime: new Date(response.activity.endTime)
        });
      } else if (response.combat) {
        // Combat activities don't set activeActivity - combat service handles this
      }

      return response;
    } catch (error: any) {
      console.error('Error starting activity:', error);
      throw error;
    }
  }

  /**
   * Cancel activity
   */
  async cancelActivity(): Promise<any> {
    try {
      const response = await this.socketService.emit('activity:cancel', {});

      if (response.success) {
        this.activeActivity.set(null);
        this.activityProgress.set(null);
      }

      return response;
    } catch (error) {
      console.error('Error cancelling activity:', error);
      throw error;
    }
  }

  /**
   * Check activity status (for reconnection)
   */
  async checkActivityStatus(): Promise<void> {
    try {
      const response = await this.socketService.emit('activity:getStatus', {});

      if (response.success && response.active) {
        // Update activity state from server
        this.activeActivity.set({
          activityId: response.activity.activityId,
          facilityId: this.activeActivity()?.facilityId || '',
          locationId: this.currentLocation()?.locationId || null,
          startTime: new Date(response.activity.startTime),
          endTime: new Date(response.activity.endTime)
        });
      } else if (response.success && !response.active) {
        // No active activity
        this.activeActivity.set(null);
        this.activityProgress.set(null);
      }
    } catch (error) {
      console.error('Error checking activity status:', error);
    }
  }

  /**
   * Get location state (for LocationComponent)
   */
  getLocationState(): Observable<LocationState> {
    return this.http.get<LocationState>(`${this.apiUrl}/state`);
  }

  /**
   * Get drop table with enriched item information
   */
  getDropTable(dropTableId: string): Observable<{ dropTable: DropTable & { enrichedDrops: any[] } }> {
    return this.http.get<{ dropTable: DropTable & { enrichedDrops: any[] } }>(
      `${this.apiUrl}/drop-tables/${dropTableId}`
    );
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    // Stop timers
    this.stopProgressTimer();
    this.stopTravelTimer();

    // Remove socket listeners
    this.socketService.off('activity:started');
    this.socketService.off('activity:completed');
    this.socketService.off('activity:cancelled');
    this.socketService.off('activity:error');
    this.socketService.off('travel:started');
    this.socketService.off('travel:completed');
    this.socketService.off('travel:cancelled');
    this.socketService.off('travel:error');
  }
}
