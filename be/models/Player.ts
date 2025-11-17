import mongoose, { Document, Schema, Model } from 'mongoose';
import {
  SkillName,
  AttributeName,
  Skill,
  Attribute,
  Stats,
  QualityMap,
  TraitMap,
  EquipmentSlot,
  CombatLogType,
  ActiveCombat,
  CombatLogEntry,
  CombatStats,
  ActiveQuest,
  ObjectiveProgress,
  PlayerAchievementData
} from '@shared/types';
import { ATTRIBUTE_SCALING } from '../../shared/constants/attribute-constants';

// ============================================================================
// Type Definitions
// ============================================================================

export interface InventoryItem {
  instanceId: string;
  itemId: string;
  quantity: number;
  qualities: Map<string, number>;
  traits: Map<string, number>;
  equipped: boolean;
  acquiredAt: Date;
}

export interface ActiveActivity {
  activityId: string;
  facilityId: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
}

export interface TravelState {
  isTravel: boolean;
  targetLocationId?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface ActiveCrafting {
  recipeId?: string;
  startTime?: Date;
  endTime?: Date;
  selectedIngredients?: Map<string, string[]>;
}

export interface StorageContainer {
  containerId: string;
  containerType: string;
  name: string;
  capacity: number;
  items: InventoryItem[];
}

// CombatLogEntry, ActiveCombat, CombatStats, ActiveQuest, ObjectiveProgress, and PlayerAchievementData imported from @shared/types

export interface PlayerStats {
  health: Stats;
  mana: Stats;
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

// ============================================================================
// Document Interface (represents a Player document from MongoDB)
// ============================================================================

export interface IPlayer extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  experience: number;
  stats: PlayerStats;
  gold: number;
  inventory: InventoryItem[];
  inventoryCapacity: number;
  storageContainers: StorageContainer[];
  equipmentSlots: Map<string, string | null>;
  currentLocation: string;
  discoveredLocations: string[];
  activeActivity?: ActiveActivity;
  travelState?: TravelState;
  activeCrafting?: ActiveCrafting;
  unlockedRecipes: string[]; // Recipe IDs player has discovered
  activeCombat?: ActiveCombat;
  lastCombatActivityId?: string;
  combatStats: CombatStats;
  quests: {
    active: ActiveQuest[];
    completed: string[];
    available: string[];
  };
  achievements: PlayerAchievementData[];
  titles: string[];
  activeTitle: string | null;
  decorations: string[];
  attributes: Record<AttributeName, Attribute>;
  skills: Record<SkillName, Skill>;
  createdAt: Date;
  lastPlayed: Date;

  // Virtual properties
  readonly maxHP: number;
  readonly maxMP: number;
  readonly carryingCapacity: number;
  readonly currentWeight: number;

