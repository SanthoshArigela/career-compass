import { AppError } from '../middleware/errorHandler';
import { RESOURCE_TYPES, RESOURCE_LEVELS, ResourceType, ResourceLevel } from '../models/Resource';
import { PROJECT_DIFFICULTIES, ProjectDifficulty } from '../models/Project';
import { OPPORTUNITY_TYPES, OpportunityType } from '../models/Opportunity';

/**
 * Asserts that a string is a valid 24-character hexadecimal MongoDB ObjectId.
 */
export const assertValidObjectId = (
  id: string,
  message = 'Invalid identifier.'
): void => {
  if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, 'INVALID_ID', message);
  }
};

export interface CareerFilterOptions {
  category?: string;
  search?: string;
}

export interface SkillFilterOptions {
  category?: string;
  search?: string;
}

export interface ResourceFilterOptions {
  skillId?: string;
  level?: ResourceLevel;
  type?: ResourceType;
}

export interface ProjectFilterOptions {
  careerId?: string;
  skillId?: string;
  difficulty?: ProjectDifficulty;
}

export interface OpportunityFilterOptions {
  careerId?: string;
  skillId?: string;
  type?: OpportunityType;
}

/**
 * Validates and sanitizes query parameters for Career listing.
 */
export const validateCareerFilter = (query: Record<string, any>): CareerFilterOptions => {
  const result: CareerFilterOptions = {};

  if (query.category && typeof query.category === 'string' && query.category.trim()) {
    result.category = query.category.trim();
  }

  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    result.search = query.search.trim();
  }

  return result;
};

/**
 * Validates and sanitizes query parameters for Skill listing.
 */
export const validateSkillFilter = (query: Record<string, any>): SkillFilterOptions => {
  const result: SkillFilterOptions = {};

  if (query.category && typeof query.category === 'string' && query.category.trim()) {
    result.category = query.category.trim();
  }

  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    result.search = query.search.trim();
  }

  return result;
};

/**
 * Validates and sanitizes query parameters for Resource listing.
 */
export const validateResourceFilter = (query: Record<string, any>): ResourceFilterOptions => {
  const result: ResourceFilterOptions = {};

  if (query.skillId) {
    if (typeof query.skillId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(query.skillId)) {
      throw new AppError(400, 'INVALID_ID', 'Invalid skill identifier.');
    }
    result.skillId = query.skillId;
  }

  if (query.level) {
    if (typeof query.level !== 'string' || !RESOURCE_LEVELS.includes(query.level as ResourceLevel)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Invalid resource level. Must be one of: ${RESOURCE_LEVELS.join(', ')}.`
      );
    }
    result.level = query.level as ResourceLevel;
  }

  if (query.type) {
    if (typeof query.type !== 'string' || !RESOURCE_TYPES.includes(query.type as ResourceType)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Invalid resource type. Must be one of: ${RESOURCE_TYPES.join(', ')}.`
      );
    }
    result.type = query.type as ResourceType;
  }

  return result;
};

/**
 * Validates and sanitizes query parameters for Project listing.
 */
export const validateProjectFilter = (query: Record<string, any>): ProjectFilterOptions => {
  const result: ProjectFilterOptions = {};

  if (query.careerId) {
    if (typeof query.careerId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(query.careerId)) {
      throw new AppError(400, 'INVALID_ID', 'Invalid career identifier.');
    }
    result.careerId = query.careerId;
  }

  if (query.skillId) {
    if (typeof query.skillId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(query.skillId)) {
      throw new AppError(400, 'INVALID_ID', 'Invalid skill identifier.');
    }
    result.skillId = query.skillId;
  }

  if (query.difficulty) {
    if (
      typeof query.difficulty !== 'string' ||
      !PROJECT_DIFFICULTIES.includes(query.difficulty as ProjectDifficulty)
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Invalid project difficulty. Must be one of: ${PROJECT_DIFFICULTIES.join(', ')}.`
      );
    }
    result.difficulty = query.difficulty as ProjectDifficulty;
  }

  return result;
};

/**
 * Validates and sanitizes query parameters for Opportunity listing.
 */
export const validateOpportunityFilter = (
  query: Record<string, any>
): OpportunityFilterOptions => {
  const result: OpportunityFilterOptions = {};

  if (query.careerId) {
    if (typeof query.careerId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(query.careerId)) {
      throw new AppError(400, 'INVALID_ID', 'Invalid career identifier.');
    }
    result.careerId = query.careerId;
  }

  if (query.skillId) {
    if (typeof query.skillId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(query.skillId)) {
      throw new AppError(400, 'INVALID_ID', 'Invalid skill identifier.');
    }
    result.skillId = query.skillId;
  }

  if (query.type) {
    if (
      typeof query.type !== 'string' ||
      !OPPORTUNITY_TYPES.includes(query.type as OpportunityType)
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Invalid opportunity type. Must be one of: ${OPPORTUNITY_TYPES.join(', ')}.`
      );
    }
    result.type = query.type as OpportunityType;
  }

  return result;
};
