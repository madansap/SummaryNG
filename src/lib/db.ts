import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
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

let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === 'development') {
  const sqlite = new Database("local.db");
  
  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS summaries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  db = drizzle(sqlite, { schema });
} else {
  throw new Error("Production database not configured");
}

export { db }; 