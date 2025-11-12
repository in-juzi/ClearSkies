import express from 'express';
import { protect } from '../middleware/auth';
import { getSkills, addSkillExperience, getSkill } from '../controllers/skillsController';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Get all skills
router.get('/', getSkills);

// Get single skill
router.get('/:skillName', getSkill);

// Add experience to a skill
router.post('/:skillName/experience', addSkillExperience);

export default router;
