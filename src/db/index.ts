import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema"

let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDB(d1: D1Database) {
  if (!db) {
    db = drizzle(d1, { schema })
  }
  return db
} 