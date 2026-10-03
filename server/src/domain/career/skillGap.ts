import { CareerInput, StudentSkillInput, SkillGapResult } from './types';
import { normalizeStudentSkills } from './alignment';

/**
 * Calculates skill gaps for a student against a target career.
 * Only skills where studentLevel < requiredLevel are included.
 */
export const calculateSkillGaps = (
  career: CareerInput,
  studentSkills: readonly StudentSkillInput[]
): SkillGapResult[] => {
  const studentMap = normalizeStudentSkills(studentSkills);
  const gaps: SkillGapResult[] = [];

  if (!career.requiredSkills) {
    return gaps;
  }

  for (const req of career.requiredSkills) {
    const studentLevel = studentMap.get(req.skillId) ?? 0;
    const requiredLevel = req.requiredLevel;

    if (studentLevel < requiredLevel) {
      const gap = requiredLevel - studentLevel;
      gaps.push({
        skillId: req.skillId,
        requiredLevel,
        currentLevel: studentLevel,
        gap,
        importance: req.importance
      });
    }
  }

  return gaps;
};
