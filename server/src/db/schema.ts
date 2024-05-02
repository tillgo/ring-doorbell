import { pgTable, timestamp, uuid, varchar, boolean, index, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    passwordHash: varchar('passwordHash', { length: 64 }).notNull(),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export const usersRelations = relations(users, ({ many }) => ({
    users_devices: many(users_devices),
    refreshTokens: many(refreshTokens),
    ownedDevices: many(devices),
}))

export const users_devices = pgTable(
    'users_devices',
    {
        userId: uuid('userId')
            .notNull()
            .references(() => users.id),
        deviceId: uuid('deviceId')
            .notNull()
            .references(() => devices.id),

        userNickname: varchar('userNickname', { length: 50 }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.deviceId] }),
        }
    }
)
export const users_devicesRelations = relations(users_devices, ({ one }) => ({
    user: one(users, { fields: [users_devices.userId], references: [users.id] }),
    device: one(devices, { fields: [users_devices.deviceId], references: [devices.id] }),
}))

export const devices = pgTable('devices', {
    id: uuid('id').defaultRandom().primaryKey(),
    nickname: varchar('nickname', { length: 50 }),
    ownerId: uuid('ownerId')
        .notNull()
        .references(() => users.id),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export const devicesRelations = relations(devices, ({ one, many }) => ({
    owner: one(users, { fields: [devices.ownerId], references: [users.id] }),
    users_devices: many(users_devices),
    visitors: many(visitors),
}))

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
export const visitorsRelations = relations(visitors, ({ one }) => ({
    device: one(devices, { fields: [visitors.deviceId], references: [devices.id] }),
}))

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
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}))
