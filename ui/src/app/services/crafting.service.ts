import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActiveCrafting, CraftingResult } from '../models/recipe.model';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class CraftingService {
  private apiUrl = `${environment.apiUrl}/crafting`;
  private timerInterval: any;
  private inventoryService = inject(InventoryService);

  // Signals for reactive state
  activeCrafting = signal<ActiveCrafting | null>(null);
  remainingTime = signal<number>(0);
  isCrafting = signal<boolean>(false);
  lastResult = signal<CraftingResult | null>(null);

  constructor(private http: HttpClient) {
    // Auto-update remaining time every second
    effect(() => {
      const active = this.activeCrafting();
      if (active) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    });
  }

  /**
   * Start crafting a recipe
   */
  startCrafting(recipeId: string, selectedIngredients?: { [itemId: string]: string[] }): Observable<any> {
    const body: any = { recipeId };
    if (selectedIngredients) {
      body.selectedIngredients = selectedIngredients;
    }

    // Set isCrafting immediately to prevent UI flicker during auto-restart
    // This ensures the crafting panel stays visible during the HTTP request
    this.isCrafting.set(true);

    return this.http.post<any>(`${this.apiUrl}/start`, body).pipe(
      tap(response => {
        if (response.activeCrafting) {
          this.activeCrafting.set({
            recipeId: response.activeCrafting.recipeId,
            startTime: new Date(response.activeCrafting.startTime),
            endTime: new Date(response.activeCrafting.endTime),
            selectedIngredients: response.activeCrafting.selectedIngredients
          });
          // isCrafting already set above
          this.updateRemainingTime();
        } else {
          // If no active crafting in response, reset state
          this.isCrafting.set(false);
        }
      })
    );
  }

  /**
   * Complete active crafting
   */
  completeCrafting(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/complete`, {}).pipe(
      tap(response => {
        // Refresh inventory to show new items and removed ingredients
        // IMPORTANT: Do this BEFORE setting lastResult to ensure inventory updates
        // before any auto-restart logic runs
        this.inventoryService.getInventory().subscribe(() => {
          // Set lastResult after inventory refresh completes
          // This triggers auto-restart with updated inventory
          this.lastResult.set(response);
        });
      })
    );
  }

  /**
   * Cancel active crafting
   */
  cancelCrafting(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cancel`, {}).pipe(
      tap(() => {
        this.activeCrafting.set(null);
        this.isCrafting.set(false);
        this.remainingTime.set(0);
      })
    );
  }

  /**
   * Check if crafting is complete and auto-complete if ready
   */
  checkAndCompleteCrafting(): Observable<any> | null {
    const active = this.activeCrafting();
    if (!active) return null;

    const now = new Date();
    const endTime = new Date(active.endTime);

    if (now >= endTime) {
      return this.completeCrafting();
    }

    return null;
  }

  /**
   * Start timer to update remaining time
   */
  private startTimer(): void {
    this.stopTimer(); // Clear any existing timer

    this.timerInterval = setInterval(() => {
      this.updateRemainingTime();

      // Auto-complete when time is up
      if (this.remainingTime() <= 0) {
        const completion = this.checkAndCompleteCrafting();
        if (completion) {
          completion.subscribe();
        }
      }
    }, 1000);
  }

  /**
   * Stop timer
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Update remaining time signal
   */
  private updateRemainingTime(): void {
    const active = this.activeCrafting();
    if (!active) {
      this.remainingTime.set(0);
      return;
    }

    const now = new Date();
    const endTime = new Date(active.endTime);
    const remaining = Math.max(0, Math.ceil((endTime.getTime() - now.getTime()) / 1000));

    this.remainingTime.set(remaining);
  }

  /**
   * Clear last result
   */
  clearResult(): void {
    this.lastResult.set(null);
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    this.stopTimer();
  }
}
