import express, { Request } from 'express'
import { validate } from '../middleware/zodValidate'
import { Username, UsernameSchema } from '../shared/types'
import { getUser, getUserById } from '../db/userRepository'

const router = express.Router()

router.get('/me', async (req: Request, res) => {
    try {
        const user = await getUserById(req.userId!)
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Failed to get user',
        })
    }
})

// TODO: remove this route, instead create a route that returns the user by NFC tag ID
router.get('/:username', validate({ params: UsernameSchema }), async (req, res) => {
    const data = req.params as Username

    try {
        const user = await getUser(data)
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Failed to get user by username',
        })
    }
})

export default router