  // Methods
  updateLastPlayed(): Promise<void>;
  addExperience(amount: number): Promise<boolean>;
  addGold(amount: number): void;
  removeGold(amount: number): void;
  addAttributeExperience(attributeName: AttributeName, amount: number): Promise<{
    leveledUp: boolean;
    oldLevel?: number;
    newLevel?: number;
    level?: number;
    attribute: AttributeName;
  }>;
  getAttributeProgress(attributeName: AttributeName): number;
  addSkillExperience(skillName: SkillName, amount: number): Promise<{
    skill: {
      skill: SkillName;
      leveledUp: boolean;
      level: number;
      oldLevel: number;
      newLevel: number;
    };
    attribute: {
      leveledUp: boolean;
      oldLevel?: number;
      newLevel?: number;
      level?: number;
      attribute: AttributeName;
      experience: number;
    };
  }>;
  getSkillProgress(skillName: SkillName): number;
  getEnrichedSkills(): Record<string, {
    level: number;
    experience: number;
    xpToNextLevel: number;
    percentToNextLevel: number;
    totalXP: number;
    mainAttribute: AttributeName;
  }>;
  getEnrichedAttributes(): Record<string, {
    level: number;
    experience: number;
    xpToNextLevel: number;
    percentToNextLevel: number;
    totalXP: number;
  }>;
  addItem(itemInstance: any): any;
  removeItem(instanceId: string, quantity?: number | null): InventoryItem;
  getItem(instanceId: string): InventoryItem | undefined;
  getItemsByItemId(itemId: string): InventoryItem[];
  getInventorySize(): number;
  getInventoryValue(): number;
  equipItem(instanceId: string, slotName: string): Promise<{ slot: string; item: InventoryItem }>;
  unequipItem(slotName: string): Promise<{ slot: string; item: InventoryItem | undefined }>;
  getActiveCombatSkill(): string;
  getEquippedItems(): Record<string, InventoryItem>;
  isSlotAvailable(slotName: string): boolean;
  addEquipmentSlot(slotName: string): Promise<string>;
  hasEquippedSubtype(subtype: string, itemService: any): boolean;
  hasInventoryItem(itemId: string, minQuantity?: number): boolean;
  getInventoryItemQuantity(itemId: string): number;
  getContainer(containerId: string): StorageContainer;
  getContainerItems(containerId: string): any[];
  depositToContainer(containerId: string, instanceId: string, quantity?: number | null): any;
  withdrawFromContainer(containerId: string, instanceId: string, quantity?: number | null): any;
  takeDamage(amount: number): Promise<boolean>;
  heal(amount: number): void;
  useMana(amount: number): void;
  restoreMana(amount: number): void;
  useConsumableItem(itemInstance: any, itemDefinition: any): {
    healthRestored: number;
    manaRestored: number;
  };
  isInCombat(): boolean;
  addCombatLog(message: string, type?: CombatLogType, damageValue?: number, target?: 'player' | 'monster'): void;
  clearCombat(): void;
  isAbilityOnCooldown(abilityId: string): boolean;
  setAbilityCooldown(abilityId: string, cooldownTurns: number): void;
  getAbilityCooldownRemaining(abilityId: string): number;
  addActiveBuff(buffData: any): void;
  removeActiveBuff(buffId: string): boolean;
  getActiveBuffs(): any[];
  getActiveBuffsForTarget(target: 'player' | 'monster'): any[];
  acceptQuest(questId: string, objectives: ObjectiveProgress[]): void;
  updateQuestObjective(questId: string, objectiveId: string, amount: number): ObjectiveProgress | null;
  completeQuest(questId: string): void;
  isQuestActive(questId: string): boolean;
  isQuestCompleted(questId: string): boolean;
  getActiveQuest(questId: string): ActiveQuest | undefined;
}

// ============================================================================
// Schema Definition
// ============================================================================

const playerSchema = new Schema<IPlayer>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  stats: {
    health: {
      current: { type: Number } // Will be set by pre-save hook based on attributes
    },
    mana: {
      current: { type: Number } // Will be set by pre-save hook based on attributes
    },
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    vitality: { type: Number, default: 10 }
  },
  gold: {
    type: Number,
    default: 100,
    min: 0,
    validate: {
      validator: function(value: number) {
        return !isNaN(value) && isFinite(value);
      },
      message: 'Gold must be a valid number'
    }
  },
  inventory: [{
    instanceId: { type: String, required: true },
    itemId: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    qualities: {
      type: Map,
      of: Number,
      default: {}
    },
    traits: {
      type: Map,
      of: Number,
      default: {}
    },
    equipped: { type: Boolean, default: false },
    acquiredAt: { type: Date, default: Date.now }
  }],
  inventoryCapacity: {
    type: Number,
    default: 100,
    min: 1
  },
  storageContainers: [{
    containerId: { type: String, required: true },
    containerType: { type: String, required: true }, // 'bank', 'housing_chest', etc.
    name: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    items: [{
      instanceId: { type: String, required: true },
      itemId: { type: String, required: true },
      quantity: { type: Number, default: 1, min: 1 },
      qualities: {
        type: Map,
        of: Number,
        default: {}
      },
      traits: {
        type: Map,
        of: Number,
        default: {}
      },
      depositedAt: { type: Date, default: Date.now }
    }]
  }],
  equipmentSlots: {
    type: Map,
    of: String,
    default: () => new Map([
      ['head', null],
      ['body', null],
      ['mainHand', null],
      ['offHand', null],
      ['belt', null],
      ['gloves', null],
      ['boots', null],
      ['necklace', null],
      ['ringRight', null],
      ['ringLeft', null]
    ])
  },
  currentLocation: {
    type: String,
    default: 'kennik'
  },
  discoveredLocations: {
    type: [String],
    default: ['kennik']
  },
  activeActivity: {
    activityId: { type: String },
    facilityId: { type: String },
    locationId: { type: String },
    startTime: { type: Date },
    endTime: { type: Date }
  },
  travelState: {
    isTravel: { type: Boolean, default: false },
    targetLocationId: { type: String },
    startTime: { type: Date },
    endTime: { type: Date }
  },
  activeCrafting: {
    recipeId: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    selectedIngredients: { type: Map, of: [String] }
  },
  unlockedRecipes: {
    type: [String],
    default: []
  },
  activeCombat: {
    activityId: { type: String },
    monsterId: { type: String },
    monsterInstance: { type: Map, of: Schema.Types.Mixed },
    playerLastAttackTime: { type: Date },
    monsterLastAttackTime: { type: Date },
    playerNextAttackTime: { type: Date },
    monsterNextAttackTime: { type: Date },
    turnCount: { type: Number, default: 0 },
    abilityCooldowns: { type: Map, of: Number },
    activeBuffs: { type: Map, of: Schema.Types.Mixed, default: () => new Map() },
    combatLog: [{
      timestamp: { type: Date, default: Date.now },
      message: { type: String },
      type: { type: String, enum: ['damage', 'heal', 'dodge', 'miss', 'crit', 'ability', 'system', 'buff', 'debuff'] },
      damageValue: { type: Number },
      target: { type: String, enum: ['player', 'monster'] },
      isNew: { type: Boolean, default: true }
    }],
    startTime: { type: Date }
  },
  lastCombatActivityId: { type: String },
  combatStats: {
    monstersDefeated: { type: Number, default: 0 },
    totalDamageDealt: { type: Number, default: 0 },
    totalDamageTaken: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    criticalHits: { type: Number, default: 0 },
    dodges: { type: Number, default: 0 }
  },
  quests: {
    active: [{
      questId: { type: String, required: true },
      startedAt: { type: Date, required: true },
      objectives: [{
        objectiveId: { type: String, required: true },
        type: { type: String, required: true },
        current: { type: Number, default: 0 },
        required: { type: Number, required: true },
        completed: { type: Boolean, default: false }
      }],
      turnedIn: { type: Boolean, default: false }
    }],
    completed: [{ type: String }],
    available: [{ type: String }]
  },
  achievements: [{
    achievementId: { type: String, required: true },
    unlockedAt: { type: Date, required: true },
    progress: { type: Number, default: 0 }
  }],
  titles: [{ type: String }],
  activeTitle: { type: String, default: null },
  decorations: [{ type: String }],
  attributes: {
    strength: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    endurance: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    wisdom: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    perception: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    dexterity: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    will: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    charisma: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    }
  },
  skills: {
    woodcutting: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'strength' }
    },
    mining: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'strength' }
    },
    fishing: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'endurance' }
    },
    smithing: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'endurance' }
    },
    cooking: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'will' }
    },
    gathering: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'will' }
    },
    alchemy: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'will' }
    },
    oneHanded: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'strength' }
    },
    dualWield: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'dexterity' }
    },
    twoHanded: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'strength' }
    },
    ranged: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'dexterity' }
    },
    casting: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'wisdom' }
    },
    protection: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'endurance' }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastPlayed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ============================================================================
// Virtual Properties
// ============================================================================

