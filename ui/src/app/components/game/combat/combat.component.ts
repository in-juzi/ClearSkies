import { Component, OnInit, OnDestroy, AfterViewChecked, computed, signal, effect, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CombatService, Combat, Ability, CombatLogEntry } from '../../../services/combat.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { InventoryService } from '../../../services/inventory.service';
import { LocationService } from '../../../services/location.service';
import { AbilityButtonComponent } from '../../shared/ability-button/ability-button.component';
import { ItemButtonComponent } from '../../shared/item-button/item-button.component';
import { ItemMiniComponent } from '../../shared/item-mini/item-mini.component';

@Component({
  selector: 'app-combat',
  standalone: true,
  imports: [CommonModule, AbilityButtonComponent, ItemButtonComponent, ItemMiniComponent],
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss']
})
export class CombatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private combatService = inject(CombatService);
  authService = inject(AuthService);
  private confirmDialog = inject(ConfirmDialogService);
  inventoryService = inject(InventoryService);
  private locationService = inject(LocationService);

  @ViewChild('combatLogContent') private combatLogContent?: ElementRef;

  // Combat state
  activeCombat = this.combatService.activeCombat;
  inCombat = this.combatService.inCombat;
  combatEnded = this.combatService.combatEnded;

  // Player state
  player = this.authService.currentPlayer;

  // UI state
  isExecutingAction = signal<boolean>(false);
  selectedAbility = signal<Ability | null>(null);
  isUsingItem = signal<boolean>(false);

  // Smart auto-scroll - only scroll if user is at bottom
  private shouldAutoScroll = true;

  // Floating damage numbers
  floatingNumbers = signal<Array<{ id: string; value: number; type: 'damage' | 'crit' | 'heal'; target: 'player' | 'monster' }>>([]);

  // Filtered consumables for combat
  consumables = computed(() => {
    return this.inventoryService.inventory().filter(item =>
      item.definition.category === 'consumable' &&
      (item.definition.properties?.['healthRestore'] > 0 || item.definition.properties?.['manaRestore'] > 0)
    );
  });

  // Computed values
  playerHpPercent = computed(() => {
    const combat = this.activeCombat();
    if (!combat) return 0;
    return (combat.playerHealth.current / combat.playerHealth.max) * 100;
  });

  monsterHpPercent = computed(() => {
    const combat = this.activeCombat();
    if (!combat) return 0;
    return (combat.monsterHealth.current / combat.monsterHealth.max) * 100;
  });

  playerManaPercent = computed(() => {
    const combat = this.activeCombat();
    if (!combat) return 0;
    return (combat.playerMana.current / combat.playerMana.max) * 100;
  });

  playerHpColor = computed(() => {
    const percent = this.playerHpPercent();
    if (percent > 60) return '#4ade80'; // green
    if (percent > 30) return '#fbbf24'; // yellow
    return '#ef4444'; // red
  });

  monsterHpColor = computed(() => {
    const percent = this.monsterHpPercent();
    if (percent > 60) return '#4ade80';
    if (percent > 30) return '#fbbf24';
    return '#ef4444';
  });

  // Attack timer states
  playerAttackTimer = signal<number>(0);
  monsterAttackTimer = signal<number>(0);
  playerAttackTimerMax = signal<number>(3.0); // Track max timer value
  monsterAttackTimerMax = signal<number>(3.0); // Track max timer value
  playerAttackTimerPercent = computed(() => {
    const maxTime = this.playerAttackTimerMax();
    const currentTime = this.playerAttackTimer();
    if (currentTime <= 0) return 100;
    if (maxTime <= 0) return 0;
    return Math.min(100, ((maxTime - currentTime) / maxTime) * 100);
  });
  monsterAttackTimerPercent = computed(() => {
    const maxTime = this.monsterAttackTimerMax();
    const currentTime = this.monsterAttackTimer();
    if (currentTime <= 0) return 100;
    if (maxTime <= 0) return 0;
    return Math.min(100, ((maxTime - currentTime) / maxTime) * 100);
  });
  private timerInterval: any;

  // Watch combat log for new entries and trigger floating numbers
  private combatLogEffect = effect(() => {
    const combat = this.activeCombat();
    const combatLog = combat?.combatLog;

    if (!combatLog || combatLog.length === 0) {
      return;
    }

    // Process all entries marked as new
    combatLog.forEach(entry => {
      if (entry.isNew) {
        const floatingNumber = this.parseFloatingNumber(entry);
        if (floatingNumber) {
          this.addFloatingNumber(floatingNumber);
        }
        // Mark as processed to avoid re-triggering
        entry.isNew = false;
      }
    });
  });

  ngOnInit(): void {
    // Start timer updates
    this.startTimerUpdates();
    // Check combat status on component init
    this.combatService.checkCombatStatus();
    // Load inventory for consumables
    this.inventoryService.getInventory().subscribe();
  }

  ngOnDestroy(): void {
    // Stop timer updates
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  ngAfterViewChecked(): void {
    // Only auto-scroll if user was already at bottom before new messages arrived
    if (this.shouldAutoScroll) {
      this.scrollToBottom();
    }
  }

  /**
   * Scroll combat log to bottom
   */
  private scrollToBottom(): void {
    try {
      if (this.combatLogContent) {
        const element = this.combatLogContent.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      // Ignore errors during scroll
    }
  }

  /**
   * Check if user is scrolled near bottom (within 50px)
   * Called on scroll event to track user's scroll position
   */
  onCombatLogScroll(): void {
    try {
      if (this.combatLogContent) {
        const element = this.combatLogContent.nativeElement;
        const threshold = 0; // pixels from bottom
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight === threshold;
        this.shouldAutoScroll = isNearBottom;
      }
    } catch (err) {
      // Ignore errors during scroll detection
    }
  }

  /**
   * Parse a combat log entry to extract floating number data
   */
  private parseFloatingNumber(entry: CombatLogEntry): { value: number; type: 'damage' | 'crit' | 'heal'; target: 'player' | 'monster' } | null {
    // If the entry has damageValue and target from backend, use those directly
    if (entry.damageValue !== undefined && entry.target) {
      const type = entry.type === 'crit' ? 'crit' : (entry.type === 'heal' ? 'heal' : 'damage');
      return {
        value: entry.damageValue,
        type,
        target: entry.target
      };
    }

    // Fallback: parse healing from message if not provided by backend
    const healMatch = entry.message.match(/(?:heal|healed|restores?)\s+(\d+)\s+(?:health|hp)/i);
    if (healMatch) {
      return {
        value: parseInt(healMatch[1]),
        type: 'heal',
        target: 'player'
      };
    }

    return null;
  }

  /**
   * Add a floating number to the display
   */
  private addFloatingNumber(data: { value: number; type: 'damage' | 'crit' | 'heal'; target: 'player' | 'monster' }): void {
    const id = `float-${Date.now()}-${Math.random()}`;
    const floatingNumber = { id, ...data };
    // Add to signal
    this.floatingNumbers.update(numbers => [...numbers, floatingNumber]);

    // Remove after animation completes (1000ms)
    setTimeout(() => {
      this.floatingNumbers.update(numbers => numbers.filter(n => n.id !== id));
    }, 1000);
  }

  /**
   * Start updating attack timers
   */
  private startTimerUpdates(): void {
    this.timerInterval = setInterval(() => {
      this.updateTimers();
    }, 100); // Update every 100ms for smooth countdown
  }

  /**
   * Update attack timer values
   */
  private updateTimers(): void {
    const combat = this.activeCombat();

    // Stop updating timers if combat has ended
    if (combat?.combatEnded || this.combatEnded()) {
      this.playerAttackTimer.set(0);
      this.monsterAttackTimer.set(0);
      return;
    }

    const playerTime = this.combatService.getTimeUntilPlayerAttack();
    const monsterTime = this.combatService.getTimeUntilMonsterAttack();

    const playerSeconds = Math.max(0, playerTime / 1000); // Convert to seconds
    const monsterSeconds = Math.max(0, monsterTime / 1000);

    // Track max timer values for percentage calculation
    if (playerSeconds > this.playerAttackTimerMax()) {
      this.playerAttackTimerMax.set(playerSeconds);
    }
    if (monsterSeconds > this.monsterAttackTimerMax()) {
      this.monsterAttackTimerMax.set(monsterSeconds);
    }

    this.playerAttackTimer.set(playerSeconds);
    this.monsterAttackTimer.set(monsterSeconds);
  }

  /**
   * Format timer display (e.g., "2.5s")
   */
  formatTimer(seconds: number): string {
    if (seconds <= 0) return 'Ready';
    return `${seconds.toFixed(1)}s`;
  }

  /**
   * Use an ability
   */
  useAbility(ability: Ability | { abilityId: string; name: string }): void {
    if (this.isExecutingAction()) return;

    const combat = this.activeCombat();
    if (!combat) return;

    // Find the full ability object if needed
    const fullAbility = 'powerMultiplier' in ability
      ? ability
      : combat.availableAbilities.find(a => a.abilityId === ability.abilityId);

    if (!fullAbility) {
      console.warn('Ability not found:', ability.name);
      return;
    }

    // Check if ability can be used
    if (!this.combatService.canUseAbility(fullAbility, combat)) {
      console.warn('Cannot use ability:', fullAbility.name);
      return;
    }

    this.isExecutingAction.set(true);
    this.selectedAbility.set(fullAbility);

    this.combatService.useAbility(fullAbility.abilityId).then(() => {
      this.isExecutingAction.set(false);
      this.selectedAbility.set(null);
    }).catch((err: any) => {
      console.error('Ability failed:', err);
      this.isExecutingAction.set(false);
      this.selectedAbility.set(null);
    });
  }

  /**
   * Check if ability can be used
   */
  canUseAbility(ability: Ability): boolean {
    const combat = this.activeCombat();
    if (!combat) return false;
    return this.combatService.canUseAbility(ability, combat);
  }

  /**
   * Get ability cooldown remaining
   */
  getAbilityCooldown(ability: Ability): number {
    return this.combatService.getAbilityCooldownRemaining(ability.abilityId);
  }

  /**
   * Get combat log entry CSS class
   */
  getLogEntryClass(entry: CombatLogEntry): string {
    switch (entry.type) {
      case 'crit':
        return 'log-crit';
      case 'damage':
        return 'log-damage';
      case 'heal':
        return 'log-heal';
      case 'dodge':
      case 'miss':
        return 'log-miss';
      case 'ability':
        return 'log-ability';
      case 'system':
        return 'log-system';
      case 'loot':
        return 'log-loot';
      default:
        return '';
    }
  }

  /**
   * Start a new encounter (restart with same activity)
   */
  startNewEncounter(): void {
    if (this.isExecutingAction()) return;

    // Get activity ID from current combat or last combat
    const combat = this.activeCombat();
    const activityId = combat?.activityId || this.combatService.lastCombatActivityId();

    if (!activityId) {
      console.error('Cannot restart combat: No activity ID found');
      return;
    }

    // Get the facility ID from the location service's last facility
    const facilityId = this.locationService.getLastFacilityId();

    if (!facilityId) {
      console.error('Cannot restart combat: No facility ID found');
      return;
    }

    this.isExecutingAction.set(true);

    // Clear combat state first
    this.combatService.restartCombat();

    // Start the activity again to initiate new combat
    this.locationService.startActivity(activityId, facilityId).then(() => {
      this.isExecutingAction.set(false);
    }).catch((err: any) => {
      console.error('Failed to restart combat:', err);
      this.isExecutingAction.set(false);
    });
  }

  /**
   * Use a consumable item during combat
   */
  useConsumable(item: any): void {
    if (this.isUsingItem() || this.isExecutingAction()) return;

    this.isUsingItem.set(true);

    // Use combat service socket method instead of inventory HTTP endpoint
    this.combatService.useItem(item.instanceId).then(() => {
      this.isUsingItem.set(false);
    }).catch((error: any) => {
      console.error('Error using item in combat:', error);
      this.isUsingItem.set(false);
    });
  }

  /**
   * Get HP bar width style
   */
  getHpBarStyle(percent: number, color: string): any {
    return {
      width: `${percent}%`,
      backgroundColor: color,
      transition: 'width 0.3s ease, background-color 0.3s ease'
    };
  }

  /**
   * Get mana bar width style
   */
  getManaBarStyle(percent: number): any {
    return {
      width: `${percent}%`,
      backgroundColor: '#3b82f6',
      transition: 'width 0.3s ease'
    };
  }

  /**
   * Get attack timer bar width style
   */
  getTimerBarStyle(percent: number): any {
    return {
      width: `${percent}%`,
      backgroundColor: percent >= 100 ? '#4ade80' : '#667eea',
      transition: 'width 0.1s linear, background-color 0.3s ease'
    };
  }

  /**
   * Format timestamp for combat log
   */
  formatTimestamp(timestamp: Date): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
