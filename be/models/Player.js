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
      of: Number,
      default: {}
    },
    traits: [{ type: String }],
    equipped: { type: Boolean, default: false },
    acquiredAt: { type: Date, default: Date.now }
  }],
  inventoryCapacity: {
    type: Number,
    default: 100,
    min: 1
  },
  location: {
    currentZone: { type: String, default: 'Starting Village' },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    }
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
playerSchema.methods.addGold = async function(amount) {
  this.gold += amount;
  await this.save();
};

// Remove gold (with validation)
playerSchema.methods.removeGold = async function(amount) {
  if (this.gold < amount) {
    throw new Error('Insufficient gold');
  }
  this.gold -= amount;
  await this.save();
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
  const validSkills = ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking'];

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
  const validSkills = ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking'];

  if (!validSkills.includes(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }

  const skill = this.skills[skillName];
  const xpInCurrentLevel = skill.experience % 1000;
  return (xpInCurrentLevel / 1000) * 100;
};

// Inventory Management Methods

// Add item to inventory
playerSchema.methods.addItem = async function(itemInstance) {
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
    const newQuantity = existingItem.quantity + itemInstance.quantity;

    if (itemDef.stackable && newQuantity <= itemDef.maxStack) {
      existingItem.quantity = newQuantity;
    } else {
      // Can't stack, add as new item
      this.inventory.push(itemInstance);
    }
  } else {
    // New item, add to inventory
    this.inventory.push(itemInstance);
  }

  await this.save();
  return itemInstance;
};

// Remove item from inventory by instance ID
playerSchema.methods.removeItem = async function(instanceId, quantity = null) {
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

  await this.save();
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

module.exports = mongoose.model('Player', playerSchema);
