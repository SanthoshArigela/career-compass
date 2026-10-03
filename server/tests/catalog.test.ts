import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../src/app';
import { Career, Skill, Resource, Project, Opportunity, Progress, Student } from '../src/models';
import { studentService } from '../src/services/studentService';
import { careerIntelligenceService } from '../src/services/careerIntelligenceService';

describe('BE-08: Career Discovery & Catalog API', () => {
  const validCareerId = '507f1f77bcf86cd799439011';
  const validSkillId1 = '507f1f77bcf86cd799439021';
  const validSkillId2 = '507f1f77bcf86cd799439022';
  const validResourceId = '507f1f77bcf86cd799439031';
  const validProjectId = '507f1f77bcf86cd799439041';
  const validOpportunityId1 = '507f1f77bcf86cd799439051';
  const validOpportunityId2 = '507f1f77bcf86cd799439052';
  const validStudentId = '507f1f77bcf86cd799439061';

  const mockCareer = {
    _id: new Types.ObjectId(validCareerId),
    slug: 'ai-engineer',
    title: 'AI Engineer',
    summary: 'Design and deploy state-of-the-art machine learning models.',
    dayInLife: 'Coding in Python, fine-tuning neural networks.',
    category: 'Artificial Intelligence',
    interestTags: ['AI', 'Machine Learning', 'Data Science'],
    requiredSkills: [
      {
        skillId: new Types.ObjectId(validSkillId1),
        requiredLevel: 4,
        importance: 3
      },
      {
        skillId: new Types.ObjectId(validSkillId2),
        requiredLevel: 3,
        importance: 2
      }
    ],
    entryRoutes: ['Computer Science degree', 'Self-taught ML projects']
  };

  const mockSkill1 = {
    _id: new Types.ObjectId(validSkillId1),
    slug: 'python',
    name: 'Python',
    category: 'Programming Languages',
    description: 'High-level interpreted programming language.',
    prerequisites: [],
    hoursPerLevel: 20
  };

  const mockSkill2 = {
    _id: new Types.ObjectId(validSkillId2),
    slug: 'machine-learning',
    name: 'Machine Learning',
    category: 'Artificial Intelligence',
    description: 'Statistical algorithms and neural models.',
    prerequisites: [new Types.ObjectId(validSkillId1)],
    hoursPerLevel: 35
  };

  const mockResource = {
    _id: new Types.ObjectId(validResourceId),
    slug: 'python-official-tutorial',
    title: 'The Python Tutorial',
    description: 'Official Python documentation tutorial.',
    provider: 'Python Software Foundation',
    type: 'documentation',
    level: 'beginner',
    levelGranted: 2,
    durationHours: 15,
    url: 'https://docs.python.org/3/tutorial/',
    skillIds: [new Types.ObjectId(validSkillId1)]
  };

  const mockProject = {
    _id: new Types.ObjectId(validProjectId),
    slug: 'ai-summarizer',
    title: 'AI Text Summarizer',
    description: 'Build an API that summarizes articles using transformers.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    skillIds: [new Types.ObjectId(validSkillId1), new Types.ObjectId(validSkillId2)],
    careerIds: [new Types.ObjectId(validCareerId)],
    deliverables: ['GitHub repository', 'Deployed FastAPI app']
  };

  const mockOpportunityNullDeadline = {
    _id: new Types.ObjectId(validOpportunityId1),
    slug: 'google-summer-of-code',
    title: 'Google Summer of Code',
    description: 'Global program bringing new contributors into open source.',
    type: 'internship',
    organization: 'Google',
    url: 'https://summerofcode.withgoogle.com/',
    deadline: null,
    careerIds: [new Types.ObjectId(validCareerId)],
    skillIds: [new Types.ObjectId(validSkillId1)],
    minSkillLevel: 2
  };

  const mockOpportunityWithDeadline = {
    _id: new Types.ObjectId(validOpportunityId2),
    slug: 'hackmit',
    title: 'HackMIT',
    description: 'Undergraduate student hackathon held annually at MIT.',
    type: 'hackathon',
    organization: 'TechX at MIT',
    url: 'https://hackmit.org/',
    deadline: new Date('2026-11-15T00:00:00.000Z'),
    careerIds: [new Types.ObjectId(validCareerId)],
    skillIds: [new Types.ObjectId(validSkillId1)],
    minSkillLevel: 1
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // 1. Careers Endpoints
  // ==========================================

  it('1. GET /api/careers -> 200 with list of career cards', async () => {
    vi.spyOn(Career, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockCareer])
      })
    } as any);

    const res = await request(app).get('/api/careers');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('careers');
    expect(res.body.data.careers).toHaveLength(1);

    const card = res.body.data.careers[0];
    expect(card).toEqual({
      id: validCareerId,
      slug: 'ai-engineer',
      title: 'AI Engineer',
      summary: mockCareer.summary,
      category: 'Artificial Intelligence',
      interestTags: ['AI', 'Machine Learning', 'Data Science'],
      requiredSkillCount: 2
    });
  });

  it('2. GET /api/careers?search=engineer -> 200 with filtered careers', async () => {
    const findSpy = vi.spyOn(Career, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockCareer])
      })
    } as any);

    const res = await request(app).get('/api/careers?search=engineer');

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.any(Array)
      })
    );
  });

  it('3. GET /api/careers?category=Artificial%20Intelligence -> 200 with category filter', async () => {
    const findSpy = vi.spyOn(Career, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockCareer])
      })
    } as any);

    const res = await request(app).get('/api/careers?category=Artificial%20Intelligence');

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        category: expect.any(Object)
      })
    );
  });

  it('4. GET /api/careers/:id -> 200 with complete detail and resolved skills', async () => {
    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockCareer)
    } as any);

    vi.spyOn(Skill, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          { _id: new Types.ObjectId(validSkillId1), name: 'Python' },
          { _id: new Types.ObjectId(validSkillId2), name: 'Machine Learning' }
        ])
      })
    } as any);

    const res = await request(app).get(`/api/careers/${validCareerId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.career).toEqual({
      id: validCareerId,
      slug: 'ai-engineer',
      title: 'AI Engineer',
      summary: mockCareer.summary,
      category: 'Artificial Intelligence',
      interestTags: ['AI', 'Machine Learning', 'Data Science'],
      requiredSkills: [
        {
          skillId: validSkillId1,
          name: 'Python',
          requiredLevel: 4,
          importance: 3
        },
        {
          skillId: validSkillId2,
          name: 'Machine Learning',
          requiredLevel: 3,
          importance: 2
        }
      ]
    });
  });

  it('5. GET /api/careers/:id with nonexistent ID -> 404 CAREER_NOT_FOUND', async () => {
    vi.spyOn(Career, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app).get(`/api/careers/${validCareerId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'CAREER_NOT_FOUND',
      message: 'Career not found.'
    });
  });

  it('6. GET /api/careers/invalid-id -> 400 INVALID_ID', async () => {
    const res = await request(app).get('/api/careers/invalid-career-id');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_ID',
      message: 'Invalid career identifier.'
    });
  });

  // ==========================================
  // 2. Skills Endpoints
  // ==========================================

  it('7. GET /api/skills -> 200 with skill catalog list', async () => {
    vi.spyOn(Skill, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockSkill1, mockSkill2])
      })
    } as any);

    const res = await request(app).get('/api/skills');

    expect(res.status).toBe(200);
    expect(res.body.data.skills).toHaveLength(2);
    expect(res.body.data.skills[0]).toEqual({
      id: validSkillId1,
      slug: 'python',
      name: 'Python',
      category: 'Programming Languages',
      description: mockSkill1.description,
      hoursPerLevel: 20,
      prerequisites: []
    });
    expect(res.body.data.skills[1].prerequisites).toEqual([validSkillId1]);
  });

  it('8. GET /api/skills?search=python -> 200 with filtered skills', async () => {
    const findSpy = vi.spyOn(Skill, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockSkill1])
      })
    } as any);

    const res = await request(app).get('/api/skills?search=python');

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.any(Array)
      })
    );
  });

  // ==========================================
  // 3. Resources Endpoints
  // ==========================================

  it('9. GET /api/resources -> 200 with resource listing', async () => {
    vi.spyOn(Resource, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockResource])
      })
    } as any);

    const res = await request(app).get('/api/resources');

    expect(res.status).toBe(200);
    expect(res.body.data.resources).toHaveLength(1);
    expect(res.body.data.resources[0]).toEqual({
      id: validResourceId,
      slug: 'python-official-tutorial',
      title: 'The Python Tutorial',
      description: 'Official Python documentation tutorial.',
      type: 'documentation',
      level: 'beginner',
      durationHours: 15,
      url: 'https://docs.python.org/3/tutorial/',
      skillIds: [validSkillId1]
    });
  });

  it('10. GET /api/resources?skillId=...&level=beginner&type=documentation -> 200 with filters', async () => {
    const findSpy = vi.spyOn(Resource, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockResource])
      })
    } as any);

    const res = await request(app).get(
      `/api/resources?skillId=${validSkillId1}&level=beginner&type=documentation`
    );

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        skillIds: new Types.ObjectId(validSkillId1),
        level: 'beginner',
        type: 'documentation'
      })
    );
  });

  it('11. GET /api/resources?skillId=invalid-id -> 400 INVALID_ID', async () => {
    const res = await request(app).get('/api/resources?skillId=bad-id');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_ID',
      message: 'Invalid skill identifier.'
    });
  });

  it('12. GET /api/resources?level=master -> 400 VALIDATION_ERROR', async () => {
    const res = await request(app).get('/api/resources?level=master');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('Invalid resource level');
  });

  it('13. GET /api/resources?type=podcast -> 400 VALIDATION_ERROR', async () => {
    const res = await request(app).get('/api/resources?type=podcast');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('Invalid resource type');
  });

  // ==========================================
  // 4. Projects Endpoints
  // ==========================================

  it('14. GET /api/projects -> 200 with project listing', async () => {
    vi.spyOn(Project, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockProject])
      })
    } as any);

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body.data.projects).toHaveLength(1);
    expect(res.body.data.projects[0]).toEqual({
      id: validProjectId,
      slug: 'ai-summarizer',
      title: 'AI Text Summarizer',
      description: 'Build an API that summarizes articles using transformers.',
      difficulty: 'intermediate',
      estimatedHours: 25,
      skillIds: [validSkillId1, validSkillId2],
      careerIds: [validCareerId],
      deliverables: ['GitHub repository', 'Deployed FastAPI app']
    });
  });

  it('15. GET /api/projects?careerId=...&skillId=...&difficulty=intermediate -> 200 with filters', async () => {
    const findSpy = vi.spyOn(Project, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockProject])
      })
    } as any);

    const res = await request(app).get(
      `/api/projects?careerId=${validCareerId}&skillId=${validSkillId1}&difficulty=intermediate`
    );

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        careerIds: new Types.ObjectId(validCareerId),
        skillIds: new Types.ObjectId(validSkillId1),
        difficulty: 'intermediate'
      })
    );
  });

  it('16. GET /api/projects?careerId=invalid-id -> 400 INVALID_ID', async () => {
    const res = await request(app).get('/api/projects?careerId=not-valid');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_ID',
      message: 'Invalid career identifier.'
    });
  });

  it('17. GET /api/projects?difficulty=legendary -> 400 VALIDATION_ERROR', async () => {
    const res = await request(app).get('/api/projects?difficulty=legendary');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('Invalid project difficulty');
  });

  // ==========================================
  // 5. Opportunities Endpoints
  // ==========================================

  it('18. GET /api/opportunities -> 200 with opportunity listing', async () => {
    vi.spyOn(Opportunity, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockOpportunityNullDeadline, mockOpportunityWithDeadline])
      })
    } as any);

    const res = await request(app).get('/api/opportunities');

    expect(res.status).toBe(200);
    expect(res.body.data.opportunities).toHaveLength(2);
  });

  it('19. GET /api/opportunities preserves null deadlines strictly', async () => {
    vi.spyOn(Opportunity, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockOpportunityNullDeadline])
      })
    } as any);

    const res = await request(app).get('/api/opportunities');

    expect(res.status).toBe(200);
    expect(res.body.data.opportunities[0].deadline).toBeNull();
    expect(res.body.data.opportunities[0].organization).toBe('Google');
  });

  it('20. GET /api/opportunities formats non-null deadline accurately', async () => {
    vi.spyOn(Opportunity, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockOpportunityWithDeadline])
      })
    } as any);

    const res = await request(app).get('/api/opportunities');

    expect(res.status).toBe(200);
    expect(res.body.data.opportunities[0].deadline).toBe('2026-11-15T00:00:00.000Z');
  });

  it('21. GET /api/opportunities?careerId=...&type=internship -> 200 with filters', async () => {
    const findSpy = vi.spyOn(Opportunity, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([mockOpportunityNullDeadline])
      })
    } as any);

    const res = await request(app).get(
      `/api/opportunities?careerId=${validCareerId}&type=internship`
    );

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        careerIds: new Types.ObjectId(validCareerId),
        type: 'internship'
      })
    );
  });

  it('22. GET /api/opportunities?careerId=bad-id -> 400 INVALID_ID', async () => {
    const res = await request(app).get('/api/opportunities?careerId=bad-id');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_ID',
      message: 'Invalid career identifier.'
    });
  });

  it('23. GET /api/opportunities?type=unknown_type -> 400 VALIDATION_ERROR', async () => {
    const res = await request(app).get('/api/opportunities?type=unknown_type');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('Invalid opportunity type');
  });

  // ==========================================
  // 6. Regression Verifications (BE-01 to BE-07)
  // ==========================================

  it('24. Existing Student API remains operational', async () => {
    vi.spyOn(studentService, 'getStudentById').mockResolvedValue({
      id: validStudentId,
      name: 'Santhosh',
      email: 'santhosh@example.com'
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.student.id).toBe(validStudentId);
  });

  it('25. Existing Career Intelligence API remains operational', async () => {
    vi.spyOn(careerIntelligenceService, 'getStudentCareerIntelligence').mockResolvedValue({
      student: { id: validStudentId, name: 'Santhosh' } as any,
      career: { id: validCareerId, title: 'AI Engineer' } as any,
      alignment: { score: 90, level: 'strong' } as any,
      skillGaps: [],
      roadmap: [],
      nextBestAction: null
    });

    const res = await request(app).get(`/api/students/${validStudentId}/career-intelligence`);

    expect(res.status).toBe(200);
    expect(res.body.data.career.title).toBe('AI Engineer');
  });

  it('26. Existing Progress API remains operational', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(validStudentId) })
    } as any);

    vi.spyOn(Progress, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/progress`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('progress');
    expect(res.body.data).toHaveProperty('summary');
  });

  it('27. Health endpoint remains operational', async () => {
    const res = await request(app).get('/api/health');

    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('status');
  });
});
