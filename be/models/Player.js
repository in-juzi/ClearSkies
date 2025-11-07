const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  characterName: {
    type: String,
    required: [true, 'Character name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Character name must be at least 3 characters'],
    maxlength: [20, 'Character name cannot exceed 20 characters']
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
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1, min: 1 },
    equipped: { type: Boolean, default: false }
  }],
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
  skills: [{
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    level: { type: Number, default: 1, min: 1 }
  }],
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

module.exports = mongoose.model('Player', playerSchema);
