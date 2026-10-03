import mongoose, { Schema, Document, Types } from 'mongoose';

export type ProjectSource = 'catalog' | 'custom' | 'ai';
export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

export const PROJECT_SOURCES: ProjectSource[] = ['catalog', 'custom', 'ai'];
export const PROJECT_DIFFICULTIES: ProjectDifficulty[] = ['beginner', 'intermediate', 'advanced'];

export interface IProjectSkillGain {
  skillId: Types.ObjectId;
  levelGain: number; // 0 to 5
}

export interface IProject extends Document {
  slug: string;
  ownerId: Types.ObjectId | null;
  source: ProjectSource;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  estimatedHours: number;
  skillIds: Types.ObjectId[];
  careerIds: Types.ObjectId[];
  deliverables: string[];
  skillLevelsGained: IProjectSkillGain[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSkillGainSchema = new Schema<IProjectSkillGain>(
  {
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'skillId is required in skillLevelsGained']
    },
    levelGain: {
      type: Number,
      required: [true, 'levelGain is required'],
      min: [0, 'levelGain must be at least 0'],
      max: [5, 'levelGain cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'levelGain must be an integer'
      }
    }
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      trim: true,
      lowercase: true,
      index: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
      index: true
    },
    source: {
      type: String,
      required: [true, 'Project source is required'],
      enum: {
        values: PROJECT_SOURCES,
        message: '{VALUE} is not a valid project source'
      },
      default: 'catalog'
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    difficulty: {
      type: String,
      required: [true, 'Project difficulty is required'],
      enum: {
        values: PROJECT_DIFFICULTIES,
        message: '{VALUE} is not a valid project difficulty'
      }
    },
    estimatedHours: {
      type: Number,
      required: [true, 'estimatedHours is required'],
      min: [0, 'estimatedHours cannot be negative']
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
    careerIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Career'
        }
      ],
      default: []
    },
    deliverables: {
      type: [String],
      default: []
    },
    skillLevelsGained: {
      type: [ProjectSkillGainSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
