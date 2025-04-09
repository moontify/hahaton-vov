import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
} satisfies Config; 