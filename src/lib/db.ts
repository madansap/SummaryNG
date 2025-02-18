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
        import('better-sqlite3'),
        import('drizzle-orm/better-sqlite3')
      ]);
      
      const sqlite = new Database("local.db");
      db = drizzle(sqlite, { schema });
    } catch (error) {
      console.error('Failed to initialize development database:', error);
      throw error;
    }
  };

  // Initialize development database
  if (typeof window === 'undefined') { // Only run on server-side
    initDevDB().catch(error => {
      console.error('Failed to initialize development database:', error);
      process.exit(1);
    });
  }
}

export { db }; 