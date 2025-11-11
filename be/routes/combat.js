const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const combatController = require('../controllers/combatController');

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

module.exports = router;
