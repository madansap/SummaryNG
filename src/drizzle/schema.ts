import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const summaries = pgTable('summaries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Summary = typeof summaries.$inferSelect;
export type NewSummary = typeof summaries.$inferInsert; 