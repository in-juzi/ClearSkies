import express from 'express';
import { protect } from '../middleware/auth';
import * as combatController from '../controllers/combatController';

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST /api/combat/start - Start combat with a monster
router.post('/start', combatController.startCombat);

// POST /api/combat/action - Execute player action (attack, ability, flee)
router.post('/action', combatController.executeAction);

// GET /api/combat/status - Get current combat status
router.get('/status', combatController.getCombatStatus);

// POST /api/combat/flee - Flee from combat
router.post('/flee', combatController.flee);

// POST /api/combat/restart - Restart combat with same activity
router.post('/restart', combatController.restartCombat);

export default router;
