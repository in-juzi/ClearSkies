const express = require('express');
const router = express.Router();
const craftingController = require('../controllers/craftingController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/crafting/recipes - Get all recipes
router.get('/recipes', craftingController.getAllRecipes);

// GET /api/crafting/recipes/:skill - Get recipes by skill
router.get('/recipes/:skill', craftingController.getRecipesBySkill);

// POST /api/crafting/start - Start crafting
router.post('/start', craftingController.startCrafting);

// POST /api/crafting/complete - Complete crafting
router.post('/complete', craftingController.completeCrafting);

// POST /api/crafting/cancel - Cancel crafting
router.post('/cancel', craftingController.cancelCrafting);

module.exports = router;
