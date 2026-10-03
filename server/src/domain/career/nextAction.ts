import {
  RoadmapItem,
  StudentSkillInput,
  CareerInput,
  ResourceInput,
  ProjectInput,
  OpportunityInput,
  NextBestAction
} from './types';
import { normalizeStudentSkills } from './alignment';

export interface SelectNextBestActionParams {
  readonly roadmap: readonly RoadmapItem[];
  readonly studentSkills: readonly StudentSkillInput[];
  readonly career?: CareerInput;
  readonly resources?: readonly ResourceInput[];
  readonly projects?: readonly ProjectInput[];
  readonly opportunities?: readonly OpportunityInput[];
}

/**
 * Selects ONE deterministic next best action based on the highest priority roadmap skill.
 *
 * Selection Hierarchy:
 * 1. Top roadmap skill -> matching educational Resource
 * 2. If no resource -> matching hands-on Project (skill + career)
 * 3. If neither -> matching Opportunity (career and/or skill)
 * 4. If none -> type "none"
 */
export const selectNextBestAction = ({
  roadmap,
  studentSkills = [],
  career,
  resources = [],
  projects = [],
  opportunities = []
}: SelectNextBestActionParams): NextBestAction => {
  // STEP 1: Identify highest priority roadmap skill
  if (!roadmap || roadmap.length === 0) {
    return {
      type: 'none',
      itemId: null,
      skillId: null,
      title: 'No catalog action is currently available',
      reason: 'No skill gaps identified. All career requirements are met.'
    };
  }

  const targetSkillId = roadmap[0].skillId;
  const studentMap = normalizeStudentSkills(studentSkills);
  const currentSkillLevel = studentMap.get(targetSkillId) ?? 0;

  // Determine target student level category
  const targetLevelCategory: 'beginner' | 'intermediate' | 'advanced' =
    currentSkillLevel <= 1 ? 'beginner' : currentSkillLevel <= 3 ? 'intermediate' : 'advanced';

  // STEP 2 & 3: Find resources matching the top skill
  const matchingResources = resources.filter((r) => r.skillIds.includes(targetSkillId));

  if (matchingResources.length > 0) {
    // Sort resources:
    // 1. Level match preferred
    // 2. Lower duration preferred
    // 3. Stable title/ID tie-break
    const sortedResources = [...matchingResources].sort((a, b) => {
      const matchA = a.level === targetLevelCategory ? 1 : 0;
      const matchB = b.level === targetLevelCategory ? 1 : 0;
      if (matchB !== matchA) {
        return matchB - matchA;
      }
      const durA = a.durationHours ?? 0;
      const durB = b.durationHours ?? 0;
      if (durA !== durB) {
        return durA - durB;
      }
      return a.resourceId.localeCompare(b.resourceId);
    });

    const chosen = sortedResources[0];
    return {
      type: 'resource',
      itemId: chosen.resourceId,
      skillId: targetSkillId,
      title: chosen.title,
      reason: `Foundational resource to address top-priority gap in ${targetSkillId}.`
    };
  }

  // STEP 4: If no resource exists, look for a matching Project
  const matchingProjects = projects.filter((p) => {
    const hasSkill = p.skillIds.includes(targetSkillId);
    const hasCareer = !career || (p.careerIds && p.careerIds.includes(career.careerId));
    return hasSkill && hasCareer;
  });

  if (matchingProjects.length > 0) {
    const sortedProjects = [...matchingProjects].sort((a, b) => {
      const hoursA = a.estimatedHours ?? 0;
      const hoursB = b.estimatedHours ?? 0;
      if (hoursA !== hoursB) {
        return hoursA - hoursB;
      }
      return a.projectId.localeCompare(b.projectId);
    });

    const chosen = sortedProjects[0];
    return {
      type: 'project',
      itemId: chosen.projectId,
      skillId: targetSkillId,
      title: chosen.title,
      reason: `Practical portfolio project to demonstrate and build ${targetSkillId} competence.`
    };
  }

  // STEP 5: If neither exists, look for an Opportunity
  const matchingOpportunities = opportunities.filter((o) => {
    const hasCareer = career && o.careerIds && o.careerIds.includes(career.careerId);
    const hasSkill = o.skillIds && o.skillIds.includes(targetSkillId);
    return hasCareer || hasSkill;
  });

  if (matchingOpportunities.length > 0) {
    const sortedOpportunities = [...matchingOpportunities].sort((a, b) => {
      // Prefer opportunities matching both career and skill
      const scoreA =
        (career && a.careerIds?.includes(career.careerId) ? 1 : 0) +
        (a.skillIds?.includes(targetSkillId) ? 1 : 0);
      const scoreB =
        (career && b.careerIds?.includes(career.careerId) ? 1 : 0) +
        (b.skillIds?.includes(targetSkillId) ? 1 : 0);

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return a.opportunityId.localeCompare(b.opportunityId);
    });

    const chosen = sortedOpportunities[0];
    return {
      type: 'opportunity',
      itemId: chosen.opportunityId,
      skillId: targetSkillId,
      title: chosen.title,
      reason: `Extracurricular opportunity aligned with your career trajectory and skillset.`
    };
  }

  // STEP 6: No catalog action found
  return {
    type: 'none',
    itemId: null,
    skillId: targetSkillId,
    title: 'No catalog action is currently available',
    reason: `No catalog learning resource, project, or opportunity found for skill ${targetSkillId}.`
  };
};
