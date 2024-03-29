import { GetUserData, User, CreateUserData, UserWithPassword } from '../shared/types'
import { db } from '../index'
import { users } from './schema'
import { eq, getTableColumns } from 'drizzle-orm'

export const createUser = async (user: CreateUserData): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(users)
    const newUser = await db.insert(users).values(user).returning(rest)
    return newUser[0]
}

export const getUser = async (data: GetUserData): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(users)
    const result = await db.select(rest).from(users).where(eq(users.username, data.username))
    return result[0]
}

export const getUserWithPassword = async (data: GetUserData): Promise<UserWithPassword> => {
    const result = await db.select().from(users).where(eq(users.username, data.username))
    return result[0]
}

export const getUserById = async (id: string): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(users)
    const result = await db.select(rest).from(users).where(eq(users.id, id))
    return result[0]
}
