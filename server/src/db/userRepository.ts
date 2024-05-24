import { Username, User, CreateUserData, UserWithPassword } from '../shared/types'
import { db } from '../index'
import { user } from './schema'
import { eq, getTableColumns } from 'drizzle-orm'

export const createUser = async (data: CreateUserData): Promise<User> => {
    const { passwordHash, ...rest } = getTableColumns(user)
    const newUser = await db.insert(user).values(data).returning(rest)
    return newUser[0]
}

export const getUser = async (data: Username): Promise<User | undefined> => {
    return await db.query.user.findFirst({
        columns: {
            passwordHash: false
        },
        where: (user, {eq}) => eq(user.username, data.username),
    }).execute()

}

export const getUserWithPassword = async (data: Username): Promise<UserWithPassword | undefined> => {
    return await db.query.user.findFirst({
        where: (user, {eq}) => eq(user.username, data.username),
    }).execute()
}

export const getUserById = async (id: string): Promise<User | undefined> => {
    return await db.query.user.findFirst({
        columns: {
            passwordHash: false
        },
        where: (user, {eq}) => eq(user.id, id),
    }).execute()
}
