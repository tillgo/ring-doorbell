import express from 'express'
import { validate } from '../middleware/zodValidate'
import { CreateUser, createUserSchema, GetUser, getUserSchema } from '../shared/types'
import { createUser, getUser } from '../db/userRepository'

const router = express.Router()

// Create a new user
router.post('/', validate({ body: createUserSchema }), async (req, res) => {
    const data = req.body as CreateUser

    try {
        const user = await createUser(data)
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'User creation failed',
        })
    }
})

// Get a user by username
router.get('/:username', validate({ params: getUserSchema }), async (req, res) => {
    const data = req.params as GetUser

    try {
        const user = await getUser(data)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'User not found',
        })
    }
})

export default router
