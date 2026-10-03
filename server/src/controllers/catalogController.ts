import { Request, Response, NextFunction } from 'express';
import { catalogService } from '../services/catalogService';
import {
  validateCareerFilter,
  validateSkillFilter,
  validateResourceFilter,
  validateProjectFilter,
  validateOpportunityFilter
} from '../validators/catalogValidator';

/**
 * Controller: Retrieve available careers for discovery.
 * GET /api/careers
 */
export const getCareersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filterOptions = validateCareerFilter(req.query);
    const { careers } = await catalogService.getCareers(filterOptions);

    res.status(200).json({
      data: {
        careers
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve a career in full detail.
 * GET /api/careers/:id
 */
export const getCareerByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { career } = await catalogService.getCareerById(id);

    res.status(200).json({
      data: {
        career
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve skill catalog.
 * GET /api/skills
 */
export const getSkillsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filterOptions = validateSkillFilter(req.query);
    const { skills } = await catalogService.getSkills(filterOptions);

    res.status(200).json({
      data: {
        skills
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve learning resources with optional filtering.
 * GET /api/resources
 */
export const getResourcesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filterOptions = validateResourceFilter(req.query);
    const { resources } = await catalogService.getResources(filterOptions);

    res.status(200).json({
      data: {
        resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve catalog projects with optional filtering.
 * GET /api/projects
 */
export const getProjectsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filterOptions = validateProjectFilter(req.query);
    const { projects } = await catalogService.getProjects(filterOptions);

    res.status(200).json({
      data: {
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve opportunities with optional filtering.
 * GET /api/opportunities
 */
export const getOpportunitiesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filterOptions = validateOpportunityFilter(req.query);
    const { opportunities } = await catalogService.getOpportunities(filterOptions);

    res.status(200).json({
      data: {
        opportunities
      }
    });
  } catch (error) {
    next(error);
  }
};
