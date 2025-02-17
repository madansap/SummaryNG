import type { Config } from "drizzle-kit"

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'local.db',
  },
  verbose: true,
  strict: true,
} satisfies Config 