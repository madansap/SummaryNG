import { drizzle } from "drizzle-orm/d1"
import { eq } from "drizzle-orm"
import * as schema from "@/drizzle/schema"

export const db = drizzle(process.env.DB as D1Database, { schema }) 