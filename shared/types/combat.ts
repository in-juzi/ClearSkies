/**
 * Combat system type definitions
 */

import { IconConfig, Stats, Skill, Attribute, SkillName, AttributeName } from './common';

// ===== ENUMS & LITERAL TYPES =====

export type AbilityType = 'attack' | 'buff' | 'debuff' | 'heal';

export type TargetType = 'single' | 'aoe' | 'self';

export type DamageType = 'physical' | 'magical';

export type CombatLogType = 'damage' | 'heal' | 'dodge' | 'miss' | 'crit' | 'ability' | 'system' | 'buff' | 'debuff';

export type BuffTarget = 'player' | 'monster';

export type StatModifierType = 'flat' | 'percentage';

// ===== MONSTER DEFINITIONS =====

/**
 * Monster definition
 */
export interface Monster {
  monsterId: string;
  name: string;
  description: string;
  level: number;
  stats: {
    health: Stats;
    mana: Stats;
  };
  attributes: Record<AttributeName, Attribute>;
  skills: Partial<Record<SkillName, Skill>>; // Monsters may only have combat skills
  equipment: MonsterEquipment;
  combatStats: {
    armor: number;
    evasion: number;
  };
  passiveAbilities: PassiveAbility[];
  lootTables: string[];
  goldDrop: {
    min: number;
    max: number;
  };
  experience: number;
}

/**
 * Monster equipment (weapon, armor, or natural attacks)
 */
export interface MonsterEquipment {
  weapon?: MonsterWeapon;
  armor?: MonsterArmor;
  natural?: MonsterWeapon; // For creatures without equipment
}

/**
 * Monster weapon stats
 */
export interface MonsterWeapon {
  name: string;
  damageRoll: string;
  attackSpeed: number;
  critChance: number;
  skillScalar: string;
}

/**
 * Monster armor stats
 */
export interface MonsterArmor {
  name: string;
  armor: number;
  evasion: number;
}

/**
 * Passive ability on a monster
 */
export interface PassiveAbility {
  abilityId: string;
  name: string;
  description: string;
  effects: Record<string, any>;
}

// ===== ABILITY DEFINITIONS =====

/**
 * Combat ability definition
 */
export interface Ability {
  abilityId: string;
  name: string;
  description: string;
  type: AbilityType;
  targetType: TargetType;
  powerMultiplier: number;
  manaCost: number;
  cooldown: number;
  requirements: AbilityRequirements;
  effects: AbilityEffects;
  icon: IconConfig;
}

/**
 * Requirements to use an ability
 */
export interface AbilityRequirements {
  weaponTypes: string[];
  minSkillLevel: number;
}

/**
 * Effects of an ability
 */
export interface AbilityEffects {
  damage?: {
    type: DamageType;
    multiplier: number;
  };
  heal?: {
    multiplier: number;
  };
  applyBuff?: BuffApplication; // Apply buff/debuff
  critChanceBonus?: number; // Bonus critical hit chance
}

/**
 * Buff application configuration for abilities
 */
export interface BuffApplication {
  target: 'self' | 'enemy'; // Who receives the buff/debuff
  name: string; // Display name
  description: string; // Description of the buff
  duration: number; // Turns
  icon?: IconConfig; // Visual icon
  statModifiers?: StatModifier[]; // Stat modifications
  damageOverTime?: number; // Damage per turn
  healOverTime?: number; // Healing per turn
  manaRegen?: number; // Mana per turn
  manaDrain?: number; // Mana drain per turn
}

/**
 * Stat modifier for buffs/debuffs
 */
export interface StatModifier {
  stat: string; // e.g., 'damage', 'armor', 'evasion', 'critChance'
  type: StatModifierType; // 'flat' or 'percentage'
  value: number; // e.g., 10 for +10 armor, or 0.15 for +15% damage
}

// ===== COMBAT STATE =====

/**
 * Active buff/debuff instance
 */
export interface ActiveBuff {
  buffId: string; // Unique instance ID (UUID)
  abilityId: string; // Reference to ability that created it
  name: string; // Display name
  description: string; // Description
  target: BuffTarget; // 'player' or 'monster'
  appliedAt: number; // Turn number when applied
  duration: number; // Turns remaining
  icon?: IconConfig; // Visual icon
  statModifiers?: StatModifier[]; // Stat modifications
  damageOverTime?: number; // Damage per turn
  healOverTime?: number; // Healing per turn
  manaRegen?: number; // Mana per turn
  manaDrain?: number; // Mana drain per turn
  stackCount?: number; // For stackable buffs (default 1)
}

/**
 * Active combat state (stored in Player.activeCombat)
 * Matches the MongoDB schema in Player.ts
 */
export interface ActiveCombat {
  activityId: string;
  monsterId: string;
  monsterInstance: Map<string, any>; // Stores monster state (hp, mana, etc.)
  playerLastAttackTime?: Date;
  monsterLastAttackTime?: Date;
  playerNextAttackTime?: Date;
  monsterNextAttackTime?: Date;
  turnCount: number;
  abilityCooldowns: Map<string, number>; // abilityId -> cooldown timestamp
  activeBuffs: Map<string, ActiveBuff>; // buffId -> active buff instance
  combatLog: CombatLogEntry[];
  startTime?: Date;
}

/**
 * Monster instance in active combat
 */
export interface MonsterInstance extends Omit<Monster, 'stats'> {
  instanceId: string;
  stats: {
    health: Stats;
    mana: Stats;
  };
}

/**
 * Turn tracking state
 */
export interface TurnState {
  currentTurn: 'player' | 'monster';
  playerNextAttack: number;
  monsterNextAttack: number;
  turnCount: number;
}

/**
 * Combat log entry
 * Matches the MongoDB schema in Player.ts
 */
export interface CombatLogEntry {
  timestamp: Date;
  message: string;
  type: 'damage' | 'heal' | 'dodge' | 'miss' | 'crit' | 'ability' | 'system';
  damageValue?: number;
  target?: 'player' | 'monster';
  isNew?: boolean;
}

// ===== COMBAT STATS =====

/**
 * Combat statistics tracking (stored in Player.combatStats)
 */
export interface CombatStats {
  monstersDefeated: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  deaths: number;
  criticalHits: number;
  dodges: number;
}

// ===== COMBAT CALCULATION TYPES =====

/**
 * Damage calculation result
 */
export interface DamageResult {
  damage: number;
  isCritical: boolean;
  isDodged: boolean;
  damageType: DamageType;
}

/**
 * Attack result
 */
export interface AttackResult {
  success: boolean;
  damage: number;
  isCritical: boolean;
  isDodged: boolean;
  message: string;
}

/**
 * Ability use result
 */
export interface AbilityResult {
  success: boolean;
  damage?: number;
  healing?: number;
  message: string;
  onCooldown: boolean;
}
