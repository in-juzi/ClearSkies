import { Injectable, signal, effect, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ActiveCrafting, CraftingResult } from '../models/recipe.model';
import { InventoryService } from './inventory.service';
import { SkillsService } from './skills.service';
import { AttributesService } from './attributes.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class CraftingService {
  private inventoryService = inject(InventoryService);
  private skillsService = inject(SkillsService);
  private attributesService = inject(AttributesService);
  private socketService = inject(SocketService);

  // Signals for reactive state
  activeCrafting = signal<ActiveCrafting | null>(null);
  remainingTime = signal<number>(0);
  isCrafting = signal<boolean>(false);
  lastResult = signal<CraftingResult | null>(null);

  // Observable for crafting completion events
  craftingCompleted$ = new Subject<CraftingResult>();

  // Observable for crafting errors
  craftingError$ = new Subject<{ error: string; message: string }>();

  // Progress update timer
  private progressTimer: any = null;

  // Store last recipe for auto-restart
  private lastRecipeId: string | null = null;
  private lastSelectedIngredients: { [itemId: string]: string[] } | null = null;

  constructor() {
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

      this.remainingTime.set(remainingTime);

      // Stop timer when time is up
      if (remainingTime <= 0) {
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
   * Set up socket event listeners for crafting
   */
  private setupSocketListeners(): void {
    // Crafting events
    this.socketService.on('crafting:started', (data: any) => {
      console.log('Crafting started event:', data);
      const endTime = new Date(data.endTime);
      const remainingTime = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

      this.activeCrafting.set({
        recipeId: data.recipeId,
        startTime: new Date(data.startTime || Date.now()),
        endTime: endTime,
        selectedIngredients: {}
      });

      this.isCrafting.set(true);
      this.remainingTime.set(remainingTime);

      // Start timer to update progress
      this.startProgressTimer(endTime);
    });

    this.socketService.on('crafting:completed', (data: any) => {
      console.log('Crafting completed event:', data);

      // Stop progress timer
      this.stopProgressTimer();

      // Get the active crafting recipeId before clearing it
      const currentRecipeId = this.activeCrafting()?.recipeId;

      // Clear active crafting
      this.activeCrafting.set(null);
      this.isCrafting.set(false);
      this.remainingTime.set(0);

      // Refresh player data
      this.skillsService.getSkills().subscribe();
      this.attributesService.getAllAttributes().subscribe();
      this.inventoryService.getInventory().subscribe();

      // Construct proper CraftingResult object matching the interface
      const result: CraftingResult = {
        message: `Crafted ${data.recipeName}!`,
        output: data.result,
        experience: {
          skill: data.skillUpdate?.name || 'unknown',
          xp: data.xpGained || 0,
          skillResult: data.skillUpdate,
          attributeResult: data.attributeUpdate
        },
        recipe: {
          recipeId: currentRecipeId || 'unknown',
          name: data.recipeName
        }
      };

      this.lastResult.set(result);

      // Emit completion event for UI notifications
      this.craftingCompleted$.next(result);

      // Auto-restart if we have stored recipe details
      if (this.lastRecipeId) {
        this.startCrafting(this.lastRecipeId, this.lastSelectedIngredients || undefined).catch((error) => {
          console.error('Failed to auto-restart crafting:', error);
          // Clear stored recipe on error
          this.lastRecipeId = null;
          this.lastSelectedIngredients = null;
        });
      }
    });

    this.socketService.on('crafting:cancelled', (data: any) => {
      console.log('Crafting cancelled event:', data);

      // Stop progress timer
      this.stopProgressTimer();

      // Clear stored recipe (don't auto-restart cancelled crafting)
      this.lastRecipeId = null;
      this.lastSelectedIngredients = null;

      this.activeCrafting.set(null);
      this.isCrafting.set(false);
      this.remainingTime.set(0);
    });

    this.socketService.on('crafting:error', (data: any) => {
      console.error('Crafting error event:', data);

      // Stop progress timer
      this.stopProgressTimer();

      // Clear stored recipe on error
      this.lastRecipeId = null;
      this.lastSelectedIngredients = null;

      this.craftingError$.next({
        error: data.message,
        message: data.message
      });
      this.activeCrafting.set(null);
      this.isCrafting.set(false);
      this.remainingTime.set(0);
    });
  }

  /**
   * Start crafting a recipe
   */
  async startCrafting(recipeId: string, selectedIngredients?: { [itemId: string]: string[] }): Promise<any> {
    try {
      // Set isCrafting immediately to prevent UI flicker during auto-restart
      this.isCrafting.set(true);

      const response = await this.socketService.emit('crafting:start', {
        recipeId,
        selectedIngredients
      });

      if (!response.success) {
        this.isCrafting.set(false);
        throw new Error(response.message || 'Failed to start crafting');
      }

      // Store for auto-restart
      this.lastRecipeId = recipeId;
      this.lastSelectedIngredients = selectedIngredients || null;

      // Set active crafting immediately (will be updated by socket event)
      this.activeCrafting.set({
        recipeId,
        startTime: new Date(response.crafting?.startTime || Date.now()),
        endTime: new Date(response.crafting?.endTime || Date.now()),
        selectedIngredients: selectedIngredients || {}
      });

      return response;
    } catch (error: any) {
      this.isCrafting.set(false);
      console.error('Error starting crafting:', error);
      throw error;
    }
  }

  /**
   * Cancel active crafting
   */
  async cancelCrafting(): Promise<any> {
    try {
      const response = await this.socketService.emit('crafting:cancel', {});

      if (response.success) {
        this.activeCrafting.set(null);
        this.isCrafting.set(false);
        this.remainingTime.set(0);
        this.lastRecipeId = null;
        this.lastSelectedIngredients = null;
      }

      return response;
    } catch (error) {
      console.error('Error cancelling crafting:', error);
      throw error;
    }
  }

  /**
   * Check crafting status (for reconnection)
   */
  async checkCraftingStatus(): Promise<void> {
    try {
      const response = await this.socketService.emit('crafting:getStatus', {});

      if (response.success && response.active) {
        // Update crafting state from server
        this.activeCrafting.set({
          recipeId: response.crafting.recipeId,
          startTime: new Date(response.crafting.startTime),
          endTime: new Date(response.crafting.endTime),
          selectedIngredients: {}
        });
        this.isCrafting.set(true);
        this.remainingTime.set(response.crafting.timeRemaining);

        // Start timer to update progress
        this.startProgressTimer(new Date(response.crafting.endTime));
      } else if (response.success && !response.active) {
        // No active crafting
        this.activeCrafting.set(null);
        this.isCrafting.set(false);
        this.remainingTime.set(0);
      }
    } catch (error) {
      console.error('Error checking crafting status:', error);
    }
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
    // Stop progress timer
    this.stopProgressTimer();

    // Remove socket listeners
    this.socketService.off('crafting:started');
    this.socketService.off('crafting:completed');
    this.socketService.off('crafting:cancelled');
    this.socketService.off('crafting:error');
  }
}
