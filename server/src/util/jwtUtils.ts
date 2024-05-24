import jwt from 'jsonwebtoken'
import { getConfig } from './EnvManager'
import { JWTPayload } from '../shared/types'

export const createSecretToken = ({id, name, type}: JWTPayload) => {
    return jwt.sign({ id, name: name, type }, getConfig().JWT_SECRET, {
        expiresIn: '1h',
    })
}

export const createRefreshToken = () => {
    return jwt.sign({}, getConfig().JWT_SECRET, {
        expiresIn: '1y',
    })
}

export const verifySecretToken = (token: string) => {
    return jwt.verify(token, getConfig().JWT_SECRET) as JWTPayload
}
