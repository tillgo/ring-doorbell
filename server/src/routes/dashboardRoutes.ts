import express, { Request } from 'express'
import { getDevicesForUser } from '../db/deviceRepository'
import { DashboardData } from '../shared/types'
import { isClientOnline } from './socket'

const router = express.Router()

router.get('/', async (req: Request, res) => {
    const userId = req.client!.id

    const devices = await getDevicesForUser(userId)

    const data: DashboardData = {
        devices: devices.map((device) => ({
            ...device,
            onlineStatus: isClientOnline(device.id),
        })),
        history: [],
    }

    res.status(200).json(data)
})

export default router
