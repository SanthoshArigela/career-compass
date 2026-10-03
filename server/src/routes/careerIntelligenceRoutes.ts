import { Router } from 'express';
import { getCareerIntelligenceHandler } from '../controllers/careerIntelligenceController';

const router = Router({ mergeParams: true });

// GET /api/students/:id/career-intelligence
router.get('/:id/career-intelligence', getCareerIntelligenceHandler);

export default router;
