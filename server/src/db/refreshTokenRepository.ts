import { RefreshTokenData, SaveRefreshTokenData } from '../shared/types'
import { and, eq } from 'drizzle-orm'
import { refreshToken } from './schema'
import { db } from '../index'

export const getRefreshToken = async (data: RefreshTokenData) => {
    const result = await db
        .select()
        .from(refreshToken)
        .where(and(eq(refreshToken.userId, data.userId), eq(refreshToken.token, data.refreshToken)))
    return result[0]
}

export const saveRefreshToken = async (data: SaveRefreshTokenData) => {
    await db.insert(refreshToken).values(data)
}
