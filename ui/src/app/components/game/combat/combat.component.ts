import { Component, OnInit, OnDestroy, AfterViewChecked, computed, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CombatService, Combat, Ability, CombatLogEntry } from '../../../services/combat.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { InventoryService } from '../../../services/inventory.service';
import { AbilityButtonComponent } from '../../shared/ability-button/ability-button.component';
import { ItemButtonComponent } from '../../shared/item-button/item-button.component';

@Component({
  selector: 'app-combat',
  standalone: true,
  imports: [CommonModule, AbilityButtonComponent, ItemButtonComponent],
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss']
})
export class CombatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private combatService = inject(CombatService);
  private authService = inject(AuthService);
  private confirmDialog = inject(ConfirmDialogService);
  inventoryService = inject(InventoryService);

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

  // Track combat log length to detect new entries
  private previousLogLength = 0;
  private shouldAutoScroll = true;

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

  ngOnInit(): void {
    // Start timer updates
    this.startTimerUpdates();
    // Check combat status on component init
    this.combatService.getCombatStatus().subscribe();
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
    // Check if new log entries were added
    const combat = this.activeCombat();
    const currentLogLength = combat?.combatLog?.length || 0;

    if (currentLogLength > this.previousLogLength) {
      // New entry added - scroll to bottom only if user is near bottom
      if (this.shouldAutoScroll) {
        this.scrollToBottom();
      }
      this.previousLogLength = currentLogLength;
    }

    // Detect if user has scrolled up manually
    this.detectUserScroll();
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
   * Detect if user has manually scrolled up
   */
  private detectUserScroll(): void {
    try {
      if (this.combatLogContent) {
        const element = this.combatLogContent.nativeElement;
        const threshold = 50; // pixels from bottom
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
        this.shouldAutoScroll = isNearBottom;
      }
    } catch (err) {
      // Ignore errors during scroll detection
    }
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

    this.combatService.executeAction('ability', fullAbility.abilityId).subscribe({
      next: () => {
        this.isExecutingAction.set(false);
        this.selectedAbility.set(null);
      },
      error: (err) => {
        console.error('Ability failed:', err);
        this.isExecutingAction.set(false);
        this.selectedAbility.set(null);
      }
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
      default:
        return '';
    }
  }

  /**
   * Start a new encounter (restart with same activity)
   */
  startNewEncounter(): void {
    if (this.isExecutingAction()) return;

    this.isExecutingAction.set(true);
    this.combatService.restartCombat().subscribe({
      next: () => {
        this.isExecutingAction.set(false);
      },
      error: (err) => {
        console.error('Restart combat failed:', err);
        this.isExecutingAction.set(false);
        // Fallback to dismissing combat if restart fails
        this.combatService.dismissCombat();
      }
    });
  }

  /**
   * Use a consumable item during combat
   */
  useConsumable(item: any): void {
    if (this.isUsingItem() || this.isExecutingAction()) return;

    this.isUsingItem.set(true);

    this.inventoryService.useItem(item.instanceId).subscribe({
      next: (response: any) => {
        console.log('Item used in combat:', response);
        this.isUsingItem.set(false);

        // Update combat state if response includes it
        if (response.combat) {
          this.combatService.activeCombat.set(response.combat);
        }
      },
      error: (error: any) => {
        console.error('Error using item in combat:', error);
        this.isUsingItem.set(false);
      }
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
