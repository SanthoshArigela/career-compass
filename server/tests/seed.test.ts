import { describe, it, expect } from 'vitest';
import { skillsData } from '../src/seed/data/skills';
import { careersData } from '../src/seed/data/careers';
import { resourcesData } from '../src/seed/data/resources';
import { projectsData } from '../src/seed/data/projects';
import { opportunitiesData } from '../src/seed/data/opportunities';
import { verifyStaticSeedData } from '../src/seed/verify';

describe('BE-03: Seed Dataset Integrity & Quality', () => {
  it('passes static seed verification with zero issues', () => {
    const issues = verifyStaticSeedData();
    expect(issues).toEqual([]);
  });

  describe('Dataset Sizes', () => {
    it('contains exactly 6 careers', () => {
      expect(careersData.length).toBe(6);
    });

    it('contains between 30 and 35 skills', () => {
      expect(skillsData.length).toBeGreaterThanOrEqual(30);
      expect(skillsData.length).toBeLessThanOrEqual(35);
    });

    it('contains between 15 and 20 resources', () => {
      expect(resourcesData.length).toBeGreaterThanOrEqual(15);
      expect(resourcesData.length).toBeLessThanOrEqual(20);
    });

    it('contains 10 projects', () => {
      expect(projectsData.length).toBe(10);
    });

    it('contains between 6 and 10 opportunities', () => {
      expect(opportunitiesData.length).toBeGreaterThanOrEqual(6);
      expect(opportunitiesData.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Careers Specification', () => {
    const requiredCareers = [
      'ai-engineer',
      'backend-engineer',
      'data-scientist',
      'data-engineer',
      'cloud-engineer',
      'cybersecurity-engineer'
    ];

    it('contains all 6 specified careers with unique slugs', () => {
      const slugs = careersData.map((c) => c.slug);
      for (const expected of requiredCareers) {
        expect(slugs).toContain(expected);
      }
    });

    it('every career has between 8 and 12 required skills with valid levels and importances', () => {
      for (const career of careersData) {
        expect(career.requiredSkills.length).toBeGreaterThanOrEqual(8);
        expect(career.requiredSkills.length).toBeLessThanOrEqual(12);

        for (const req of career.requiredSkills) {
          expect(req.requiredLevel).toBeGreaterThanOrEqual(0);
          expect(req.requiredLevel).toBeLessThanOrEqual(5);
          expect([1, 2, 3]).toContain(req.importance);
        }
      }
    });
  });

  describe('Resources Specification', () => {
    it('every resource uses a valid HTTP or HTTPS URL', () => {
      for (const res of resourcesData) {
        expect(res.url).toMatch(/^https?:\/\//);
      }
    });

    it('every resource grants a valid skill level between 0 and 5', () => {
      for (const res of resourcesData) {
        expect(res.levelGranted).toBeGreaterThanOrEqual(0);
        expect(res.levelGranted).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('Projects Specification', () => {
    it('projects include beginner, intermediate, and advanced tiers', () => {
      const difficulties = new Set(projectsData.map((p) => p.difficulty));
      expect(difficulties.has('beginner')).toBe(true);
      expect(difficulties.has('intermediate')).toBe(true);
      expect(difficulties.has('advanced')).toBe(true);
    });

    it('every project has non-empty deliverables and realistic estimated hours', () => {
      for (const proj of projectsData) {
        expect(proj.deliverables.length).toBeGreaterThan(0);
        expect(proj.estimatedHours).toBeGreaterThan(0);
      }
    });
  });

  describe('Opportunities Specification', () => {
    it('every opportunity has a legitimate URL and valid minSkillLevel', () => {
      for (const opp of opportunitiesData) {
        expect(opp.url).toMatch(/^https?:\/\//);
        expect(opp.minSkillLevel).toBeGreaterThanOrEqual(0);
        expect(opp.minSkillLevel).toBeLessThanOrEqual(5);
      }
    });

    it('sets unverified opportunity deadlines to null to avoid presenting invented dates', () => {
      for (const opp of opportunitiesData) {
        expect(opp.deadline).toBeNull();
      }
    });
  });

  describe('Verification Utility Detection Power', () => {
    it('flags broken references in corrupted data', () => {
      const corruptedCareers = [
        {
          ...careersData[0],
          requiredSkills: [
            { skillSlug: 'non-existent-skill-slug-123', requiredLevel: 4, importance: 3 }
          ]
        }
      ];

      const issues = verifyStaticSeedData(skillsData, corruptedCareers, resourcesData, projectsData, opportunitiesData);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => i.message.includes('non-existent-skill-slug-123'))).toBe(true);
    });

    it('flags invalid HTTP/HTTPS URLs', () => {
      const corruptedResources = [
        {
          ...resourcesData[0],
          url: 'ftp://bad-url.com'
        }
      ];

      const issues = verifyStaticSeedData(skillsData, careersData, corruptedResources, projectsData, opportunitiesData);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => i.message.includes('not valid HTTP/HTTPS'))).toBe(true);
    });
  });
});
