import { Injectable, signal, effect, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { InventoryService } from './inventory.service';
import { SkillsService } from './skills.service';
import { AttributesService } from './attributes.service';
import { SocketService } from './socket.service';
import { Ability } from '@shared/types';

// Re-export Ability so components can import it
export type { Ability };

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
  combatEnded?: boolean; // Flag indicating combat has ended
}

export interface CombatLogEntry {
  timestamp: Date;
  message: string;
  type: 'damage' | 'heal' | 'dodge' | 'miss' | 'crit' | 'ability' | 'system' | 'loot';
  damageValue?: number;
  target?: 'player' | 'monster';
  isNew?: boolean;
  items?: any[]; // Item data for loot entries
}

export interface CombatRewards {
  victory: boolean;
  gold?: number;
  goldLost?: number;
  experience?: any; // Can be object with skill names
  rawExperience?: any;
  items?: any[];
  skillUpdates?: any;
  attributeUpdates?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private authService = inject(AuthService);
  private inventoryService = inject(InventoryService);
  private skillsService = inject(SkillsService);
  private attributesService = inject(AttributesService);
  private socketService = inject(SocketService);

  // Signals for reactive state
  activeCombat = signal<Combat | null>(null);
  inCombat = signal<boolean>(false);
  combatEnded = signal<boolean>(false); // Track if combat just ended (for review)
  lastRewards = signal<CombatRewards | null>(null);
  combatError = signal<string | null>(null);
  lastCombatActivityId = signal<string | null>(null); // Store last combat activity ID for restart
  lastCombatFacilityId = signal<string | null>(null); // Store last combat facility ID for restart

  // Observable for combat completion events
  combatCompleted$ = new Subject<CombatRewards>();

  // Observable for combat errors
  combatError$ = new Subject<{ error: string; message: string }>();

  constructor() {
    // Set up socket event listeners when connected
    effect(() => {
      if (this.socketService.isConnected()) {
        this.setupSocketListeners();
      }
    });
  }