// Maximum HP based on attributes
playerSchema.virtual('maxHP').get(function(this: IPlayer) {
  const str = this.attributes.strength?.level || 1;
  const end = this.attributes.endurance?.level || 1;
  const will = this.attributes.will?.level || 1;

  return ATTRIBUTE_SCALING.BASE_HP +
    (str * ATTRIBUTE_SCALING.STR_HP_BONUS) +
    (end * ATTRIBUTE_SCALING.END_HP_BONUS) +
    (will * ATTRIBUTE_SCALING.WILL_HP_BONUS);
});

// Maximum MP based on attributes
playerSchema.virtual('maxMP').get(function(this: IPlayer) {
  const wis = this.attributes.wisdom?.level || 1;
  const will = this.attributes.will?.level || 1;

  return ATTRIBUTE_SCALING.BASE_MP +
    (wis * ATTRIBUTE_SCALING.WIS_MP_BONUS) +
    (will * ATTRIBUTE_SCALING.WILL_MP_BONUS);
});

// Carrying capacity (kg) based on attributes
playerSchema.virtual('carryingCapacity').get(function(this: IPlayer) {
  const str = this.attributes.strength?.level || 1;
  const end = this.attributes.endurance?.level || 1;

  return ATTRIBUTE_SCALING.BASE_CAPACITY_KG +
    (str * ATTRIBUTE_SCALING.STR_CAPACITY_BONUS) +
    (end * ATTRIBUTE_SCALING.END_CAPACITY_BONUS);
});

// Current weight of all inventory items
playerSchema.virtual('currentWeight').get(function(this: IPlayer) {
  // Import itemService dynamically to avoid circular dependency
  const itemService = require('../services/itemService').default;

  let totalWeight = 0;
  for (const item of this.inventory) {
    const itemDef = itemService.getItemDefinition(item.itemId);
    if (itemDef && itemDef.properties.weight) {
      totalWeight += itemDef.properties.weight * item.quantity;
    }
  }

  return Math.round(totalWeight * 10) / 10; // Round to 1 decimal place
});

// ============================================================================
// Middleware Hooks
// ============================================================================

// Pre-save hook: Initialize HP/MP for new players based on starting attributes
playerSchema.pre('save', function(this: IPlayer, next) {
  // Only run for new documents (not on updates)
  if (this.isNew) {
    // Set current HP/MP to max based on starting attributes
    // This ensures new players start with full health/mana
    if (this.stats.health.current === undefined || this.stats.health.current === null) {
      this.stats.health.current = this.maxHP;
    }
    if (this.stats.mana.current === undefined || this.stats.mana.current === null) {
      this.stats.mana.current = this.maxMP;
    }
  }
  next();
});

// ============================================================================
// Instance Methods
// ============================================================================

// Update last played time
playerSchema.methods.updateLastPlayed = async function(this: IPlayer): Promise<void> {
  this.lastPlayed = new Date();
  await this.save();
};

// Add experience and handle leveling
playerSchema.methods.addExperience = async function(this: IPlayer, amount: number): Promise<boolean> {
  this.experience += amount;

  // Simple leveling formula: level = floor(sqrt(experience / 100))
  const newLevel = Math.floor(Math.sqrt(this.experience / 100)) + 1;

  if (newLevel > this.level && newLevel <= 100) {
    this.level = newLevel;
    // HP/MP now come from attributes - fully restore on level up
    this.stats.health.current = this.maxHP;
    this.stats.mana.current = this.maxMP;
    // Note: stats.strength/dexterity/intelligence/vitality are deprecated
    // Character progression now happens through attribute leveling
  }

  await this.save();
  return newLevel > this.level - 1; // Return true if leveled up
};

// Add gold
playerSchema.methods.addGold = function(this: IPlayer, amount: number): void {
  // Ensure gold is a valid number (handle undefined or NaN)
  if (typeof this.gold !== 'number' || isNaN(this.gold)) {
    this.gold = 0;
  }
  this.gold += amount;
};

// Remove gold (with validation)
playerSchema.methods.removeGold = function(this: IPlayer, amount: number): void {
  // Ensure gold is a valid number (handle undefined or NaN)
  if (typeof this.gold !== 'number' || isNaN(this.gold)) {
    this.gold = 0;
  }
  if (this.gold < amount) {
    throw new Error('Insufficient gold');
  }
  this.gold -= amount;
};

// Add attribute experience and handle attribute leveling
playerSchema.methods.addAttributeExperience = async function(
  this: IPlayer,
  attributeName: AttributeName,
  amount: number
): Promise<{
  leveledUp: boolean;
  oldLevel?: number;
  newLevel?: number;
  level?: number;
  attribute: AttributeName;
}> {
  const { getXPForLevel } = require('@shared/constants/attribute-constants');
  const validAttributes: AttributeName[] = ['strength', 'endurance', 'wisdom', 'perception', 'dexterity', 'will', 'charisma'];

  if (!validAttributes.includes(attributeName)) {
    throw new Error(`Invalid attribute name: ${attributeName}`);
  }

  const attribute = this.attributes[attributeName];
  const oldLevel = attribute.level;
  attribute.experience += amount;

  // Check for level up using new XP curve
  let leveledUp = false;
  let newLevel = oldLevel;

  while (attribute.experience >= getXPForLevel(newLevel)) {
    attribute.experience -= getXPForLevel(newLevel);
    newLevel++;
    leveledUp = true;
  }

  if (leveledUp) {
    attribute.level = newLevel;
    await this.save();
    return { leveledUp: true, oldLevel, newLevel, attribute: attributeName };
  }

  await this.save();
  return { leveledUp: false, level: attribute.level, attribute: attributeName };
};

// Get progress to next attribute level (0-100%)
playerSchema.methods.getAttributeProgress = function(this: IPlayer, attributeName: AttributeName): number {
  const { getPercentToNextLevel } = require('@shared/constants/attribute-constants');
  const validAttributes: AttributeName[] = ['strength', 'endurance', 'wisdom', 'perception', 'dexterity', 'will', 'charisma'];

  if (!validAttributes.includes(attributeName)) {
    throw new Error(`Invalid attribute name: ${attributeName}`);
  }

  const attribute = this.attributes[attributeName];
  return getPercentToNextLevel(attribute.level, attribute.experience);
};

