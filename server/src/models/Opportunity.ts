import mongoose, { Schema, Document, Types } from 'mongoose';

export type OpportunityType =
  | 'internship'
  | 'job'
  | 'hackathon'
  | 'scholarship'
  | 'fellowship'
  | 'competition';

export const OPPORTUNITY_TYPES: OpportunityType[] = [
  'internship',
  'job',
  'hackathon',
  'scholarship',
  'fellowship',
  'competition'
];

export interface IOpportunity extends Document {
  slug: string;
  title: string;
  organization: string;
  type: OpportunityType;
  url: string;
  deadline: Date | null;
  location: string | null;
  remote: boolean;
  careerIds: Types.ObjectId[];
  skillIds: Types.ObjectId[];
  minSkillLevel: number;
  description: string;
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

const OpportunitySchema = new Schema<IOpportunity>(
  {
    slug: {
      type: String,
      required: [true, 'Opportunity slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Opportunity type is required'],
      enum: {
        values: OPPORTUNITY_TYPES,
        message: '{VALUE} is not a valid opportunity type'
      }
    },
    url: {
      type: String,
      required: [true, 'Opportunity URL is required'],
      trim: true,
      validate: urlValidator
    },
    deadline: {
      type: Date,
      default: null,
      index: true
    },
    location: {
      type: String,
      default: null,
      trim: true
    },
    remote: {
      type: Boolean,
      default: false
    },
    careerIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Career'
        }
      ],
      default: []
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
    minSkillLevel: {
      type: Number,
      default: 0,
      min: [0, 'minSkillLevel must be at least 0'],
      max: [5, 'minSkillLevel cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'minSkillLevel must be an integer'
      }
    },
    description: {
      type: String,
      required: [true, 'Opportunity description is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
