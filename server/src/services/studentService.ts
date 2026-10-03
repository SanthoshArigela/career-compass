import { Types } from 'mongoose';
import { Student, Skill, Career } from '../models';
import { CreateStudentInput, UpdateStudentInput } from '../validators/studentValidator';
import { AppError } from '../middleware/errorHandler';

/**
 * Clean serialization of a Student document removing Mongoose internals.
 */
export const serializeStudent = (student: any) => {
  return {
    id: student._id ? student._id.toString() : student.id,
    email: student.email,
    name: student.name,
    university: student.university,
    major: student.major,
    yearOfStudy: student.yearOfStudy,
    hoursPerWeek: student.hoursPerWeek,
    interests: student.interests ?? [],
    skills: (student.skills ?? []).map((s: any) => ({
      skillId: s.skillId ? s.skillId.toString() : s.skillId,
      level: s.level
    })),
    targetCareerIds: (student.targetCareerIds ?? []).map((c: any) =>
      c.toString ? c.toString() : c
    ),
    primaryCareerId: student.primaryCareerId
      ? student.primaryCareerId.toString()
      : null,
    onboardingComplete: Boolean(student.onboardingComplete),
    isDemo: Boolean(student.isDemo),
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  };
};

/**
 * Validates that all referenced skillIds exist in the database.
 */
export const validateReferencedSkills = async (
  skills?: Array<{ skillId: string; level: number }>
): Promise<void> => {
  if (!skills || skills.length === 0) return;

  const uniqueSkillIds = Array.from(new Set(skills.map((s) => s.skillId)));
  const foundSkills = await Skill.find({
    _id: { $in: uniqueSkillIds.map((id) => new Types.ObjectId(id)) }
  })
    .select('_id')
    .lean();

  if (foundSkills.length !== uniqueSkillIds.length) {
    throw new AppError(
      400,
      'INVALID_SKILL_REFERENCE',
      'One or more referenced skills do not exist.'
    );
  }
};

/**
 * Validates that all referenced careerIds exist in the database.
 */
export const validateReferencedCareers = async (
  targetCareerIds?: string[],
  primaryCareerId?: string | null
): Promise<void> => {
  const careerIdsToCheck: string[] = [];

  if (targetCareerIds && targetCareerIds.length > 0) {
    careerIdsToCheck.push(...targetCareerIds);
  }

  if (primaryCareerId) {
    careerIdsToCheck.push(primaryCareerId);
  }

  if (careerIdsToCheck.length === 0) return;

  const uniqueCareerIds = Array.from(new Set(careerIdsToCheck));
  const foundCareers = await Career.find({
    _id: { $in: uniqueCareerIds.map((id) => new Types.ObjectId(id)) }
  })
    .select('_id')
    .lean();

  if (foundCareers.length !== uniqueCareerIds.length) {
    throw new AppError(
      400,
      'INVALID_CAREER_REFERENCE',
      'One or more referenced careers do not exist.'
    );
  }
};

/**
 * Asserts that an ID string is a valid 24-character hexadecimal ObjectId.
 */
export const assertValidObjectId = (id: string, fieldName = 'id'): void => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, 'INVALID_ID', `Invalid ${fieldName} format.`);
  }
};

/**
 * Service: Create a new Student record with full referential validation and uniqueness checks.
 */
export const createStudent = async (input: CreateStudentInput) => {
  // 1. Check duplicate email before querying dependencies
  const normalizedEmail = input.email.toLowerCase().trim();
  const existing = await Student.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    throw new AppError(
      409,
      'STUDENT_ALREADY_EXISTS',
      'A student with this email already exists.'
    );
  }

  // 2. Validate skill references
  await validateReferencedSkills(input.skills);

  // 3. Validate career references
  await validateReferencedCareers(input.targetCareerIds, input.primaryCareerId);

  // 4. Create in MongoDB
  try {
    const student = await Student.create({
      ...input,
      email: normalizedEmail
    });

    return serializeStudent(student);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new AppError(
        409,
        'STUDENT_ALREADY_EXISTS',
        'A student with this email already exists.'
      );
    }
    throw error;
  }
};

/**
 * Service: Retrieve student document by ID.
 */
export const getStudentById = async (id: string) => {
  assertValidObjectId(id, 'student ID');

  const student = await Student.findById(id).lean();
  if (!student) {
    throw new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.');
  }

  return serializeStudent(student);
};

/**
 * Service: Update student profile fields. Disallows email modification.
 */
export const updateStudent = async (
  id: string,
  updateData: UpdateStudentInput & { email?: unknown }
) => {
  assertValidObjectId(id, 'student ID');

  // Enforce email immutability
  if ('email' in updateData && updateData.email !== undefined) {
    throw new AppError(
      400,
      'IMMUTABLE_FIELD',
      'Email address cannot be modified.'
    );
  }

  // Validate skill references if updated
  if (updateData.skills) {
    await validateReferencedSkills(updateData.skills);
  }

  // Validate career references if updated
  if (updateData.targetCareerIds || updateData.primaryCareerId !== undefined) {
    await validateReferencedCareers(
      updateData.targetCareerIds,
      updateData.primaryCareerId
    );
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedStudent) {
    throw new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.');
  }

  return serializeStudent(updatedStudent);
};

/**
 * Service: Retrieve frontend-optimized profile representation with populated skill and career metadata.
 */
export const getStudentProfile = async (id: string) => {
  assertValidObjectId(id, 'student ID');

  const student = await Student.findById(id).lean();
  if (!student) {
    throw new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.');
  }

  // 1. Populate skills
  const studentSkillIds = (student.skills ?? []).map((s) => s.skillId);
  const catalogSkills = await Skill.find({
    _id: { $in: studentSkillIds }
  }).lean();

  const skillLookup = new Map(
    catalogSkills.map((cs) => [cs._id.toString(), cs])
  );

  const populatedSkills = (student.skills ?? []).map((s) => {
    const sId = s.skillId.toString();
    const item = skillLookup.get(sId);
    return {
      skillId: sId,
      slug: item?.slug ?? '',
      name: item?.name ?? '',
      category: item?.category ?? '',
      level: s.level
    };
  });

  // 2. Populate target careers
  const targetCareerDocs = await Career.find({
    _id: { $in: student.targetCareerIds ?? [] }
  })
    .select('_id slug title summary category interestTags')
    .lean();

  const populatedTargetCareers = targetCareerDocs.map((c) => ({
    careerId: c._id.toString(),
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    category: c.category,
    interestTags: c.interestTags
  }));

  // 3. Populate primary career
  let populatedPrimaryCareer = null;
  if (student.primaryCareerId) {
    const pcDoc = await Career.findById(student.primaryCareerId)
      .select('_id slug title summary category interestTags')
      .lean();

    if (pcDoc) {
      populatedPrimaryCareer = {
        careerId: pcDoc._id.toString(),
        slug: pcDoc.slug,
        title: pcDoc.title,
        summary: pcDoc.summary,
        category: pcDoc.category,
        interestTags: pcDoc.interestTags
      };
    }
  }

  return {
    student: serializeStudent(student),
    skills: populatedSkills,
    targetCareers: populatedTargetCareers,
    primaryCareer: populatedPrimaryCareer
  };
};

export const studentService = {
  createStudent,
  getStudentById,
  updateStudent,
  getStudentProfile,
  validateReferencedSkills,
  validateReferencedCareers,
  serializeStudent
};
