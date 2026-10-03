import { Router } from 'express';
import {
  createStudentHandler,
  getStudentByIdHandler,
  updateStudentHandler,
  getStudentProfileHandler
} from '../controllers/studentController';

const router = Router();

// Student CRUD and Profile Routes
router.post('/', createStudentHandler);
router.get('/:id/profile', getStudentProfileHandler);
router.get('/:id', getStudentByIdHandler);
router.patch('/:id', updateStudentHandler);

export default router;
