import { Component, OnInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CombatService, Combat, Ability, CombatLogEntry } from '../../../services/combat.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-combat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss']
})
export class CombatComponent implements OnInit, OnDestroy {
  private combatService = inject(CombatService);
  private authService = inject(AuthService);
  private confirmDialog = inject(ConfirmDialogService);

  // Combat state
  activeCombat = this.combatService.activeCombat;
  inCombat = this.combatService.inCombat;
  lastRewards = this.combatService.lastRewards;

  // Player state
  player = this.authService.currentPlayer;

  // UI state
  isExecutingAction = signal<boolean>(false);
  selectedAbility = signal<Ability | null>(null);

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
  }

  ngOnDestroy(): void {
    // Stop timer updates
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
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
   * Execute normal attack
   */
  attack(): void {
    if (this.isExecutingAction()) return;

    this.isExecutingAction.set(true);
    this.combatService.executeAction('attack').subscribe({
      next: () => {
        this.isExecutingAction.set(false);
      },
      error: (err) => {
        console.error('Attack failed:', err);
        this.isExecutingAction.set(false);
      }
    });
  }

  /**
   * Use an ability
   */
  useAbility(ability: Ability): void {
    if (this.isExecutingAction()) return;

    const combat = this.activeCombat();
    if (!combat) return;

    // Check if ability can be used
    if (!this.combatService.canUseAbility(ability, combat)) {
      console.warn('Cannot use ability:', ability.name);
      return;
    }

    this.isExecutingAction.set(true);
    this.selectedAbility.set(ability);

    this.combatService.executeAction('ability', ability.abilityId).subscribe({
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
   * Flee from combat
   */
  async flee(): Promise<void> {
    if (this.isExecutingAction()) return;

    const confirmed = await this.confirmDialog.confirm({
      title: 'Flee from Combat',
      message: 'Are you sure you want to flee? You will not receive any rewards.',
      confirmLabel: 'Yes, Flee',
      cancelLabel: 'No, Continue Fighting'
    });

    if (!confirmed) {
      return;
    }

    this.isExecutingAction.set(true);
    this.combatService.flee().subscribe({
      next: () => {
        this.isExecutingAction.set(false);
      },
      error: (err) => {
        console.error('Flee failed:', err);
        this.isExecutingAction.set(false);
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
   * Dismiss rewards modal
   */
  dismissRewards(): void {
    this.lastRewards.set(null);
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
