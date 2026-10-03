import { z } from 'zod';
import { PROGRESS_ITEM_TYPES, PROGRESS_STATUSES, ProgressItemType, ProgressStatus } from '../models/Progress';

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid identifier.');

export const progressItemTypeSchema = z.enum(
  PROGRESS_ITEM_TYPES as [ProgressItemType, ...ProgressItemType[]],
  {
    errorMap: () => ({ message: 'Invalid progress item type.' })
  }
);

export const progressStatusSchema = z.enum(
  PROGRESS_STATUSES as [ProgressStatus, ...ProgressStatus[]],
  {
    errorMap: () => ({ message: 'Invalid progress status.' })
  }
);

export const createProgressSchema = z.object({
  itemType: progressItemTypeSchema,
  itemId: objectIdSchema,
  status: progressStatusSchema.default('not_started')
});

export type CreateProgressInput = z.infer<typeof createProgressSchema>;

export const updateProgressSchema = z.object({
  status: progressStatusSchema
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
