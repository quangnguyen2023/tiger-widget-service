import { pgTable, jsonb, timestamp, varchar } from 'drizzle-orm/pg-core';

export const widgetsTable = pgTable('widgets', {
  id: varchar({ length: 50 }).primaryKey(),
  owner: varchar({ length: 5 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  customValues: jsonb().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  name: varchar({ length: 50 }),
});
