import express, { Request } from 'express'
import { getDevicesForUser } from '../db/deviceRepository'
import {
    DashboardData,
    DeviceId,
    DeviceIdSchema,
    HistoryLog,
    HistoryLogPayload,
    HistoryLogType,
    HistoryLogVariableData,
} from '../shared/types'
import { isClientOnline } from './socket'
import { getHistoryForDevices } from '../db/historyRepository'
import { validate } from '../middleware/zodValidate'
import { getVisitorById, getVisitorByNfcCardId } from '../db/visitorRepository'

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
        history: historyLogs as HistoryLog[],
    }

    res.status(200).json(data)
})

// TODO: visitorId schema erstellen und nutzen
router.get('/visitors/:id', validate({ params: DeviceIdSchema }), async (req: Request, res) => {
    const data = req.params as DeviceId

    const visitor = await getVisitorById(data.id)

    res.status(200).json(visitor)
})

export default router
