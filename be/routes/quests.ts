/**
 * Quest Routes
 *
 * Defines API routes for quest operations.
 * All routes require JWT authentication.
 */

import express from 'express';
import * as questController from '../controllers/questController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All quest routes require authentication
router.use(protect);

// GET routes
router.get('/available', questController.getAvailableQuests);
router.get('/active', questController.getActiveQuests);
router.get('/completed', questController.getCompletedQuests);
router.get('/:questId/progress', questController.getQuestProgress);

// POST routes
router.post('/accept/:questId', questController.acceptQuest);
router.post('/abandon/:questId', questController.abandonQuest);
router.post('/complete/:questId', questController.completeQuest);

export default router;
