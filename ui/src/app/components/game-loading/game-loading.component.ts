import { Component, OnInit, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttributesService } from '../../services/attributes.service';
import { CombatService } from '../../services/combat.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-game-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-loading.component.html',
  styleUrl: './game-loading.component.scss'
})
export class GameLoadingComponent implements OnInit {
  // Loading states
  private playerLoadedSignal = signal(false);
  private attributesLoadedSignal = signal(false);
  private combatStatusLoadedSignal = signal(false);
  private socketConnectedSignal = signal(false);
  private minimumTimeElapsedSignal = signal(false);

  // Display states
  currentStep = signal(0); // 0: name, 1: location, 2: health/mana, 3: connection, 4: ready
  isReady = signal(false); // True when all data is loaded and button can be shown

  // Computed values
  allDataLoaded = computed(() =>
    this.playerLoadedSignal() &&
    this.attributesLoadedSignal() &&
    this.combatStatusLoadedSignal() &&
    this.socketConnectedSignal() &&
    this.minimumTimeElapsedSignal()
  );

  // Player data for display
  characterName = computed(() => this.authService.currentUser()?.username || 'Adventurer');
  player = computed(() => this.authService.currentPlayer());

  locationName = computed(() => {
    const player = this.player();
    // Backend sends location as string in 'location' field (see authController.ts:223)
    // Type cast needed because frontend expects Location object but backend sends string
    const locationId = (player?.location as any as string) || player?.currentLocation || (player?.location as any)?.currentZone;

    if (!locationId) return 'Unknown Location';

    // Format location ID to readable name (e.g., "kennik" -> "Kennik")
    return this.formatLocationId(locationId);
  });

  level = computed(() => this.player()?.level || 1);
  gold = computed(() => this.player()?.gold || 0);

  currentHealth = computed(() => this.player()?.stats?.health?.current || 0);
  maxHealth = computed(() => this.player()?.stats?.health?.max || 100);
  healthPercent = computed(() => {
    const max = this.maxHealth();
    return max > 0 ? (this.currentHealth() / max) * 100 : 0;
  });

  currentMana = computed(() => this.player()?.stats?.mana?.current || 0);
  maxMana = computed(() => this.player()?.stats?.mana?.max || 100);
  manaPercent = computed(() => {
    const max = this.maxMana();
    return max > 0 ? (this.currentMana() / max) * 100 : 0;
  });

  // Last activity message
  lastActivityMessage = computed(() => {
    const playerData = this.player();
    if (!playerData) return 'You awaken...';

    // Check active combat
    if (playerData.activeCombat) {
      const monsterId = playerData.activeCombat.monsterId;
      return `You were fighting ${this.formatMonsterId(monsterId)}...`;
    }

    // Check active activity
    if (playerData.activeActivity) {
      const activityId = playerData.activeActivity.activityId;
      const locationId = playerData.activeActivity.locationId;
      return `You were ${this.formatActivityId(activityId)} at ${this.formatLocationId(locationId)}...`;
    }

    // Check active crafting
    if (playerData.activeCrafting) {
      const recipeId = playerData.activeCrafting.recipeId;
      return `You were crafting ${this.formatRecipeId(recipeId)}...`;
    }

    // Check travel state
    if (playerData.travelState?.isTravel) {
      const targetId = playerData.travelState.targetLocationId;
      return `You were traveling to ${this.formatLocationId(targetId)}...`;
    }

    // Check last combat
    if (playerData.lastCombatActivityId) {
      return `Your last battle was at ${this.formatActivityId(playerData.lastCombatActivityId)}...`;
    }

    // Default
    return `You awaken in ${this.locationName()}...`;
  });

  connectionStatus = signal('Reconnecting to the world...');

  constructor(
    private authService: AuthService,
    private attributesService: AttributesService,
    private combatService: CombatService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startLoadingSequence();
  }

