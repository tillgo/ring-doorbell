import express, { Request } from 'express'
import { validate } from '../middleware/zodValidate'
import { Username, UsernameSchema } from '../shared/types'
import { getUser, getUserById, listUsers } from '../db/userRepository'
import { BadRequestProblem, ForbiddenProblem } from '../util/errors'

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await listUsers()
    res.status(200).json(users)
})

router.get('/me', async (req: Request, res) => {
    const client = req.client!
    if (client.type === 'DEVICE') {
        throw new ForbiddenProblem('Forbidden, devices cannot access this route')
    }
    const user = await getUserById(client.id)
    if (!user) {
        throw new BadRequestProblem('User not found')
    }

    res.status(200).json(user)
})

// TODO: remove this route, instead create a route that returns the user by NFC tag ID
router.get('/:username', validate({ params: UsernameSchema }), async (req, res) => {
    const data = req.params as Username

    const user = await getUser(data)
    if (!user) {
        throw new BadRequestProblem('User not found')
    }

    res.status(200).json(user)
})

export default router
