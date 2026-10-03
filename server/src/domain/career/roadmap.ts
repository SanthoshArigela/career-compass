import {
  SkillPriorityResult,
  SkillCatalogItem,
  StudentSkillInput,
  CareerInput,
  RoadmapItem
} from './types';
import { normalizeStudentSkills } from './alignment';

/**
 * Builds a deterministic, prerequisite-aware learning roadmap from prioritized skill gaps.
 *
 * Rules:
 * 1. Only consider missing skills (and missing prerequisites).
 * 2. Prerequisite skills appear before dependent skills.
 * 3. Independent skills are ordered by priorityScore (with deterministic tie-breakers).
 * 4. Cycle safety: If circular dependencies occur, breaks cycle deterministically without infinite loop.
 * 5. Deterministic human-readable reasons and estimated hours based on levels needed and hoursPerLevel.
 */
export const buildCareerRoadmap = (
  priorities: readonly SkillPriorityResult[],
  catalogSkills: readonly SkillCatalogItem[] = [],
  studentSkills: readonly StudentSkillInput[] = [],
  career?: CareerInput
): RoadmapItem[] => {
  if (priorities.length === 0) {
    return [];
  }

  const studentMap = normalizeStudentSkills(studentSkills);
  const catalogMap = new Map<string, SkillCatalogItem>();
  for (const item of catalogSkills) {
    catalogMap.set(item.skillId, item);
  }

  // Map career requirements for levels
  const careerReqMap = new Map<string, { requiredLevel: number; importance: number }>();
  if (career?.requiredSkills) {
    for (const req of career.requiredSkills) {
      careerReqMap.set(req.skillId, {
        requiredLevel: req.requiredLevel,
        importance: req.importance
      });
    }
  }

  // Priority metadata lookup
  const priorityMap = new Map<string, SkillPriorityResult>();
  for (const p of priorities) {
    priorityMap.set(p.skillId, p);
  }

  // 1. Identify all skills that need to be learned (priority skills + any unfulfilled prerequisites)
  const skillsToLearn = new Set<string>(priorities.map((p) => p.skillId));

  // Traverse prerequisites to include missing prerequisites
  const queue = [...skillsToLearn];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const catalog = catalogMap.get(currentId);
    if (catalog?.prerequisites) {
      for (const prereqId of catalog.prerequisites) {
        const studentLevel = studentMap.get(prereqId) ?? 0;
        // If student does not have this prerequisite and it's not yet in our list
        if (studentLevel < 1 && !skillsToLearn.has(prereqId)) {
          skillsToLearn.add(prereqId);
          queue.push(prereqId);
        }
      }
    }
  }

  // Ensure priority metadata exists for all skills to learn
  for (const skillId of skillsToLearn) {
    if (!priorityMap.has(skillId)) {
      const studentLevel = studentMap.get(skillId) ?? 0;
      const req = careerReqMap.get(skillId);
      const requiredLevel = req?.requiredLevel ?? 1;
      const importance = req?.importance ?? 2;
      const gap = Math.max(requiredLevel - studentLevel, 1);
      const basePriority = gap * importance;

      // Count dependents in skillsToLearn
      let bonus = 0;
      for (const otherId of skillsToLearn) {
        if (otherId === skillId) continue;
        const otherCatalog = catalogMap.get(otherId);
        if (otherCatalog?.prerequisites?.includes(skillId)) {
          bonus += 1;
        }
      }

      priorityMap.set(skillId, {
        skillId,
        gap,
        importance,
        basePriority,
        prerequisiteBonus: bonus,
        priorityScore: basePriority + bonus
      });
    }
  }

  // 2. Build dependency graph among skillsToLearn
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, Set<string>>();

  for (const skillId of skillsToLearn) {
    inDegree.set(skillId, 0);
    dependents.set(skillId, new Set<string>());
  }

  for (const skillId of skillsToLearn) {
    const catalog = catalogMap.get(skillId);
    if (catalog?.prerequisites) {
      for (const prereqId of catalog.prerequisites) {
        if (skillsToLearn.has(prereqId)) {
          inDegree.set(skillId, (inDegree.get(skillId) ?? 0) + 1);
          dependents.get(prereqId)?.add(skillId);
        }
      }
    }
  }

  // Helper comparison for available nodes
  const compareNodes = (idA: string, idB: string): number => {
    const pA = priorityMap.get(idA)!;
    const pB = priorityMap.get(idB)!;

    if (pB.priorityScore !== pA.priorityScore) {
      return pB.priorityScore - pA.priorityScore;
    }
    if (pB.importance !== pA.importance) {
      return pB.importance - pA.importance;
    }
    if (pB.gap !== pA.gap) {
      return pB.gap - pA.gap;
    }
    return idA.localeCompare(idB);
  };

  // 3. Topological Sort with Priority Selection and Cycle Safety
  const remaining = new Set<string>(skillsToLearn);
  const roadmap: RoadmapItem[] = [];
  let orderCounter = 1;

  while (remaining.size > 0) {
    // Find all nodes with inDegree === 0
    const available: string[] = [];
    for (const skillId of remaining) {
      if ((inDegree.get(skillId) ?? 0) === 0) {
        available.push(skillId);
      }
    }

    let nextSkillId: string;

    if (available.length > 0) {
      // Pick best candidate by priority
      available.sort(compareNodes);
      nextSkillId = available[0];
    } else {
      // CYCLE DETECTED: No node has inDegree === 0 among remaining.
      // Break cycle deterministically by picking the highest priority remaining node.
      const remainingArr = Array.from(remaining);
      remainingArr.sort(compareNodes);
      nextSkillId = remainingArr[0];
    }

    // Schedule nextSkillId
    remaining.delete(nextSkillId);

    // Decrement inDegree for its dependents
    const deps = dependents.get(nextSkillId);
    if (deps) {
      for (const depId of deps) {
        const curDeg = inDegree.get(depId) ?? 0;
        if (curDeg > 0) {
          inDegree.set(depId, curDeg - 1);
        }
      }
    }

    const pMeta = priorityMap.get(nextSkillId)!;
    const catItem = catalogMap.get(nextSkillId);
    const studentLevel = studentMap.get(nextSkillId) ?? 0;
    const req = careerReqMap.get(nextSkillId);
    const targetLevel = req?.requiredLevel ?? Math.max(studentLevel + 1, 1);
    const levelsNeeded = Math.max(targetLevel - studentLevel, 1);
    const hoursPerLevel = catItem?.hoursPerLevel && catItem.hoursPerLevel > 0 ? catItem.hoursPerLevel : 20;
    const estimatedHours = Math.round(levelsNeeded * hoursPerLevel);

    // Formulate deterministic reason
    let reason: string;
    if (pMeta.prerequisiteBonus >= 2) {
      reason = 'Important prerequisite for multiple target skills.';
    } else if (pMeta.importance === 3 && pMeta.gap >= 2) {
      reason = 'Critical skill with a significant gap.';
    } else if (pMeta.importance === 3) {
      reason = 'Critical skill required for the selected career.';
    } else if (pMeta.prerequisiteBonus === 1) {
      reason = 'Essential prerequisite skill required before advanced learning.';
    } else if (pMeta.priorityScore >= 6) {
      reason = 'High-priority skill required for the selected career.';
    } else {
      reason = 'Core skill required for career progression.';
    }

    roadmap.push({
      order: orderCounter++,
      skillId: nextSkillId,
      reason,
      priorityScore: pMeta.priorityScore,
      estimatedHours
    });
  }

  return roadmap;
};
