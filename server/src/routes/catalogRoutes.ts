import { Router } from 'express';
import {
  getCareersHandler,
  getCareerByIdHandler,
  getSkillsHandler,
  getResourcesHandler,
  getProjectsHandler,
  getOpportunitiesHandler
} from '../controllers/catalogController';

const router = Router();

// Career Discovery Endpoints
router.get('/careers', getCareersHandler);
router.get('/careers/:id', getCareerByIdHandler);

// Catalog Discovery Endpoints
router.get('/skills', getSkillsHandler);
router.get('/resources', getResourcesHandler);
router.get('/projects', getProjectsHandler);
router.get('/opportunities', getOpportunitiesHandler);

export default router;
