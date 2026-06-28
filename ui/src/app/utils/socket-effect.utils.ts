import { SocketEffect } from '@shared/types';

/**
 * Utilities for presenting a socketable's effect (its `socketEffect`) to players.
 *
 * A socketable (sigil) carries two effect channels — passive `applicators` and
 * event-driven `triggers` — mirroring traits/qualities. Each entry may carry a
 * human-readable `description`; we surface those, falling back to a terse
 * generated line so an effect never renders as a blank.
 */

/** Collect human-readable lines describing what a socketEffect does. */
export function summarizeSocketEffect(effect?: SocketEffect): string[] {
  if (!effect) return [];
  const lines: string[] = [];

  for (const applicator of effect.applicators ?? []) {
    lines.push(applicator.description?.trim() || 'Passive bonus while socketed.');
  }

  for (const trigger of effect.triggers ?? []) {
    if (trigger.description?.trim()) {
      lines.push(trigger.description.trim());
    } else {
      const chance = Math.round((trigger.chance ?? 0) * 100);
      lines.push(`${chance}% chance on ${formatTriggerEvent(trigger.trigger)}.`);
    }
  }

  return lines;
}

/** Whether an item definition has any renderable socket effect. */
export function hasSocketEffect(effect?: SocketEffect): boolean {
  return !!effect && ((effect.applicators?.length ?? 0) > 0 || (effect.triggers?.length ?? 0) > 0);
}

/** Turn a trigger enum (e.g. ON_HIT / on_hit) into readable text ("hit"). */
function formatTriggerEvent(trigger: string): string {
  return trigger
    .toLowerCase()
    .replace(/^on[_\s]?/, '')
    .replace(/[_\s]+/g, ' ')
    .trim() || 'trigger';
}
