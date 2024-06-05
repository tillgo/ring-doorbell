import { db } from '../index'
import { and, eq } from 'drizzle-orm'
import { visitor } from './schema'

export const getVisitorByNfcCardId = async (nfcCardId: string, deviceId: string) => {
    return await db.query.visitor
        .findFirst({
            where: and(eq(visitor.nfcCardId, nfcCardId), eq(visitor.deviceId, deviceId)),
        })
        .execute()
}

export const getVisitorById = async (visitorId: string) => {
    return await db.query.visitor
        .findFirst({
            where: eq(visitor.id, visitorId),
        })
        .execute()
}

export const createNewVisitor = async (nfcCardId: string, deviceId: string) => {
    const newVisitor = await db
        .insert(visitor)
        .values({
            nfcCardId,
            deviceId,
        })
        .returning()
        .execute()
    return newVisitor[0]
}
