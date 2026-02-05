import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  N8N_WEBHOOK_BASE_URL: z.string().url(),
  API_KEY: z.string().min(8, 'API_KEY must be at least 8 characters'),
  ALLOWED_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;

// Log sanitized config on startup (mask sensitive values)
const maskedUrl = new URL(env.N8N_WEBHOOK_BASE_URL);
maskedUrl.password = maskedUrl.password ? '***' : '';
console.log('Config loaded:', {
  N8N_WEBHOOK_BASE_URL: maskedUrl.toString(),
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
});