  /**
   * Set up socket event listeners for combat
   */
  private setupSocketListeners(): void {
    // Combat started event (when combat begins via activity system)
    this.socketService.on('combat:started', (data: any) => {
      console.log('Combat started event:', data);

      // Create initial combat log with start message
      const initialLog: CombatLogEntry[] = [{
        timestamp: new Date(),
        message: `Combat begins! You face ${data.monster.name} (Level ${data.monster.level})`,
        type: 'system',
        isNew: true
      }];

      // Store activity ID for restart functionality
      const activityId = data.combat?.activityId;
      if (activityId) {
        this.lastCombatActivityId.set(activityId);
      }

      // Update combat state from server data
      this.activeCombat.set({
        activityId: activityId,
        monsterId: data.monster.monsterId,
        monsterName: data.monster.name,
        monsterLevel: data.monster.level,
        monsterHealth: {
          current: data.monster.health.current,
          max: data.monster.health.max
        },
        playerHealth: {
          current: data.combat.player?.currentHp || 0,
          max: data.combat.player?.maxHp || 0
        },
        playerMana: {
          current: data.combat.player?.currentMana || 0,
          max: data.combat.player?.maxMana || 0
        },
        playerNextAttackTime: new Date(data.combat.playerNextAttackTime),
        monsterNextAttackTime: new Date(data.combat.monsterNextAttackTime),
        turnCount: data.combat.turnCount,
        combatLog: initialLog,
        availableAbilities: data.combat.availableAbilities || [],
        abilityCooldowns: data.combat.abilityCooldowns || {}
      });

      this.inCombat.set(true);
      this.combatEnded.set(false);
    });

    // Player attack event
    this.socketService.on('combat:playerAttack', (data: any) => {
      console.log('Player attack event:', data);
      const combat = this.activeCombat();
      if (!combat) return;

      // Update monster health
      if (data.monster) {
        combat.monsterHealth.current = data.monster.currentHp;
        combat.monsterHealth.max = data.monster.maxHp;
      }

      // Update next attack time
      if (data.playerNextAttackTime) {
        combat.playerNextAttackTime = new Date(data.playerNextAttackTime);
      }

      // Add combat log entry from attack result
      if (data.result) {
        const message = this.formatAttackMessage('player', data.result);
        const logEntry: CombatLogEntry = {
          timestamp: new Date(),
          message,
          type: data.result.isCrit ? 'crit' : (data.result.isDodge ? 'dodge' : 'damage'),
          damageValue: data.result.damage,
          target: 'monster',
          isNew: true
        };
        combat.combatLog.push(logEntry);
      }

      this.activeCombat.set({ ...combat });
    });

    // Monster attack event
    this.socketService.on('combat:monsterAttack', (data: any) => {
      console.log('Monster attack event:', data);
      const combat = this.activeCombat();
      if (!combat) return;

      // Update player health
      if (data.player) {
        combat.playerHealth.current = data.player.currentHp;
        combat.playerHealth.max = data.player.maxHp;
      }

      // Update next attack time
      if (data.monsterNextAttackTime) {
        combat.monsterNextAttackTime = new Date(data.monsterNextAttackTime);
      }

      // Add combat log entry from attack result
      if (data.result) {
        const message = this.formatAttackMessage('monster', data.result, combat.monsterName);
        const logEntry: CombatLogEntry = {
          timestamp: new Date(),
          message,
          type: data.result.isCrit ? 'crit' : (data.result.isDodge ? 'dodge' : 'damage'),
          damageValue: data.result.damage,
          target: 'player',
          isNew: true
        };
        combat.combatLog.push(logEntry);
      }

      this.activeCombat.set({ ...combat });
    });

    // Ability used event
    this.socketService.on('combat:abilityUsed', (data: any) => {
      console.log('Ability used event:', data);
      const combat = this.activeCombat();
      if (!combat) return;

      // Update monster health
      if (data.monster) {
        combat.monsterHealth.current = data.monster.currentHp;
        combat.monsterHealth.max = data.monster.maxHp;
      }

      // Update player mana
      if (data.player) {
        combat.playerHealth.current = data.player.currentHp;
        combat.playerMana.current = data.player.currentMana;
      }

      // Update cooldowns
      if (data.abilityCooldowns) {
        combat.abilityCooldowns = data.abilityCooldowns;
      }

      // Add combat log entry for ability usage
      if (data.result) {
        const abilityName = data.abilityName || 'Ability';
        const message = this.formatAbilityMessage(abilityName, data.result);
        const logEntry: CombatLogEntry = {
          timestamp: new Date(),
          message,
          type: data.result.isCrit ? 'crit' : (data.result.isDodge ? 'miss' : 'ability'),
          damageValue: data.result.damage,
          target: 'monster',
          isNew: true
        };
        combat.combatLog.push(logEntry);
      }

      this.activeCombat.set({ ...combat });
    });

    // Item used event
    this.socketService.on('combat:itemUsed', (data: any) => {
      console.log('Item used event:', data);
      const combat = this.activeCombat();
      if (!combat) return;

      // Update player health/mana
      if (data.player) {
        combat.playerHealth.current = data.player.currentHp;
        combat.playerMana.current = data.player.currentMana;
      }

      // Refresh inventory
      if (data.inventory) {
        this.inventoryService.getInventory().subscribe();
      }

      // Add combat log entry for item usage
      if (data.result) {
        const itemName = data.result.itemName || 'Item';
        const healAmount = data.result.healAmount || 0;
        const manaAmount = data.result.manaAmount || 0;

        let message = `You use ${itemName}`;
        if (healAmount > 0 && manaAmount > 0) {
          message += ` (restored ${healAmount} HP and ${manaAmount} mana)`;
        } else if (healAmount > 0) {
          message += ` (restored ${healAmount} HP)`;
        } else if (manaAmount > 0) {
          message += ` (restored ${manaAmount} mana)`;
        }

        const logEntry: CombatLogEntry = {
          timestamp: new Date(),
          message,
          type: 'heal',
          damageValue: healAmount,
          target: 'player',
          isNew: true
        };
        combat.combatLog.push(logEntry);
      }

      this.activeCombat.set({ ...combat });
    });

    // Combat victory event
    this.socketService.on('combat:victory', (data: any) => {
      console.log('Combat victory event:', data);

      const rewards: CombatRewards = {
        victory: true,
        experience: data.rewards.experience,
        rawExperience: data.rewards.rawExperience,
        items: data.rewards.items,
        gold: data.rewards.gold,
        skillUpdates: data.skillUpdates,
        attributeUpdates: data.attributeUpdates
      };

      this.handleCombatEnd(rewards);

      // Refresh player data
      this.skillsService.getSkills().subscribe();
      this.attributesService.getAllAttributes().subscribe();
      this.inventoryService.getInventory().subscribe();

      // Emit completion event for UI notifications
      this.combatCompleted$.next(rewards);
    });

    // Combat defeat event
    this.socketService.on('combat:defeat', (data: any) => {
      console.log('Combat defeat event:', data);

      const rewards: CombatRewards = {
        victory: false,
        goldLost: 0 // No penalty in current implementation
      };

      this.handleCombatEnd(rewards);

      // Update player health/mana
      if (data.player) {
        this.authService.getProfile().subscribe();
      }
    });

    // Combat fled event
    this.socketService.on('combat:fled', (data: any) => {
      console.log('Combat fled event:', data);
      this.clearCombat();
    });
  }

