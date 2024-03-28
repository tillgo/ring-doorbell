import { index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).unique(),
    passwordHash: varchar('passwordHash', { length: 64 }),
}, (table) => {
    return {
        usernameIdx: index("username_idx").on(table.username),
    };
});