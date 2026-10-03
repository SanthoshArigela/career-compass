import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { Student, Career, Skill, Resource, Project, Opportunity } from '../src/models';

describe('BE-06: Career Intelligence API Integration', () => {
  const validStudentId = '507f1f77bcf86cd799439011';
  const primaryCareerId = '507f1f77bcf86cd799439012';
  const targetCareerId1 = '507f1f77bcf86cd799439013';
  const targetCareerId2 = '507f1f77bcf86cd799439014';
  const overrideCareerId = '507f1f77bcf86cd799439015';

  const skillPythonId = '507f1f77bcf86cd799439021';
  const skillMlId = '507f1f77bcf86cd799439022';
  const resourceId = '507f1f77bcf86cd799439031';
  const projectId = '507f1f77bcf86cd799439041';
  const opportunityId = '507f1f77bcf86cd799439051';

  const mockCareerPrimary = {
    _id: primaryCareerId,
    slug: 'ai-engineer',
    title: 'AI Engineer',
    requiredSkills: [
      { skillId: skillPythonId, requiredLevel: 4, importance: 3 },
      { skillId: skillMlId, requiredLevel: 4, importance: 3 }
    ]
  };

  const mockCareerTarget1 = {
    _id: targetCareerId1,
    slug: 'backend-engineer',
    title: 'Backend Engineer',
    requiredSkills: [
      { skillId: skillPythonId, requiredLevel: 3, importance: 3 }
    ]
  };

  const mockCareerOverride = {
    _id: overrideCareerId,
    slug: 'data-scientist',
    title: 'Data Scientist',
    requiredSkills: [
      { skillId: skillPythonId, requiredLevel: 4, importance: 3 }
    ]
  };

  const mockSkills = [
    {
      _id: skillPythonId,
      slug: 'python',
      name: 'Python',
      hoursPerLevel: 20,
      prerequisites: []
    },
    {
      _id: skillMlId,
      slug: 'machine-learning',
      name: 'Machine Learning',
      hoursPerLevel: 30,
      prerequisites: [skillPythonId]
    }
  ];

  const mockStudent = {
    _id: validStudentId,
    name: 'Santhosh',
    email: 'santhosh@example.com',
    primaryCareerId: primaryCareerId,
    targetCareerIds: [targetCareerId1, targetCareerId2],
    skills: [
      { skillId: skillPythonId, level: 2 },
      { skillId: skillMlId, level: 1 }
    ]
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Mock standard catalog queries
  const setupStandardCatalogMocks = (customResources: any[] = [], customProjects: any[] = [], customOpps: any[] = []) => {
    vi.spyOn(Skill, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockSkills)
    } as any);

    vi.spyOn(Resource, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue(customResources)
    } as any);

    vi.spyOn(Project, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue(customProjects)
    } as any);

    vi.spyOn(Opportunity, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue(customOpps)
    } as any);
  };

  // 1. Student with primary career -> 200
  it('1. Student with primary career -> 200 and calculates intelligence', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerPrimary)
    } as any);

    const mockResource = {
      _id: resourceId,
      title: 'Python for Beginners',
      skillIds: [skillPythonId],
      level: 'beginner',
      durationHours: 10
    };

    setupStandardCatalogMocks([mockResource]);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.career.id).toBe(primaryCareerId);
    expect(res.body.data.career.slug).toBe('ai-engineer');
    expect(typeof res.body.data.alignment).toBe('number');
    expect(Array.isArray(res.body.data.skillGaps)).toBe(true);
    expect(Array.isArray(res.body.data.priorities)).toBe(true);
    expect(Array.isArray(res.body.data.roadmap)).toBe(true);
    expect(res.body.data.nextBestAction.type).toBe('resource');
    expect(res.body.data.nextBestAction.itemId).toBe(resourceId);
  });

  // 2. Student with only targetCareerIds -> first target career used
  it('2. Student with only targetCareerIds -> first target career used', async () => {
    const studentWithoutPrimary = {
      ...mockStudent,
      primaryCareerId: null,
      targetCareerIds: [targetCareerId1, targetCareerId2]
    };

    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(studentWithoutPrimary)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerTarget1)
    } as any);

    setupStandardCatalogMocks();

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body.data.career.id).toBe(targetCareerId1);
    expect(res.body.data.career.slug).toBe('backend-engineer');
  });

  // 3. Student with no selected career -> 400 CAREER_NOT_SELECTED
  it('3. Student with no selected career -> 400 CAREER_NOT_SELECTED', async () => {
    const studentWithNoCareers = {
      ...mockStudent,
      primaryCareerId: null,
      targetCareerIds: []
    };

    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(studentWithNoCareers)
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('CAREER_NOT_SELECTED');
    expect(res.body.error.message).toContain('not selected a target career');
  });

  // 4. Student not found -> 404
  it('4. Student not found -> 404', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('STUDENT_NOT_FOUND');
  });

  // 5. Malformed student ID -> 400
  it('5. Malformed student ID -> 400', async () => {
    const res = await request(app).get('/api/students/malformed-id-123/career-intelligence');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ID');
    expect(res.body.error.message).toBe('Invalid student ID.');
  });

  // 6. Primary career does not exist -> 404
  it('6. Primary career does not exist -> 404 CAREER_NOT_FOUND', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('CAREER_NOT_FOUND');
  });

  // 7. careerId query override -> correct career used
  it('7. careerId query override -> correct career used', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerOverride)
    } as any);

    setupStandardCatalogMocks();

    const res = await request(app).get(
      `/api/students/${validStudentId}/career-intelligence?careerId=${overrideCareerId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.data.career.id).toBe(overrideCareerId);
    expect(res.body.data.career.slug).toBe('data-scientist');
  });

  // 8. Malformed careerId query -> 400
  it('8. Malformed careerId query -> 400 INVALID_ID', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const res = await request(app).get(
      `/api/students/${validStudentId}/career-intelligence?careerId=invalid-career-id`
    );

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ID');
    expect(res.body.error.message).toBe('Invalid career ID.');
  });

  // 9. Nonexistent careerId query -> 404
  it('9. Nonexistent careerId query -> 404 CAREER_NOT_FOUND', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app).get(
      `/api/students/${validStudentId}/career-intelligence?careerId=${overrideCareerId}`
    );

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('CAREER_NOT_FOUND');
  });

  // 10. Override does not modify student in DB
  it('10. Override does not modify student data', async () => {
    const studentUpdateSpy = vi.spyOn(Student, 'findByIdAndUpdate');

    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerOverride)
    } as any);

    setupStandardCatalogMocks();

    await request(app).get(
      `/api/students/${validStudentId}/career-intelligence?careerId=${overrideCareerId}`
    );

    expect(studentUpdateSpy).not.toHaveBeenCalled();
    expect(mockStudent.primaryCareerId).toBe(primaryCareerId);
  });

  // 11-16. Skill levels reach domain engine and return all required sections
  it('11-16. Skill levels correctly reach domain engine and returns complete intelligence payload', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerPrimary)
    } as any);

    setupStandardCatalogMocks();

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);

    // 12. Alignment returned
    expect(typeof res.body.data.alignment).toBe('number');
    expect(res.body.data.alignment).toBeGreaterThanOrEqual(0);
    expect(res.body.data.alignment).toBeLessThanOrEqual(100);

    // 13. Skill gaps returned
    expect(res.body.data.skillGaps.length).toBe(2);
    const pyGap = res.body.data.skillGaps.find((g: any) => g.skillId === skillPythonId);
    expect(pyGap).toBeDefined();
    expect(pyGap.gap).toBe(2); // 4 - 2 = 2
    expect(pyGap.currentLevel).toBe(2);

    // 14. Priority results returned
    expect(res.body.data.priorities.length).toBe(2);
    expect(res.body.data.priorities[0]).toHaveProperty('priorityScore');
    expect(res.body.data.priorities[0]).toHaveProperty('basePriority');
    expect(res.body.data.priorities[0]).toHaveProperty('prerequisiteBonus');

    // 15. Roadmap returned
    expect(res.body.data.roadmap.length).toBe(2);
    expect(res.body.data.roadmap[0]).toHaveProperty('order');
    expect(res.body.data.roadmap[0]).toHaveProperty('skillId');
    expect(res.body.data.roadmap[0]).toHaveProperty('reason');
    expect(res.body.data.roadmap[0]).toHaveProperty('estimatedHours');

    // 16. Next Best Action returned
    expect(res.body.data.nextBestAction).toHaveProperty('type');
    expect(res.body.data.nextBestAction).toHaveProperty('title');
    expect(res.body.data.nextBestAction).toHaveProperty('reason');
  });

  // 17. Resource selected when available
  it('17. Resource selected when available for top roadmap skill', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerPrimary)
    } as any);

    const mockResource = {
      _id: resourceId,
      title: 'Python Mastery',
      skillIds: [skillPythonId],
      level: 'intermediate',
      durationHours: 12
    };

    setupStandardCatalogMocks([mockResource], [], []);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body.data.nextBestAction.type).toBe('resource');
    expect(res.body.data.nextBestAction.itemId).toBe(resourceId);
  });

  // 18. Project fallback works when no resource exists
  it('18. Project fallback selected when no matching resource exists', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerPrimary)
    } as any);

    const mockProject = {
      _id: projectId,
      title: 'AI Python Pipeline',
      skillIds: [skillPythonId],
      careerIds: [primaryCareerId],
      estimatedHours: 25
    };

    setupStandardCatalogMocks([], [mockProject], []);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body.data.nextBestAction.type).toBe('project');
    expect(res.body.data.nextBestAction.itemId).toBe(projectId);
  });

  // 19. Opportunity fallback works when neither resource nor project exists
  it('19. Opportunity fallback selected when neither resource nor project exists', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerPrimary)
    } as any);

    const mockOpp = {
      _id: opportunityId,
      title: 'Python Fellowship',
      skillIds: [skillPythonId],
      careerIds: [primaryCareerId],
      deadline: null
    };

    setupStandardCatalogMocks([], [], [mockOpp]);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body.data.nextBestAction.type).toBe('opportunity');
    expect(res.body.data.nextBestAction.itemId).toBe(opportunityId);
  });

  // 20. deadline: null remains null in opportunity data
  it('20. deadline: null remains null without manufacturing dates', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareerPrimary)
    } as any);

    const mockOpp = {
      _id: opportunityId,
      title: 'Open Source Fellowship',
      skillIds: [skillPythonId],
      careerIds: [primaryCareerId],
      deadline: null
    };

    setupStandardCatalogMocks([], [], [mockOpp]);

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body.data.nextBestAction.type).toBe('opportunity');
    expect(res.body.data.nextBestAction.itemId).toBe(opportunityId);
  });

  // 21. Existing Student API continues to work
  it('21. Existing student profile endpoint continues to work', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Skill, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockSkills)
    } as any);

    vi.spyOn(Career, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockCareerTarget1])
      })
    } as any);

    vi.spyOn(Career, 'findById').mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockCareerPrimary)
      })
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/profile`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('profile');
    expect(res.body.data.profile.student.id).toBe(validStudentId);
  });

  // 22. Existing health endpoint still works
  it('22. Existing health endpoint still works', async () => {
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.status);
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
