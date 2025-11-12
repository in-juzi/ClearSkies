import { Request, Response } from 'express';
import Player from '../models/Player';
import { SkillName, AttributeName } from '../types';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface AddSkillExperienceRequest {
  amount: number;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * @desc    Get all skills for current player
 * @route   GET /api/skills
 * @access  Private
 */
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({
        success: false,
        message: 'Player not found'
      });
      return;
    }

    // Calculate progress for each skill
    const skillNames: SkillName[] = [
      'woodcutting', 'mining', 'fishing', 'smithing', 'cooking', 'herbalism',
      'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'
    ];

    const skillsWithProgress: Record<string, any> = {};

    for (const skillName of skillNames) {
      skillsWithProgress[skillName] = {
        ...player.skills[skillName],
        progress: player.getSkillProgress(skillName)
      };
    }

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
      error: (error as Error).message
    });
  }
};

/**
 * @desc    Add experience to a skill
 * @route   POST /api/skills/:skillName/experience
 * @access  Private
 */
export const addSkillExperience = async (
  req: Request<{ skillName: SkillName }, {}, AddSkillExperienceRequest>,
  res: Response
): Promise<void> => {
  try {
    const { skillName } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Experience amount must be a positive number'
      });
      return;
    }

    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({
        success: false,
        message: 'Player not found'
      });
      return;
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
      message: (error as Error).message
    });
  }
};

/**
 * @desc    Get single skill details
 * @route   GET /api/skills/:skillName
 * @access  Private
 */
export const getSkill = async (
  req: Request<{ skillName: SkillName }>,
  res: Response
): Promise<void> => {
  try {
    const { skillName } = req.params;
    const validSkills: SkillName[] = [
      'woodcutting', 'mining', 'fishing', 'smithing', 'cooking', 'herbalism',
      'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'
    ];

    if (!validSkills.includes(skillName)) {
      res.status(400).json({
        success: false,
        message: `Invalid skill name: ${skillName}`
      });
      return;
    }

    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({
        success: false,
        message: 'Player not found'
      });
      return;
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
      error: (error as Error).message
    });
  }
};
