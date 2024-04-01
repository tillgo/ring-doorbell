import express from 'express'
import { validate } from '../middleware/zodValidate'
import {
    LoginData,
    LoginSchema,
    RefreshTokenData,
    RefreshTokenSchema,
    SaveRefreshTokenData,
} from '../shared/types'
import { createUser, getUserById, getUserWithPassword } from '../db/userRepository'
import bcrypt from 'bcrypt'
import { createRefreshToken, createSecretToken, verifySecretToken } from '../util/jwtUtils'
import { getRefreshToken, saveRefreshToken } from '../db/refreshTokenRepository'

const router = express.Router()

router.post('/sign-up', validate({ body: LoginSchema }), async (req, res) => {
    const data = req.body as LoginData

    try {
        const existingUser = await getUserWithPassword({ username: data.username })
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            })
        }

        bcrypt.hash(data.password, 10, async function (err, hash) {
            if (err) {
                return res.status(400).json({
                    message: 'Failed to hash password',
                })
            }

            const user = await createUser({ username: data.username, passwordHash: hash })

            const token = createSecretToken(user.id, user.username)
            const refreshToken = createRefreshToken()

            await saveRefreshToken({ userId: user.id, token: refreshToken, isValid: true })

            res.status(201).json({ user, token, refreshToken })
        })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Sign-up failed',
        })
    }
})

router.post('/sign-in', validate({ body: LoginSchema }), async (req, res) => {
    const data = req.body as LoginData

    try {
        const user = await getUserWithPassword({ username: data.username })
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect username or password',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(data.password, user.passwordHash)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Incorrect username or password',
            })
        }

        const token = createSecretToken(user.id, user.username)
        const refreshToken = createRefreshToken()

        await saveRefreshToken({ userId: user.id, token: refreshToken, isValid: true })

        res.status(200).json({ user, token, refreshToken })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Login failed',
        })
    }
})

router.post('/refresh-token', validate({ body: RefreshTokenSchema }), async (req, res) => {
    const data = req.body as RefreshTokenData

    try {
        verifySecretToken(data.refreshToken)

        const refreshToken = await getRefreshToken(data)
        if (!refreshToken || !refreshToken.isValid) {
            return res.status(400).json({
                message: "Refresh token and user don't match or refresh token is not valid",
            })
        }

        const user = await getUserById(data.userId)
        const newToken = createSecretToken(user.id, user.username)

        res.status(200).json({ token: newToken })
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Token refresh failed',
        })
    }
})

export default router
