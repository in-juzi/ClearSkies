const express = require('express');
const router = express.Router();
const attributesController = require('../controllers/attributesController');
const { protect } = require('../middleware/auth');

// All attribute routes require authentication
router.use(protect);

// Get all attributes for the logged-in player
router.get('/', attributesController.getAllAttributes);

// Get a specific attribute
router.get('/:attributeName', attributesController.getAttribute);

// Add experience to a specific attribute
router.post('/:attributeName/experience', attributesController.addAttributeExperience);

module.exports = router;
