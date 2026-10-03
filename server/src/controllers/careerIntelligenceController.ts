import { Request, Response, NextFunction } from 'express';
import { careerIntelligenceService } from '../services/careerIntelligenceService';

/**
 * Controller: Handles GET /api/students/:id/career-intelligence
 * Supports optional ?careerId=<careerId> query override.
 */
export const getCareerIntelligenceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const careerIdOverride = typeof req.query.careerId === 'string' ? req.query.careerId : undefined;

    const intelligenceData = await careerIntelligenceService.getStudentCareerIntelligence(
      id,
      { careerIdOverride }
    );

    res.status(200).json({
      data: intelligenceData
    });
  } catch (error) {
    next(error);
  }
};
