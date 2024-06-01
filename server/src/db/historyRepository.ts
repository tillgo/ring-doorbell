import { inArray } from 'drizzle-orm/sql/expressions/conditions'
import { db } from '../index'
import { historyLog } from './schema'
import { CreateHistoryLogData } from '../shared/types'
import { desc } from 'drizzle-orm'

export const getHistoryForDevices = async (deviceIds: string[]) => {
    return await db.query.historyLog
        .findMany({
            with: {
                device: {
                    columns: {
                        secretHash: false,
                        passwordHash: false,
                    },
                },
            },
            where: inArray(historyLog.deviceId, deviceIds),
            orderBy: desc(historyLog.timestamp),
        })
        .execute()
}

export const createHistoryLog = async (data: CreateHistoryLogData) => {
    return await db.insert(historyLog).values(data).execute()
}
