import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }),
});