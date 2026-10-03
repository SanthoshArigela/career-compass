import { describe, it, expect } from 'vitest';
import mongoose, { Types } from 'mongoose';
import {
  Skill,
  Career,
  Student,
  Resource,
  Project,
  Opportunity,
  Progress
} from '../src/models';

describe('BE-02: Mongoose Database Models Validation', () => {
  const dummyId = new Types.ObjectId();

  // 1. SKILL TESTS
  describe('Skill Model', () => {
    it('validates a correct skill document', () => {
      const skill = new Skill({
        slug: 'typescript',
        name: 'TypeScript',
        category: 'Programming',
        description: 'Typed JavaScript for scalable applications',
        hoursPerLevel: 25,
        prerequisites: [dummyId]
      });

      const err = skill.validateSync();
      expect(err).toBeUndefined();
    });

    it('rejects negative hoursPerLevel', () => {
      const skill = new Skill({
        slug: 'python',
        name: 'Python',
        category: 'Programming',
        description: 'Interpreted language',
        hoursPerLevel: -5
      });

      const err = skill.validateSync();
      expect(err).toBeDefined();
      expect(err?.errors['hoursPerLevel']).toBeDefined();
    });

    it('rejects missing required fields in Skill', () => {
      const skill = new Skill({});
      const err = skill.validateSync();
      expect(err).toBeDefined();
      expect(err?.errors['slug']).toBeDefined();
      expect(err?.errors['name']).toBeDefined();
      expect(err?.errors['category']).toBeDefined();
      expect(err?.errors['description']).toBeDefined();
      expect(err?.errors['hoursPerLevel']).toBeDefined();
    });
  });

  // 2. CAREER TESTS
  describe('Career Model', () => {
    it('validates a correct career document', () => {
      const career = new Career({
        slug: 'frontend-engineer',
        title: 'Frontend Engineer',
        summary: 'Build user interfaces for modern web apps',
        dayInLife: 'Collaborate with designers and build web components',
        category: 'Engineering',
        interestTags: ['web', 'design'],
        requiredSkills: [
          {
            skillId: dummyId,
            requiredLevel: 4,
            importance: 3
          }
        ]
      });

      const err = career.validateSync();
      expect(err).toBeUndefined();
    });

    it('enforces requiredLevel constraints (0 to 5, integer)', () => {
      const invalidCareerLow = new Career({
        slug: 'dev',
        title: 'Dev',
        summary: 'Summary',
        dayInLife: 'Day',
        category: 'Tech',
        requiredSkills: [{ skillId: dummyId, requiredLevel: -1, importance: 2 }]
      });
      expect(invalidCareerLow.validateSync()?.errors['requiredSkills.0.requiredLevel']).toBeDefined();

      const invalidCareerHigh = new Career({
        slug: 'dev',
        title: 'Dev',
        summary: 'Summary',
        dayInLife: 'Day',
        category: 'Tech',
        requiredSkills: [{ skillId: dummyId, requiredLevel: 6, importance: 2 }]
      });
      expect(invalidCareerHigh.validateSync()?.errors['requiredSkills.0.requiredLevel']).toBeDefined();

      const invalidCareerFloat = new Career({
        slug: 'dev',
        title: 'Dev',
        summary: 'Summary',
        dayInLife: 'Day',
        category: 'Tech',
        requiredSkills: [{ skillId: dummyId, requiredLevel: 3.5, importance: 2 }]
      });
      expect(invalidCareerFloat.validateSync()?.errors['requiredSkills.0.requiredLevel']).toBeDefined();
    });

    it('enforces importance constraints (1 to 3, integer)', () => {
      const invalidImportanceZero = new Career({
        slug: 'dev',
        title: 'Dev',
        summary: 'Summary',
        dayInLife: 'Day',
        category: 'Tech',
        requiredSkills: [{ skillId: dummyId, requiredLevel: 3, importance: 0 }]
      });
      expect(invalidImportanceZero.validateSync()?.errors['requiredSkills.0.importance']).toBeDefined();

      const invalidImportanceHigh = new Career({
        slug: 'dev',
        title: 'Dev',
        summary: 'Summary',
        dayInLife: 'Day',
        category: 'Tech',
        requiredSkills: [{ skillId: dummyId, requiredLevel: 3, importance: 4 }]
      });
      expect(invalidImportanceHigh.validateSync()?.errors['requiredSkills.0.importance']).toBeDefined();
    });
  });

  // 3. STUDENT TESTS
  describe('Student Model', () => {
    it('validates a correct student document without passwords', () => {
      const student = new Student({
        email: 'student@example.edu',
        name: 'Jane Doe',
        university: 'State University',
        major: 'Computer Science',
        yearOfStudy: 2,
        hoursPerWeek: 15,
        skills: [{ skillId: dummyId, level: 3 }],
        targetCareerIds: [dummyId],
        primaryCareerId: dummyId
      });

      const err = student.validateSync();
      expect(err).toBeUndefined();
    });

    it('enforces student skill level constraints (0 to 5, integer)', () => {
      const studentInvalidSkill = new Student({
        email: 'valid@example.com',
        name: 'Bob',
        university: 'MIT',
        major: 'EE',
        yearOfStudy: 1,
        hoursPerWeek: 10,
        skills: [{ skillId: dummyId, level: 7 }]
      });

      const err = studentInvalidSkill.validateSync();
      expect(err?.errors['skills.0.level']).toBeDefined();
    });

    it('rejects invalid email formats and non-positive yearOfStudy', () => {
      const student = new Student({
        email: 'invalid-email-address',
        name: 'Bob',
        university: 'MIT',
        major: 'EE',
        yearOfStudy: 0,
        hoursPerWeek: -1
      });

      const err = student.validateSync();
      expect(err?.errors['email']).toBeDefined();
      expect(err?.errors['yearOfStudy']).toBeDefined();
      expect(err?.errors['hoursPerWeek']).toBeDefined();
    });
  });

  // 4. RESOURCE TESTS
  describe('Resource Model', () => {
    it('validates a correct resource document', () => {
      const resource = new Resource({
        slug: 'intro-to-react',
        title: 'Intro to React',
        url: 'https://react.dev/learn',
        provider: 'Meta',
        type: 'documentation',
        skillIds: [dummyId],
        level: 'beginner',
        levelGranted: 2,
        durationHours: 10,
        cost: 0
      });

      const err = resource.validateSync();
      expect(err).toBeUndefined();
    });

    it('rejects invalid resource URL formats', () => {
      const resource = new Resource({
        slug: 'bad-resource',
        title: 'Bad URL Resource',
        url: 'ftp://invalidscheme.com/file',
        provider: 'Unknown',
        type: 'course',
        level: 'beginner',
        levelGranted: 1,
        durationHours: 2
      });

      const err = resource.validateSync();
      expect(err?.errors['url']).toBeDefined();
    });

    it('rejects invalid resource type or level enum', () => {
      const resource = new Resource({
        slug: 'bad-enum',
        title: 'Bad Enum',
        url: 'https://example.com',
        provider: 'Test',
        type: 'podcast', // invalid
        level: 'expert', // invalid (only beginner/intermediate/advanced allowed)
        levelGranted: 1,
        durationHours: 2
      });

      const err = resource.validateSync();
      expect(err?.errors['type']).toBeDefined();
      expect(err?.errors['level']).toBeDefined();
    });
  });

  // 5. PROJECT TESTS
  describe('Project Model', () => {
    it('validates a correct catalog or custom project', () => {
      const project = new Project({
        slug: 'portfolio-website',
        ownerId: null,
        source: 'catalog',
        title: 'Personal Portfolio',
        description: 'Build and deploy a responsive portfolio site',
        difficulty: 'beginner',
        estimatedHours: 20,
        skillIds: [dummyId],
        careerIds: [dummyId],
        deliverables: ['Live URL', 'GitHub Repo'],
        skillLevelsGained: [{ skillId: dummyId, levelGain: 1 }]
      });

      const err = project.validateSync();
      expect(err).toBeUndefined();
    });

    it('rejects invalid difficulty enum', () => {
      const project = new Project({
        slug: 'hard-project',
        title: 'Hard Project',
        description: 'Desc',
        difficulty: 'master', // invalid
        estimatedHours: 50
      });

      const err = project.validateSync();
      expect(err?.errors['difficulty']).toBeDefined();
    });

    it('rejects invalid skill level gain constraints (0 to 5)', () => {
      const project = new Project({
        slug: 'skill-gain-project',
        title: 'Gain Project',
        description: 'Desc',
        difficulty: 'intermediate',
        estimatedHours: 15,
        skillLevelsGained: [{ skillId: dummyId, levelGain: 10 }] // invalid > 5
      });

      const err = project.validateSync();
      expect(err?.errors['skillLevelsGained.0.levelGain']).toBeDefined();
    });
  });

  // 6. OPPORTUNITY TESTS
  describe('Opportunity Model', () => {
    it('validates a correct opportunity document', () => {
      const opp = new Opportunity({
        slug: 'summer-internship-2026',
        title: 'Software Engineering Intern',
        organization: 'Acme Corp',
        type: 'internship',
        url: 'https://acme.example.com/jobs/123',
        deadline: new Date('2026-12-31'),
        location: 'San Francisco, CA',
        remote: true,
        careerIds: [dummyId],
        skillIds: [dummyId],
        minSkillLevel: 2,
        description: 'Exciting 12-week summer internship'
      });

      const err = opp.validateSync();
      expect(err).toBeUndefined();
    });

    it('rejects invalid opportunity type enum and invalid URL', () => {
      const opp = new Opportunity({
        slug: 'bad-opp',
        title: 'Bad Opp',
        organization: 'Org',
        type: 'contract', // invalid type
        url: 'not-a-valid-url',
        description: 'Desc'
      });

      const err = opp.validateSync();
      expect(err?.errors['type']).toBeDefined();
      expect(err?.errors['url']).toBeDefined();
    });
  });

  // 7. PROGRESS TESTS
  describe('Progress Model', () => {
    it('validates a correct progress document with polymorphic itemId', () => {
      const progress = new Progress({
        studentId: dummyId,
        itemType: 'resource',
        itemId: dummyId,
        status: 'in_progress',
        note: 'Completed module 1',
        startedAt: new Date(),
        levelGainApplied: false
      });

      const err = progress.validateSync();
      expect(err).toBeUndefined();
    });

    it('rejects invalid itemType enum', () => {
      const progress = new Progress({
        studentId: dummyId,
        itemType: 'course', // invalid (must be resource, project, or opportunity)
        itemId: dummyId,
        status: 'in_progress'
      });

      const err = progress.validateSync();
      expect(err?.errors['itemType']).toBeDefined();
    });

    it('rejects invalid status enum', () => {
      const progress = new Progress({
        studentId: dummyId,
        itemType: 'project',
        itemId: dummyId,
        status: 'archived' // invalid (must be not_started, in_progress, completed)
      });

      const err = progress.validateSync();
      expect(err?.errors['status']).toBeDefined();
    });

    it('rejects missing required fields (studentId, itemType, itemId)', () => {
      const progress = new Progress({});
      const err = progress.validateSync();
      expect(err?.errors['studentId']).toBeDefined();
      expect(err?.errors['itemType']).toBeDefined();
      expect(err?.errors['itemId']).toBeDefined();
    });
  });
});
