/**
 * Pure domain types for the Career Intelligence Engine.
 * Independent of Mongoose, MongoDB, Express, and external services.
 */

export interface StudentSkillInput {
  readonly skillId: string;
  readonly level: number; // 0 to 5
}

export interface CareerSkillRequirement {
  readonly skillId: string;
  readonly requiredLevel: number; // 0 to 5
  readonly importance: number; // 1 = useful, 2 = important, 3 = critical
}

export interface SkillCatalogItem {
  readonly skillId: string;
  readonly name?: string;
  readonly category?: string;
  readonly prerequisites?: readonly string[]; // Array of prerequisite skillIds
  readonly hoursPerLevel?: number;
}

export interface CareerInput {
  readonly careerId: string;
  readonly title?: string;
  readonly requiredSkills: readonly CareerSkillRequirement[];
}

export interface ResourceInput {
  readonly resourceId: string;
  readonly title: string;
  readonly type?: string;
  readonly skillIds: readonly string[];
  readonly level?: string; // 'beginner' | 'intermediate' | 'advanced'
  readonly levelGranted?: number;
  readonly durationHours?: number;
  readonly cost?: number;
  readonly url?: string;
}

export interface ProjectSkillGainInput {
  readonly skillId: string;
  readonly levelGain: number;
}

export interface ProjectInput {
  readonly projectId: string;
  readonly title: string;
  readonly difficulty?: string; // 'beginner' | 'intermediate' | 'advanced'
  readonly estimatedHours?: number;
  readonly skillIds: readonly string[];
  readonly careerIds: readonly string[];
  readonly deliverables?: readonly string[];
  readonly skillLevelsGained?: readonly ProjectSkillGainInput[];
}

export interface OpportunityInput {
  readonly opportunityId: string;
  readonly title: string;
  readonly organization?: string;
  readonly type?: string; // 'internship' | 'job' | 'hackathon' | 'scholarship' | 'fellowship' | 'competition'
  readonly url?: string;
  readonly deadline?: Date | null;
  readonly location?: string | null;
  readonly remote?: boolean;
  readonly careerIds: readonly string[];
  readonly skillIds: readonly string[];
  readonly minSkillLevel?: number;
  readonly description?: string;
}

export interface CareerAlignmentResult {
  readonly careerId: string;
  readonly alignmentScore: number; // Integer between 0 and 100
}

export interface SkillGapResult {
  readonly skillId: string;
  readonly requiredLevel: number;
  readonly currentLevel: number;
  readonly gap: number;
  readonly importance: number;
}

export interface SkillPriorityResult {
  readonly skillId: string;
  readonly gap: number;
  readonly importance: number;
  readonly basePriority: number;
  readonly prerequisiteBonus: number;
  readonly priorityScore: number;
}

export interface RoadmapItem {
  readonly order: number;
  readonly skillId: string;
  readonly reason: string;
  readonly priorityScore: number;
  readonly estimatedHours: number;
}

export type NextBestActionType = 'resource' | 'project' | 'opportunity' | 'none';

export interface NextBestAction {
  readonly type: NextBestActionType;
  readonly itemId: string | null;
  readonly skillId: string | null;
  readonly title: string;
  readonly reason: string;
}

export interface CareerIntelligenceResult {
  readonly careerId: string;
  readonly alignment: CareerAlignmentResult;
  readonly skillGaps: readonly SkillGapResult[];
  readonly priorities: readonly SkillPriorityResult[];
  readonly roadmap: readonly RoadmapItem[];
  readonly nextBestAction: NextBestAction;
}
