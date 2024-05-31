import { db } from '../index'
import { DeviceIdentifier, EditVisitorData } from '../shared/types'
import { device, user_device, visitor } from './schema'
import { and, eq, or } from 'drizzle-orm'
import { inArray } from 'drizzle-orm/sql/expressions/conditions'

export const getDevicesForOwner = async (userId: string) => {
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

export const getDevicesForUser = async (userId: string) => {
    return await db.query.device
        .findMany({
            columns: {
                passwordHash: false,
                secretHash: false,
            },
            where: or(
                eq(device.ownerId, userId),
                inArray(
                    device.id,
                    db
                        .select({ id: user_device.deviceId })
                        .from(user_device)
                        .where(eq(user_device.userId, userId))
                )
            ),
        })
        .execute()
}

export const getDeviceById = async (deviceId: string) => {
    return await db.query.device
        .findFirst({
            columns: {
                passwordHash: false,
                secretHash: false,
            },
            with: {
                owner: {
                    columns: {
                        passwordHash: false,
                    },
                },
                users: {
                    with: {
                        user: {
                            columns: {
                                passwordHash: false,
                            },
                        },
                    },
                },
                visitors: true,
            },
            where: (device, { eq }) => eq(device.id, deviceId),
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

export const addHouseholdMember = async (deviceId: string, userId: string, nickname?: string) => {
    await db
        .insert(user_device)
        .values({
            deviceId: deviceId,
            userId: userId,
            userNickname: nickname,
        })
        .execute()
}

export const deleteHouseholdMember = async (deviceId: string, userId: string) => {
    await db
        .delete(user_device)
        .where(and(eq(user_device.deviceId, deviceId), eq(user_device.userId, userId)))
        .execute()
}

export const deleteVisitor = async (visitorId: string) => {
    await db.delete(visitor).where(eq(visitor.id, visitorId)).execute()
}

export const updateVisitor = async (visitorId: string, data: EditVisitorData) => {
    await db.update(visitor).set(data).where(eq(visitor.id, visitorId)).execute()
}
