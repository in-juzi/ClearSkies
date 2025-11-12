import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { InventoryService } from './inventory.service';

export interface Combat {
  activityId?: string | null;
  monsterId: string;
  monsterName: string;
  monsterLevel: number;
  monsterHealth: {
    current: number;
    max: number;
  };
  playerHealth: {
    current: number;
    max: number;
  };
  playerMana: {
    current: number;
    max: number;
  };
  playerNextAttackTime: Date;
  monsterNextAttackTime: Date;
  turnCount: number;
  combatLog: CombatLogEntry[];
  availableAbilities: Ability[];
  abilityCooldowns: { [abilityId: string]: number };
}

export interface CombatLogEntry {
  timestamp: Date;
  message: string;
  type: 'damage' | 'heal' | 'dodge' | 'miss' | 'crit' | 'ability' | 'system';
}

export interface Ability {
  abilityId: string;
  name: string;
  description: string;
  type: string;
  powerMultiplier: number;
  manaCost: number;
  cooldown: number;
  icon?: {
    path: string;
    material: string;
  };
}

export interface CombatRewards {
  victory: boolean;
  gold?: number;
  goldLost?: number;
  experience?: number;
  items?: any[];
  skillResult?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private apiUrl = `${environment.apiUrl}/combat`;
  private statusCheckInterval: any;
  private authService = inject(AuthService);
  private inventoryService = inject(InventoryService);

