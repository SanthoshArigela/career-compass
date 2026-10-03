import { Request, Response, NextFunction } from 'express';
import {
  progressService,
  assertValidId,
  assertValidItemType,
  assertValidStatus
} from '../services/progressService';

/**
 * Controller: Create a progress record.
 * POST /api/students/:id/progress
 */
export const createProgressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.id;
    assertValidId(studentId, 'Invalid identifier.');

    const body = req.body || {};
    assertValidId(body.itemId, 'Invalid identifier.');
    assertValidItemType(body.itemType);

    const status = body.status ?? 'not_started';
    assertValidStatus(status);

    const progress = await progressService.createProgress(studentId, {
      itemId: body.itemId,
      itemType: body.itemType,
      status
    });

    res.status(201).json({
      data: {
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve all progress records for a student along with summary counts.
 * GET /api/students/:id/progress
 */
export const getStudentProgressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.id;
    assertValidId(studentId, 'Invalid identifier.');

    const { progress, summary } = await progressService.getStudentProgress(studentId);

    res.status(200).json({
      data: {
        progress,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve an individual progress tracking record.
 * GET /api/students/:id/progress/:itemType/:itemId
 */
export const getIndividualProgressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: studentId, itemType, itemId } = req.params;
    assertValidId(studentId, 'Invalid identifier.');
    assertValidId(itemId, 'Invalid identifier.');
    assertValidItemType(itemType);

    const progress = await progressService.getIndividualProgress(
      studentId,
      itemType,
      itemId
    );

    res.status(200).json({
      data: {
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Update status on an existing progress tracking record.
 * Disallows modifying studentId, itemId, or itemType.
 * PATCH /api/students/:id/progress/:itemType/:itemId
 */
export const updateProgressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: studentId, itemType, itemId } = req.params;
    assertValidId(studentId, 'Invalid identifier.');
    assertValidId(itemId, 'Invalid identifier.');
    assertValidItemType(itemType);

    const body = req.body || {};
    assertValidStatus(body.status);

    const progress = await progressService.updateProgress(
      studentId,
      itemType,
      itemId,
      { status: body.status }
    );

    res.status(200).json({
      data: {
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};
