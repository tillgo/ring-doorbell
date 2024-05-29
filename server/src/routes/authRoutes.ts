import express from 'express'
import { validate } from '../middleware/zodValidate'
import {
    DeviceLoginData,
    DeviceLoginSchema,
    LoginData,
    LoginSchema,
    RefreshTokenData,
    RefreshTokenSchema,
} from '../shared/types'
import { createUser, getUserById, getUserWithPassword } from '../db/userRepository'
import bcrypt from 'bcrypt'
import { createRefreshToken, createSecretToken, verifySecretToken } from '../util/jwtUtils'
import { getRefreshToken, saveRefreshToken } from '../db/refreshTokenRepository'
import { getDeviceWithSecret } from '../db/deviceRepository'
import { BadRequestProblem } from '../util/errors'

const router = express.Router()

router.post('/sign-up', validate({ body: LoginSchema }), async (req, res) => {
    const data = req.body as LoginData

    const existingUser = await getUserWithPassword({ username: data.username })
    if (existingUser) {
        throw new BadRequestProblem('User already exists')
    }

    bcrypt.hash(data.password, 10, async function (err, hash) {
        if (err) {
            throw new BadRequestProblem('Error while hashing password')
        }

        const user = await createUser({ username: data.username, passwordHash: hash })

        const token = createSecretToken({ id: user.id, name: user.username, type: 'USER' })
        const refreshToken = createRefreshToken()

        await saveRefreshToken({ userId: user.id, token: refreshToken, isValid: true })

        res.status(201).json({ user, token, refreshToken })
    })
})

router.post('/sign-in', validate({ body: LoginSchema }), async (req, res) => {
    const data = req.body as LoginData

    const user = await getUserWithPassword({ username: data.username })
    if (!user) {
        throw new BadRequestProblem('Incorrect username or password')
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, user.passwordHash)
    if (!isPasswordCorrect) {
        throw new BadRequestProblem('Incorrect username or password')
    }

    const token = createSecretToken({ id: user.id, name: user.username, type: 'USER' })
    const refreshToken = createRefreshToken()

    await saveRefreshToken({ userId: user.id, token: refreshToken, isValid: true })

    res.status(200).json({ user, token, refreshToken })
})

router.post('/bell/sign-in', validate({ body: DeviceLoginSchema }), async (req, res) => {
    const data = req.body as DeviceLoginData
    const device = await getDeviceWithSecret({ identifier: data.identifier })
    if (!device) {
        throw new BadRequestProblem('Incorrect identifier or secret')
    }

    const isSecretCorrect = await bcrypt.compare(data.secret, device.secretHash)
    if (!isSecretCorrect) {
        throw new BadRequestProblem('Incorrect identifier or secret')
    }

    const isSecretCorrect = await bcrypt.compare(data.secret, device.secretHash)
    if(!isSecretCorrect) {
        throw new BadRequestProblem('Incorrect device secret')
    }

    const token = createSecretToken({
        id: device.id,
        name: device.nickname ?? device.identifier,
        type: 'DEVICE',
    })

    const { secretHash, ...deviceWithoutSecret } = device

    res.status(200).json({ device: deviceWithoutSecret, token })
})

router.post('/refresh-token', validate({ body: RefreshTokenSchema }), async (req, res) => {
    const data = req.body as RefreshTokenData

    verifySecretToken(data.refreshToken)

    const refreshToken = await getRefreshToken(data)
    if (!refreshToken || !refreshToken.isValid) {
        throw new BadRequestProblem(
            'Refresh token and user dont match or refresh token is not valid'
        )
    }

    const user = await getUserById(data.userId)
    if (!user) {
        throw new BadRequestProblem("User doesn't exist anymore")
    }

    const newToken = createSecretToken({ id: user.id, name: user.username, type: 'USER' })

    res.status(200).json({ token: newToken })
})

export default router
