import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Attempt to load .env from current directory or server directory
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().optional().default(''),
  CLIENT_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  OPENROUTER_API_KEY: z.string().optional().default(''),
  OPENROUTER_MODEL: z.string().optional().default(''),
  OPENROUTER_BASE_URL: z
    .string()
    .url('OPENROUTER_BASE_URL must be a valid URL')
    .default('https://openrouter.ai/api/v1'),
  AI_ENABLED: z
    .preprocess((val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const normalized = val.trim().toLowerCase();
        if (normalized === 'false' || normalized === '0') return false;
        return true;
      }
      return true;
    }, z.boolean())
    .default(true)
});

export type EnvConfig = z.infer<typeof envSchema>;

const parseEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `[${issue.path.join('.')}]: ${issue.message}`)
      .join('; ');

    // Fail with developer-readable error without exposing secret values
    console.error(`[Configuration Error] Environment validation failed: ${errorDetails}`);
    throw new Error(`Environment validation failed: ${errorDetails}`);
  }

  return result.data;
};

/**
 * Validates that a MongoDB connection string is provided and follows standard URI protocols.
 * Throws a clean, secret-safe developer error if invalid.
 */
export const validateMongoUri = (uri?: string): string => {
  if (!uri || uri.trim() === '') {
    throw new Error(
      'MONGODB_URI is not set. Please provide a valid MongoDB connection string in your .env file.'
    );
  }

  const trimmed = uri.trim();
  if (!trimmed.startsWith('mongodb://') && !trimmed.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid MONGODB_URI format. The connection string must start with "mongodb://" or "mongodb+srv://".'
    );
  }

  return trimmed;
};

export const env = parseEnv();
