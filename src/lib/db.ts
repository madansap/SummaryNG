import { drizzle } from "drizzle-orm/postgres-js"
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

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Don't initialize postgres in edge runtime
const client = process.env.EDGE_RUNTIME
  ? null
  : postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: process.env.NODE_ENV === "production",
      idle_timeout: 20,
      connect_timeout: 10,
    });

const db = client ? drizzle(client, { schema }) : null;

export { db }; 