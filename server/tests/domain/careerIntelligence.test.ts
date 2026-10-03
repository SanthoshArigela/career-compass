import { describe, it, expect } from 'vitest';
import {
  calculateCareerAlignment,
  calculateSkillGaps,
  calculateSkillPriorities,
  buildCareerRoadmap,
  selectNextBestAction,
  generateCareerIntelligence,
  CareerInput,
  StudentSkillInput,
  SkillCatalogItem,
  ResourceInput,
  ProjectInput,
  OpportunityInput
} from '../../src/domain/career';

describe('BE-04: Career Intelligence Engine', () => {
  const sampleCareer: CareerInput = {
    careerId: 'ai-engineer',
    title: 'AI Engineer',
    requiredSkills: [
      { skillId: 'python', requiredLevel: 4, importance: 3 },
      { skillId: 'machine-learning', requiredLevel: 4, importance: 3 },
      { skillId: 'statistics', requiredLevel: 3, importance: 2 },
      { skillId: 'git', requiredLevel: 3, importance: 1 }
    ]
  };

  const sampleCatalog: SkillCatalogItem[] = [
    { skillId: 'python', name: 'Python', hoursPerLevel: 20, prerequisites: [] },
    { skillId: 'statistics', name: 'Statistics', hoursPerLevel: 25, prerequisites: [] },
    { skillId: 'git', name: 'Git', hoursPerLevel: 10, prerequisites: [] },
    { skillId: 'machine-learning', name: 'Machine Learning', hoursPerLevel: 30, prerequisites: ['python', 'statistics'] },
    { skillId: 'deep-learning', name: 'Deep Learning', hoursPerLevel: 35, prerequisites: ['machine-learning'] }
  ];

  // 1 & 2. ALIGNMENT TESTS
  describe('Career Alignment Calculations', () => {
    it('returns 100% alignment when student meets or exceeds all required skill levels', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 4 },
        { skillId: 'machine-learning', level: 4 },
        { skillId: 'statistics', level: 5 }, // Exceeds level 3
        { skillId: 'git', level: 3 }
      ];

      const result = calculateCareerAlignment(sampleCareer, studentSkills);
      expect(result.alignmentScore).toBe(100);
    });

    it('returns 0% alignment when student has no skills', () => {
      const result = calculateCareerAlignment(sampleCareer, []);
      expect(result.alignmentScore).toBe(0);
    });

    it('calculates the exact formula example from specification (yields 83%)', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 4 },
        { skillId: 'machine-learning', level: 2 },
        { skillId: 'statistics', level: 3 },
        { skillId: 'git', level: 3 }
      ];

      // Python = 1 * 3 = 3
      // ML = (2/4) * 3 = 1.5
      // Stats = 1 * 2 = 2
      // Git = 1 * 1 = 1
      // Total wt coverage = 7.5 / 9 * 100 = 83.333 -> 83
      const result = calculateCareerAlignment(sampleCareer, studentSkills);
      expect(result.alignmentScore).toBe(83);
    });

    it('handles partial skill levels accurately', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 2 }, // 2/4 * 3 = 1.5
        { skillId: 'machine-learning', level: 0 }, // 0
        { skillId: 'statistics', level: 0 }, // 0
        { skillId: 'git', level: 0 } // 0
      ];
      // 1.5 / 9 * 100 = 16.666 -> 17
      const result = calculateCareerAlignment(sampleCareer, studentSkills);
      expect(result.alignmentScore).toBe(17);
    });

    it('ignores extra student skills irrelevant to the career without penalizing alignment', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 4 },
        { skillId: 'machine-learning', level: 4 },
        { skillId: 'statistics', level: 3 },
        { skillId: 'git', level: 3 },
        { skillId: 'cooking', level: 5 },
        { skillId: 'guitar', level: 4 }
      ];

      const result = calculateCareerAlignment(sampleCareer, studentSkills);
      expect(result.alignmentScore).toBe(100);
    });

    it('resolves duplicate student skill entries by using the maximum level', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 1 },
        { skillId: 'python', level: 4 }, // Highest level taken
        { skillId: 'machine-learning', level: 4 },
        { skillId: 'statistics', level: 3 },
        { skillId: 'git', level: 3 }
      ];

      const result = calculateCareerAlignment(sampleCareer, studentSkills);
      expect(result.alignmentScore).toBe(100);
    });

    it('handles required level 0 safely without division by zero', () => {
      const careerWithZeroLevel: CareerInput = {
        careerId: 'test-career',
        requiredSkills: [{ skillId: 'general-knowledge', requiredLevel: 0, importance: 2 }]
      };

      const result = calculateCareerAlignment(careerWithZeroLevel, []);
      expect(result.alignmentScore).toBe(100);
    });

    it('handles empty career requirements gracefully', () => {
      const emptyCareer: CareerInput = {
        careerId: 'empty-career',
        requiredSkills: []
      };

      const result = calculateCareerAlignment(emptyCareer, []);
      expect(result.alignmentScore).toBe(100);
    });

    it('rejects invalid skill levels outside 0-5', () => {
      expect(() => {
        calculateCareerAlignment(sampleCareer, [{ skillId: 'python', level: 7 }]);
      }).toThrow(/must be between 0 and 5/);

      expect(() => {
        calculateCareerAlignment(sampleCareer, [{ skillId: 'python', level: -1 }]);
      }).toThrow(/must be between 0 and 5/);
    });
  });

  // 3. SKILL GAP ENGINE TESTS
  describe('Skill Gap Calculations', () => {
    it('creates skill gaps only for skills below required level', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 4 }, // No gap (met)
        { skillId: 'machine-learning', level: 2 }, // Gap = 2
        { skillId: 'statistics', level: 1 }, // Gap = 2
        { skillId: 'git', level: 3 } // No gap (met)
      ];

      const gaps = calculateSkillGaps(sampleCareer, studentSkills);
      expect(gaps.length).toBe(2);

      const mlGap = gaps.find((g) => g.skillId === 'machine-learning')!;
      expect(mlGap).toBeDefined();
      expect(mlGap.gap).toBe(2);
      expect(mlGap.currentLevel).toBe(2);
      expect(mlGap.requiredLevel).toBe(4);
      expect(mlGap.importance).toBe(3);

      const statsGap = gaps.find((g) => g.skillId === 'statistics')!;
      expect(statsGap).toBeDefined();
      expect(statsGap.gap).toBe(2);
      expect(statsGap.currentLevel).toBe(1);
    });

    it('returns empty gaps when all required skills are mastered', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 5 },
        { skillId: 'machine-learning', level: 5 },
        { skillId: 'statistics', level: 5 },
        { skillId: 'git', level: 5 }
      ];

      const gaps = calculateSkillGaps(sampleCareer, studentSkills);
      expect(gaps).toEqual([]);
    });
  });

  // 4. GAP PRIORITY TESTS
  describe('Gap Priority Calculations', () => {
    it('applies basePriority = gap * importance and adds prerequisiteBonus', () => {
      // In sampleCatalog: 'machine-learning' requires 'python' and 'statistics'
      // If both python, statistics, and machine-learning are missing:
      // python is a prerequisite for machine-learning -> bonus = 1
      // statistics is a prerequisite for machine-learning -> bonus = 1
      // machine-learning is not a prerequisite for any missing skill -> bonus = 0
      const gaps = [
        { skillId: 'python', requiredLevel: 4, currentLevel: 0, gap: 4, importance: 3 }, // base = 12, bonus = 1 -> 13
        { skillId: 'machine-learning', requiredLevel: 4, currentLevel: 0, gap: 4, importance: 3 }, // base = 12, bonus = 0 -> 12
        { skillId: 'statistics', requiredLevel: 3, currentLevel: 0, gap: 3, importance: 2 }, // base = 6, bonus = 1 -> 7
        { skillId: 'git', requiredLevel: 3, currentLevel: 0, gap: 3, importance: 1 } // base = 3, bonus = 0 -> 3
      ];

      const priorities = calculateSkillPriorities(gaps, sampleCatalog);

      expect(priorities[0].skillId).toBe('python');
      expect(priorities[0].basePriority).toBe(12);
      expect(priorities[0].prerequisiteBonus).toBe(1);
      expect(priorities[0].priorityScore).toBe(13);

      expect(priorities[1].skillId).toBe('machine-learning');
      expect(priorities[1].basePriority).toBe(12);
      expect(priorities[1].prerequisiteBonus).toBe(0);
      expect(priorities[1].priorityScore).toBe(12);

      expect(priorities[2].skillId).toBe('statistics');
      expect(priorities[2].priorityScore).toBe(7);

      expect(priorities[3].skillId).toBe('git');
      expect(priorities[3].priorityScore).toBe(3);
    });

    it('sorts ties deterministically by importance, then gap, then skillId', () => {
      const gaps = [
        { skillId: 'skill-b', requiredLevel: 2, currentLevel: 0, gap: 2, importance: 2 }, // score = 4
        { skillId: 'skill-a', requiredLevel: 2, currentLevel: 0, gap: 2, importance: 2 } // score = 4
      ];

      const priorities = calculateSkillPriorities(gaps, []);
      expect(priorities[0].skillId).toBe('skill-a');
      expect(priorities[1].skillId).toBe('skill-b');
    });
  });

  // 5. ROADMAP ENGINE TESTS
  describe('Learning Roadmap Sequencing', () => {
    it('schedules prerequisites before dependent skills', () => {
      // machine-learning depends on python. Even if machine-learning had higher priority, python must come first.
      const priorities = [
        { skillId: 'machine-learning', gap: 4, importance: 3, basePriority: 12, prerequisiteBonus: 0, priorityScore: 20 },
        { skillId: 'python', gap: 2, importance: 3, basePriority: 6, prerequisiteBonus: 1, priorityScore: 7 }
      ];

      const roadmap = buildCareerRoadmap(priorities, sampleCatalog, [], sampleCareer);

      const pythonIndex = roadmap.findIndex((r) => r.skillId === 'python');
      const mlIndex = roadmap.findIndex((r) => r.skillId === 'machine-learning');

      expect(pythonIndex).toBeGreaterThanOrEqual(0);
      expect(mlIndex).toBeGreaterThanOrEqual(0);
      expect(pythonIndex).toBeLessThan(mlIndex);
    });

    it('orders independent skills by priorityScore', () => {
      const priorities = [
        { skillId: 'git', gap: 1, importance: 1, basePriority: 1, prerequisiteBonus: 0, priorityScore: 1 },
        { skillId: 'statistics', gap: 3, importance: 2, basePriority: 6, prerequisiteBonus: 0, priorityScore: 6 }
      ];

      const roadmap = buildCareerRoadmap(priorities, sampleCatalog, [], sampleCareer);

      expect(roadmap[0].skillId).toBe('statistics');
      expect(roadmap[1].skillId).toBe('git');
    });

    it('contains no duplicate skills in roadmap', () => {
      const priorities = [
        { skillId: 'python', gap: 2, importance: 3, basePriority: 6, prerequisiteBonus: 1, priorityScore: 7 },
        { skillId: 'machine-learning', gap: 2, importance: 3, basePriority: 6, prerequisiteBonus: 0, priorityScore: 6 }
      ];

      const roadmap = buildCareerRoadmap(priorities, sampleCatalog, [], sampleCareer);
      const skillIds = roadmap.map((r) => r.skillId);
      const uniqueSkillIds = new Set(skillIds);
      expect(skillIds.length).toBe(uniqueSkillIds.size);
    });

    it('calculates estimatedHours based on levelsNeeded and hoursPerLevel', () => {
      // python: hoursPerLevel = 20. Student current = 1, required = 4 -> levelsNeeded = 3 -> 60 hours
      const studentSkills: StudentSkillInput[] = [{ skillId: 'python', level: 1 }];
      const priorities = [
        { skillId: 'python', gap: 3, importance: 3, basePriority: 9, prerequisiteBonus: 0, priorityScore: 9 }
      ];

      const roadmap = buildCareerRoadmap(priorities, sampleCatalog, studentSkills, sampleCareer);
      expect(roadmap[0].estimatedHours).toBe(60);
    });

    it('prevents infinite loops when circular prerequisites occur', () => {
      const cyclicCatalog: SkillCatalogItem[] = [
        { skillId: 'skill-x', name: 'Skill X', hoursPerLevel: 20, prerequisites: ['skill-y'] },
        { skillId: 'skill-y', name: 'Skill Y', hoursPerLevel: 20, prerequisites: ['skill-x'] }
      ];

      const priorities = [
        { skillId: 'skill-x', gap: 2, importance: 3, basePriority: 6, prerequisiteBonus: 1, priorityScore: 7 },
        { skillId: 'skill-y', gap: 2, importance: 2, basePriority: 4, prerequisiteBonus: 1, priorityScore: 5 }
      ];

      const roadmap = buildCareerRoadmap(priorities, cyclicCatalog, []);
      expect(roadmap.length).toBe(2);
      expect(roadmap[0].skillId).toBe('skill-x');
      expect(roadmap[1].skillId).toBe('skill-y');
    });
  });

  // 6. NEXT BEST ACTION TESTS
  describe('Next Best Action Selection', () => {
    const roadmap = [
      { order: 1, skillId: 'python', reason: 'Critical skill', priorityScore: 13, estimatedHours: 60 },
      { order: 2, skillId: 'statistics', reason: 'Prerequisite', priorityScore: 7, estimatedHours: 50 }
    ];

    it('selects resource when a matching resource exists for the top skill', () => {
      const resources: ResourceInput[] = [
        { resourceId: 'py-doc', title: 'Python Docs', skillIds: ['python'], level: 'beginner', durationHours: 10 },
        { resourceId: 'stats-book', title: 'Stats Book', skillIds: ['statistics'], level: 'intermediate', durationHours: 20 }
      ];

      const action = selectNextBestAction({
        roadmap,
        studentSkills: [{ skillId: 'python', level: 0 }],
        career: sampleCareer,
        resources
      });

      expect(action.type).toBe('resource');
      expect(action.itemId).toBe('py-doc');
      expect(action.skillId).toBe('python');
    });

    it('falls back to project when no resource exists for the top skill', () => {
      const projects: ProjectInput[] = [
        {
          projectId: 'py-project',
          title: 'Python CLI Project',
          skillIds: ['python'],
          careerIds: ['ai-engineer'],
          estimatedHours: 20
        }
      ];

      const action = selectNextBestAction({
        roadmap,
        studentSkills: [{ skillId: 'python', level: 0 }],
        career: sampleCareer,
        resources: [], // No resources
        projects
      });

      expect(action.type).toBe('project');
      expect(action.itemId).toBe('py-project');
      expect(action.skillId).toBe('python');
    });

    it('falls back to opportunity when neither resource nor project exists', () => {
      const opportunities: OpportunityInput[] = [
        {
          opportunityId: 'ai-hackathon',
          title: 'AI Innovation Hackathon',
          careerIds: ['ai-engineer'],
          skillIds: ['python']
        }
      ];

      const action = selectNextBestAction({
        roadmap,
        studentSkills: [{ skillId: 'python', level: 0 }],
        career: sampleCareer,
        resources: [],
        projects: [],
        opportunities
      });

      expect(action.type).toBe('opportunity');
      expect(action.itemId).toBe('ai-hackathon');
      expect(action.skillId).toBe('python');
    });

    it('returns type "none" when no matching catalog item exists', () => {
      const action = selectNextBestAction({
        roadmap,
        studentSkills: [{ skillId: 'python', level: 0 }],
        career: sampleCareer,
        resources: [],
        projects: [],
        opportunities: []
      });

      expect(action.type).toBe('none');
      expect(action.itemId).toBeNull();
      expect(action.title).toContain('No catalog action');
    });
  });

  // 7. FULL ORCHESTRATION & DETERMINISM
  describe('Full Career Intelligence Orchestration', () => {
    it('produces completely deterministic output across repeated executions', () => {
      const studentSkills: StudentSkillInput[] = [
        { skillId: 'python', level: 2 },
        { skillId: 'git', level: 3 }
      ];

      const resources: ResourceInput[] = [
        { resourceId: 'res-ml', title: 'ML Course', skillIds: ['machine-learning'], level: 'intermediate', durationHours: 15 },
        { resourceId: 'res-py', title: 'Python Book', skillIds: ['python'], level: 'intermediate', durationHours: 10 }
      ];

      const params = {
        career: sampleCareer,
        studentSkills,
        catalogSkills: sampleCatalog,
        resources
      };

      const result1 = generateCareerIntelligence(params);
      const result2 = generateCareerIntelligence(params);

      expect(result1).toEqual(result2);
      expect(result1.careerId).toBe('ai-engineer');
      expect(result1.alignment.alignmentScore).toBeGreaterThan(0);
      expect(result1.skillGaps.length).toBeGreaterThan(0);
      expect(result1.priorities.length).toBeGreaterThan(0);
      expect(result1.roadmap.length).toBeGreaterThan(0);
      expect(result1.nextBestAction.type).not.toBe('none');
    });
  });
});
