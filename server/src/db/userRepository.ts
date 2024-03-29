import { CreateUser, GetUser, User } from '../shared/types'
import { db } from '../index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export const createUser = async (user: CreateUser): Promise<User> => {
    const newUser = await db.insert(users).values(user).returning()
    return newUser[0]
}

export const getUser = async (data: GetUser): Promise<User> => {
    const result = await db.select().from(users).where(eq(users.username, data.username))
    return result[0]
}
