import { drizzle } from "drizzle-orm/better-sqlite3"
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "@/drizzle/schema"

// This is a type declaration for the Cloudflare D1 binding
declare global {
  const DB: D1Database | undefined;
}

let db: any;

if (process.env.NODE_ENV === 'development') {
  const sqlite = new Database("local.db", { verbose: console.log });
  
  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS summaries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  
  db = drizzle(sqlite, { schema });
} else {
  // Use D1 in production
  if (!DB) {
    throw new Error("DB is not defined - did you forget to add the D1 binding?");
  }
  db = drizzle(DB, { schema });
}

export { db }; 