  private async startLoadingSequence(): Promise<void> {
    // Start animation sequence
    this.animateSteps();

    // Start minimum time timer (2500ms)
    setTimeout(() => {
      this.minimumTimeElapsedSignal.set(true);
    }, 2500);

    // Load all data in parallel
    await Promise.all([
      this.loadPlayerData(),
      this.loadAttributes(),
      this.checkCombatStatus(),
      this.waitForSocketConnection()
    ]);

    // Wait for minimum time if needed
    await this.waitForMinimumTime();

    // Show ready status and button
    this.connectionStatus.set('Ready!');
    this.isReady.set(true);
    this.currentStep.set(4);
  }

  // Called when user clicks Continue button
  onContinueClick(): void {
    this.router.navigate(['/game']);
  }

  // Handle Enter key press
  @HostListener('window:keydown.enter')
  onEnterKey(): void {
    if (this.isReady()) {
      this.onContinueClick();
    }
  }

  private animateSteps(): void {
    // Step 0: Character name (immediate)
    this.currentStep.set(0);

    // Step 1: Location and last activity (500ms)
    setTimeout(() => this.currentStep.set(1), 500);

    // Step 2: Health/mana bars (1000ms)
    setTimeout(() => this.currentStep.set(2), 1000);

    // Step 3: Connection status (1500ms)
    setTimeout(() => this.currentStep.set(3), 1500);
  }

  private async loadPlayerData(): Promise<void> {
    try {
      // Always fetch fresh player data to ensure we have the latest stats
      await this.authService.getProfile();

      // Wait a tick for signals to update
      await new Promise(resolve => setTimeout(resolve, 100));

      this.playerLoadedSignal.set(true);
    } catch (error) {
      console.error('Failed to load player data:', error);
      this.playerLoadedSignal.set(true); // Continue anyway
    }
  }

  private async loadAttributes(): Promise<void> {
    try {
      this.connectionStatus.set('Gathering your belongings...');
      await this.attributesService.getAllAttributes();
      this.attributesLoadedSignal.set(true);
    } catch (error) {
      console.error('Failed to load attributes:', error);
      this.attributesLoadedSignal.set(true); // Continue anyway
    }
  }

  private async checkCombatStatus(): Promise<void> {
    try {
      this.connectionStatus.set('Checking surroundings...');
      await this.combatService.checkCombatStatus();
      this.combatStatusLoadedSignal.set(true);
    } catch (error) {
      console.error('Failed to check combat status:', error);
      this.combatStatusLoadedSignal.set(true); // Continue anyway
    }
  }

  private async waitForSocketConnection(): Promise<void> {
    return new Promise((resolve) => {
      // Check if already connected
      if (this.socketService.isConnected()) {
        this.socketConnectedSignal.set(true);
        resolve();
        return;
      }

      // Wait for connection
      const checkInterval = setInterval(() => {
        if (this.socketService.isConnected()) {
          this.socketConnectedSignal.set(true);
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        this.socketConnectedSignal.set(true); // Continue anyway
        resolve();
      }, 10000);
    });
  }

  private async waitForMinimumTime(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.minimumTimeElapsedSignal()) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  // Formatting helpers
  private formatLocationId(locationId: string): string {
    // Convert "kennik" to "Kennik", "mountain_pass" to "Mountain Pass"
    return locationId.split(/[-_]/).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private formatMonsterId(monsterId: string): string {
    // Convert "goblin_scout" to "a Goblin Scout"
    return 'a ' + monsterId.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private formatActivityId(activityId: string): string {
    // Convert "gather-chamomile" to "gathering Chamomile"
    const parts = activityId.split('-');
    if (parts[0] === 'gather') {
      const item = parts.slice(1).join(' ');
      return `gathering ${item.charAt(0).toUpperCase() + item.slice(1)}`;
    }
    if (parts[0] === 'mine') {
      return `mining ${parts.slice(1).join(' ')}`;
    }
    if (parts[0] === 'fish') {
      return `fishing for ${parts.slice(1).join(' ')}`;
    }
    if (parts[0] === 'chop') {
      return `chopping ${parts.slice(1).join(' ')}`;
    }
    return activityId.replace(/-/g, ' ');
  }

  private formatRecipeId(recipeId: string): string {
    // Convert "health_potion" to "a Health Potion"
    return 'a ' + recipeId.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