  /**
   * Start combat with a monster (via combat activity)
   */
  async startCombat(monsterId: string, activityId?: string): Promise<any> {
    // Combat is started via activity:start with combat activity type
    // This method is kept for backward compatibility but not used with Socket.io
    console.warn('startCombat called - combat should be initiated via activity system');
    return Promise.resolve({ success: false, message: 'Use activity system to start combat' });
  }

  /**
   * Use combat ability
   */
  async useAbility(abilityId: string): Promise<any> {
    try {
      const response = await this.socketService.emit('combat:useAbility', { abilityId });

      if (!response.success) {
        throw new Error(response.message || 'Failed to use ability');
      }

      return response;
    } catch (error: any) {
      console.error('Error using ability:', error);
      this.combatError.set(error.message);
      throw error;
    }
  }

  /**
   * Use item in combat
   */
  async useItem(instanceId: string): Promise<any> {
    try {
      const response = await this.socketService.emit('combat:useItem', { instanceId });

      if (!response.success) {
        throw new Error(response.message || 'Failed to use item');
      }

      return response;
    } catch (error: any) {
      console.error('Error using item:', error);
      this.combatError.set(error.message);
      throw error;
    }
  }

  /**
   * Flee from combat
   */
  async flee(): Promise<any> {
    try {
      const response = await this.socketService.emit('combat:flee', {});

      if (response.success) {
        this.clearCombat();
      }

      return response;
    } catch (error: any) {
      console.error('Error fleeing:', error);
      this.combatError.set(error.message);
      throw error;
    }
  }

