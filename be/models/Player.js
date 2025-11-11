const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
      current: { type: Number, default: 100 },
      max: { type: Number, default: 100 }
    },
    mana: {
      current: { type: Number, default: 50 },
      max: { type: Number, default: 50 }
    },
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    vitality: { type: Number, default: 10 }
  },
  gold: {
    type: Number,
    default: 100,
    min: 0
  },
  inventory: [{
    instanceId: { type: String, required: true },
    itemId: { type: String, required: true }, // Reference to item definition
    quantity: { type: Number, default: 1, min: 1 },
    qualities: {
      type: Map,
      of: Number, // Stores quality levels as integers (1-5)
      default: {}
    },
    traits: {
      type: Map,
      of: Number, // Stores trait levels as integers (1-3)
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
  // Equipment slots - extensible Map structure
  // Key = slot name, Value = instanceId of equipped item (or null)
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
  // Location system
  currentLocation: {
    type: String,
    default: 'kennik' // Starting location
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
  // Combat system
  activeCombat: {
    activityId: { type: String }, // Activity that started this combat (for restart)
    monsterId: { type: String },
    monsterInstance: { type: Map, of: mongoose.Schema.Types.Mixed }, // Full monster state
    playerLastAttackTime: { type: Date },
    monsterLastAttackTime: { type: Date },
    playerNextAttackTime: { type: Date },
    monsterNextAttackTime: { type: Date },
    turnCount: { type: Number, default: 0 }, // Track player attack count for ability cooldowns
    abilityCooldowns: { type: Map, of: Number }, // abilityId -> turn when available
    combatLog: [{
      timestamp: { type: Date, default: Date.now },
      message: { type: String },
      type: { type: String, enum: ['damage', 'heal', 'dodge', 'miss', 'crit', 'ability', 'system'] }
    }],
    startTime: { type: Date }
  },
  lastCombatActivityId: { type: String }, // Last combat activity for restart (persists after combat ends)
  combatStats: {
    monstersDefeated: { type: Number, default: 0 },
    totalDamageDealt: { type: Number, default: 0 },
    totalDamageTaken: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    criticalHits: { type: Number, default: 0 },
    dodges: { type: Number, default: 0 }
  },
  questProgress: [{
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    progress: { type: Map, of: mongoose.Schema.Types.Mixed }
  }],
  achievements: [{
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  attributes: {
    strength: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    endurance: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 }
    },
    magic: {
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
    herbalism: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'will' }
    },
    // Combat skills
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
      mainAttribute: { type: String, default: 'magic' }
    },
    gun: {
      level: { type: Number, default: 1, min: 1 },
      experience: { type: Number, default: 0, min: 0 },
      mainAttribute: { type: String, default: 'perception' }
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

// Update last played time
playerSchema.methods.updateLastPlayed = async function() {
  this.lastPlayed = new Date();
  await this.save();
};

// Add experience and handle leveling
playerSchema.methods.addExperience = async function(amount) {
  this.experience += amount;

  // Simple leveling formula: level = floor(sqrt(experience / 100))
  const newLevel = Math.floor(Math.sqrt(this.experience / 100)) + 1;

  if (newLevel > this.level && newLevel <= 100) {
    this.level = newLevel;
    // Increase stats on level up
    this.stats.health.max += 10;
    this.stats.health.current = this.stats.health.max;
    this.stats.mana.max += 5;
    this.stats.mana.current = this.stats.mana.max;
    this.stats.strength += 2;
    this.stats.dexterity += 2;
    this.stats.intelligence += 2;
    this.stats.vitality += 2;
  }

  await this.save();
  return newLevel > this.level - 1; // Return true if leveled up
};

// Add gold
playerSchema.methods.addGold = function(amount) {
  this.gold += amount;
};

// Remove gold (with validation)
playerSchema.methods.removeGold = function(amount) {
  if (this.gold < amount) {
    throw new Error('Insufficient gold');
  }
  this.gold -= amount;
};

// Add attribute experience and handle attribute leveling
playerSchema.methods.addAttributeExperience = async function(attributeName, amount) {
  const validAttributes = ['strength', 'endurance', 'magic', 'perception', 'dexterity', 'will', 'charisma'];

  if (!validAttributes.includes(attributeName)) {
    throw new Error(`Invalid attribute name: ${attributeName}`);
  }

  const attribute = this.attributes[attributeName];
  const oldLevel = attribute.level;
  attribute.experience += amount;

  // Level up every 1000 XP
  const newLevel = Math.floor(attribute.experience / 1000) + 1;

  if (newLevel > oldLevel) {
    attribute.level = newLevel;
    await this.save();
    return { leveledUp: true, oldLevel, newLevel, attribute: attributeName };
  }

  await this.save();
  return { leveledUp: false, level: attribute.level, attribute: attributeName };
};

// Get progress to next attribute level (0-100%)
playerSchema.methods.getAttributeProgress = function(attributeName) {
  const validAttributes = ['strength', 'endurance', 'magic', 'perception', 'dexterity', 'will', 'charisma'];

  if (!validAttributes.includes(attributeName)) {
    throw new Error(`Invalid attribute name: ${attributeName}`);
  }

  const attribute = this.attributes[attributeName];
  const xpInCurrentLevel = attribute.experience % 1000;
  return (xpInCurrentLevel / 1000) * 100;
};

// Add skill experience and handle skill leveling
// Also awards XP to the skill's main attribute (50% of skill XP)
playerSchema.methods.addSkillExperience = async function(skillName, amount) {
  const validSkills = ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking', 'herbalism', 'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'];

  if (!validSkills.includes(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const skill = this.skills[skillName];
  const oldLevel = skill.level;
  skill.experience += amount;

  // Level up every 1000 XP
  const newLevel = Math.floor(skill.experience / 1000) + 1;

  const skillResult = {
    skill: skillName,
    leveledUp: false,
    level: skill.level,
    oldLevel,
    newLevel: skill.level
  };

  if (newLevel > oldLevel) {
    skill.level = newLevel;
    skillResult.leveledUp = true;
    skillResult.newLevel = newLevel;
  }

  // Award attribute XP (50% of skill XP to main attribute)
  const mainAttribute = skill.mainAttribute;
  const attributeXP = Math.floor(amount * 0.5);
  const attributeResult = await this.addAttributeExperience(mainAttribute, attributeXP);

  return {
    skill: skillResult,
    attribute: attributeResult
  };
};

// Get progress to next skill level (0-100%)
playerSchema.methods.getSkillProgress = function(skillName) {
  const validSkills = ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking', 'herbalism', 'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'];

  if (!validSkills.includes(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const skill = this.skills[skillName];
  const xpInCurrentLevel = skill.experience % 1000;
  return (xpInCurrentLevel / 1000) * 100;
};

// Inventory Management Methods

// Add item to inventory
playerSchema.methods.addItem = function(itemInstance) {
  // Check inventory capacity
  const currentSize = this.inventory.reduce((sum, item) => sum + item.quantity, 0);
  if (currentSize + itemInstance.quantity > this.inventoryCapacity) {
    throw new Error('Inventory is full');
  }

  // Try to stack with existing items
  const itemService = require('../services/itemService');
  const existingItem = this.inventory.find(inv =>
    itemService.canStack(inv, itemInstance)
  );

  if (existingItem) {
    const itemDef = itemService.getItemDefinition(itemInstance.itemId);

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
playerSchema.methods.removeItem = function(instanceId, quantity = null) {
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
playerSchema.methods.getItem = function(instanceId) {
  return this.inventory.find(item => item.instanceId === instanceId);
};

// Get all items of a specific itemId
playerSchema.methods.getItemsByItemId = function(itemId) {
  return this.inventory.filter(item => item.itemId === itemId);
};

// Get inventory size
playerSchema.methods.getInventorySize = function() {
  return this.inventory.reduce((sum, item) => sum + item.quantity, 0);
};

// Get inventory value (total vendor price)
playerSchema.methods.getInventoryValue = function() {
  const itemService = require('../services/itemService');
  return this.inventory.reduce((sum, item) => {
    const price = itemService.calculateVendorPrice(item);
    return sum + (price * item.quantity);
  }, 0);
};

// Equipment Management Methods

// Equip an item to a slot
playerSchema.methods.equipItem = async function(instanceId, slotName) {
  const itemService = require('../services/itemService');

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
playerSchema.methods.unequipItem = async function(slotName) {
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

// Get all currently equipped items
playerSchema.methods.getEquippedItems = function() {
  const equipped = {};
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
playerSchema.methods.isSlotAvailable = function(slotName) {
  if (!this.equipmentSlots.has(slotName)) {
    return false;
  }
  return this.equipmentSlots.get(slotName) === null;
};

// Add a new equipment slot (for future extensibility)
playerSchema.methods.addEquipmentSlot = async function(slotName) {
  if (this.equipmentSlots.has(slotName)) {
    throw new Error(`Equipment slot ${slotName} already exists`);
  }
  this.equipmentSlots.set(slotName, null);
  await this.save();
  return slotName;
};

// Check if player has an item with a specific subtype equipped (in any slot)
playerSchema.methods.hasEquippedSubtype = function(subtype, itemService) {
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
playerSchema.methods.hasInventoryItem = function(itemId, minQuantity = 1) {
  const items = this.inventory.filter(item => item.itemId === itemId);

  if (items.length === 0) {
    return false;
  }

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  return totalQuantity >= minQuantity;
};

// Get total quantity of an item in inventory
playerSchema.methods.getInventoryItemQuantity = function(itemId) {
  const items = this.inventory.filter(item => item.itemId === itemId);
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

// Combat Management Methods

// Take damage and return true if defeated
playerSchema.methods.takeDamage = function(amount) {
  if (amount < 0) {
    throw new Error('Damage amount must be positive');
  }

  this.stats.health.current = Math.max(0, this.stats.health.current - amount);
  this.combatStats.totalDamageTaken += amount;

  return this.stats.health.current === 0; // Returns true if defeated
};

// Heal health
playerSchema.methods.heal = function(amount) {
  if (amount < 0) {
    throw new Error('Heal amount must be positive');
  }

  this.stats.health.current = Math.min(this.stats.health.max, this.stats.health.current + amount);
};

// Use mana for abilities
playerSchema.methods.useMana = function(amount) {
  if (amount < 0) {
    throw new Error('Mana amount must be positive');
  }

  if (this.stats.mana.current < amount) {
    throw new Error('Insufficient mana');
  }

  this.stats.mana.current -= amount;
};

// Restore mana
playerSchema.methods.restoreMana = function(amount) {
  if (amount < 0) {
    throw new Error('Mana amount must be positive');
  }

  this.stats.mana.current = Math.min(this.stats.mana.max, this.stats.mana.current + amount);
};

// Use a consumable item and apply its effects
playerSchema.methods.useConsumableItem = function(itemInstance, itemDefinition) {
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
playerSchema.methods.isInCombat = function() {
  return this.activeCombat && this.activeCombat.monsterId;
};

// Add combat log entry
playerSchema.methods.addCombatLog = function(message, type = 'system') {
  if (!this.activeCombat) {
    throw new Error('Player is not in combat');
  }

  const logEntry = {
    timestamp: new Date(),
    message,
    type
  };

  // Keep only last 50 entries to prevent bloat
  if (this.activeCombat.combatLog.length >= 50) {
    this.activeCombat.combatLog.shift();
  }

  this.activeCombat.combatLog.push(logEntry);
};

// Clear active combat (used when combat ends)
playerSchema.methods.clearCombat = function() {
  this.activeCombat = {
    monsterId: null,
    monsterInstance: new Map(),
    playerLastAttackTime: null,
    monsterLastAttackTime: null,
    playerNextAttackTime: null,
    monsterNextAttackTime: null,
    turnCount: 0,
    abilityCooldowns: new Map(),
    combatLog: [],
    startTime: null
  };
};

// Check if ability is on cooldown
playerSchema.methods.isAbilityOnCooldown = function(abilityId) {
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
playerSchema.methods.setAbilityCooldown = function(abilityId, cooldownTurns) {
  if (!this.activeCombat) {
    throw new Error('Player is not in combat');
  }

  const availableTurn = this.activeCombat.turnCount + cooldownTurns;
  this.activeCombat.abilityCooldowns.set(abilityId, availableTurn);
};

// Get ability cooldown remaining turns
playerSchema.methods.getAbilityCooldownRemaining = function(abilityId) {
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

module.exports = mongoose.model('Player', playerSchema);
