import express, { Request } from 'express'
import { validate } from '../middleware/zodValidate'
import { Device, DeviceRegisterData, DeviceRegisterSchema } from '../shared/types'
import {
    getDevicesForUser,
    getDeviceWithPassword,
    registerDeviceForUser,
} from '../db/deviceRepository'
import bcrypt from 'bcrypt'
import { BadRequestProblem } from '../util/errors'

const router = express.Router()

router.post('/register', validate({ body: DeviceRegisterSchema }), async (req: Request, res) => {
    const data = req.body as DeviceRegisterData
    const userId = req.client!.id

    const device = await getDeviceWithPassword(data.identifier)

    if (!device) {
        throw new BadRequestProblem('Incorrect identifier or password')
    }
    if (device.ownerId) {
        throw new BadRequestProblem('Device already registered')
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, device.passwordHash)
    if (!isPasswordCorrect) {
        throw new BadRequestProblem('Incorrect identifier or password')
    }

    await registerDeviceForUser(data.identifier, userId, data.nickname)

    res.status(200).json({ message: 'Registered device successfully' })
})

router.get('/me', async (req: Request, res) => {
    const userId = req.client!.id

    const devices = await getDevicesForUser(userId)
    const mapped: Device[] = devices.map((device) => ({
        id: device.id,
        identifier: device.identifier,
        nickname: device.nickname ?? device.identifier,
        createdAt: device.createdAt,
        ownerId: device.ownerId,
    }))

    res.status(200).json(mapped)
})

export default router
