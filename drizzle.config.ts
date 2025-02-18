import type { Config } from "drizzle-kit"

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  driver: process.env.NODE_ENV === 'development' ? 'better-sqlite' : 'pg',
  dbCredentials: process.env.NODE_ENV === 'development' 
    ? {
        url: "local.db",
      }
    : {
        connectionString: process.env.DATABASE_URL!,
      },
  verbose: true,
  strict: true,
} satisfies Config 