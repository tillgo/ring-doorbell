import { db } from '../index'
import { DeviceIdentifier } from '../shared/types'
import { device } from './schema'
import { eq } from 'drizzle-orm'

export const getDevicesForUser = async (userId: string) => {
    return await db.query.device
        .findMany({
            columns: {
                passwordHash: false,
                secretHash: false,
            },
            where: eq(device.ownerId, userId),
        })
        .execute()
}

export const getDeviceWithSecret = async (deviceIdentifier: DeviceIdentifier) => {
    return await db.query.device
        .findFirst({
            columns: {
                passwordHash: false,
            },
            where: (device, { eq }) => eq(device.identifier, deviceIdentifier.identifier),
        })
        .execute()
}

export const getDeviceWithPassword = async (identifier: string) => {
    return await db.query.device
        .findFirst({
            columns: {
                secretHash: false,
            },
            where: (device, { eq }) => eq(device.identifier, identifier),
        })
        .execute()
}

export const registerDeviceForUser = async (
    identifier: string,
    userId: string,
    nickname: string | undefined
) => {
    await db
        .update(device)
        .set({ ownerId: userId, nickname: nickname })
        .where(eq(device.identifier, identifier))
        .execute()
}
