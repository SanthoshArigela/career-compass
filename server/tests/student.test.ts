import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { studentService } from '../src/services/studentService';
import { AppError } from '../src/middleware/errorHandler';

describe('BE-05: Student Profile Service & API', () => {
  const validObjectId1 = '507f1f77bcf86cd799439011';
  const validObjectId2 = '507f1f77bcf86cd799439012';
  const validSkillId = '507f1f77bcf86cd799439013';
  const validCareerId = '507f1f77bcf86cd799439014';

  const validStudentPayload = {
    email: 'student@example.com',
    name: 'Santhosh',
    university: 'Aditya University',
    major: 'CSE AI & ML',
    yearOfStudy: 3,
    hoursPerWeek: 10,
    interests: ['AI', 'Backend Development'],
    skills: [
      {
        skillId: validSkillId,
        level: 3
      }
    ],
    targetCareerIds: [validCareerId],
    primaryCareerId: validCareerId,
    onboardingComplete: true,
    isDemo: true
  };

  const mockCreatedStudent = {
    id: validObjectId1,
    ...validStudentPayload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // 1. POST /api/students - Valid Creation
  it('1. POST student with valid data -> 201', async () => {
    vi.spyOn(studentService, 'createStudent').mockResolvedValue(mockCreatedStudent as any);

    const res = await request(app).post('/api/students').send(validStudentPayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.student.email).toBe('student@example.com');
    expect(res.body.data.student.id).toBe(validObjectId1);
  });

  // 2. POST /api/students - Invalid Email
  it('2. POST invalid email -> 400', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({ ...validStudentPayload, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('email');
  });

  // 3. POST /api/students - Invalid YearOfStudy
  it('3. POST invalid yearOfStudy -> 400', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({ ...validStudentPayload, yearOfStudy: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('yearOfStudy');
  });

  // 4. POST /api/students - Invalid Skill Level
  it('4. POST invalid skill level -> 400', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({
        ...validStudentPayload,
        skills: [{ skillId: validSkillId, level: 7 }]
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('level');
  });

  // 5. POST /api/students - Nonexistent Skill Reference
  it('5. POST nonexistent skill -> 400', async () => {
    vi.spyOn(studentService, 'createStudent').mockRejectedValue(
      new AppError(400, 'INVALID_SKILL_REFERENCE', 'One or more referenced skills do not exist.')
    );

    const res = await request(app).post('/api/students').send(validStudentPayload);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_SKILL_REFERENCE');
    expect(res.body.error.message).toBe('One or more referenced skills do not exist.');
  });

  // 6. POST /api/students - Nonexistent Career Reference
  it('6. POST nonexistent career -> 400', async () => {
    vi.spyOn(studentService, 'createStudent').mockRejectedValue(
      new AppError(400, 'INVALID_CAREER_REFERENCE', 'One or more referenced careers do not exist.')
    );

    const res = await request(app).post('/api/students').send(validStudentPayload);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CAREER_REFERENCE');
    expect(res.body.error.message).toBe('One or more referenced careers do not exist.');
  });

  // 7. POST /api/students - Duplicate Email
  it('7. POST duplicate email -> 409', async () => {
    vi.spyOn(studentService, 'createStudent').mockRejectedValue(
      new AppError(409, 'STUDENT_ALREADY_EXISTS', 'A student with this email already exists.')
    );

    const res = await request(app).post('/api/students').send(validStudentPayload);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('STUDENT_ALREADY_EXISTS');
    expect(res.body.error.message).toBe('A student with this email already exists.');
  });

  // 8. GET /api/students/:id - Existing Student
  it('8. GET existing student -> 200', async () => {
    vi.spyOn(studentService, 'getStudentById').mockResolvedValue(mockCreatedStudent as any);

    const res = await request(app).get(`/api/students/${validObjectId1}`);

    expect(res.status).toBe(200);
    expect(res.body.data.student.id).toBe(validObjectId1);
    expect(res.body.data.student.name).toBe('Santhosh');
  });

  // 9. GET /api/students/:id - Nonexistent Student
  it('9. GET nonexistent student -> 404', async () => {
    vi.spyOn(studentService, 'getStudentById').mockRejectedValue(
      new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.')
    );

    const res = await request(app).get(`/api/students/${validObjectId2}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('STUDENT_NOT_FOUND');
    expect(res.body.error.message).toBe('Student not found.');
  });

  // 10. GET /api/students/:id - Malformed ObjectId
  it('10. GET malformed ObjectId -> 400', async () => {
    vi.spyOn(studentService, 'getStudentById').mockRejectedValue(
      new AppError(400, 'INVALID_ID', 'Invalid student ID format.')
    );

    const res = await request(app).get('/api/students/malformed-id');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ID');
  });

  // 11. PATCH /api/students/:id - Existing Student
  it('11. PATCH existing student -> 200', async () => {
    const updatedMock = { ...mockCreatedStudent, hoursPerWeek: 20, name: 'Santhosh A' };
    vi.spyOn(studentService, 'updateStudent').mockResolvedValue(updatedMock as any);

    const res = await request(app)
      .patch(`/api/students/${validObjectId1}`)
      .send({ hoursPerWeek: 20, name: 'Santhosh A' });

    expect(res.status).toBe(200);
    expect(res.body.data.student.hoursPerWeek).toBe(20);
    expect(res.body.data.student.name).toBe('Santhosh A');
  });

  // 12. PATCH /api/students/:id - Immutable Email
  it('12. PATCH immutable email -> rejected with 400', async () => {
    const res = await request(app)
      .patch(`/api/students/${validObjectId1}`)
      .send({ email: 'newemail@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('IMMUTABLE_FIELD');
    expect(res.body.error.message).toContain('Email');
  });

  // 13. PATCH /api/students/:id - Invalid Skill Reference
  it('13. PATCH invalid skill reference -> 400', async () => {
    vi.spyOn(studentService, 'updateStudent').mockRejectedValue(
      new AppError(400, 'INVALID_SKILL_REFERENCE', 'One or more referenced skills do not exist.')
    );

    const res = await request(app)
      .patch(`/api/students/${validObjectId1}`)
      .send({ skills: [{ skillId: '507f1f77bcf86cd799439999', level: 2 }] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_SKILL_REFERENCE');
  });

  // 14. GET /api/students/:id/profile - 200 with populated metadata
  it('14. GET profile -> 200 with populated skills and careers', async () => {
    const mockProfile = {
      student: mockCreatedStudent,
      skills: [
        {
          skillId: validSkillId,
          slug: 'python',
          name: 'Python Programming',
          category: 'Programming',
          level: 3
        }
      ],
      targetCareers: [
        {
          careerId: validCareerId,
          slug: 'ai-engineer',
          title: 'AI Engineer',
          summary: 'Designs intelligent systems',
          category: 'Artificial Intelligence',
          interestTags: ['ai', 'python']
        }
      ],
      primaryCareer: {
        careerId: validCareerId,
        slug: 'ai-engineer',
        title: 'AI Engineer',
        summary: 'Designs intelligent systems',
        category: 'Artificial Intelligence',
        interestTags: ['ai', 'python']
      }
    };

    vi.spyOn(studentService, 'getStudentProfile').mockResolvedValue(mockProfile as any);

    const res = await request(app).get(`/api/students/${validObjectId1}/profile`);

    expect(res.status).toBe(200);
    expect(res.body.data.profile).toHaveProperty('student');
    expect(res.body.data.profile).toHaveProperty('skills');
    expect(res.body.data.profile.skills[0].name).toBe('Python Programming');
    expect(res.body.data.profile).toHaveProperty('targetCareers');
    expect(res.body.data.profile.targetCareers[0].title).toBe('AI Engineer');
    expect(res.body.data.profile).toHaveProperty('primaryCareer');
    expect(res.body.data.profile.primaryCareer.title).toBe('AI Engineer');
  });

  // 15. GET /api/students/:id/profile - Nonexistent profile -> 404
  it('15. GET nonexistent profile -> 404', async () => {
    vi.spyOn(studentService, 'getStudentProfile').mockRejectedValue(
      new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.')
    );

    const res = await request(app).get(`/api/students/${validObjectId2}/profile`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('STUDENT_NOT_FOUND');
  });

  // 16. GET /api/health still works
  it('16. Existing health endpoint still works', async () => {
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.status);
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
