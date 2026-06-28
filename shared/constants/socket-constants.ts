/**
 * Socket Constants
 *
 * Socket capacity is DERIVED from an item's rarity, not stored — see
 * project/ideas/enchanting.md "Locked decisions". Keeping it a pure derivation
 * means the count rule (rarity-gated today) can change to quality-gated, or gain
 * an additive "added sockets" craft, without migrating every item instance.
 *
 * Contents (which sigils are slotted) live on the instance as a sparse
 * ItemSocket[] (see common.ts); capacity only bounds how many may be filled.
 */

import { Rarity } from '../types/common';

/** How many sockets an item of each rarity has. */
export const SOCKET_COUNT_BY_RARITY: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

/**
 * Socket capacity for an item of the given rarity.
 * The single chokepoint for the count rule — change the model here.
 */
export function getSocketCount(rarity: Rarity): number {
  return SOCKET_COUNT_BY_RARITY[rarity] ?? 0;
}
