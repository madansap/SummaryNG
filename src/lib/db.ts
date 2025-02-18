import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from '@/drizzle/schema';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_URL: string;
    }
  }
}

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is required');
}

export const db = drizzle(sql, { schema }); 