// Add skill experience and handle skill leveling
// Also awards XP to the skill's main attribute (50% of skill XP)
playerSchema.methods.addSkillExperience = async function(
  this: IPlayer,
  skillName: SkillName,
  amount: number
): Promise<{
  skill: {
    skill: SkillName;
    leveledUp: boolean;
    level: number;
    oldLevel: number;
    newLevel: number;
  };
  attribute: {
    leveledUp: boolean;
    oldLevel?: number;
    newLevel?: number;
    level?: number;
    attribute: AttributeName;
    experience: number;
  };
}> {
  const { getXPForLevel } = require('@shared/constants/attribute-constants');
  const validSkills: SkillName[] = [
    'woodcutting', 'mining', 'fishing', 'gathering', 'smithing', 'cooking', 'alchemy',
    'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'protection'
  ];

  if (!validSkills.includes(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const skill = this.skills[skillName];
  const oldLevel = skill.level;
  skill.experience += amount;

  // Check for level up using new XP curve
  let leveledUp = false;
  let newLevel = oldLevel;

  while (skill.experience >= getXPForLevel(newLevel)) {
    skill.experience -= getXPForLevel(newLevel);
    newLevel++;
    leveledUp = true;
  }

  if (leveledUp) {
    skill.level = newLevel;

    // Trigger quest system for skill level-up (for SharpeningYourSkills quest)
    try {
      const questService = require('../services/questService').default;
      await questService.onSkillLevelUp(this, skillName, newLevel);
    } catch (error) {
      console.error('Error updating quest progress on skill level-up:', error);
    }
  }

  const skillResult = {
    skill: skillName,
    leveledUp,
    level: skill.level,
    oldLevel,
    newLevel: skill.level
  };

  // Award attribute XP (50% of skill XP to main attribute)
  const mainAttribute = skill.mainAttribute as AttributeName;
  const attributeXP = Math.floor(amount * 0.5);
  const attributeResult = await this.addAttributeExperience(mainAttribute, attributeXP);

  return {
    skill: skillResult,
    attribute: {
      ...attributeResult,
      experience: attributeXP
    }
  };
};

// Get progress to next skill level (0-100%)
playerSchema.methods.getSkillProgress = function(this: IPlayer, skillName: SkillName): number {
  const { getPercentToNextLevel } = require('@shared/constants/attribute-constants');
  const validSkills: SkillName[] = [
    'woodcutting', 'mining', 'fishing', 'gathering', 'smithing', 'cooking', 'alchemy',
    'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'protection'
  ];

  if (!validSkills.includes(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const skill = this.skills[skillName];
  return getPercentToNextLevel(skill.level, skill.experience);
};

// Get enriched skill data with progression info for UI
playerSchema.methods.getEnrichedSkills = function(this: IPlayer) {
  const { getXPForLevel } = require('@shared/constants/attribute-constants');
  const enriched: Record<string, any> = {};

  for (const [skillName, skillData] of Object.entries(this.skills)) {
    enriched[skillName] = {
      level: skillData.level,
      experience: skillData.experience,
      xpToNextLevel: getXPForLevel(skillData.level),
      mainAttribute: skillData.mainAttribute
    };
  }

  return enriched;
};

// Get enriched attribute data with progression info for UI
playerSchema.methods.getEnrichedAttributes = function(this: IPlayer) {
  const { getXPForLevel } = require('@shared/constants/attribute-constants');
  const enriched: Record<string, any> = {};

  for (const [attributeName, attributeData] of Object.entries(this.attributes)) {
    enriched[attributeName] = {
      level: attributeData.level,
      experience: attributeData.experience,
      xpToNextLevel: getXPForLevel(attributeData.level)
    };
  }

  return enriched;
};

// ============================================================================
// Inventory Management Methods
// ============================================================================

// Add item to inventory
playerSchema.methods.addItem = function(this: IPlayer, itemInstance: any): any {
  // Import itemService for weight calculation
  const itemService = require('../services/itemService').default;
  const itemDef = itemService.getItemDefinition(itemInstance.itemId);

  // Check weight-based carrying capacity
  const itemWeight = itemDef?.properties?.weight || 0;
  const totalItemWeight = itemWeight * itemInstance.quantity;
  const currentWeight = this.currentWeight; // Uses virtual property
  const capacity = this.carryingCapacity; // Uses virtual property

  if (currentWeight + totalItemWeight > capacity) {
    const available = capacity - currentWeight;
    throw new Error(
      `Cannot carry ${totalItemWeight.toFixed(1)}kg (${available.toFixed(1)}kg capacity remaining, ${capacity.toFixed(1)}kg total)`
    );
  }

  // Try to stack with existing items
  const existingItem = this.inventory.find(inv =>
    itemService.canStack(inv, itemInstance)
  );

  if (existingItem) {

    if (itemDef.stackable) {
      existingItem.quantity += itemInstance.quantity;
    } else {
      // Can't stack, add as new item
      this.inventory.push(itemInstance);
    }
  } else {
    // New item, add to inventory
    this.inventory.push(itemInstance);
  }

  return itemInstance;
};

// Remove item from inventory by instance ID
playerSchema.methods.removeItem = function(
  this: IPlayer,
  instanceId: string,
  quantity: number | null = null
): InventoryItem {
  const itemIndex = this.inventory.findIndex(item => item.instanceId === instanceId);

  if (itemIndex === -1) {
    throw new Error('Item not found in inventory');
  }

  const item = this.inventory[itemIndex];

  if (quantity === null || quantity >= item.quantity) {
    // Remove entire stack
    this.inventory.splice(itemIndex, 1);
  } else {
    // Remove partial quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    item.quantity -= quantity;
  }

  return item;
};

// Get item from inventory by instance ID
playerSchema.methods.getItem = function(this: IPlayer, instanceId: string): InventoryItem | undefined {
  return this.inventory.find(item => item.instanceId === instanceId);
};

// Get all items of a specific itemId
playerSchema.methods.getItemsByItemId = function(this: IPlayer, itemId: string): InventoryItem[] {
  return this.inventory.filter(item => item.itemId === itemId);
};

// Get inventory size
playerSchema.methods.getInventorySize = function(this: IPlayer): number {
  return this.inventory.reduce((sum, item) => sum + item.quantity, 0);
};

// Get inventory value (total vendor price)
playerSchema.methods.getInventoryValue = function(this: IPlayer): number {
  const itemService = require('../services/itemService').default;
  return this.inventory.reduce((sum, item) => {
    const price = itemService.calculateVendorPrice(item);
    return sum + (price * item.quantity);
  }, 0);
};

// ============================================================================
// Equipment Management Methods
// ============================================================================

// Equip an item to a slot
playerSchema.methods.equipItem = async function(
  this: IPlayer,
  instanceId: string,
  slotName: string
): Promise<{ slot: string; item: InventoryItem }> {
  const itemService = require('../services/itemService').default;

  // Find the item in inventory
  const item = this.getItem(instanceId);
  if (!item) {
    throw new Error('Item not found in inventory');
  }

  // Get item definition to check if it can be equipped
  const itemDef = itemService.getItemDefinition(item.itemId);
  if (!itemDef) {
    throw new Error('Item definition not found');
  }

  // Check if item is equippable
  if (itemDef.category !== 'equipment' || !itemDef.slot) {
    throw new Error('Item cannot be equipped');
  }

  // Validate the slot exists
  if (!this.equipmentSlots.has(slotName)) {
    throw new Error(`Invalid equipment slot: ${slotName}`);
  }

  // Check if item can be equipped to this slot
  if (itemDef.slot !== slotName) {
    throw new Error(`Item cannot be equipped to ${slotName} slot. It can only be equipped to ${itemDef.slot}`);
  }

  // Two-handed weapon logic
  const isTwoHandedWeapon = (itemDef as any).properties?.twoHanded === true;

  if (isTwoHandedWeapon) {
    // Two-handed weapon being equipped to mainHand
    // Must unequip offHand if anything is there
    const offHandEquipped = this.equipmentSlots.get('offHand');
    if (offHandEquipped) {
      await this.unequipItem('offHand');
    }
  } else if (slotName === 'mainHand' || slotName === 'offHand') {
    // Equipping something to mainHand or offHand
    // Check if a two-handed weapon is currently equipped
    const mainHandInstanceId = this.equipmentSlots.get('mainHand');
    if (mainHandInstanceId) {
      const mainHandItem = this.getItem(mainHandInstanceId);
      if (mainHandItem) {
        const mainHandDef = itemService.getItemDefinition(mainHandItem.itemId);
        if ((mainHandDef as any).properties?.twoHanded === true) {
          // Unequip the two-handed weapon
          await this.unequipItem('mainHand');
        }
      }
    }
  }

  // Check if slot already has an item equipped
  const currentlyEquipped = this.equipmentSlots.get(slotName);
  if (currentlyEquipped) {
    // Unequip current item first
    await this.unequipItem(slotName);
  }

  // Equip the new item
  this.equipmentSlots.set(slotName, instanceId);
  item.equipped = true;

  await this.save();
  return { slot: slotName, item };
};

// Unequip an item from a slot
playerSchema.methods.unequipItem = async function(
  this: IPlayer,
  slotName: string
): Promise<{ slot: string; item: InventoryItem | undefined }> {
  // Validate the slot exists
  if (!this.equipmentSlots.has(slotName)) {
    throw new Error(`Invalid equipment slot: ${slotName}`);
  }

  const instanceId = this.equipmentSlots.get(slotName);
  if (!instanceId) {
    throw new Error(`No item equipped in ${slotName} slot`);
  }

  // Find the item and mark as unequipped
  const item = this.getItem(instanceId);
  if (item) {
    item.equipped = false;
  }

  // Clear the slot
  this.equipmentSlots.set(slotName, null);

  await this.save();
  return { slot: slotName, item };
};

// Get active combat skill based on currently equipped weapons
playerSchema.methods.getActiveCombatSkill = function(this: IPlayer): string {
  const itemService = require('../services/itemService').default;

  const mainHandInstanceId = this.equipmentSlots.get('mainHand');
  const offHandInstanceId = this.equipmentSlots.get('offHand');

  // No weapon equipped - return oneHanded (unarmed combat)
  if (!mainHandInstanceId) {
    return 'oneHanded';
  }

  // Check mainHand weapon
  const mainHandItem = this.getItem(mainHandInstanceId);
  if (!mainHandItem) {
    return 'oneHanded';
  }

  const mainHandDef = itemService.getItemDefinition(mainHandItem.itemId);
  if (!mainHandDef) {
    return 'oneHanded';
  }

  // Check if mainHand weapon is two-handed
  if ((mainHandDef as any).properties?.twoHanded === true) {
    return 'twoHanded';
  }

  // Check offHand for dual-wield
  if (offHandInstanceId) {
    const offHandItem = this.getItem(offHandInstanceId);
    if (offHandItem) {
      const offHandDef = itemService.getItemDefinition(offHandItem.itemId);
      // If offHand has a weapon (not shield/armor), it's dual-wield
      if (offHandDef && (offHandDef as any).subcategories?.includes('weapon')) {
        return 'dualWield';
      }
    }
  }

  // Default: one-handed (weapon + shield/empty offHand)
  return 'oneHanded';
};

// Get all currently equipped items
playerSchema.methods.getEquippedItems = function(this: IPlayer): Record<string, InventoryItem> {
  const equipped: Record<string, InventoryItem> = {};
  for (const [slot, instanceId] of this.equipmentSlots.entries()) {
    if (instanceId) {
      const item = this.getItem(instanceId);
      if (item) {
        equipped[slot] = item;
      }
    }
  }
  return equipped;
};

// Check if a slot is available
playerSchema.methods.isSlotAvailable = function(this: IPlayer, slotName: string): boolean {
  if (!this.equipmentSlots.has(slotName)) {
    return false;
  }
  return this.equipmentSlots.get(slotName) === null;
};

// Add a new equipment slot (for future extensibility)
playerSchema.methods.addEquipmentSlot = async function(this: IPlayer, slotName: string): Promise<string> {
  if (this.equipmentSlots.has(slotName)) {
    throw new Error(`Equipment slot ${slotName} already exists`);
  }
  this.equipmentSlots.set(slotName, null);
  await this.save();
  return slotName;
};

// Check if player has an item with a specific subtype equipped (in any slot)
playerSchema.methods.hasEquippedSubtype = function(this: IPlayer, subtype: string, itemService: any): boolean {
  if (!itemService) {
    throw new Error('itemService is required for hasEquippedSubtype');
  }

  // Get all equipped items
  const equippedItems = this.getEquippedItems();

  // Check each equipped item for matching subtype
  for (const item of Object.values(equippedItems)) {
    const itemDef = itemService.getItemDefinition(item.itemId);
    if (itemDef && itemDef.subtype === subtype) {
      return true;
    }
  }

  return false;
};

// Check if player has a specific item in inventory (equipped or not)
playerSchema.methods.hasInventoryItem = function(this: IPlayer, itemId: string, minQuantity: number = 1): boolean {
  const items = this.inventory.filter(item => item.itemId === itemId);

  if (items.length === 0) {
    return false;
  }

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  return totalQuantity >= minQuantity;
};

// Get total quantity of an item in inventory
playerSchema.methods.getInventoryItemQuantity = function(this: IPlayer, itemId: string): number {
  const items = this.inventory.filter(item => item.itemId === itemId);
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

// ============================================================================
// Storage Container Management Methods
// ============================================================================

// Get a storage container by ID
playerSchema.methods.getContainer = function(this: IPlayer, containerId: string): any {
  const container = this.storageContainers.find(c => c.containerId === containerId);
  if (!container) {
    throw new Error(`Container not found: ${containerId}`);
  }
  return container;
};

// Get container items with Map serialization and item details
playerSchema.methods.getContainerItems = function(this: IPlayer, containerId: string): any[] {
  const container = this.getContainer(containerId);
  // Return minimal instance data only - frontend will enrich with definitions
  return container.items.map((item: any) => {
    const plainItem = item.toObject ? item.toObject() : item;
    if (plainItem.qualities instanceof Map) {
      plainItem.qualities = Object.fromEntries(plainItem.qualities);
    }
    if (plainItem.traits instanceof Map) {
      plainItem.traits = Object.fromEntries(plainItem.traits);
    }
    return {
      instanceId: plainItem.instanceId,
      itemId: plainItem.itemId,
      quantity: plainItem.quantity,
      qualities: plainItem.qualities,
      traits: plainItem.traits,
      equipped: plainItem.equipped || false,
      acquiredAt: plainItem.acquiredAt
    };
  });
};

// Deposit item from inventory to container
playerSchema.methods.depositToContainer = function(
  this: IPlayer,
  containerId: string,
  instanceId: string,
  quantity: number | null = null
): any {
  const itemService = require('../services/itemService').default;

  // Find item in inventory
  const inventoryItem = this.getItem(instanceId);
  if (!inventoryItem) {
    throw new Error('Item not found in inventory');
  }

  // Prevent depositing equipped items
  if (inventoryItem.equipped) {
    throw new Error('Cannot deposit equipped items');
  }

  // Get container
  const container = this.getContainer(containerId);

  // Determine quantity to deposit
  const depositQuantity = quantity === null ? inventoryItem.quantity : quantity;
  if (depositQuantity > inventoryItem.quantity) {
    throw new Error('Cannot deposit more than you have');
  }

  // Check container capacity (count unique item stacks)
  const currentSlots = container.items.length;

  // Try to find stackable item in container
  const itemDef = itemService.getItemDefinition(inventoryItem.itemId);
  const existingContainerItem = container.items.find((item: any) =>
    itemService.canStack(item, inventoryItem)
  );

  if (existingContainerItem) {
    // Stack with existing item
    existingContainerItem.quantity += depositQuantity;
  } else {
    // Check if we have space for a new stack
    if (currentSlots >= container.capacity) {
      throw new Error(`Container is full (${container.capacity} slots used)`);
    }

    // Create new item in container
    const newItem: InventoryItem = {
      instanceId: inventoryItem.instanceId,
      itemId: inventoryItem.itemId,
      quantity: depositQuantity,
      qualities: inventoryItem.qualities,
      traits: inventoryItem.traits,
      equipped: false,
      acquiredAt: new Date()
    };
    container.items.push(newItem);
  }

  // Remove from inventory
  if (depositQuantity === inventoryItem.quantity) {
    // Remove entire stack
    const itemIndex = this.inventory.findIndex(item => item.instanceId === instanceId);
    this.inventory.splice(itemIndex, 1);
  } else {
    // Reduce quantity
    inventoryItem.quantity -= depositQuantity;
  }

  return { depositQuantity, itemId: inventoryItem.itemId };
};

// Withdraw item from container to inventory
playerSchema.methods.withdrawFromContainer = function(
  this: IPlayer,
  containerId: string,
  instanceId: string,
  quantity: number | null = null
): any {
  const itemService = require('../services/itemService').default;

  // Get container
  const container = this.getContainer(containerId);

  // Find item in container
  const containerItemIndex = container.items.findIndex((item: any) => item.instanceId === instanceId);
  if (containerItemIndex === -1) {
    throw new Error('Item not found in container');
  }

  const containerItem = container.items[containerItemIndex];
  const itemDef = itemService.getItemDefinition(containerItem.itemId);

  // Determine quantity to withdraw
  const withdrawQuantity = quantity === null ? containerItem.quantity : quantity;
  if (withdrawQuantity > containerItem.quantity) {
    throw new Error('Cannot withdraw more than you have');
  }

  // Check weight capacity
  const itemWeight = itemDef?.properties?.weight || 0;
  const totalItemWeight = itemWeight * withdrawQuantity;
  const currentWeight = this.currentWeight;
  const capacity = this.carryingCapacity;

  if (currentWeight + totalItemWeight > capacity) {
    const available = capacity - currentWeight;
    throw new Error(
      `Cannot carry ${totalItemWeight.toFixed(1)}kg (${available.toFixed(1)}kg capacity remaining)`
    );
  }

  // Try to stack with existing inventory item
  const existingInventoryItem = this.inventory.find(inv =>
    itemService.canStack(inv, containerItem)
  );

  if (existingInventoryItem && itemDef.stackable) {
    // Stack with existing inventory item
    existingInventoryItem.quantity += withdrawQuantity;
  } else {
    // Add as new item to inventory
    const newItem = {
      instanceId: containerItem.instanceId,
      itemId: containerItem.itemId,
      quantity: withdrawQuantity,
      qualities: containerItem.qualities,
      traits: containerItem.traits,
      equipped: false,
      acquiredAt: new Date()
    };
    this.inventory.push(newItem);
  }

  // Remove from container
  if (withdrawQuantity === containerItem.quantity) {
    // Remove entire stack
    container.items.splice(containerItemIndex, 1);
  } else {
    // Reduce quantity
    containerItem.quantity -= withdrawQuantity;
  }

  return { withdrawQuantity, itemId: containerItem.itemId };
};

// ============================================================================
// Combat Management Methods
// ============================================================================

// Take damage and return true if defeated
playerSchema.methods.takeDamage = async function(this: IPlayer, amount: number): Promise<boolean> {
  if (amount < 0) {
    throw new Error('Damage amount must be positive');
  }

  this.stats.health.current = Math.max(0, this.stats.health.current - amount);
  this.combatStats.totalDamageTaken += amount;

  // Award protection XP when taking damage in combat (1 dmg = 1 XP)
  if (this.isInCombat() && amount > 0) {
    await this.addSkillExperience('protection', amount);
  }

  return this.stats.health.current === 0; // Returns true if defeated
};

// Heal health
playerSchema.methods.heal = function(this: IPlayer, amount: number): void {
  if (amount < 0) {
    throw new Error('Heal amount must be positive');
  }

  this.stats.health.current = Math.min(this.maxHP, this.stats.health.current + amount);
};

// Use mana for abilities
playerSchema.methods.useMana = function(this: IPlayer, amount: number): void {
  if (amount < 0) {
    throw new Error('Mana amount must be positive');
  }

  if (this.stats.mana.current < amount) {
    throw new Error('Insufficient mana');
  }

  this.stats.mana.current -= amount;
};

// Restore mana
playerSchema.methods.restoreMana = function(this: IPlayer, amount: number): void {
  if (amount < 0) {
    throw new Error('Mana amount must be positive');
  }

  this.stats.mana.current = Math.min(this.maxMP, this.stats.mana.current + amount);
};

// Use a consumable item and apply its effects
playerSchema.methods.useConsumableItem = function(
  this: IPlayer,
  itemInstance: any,
  itemDefinition: any
): {
  healthRestored: number;
  manaRestored: number;
} {
  if (!itemInstance || !itemDefinition) {
    throw new Error('Item instance and definition are required');
  }

  if (itemDefinition.category !== 'consumable') {
    throw new Error('Item is not consumable');
  }

  const effects = {
    healthRestored: 0,
    manaRestored: 0
  };

  // Apply health restoration
  if (itemDefinition.properties?.healthRestore) {
    const healAmount = itemDefinition.properties.healthRestore;
    const beforeHealth = this.stats.health.current;
    this.heal(healAmount);
    effects.healthRestored = this.stats.health.current - beforeHealth;
  }

  // Apply mana restoration
  if (itemDefinition.properties?.manaRestore) {
    const manaAmount = itemDefinition.properties.manaRestore;
    const beforeMana = this.stats.mana.current;
    this.restoreMana(manaAmount);
    effects.manaRestored = this.stats.mana.current - beforeMana;
  }

  // Add combat log entry if in combat
  if (this.isInCombat()) {
    let message = `Used ${itemDefinition.name}`;
    if (effects.healthRestored > 0) {
      message += ` - Restored ${effects.healthRestored} HP`;
    }
    if (effects.manaRestored > 0) {
      message += ` - Restored ${effects.manaRestored} Mana`;
    }
    this.addCombatLog(message, 'heal');
  }

  return effects;
};

// Check if player is in combat
playerSchema.methods.isInCombat = function(this: IPlayer): boolean {
  return !!(this.activeCombat && this.activeCombat.monsterId);
};

// Add combat log entry
playerSchema.methods.addCombatLog = function(this: IPlayer, message: string, type: CombatLogType = 'system', damageValue?: number, target?: 'player' | 'monster'): void {
  if (!this.activeCombat) {
    throw new Error('Player is not in combat');
  }

  const logEntry = {
    timestamp: new Date(),
    message,
    type,
    damageValue,
    target,
    isNew: true
  } as CombatLogEntry;

  // Keep only last 50 entries to prevent bloat
  if (this.activeCombat.combatLog.length >= 50) {
    this.activeCombat.combatLog.shift();
  }

  (this.activeCombat.combatLog as any).push(logEntry);
};

// Clear active combat (used when combat ends)
playerSchema.methods.clearCombat = function(this: IPlayer): void {
  // Convert remaining HoT effects to instant healing before clearing combat
  if (this.activeCombat && this.activeCombat.activeBuffs) {
    let totalRemainingHealing = 0;

    for (const buff of this.activeCombat.activeBuffs.values()) {
      // Only process HoT buffs on the player
      if (buff.target === 'player' && buff.healOverTime && buff.duration > 0) {
        const remainingHealing = buff.healOverTime * buff.duration;
        totalRemainingHealing += remainingHealing;
      }
    }

    // Apply the converted healing
    if (totalRemainingHealing > 0) {
      this.heal(totalRemainingHealing);
      console.log(`[Combat End] Converted ${totalRemainingHealing} HP from remaining HoT effects`);
    }
  }

  this.activeCombat = {
    activityId: '',
    monsterId: '',
    monsterInstance: new Map(),
    playerLastAttackTime: undefined,
    monsterLastAttackTime: undefined,
    playerNextAttackTime: undefined,
    monsterNextAttackTime: undefined,
    turnCount: 0,
    abilityCooldowns: new Map(),
    activeBuffs: new Map(),
    combatLog: [],
    startTime: undefined
  };
};

// Check if ability is on cooldown
playerSchema.methods.isAbilityOnCooldown = function(this: IPlayer, abilityId: string): boolean {
  if (!this.activeCombat || !this.activeCombat.abilityCooldowns) {
    return false;
  }

  const availableTurn = this.activeCombat.abilityCooldowns.get(abilityId);
  if (!availableTurn) {
    return false;
  }

  return this.activeCombat.turnCount < availableTurn;
};

// Set ability cooldown
playerSchema.methods.setAbilityCooldown = function(this: IPlayer, abilityId: string, cooldownTurns: number): void {
  if (!this.activeCombat) {
    throw new Error('Player is not in combat');
  }

  const availableTurn = this.activeCombat.turnCount + cooldownTurns;
  this.activeCombat.abilityCooldowns!.set(abilityId, availableTurn);
};

// Get ability cooldown remaining turns
playerSchema.methods.getAbilityCooldownRemaining = function(this: IPlayer, abilityId: string): number {
  if (!this.activeCombat || !this.activeCombat.abilityCooldowns) {
    return 0;
  }

  const availableTurn = this.activeCombat.abilityCooldowns.get(abilityId);
  if (!availableTurn) {
    return 0;
  }

  const remaining = availableTurn - this.activeCombat.turnCount;
  return Math.max(0, remaining);
};

// Add active buff
playerSchema.methods.addActiveBuff = function(this: IPlayer, buffData: any): void {
  if (!this.activeCombat) {
    throw new Error('Player is not in combat');
  }

  if (!this.activeCombat.activeBuffs) {
    this.activeCombat.activeBuffs = new Map();
  }

  this.activeCombat.activeBuffs.set(buffData.buffId, buffData);
};

// Remove active buff
playerSchema.methods.removeActiveBuff = function(this: IPlayer, buffId: string): boolean {
  if (!this.activeCombat || !this.activeCombat.activeBuffs) {
    return false;
  }

  return this.activeCombat.activeBuffs.delete(buffId);
};

// Get all active buffs
playerSchema.methods.getActiveBuffs = function(this: IPlayer): any[] {
  if (!this.activeCombat || !this.activeCombat.activeBuffs) {
    return [];
  }

  return Array.from(this.activeCombat.activeBuffs.values());
};

// Get active buffs for a specific target
playerSchema.methods.getActiveBuffsForTarget = function(this: IPlayer, target: 'player' | 'monster'): any[] {
  if (!this.activeCombat || !this.activeCombat.activeBuffs) {
    return [];
  }

  return Array.from(this.activeCombat.activeBuffs.values()).filter(
    (buff: any) => buff.target === target
  );
};

// ============================================================================
// Quest Methods
// ============================================================================

// Accept a quest
playerSchema.methods.acceptQuest = function(this: IPlayer, questId: string, objectives: ObjectiveProgress[]): void {
  if (!this.quests) {
    this.quests = { active: [], completed: [], available: [] };
  }

  this.quests.active.push({
    questId,
    startedAt: new Date(),
    objectives,
    turnedIn: false
  });
};

// Update quest objective progress
playerSchema.methods.updateQuestObjective = function(
  this: IPlayer,
  questId: string,
  objectiveId: string,
  amount: number
): ObjectiveProgress | null {
  if (!this.quests || !this.quests.active) {
    return null;
  }

  const quest = this.quests.active.find((q: ActiveQuest) => q.questId === questId);
  if (!quest) {
    return null;
  }

  const objective = quest.objectives.find((obj: ObjectiveProgress) => obj.objectiveId === objectiveId);
  if (!objective) {
    return null;
  }

  objective.current = Math.min(objective.current + amount, objective.required);
  objective.completed = objective.current >= objective.required;

  return objective;
};

// Complete a quest (mark ready for turn-in)
playerSchema.methods.completeQuest = function(this: IPlayer, questId: string): void {
  if (!this.quests || !this.quests.active) {
    return;
  }

  const quest = this.quests.active.find((q: ActiveQuest) => q.questId === questId);
  if (quest) {
    quest.turnedIn = false; // Ready to turn in but not yet turned in
  }
};

// Check if quest is active
playerSchema.methods.isQuestActive = function(this: IPlayer, questId: string): boolean {
  if (!this.quests || !this.quests.active) {
    return false;
  }

  return this.quests.active.some((q: ActiveQuest) => q.questId === questId);
};

// Check if quest is completed
playerSchema.methods.isQuestCompleted = function(this: IPlayer, questId: string): boolean {
  if (!this.quests || !this.quests.completed) {
    return false;
  }

  return this.quests.completed.includes(questId);
};

// Get active quest by ID
playerSchema.methods.getActiveQuest = function(this: IPlayer, questId: string): ActiveQuest | undefined {
  if (!this.quests || !this.quests.active) {
    return undefined;
  }

  return this.quests.active.find((q: ActiveQuest) => q.questId === questId);
};

// ============================================================================
// Model Export
// ============================================================================

const Player: Model<IPlayer> = mongoose.model<IPlayer>('Player', playerSchema);

export default Player;
