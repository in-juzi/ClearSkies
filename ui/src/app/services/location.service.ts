import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, tap, Subject } from 'rxjs';
import {
  Location,
  Facility,
  Activity,
  ActiveActivity,
  TravelState,
  ActivityRewards,
  LocationState
} from '../models/location.model';
import { SkillsService } from './skills.service';
import { AttributesService } from './attributes.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/api/locations';
  private skillsService = inject(SkillsService);
  private attributesService = inject(AttributesService);

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

  // Polling interval for checking activity/travel status (in milliseconds)
  private pollingInterval = 1000; // 1 second
  private activityPoll$: any;
  private travelPoll$: any;

  constructor(private http: HttpClient) {}

  /**
   * Get all discovered locations
   */
  getDiscoveredLocations(): Observable<{ locations: Location[] }> {
    return this.http.get<{ locations: Location[] }>(this.apiUrl).pipe(
      tap(response => this.discoveredLocations.set(response.locations))
    );
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

        // Start polling if activity is active
        if (response.currentActivity?.activityId) {
          this.startActivityPolling();
        }

        // Start polling if traveling
        if (response.travelState?.isTravel) {
          this.startTravelPolling();
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
  startTravel(targetLocationId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/travel`, { targetLocationId }).pipe(
      tap((response: any) => {
        this.travelState.set(response.travelState);
        this.startTravelPolling();
      })
    );
  }

  /**
   * Check travel status
   */
  getTravelStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/travel/status`).pipe(
      tap((response: any) => {
        if (response.completed) {
          this.stopTravelPolling();
          this.currentLocation.set(response.newLocation);
          this.travelState.set({ isTravel: false, targetLocationId: null, startTime: null, endTime: null });
        } else if (response.isTravel) {
          // Update travel state with remaining time
          this.travelState.set({
            ...response.travelState,
            remainingTime: response.remainingTime || 0
          });
        }
      })
    );
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
  startActivity(activityId: string, facilityId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activities/start`, { activityId, facilityId }).pipe(
      tap((response: any) => {
        this.activeActivity.set({
          activityId,
          facilityId,
          locationId: this.currentLocation()?.locationId || null,
          startTime: new Date(response.activity.startTime),
          endTime: new Date(response.activity.endTime)
        });
        this.startActivityPolling();
      })
    );
  }

  /**
   * Get current activity status
   */
  getActivityStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/activities/status`).pipe(
      tap((response: any) => {
        this.activityProgress.set({
          active: response.active,
          completed: response.completed,
          remainingTime: response.remainingTime || 0
        });

        // Automatically claim rewards and restart when completed
        if (response.completed) {
          this.completeActivity().subscribe({
            error: (err) => {
              // Emit error event for UI notification
              const errorMessage = err.error?.error || err.error?.message || 'Failed to complete activity';
              this.activityError$.next({
                error: errorMessage,
                message: err.error?.message || 'Activity stopped due to error'
              });

              // Cancel the activity on the server to ensure state is cleared
              this.http.post(`${this.apiUrl}/activities/cancel`, {}).subscribe({
                error: (cancelErr) => {
                  console.error('Error cancelling activity after error:', cancelErr);
                }
              });
            }
          });
        }
      })
    );
  }

  /**
   * Complete activity and claim rewards
   */
  completeActivity(): Observable<{ message: string; rewards?: ActivityRewards; stub?: boolean; activityRestarted?: boolean; newActivity?: any }> {
    return this.http.post<{ message: string; rewards?: ActivityRewards; stub?: boolean; activityRestarted?: boolean; newActivity?: any }>(
      `${this.apiUrl}/activities/complete`,
      {}
    ).pipe(
      tap({
        next: (response) => {
          // Refresh skills and attributes after claiming rewards
          this.skillsService.getSkills().subscribe();
          this.attributesService.getAllAttributes().subscribe();

          // Emit completion event with rewards if available
          if (response.rewards && response.newActivity) {
            this.activityCompleted$.next({
              rewards: response.rewards,
              activityName: response.newActivity.name || 'Unknown Activity'
            });
          }

          // If activity was restarted, update the active activity with new times
          if (response.activityRestarted && response.newActivity) {
            this.activeActivity.set({
              activityId: response.newActivity.activityId,
              facilityId: this.activeActivity()?.facilityId || null,
              locationId: this.currentLocation()?.locationId || null,
              startTime: new Date(response.newActivity.startTime),
              endTime: new Date(response.newActivity.endTime)
            });
            // Reset progress to show it's in progress again
            this.activityProgress.set({
              active: true,
              completed: false,
              remainingTime: response.newActivity.duration || 0
            });
            // Continue polling
            this.startActivityPolling();
          } else {
            // Activity not restarted (stub or error), clear state
            this.stopActivityPolling();
            this.activeActivity.set({
              activityId: null,
              facilityId: null,
              locationId: null,
              startTime: null,
              endTime: null
            });
            this.activityProgress.set(null);
          }
        },
        error: (error) => {
          // Handle errors (e.g., inventory full)
          console.error('Error completing activity:', error);

          // Stop the activity loop
          this.stopActivityPolling();
          this.activeActivity.set({
            activityId: null,
            facilityId: null,
            locationId: null,
            startTime: null,
            endTime: null
          });
          this.activityProgress.set(null);

          // Re-throw error so component can handle notification
          throw error;
        }
      })
    );
  }

  /**
   * Cancel current activity
   */
  cancelActivity(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/activities/cancel`, {}).pipe(
      tap(() => {
        this.stopActivityPolling();
        this.activeActivity.set({
          activityId: null,
          facilityId: null,
          locationId: null,
          startTime: null,
          endTime: null
        });
        this.activityProgress.set(null);
      })
    );
  }

  /**
   * Cancel current travel
   */
  cancelTravel(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/travel/cancel`, {}).pipe(
      tap(() => {
        this.stopTravelPolling();
        this.travelState.set({
          isTravel: false,
          targetLocationId: null,
          startTime: null,
          endTime: null
        });
      })
    );
  }

  /**
   * Skip travel (dev feature - sets endTime to 1 second from now)
   */
  skipTravel(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/travel/skip`, {}).pipe(
      tap((response: any) => {
        // Travel state will be updated by the polling
      })
    );
  }

  /**
   * Get all location definitions (admin/debug)
   */
  getAllDefinitions(): Observable<{ locations: Location[] }> {
    return this.http.get<{ locations: Location[] }>(`${this.apiUrl}/definitions/all`);
  }

  /**
   * Reload location data (admin/debug)
   */
  reloadDefinitions(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/definitions/reload`, {});
  }

  /**
   * Start polling for activity status
   */
  private startActivityPolling() {
    if (this.activityPoll$) {
      return; // Already polling
    }

    this.activityPoll$ = interval(this.pollingInterval).subscribe(() => {
      this.getActivityStatus().subscribe();
    });
  }

  /**
   * Stop polling for activity status
   */
  private stopActivityPolling() {
    if (this.activityPoll$) {
      this.activityPoll$.unsubscribe();
      this.activityPoll$ = null;
    }
  }

  /**
   * Start polling for travel status
   */
  private startTravelPolling() {
    if (this.travelPoll$) {
      return; // Already polling
    }

    this.travelPoll$ = interval(this.pollingInterval).subscribe(() => {
      this.getTravelStatus().subscribe();
    });
  }

  /**
   * Stop polling for travel status
   */
  private stopTravelPolling() {
    if (this.travelPoll$) {
      this.travelPoll$.unsubscribe();
      this.travelPoll$ = null;
    }
  }

  /**
   * Clean up when service is destroyed
   */
  ngOnDestroy() {
    this.stopActivityPolling();
    this.stopTravelPolling();
  }
}
