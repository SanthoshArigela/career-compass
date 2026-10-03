import { Request, Response, NextFunction } from 'express';
import {
  createStudentSchema,
  updateStudentSchema
} from '../validators/studentValidator';
import { studentService } from '../services/studentService';
import { AppError } from '../middleware/errorHandler';

/**
 * Controller: Handle student profile creation.
 * POST /api/students
 */
export const createStudentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createStudentSchema.parse(req.body);
    const student = await studentService.createStudent(validatedData);

    res.status(201).json({
      data: {
        student
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve student by ID.
 * GET /api/students/:id
 */
export const getStudentByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);

    res.status(200).json({
      data: {
        student
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Update student profile. Disallows email updates.
 * PATCH /api/students/:id
 */
export const updateStudentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if ('email' in req.body && req.body.email !== undefined) {
      throw new AppError(
        400,
        'IMMUTABLE_FIELD',
        'Email address cannot be modified.'
      );
    }

    const validatedData = updateStudentSchema.parse(req.body);
    const student = await studentService.updateStudent(id, validatedData);

    res.status(200).json({
      data: {
        student
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve full student profile with populated metadata.
 * GET /api/students/:id/profile
 */
export const getStudentProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await studentService.getStudentProfile(id);

    res.status(200).json({
      data: {
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};
