import { NextFunction, Request, Response } from 'express'
import { verifySecretToken } from '../util/jwtUtils'
import { TokenExpiredError } from 'jsonwebtoken'
import { BadRequestProblem, UnauthorizedProblem } from '../util/errors'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']

    if (!token) {
        throw new UnauthorizedProblem('Unauthorized, token not found')
    }

    try {
        const rawToken = token.replace(/^Bearer\s+/, '')
        const decoded = verifySecretToken(rawToken)

        if (decoded.id && decoded.type) {
            req.client = { id: decoded.id, type: decoded.type }

            return next()
        }

        next(new UnauthorizedProblem('Unauthorized, clients ID or type not found in token'))
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new BadRequestProblem('Token expired')
        }

        throw new UnauthorizedProblem('Unauthorized, invalid token')
    }
}
