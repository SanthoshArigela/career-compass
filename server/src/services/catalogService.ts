import { Types } from 'mongoose';
import { Career, Skill, Resource, Project, Opportunity } from '../models';
import { AppError } from '../middleware/errorHandler';
import {
  assertValidObjectId,
  CareerFilterOptions,
  SkillFilterOptions,
  ResourceFilterOptions,
  ProjectFilterOptions,
  OpportunityFilterOptions
} from '../validators/catalogValidator';
import {
  serializeCareerCard,
  serializeCareerDetail,
  serializeSkill,
  serializeResource,
  serializeProject,
  serializeOpportunity,
  SerializedCareerCard,
  SerializedCareerDetail,
  SerializedSkill,
  SerializedResource,
  SerializedProject,
  SerializedOpportunity
} from '../mappers/catalogMapper';

/**
 * Escapes special characters for safe regular expression querying.
 */
export const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Service: Retrieves discovery careers with optional category and search filtering.
 */
export const getCareers = async (
  options: CareerFilterOptions = {}
): Promise<{ careers: SerializedCareerCard[] }> => {
  const filter: Record<string, any> = {};

  if (options.category) {
    filter.category = { $regex: new RegExp(`^${escapeRegex(options.category)}$`, 'i') };
  }

  if (options.search) {
    const searchRegex = new RegExp(escapeRegex(options.search), 'i');
    filter.$or = [
      { title: searchRegex },
      { summary: searchRegex },
      { interestTags: searchRegex }
    ];
  }

  const careers = await Career.find(filter).sort({ title: 1 }).lean();
  return {
    careers: careers.map(serializeCareerCard)
  };
};

/**
 * Service: Retrieves a single career in complete detail, resolving referenced skill names.
 */
export const getCareerById = async (
  id: string
): Promise<{ career: SerializedCareerDetail }> => {
  assertValidObjectId(id, 'Invalid career identifier.');

  const career = await Career.findById(id).lean();
  if (!career) {
    throw new AppError(404, 'CAREER_NOT_FOUND', 'Career not found.');
  }

  // Resolve skill metadata from Skill collection
  const skillIds = (career.requiredSkills || []).map((rs: any) => rs.skillId);
  const skills = await Skill.find({
    _id: { $in: skillIds }
  })
    .select('_id name')
    .lean();

  const skillNameMap = new Map<string, string>(
    skills.map((s: any) => [s._id.toString(), s.name])
  );

  return {
    career: serializeCareerDetail(career, skillNameMap)
  };
};

/**
 * Service: Retrieves all skills in the catalog with optional filtering.
 */
export const getSkills = async (
  options: SkillFilterOptions = {}
): Promise<{ skills: SerializedSkill[] }> => {
  const filter: Record<string, any> = {};

  if (options.category) {
    filter.category = { $regex: new RegExp(`^${escapeRegex(options.category)}$`, 'i') };
  }

  if (options.search) {
    const searchRegex = new RegExp(escapeRegex(options.search), 'i');
    filter.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  const skills = await Skill.find(filter).sort({ name: 1 }).lean();
  return {
    skills: skills.map(serializeSkill)
  };
};

/**
 * Service: Retrieves learning resources with optional filtering by skill, level, or type.
 */
export const getResources = async (
  options: ResourceFilterOptions = {}
): Promise<{ resources: SerializedResource[] }> => {
  const filter: Record<string, any> = {};

  if (options.skillId) {
    assertValidObjectId(options.skillId, 'Invalid skill identifier.');
    filter.skillIds = new Types.ObjectId(options.skillId);
  }

  if (options.level) {
    filter.level = options.level;
  }

  if (options.type) {
    filter.type = options.type;
  }

  const resources = await Resource.find(filter).sort({ title: 1 }).lean();
  return {
    resources: resources.map(serializeResource)
  };
};

/**
 * Service: Retrieves catalog projects with optional filtering by career, skill, or difficulty.
 */
export const getProjects = async (
  options: ProjectFilterOptions = {}
): Promise<{ projects: SerializedProject[] }> => {
  const filter: Record<string, any> = {};

  if (options.careerId) {
    assertValidObjectId(options.careerId, 'Invalid career identifier.');
    filter.careerIds = new Types.ObjectId(options.careerId);
  }

  if (options.skillId) {
    assertValidObjectId(options.skillId, 'Invalid skill identifier.');
    filter.skillIds = new Types.ObjectId(options.skillId);
  }

  if (options.difficulty) {
    filter.difficulty = options.difficulty;
  }

  const projects = await Project.find(filter).sort({ title: 1 }).lean();
  return {
    projects: projects.map(serializeProject)
  };
};

/**
 * Service: Retrieves opportunities with optional filtering by career, skill, or type.
 */
export const getOpportunities = async (
  options: OpportunityFilterOptions = {}
): Promise<{ opportunities: SerializedOpportunity[] }> => {
  const filter: Record<string, any> = {};

  if (options.careerId) {
    assertValidObjectId(options.careerId, 'Invalid career identifier.');
    filter.careerIds = new Types.ObjectId(options.careerId);
  }

  if (options.skillId) {
    assertValidObjectId(options.skillId, 'Invalid skill identifier.');
    filter.skillIds = new Types.ObjectId(options.skillId);
  }

  if (options.type) {
    filter.type = options.type;
  }

  const opportunities = await Opportunity.find(filter).sort({ title: 1 }).lean();
  return {
    opportunities: opportunities.map(serializeOpportunity)
  };
};

export const catalogService = {
  getCareers,
  getCareerById,
  getSkills,
  getResources,
  getProjects,
  getOpportunities
};
