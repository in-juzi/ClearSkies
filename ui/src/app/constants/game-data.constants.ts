/**
 * Centralized game data constants
 * Single source of truth for skills, attributes, and related metadata
 */

import { SkillName, AttributeName } from '../models/user.model';

/**
 * All skill names in the game
 */
export const ALL_SKILLS: readonly SkillName[] = [
  'woodcutting',
  'mining',
  'fishing',
  'gathering',
  'smithing',
  'cooking',
  'alchemy',
  'oneHanded',
  'dualWield',
  'twoHanded',
  'ranged',
  'casting',
  'gun'
] as const;

/**
 * All attribute names in the game
 */
export const ALL_ATTRIBUTES: readonly AttributeName[] = [
  'strength',
  'endurance',
  'wisdom', // Renamed from 'magic'
  'perception',
  'dexterity',
  'will',
  'charisma'
] as const;

/**
 * Skill display names (human-readable)
 */
export const SKILL_DISPLAY_NAMES: Record<SkillName, string> = {
  woodcutting: 'Woodcutting',
  mining: 'Mining',
  fishing: 'Fishing',
  gathering: 'Gathering',
  smithing: 'Smithing',
  cooking: 'Cooking',
  alchemy: 'Alchemy',
  oneHanded: 'One-Handed',
  dualWield: 'Dual Wield',
  twoHanded: 'Two-Handed',
  ranged: 'Ranged',
  casting: 'Casting',
  gun: 'Gun'
};

/**
 * Skill icon paths
 */
export const SKILL_ICONS: Record<SkillName, string> = {
  woodcutting: 'assets/icons/skills/skill_woodcutting.svg',
  mining: 'assets/icons/ui/ui_dig_1.svg',
  fishing: 'assets/icons/ui/ui_fishing_new.svg',
  gathering: 'assets/icons/skills/skill_herbalism.svg',
  smithing: 'assets/icons/skills/skill_blacksmithing.svg',
  cooking: 'assets/icons/skills/skill_cooking.svg',
  alchemy: 'assets/icons/skills/skill_alchemy.svg',
  oneHanded: 'assets/icons/abilities/ability_quick_slash.svg',
  dualWield: 'assets/icons/abilities/ability_slash_2.svg',
  twoHanded: 'assets/icons/abilities/ability_hammer_smash.svg',
  ranged: 'assets/icons/abilities/ability_piercing_arrow.svg',
  casting: 'assets/icons/abilities/ability_lightning_strike.svg',
  gun: 'assets/icons/abilities/ability_plasma_shot.svg'
};

/**
 * Attribute display names (human-readable)
 */
export const ATTRIBUTE_DISPLAY_NAMES: Record<AttributeName, string> = {
  strength: 'Strength',
  endurance: 'Endurance',
  wisdom: 'Wisdom', // Renamed from 'Magic'
  perception: 'Perception',
  dexterity: 'Dexterity',
  will: 'Will',
  charisma: 'Charisma'
};

/**
 * Attribute icon paths
 */
export const ATTRIBUTE_ICONS: Record<AttributeName, string> = {
  strength: 'assets/icons/attributes/attr_strength.svg',
  endurance: 'assets/icons/attributes/attr_endurance.svg',
  wisdom: 'assets/icons/attributes/attr_magic.svg', // Still using magic icon for now
  perception: 'assets/icons/attributes/attr_perception.svg',
  dexterity: 'assets/icons/attributes/attr_dexterity.svg',
  will: 'assets/icons/attributes/attr_will.svg',
  charisma: 'assets/icons/attributes/attr_charisma.svg'
};

/**
 * Helper function to format skill names for display
 * Handles camelCase conversion (e.g., 'oneHanded' -> 'One Handed')
 */
export function formatSkillName(skillName: SkillName): string {
  return SKILL_DISPLAY_NAMES[skillName];
}

/**
 * Helper function to format attribute names for display
 */
export function formatAttributeName(attributeName: AttributeName): string {
  return ATTRIBUTE_DISPLAY_NAMES[attributeName];
}

/**
 * Equipment subtype display names (human-readable)
 */
export const EQUIPMENT_SUBTYPE_DISPLAY_NAMES: Record<string, string> = {
  // Tool subtypes
  'woodcutting-axe': 'Woodcutting Axe',
  'mining-pickaxe': 'Mining Pickaxe',
  'fishing-rod': 'Fishing Rod',
  'gathering-sickle': 'Gathering Sickle',

  // Weapon subtypes
  'sword': 'Sword',
  'axe': 'Axe',
  'mace': 'Mace',
  'dagger': 'Dagger',
  'staff': 'Staff',
  'bow': 'Bow',
  'crossbow': 'Crossbow',
  'gun': 'Gun',
  'shield': 'Shield',

  // Armor subtypes
  'helm': 'Helm',
  'coif': 'Coif',
  'tunic': 'Tunic',
  'plate': 'Plate',
  'gloves': 'Gloves',
  'boots': 'Boots',
  'belt': 'Belt'
};

/**
 * Helper function to format equipment subtype names for display
 * Includes fallback formatter for unmapped subtypes
 */
export function formatEquipmentSubtype(subtype: string): string {
  // Check if we have a mapped display name
  if (EQUIPMENT_SUBTYPE_DISPLAY_NAMES[subtype]) {
    return EQUIPMENT_SUBTYPE_DISPLAY_NAMES[subtype];
  }

  // Fallback: converts kebab-case to Title Case
  // Example: 'woodcutting-axe' -> 'Woodcutting Axe'
  return subtype
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
