const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSkills,
  addSkillExperience,
  getSkill
} = require('../controllers/skillsController');

// All routes are protected (require authentication)
router.use(protect);

// Get all skills
router.get('/', getSkills);

// Get single skill
router.get('/:skillName', getSkill);

// Add experience to a skill
router.post('/:skillName/experience', addSkillExperience);

module.exports = router;
