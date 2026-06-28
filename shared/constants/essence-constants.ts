/**
 * Essence Constants
 *
 * Maps a monster family to the crystallized essence it yields on defeat.
 *
 * Lore: monsters are born of magic, and that mana is conserved - on defeat it
 * crystallizes into an essence (see project/ideas/story.md, enchanting.md).
 *
 * Drop rule: a defeated monster yields ONE essence per mapped family, granted
 * separately from (and in addition to) its weighted loot tables, so essences
 * are always awarded. A multi-family monster (e.g. a goblin shaman:
 * goblinoid + caster) yields one of each.
 *
 * Partial map: families without an essence yet (undead, aberrant - no monsters
 * of those families exist) simply drop nothing until their essences are added.
 */

import { MonsterFamily } from '../types/combat';

export const FAMILY_ESSENCE: Partial<Record<MonsterFamily, string>> = {
  goblinoid: 'essence_goblinoid',
  beast: 'essence_beast',
  humanoid: 'essence_humanoid',
  caster: 'essence_caster',
};
