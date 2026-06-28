# Triggered Effects (on-hit / on-crit / on-kill / on-being-hit / on-block)

> **Status: foundational slice implemented** (not just planned). This doc describes the *concept*; the code is the source of truth for specifics.

## Why this exists

The data-driven effect system (project/docs/047, 048, 051) is a **pull/query model**: a service asks "for context X, what flat/percentage/multiplier applies?" and gets a number back via `(base + flat) * (1 + pct) * mult`. Every effect there is a **passive, deterministic modifier**.

On-hit-style effects (e.g. the essence socketables in [enchanting.md](enchanting.md) — "chance to steal gold on hit") are the opposite on three axes:

- **Event-driven**, not queried — they fire at the moment a hit resolves.
- **Probabilistic**, not deterministic — there's a chance roll.
- **Side-effecting**, not value-returning — they mutate state (steal gold, apply a bleed), they don't adjust a number.

So they can't be another `EffectContext`. They needed a **second channel** alongside modifier applicators: **triggered effects**.

## The model

A trait/quality/affix/socket level can now declare `triggers` alongside `applicators`. A `TriggeredEffect` has three parts — two of them pure reuse:

```ts
interface TriggeredEffect {
  trigger: TriggerType;          // ON_HIT | ON_CRIT | ON_KILL | ON_BEING_HIT | ON_BLOCK
  chance: number;                // 0–1 probability gate
  condition?: EffectCondition;   // ♻️ REUSED from the existing condition system (e.g. TARGET_FAMILY: undead)
  action: TriggerAction;         // the side-effect — the only genuinely new taxonomy
}
```

`TriggerAction.type` ∈ `STEAL_GOLD | DEAL_DAMAGE | APPLY_DOT | HEAL | APPLY_BUFF | APPLY_DEBUFF`.

**Example — goblin essence "steal gold on hit":**
```ts
triggers: [{
  trigger: TriggerType.ON_HIT,
  chance: 0.15,
  action: { type: TriggerActionType.STEAL_GOLD, value: 5 },
}]
```

## Decisions locked in

1. **Perspective tagging (offensive vs defensive).** Each `TriggerType` is tagged in `TRIGGER_PERSPECTIVE`. Offensive (on-hit/crit/kill) fires from the **attacker's** gear; defensive (on-being-hit/block) from the **victim's**. If an effect needs to react to both sides, declare **two triggers** rather than complicating the model.
2. **Full action taxonomy seeded up front** to shake out issues early, even though only some are fully wired yet (see below).

## How it flows (the mechanism)

```
combat hook point → triggerService.fire(event)
  → effectEvaluator.collectTriggers(source, type)   // read-only: matching + condition-met
  → roll chance per match
  → dispatch action to a handler keyed by TriggerActionType
  → return outcomes → appended to combat log
```

Collection (read) and firing (side-effect) are deliberately split. Collection reuses the same equipped-item walk and condition logic as passive modifiers, so triggers ride the **same trait/quality sources** — and it's **entity-agnostic** (a monster's on-hit poison works through the identical path).

Adding a new triggered effect = **pure data**, as long as its action type already has a handler. New action *types* are the only thing needing code (register one handler).

## Where it lives in code

- **Types**: `shared/types/effect-system.ts` — `TriggerType`, `TriggerActionType`, `TriggerAction`, `TriggeredEffect`, `TriggerEvent`, `TriggeredEffectMatch`, `TriggerOutcome`, `TRIGGER_PERSPECTIVE`; plus `triggers?` on `ModifierLevelEffects`.
- **Collection**: `be/services/effectEvaluator.ts` → `collectTriggers()`.
- **Firing + handlers**: `be/services/triggerService.ts`.
- **Hook points**: `be/sockets/combatHandler.ts` → `performPlayerTurn` (on-hit, on-crit, on-kill) and `performMonsterTurn` (on-being-hit).

## Open questions / TODO

- [ ] **Buff-backed actions** — `APPLY_DOT`, `APPLY_BUFF`, `APPLY_DEBUFF` are registered but not yet integrated with the combat buff system (`combatService.applyBuff` / `ActiveBuff`). They currently surface a log message only. Design the buff-config bridge.
- [ ] **`ON_BLOCK`** — not wired; combat has no block mechanic distinct from dodge/evasion. Hook it in `performMonsterTurn` once a block mechanic exists.
- [ ] **Ability attacks** — `combatService.useAbility` applies damage on its own path and is **not** yet wired for triggers (only auto-attacks in `combatHandler` are). Same `triggerService.fire` pattern applies; add it.
- [ ] **Chance scaling** — `chance` is flat for now. Consider stat/level scaling (mirror the applicator value model).
- [ ] **Outcome plumbing** — outcomes currently just append to the combat log. Decide if the client needs structured trigger events (animations, floating text).
- [ ] **Stacking / ICD** — multiple sources of the same trigger all roll independently. Consider internal cooldowns or per-event caps if procs get spammy.
