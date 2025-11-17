/**
 * Quest Controller
 *
 * Handles HTTP requests for quest-related operations.
 * All endpoints require JWT authentication.
 */

import { Request, Response } from 'express';
import Player from '../models/Player';
import questService from '../services/questService';

/**
 * GET /api/quests/available
 * Get quests player qualifies for
 */
export const getAvailableQuests = async (req: Request, res: Response) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const availableQuests = questService.getAvailableQuests(player);

    res.json({
      quests: availableQuests,
      count: availableQuests.length
    });
  } catch (error) {
    console.error('Error getting available quests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/quests/active
 * Get player's active quests
 */
export const getActiveQuests = async (req: Request, res: Response) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const activeQuests = questService.getActiveQuests(player);

    // Enrich with quest definitions
    const enrichedQuests = activeQuests.map((activeQuest: any) => {
      const questDef = questService.getQuest(activeQuest.questId);
      return {
        ...activeQuest.toObject ? activeQuest.toObject() : activeQuest,
        definition: questDef
      };
    });

    res.json({
      quests: enrichedQuests,
      count: enrichedQuests.length
    });
  } catch (error) {
    console.error('Error getting active quests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/quests/completed
 * Get player's completed quest IDs
 */
export const getCompletedQuests = async (req: Request, res: Response) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const completedQuestIds = questService.getCompletedQuests(player);

    // Enrich with quest definitions
    const completedQuests = completedQuestIds
      .map((questId: string) => questService.getQuest(questId))
      .filter((quest: any) => quest !== undefined);

    res.json({
      quests: completedQuests,
      count: completedQuests.length
    });
  } catch (error) {
    console.error('Error getting completed quests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/quests/accept/:questId
 * Accept a quest (manual accept only, tutorials auto-accept)
 */
export const acceptQuest = async (req: Request, res: Response) => {
  try {
    const { questId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const result = await questService.acceptQuest(player, questId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: result.message,
      quest: result.quest
    });
  } catch (error) {
    console.error('Error accepting quest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/quests/abandon/:questId
 * Abandon an active quest
 */
export const abandonQuest = async (req: Request, res: Response) => {
  try {
    const { questId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const result = await questService.abandonQuest(player, questId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error('Error abandoning quest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/quests/complete/:questId
 * Turn in a completed quest and claim rewards
 */
export const completeQuest = async (req: Request, res: Response) => {
  try {
    const { questId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const result = await questService.turnInQuest(player, questId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: result.message,
      rewards: result.rewards
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/quests/:questId/progress
 * Get detailed progress for a specific quest
 */
export const getQuestProgress = async (req: Request, res: Response) => {
  try {
    const { questId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const progress = questService.getQuestProgress(player, questId);

    if (!progress) {
      return res.status(404).json({ message: 'Quest not found or not active' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error getting quest progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
