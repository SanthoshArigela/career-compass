import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudentSkill {
  skillId: Types.ObjectId;
  level: number; // 0 = None to 5 = Expert
}

export interface IStudent extends Document {
  email: string;
  name: string;
  university: string;
  major: string;
  yearOfStudy: number;
  hoursPerWeek: number;
  interests: string[];
  skills: IStudentSkill[];
  targetCareerIds: Types.ObjectId[];
  primaryCareerId: Types.ObjectId | null;
  onboardingComplete: boolean;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSkillSchema = new Schema<IStudentSkill>(
  {
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'skillId is required']
    },
    level: {
      type: Number,
      required: [true, 'skill level is required'],
      min: [0, 'skill level must be between 0 and 5'],
      max: [5, 'skill level must be between 0 and 5'],
      validate: {
        validator: Number.isInteger,
        message: 'skill level must be an integer'
      }
    }
  },
  { _id: false }
);

const StudentSchema = new Schema<IStudent>(
  {
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true
    },
    major: {
      type: String,
      required: [true, 'Major is required'],
      trim: true
    },
    yearOfStudy: {
      type: Number,
      required: [true, 'Year of study is required'],
      min: [1, 'Year of study must be at least 1']
    },
    hoursPerWeek: {
      type: Number,
      required: [true, 'Hours per week is required'],
      min: [0, 'Hours per week must be greater than or equal to 0']
    },
    interests: {
      type: [String],
      default: []
    },
    skills: {
      type: [StudentSkillSchema],
      default: []
    },
    targetCareerIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Career'
        }
      ],
      default: []
    },
    primaryCareerId: {
      type: Schema.Types.ObjectId,
      ref: 'Career',
      default: null
    },
    onboardingComplete: {
      type: Boolean,
      default: false
    },
    isDemo: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
