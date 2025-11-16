import { Request, Response } from 'express';
import Player from '../models/Player';
import { AttributeName } from '@shared/types';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface AddAttributeExperienceRequest {
  amount: number;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * Get all attributes for the logged-in player
 * @route GET /api/attributes
 */
export const getAllAttributes = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player profile not found' });
      return;
    }

    // Get enriched attribute data with XP progression info
    const enrichedAttributes = player.getEnrichedAttributes();

    res.json(enrichedAttributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * Get a specific attribute for the logged-in player
 * @route GET /api/attributes/:attributeName
 */
export const getAttribute = async (
  req: Request<{ attributeName: AttributeName }>,
  res: Response
): Promise<void> => {
  try {
    const { attributeName } = req.params;
    const validAttributes: AttributeName[] = ['strength', 'endurance', 'wisdom', 'perception', 'dexterity', 'will', 'charisma'];

    if (!validAttributes.includes(attributeName)) {
      res.status(400).json({ message: `Invalid attribute name: ${attributeName}` });
      return;
    }

    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player profile not found' });
      return;
    }

    const enrichedAttributes = player.getEnrichedAttributes();
    const attributeData = enrichedAttributes[attributeName];

    res.json({
      name: attributeName,
      ...attributeData
    });
  } catch (error) {
    console.error('Error fetching attribute:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * Add experience to a specific attribute
 * @route POST /api/attributes/:attributeName/experience
 */
export const addAttributeExperience = async (
  req: Request<{ attributeName: AttributeName }, {}, AddAttributeExperienceRequest>,
  res: Response
): Promise<void> => {
  try {
    const { attributeName } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: 'Experience amount must be a positive number' });
      return;
    }

    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player profile not found' });
      return;
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
        experience: attribute.experience
      },
      leveledUp: result.leveledUp,
      oldLevel: result.oldLevel,
      newLevel: result.leveledUp ? result.newLevel : result.level
    });
  } catch (error) {
    console.error('Error adding attribute experience:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
