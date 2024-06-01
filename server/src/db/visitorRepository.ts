import { db } from '../index'
import { eq } from 'drizzle-orm'
import { visitor } from './schema'

export const getVisitorByNfcCardId = async (nfcCardId: string) => {
    return await db.query.visitor
        .findFirst({
            where: eq(visitor.nfcCardId, nfcCardId),
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
