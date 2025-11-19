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
  properties: string[]; // Array of propertyIds owned by player
  maxProperties: number; // Scales with Construction level
  activeConstructionProjects: string[]; // Array of projectIds player is participating in
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
  addGold(amount: number): void;
  removeGold(amount: number): void;
  addAttributeExperience(attributeName: AttributeName, amount: number): Promise<{
    leveledUp: boolean;
    oldLevel?: number;
    newLevel?: number;
    level?: number;
    attribute: AttributeName;
  }>;
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
  getItem(instanceId: string): InventoryItem | undefined;
  getActiveCombatSkill(): string;
  hasEquippedSubtype(subtype: string, itemService: any): boolean;
  getContainer(containerId: string): StorageContainer;
  getContainerItems(containerId: string): any[];
  takeDamage(amount: number): Promise<boolean>;
  heal(amount: number): void;
  useMana(amount: number): void;
  restoreMana(amount: number): void;
  isInCombat(): boolean;
  clearCombat(): void;
  addActiveBuff(buffData: any): void;
  removeActiveBuff(buffId: string): boolean;
  acceptQuest(questId: string, objectives: ObjectiveProgress[]): void;
  updateQuestObjective(questId: string, objectiveId: string, amount: number): ObjectiveProgress | null;
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
  properties: [{ type: String }], // Array of propertyIds
  maxProperties: { type: Number, default: 1 }, // Scales with Construction level: Math.floor(level / 10) + 1
  activeConstructionProjects: [{ type: String }], // Array of projectIds
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
    construction: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'strength' }
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

// NOTE: addExperience (player leveling) is deprecated.
// Character progression now happens through skill/attribute leveling only.

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

// NOTE: getAttributeProgress is deprecated. Use getEnrichedAttributes() instead.

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
    'woodcutting', 'mining', 'fishing', 'gathering', 'smithing', 'cooking', 'alchemy', 'construction',
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

// NOTE: getSkillProgress is deprecated. Use getEnrichedSkills() instead.

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
// NOTE: Inventory methods (addItem, removeItem, getItem, getInventorySize, etc.)
// have been migrated to playerInventoryService and are no longer defined here.
// External code should use playerInventoryService for all inventory operations.

// Get item from inventory by instance ID (internal use only)
// NOTE: Still used internally by getActiveCombatSkill() - keep for now
// External code should use playerInventoryService.getItem() instead
playerSchema.methods.getItem = function(this: IPlayer, instanceId: string): InventoryItem | undefined {
  return this.inventory.find(item => item.instanceId === instanceId);
};

// ============================================================================
// Equipment Management Methods
// ============================================================================
// NOTE: Equipment methods (equipItem, unequipItem, getEquippedItems, etc.)
// have been migrated to playerInventoryService and are no longer defined here.

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

// Check if player has an item with a specific subtype equipped (in any slot)
playerSchema.methods.hasEquippedSubtype = function(this: IPlayer, subtype: string, itemService: any): boolean {
  if (!itemService) {
    throw new Error('itemService is required for hasEquippedSubtype');
  }

  // Get all equipped items by checking equipmentSlots map
  for (const [slot, instanceId] of this.equipmentSlots.entries()) {
    if (instanceId) {
      const item = this.inventory.find(i => i.instanceId === instanceId);
      if (item) {
        const itemDef = itemService.getItemDefinition(item.itemId);
        // Check the subtype field (for equipment) or subcategories array (fallback)
        if (itemDef?.subtype === subtype || itemDef?.subcategories?.includes(subtype)) {
          return true;
        }
      }
    }
  }

  return false;
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

// ============================================================================
// Storage Container Methods
// ============================================================================
// NOTE: Storage methods (depositToContainer, withdrawFromContainer, etc.)
// have been migrated to playerStorageService and are no longer defined here.

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

// Check if player is in combat
// NOTE: Still used by other combat methods - keep for now
playerSchema.methods.isInCombat = function(this: IPlayer): boolean {
  return !!(this.activeCombat && this.activeCombat.monsterId);
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

// NOTE: Combat utility methods (addActiveBuff, removeActiveBuff, isAbilityOnCooldown, etc.)
// are used internally by combatService and remain in the Player model for now.
// These may be migrated to playerCombatService in a future refactor.

// Add active buff
// NOTE: Still used by combatService - keep for now
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
// NOTE: Still used by combatService - keep for now
playerSchema.methods.removeActiveBuff = function(this: IPlayer, buffId: string): boolean {
  if (!this.activeCombat || !this.activeCombat.activeBuffs) {
    return false;
  }

  return this.activeCombat.activeBuffs.delete(buffId);
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

// NOTE: completeQuest is deprecated. Quest completion is handled by questService.

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
// Database Indexes
// ============================================================================

// Index on userId for authentication lookups (already unique, but explicit index improves query performance)
playerSchema.index({ userId: 1 });

// Index on currentLocation for location-based queries (frequently used in activity/travel operations)
playerSchema.index({ currentLocation: 1 });

// Compound index for active quests lookups (quest system frequently queries by questId)
playerSchema.index({ 'quests.active.questId': 1 });

// Index for completed quests (used in quest availability checks)
playerSchema.index({ 'quests.completed': 1 });

// ============================================================================
// Model Export
// ============================================================================

const Player: Model<IPlayer> = mongoose.model<IPlayer>('Player', playerSchema);

export default Player;
