import express, { Request } from 'express'
import { getDevicesForUser } from '../db/deviceRepository'
import {
    DashboardData,
    HistoryLogPayload,
    HistoryLogType,
    HistoryLogVariableData,
} from '../shared/types'
import { isClientOnline } from './socket'
import { getHistoryForDevices } from '../db/historyRepository'

const router = express.Router()

router.get('/', async (req: Request, res) => {
    const userId = req.client!.id

    const devices = await getDevicesForUser(userId)
    const historyLogs = await getHistoryForDevices(devices.map((device) => device.id))

    const data: DashboardData = {
        devices: devices.map((device) => ({
            ...device,
            onlineStatus: isClientOnline(device.id),
        })),
        history: historyLogs.map((log) => ({
            ...log,
            ...({ type: log.type, payload: log.payload } as HistoryLogVariableData),
        })),
    }

    res.status(200).json(data)
})

export default router
