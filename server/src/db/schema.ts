import { pgTable, timestamp, uuid, varchar, boolean, index } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    passwordHash: varchar('passwordHash', { length: 64 }).notNull(),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const refreshTokens = pgTable(
    'refreshTokens',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('userId')
            .notNull()
            .references(() => users.id),
        token: varchar('token', { length: 255 }).notNull(),
        isValid: boolean('isValid').notNull(),

        createdAt: timestamp('createdAt').notNull().defaultNow(),
    },
    (table) => {
        return {
            nameIdx: index('userId_token_idx').on(table.userId, table.token),
        }
    }
)
