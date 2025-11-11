import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { InventoryService } from './inventory.service';

export interface Combat {
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
  startCombat(monsterId: string): Observable<any> {
    console.log('[CombatService] Starting combat with monster:', monsterId);
    return this.http.post<any>(`${this.apiUrl}/start`, { monsterId }).pipe(
      tap(response => {
        console.log('[CombatService] Combat start response:', response);
        if (response.combat) {
          this.setCombatState(response.combat);
          console.log('[CombatService] Combat state set. inCombat:', this.inCombat(), 'activeCombat:', this.activeCombat());
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
        console.log('[CombatService] Combat status response:', response);
        if (response.inCombat && response.combat) {
          console.log('[CombatService] Restoring combat state');
          this.setCombatState(response.combat);
        } else {
          if (response.rewards) {
            console.log('[CombatService] Combat ended with rewards');
            this.handleCombatEnd(response.rewards);
          } else {
            console.log('[CombatService] No active combat');
            this.clearCombat();
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

    // Check cooldown
    const cooldownRemaining = combat.abilityCooldowns[ability.abilityId] || 0;
    if (cooldownRemaining > 0) {
      return false;
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
    this.lastRewards.set(rewards);
    this.clearCombat();

    // Refresh player data to show new items/gold/XP
    this.authService.getProfile().subscribe();
    this.inventoryService.getInventory().subscribe();
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
