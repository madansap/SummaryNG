import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const summaries = sqliteTable('summaries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type Summary = typeof summaries.$inferSelect;
export type NewSummary = typeof summaries.$inferInsert; 