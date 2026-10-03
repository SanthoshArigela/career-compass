import mongoose, { Schema, Document, Types } from 'mongoose';

export type ResourceType =
  | 'course'
  | 'tutorial'
  | 'documentation'
  | 'video'
  | 'book'
  | 'article'
  | 'practice';

export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced';

export const RESOURCE_TYPES: ResourceType[] = [
  'course',
  'tutorial',
  'documentation',
  'video',
  'book',
  'article',
  'practice'
];

export const RESOURCE_LEVELS: ResourceLevel[] = ['beginner', 'intermediate', 'advanced'];

export interface IResource extends Document {
  slug: string;
  title: string;
  url: string;
  provider: string;
  type: ResourceType;
  skillIds: Types.ObjectId[];
  level: ResourceLevel;
  levelGranted: number;
  durationHours: number;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

const urlValidator = {
  validator: (v: string): boolean => {
    try {
      const parsed = new URL(v);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },
  message: 'URL must be a valid HTTP or HTTPS web address'
};

const ResourceSchema = new Schema<IResource>(
  {
    slug: {
      type: String,
      required: [true, 'Resource slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
      validate: urlValidator
    },
    provider: {
      type: String,
      required: [true, 'Resource provider is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: {
        values: RESOURCE_TYPES,
        message: '{VALUE} is not a supported resource type'
      }
    },
    skillIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Skill'
        }
      ],
      default: []
    },
    level: {
      type: String,
      required: [true, 'Resource level is required'],
      enum: {
        values: RESOURCE_LEVELS,
        message: '{VALUE} is not a valid resource level'
      }
    },
    levelGranted: {
      type: Number,
      required: [true, 'levelGranted is required'],
      min: [0, 'levelGranted must be at least 0'],
      max: [5, 'levelGranted cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'levelGranted must be an integer'
      }
    },
    durationHours: {
      type: Number,
      required: [true, 'durationHours is required'],
      min: [0, 'durationHours cannot be negative']
    },
    cost: {
      type: Number,
      min: [0, 'cost cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