  // Signals for reactive state
  activeCombat = signal<Combat | null>(null);
  inCombat = signal<boolean>(false);
  combatEnded = signal<boolean>(false); // Track if combat just ended (for review)
  lastRewards = signal<CombatRewards | null>(null);
  combatError = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // Auto-check combat status when in combat
    effect(() => {
      const combat = this.activeCombat();
      if (combat) {
        this.startStatusChecks();
      } else {
        this.stopStatusChecks();
      }
    });
  }

  /**
   * Start combat with a monster
   */
  startCombat(monsterId: string, activityId?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/start`, { monsterId, activityId }).pipe(
      tap(response => {
        if (response.combat) {
          this.setCombatState(response.combat);
          this.combatError.set(null);
        } else {
          console.warn('[CombatService] No combat data in response');
        }
      })
    );
  }

  /**
   * Execute player action (attack or use ability)
   */
  executeAction(action: 'attack' | 'ability', abilityId?: string): Observable<any> {
    const body: any = { action };
    if (abilityId) {
      body.abilityId = abilityId;
    }

    return this.http.post<any>(`${this.apiUrl}/action`, body).pipe(
      tap(response => {
        if (response.combat) {
          this.setCombatState(response.combat);
        } else if (response.rewards) {
          // Combat ended
          this.handleCombatEnd(response.rewards);
        }
        this.combatError.set(null);
      })
    );
  }

  /**
   * Flee from combat
   */
  flee(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/flee`, {}).pipe(
      tap(response => {
        this.clearCombat();
        this.combatError.set(null);
      })
    );
  }

  /**
   * Get current combat status
   */
  getCombatStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`).pipe(
      tap(response => {
        if (response.inCombat && response.combat) {
          this.setCombatState(response.combat);
        } else {
          if (response.rewards) {
            this.handleCombatEnd(response.rewards);
          } else {
            this.stopStatusChecks();
          }
        }
      })
    );
  }

  /**
   * Check if player can use an ability
   */
  canUseAbility(ability: Ability, combat: Combat): boolean {
    // Check mana cost
    if (combat.playerMana.current < ability.manaCost) {
      return false;
    }

    // Check cooldown - abilityCooldowns stores the turn when ability becomes available
    const availableTurn = combat.abilityCooldowns[ability.abilityId];
    if (availableTurn) {
      const cooldownRemaining = availableTurn - combat.turnCount;
      if (cooldownRemaining > 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get ability cooldown remaining (in turns)
   */
  getAbilityCooldownRemaining(abilityId: string): number {
    const combat = this.activeCombat();
    if (!combat) return 0;

    const availableTurn = combat.abilityCooldowns[abilityId];
    if (!availableTurn) return 0;

    const remaining = availableTurn - combat.turnCount;
    return Math.max(0, remaining);
  }

  /**
   * Get time until next attack (in milliseconds)
   */
  getTimeUntilPlayerAttack(): number {
    const combat = this.activeCombat();
    if (!combat || !combat.playerNextAttackTime) return 0;

    const now = new Date().getTime();
    const nextAttack = new Date(combat.playerNextAttackTime).getTime();
    return Math.max(0, nextAttack - now);
  }

  /**
   * Get time until next monster attack (in milliseconds)
   */
  getTimeUntilMonsterAttack(): number {
    const combat = this.activeCombat();
    if (!combat || !combat.monsterNextAttackTime) return 0;

    const now = new Date().getTime();
    const nextAttack = new Date(combat.monsterNextAttackTime).getTime();
    return Math.max(0, nextAttack - now);
  }

  /**
   * Set combat state from API response
   */
  private setCombatState(combat: any): void {
    this.activeCombat.set({
      ...combat,
      playerNextAttackTime: new Date(combat.playerNextAttackTime),
      monsterNextAttackTime: new Date(combat.monsterNextAttackTime),
      combatLog: combat.combatLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }))
    });
    this.inCombat.set(true);
  }

  /**
   * Handle combat end and rewards
   */
  private handleCombatEnd(rewards: CombatRewards): void {
    // Stop status checks immediately to prevent clearing combat state
    this.stopStatusChecks();

    // Add rewards to combat log instead of showing modal
    const combat = this.activeCombat();
    if (combat) {
      // Set monster health to 0 to visually show defeat
      if (rewards.victory) {
        combat.monsterHealth.current = 0;
      }

      const rewardMessages = this.formatRewardsForLog(rewards);
      rewardMessages.forEach(msg => {
        combat.combatLog.push({
          timestamp: new Date(),
          message: msg.message,
          type: msg.type as any
        });
      });
      // Update combat state with new log entries
      this.activeCombat.set({ ...combat });
    }

    this.inCombat.set(false);
    this.combatEnded.set(true); // Mark combat as ended but keep state for review

    // Refresh player data to show new items/gold/XP
    this.authService.getProfile().subscribe();
    this.inventoryService.getInventory().subscribe();
  }

  /**
   * Format rewards into combat log messages
   */
  private formatRewardsForLog(rewards: CombatRewards): Array<{ message: string; type: string }> {
    const messages: Array<{ message: string; type: string }> = [];

    if (rewards.victory) {
      messages.push({ message: '🎉 Victory! You defeated the monster!', type: 'system' });

      if (rewards.gold) {
        messages.push({ message: `💰 Received ${rewards.gold} gold`, type: 'system' });
      }

      if (rewards.experience) {
        messages.push({ message: `⭐ Gained ${rewards.experience} XP`, type: 'system' });
      }

      if (rewards.skillResult?.skill?.leveledUp) {
        messages.push({
          message: `🎊 Level Up! ${rewards.skillResult.skill.skill} → Level ${rewards.skillResult.skill.newLevel}`,
          type: 'system'
        });
      }

      if (rewards.items && rewards.items.length > 0) {
        rewards.items.forEach(item => {
          messages.push({
            message: `📦 Looted: ${item.itemId} x${item.quantity}`,
            type: 'system'
          });
        });
      }
    } else {
      messages.push({ message: '💀 You have been defeated!', type: 'system' });
      if (rewards.goldLost) {
        messages.push({ message: `💸 Lost ${rewards.goldLost} gold`, type: 'system' });
      }
    }

    return messages;
  }

  /**
   * Dismiss combat review and clear all combat state
   */
  dismissCombat(): void {
    this.clearCombat();
    this.combatEnded.set(false);
    this.lastRewards.set(null);
  }

  /**
   * Restart combat with the same activity
   */
  restartCombat(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/restart`, {}).pipe(
      tap(response => {
        if (response.combat) {
          this.setCombatState(response.combat);
          this.combatEnded.set(false);
          this.lastRewards.set(null);
          this.combatError.set(null);
        }
      })
    );
  }

  /**
   * Clear combat state
   */
  private clearCombat(): void {
    this.activeCombat.set(null);
    this.inCombat.set(false);
  }

  /**
   * Start periodic status checks (every 500ms)
   */
  private startStatusChecks(): void {
    if (this.statusCheckInterval) {
      return; // Already running
    }

    this.statusCheckInterval = setInterval(() => {
      this.getCombatStatus().subscribe();
    }, 500);
  }

  /**
   * Stop periodic status checks
   */
  private stopStatusChecks(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    this.stopStatusChecks();
  }
}
