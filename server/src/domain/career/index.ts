import {
  CareerInput,
  StudentSkillInput,
  SkillCatalogItem,
  ResourceInput,
  ProjectInput,
  OpportunityInput,
  CareerIntelligenceResult
} from './types';
import { calculateCareerAlignment } from './alignment';
import { calculateSkillGaps } from './skillGap';
import { calculateSkillPriorities } from './priority';
import { buildCareerRoadmap } from './roadmap';
import { selectNextBestAction } from './nextAction';

export * from './types';
export * from './alignment';
export * from './skillGap';
export * from './priority';
export * from './roadmap';
export * from './nextAction';

export interface GenerateCareerIntelligenceParams {
  readonly career: CareerInput;
  readonly studentSkills: readonly StudentSkillInput[];
  readonly catalogSkills?: readonly SkillCatalogItem[];
  readonly resources?: readonly ResourceInput[];
  readonly projects?: readonly ProjectInput[];
  readonly opportunities?: readonly OpportunityInput[];
}

/**
 * Main pure domain orchestrator for Career Compass intelligence.
 * Calculates alignment, gaps, priorities, prerequisite-aware roadmap, and next action.
 *
 * Deterministic and free of external side effects.
 */
export const generateCareerIntelligence = ({
  career,
  studentSkills,
  catalogSkills = [],
  resources = [],
  projects = [],
  opportunities = []
}: GenerateCareerIntelligenceParams): CareerIntelligenceResult => {
  // 1. Calculate Career Alignment
  const alignment = calculateCareerAlignment(career, studentSkills);

  // 2. Calculate Skill Gaps
  const skillGaps = calculateSkillGaps(career, studentSkills);

  // 3. Calculate Priorities with Prerequisite Awareness
  const priorities = calculateSkillPriorities(skillGaps, catalogSkills);

  // 4. Build Sequenced Learning Roadmap
  const roadmap = buildCareerRoadmap(priorities, catalogSkills, studentSkills, career);

  // 5. Select Next Best Action
  const nextBestAction = selectNextBestAction({
    roadmap,
    studentSkills,
    career,
    resources,
    projects,
    opportunities
  });

  return {
    careerId: career.careerId,
    alignment,
    skillGaps,
    priorities,
    roadmap,
    nextBestAction
  };
};
