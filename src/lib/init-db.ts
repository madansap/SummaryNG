import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "@/drizzle/schema";

// Initialize the database
const sqlite = new Database("local.db");
export const db = drizzle(sqlite, { schema });

// Create tables
const createTables = sqlite.prepare(`
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

createTables.run(); 