import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js"
import postgres from "postgres"
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

let db: any;

if (process.env.NODE_ENV === 'production') {
  // Use Postgres in production
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(process.env.DATABASE_URL);
  db = drizzlePostgres(client, { schema });
} else {
  // Use SQLite for local development
  const initDevDB = async () => {
    try {
      const { default: Database } = await import('better-sqlite3');
      const { drizzle } = await import('drizzle-orm/better-sqlite3');
      
      const sqlite = new Database("local.db");
      db = drizzle(sqlite, { schema });
    } catch (error) {
      console.error('Failed to initialize development database:', error);
      throw error; // Re-throw to ensure we don't continue with an uninitialized database
    }
  };

  // Initialize development database
  initDevDB().catch(console.error);
}

export { db }; 