import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    N8N_WEBHOOK_BASE_URL: z.string().url(),
    API_KEY: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    process.exit(1);
}

export const env = _env.data;
console.log('Loaded ENV:', { N8N_WEBHOOK_BASE_URL: env.N8N_WEBHOOK_BASE_URL });
