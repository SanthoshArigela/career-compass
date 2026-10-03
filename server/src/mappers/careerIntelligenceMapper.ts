import {
  CareerInput,
  StudentSkillInput,
  SkillCatalogItem,
  ResourceInput,
  ProjectInput,
  OpportunityInput,
  CareerIntelligenceResult
} from '../domain/career/types';

/**
 * Maps Mongoose/DB Student skills to pure domain StudentSkillInput.
 */
export const mapStudentSkillsToDomain = (skills: any[] = []): StudentSkillInput[] => {
  return skills.map((s) => ({
    skillId: s.skillId ? s.skillId.toString() : s.skillId,
    level: s.level
  }));
};

/**
 * Maps Mongoose/DB Career to pure domain CareerInput.
 */
export const mapCareerToDomain = (career: any): CareerInput => {
  return {
    careerId: career._id ? career._id.toString() : career.careerId || career.id,
    title: career.title,
    requiredSkills: (career.requiredSkills ?? []).map((req: any) => ({
      skillId: req.skillId ? req.skillId.toString() : req.skillId,
      requiredLevel: req.requiredLevel,
      importance: req.importance
    }))
  };
};

/**
 * Maps Mongoose/DB Skills to pure domain SkillCatalogItem list.
 */
export const mapSkillsToDomain = (skills: any[] = []): SkillCatalogItem[] => {
  return skills.map((s) => ({
    skillId: s._id ? s._id.toString() : s.skillId || s.id,
    name: s.name,
    category: s.category,
    prerequisites: (s.prerequisites ?? []).map((p: any) => (p.toString ? p.toString() : p)),
    hoursPerLevel: s.hoursPerLevel
  }));
};

/**
 * Maps Mongoose/DB Resources to pure domain ResourceInput list.
 */
export const mapResourcesToDomain = (resources: any[] = []): ResourceInput[] => {
  return resources.map((r) => ({
    resourceId: r._id ? r._id.toString() : r.resourceId || r.id,
    title: r.title,
    type: r.type,
    skillIds: (r.skillIds ?? []).map((s: any) => (s.toString ? s.toString() : s)),
    level: r.level,
    levelGranted: r.levelGranted,
    durationHours: r.durationHours,
    cost: r.cost,
    url: r.url
  }));
};

/**
 * Maps Mongoose/DB Projects to pure domain ProjectInput list.
 */
export const mapProjectsToDomain = (projects: any[] = []): ProjectInput[] => {
  return projects.map((p) => ({
    projectId: p._id ? p._id.toString() : p.projectId || p.id,
    title: p.title,
    difficulty: p.difficulty,
    estimatedHours: p.estimatedHours,
    skillIds: (p.skillIds ?? []).map((s: any) => (s.toString ? s.toString() : s)),
    careerIds: (p.careerIds ?? []).map((c: any) => (c.toString ? c.toString() : c)),
    deliverables: p.deliverables ?? [],
    skillLevelsGained: (p.skillLevelsGained ?? []).map((g: any) => ({
      skillId: g.skillId ? g.skillId.toString() : g.skillId,
      levelGain: g.levelGain
    }))
  }));
};

/**
 * Maps Mongoose/DB Opportunities to pure domain OpportunityInput list.
 */
export const mapOpportunitiesToDomain = (opportunities: any[] = []): OpportunityInput[] => {
  return opportunities.map((o) => ({
    opportunityId: o._id ? o._id.toString() : o.opportunityId || o.id,
    title: o.title,
    organization: o.organization,
    type: o.type,
    url: o.url,
    deadline: o.deadline ? new Date(o.deadline) : null,
    location: o.location ?? null,
    remote: Boolean(o.remote),
    careerIds: (o.careerIds ?? []).map((c: any) => (c.toString ? c.toString() : c)),
    skillIds: (o.skillIds ?? []).map((s: any) => (s.toString ? s.toString() : s)),
    minSkillLevel: o.minSkillLevel ?? 0,
    description: o.description
  }));
};

/**
 * Assembles the final API response matching the contract:
 * {
 *   career: { id, slug, title },
 *   alignment: number (integer 0-100),
 *   skillGaps: [...],
 *   priorities: [...],
 *   roadmap: [...],
 *   nextBestAction: { ... }
 * }
 */
export const mapToCareerIntelligenceResponse = (career: any, domainResult: CareerIntelligenceResult) => {
  return {
    career: {
      id: career._id ? career._id.toString() : career.careerId || career.id,
      slug: career.slug ?? '',
      title: career.title ?? ''
    },
    alignment: domainResult.alignment.alignmentScore,
    skillGaps: domainResult.skillGaps,
    priorities: domainResult.priorities,
    roadmap: domainResult.roadmap,
    nextBestAction: domainResult.nextBestAction
  };
};
