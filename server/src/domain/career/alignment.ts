import { CareerInput, StudentSkillInput, CareerAlignmentResult } from './types';

/**
 * Normalizes student skill entries into a Map of skillId -> maximum level.
 * Rejects levels outside 0-5. Resolves duplicates by taking the maximum level.
 */
export const normalizeStudentSkills = (
  studentSkills: readonly StudentSkillInput[]
): Map<string, number> => {
  const skillMap = new Map<string, number>();

  for (const item of studentSkills) {
    if (typeof item.level !== 'number' || item.level < 0 || item.level > 5 || Number.isNaN(item.level)) {
      throw new Error(
        `Invalid student skill level for skillId "${item.skillId}": level must be between 0 and 5, received ${item.level}`
      );
    }

    const current = skillMap.get(item.skillId) ?? 0;
    if (item.level > current) {
      skillMap.set(item.skillId, item.level);
    } else if (!skillMap.has(item.skillId)) {
      skillMap.set(item.skillId, item.level);
    }
  }

  return skillMap;
};

/**
 * Calculates deterministic career alignment score between 0 and 100.
 *
 * Formula:
 * normalizedCoverage = requiredLevel === 0 ? 1 : min(studentLevel / requiredLevel, 1)
 * weightedCoverage = normalizedCoverage * importance
 * weightedRequirement = importance
 * alignmentScore = round((sum(weightedCoverage) / sum(weightedRequirement)) * 100)
 */
export const calculateCareerAlignment = (
  career: CareerInput,
  studentSkills: readonly StudentSkillInput[]
): CareerAlignmentResult => {
  const studentMap = normalizeStudentSkills(studentSkills);

  if (!career.requiredSkills || career.requiredSkills.length === 0) {
    return {
      careerId: career.careerId,
      alignmentScore: 100
    };
  }

  let totalWeightedCoverage = 0;
  let totalWeightedRequirement = 0;

  for (const req of career.requiredSkills) {
    const studentLevel = studentMap.get(req.skillId) ?? 0;
    const requiredLevel = req.requiredLevel;
    const importance = req.importance;

    const normalizedCoverage =
      requiredLevel === 0 ? 1 : Math.min(studentLevel / requiredLevel, 1);

    const weightedCoverage = normalizedCoverage * importance;
    const weightedRequirement = importance;

    totalWeightedCoverage += weightedCoverage;
    totalWeightedRequirement += weightedRequirement;
  }

  if (totalWeightedRequirement === 0) {
    return {
      careerId: career.careerId,
      alignmentScore: 100
    };
  }

  const rawScore = (totalWeightedCoverage / totalWeightedRequirement) * 100;
  const roundedScore = Math.round(rawScore);
  const clampedScore = Math.max(0, Math.min(100, roundedScore));

  return {
    careerId: career.careerId,
    alignmentScore: clampedScore
  };
};
