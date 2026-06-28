/**
 * Trigger Service
 *
 * The event-driven, side-effecting half of the effect system. Where the
 * effectEvaluator answers "given this context, what number do I apply?",
 * the trigger service answers "an event just happened — roll each matching
 * effect's chance, and execute the actions that fire."
 *
 * Flow:
 *   combat hook → triggerService.fire(event)
 *     → effectEvaluator.collectTriggers(source, type)   (read: matching, condition-met)
 *     → roll chance per match
 *     → dispatch action to a handler keyed by TriggerActionType
 *     → return outcomes for the combat log
 *
 * Adding a new triggered effect = pure data (a trait/quality declares it),
 * provided its TriggerActionType already has a handler here. New action TYPES
 * are the only thing that needs code — register one handler and every future
 * effect using it works.
 *
 * See project/ideas/triggered-effects.md.
 */

import {
  TriggerAction,
  TriggerActionType,
  TriggerEvent,
  TriggerOutcome,
} from '@shared/types/effect-system';
import effectEvaluator from './effectEvaluator';

type ActionHandler = (action: TriggerAction, event: TriggerEvent) => TriggerOutcome;

class TriggerService {
  private handlers = new Map<TriggerActionType, ActionHandler>();

  constructor() {
    this.registerDefaultHandlers();
  }

  /**
   * Fire all triggered effects on the source entity's gear for this event.
   * Mutates entities/player in place via action handlers; returns outcomes
   * (with messages) for the caller to append to the combat log.
   */
  async fire(event: TriggerEvent): Promise<TriggerOutcome[]> {
    const runtime = this.buildRuntime(event);
    const matches = effectEvaluator.collectTriggers(event.source, event.type, runtime);
    if (matches.length === 0) return [];

    const outcomes: TriggerOutcome[] = [];
    for (const match of matches) {
      // Chance gate
      if (Math.random() >= match.effect.chance) continue;

      const handler = this.handlers.get(match.effect.action.type);
      if (!handler) {
        console.warn(`No trigger action handler for: ${match.effect.action.type}`);
        continue;
      }

      const outcome = handler(match.effect.action, event);
      outcome.sourceType = match.sourceType;
      outcome.sourceId = match.sourceId;
      outcome.level = match.level;
      outcomes.push(outcome);
    }

    return outcomes;
  }

  /**
   * Register/override a handler for an action type (extension point).
   */
  registerHandler(type: TriggerActionType, handler: ActionHandler): void {
    this.handlers.set(type, handler);
  }

  /**
   * Build the runtime context used for condition checks during collection.
   * Carries the target so conditions like TARGET_FAMILY (e.g. "vs undead") work
   * for essence socketables.
   */
  private buildRuntime(event: TriggerEvent): { [key: string]: any } {
    const source = event.source;
    const target = event.target;

    const sourceMaxHp = source?.maxHP || source?.stats?.health?.max || 1;
    const sourceHp = source?.stats?.health?.current ?? sourceMaxHp;
    const targetMaxHp = target?.maxHP || target?.stats?.health?.max || 1;
    const targetHp = target?.stats?.health?.current ?? targetMaxHp;

    return {
      inCombat: true,
      target,
      hpPercent: sourceHp / sourceMaxHp,
      targetHpPercent: targetHp / targetMaxHp,
    };
  }

  // ===== ACTION HANDLERS =====
  // Seeded with the full taxonomy. STEAL_GOLD / DEAL_DAMAGE / HEAL are fully
  // wired (they only touch gold + HP). The buff-backed actions (APPLY_DOT /
  // APPLY_BUFF / APPLY_DEBUFF) are registered and produce outcomes, but their
  // integration with the combat buff system is still pending design — see TODO.

  private registerDefaultHandlers(): void {
    this.handlers.set(TriggerActionType.STEAL_GOLD, (action, event) => {
      const amount = Math.max(0, Math.floor(action.value));
      if (event.player && typeof event.player.gold === 'number') {
        event.player.gold += amount;
      }
      return {
        triggered: true,
        action: action.type,
        message: `Siphoned ${amount} gold!`,
        data: { gold: amount },
      };
    });

    this.handlers.set(TriggerActionType.DEAL_DAMAGE, (action, event) => {
      const damage = Math.max(0, Math.floor(action.value));
      const health = event.target?.stats?.health;
      if (health) {
        health.current = Math.max(0, health.current - damage);
      }
      return {
        triggered: true,
        action: action.type,
        message: `Triggered effect deals ${damage} bonus damage!`,
        data: { damage },
      };
    });

    this.handlers.set(TriggerActionType.HEAL, (action, event) => {
      const heal = Math.max(0, Math.floor(action.value));
      const health = event.source?.stats?.health;
      if (health) {
        const max = event.source?.maxHP || health.max || health.current;
        health.current = Math.min(max, health.current + heal);
      }
      return {
        triggered: true,
        action: action.type,
        message: `Triggered effect heals ${heal} HP!`,
        data: { heal },
      };
    });

    // TODO: wire into the combat buff system (combatService.applyBuff / ActiveBuff).
    // Registered now so the taxonomy is complete and content can reference them;
    // currently they only surface an outcome message without applying the buff.
    const buffNotImplemented = (label: string): ActionHandler => (action) => ({
      triggered: true,
      action: action.type,
      message: `Triggered effect (${label}) — buff integration pending.`,
      data: { value: action.value, params: action.params },
    });

    this.handlers.set(TriggerActionType.APPLY_DOT, buffNotImplemented('damage over time'));
    this.handlers.set(TriggerActionType.APPLY_BUFF, buffNotImplemented('buff'));
    this.handlers.set(TriggerActionType.APPLY_DEBUFF, buffNotImplemented('debuff'));
  }
}

export const triggerService = new TriggerService();
export default triggerService;
