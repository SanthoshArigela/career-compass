import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICareerRequiredSkill {
  skillId: Types.ObjectId;
  requiredLevel: number; // 0 to 5
  importance: number; // 1 = useful, 2 = important, 3 = critical
}

export interface ICareer extends Document {
  slug: string;
  title: string;
  summary: string;
  dayInLife: string;
  category: string;
  interestTags: string[];
  requiredSkills: ICareerRequiredSkill[];
  entryRoutes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CareerRequiredSkillSchema = new Schema<ICareerRequiredSkill>(
  {
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'skillId is required in requiredSkills']
    },
    requiredLevel: {
      type: Number,
      required: [true, 'requiredLevel is required'],
      min: [0, 'requiredLevel must be at least 0'],
      max: [5, 'requiredLevel cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'requiredLevel must be an integer'
      }
    },
    importance: {
      type: Number,
      required: [true, 'importance is required'],
      min: [1, 'importance must be at least 1 (useful)'],
      max: [3, 'importance cannot exceed 3 (critical)'],
      validate: {
        validator: Number.isInteger,
        message: 'importance must be an integer (1, 2, or 3)'
      }
    }
  },
  { _id: false }
);

const CareerSchema = new Schema<ICareer>(
  {
    slug: {
      type: String,
      required: [true, 'Career slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Career title is required'],
      trim: true
    },
    summary: {
      type: String,
      required: [true, 'Career summary is required'],
      trim: true
    },
    dayInLife: {
      type: String,
      required: [true, 'dayInLife description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Career category is required'],
      trim: true
    },
    interestTags: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [CareerRequiredSkillSchema],
      default: []
    },
    entryRoutes: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Career = mongoose.model<ICareer>('Career', CareerSchema);
