import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/drizzle/schema";

const sqlite = new Database("local.db");
export const mockDb = drizzle(sqlite, { schema }); 