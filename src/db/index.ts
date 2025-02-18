import { drizzle } from 'drizzle-orm/d1';
import { sql } from '@vercel/postgres';
import * as schema from '@/drizzle/schema';

export const db = drizzle(sql, { schema }); 