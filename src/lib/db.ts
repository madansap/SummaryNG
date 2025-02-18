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

// Production environment - always use Postgres
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required in production");
  }

  try {
    const client = postgres(process.env.DATABASE_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production'
    });
    
    db = drizzlePostgres(client, { schema });
  } catch (error) {
    console.error("Failed to initialize production database:", error);
    throw error;
  }
} 
// Development environment - use SQLite
else {
  const initDevDB = async () => {
    try {
      // Dynamic imports to prevent these modules from being included in production build
      const [{ default: Database }, { drizzle }] = await Promise.all([
        import('better-sqlite3').catch(() => ({ default: null })),
        import('drizzle-orm/better-sqlite3').catch(() => ({ drizzle: null }))
      ]);

      if (!Database || !drizzle) {
        console.warn('SQLite dependencies not available, skipping development database initialization');
        return;
      }
      
      const sqlite = new Database("local.db");
      db = drizzle(sqlite, { schema });
    } catch (error) {
      console.error('Failed to initialize development database:', error);
      // Don't throw in development, just log the error
      console.warn('Continuing without local database');
    }
  };

  // Initialize development database only on server side
  if (typeof window === 'undefined') {
    initDevDB().catch(console.error);
  }
}

export { db }; 