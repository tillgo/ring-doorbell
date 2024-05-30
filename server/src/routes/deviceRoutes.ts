import express, { Request } from 'express'
import { validate } from '../middleware/zodValidate'
import {
    AddHouseholdMemberData,
    AddHouseholdMemberSchema,
    DeleteHouseholdMemberData,
    DeleteHouseholdMemberSchema,
    Device,
    DeviceId,
    DeviceIdSchema,
    DeviceRegisterData,
    DeviceRegisterSchema,
    HouseholdMember,
    Visitor,
} from '../shared/types'
import {
    addHouseholdMember,
    deleteHouseholdMember,
    getDeviceById,
    getDevicesForUser,
    getDeviceWithPassword,
    registerDeviceForUser,
} from '../db/deviceRepository'
import bcrypt from 'bcrypt'
import { BadRequestProblem, ForbiddenProblem } from '../util/errors'

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

router.get(
    '/:id/household-members',
    validate({ params: DeviceIdSchema }),
    async (req: Request, res) => {
        const data = req.params as DeviceId

        const device = await getDeviceById(data.id)
        if (!device) {
            throw new BadRequestProblem('Device not found')
        }

        const userId = req.client!.id
        if (device.ownerId !== userId) {
            throw new ForbiddenProblem()
        }

        const householdMembers: HouseholdMember[] = device.users

        res.status(200).json(householdMembers)
    }
)

router.delete(
    '/:deviceId/household-members/:userId',
    validate({ params: DeleteHouseholdMemberSchema }),
    async (req: Request, res) => {
        const data = req.params as DeleteHouseholdMemberData

        const device = await getDeviceById(data.deviceId)
        if (!device) {
            throw new BadRequestProblem('Device not found')
        }

        const userId = req.client!.id
        if (device.ownerId !== userId) {
            throw new ForbiddenProblem()
        }

        if (!device.users.some((user) => user.userId === data.userId)) {
            throw new BadRequestProblem('Not a registered household member')
        }

        await deleteHouseholdMember(data.deviceId, data.userId)

        res.status(200).json({ message: 'Deleted household member successfully' })
    }
)

router.get('/:id/visitors', validate({ params: DeviceIdSchema }), async (req: Request, res) => {
    const data = req.params as DeviceId

    const device = await getDeviceById(data.id)
    if (!device) {
        throw new BadRequestProblem('Device not found')
    }

    const userId = req.client!.id
    if (device.ownerId !== userId) {
        throw new ForbiddenProblem()
    }

    const visitors: Visitor[] = device.visitors

    res.status(200).json(visitors)
})

router.post(
    '/:id/household-members',
    validate({ body: AddHouseholdMemberSchema, params: DeviceIdSchema }),
    async (req: Request, res) => {
        const data = req.body as AddHouseholdMemberData
        const params = req.params as DeviceId

        const device = await getDeviceById(params.id)
        if (!device) {
            throw new BadRequestProblem('Device not found')
        }

        const userId = req.client!.id
        if (device.ownerId !== userId) {
            throw new ForbiddenProblem('Device not owned by user')
        }

        if (device.users.some((user) => user.userId === data.userId)) {
            throw new BadRequestProblem('User already added to device')
        }

        await addHouseholdMember(params.id, data.userId, data.nickname)

        res.status(200).json({ message: 'Added household member successfully' })
    }
)

export default router
