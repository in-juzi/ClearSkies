const Player = require('../models/Player');

/**
 * @desc    Get all skills for current player
 * @route   GET /api/skills
 * @access  Private
 */
const getSkills = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Calculate progress for each skill
    const skillsWithProgress = {
      woodcutting: {
        ...player.skills.woodcutting.toObject(),
        progress: player.getSkillProgress('woodcutting')
      },
      mining: {
        ...player.skills.mining.toObject(),
        progress: player.getSkillProgress('mining')
      },
      fishing: {
        ...player.skills.fishing.toObject(),
        progress: player.getSkillProgress('fishing')
      },
      smithing: {
        ...player.skills.smithing.toObject(),
        progress: player.getSkillProgress('smithing')
      },
      cooking: {
        ...player.skills.cooking.toObject(),
        progress: player.getSkillProgress('cooking')
      },
      herbalism: {
        ...player.skills.herbalism.toObject(),
        progress: player.getSkillProgress('herbalism')
      },
      // Combat skills
      oneHanded: {
        ...player.skills.oneHanded.toObject(),
        progress: player.getSkillProgress('oneHanded')
      },
      dualWield: {
        ...player.skills.dualWield.toObject(),
        progress: player.getSkillProgress('dualWield')
      },
      twoHanded: {
        ...player.skills.twoHanded.toObject(),
        progress: player.getSkillProgress('twoHanded')
      },
      ranged: {
        ...player.skills.ranged.toObject(),
        progress: player.getSkillProgress('ranged')
      },
      casting: {
        ...player.skills.casting.toObject(),
        progress: player.getSkillProgress('casting')
      },
      gun: {
        ...player.skills.gun.toObject(),
        progress: player.getSkillProgress('gun')
      }
    };

    res.status(200).json({
      success: true,
      data: {
        skills: skillsWithProgress
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

/**
 * @desc    Add experience to a skill
 * @route   POST /api/skills/:skillName/experience
 * @access  Private
 */
const addSkillExperience = async (req, res) => {
  try {
    const { skillName } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Experience amount must be a positive number'
      });
    }

    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Add experience and check for level up
    const result = await player.addSkillExperience(skillName, amount);

    // Build message based on level ups
    let message = `Gained ${amount} ${skillName} experience`;
    if (result.skill.leveledUp && result.attribute.leveledUp) {
      message = `Congratulations! ${skillName} leveled up to ${result.skill.newLevel} and ${result.attribute.attribute} leveled up to ${result.attribute.newLevel}!`;
    } else if (result.skill.leveledUp) {
      message = `Congratulations! ${skillName} leveled up to ${result.skill.newLevel}!`;
    } else if (result.attribute.leveledUp) {
      message = `${result.attribute.attribute} leveled up to ${result.attribute.newLevel}!`;
    }

    res.status(200).json({
      success: true,
      message: message,
      data: {
        skill: {
          name: skillName,
          level: player.skills[skillName].level,
          experience: player.skills[skillName].experience,
          progress: player.getSkillProgress(skillName),
          leveledUp: result.skill.leveledUp,
          oldLevel: result.skill.oldLevel,
          newLevel: result.skill.newLevel,
          mainAttribute: player.skills[skillName].mainAttribute
        },
        attribute: {
          name: result.attribute.attribute,
          level: player.attributes[result.attribute.attribute].level,
          experience: player.attributes[result.attribute.attribute].experience,
          progress: player.getAttributeProgress(result.attribute.attribute),
          leveledUp: result.attribute.leveledUp,
          oldLevel: result.attribute.oldLevel,
          newLevel: result.attribute.leveledUp ? result.attribute.newLevel : result.attribute.level
        }
      }
    });

  } catch (error) {
    console.error('Add skill experience error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single skill details
 * @route   GET /api/skills/:skillName
 * @access  Private
 */
const getSkill = async (req, res) => {
  try {
    const { skillName } = req.params;
    const validSkills = ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking', 'herbalism', 'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'];

    if (!validSkills.includes(skillName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid skill name: ${skillName}`
      });
    }

    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    const skill = player.skills[skillName];
    const progress = player.getSkillProgress(skillName);

    res.status(200).json({
      success: true,
      data: {
        name: skillName,
        level: skill.level,
        experience: skill.experience,
        progress: progress,
        experienceToNext: 1000 - (skill.experience % 1000)
      }
    });

  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skill',
      error: error.message
    });
  }
};

module.exports = {
  getSkills,
  addSkillExperience,
  getSkill
};
