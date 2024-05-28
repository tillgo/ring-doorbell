import express, { Request } from 'express'
import { validate } from '../middleware/zodValidate'
import {
    Device,
    DeviceRegisterData,
    DeviceRegisterSchema,
    Username,
    UsernameSchema,
} from '../shared/types'
import { getUser, getUserById } from '../db/userRepository'
import {
    getDevicesForUser,
    getDeviceWithPassword,
    registerDeviceForUser,
} from '../db/deviceRepository'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/register', validate({ body: DeviceRegisterSchema }), async (req: Request, res) => {
    const data = req.body as DeviceRegisterData
    const userId = req.client!.id

    const device = await getDeviceWithPassword(data.identifier)

    if (!device) {
        return res.status(400).json({
            message: 'Incorrect identifier or password',
        })
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, device.passwordHash)
    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: 'Incorrect identifier or password',
        })
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
    }))

    res.status(200).json(mapped)
})

export default router
