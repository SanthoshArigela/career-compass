import { ICareer } from '../models/Career';
import { ISkill } from '../models/Skill';
import { IResource } from '../models/Resource';
import { IProject } from '../models/Project';
import { IOpportunity } from '../models/Opportunity';

export interface SerializedCareerCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  interestTags: string[];
  requiredSkillCount: number;
}

export interface SerializedCareerRequiredSkill {
  skillId: string;
  name: string;
  requiredLevel: number;
  importance: number;
}

export interface SerializedCareerDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  interestTags: string[];
  requiredSkills: SerializedCareerRequiredSkill[];
}

export interface SerializedSkill {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  hoursPerLevel: number;
  prerequisites: string[];
}

export interface SerializedResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  level: string;
  durationHours: number;
  url: string;
  skillIds: string[];
}

export interface SerializedProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  skillIds: string[];
  careerIds: string[];
  deliverables: string[];
}

export interface SerializedOpportunity {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  organization: string;
  url: string;
  deadline: string | null;
  careerIds: string[];
  skillIds: string[];
  minSkillLevel: number;
}

/**
 * Maps a Career document to a lightweight discovery card.
 */
export const serializeCareerCard = (career: any): SerializedCareerCard => {
  return {
    id: career._id ? career._id.toString() : career.id,
    slug: career.slug,
    title: career.title,
    summary: career.summary,
    category: career.category,
    interestTags: Array.isArray(career.interestTags) ? career.interestTags : [],
    requiredSkillCount: Array.isArray(career.requiredSkills) ? career.requiredSkills.length : 0
  };
};

/**
 * Maps a Career document to a complete detailed view resolving skill names.
 */
export const serializeCareerDetail = (
  career: any,
  skillNameMap: Map<string, string>
): SerializedCareerDetail => {
  const requiredSkills: SerializedCareerRequiredSkill[] = Array.isArray(career.requiredSkills)
    ? career.requiredSkills.map((rs: any) => {
        const skillIdStr = rs.skillId ? rs.skillId.toString() : rs.id;
        return {
          skillId: skillIdStr,
          name: skillNameMap.get(skillIdStr) || 'Unknown Skill',
          requiredLevel: rs.requiredLevel,
          importance: rs.importance
        };
      })
    : [];

  return {
    id: career._id ? career._id.toString() : career.id,
    slug: career.slug,
    title: career.title,
    summary: career.summary,
    category: career.category,
    interestTags: Array.isArray(career.interestTags) ? career.interestTags : [],
    requiredSkills
  };
};

/**
 * Maps a Skill document to a clean API response representation.
 */
export const serializeSkill = (skill: any): SerializedSkill => {
  return {
    id: skill._id ? skill._id.toString() : skill.id,
    slug: skill.slug,
    name: skill.name,
    category: skill.category,
    description: skill.description || '',
    hoursPerLevel: skill.hoursPerLevel,
    prerequisites: Array.isArray(skill.prerequisites)
      ? skill.prerequisites.map((p: any) => (p ? p.toString() : ''))
      : []
  };
};

/**
 * Maps a Resource document to a clean API response representation.
 */
export const serializeResource = (resource: any): SerializedResource => {
  return {
    id: resource._id ? resource._id.toString() : resource.id,
    slug: resource.slug,
    title: resource.title,
    description: resource.description || resource.title,
    type: resource.type,
    level: resource.level,
    durationHours: resource.durationHours,
    url: resource.url,
    skillIds: Array.isArray(resource.skillIds)
      ? resource.skillIds.map((s: any) => (s ? s.toString() : ''))
      : []
  };
};

/**
 * Maps a Project document to a clean API response representation.
 */
export const serializeProject = (project: any): SerializedProject => {
  return {
    id: project._id ? project._id.toString() : project.id,
    slug: project.slug,
    title: project.title,
    description: project.description || '',
    difficulty: project.difficulty,
    estimatedHours: project.estimatedHours,
    skillIds: Array.isArray(project.skillIds)
      ? project.skillIds.map((s: any) => (s ? s.toString() : ''))
      : [],
    careerIds: Array.isArray(project.careerIds)
      ? project.careerIds.map((c: any) => (c ? c.toString() : ''))
      : [],
    deliverables: Array.isArray(project.deliverables) ? project.deliverables : []
  };
};

/**
 * Maps an Opportunity document to a clean API response representation.
 * Preserves null deadlines accurately without fabrication.
 */
export const serializeOpportunity = (opportunity: any): SerializedOpportunity => {
  let formattedDeadline: string | null = null;
  if (opportunity.deadline) {
    formattedDeadline =
      opportunity.deadline instanceof Date
        ? opportunity.deadline.toISOString()
        : new Date(opportunity.deadline).toISOString();
  }

  return {
    id: opportunity._id ? opportunity._id.toString() : opportunity.id,
    slug: opportunity.slug,
    title: opportunity.title,
    description: opportunity.description || '',
    type: opportunity.type,
    organization: opportunity.organization,
    url: opportunity.url,
    deadline: formattedDeadline,
    careerIds: Array.isArray(opportunity.careerIds)
      ? opportunity.careerIds.map((c: any) => (c ? c.toString() : ''))
      : [],
    skillIds: Array.isArray(opportunity.skillIds)
      ? opportunity.skillIds.map((s: any) => (s ? s.toString() : ''))
      : [],
    minSkillLevel: opportunity.minSkillLevel ?? 0
  };
};
