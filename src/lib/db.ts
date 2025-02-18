import { drizzle } from "drizzle-orm/postgres-js"
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres"
import postgres from "postgres"
import { sql } from "@vercel/postgres"
import * as schema from "@/drizzle/schema"

// Define D1Database type for Cloudflare
interface D1Database {
  prepare: (query: string) => {
    run: (params?: unknown[]) => void;
    get: (params?: unknown[]) => unknown;
    all: (params?: unknown[]) => unknown[];
  };
  exec: (query: string) => Promise<void>;
}

// Declare global DB for Cloudflare
declare global {
  const DB: D1Database | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// For local development and non-edge environments
const queryClient = process.env.NODE_ENV === 'development' 
  ? postgres(process.env.DATABASE_URL!, {
      max: 1,
      ssl: true,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : null;

// For Vercel deployment and edge environments
const db = process.env.NODE_ENV === 'development' && queryClient
  ? drizzle(queryClient, { schema })
  : drizzleVercel(sql, { schema });

export { db }; 