import { IProgress, ProgressItemType, ProgressStatus } from '../models/Progress';

export interface SerializedProgress {
  id: string;
  studentId: string;
  itemId: string;
  itemType: ProgressItemType;
  status: ProgressStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProgressSummary {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
}

/**
 * Type representing any progress-like record containing a status field,
 * fully compatible with both the Mongoose Progress model (IProgress) and
 * the serialized progress representation (SerializedProgress).
 */
export type ProgressRecordLike =
  | SerializedProgress
  | IProgress
  | { status: ProgressStatus | string };

/**
 * Clean serialization of a Progress document removing internal MongoDB properties.
 */
export const serializeProgress = (record: any): SerializedProgress => {
  return {
    id: record._id ? record._id.toString() : record.id,
    studentId: record.studentId ? record.studentId.toString() : record.studentId,
    itemId: record.itemId ? record.itemId.toString() : record.itemId,
    itemType: record.itemType,
    status: record.status,
    startedAt: record.startedAt ?? null,
    completedAt: record.completedAt ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
};

/**
 * Calculates in-memory progress summary metrics from an array of progress records.
 */
export const calculateProgressSummary = (
  records: ProgressRecordLike[] = []
): ProgressSummary => {
  return {
    total: records.length,
    notStarted: records.filter((r) => r.status === 'not_started').length,
    inProgress: records.filter((r) => r.status === 'in_progress').length,
    completed: records.filter((r) => r.status === 'completed').length
  };
};

