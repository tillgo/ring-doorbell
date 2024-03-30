import { RefreshTokenData, SaveRefreshTokenData } from '../shared/types'
import { and, eq } from 'drizzle-orm'
import { refreshTokens } from './schema'
import { db } from '../index'

export const getRefreshToken = async (data: RefreshTokenData) => {
    const result = await db
        .select()
        .from(refreshTokens)
        .where(
            and(eq(refreshTokens.userId, data.userId), eq(refreshTokens.token, data.refreshToken))
        )
    return result[0]
}

export const saveRefreshToken = async (data: SaveRefreshTokenData) => {
    await db.insert(refreshTokens).values(data)
}
