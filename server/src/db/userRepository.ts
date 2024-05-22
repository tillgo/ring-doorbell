import { Username, User, CreateUserData, UserWithPassword } from '../shared/types'
import { db } from '../index'
import { user } from './schema'
import { eq, getTableColumns } from 'drizzle-orm'

export const createUser = async (data: CreateUserData): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(user)
    const newUser = await db.insert(user).values(data).returning(rest)
    return newUser[0]
}

export const getUser = async (data: Username): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(user)
    const result = await db.select(rest).from(user).where(eq(user.username, data.username))
    return result[0]
}

export const getUserWithPassword = async (data: Username): Promise<UserWithPassword> => {
    const result = await db.select().from(user).where(eq(user.username, data.username))
    return result[0]
}

export const getUserById = async (id: string): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(user)
    const result = await db.select(rest).from(user).where(eq(user.id, id))
    return result[0]
}
