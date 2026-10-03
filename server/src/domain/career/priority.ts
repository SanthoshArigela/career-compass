import { SkillGapResult, SkillCatalogItem, SkillPriorityResult } from './types';

/**
 * Calculates priority scores for skill gaps applying prerequisite bonuses.
 *
 * Rules:
 * basePriority = gap * importance
 * prerequisiteBonus = number of currently missing required skills that depend on this skill
 * priorityScore = basePriority + prerequisiteBonus
 *
 * Sorting:
 * 1. highest priorityScore first
 * 2. higher importance first
 * 3. larger gap first
 * 4. stable skillId ascending
 */
export const calculateSkillPriorities = (
  gaps: readonly SkillGapResult[],
  catalogSkills: readonly SkillCatalogItem[] = []
): SkillPriorityResult[] => {
  const catalogMap = new Map<string, SkillCatalogItem>();
  for (const item of catalogSkills) {
    catalogMap.set(item.skillId, item);
  }

  const missingSkillIds = new Set(gaps.map((g) => g.skillId));

  const results: SkillPriorityResult[] = gaps.map((gapItem) => {
    const basePriority = gapItem.gap * gapItem.importance;

    // Count how many other missing required skills directly list this skill as a prerequisite
    let prerequisiteBonus = 0;
    for (const otherGap of gaps) {
      if (otherGap.skillId === gapItem.skillId) continue;
      const otherCatalog = catalogMap.get(otherGap.skillId);
      if (otherCatalog?.prerequisites && otherCatalog.prerequisites.includes(gapItem.skillId)) {
        prerequisiteBonus += 1;
      }
    }

    const priorityScore = basePriority + prerequisiteBonus;

    return {
      skillId: gapItem.skillId,
      gap: gapItem.gap,
      importance: gapItem.importance,
      basePriority,
      prerequisiteBonus,
      priorityScore
    };
  });

  // Sort deterministically
  results.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    if (b.importance !== a.importance) {
      return b.importance - a.importance;
    }
    if (b.gap !== a.gap) {
      return b.gap - a.gap;
    }
    return a.skillId.localeCompare(b.skillId);
  });

  return results;
};
