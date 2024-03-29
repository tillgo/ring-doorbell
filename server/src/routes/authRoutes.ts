import express from 'express'
import { validate } from '../middleware/zodValidate'
import { LoginData, LoginSchema } from '../shared/types'
import { createUser, getUserWithPassword } from '../db/userRepository'
import bcrypt from 'bcrypt'
import { createSecretToken } from '../util/jwtUtils'

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
            res.cookie('token', token, {
                httpOnly: false,
            })

            res.status(201).json(user)
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
        res.cookie('token', token, {
            httpOnly: false,
        })

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Login failed',
        })
    }
})

export default router
