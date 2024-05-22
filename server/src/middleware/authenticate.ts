import { NextFunction, Request, Response } from 'express'
import { verifySecretToken } from '../util/jwtUtils'
import { TokenExpiredError } from 'jsonwebtoken'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    try {
        const rawToken = token.replace(/^Bearer\s+/, '')
        const decoded = verifySecretToken(rawToken)

        if (decoded.id) {
            req.userId = decoded.id

            return next()
        }

        return res.status(401).json({
            message: 'Unauthorized, userId not found in token',
        })
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send({ message: 'Unauthorized, Token expired' })
        }

        return res.status(401).json({
            message: 'Unauthorized, invalid token',
        })
    }
}
