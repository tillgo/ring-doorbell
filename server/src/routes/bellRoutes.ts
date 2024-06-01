import express, { Request } from 'express'
import { validate } from '../middleware/zodValidate'
import { VisitorRingData, VisitorRingSchema } from '../shared/types'
import { createNewVisitor, getVisitorByNfcCardId } from '../db/visitorRepository'
import { ForbiddenProblem } from '../util/errors'
import { getUsersForDevice } from '../db/userRepository'
import { createHistoryLog } from '../db/historyRepository'

const router = express.Router()

router.post('/ring', validate({ body: VisitorRingSchema }), async (req: Request, res) => {
    const data = req.body as VisitorRingData

    if (req.client!.type !== 'DEVICE') {
        throw new ForbiddenProblem()
    }

    let visitor = await getVisitorByNfcCardId(data.nfcCardId)
    if (!visitor) {
        visitor = await createNewVisitor(data.nfcCardId, req.client!.id)
    }

    await createHistoryLog({
        deviceId: req.client!.id,
        type: 'BELL_RING',
        payload: {
            visitorId: visitor.id,
        },
    })

    const possibleUsers = await getUsersForDevice(req.client!.id)

    res.status(200).send({
        visitor,
        possibleUsers,
    })
})

export default router
