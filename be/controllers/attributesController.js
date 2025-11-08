const Player = require('../models/Player');

/**
 * Get all attributes for the logged-in player
 * @route GET /api/attributes
 */
exports.getAllAttributes = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Build response with all attributes and their progress
    const attributes = {};
    const attributeNames = ['strength', 'endurance', 'magic', 'perception', 'dexterity', 'will', 'charisma'];

    for (const name of attributeNames) {
      attributes[name] = {
        level: player.attributes[name].level,
        experience: player.attributes[name].experience,
        progress: player.getAttributeProgress(name),
        xpToNextLevel: 1000 - (player.attributes[name].experience % 1000)
      };
    }

    res.json(attributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a specific attribute for the logged-in player
 * @route GET /api/attributes/:attributeName
 */
exports.getAttribute = async (req, res) => {
  try {
    const { attributeName } = req.params;
    const validAttributes = ['strength', 'endurance', 'magic', 'perception', 'dexterity', 'will', 'charisma'];

    if (!validAttributes.includes(attributeName)) {
      return res.status(400).json({ message: `Invalid attribute name: ${attributeName}` });
    }

    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    const attribute = player.attributes[attributeName];

    res.json({
      name: attributeName,
      level: attribute.level,
      experience: attribute.experience,
      progress: player.getAttributeProgress(attributeName),
      xpToNextLevel: 1000 - (attribute.experience % 1000)
    });
  } catch (error) {
    console.error('Error fetching attribute:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add experience to a specific attribute
 * @route POST /api/attributes/:attributeName/experience
 */
exports.addAttributeExperience = async (req, res) => {
  try {
    const { attributeName } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Experience amount must be a positive number' });
    }

    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    const result = await player.addAttributeExperience(attributeName, amount);

    const attribute = player.attributes[attributeName];

    res.json({
      message: result.leveledUp
        ? `${attributeName} leveled up to ${result.newLevel}!`
        : `Added ${amount} XP to ${attributeName}`,
      attribute: {
        name: attributeName,
        level: attribute.level,
        experience: attribute.experience,
        progress: player.getAttributeProgress(attributeName),
        xpToNextLevel: 1000 - (attribute.experience % 1000)
      },
      leveledUp: result.leveledUp,
      oldLevel: result.oldLevel,
      newLevel: result.leveledUp ? result.newLevel : result.level
    });
  } catch (error) {
    console.error('Error adding attribute experience:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
