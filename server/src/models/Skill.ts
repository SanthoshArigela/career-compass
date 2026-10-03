import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Skill level convention:
 * 0 = None
 * 1 = Aware
 * 2 = Beginner
 * 3 = Working
 * 4 = Proficient
 * 5 = Expert
 */
export interface ISkill extends Document {
  slug: string;
  name: string;
  category: string;
  description: string;
  prerequisites: Types.ObjectId[];
  hoursPerLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    slug: {
      type: String,
      required: [true, 'Skill slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Skill description is required'],
      trim: true
    },
    prerequisites: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Skill'
        }
      ],
      default: []
    },
    hoursPerLevel: {
      type: Number,
      required: [true, 'hoursPerLevel is required'],
      min: [0, 'hoursPerLevel must be greater than or equal to 0']
    }
  },
  {
    timestamps: true
  }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
