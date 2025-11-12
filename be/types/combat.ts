/**
 * Combat system type definitions
 */

import { IconConfig, Stats, Skill, Attribute, SkillName, AttributeName } from './common';

// ===== ENUMS & LITERAL TYPES =====

export type AbilityType = 'attack' | 'buff' | 'debuff' | 'heal';

export type TargetType = 'single' | 'aoe' | 'self';

export type DamageType = 'physical' | 'magical';

export type CombatLogType = 'damage' | 'heal' | 'dodge' | 'miss' | 'crit' | 'ability' | 'system';

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
  buff?: {
    stat: string;
    amount: number;
    duration: number;
  };
  critChanceBonus?: number; // Bonus critical hit chance
}

// ===== COMBAT STATE =====

/**
 * Active combat state (stored in Player.activeCombat)
 */
export interface ActiveCombat {
  monster: MonsterInstance;
  turnState: TurnState;
  abilityCooldowns: Record<string, number>;
  combatLog: CombatLogEntry[];
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
 */
export interface CombatLogEntry {
  timestamp: number;
  message: string;
  type: 'damage' | 'heal' | 'ability' | 'status' | 'loot' | 'experience';
  actor: 'player' | 'monster';
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
