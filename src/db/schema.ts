import {
  pgTable,
  jsonb,
  timestamp,
  varchar,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const widgetsTable = pgTable('widgets', {
  id: varchar({ length: 50 }).primaryKey(),
  owner: varchar({ length: 5 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  customValues: jsonb('custom_values').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  name: varchar({ length: 50 }),
});

export const usersTable = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 50 }),
  avatar: varchar('avatar', { length: 200 }),
  emailVerified: boolean('email_verified').default(false),
  password: varchar('password', { length: 100 }), // null cho OAuth users
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accountsTable = pgTable('accounts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => usersTable.id, {
    onDelete: 'cascade',
  }),
  provider: varchar('provider', { length: 20 }).notNull(), // 'google', 'twitter', 'credentials'
  providerAccountId: varchar('provider_account_id', { length: 50 }).notNull(),
  accessToken: varchar('access_token', { length: 200 }),
  refreshToken: varchar('refresh_token', { length: 200 }),
  tokenType: varchar('token_type', { length: 20 }),
  scope: varchar('scope', { length: 100 }),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
