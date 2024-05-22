import { pgTable, timestamp, uuid, varchar, boolean, index, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const user = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    passwordHash: varchar('passwordHash', { length: 64 }).notNull(),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export const userRelations = relations(user, ({ many }) => ({
    devices: many(user_device),
    refreshTokens: many(refreshToken),
    ownedDevices: many(device),
}))

export const user_device = pgTable(
    'users_devices',
    {
        userId: uuid('userId')
            .notNull()
            .references(() => user.id),
        deviceId: uuid('deviceId')
            .notNull()
            .references(() => device.id),

        userNickname: varchar('userNickname', { length: 50 }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.deviceId] }),
        }
    }
)
export const user_deviceRelations = relations(user_device, ({ one }) => ({
    user: one(user, { fields: [user_device.userId], references: [user.id] }),
    device: one(device, { fields: [user_device.deviceId], references: [device.id] }),
}))

export const device = pgTable('devices', {
    id: uuid('id').defaultRandom().primaryKey(),

    identifier: varchar('identifier', { length: 255 }).unique().notNull(),
    secret: varchar('secret', { length: 255 }).notNull(),

    nickname: varchar('nickname', { length: 50 }),
    ownerId: uuid('ownerId').references(() => user.id), // nullable

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export const deviceRelations = relations(device, ({ one, many }) => ({
    owner: one(user, { fields: [device.ownerId], references: [user.id] }),
    users: many(user_device),
    visitors: many(visitor),
}))

export const visitor = pgTable('visitors', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    nickname: varchar('nickname', { length: 50 }),

    nfcCardId: varchar('nfcCardId', { length: 255 }).unique().notNull(),
    deviceId: uuid('deviceId')
        .notNull()
        .references(() => device.id),

    isWhitelisted: boolean('isWhitelisted').notNull().default(false),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export const visitorRelations = relations(visitor, ({ one }) => ({
    device: one(device, { fields: [visitor.deviceId], references: [device.id] }),
}))

export const refreshToken = pgTable(
    'refreshTokens',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('userId')
            .notNull()
            .references(() => user.id),
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
export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
    user: one(user, { fields: [refreshToken.userId], references: [user.id] }),
}))
