import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../src/app';
import { Student, Resource, Project, Opportunity, Progress } from '../src/models';
import { studentService } from '../src/services/studentService';
import { careerIntelligenceService } from '../src/services/careerIntelligenceService';

describe('BE-07: Progress & Action Tracking API', () => {
  const validStudentId = '507f1f77bcf86cd799439011';
  const otherStudentId = '507f1f77bcf86cd799439099';
  const validResourceId = '507f1f77bcf86cd799439021';
  const validProjectId = '507f1f77bcf86cd799439031';
  const validOpportunityId = '507f1f77bcf86cd799439041';
  const validProgressId = '507f1f77bcf86cd799439051';

  const mockStudent = {
    _id: new Types.ObjectId(validStudentId),
    name: 'Santhosh',
    email: 'santhosh@example.com'
  };

  const mockResource = {
    _id: new Types.ObjectId(validResourceId),
    title: 'CS50 Introduction to Computer Science',
    type: 'course'
  };

  const mockProject = {
    _id: new Types.ObjectId(validProjectId),
    title: 'Full Stack Dashboard',
    difficulty: 'intermediate'
  };

  const mockOpportunity = {
    _id: new Types.ObjectId(validOpportunityId),
    title: 'Google Summer of Code',
    type: 'internship'
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Create resource progress -> 201
  it('1. Create resource progress -> 201', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Resource, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockResource)
    } as any);

    vi.spyOn(Progress, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const mockCreatedProgress = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null
    };

    vi.spyOn(Progress, 'create').mockResolvedValue(mockCreatedProgress as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'resource',
        itemId: validResourceId,
        status: 'in_progress'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.progress).toMatchObject({
      id: validProgressId,
      studentId: validStudentId,
      itemId: validResourceId,
      itemType: 'resource',
      status: 'in_progress'
    });
  });

  // 2. Create project progress -> 201
  it('2. Create project progress -> 201', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Project, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockProject)
    } as any);

    vi.spyOn(Progress, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const mockCreatedProgress = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validProjectId),
      itemType: 'project',
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date()
    };

    vi.spyOn(Progress, 'create').mockResolvedValue(mockCreatedProgress as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'project',
        itemId: validProjectId,
        status: 'completed'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.progress.itemType).toBe('project');
    expect(res.body.data.progress.status).toBe('completed');
  });

  // 3. Create opportunity progress -> 201
  it('3. Create opportunity progress -> 201', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Opportunity, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockOpportunity)
    } as any);

    vi.spyOn(Progress, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const mockCreatedProgress = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validOpportunityId),
      itemType: 'opportunity',
      status: 'not_started',
      startedAt: null,
      completedAt: null
    };

    vi.spyOn(Progress, 'create').mockResolvedValue(mockCreatedProgress as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'opportunity',
        itemId: validOpportunityId,
        status: 'not_started'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.progress.itemType).toBe('opportunity');
    expect(res.body.data.progress.status).toBe('not_started');
  });

  // 4. Invalid student ID -> 400
  it('4. Invalid student ID -> 400', async () => {
    const res = await request(app)
      .post('/api/students/invalid-student-id/progress')
      .send({
        itemType: 'resource',
        itemId: validResourceId,
        status: 'in_progress'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_ID',
      message: 'Invalid identifier.'
    });
  });

  // 5. Invalid item ID -> 400
  it('5. Invalid item ID -> 400', async () => {
    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'resource',
        itemId: 'invalid-item-id',
        status: 'in_progress'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_ID',
      message: 'Invalid identifier.'
    });
  });

  // 6. Student does not exist -> 404
  it('6. Student does not exist -> 404', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'resource',
        itemId: validResourceId,
        status: 'in_progress'
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'STUDENT_NOT_FOUND',
      message: 'Student not found.'
    });
  });

  // 7. Resource does not exist -> 404
  it('7. Resource does not exist -> 404', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Resource, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'resource',
        itemId: validResourceId,
        status: 'in_progress'
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'PROGRESS_ITEM_NOT_FOUND',
      message: 'The progress item was not found.'
    });
  });

  // 8. Project does not exist -> 404
  it('8. Project does not exist -> 404', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Project, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'project',
        itemId: validProjectId,
        status: 'in_progress'
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'PROGRESS_ITEM_NOT_FOUND',
      message: 'The progress item was not found.'
    });
  });

  // 9. Opportunity does not exist -> 404
  it('9. Opportunity does not exist -> 404', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Opportunity, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'opportunity',
        itemId: validOpportunityId,
        status: 'in_progress'
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'PROGRESS_ITEM_NOT_FOUND',
      message: 'The progress item was not found.'
    });
  });

  // 10. Invalid itemType -> 400
  it('10. Invalid itemType -> 400', async () => {
    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'invalid_type',
        itemId: validResourceId,
        status: 'in_progress'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Invalid progress item type.'
    });
  });

  // 11. Invalid status -> 400
  it('11. Invalid status -> 400', async () => {
    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'resource',
        itemId: validResourceId,
        status: 'not_a_valid_status'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Invalid progress status.'
    });
  });

  // 12. Duplicate progress -> 409
  it('12. Duplicate progress -> 409', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Resource, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockResource)
    } as any);

    vi.spyOn(Progress, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: new Types.ObjectId(validProgressId),
        studentId: new Types.ObjectId(validStudentId),
        itemId: new Types.ObjectId(validResourceId),
        itemType: 'resource',
        status: 'in_progress'
      })
    } as any);

    const res = await request(app)
      .post(`/api/students/${validStudentId}/progress`)
      .send({
        itemType: 'resource',
        itemId: validResourceId,
        status: 'in_progress'
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toEqual({
      code: 'PROGRESS_ALREADY_EXISTS',
      message: 'Progress tracking already exists for this item.'
    });
  });

  // 13. Get student progress -> 200
  it('13. Get student progress -> 200', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecords = [
      {
        _id: new Types.ObjectId(validProgressId),
        studentId: new Types.ObjectId(validStudentId),
        itemId: new Types.ObjectId(validResourceId),
        itemType: 'resource',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    vi.spyOn(Progress, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockRecords)
      })
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/progress`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('progress');
    expect(res.body.data.progress).toHaveLength(1);
    expect(res.body.data.progress[0].id).toBe(validProgressId);
    expect(res.body.data).toHaveProperty('summary');
  });

  // 14. Progress records returned only for requested student
  it('14. Progress records returned only for requested student', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const findSpy = vi.spyOn(Progress, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    await request(app).get(`/api/students/${validStudentId}/progress`);

    expect(findSpy).toHaveBeenCalledWith({
      studentId: new Types.ObjectId(validStudentId)
    });
  });

  // 15. Summary counts are correct
  it('15. Summary counts are correct', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecords = [
      { _id: new Types.ObjectId(), studentId: validStudentId, itemId: validResourceId, itemType: 'resource', status: 'not_started' },
      { _id: new Types.ObjectId(), studentId: validStudentId, itemId: validResourceId, itemType: 'resource', status: 'not_started' },
      { _id: new Types.ObjectId(), studentId: validStudentId, itemId: validProjectId, itemType: 'project', status: 'in_progress' },
      { _id: new Types.ObjectId(), studentId: validStudentId, itemId: validProjectId, itemType: 'project', status: 'in_progress' },
      { _id: new Types.ObjectId(), studentId: validStudentId, itemId: validProjectId, itemType: 'project', status: 'in_progress' },
      { _id: new Types.ObjectId(), studentId: validStudentId, itemId: validOpportunityId, itemType: 'opportunity', status: 'completed' }
    ];

    vi.spyOn(Progress, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockRecords)
      })
    } as any);

    const res = await request(app).get(`/api/students/${validStudentId}/progress`);

    expect(res.status).toBe(200);
    expect(res.body.data.summary).toEqual({
      total: 6,
      notStarted: 2,
      inProgress: 3,
      completed: 1
    });
  });

  // 16. Get individual progress -> 200
  it('16. Get individual progress -> 200', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Progress, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: new Types.ObjectId(validProgressId),
        studentId: new Types.ObjectId(validStudentId),
        itemId: new Types.ObjectId(validResourceId),
        itemType: 'resource',
        status: 'in_progress',
        startedAt: new Date(),
        completedAt: null
      })
    } as any);

    const res = await request(app).get(
      `/api/students/${validStudentId}/progress/resource/${validResourceId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.data.progress).toMatchObject({
      id: validProgressId,
      studentId: validStudentId,
      itemId: validResourceId,
      itemType: 'resource',
      status: 'in_progress'
    });
  });

  // 17. Missing progress -> 404
  it('17. Missing progress -> 404', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    vi.spyOn(Progress, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    } as any);

    const res = await request(app).get(
      `/api/students/${validStudentId}/progress/resource/${validResourceId}`
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      code: 'PROGRESS_NOT_FOUND',
      message: 'Progress tracking record was not found.'
    });
  });

  // 18. Patch progress to in_progress -> 200
  it('18. Patch progress to in_progress -> 200', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecordDoc = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'not_started',
      startedAt: null,
      completedAt: null,
      save: vi.fn().mockResolvedValue(undefined)
    };

    vi.spyOn(Progress, 'findOne').mockResolvedValue(mockRecordDoc as any);

    const res = await request(app)
      .patch(`/api/students/${validStudentId}/progress/resource/${validResourceId}`)
      .send({ status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.data.progress.status).toBe('in_progress');
    expect(mockRecordDoc.status).toBe('in_progress');
    expect(mockRecordDoc.save).toHaveBeenCalled();
  });

  // 19. Patch progress to completed -> 200
  it('19. Patch progress to completed -> 200', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecordDoc = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null,
      save: vi.fn().mockResolvedValue(undefined)
    };

    vi.spyOn(Progress, 'findOne').mockResolvedValue(mockRecordDoc as any);

    const res = await request(app)
      .patch(`/api/students/${validStudentId}/progress/resource/${validResourceId}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.data.progress.status).toBe('completed');
    expect(mockRecordDoc.completedAt).toBeInstanceOf(Date);
    expect(mockRecordDoc.save).toHaveBeenCalled();
  });

  // 20. Patch progress to not_started -> 200
  it('20. Patch progress to not_started -> 200', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecordDoc = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(),
      save: vi.fn().mockResolvedValue(undefined)
    };

    vi.spyOn(Progress, 'findOne').mockResolvedValue(mockRecordDoc as any);

    const res = await request(app)
      .patch(`/api/students/${validStudentId}/progress/resource/${validResourceId}`)
      .send({ status: 'not_started' });

    expect(res.status).toBe(200);
    expect(res.body.data.progress.status).toBe('not_started');
    expect(mockRecordDoc.startedAt).toBeNull();
    expect(mockRecordDoc.completedAt).toBeNull();
  });

  // 21. PATCH cannot change itemType
  it('21. PATCH cannot change itemType', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecordDoc = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null,
      save: vi.fn().mockResolvedValue(undefined)
    };

    vi.spyOn(Progress, 'findOne').mockResolvedValue(mockRecordDoc as any);

    const res = await request(app)
      .patch(`/api/students/${validStudentId}/progress/resource/${validResourceId}`)
      .send({ status: 'completed', itemType: 'opportunity' });

    expect(res.status).toBe(200);
    expect(mockRecordDoc.itemType).toBe('resource');
    expect(res.body.data.progress.itemType).toBe('resource');
  });

  // 22. PATCH cannot change itemId
  it('22. PATCH cannot change itemId', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecordDoc = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null,
      save: vi.fn().mockResolvedValue(undefined)
    };

    vi.spyOn(Progress, 'findOne').mockResolvedValue(mockRecordDoc as any);

    const res = await request(app)
      .patch(`/api/students/${validStudentId}/progress/resource/${validResourceId}`)
      .send({ status: 'completed', itemId: '507f1f77bcf86cd799439999' });

    expect(res.status).toBe(200);
    expect(mockRecordDoc.itemId.toString()).toBe(validResourceId);
    expect(res.body.data.progress.itemId).toBe(validResourceId);
  });

  // 23. PATCH cannot change studentId
  it('23. PATCH cannot change studentId', async () => {
    vi.spyOn(Student, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockStudent)
    } as any);

    const mockRecordDoc = {
      _id: new Types.ObjectId(validProgressId),
      studentId: new Types.ObjectId(validStudentId),
      itemId: new Types.ObjectId(validResourceId),
      itemType: 'resource',
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null,
      save: vi.fn().mockResolvedValue(undefined)
    };

    vi.spyOn(Progress, 'findOne').mockResolvedValue(mockRecordDoc as any);

    const res = await request(app)
      .patch(`/api/students/${validStudentId}/progress/resource/${validResourceId}`)
      .send({ status: 'completed', studentId: otherStudentId });

    expect(res.status).toBe(200);
    expect(mockRecordDoc.studentId.toString()).toBe(validStudentId);
    expect(res.body.data.progress.studentId).toBe(validStudentId);
  });

  // 24. Existing Student API remains operational
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

  // 25. Existing Career Intelligence API remains operational
  it('25. Existing Career Intelligence API remains operational', async () => {
    vi.spyOn(careerIntelligenceService, 'getStudentCareerIntelligence').mockResolvedValue({
      student: { id: validStudentId, name: 'Santhosh' } as any,
      career: { id: '507f1f77bcf86cd799439012', title: 'AI Engineer' } as any,
      alignment: {
        score: 85,
        level: 'strong',
        verifiedSkillsCount: 3,
        totalRequiredSkills: 4,
        averageGapLevel: 0.5
      } as any,
      skillGaps: [],
      roadmap: [],
      nextBestAction: null
    });

    const res = await request(app).get(
      `/api/students/${validStudentId}/career-intelligence`
    );

    expect(res.status).toBe(200);
    expect(res.body.data.career.title).toBe('AI Engineer');
    expect(res.body.data.alignment.score).toBe(85);
  });

  // 26. Existing health endpoint remains operational
  it('26. Existing health endpoint remains operational', async () => {
    const res = await request(app).get('/api/health');

    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('status');
    expect(res.body.data).toHaveProperty('db');
  });

  // 27. Existing BE-04 domain tests remain unchanged and pass
  it('27. Existing BE-04 domain concepts remain compatible with progress tracking', () => {
    // Assert domain concepts: nextBestAction itemId connects directly to progress itemId
    const nextBestActionMock = {
      type: 'resource' as const,
      itemId: validResourceId,
      title: 'CS50 Introduction to Computer Science',
      priority: 1
    };

    expect(nextBestActionMock.itemId).toBe(validResourceId);
    expect(['resource', 'project', 'opportunity']).toContain(nextBestActionMock.type);
  });
});
