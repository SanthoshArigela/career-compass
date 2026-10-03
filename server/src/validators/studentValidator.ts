import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const studentSkillInputSchema = z.object({
  skillId: objectIdSchema,
  level: z
    .number()
    .int('Skill level must be an integer')
    .min(0, 'Skill level must be at least 0')
    .max(5, 'Skill level cannot exceed 5')
});

export const createStudentSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  name: z.string().trim().min(1, 'Name is required'),
  university: z.string().trim().min(1, 'University is required'),
  major: z.string().trim().min(1, 'Major is required'),
  yearOfStudy: z
    .number()
    .int('Year of study must be an integer')
    .min(1, 'Year of study must be at least 1'),
  hoursPerWeek: z
    .number()
    .min(0, 'Hours per week must be greater than or equal to 0'),
  interests: z.array(z.string().trim()).default([]),
  skills: z.array(studentSkillInputSchema).default([]),
  targetCareerIds: z.array(objectIdSchema).default([]),
  primaryCareerId: objectIdSchema.nullable().optional().default(null),
  onboardingComplete: z.boolean().default(false),
  isDemo: z.boolean().default(false)
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty').optional(),
  university: z.string().trim().min(1, 'University cannot be empty').optional(),
  major: z.string().trim().min(1, 'Major cannot be empty').optional(),
  yearOfStudy: z
    .number()
    .int('Year of study must be an integer')
    .min(1, 'Year of study must be at least 1')
    .optional(),
  hoursPerWeek: z
    .number()
    .min(0, 'Hours per week cannot be negative')
    .optional(),
  interests: z.array(z.string().trim()).optional(),
  skills: z.array(studentSkillInputSchema).optional(),
  targetCareerIds: z.array(objectIdSchema).optional(),
  primaryCareerId: objectIdSchema.nullable().optional(),
  onboardingComplete: z.boolean().optional(),
  isDemo: z.boolean().optional()
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
