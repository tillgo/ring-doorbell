import { pgTable, timestamp, uuid, varchar, boolean, index, primaryKey } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    passwordHash: varchar('passwordHash', { length: 64 }).notNull(),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const users_devices = pgTable(
    'users_devices',
    {
        userId: uuid('userId')
            .notNull()
            .references(() => users.id),
        deviceId: uuid('deviceId')
            .notNull()
            .references(() => devices.id),

        isOwner: boolean('isOwner').notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.deviceId] }),
        }
    }
)

export const devices = pgTable('devices', {
    id: uuid('id').defaultRandom().primaryKey(),
    nickname: varchar('nickname', { length: 50 }),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const visitors = pgTable('visitors', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    nickname: varchar('nickname', { length: 50 }),

    nfcCardId: varchar('nfcCardId', { length: 255 }).unique().notNull(),
    deviceId: uuid('deviceId')
        .notNull()
        .references(() => devices.id),

    isWhitelisted: boolean('isWhitelisted').notNull().default(false),

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
