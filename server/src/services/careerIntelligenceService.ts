import { Types } from 'mongoose';
import { Student, Career, Skill, Resource, Project, Opportunity } from '../models';
import { AppError } from '../middleware/errorHandler';
import { generateCareerIntelligence } from '../domain/career';
import {
  mapStudentSkillsToDomain,
  mapCareerToDomain,
  mapSkillsToDomain,
  mapResourcesToDomain,
  mapProjectsToDomain,
  mapOpportunitiesToDomain,
  mapToCareerIntelligenceResponse
} from '../mappers/careerIntelligenceMapper';

export interface GetCareerIntelligenceOptions {
  careerIdOverride?: string;
}

/**
 * Asserts that an ID is a valid 24-character hexadecimal ObjectId.
 */
export const assertValidId = (id: string, errorMessage: string): void => {
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, 'INVALID_ID', errorMessage);
  }
};

/**
 * Service: Retrieves necessary student and catalog data, maps to pure domain inputs,
 * executes the deterministic Career Intelligence Engine, and formats the response.
 */
export const getStudentCareerIntelligence = async (
  studentId: string,
  options: GetCareerIntelligenceOptions = {}
) => {
  // 1. Validate student ID
  assertValidId(studentId, 'Invalid student ID.');

  // 2. Retrieve student
  const student = await Student.findById(studentId).lean();
  if (!student) {
    throw new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.');
  }

  // 3. Determine target career (override vs primary vs first target)
  let targetCareerId: string;

  if (options.careerIdOverride) {
    assertValidId(options.careerIdOverride, 'Invalid career ID.');
    targetCareerId = options.careerIdOverride;
  } else if (student.primaryCareerId) {
    targetCareerId = student.primaryCareerId.toString();
  } else if (student.targetCareerIds && student.targetCareerIds.length > 0) {
    targetCareerId = student.targetCareerIds[0].toString();
  } else {
    throw new AppError(
      400,
      'CAREER_NOT_SELECTED',
      'The student has not selected a target career.'
    );
  }

  // 4. Retrieve career document
  const career = await Career.findById(targetCareerId).lean();
  if (!career) {
    throw new AppError(404, 'CAREER_NOT_FOUND', 'Selected career was not found.');
  }

  // 5. Query relevant catalog dependencies
  const requiredSkillIds = (career.requiredSkills ?? []).map((r) => r.skillId);
  const studentSkillIds = (student.skills ?? []).map((s) => s.skillId);
  const coreSkillIds = Array.from(new Set([...requiredSkillIds, ...studentSkillIds]));

  // Retrieve skills relevant to the career and student
  const skills = await Skill.find().lean();
  const skillObjectIds = skills.map((s) => s._id);

  // Retrieve resources, projects, and opportunities relevant to the career or skills
  const [resources, projects, opportunities] = await Promise.all([
    Resource.find({
      skillIds: { $in: coreSkillIds.length > 0 ? coreSkillIds : skillObjectIds }
    }).lean(),
    Project.find({
      $or: [
        { careerIds: career._id },
        { skillIds: { $in: coreSkillIds.length > 0 ? coreSkillIds : skillObjectIds } }
      ]
    }).lean(),
    Opportunity.find({
      $or: [
        { careerIds: career._id },
        { skillIds: { $in: coreSkillIds.length > 0 ? coreSkillIds : skillObjectIds } }
      ]
    }).lean()
  ]);

  // 6. Map to pure domain types
  const domainStudentSkills = mapStudentSkillsToDomain(student.skills);
  const domainCareer = mapCareerToDomain(career);
  const domainSkills = mapSkillsToDomain(skills);
  const domainResources = mapResourcesToDomain(resources);
  const domainProjects = mapProjectsToDomain(projects);
  const domainOpportunities = mapOpportunitiesToDomain(opportunities);

  // 7. Execute BE-04 pure Career Intelligence Engine
  const domainResult = generateCareerIntelligence({
    career: domainCareer,
    studentSkills: domainStudentSkills,
    catalogSkills: domainSkills,
    resources: domainResources,
    projects: domainProjects,
    opportunities: domainOpportunities
  });

  // 8. Return formatted API response payload
  return mapToCareerIntelligenceResponse(career, domainResult);
};

export const careerIntelligenceService = {
  getStudentCareerIntelligence
};