  /**
   * Get current combat status (for reconnection)
   */
  async checkCombatStatus(): Promise<void> {
    try {
      const response = await this.socketService.emit('combat:getStatus', {});

      if (response.success && response.inCombat) {
        // Update combat state from server
        const combat = response.combat;
        this.activeCombat.set({
          activityId: combat.activityId,
          monsterId: combat.monster.monsterId,
          monsterName: combat.monster.name,
          monsterLevel: combat.monster.level,
          monsterHealth: {
            current: combat.monster.stats.health.current,
            max: combat.monster.stats.health.max
          },
          playerHealth: {
            current: combat.player.currentHp,
            max: combat.player.maxHp
          },
          playerMana: {
            current: combat.player.currentMana,
            max: combat.player.maxMana
          },
          playerNextAttackTime: new Date(combat.playerNextAttackTime),
          monsterNextAttackTime: new Date(combat.monsterNextAttackTime),
          turnCount: combat.turnCount,
          combatLog: combat.combatLog.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          })),
          availableAbilities: combat.availableAbilities || [],
          abilityCooldowns: combat.abilityCooldowns
        });
        this.inCombat.set(true);
      } else if (response.success && !response.inCombat) {
        // No active combat
        this.clearCombat();
      }
    } catch (error) {
      console.error('Error checking combat status:', error);
    }
  }

  /**
   * Check if player can use an ability
   */
  canUseAbility(ability: Ability, combat: Combat): boolean {
    // Check mana cost
    if (combat.playerMana.current < ability.manaCost) {
      return false;
    }

    // Check cooldown - abilityCooldowns stores timestamp when ability becomes available
    const cooldownEnd = combat.abilityCooldowns[ability.abilityId];
    if (cooldownEnd) {
      const now = Date.now();
      if (cooldownEnd > now) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get ability cooldown remaining (in seconds)
   */
  getAbilityCooldownRemaining(abilityId: string): number {
    const combat = this.activeCombat();
    if (!combat) return 0;

    const cooldownEnd = combat.abilityCooldowns[abilityId];
    if (!cooldownEnd) return 0;

    const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
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
   * Handle combat end and rewards
   */
  private handleCombatEnd(rewards: CombatRewards): void {
    const combat = this.activeCombat();
    if (combat) {
      // Set monster health to 0 if victory
      if (rewards.victory) {
        combat.monsterHealth.current = 0;
      }

      // Add reward messages to combat log
      const rewardMessages = this.formatRewardsForLog(rewards);
      rewardMessages.forEach(msg => {
        combat.combatLog.push({
          timestamp: new Date(),
          message: msg.message,
          type: msg.type as any,
          items: msg.items // Include items if present
        });
      });

      // Update combat state with new log entries
      this.activeCombat.set({ ...combat });
    }

    this.inCombat.set(false);
    this.combatEnded.set(true); // Mark combat as ended but keep state for review
    this.lastRewards.set(rewards);
  }

  /**
   * Format attack message based on attacker and result
   */
  private formatAttackMessage(attacker: 'player' | 'monster', result: any, monsterName?: string): string {
    if (attacker === 'player') {
      if (result.isDodge) {
        return `Your attack missed - the monster dodged!`;
      } else if (result.isCrit) {
        return `CRITICAL HIT! You deal ${result.damage} damage!`;
      } else {
        return `You deal ${result.damage} damage.`;
      }
    } else {
      const name = monsterName || 'Monster';
      if (result.isDodge) {
        return `${name}'s attack missed - You dodged!`;
      } else if (result.isCrit) {
        return `${name} CRITICALLY HITS you for ${result.damage} damage!`;
      } else {
        return `${name} deals ${result.damage} damage.`;
      }
    }
  }

  /**
   * Format ability usage message
   */
  private formatAbilityMessage(abilityName: string, result: any): string {
    if (result.isDodge) {
      return `${abilityName} missed - the monster dodged!`;
    } else if (result.isCrit) {
      return `CRITICAL ${abilityName}! You deal ${result.damage} damage!`;
    } else {
      return `You use ${abilityName} for ${result.damage} damage!`;
    }
  }

  /**
   * Format rewards into combat log messages
   */
  private formatRewardsForLog(rewards: CombatRewards): Array<{ message: string; type: string; items?: any[] }> {
    const messages: Array<{ message: string; type: string; items?: any[] }> = [];

    if (rewards.victory) {
      messages.push({ message: '🎉 Victory! You defeated the monster!', type: 'system' });

      if (rewards.gold) {
        messages.push({ message: `💰 Received ${rewards.gold} gold`, type: 'system' });
      }

      if (rewards.experience) {
        const xpEntries = Object.entries(rewards.experience);
        xpEntries.forEach(([skill, xp]) => {
          messages.push({ message: `⭐ Gained ${xp} ${skill} XP`, type: 'system' });
        });
      }

      if (rewards.skillUpdates) {
        Object.values(rewards.skillUpdates).forEach((skillUpdate: any) => {
          if (skillUpdate.leveledUp) {
            messages.push({
              message: `🎊 Level Up! ${skillUpdate.skill} → Level ${skillUpdate.newLevel}`,
              type: 'system'
            });
          }
        });
      }

      if (rewards.items && rewards.items.length > 0) {
        // Create a single loot entry with all items
        messages.push({
          message: '📦 Loot obtained:',
          type: 'loot',
          items: rewards.items
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
   * Restart combat with the same activity (handled by location service)
   */
  restartCombat(): void {
    // Combat restart is handled by the location service via activity system
    // This just clears the combat review state
    this.combatEnded.set(false);
    this.lastRewards.set(null);
  }

  /**
   * Clear combat state
   */
  private clearCombat(): void {
    this.activeCombat.set(null);
    this.inCombat.set(false);
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    // Remove socket listeners
    this.socketService.off('combat:started');
    this.socketService.off('combat:playerAttack');
    this.socketService.off('combat:monsterAttack');
    this.socketService.off('combat:abilityUsed');
    this.socketService.off('combat:itemUsed');
    this.socketService.off('combat:victory');
    this.socketService.off('combat:defeat');
    this.socketService.off('combat:fled');
  }
}
