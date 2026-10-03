import mongoose, { Schema, Document, Types } from 'mongoose';

export type ProgressItemType = 'resource' | 'project' | 'opportunity';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export const PROGRESS_ITEM_TYPES: ProgressItemType[] = ['resource', 'project', 'opportunity'];
export const PROGRESS_STATUSES: ProgressStatus[] = ['not_started', 'in_progress', 'completed'];

export interface IProgress extends Document {
  studentId: Types.ObjectId;
  itemType: ProgressItemType;
  itemId: Types.ObjectId;
  status: ProgressStatus;
  note?: string;
  link?: string;
  startedAt: Date | null;
  completedAt: Date | null;
  levelGainApplied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'studentId is required'],
      index: true
    },
    itemType: {
      type: String,
      required: [true, 'itemType is required'],
      enum: {
        values: PROGRESS_ITEM_TYPES,
        message: '{VALUE} is not a valid progress item type'
      }
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: [true, 'itemId is required']
      // Intentionally polymorphic: target collection resolved at runtime via itemType
    },
    status: {
      type: String,
      required: [true, 'status is required'],
      enum: {
        values: PROGRESS_STATUSES,
        message: '{VALUE} is not a valid progress status'
      },
      default: 'not_started'
    },
    note: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    levelGainApplied: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index to support fast lookups and prevent duplicate progress tracking records
ProgressSchema.index({ studentId: 1, itemType: 1, itemId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', ProgressSchema);
