type Config = {
  schema: string;
  out: string;
  driver: 'pg';
  dbCredentials: {
    connectionString: string;
  };
  verbose?: boolean;
  strict?: boolean;
};

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config 