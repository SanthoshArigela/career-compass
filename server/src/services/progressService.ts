import { Types } from 'mongoose';
import { Progress, Student, Resource, Project, Opportunity } from '../models';
import { ProgressItemType, ProgressStatus, PROGRESS_ITEM_TYPES, PROGRESS_STATUSES } from '../models/Progress';
import { CreateProgressInput, UpdateProgressInput } from '../validators/progressValidator';
import { AppError } from '../middleware/errorHandler';
import { serializeProgress, calculateProgressSummary } from '../mappers/progressMapper';

/**
 * Asserts that an identifier is a valid 24-character hexadecimal ObjectId.
 */
export const assertValidId = (id: string, message = 'Invalid identifier.'): void => {
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, 'INVALID_ID', message);
  }
};

/**
 * Validates progress item type against the allowed enum.
 */
export const assertValidItemType = (itemType: string): ProgressItemType => {
  if (!PROGRESS_ITEM_TYPES.includes(itemType as ProgressItemType)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid progress item type.');
  }
  return itemType as ProgressItemType;
};

/**
 * Validates progress status against the allowed enum.
 */
export const assertValidStatus = (status: string): ProgressStatus => {
  if (!PROGRESS_STATUSES.includes(status as ProgressStatus)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid progress status.');
  }
  return status as ProgressStatus;
};

/**
 * Verifies that a student exists in the database.
 */
export const verifyStudentExists = async (studentId: string): Promise<void> => {
  const student = await Student.findById(studentId).lean();
  if (!student) {
    throw new AppError(404, 'STUDENT_NOT_FOUND', 'Student not found.');
  }
};

/**
 * Resolves and verifies that the referenced item exists in its respective collection.
 */
export const resolveProgressItem = async (
  itemType: ProgressItemType,
  itemId: string
): Promise<any> => {
  let item = null;

  switch (itemType) {
    case 'resource':
      item = await Resource.findById(itemId).lean();
      break;
    case 'project':
      item = await Project.findById(itemId).lean();
      break;
    case 'opportunity':
      item = await Opportunity.findById(itemId).lean();
      break;
    default:
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid progress item type.');
  }

  if (!item) {
    throw new AppError(404, 'PROGRESS_ITEM_NOT_FOUND', 'The progress item was not found.');
  }

  return item;
};

/**
 * Service: Create a new progress tracking record for a student on a resource, project, or opportunity.
 */
export const createProgress = async (studentId: string, input: CreateProgressInput) => {
  assertValidId(studentId);
  assertValidId(input.itemId);
  assertValidItemType(input.itemType);
  assertValidStatus(input.status);

  // 1. Verify student exists
  await verifyStudentExists(studentId);

  // 2. Verify target item exists
  await resolveProgressItem(input.itemType, input.itemId);

  // 3. Check for existing progress record
  const studentObjId = new Types.ObjectId(studentId);
  const itemObjId = new Types.ObjectId(input.itemId);

  const existing = await Progress.findOne({
    studentId: studentObjId,
    itemType: input.itemType,
    itemId: itemObjId
  }).lean();

  if (existing) {
    throw new AppError(
      409,
      'PROGRESS_ALREADY_EXISTS',
      'Progress tracking already exists for this item.'
    );
  }

  // 4. Handle initial status timestamps
  const now = new Date();
  let startedAt: Date | null = null;
  let completedAt: Date | null = null;

  if (input.status === 'in_progress') {
    startedAt = now;
  } else if (input.status === 'completed') {
    startedAt = now;
    completedAt = now;
  }

  // 5. Create Progress record
  try {
    const created = await Progress.create({
      studentId: studentObjId,
      itemType: input.itemType,
      itemId: itemObjId,
      status: input.status,
      startedAt,
      completedAt,
      levelGainApplied: false
    });

    return serializeProgress(created);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new AppError(
        409,
        'PROGRESS_ALREADY_EXISTS',
        'Progress tracking already exists for this item.'
      );
    }
    throw error;
  }
};

/**
 * Service: Retrieve all progress records for a student along with summary metrics.
 */
export const getStudentProgress = async (studentId: string) => {
  assertValidId(studentId);
  await verifyStudentExists(studentId);

  const records = await Progress.find({
    studentId: new Types.ObjectId(studentId)
  })
    .sort({ createdAt: -1 })
    .lean();

  const serialized = records.map(serializeProgress);
  const summary = calculateProgressSummary(serialized);

  return {
    progress: serialized,
    summary
  };
};

/**
 * Service: Retrieve an individual progress tracking record.
 */
export const getIndividualProgress = async (
  studentId: string,
  itemType: string,
  itemId: string
) => {
  assertValidId(studentId);
  assertValidId(itemId);
  const validatedType = assertValidItemType(itemType);
  await verifyStudentExists(studentId);

  const record = await Progress.findOne({
    studentId: new Types.ObjectId(studentId),
    itemType: validatedType,
    itemId: new Types.ObjectId(itemId)
  }).lean();

  if (!record) {
    throw new AppError(404, 'PROGRESS_NOT_FOUND', 'Progress tracking record was not found.');
  }

  return serializeProgress(record);
};

/**
 * Service: Update the status of an existing progress tracking record.
 * Disallows modifying studentId, itemId, or itemType.
 */
export const updateProgress = async (
  studentId: string,
  itemType: string,
  itemId: string,
  input: UpdateProgressInput
) => {
  assertValidId(studentId);
  assertValidId(itemId);
  const validatedType = assertValidItemType(itemType);
  const validatedStatus = assertValidStatus(input.status);
  await verifyStudentExists(studentId);

  const record = await Progress.findOne({
    studentId: new Types.ObjectId(studentId),
    itemType: validatedType,
    itemId: new Types.ObjectId(itemId)
  });

  if (!record) {
    throw new AppError(404, 'PROGRESS_NOT_FOUND', 'Progress tracking record was not found.');
  }

  const now = new Date();
  record.status = validatedStatus;

  // Handle timestamp transitions cleanly
  if (validatedStatus === 'in_progress') {
    if (!record.startedAt) {
      record.startedAt = now;
    }
    record.completedAt = null;
  } else if (validatedStatus === 'completed') {
    if (!record.startedAt) {
      record.startedAt = now;
    }
    record.completedAt = now;
  } else if (validatedStatus === 'not_started') {
    record.startedAt = null;
    record.completedAt = null;
  }

  await record.save();
  return serializeProgress(record);
};

export const progressService = {
  createProgress,
  getStudentProgress,
  getIndividualProgress,
  updateProgress,
  resolveProgressItem,
  verifyStudentExists
};
