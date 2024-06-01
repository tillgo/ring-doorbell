import { Username, User, CreateUserData, UserWithPassword } from '../shared/types'
import { db } from '../index'
import { device, user, user_device } from './schema'
import { eq, getTableColumns, or } from 'drizzle-orm'
import { inArray } from 'drizzle-orm/sql/expressions/conditions'

export const createUser = async (data: CreateUserData): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(user)
    const newUser = await db.insert(user).values(data).returning(rest)
    return newUser[0]
}

export const getUser = async (data: Username): Promise<User | undefined> => {
    return await db.query.user
        .findFirst({
            columns: {
                passwordHash: false,
            },
            where: (user, { eq }) => eq(user.username, data.username),
        })
        .execute()
}

export const getUserWithPassword = async (
    data: Username
): Promise<UserWithPassword | undefined> => {
    return await db.query.user
        .findFirst({
            where: (user, { eq }) => eq(user.username, data.username),
        })
        .execute()
}

export const getUserById = async (id: string): Promise<User | undefined> => {
    return await db.query.user
        .findFirst({
            columns: {
                passwordHash: false,
            },
            where: (user, { eq }) => eq(user.id, id),
        })
        .execute()
}

export const listUsers = async (): Promise<User[]> => {
    return await db.query.user
        .findMany({
            columns: {
                passwordHash: false,
            },
        })
        .execute()
}

export const getUsersForDevice = async (deviceId: string): Promise<User[]> => {
    return await db.query.user
        .findMany({
            columns: {
                passwordHash: false,
            },
            where: or(
                eq(
                    user.id,
                    db.select({ id: device.ownerId }).from(device).where(eq(device.id, deviceId))
                ),
                inArray(
                    user.id,
                    db
                        .select({ id: user_device.userId })
                        .from(user_device)
                        .where(eq(user_device.deviceId, deviceId))
                )
            ),
        })
        .execute()
}
