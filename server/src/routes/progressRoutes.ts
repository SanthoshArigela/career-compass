import { Router } from 'express';
import {
  createProgressHandler,
  getStudentProgressHandler,
  getIndividualProgressHandler,
  updateProgressHandler
} from '../controllers/progressController';

const router = Router({ mergeParams: true });

// Student Progress Routes
router.post('/:id/progress', createProgressHandler);
router.get('/:id/progress', getStudentProgressHandler);
router.get('/:id/progress/:itemType/:itemId', getIndividualProgressHandler);
router.patch('/:id/progress/:itemType/:itemId', updateProgressHandler);

export default router;
