import { NextFunction, Request, Response } from 'express'
import { verifySecretToken } from '../util/jwtUtils'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    try {
        const decoded = verifySecretToken(token)

        if (decoded.id && decoded.exp) {
            // @ts-ignore
            req.userId = decoded.id

            const now = Date.now() / 1000
            if (decoded.exp >= now) {
                return res.status(401).json({
                    message: 'Unauthorized, Token expired',
                })
            }
            return next()
        }

        return res.status(401).json({
            message: 'Unauthorized, invalid token',
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized, invalid token',
        })
    }
}
