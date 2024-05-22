import jwt, { JwtPayload } from 'jsonwebtoken'
import { getConfig } from './EnvManager'

export const createSecretToken = (id: string, username: string) => {
    return jwt.sign({ id, username }, getConfig().JWT_SECRET, {
        expiresIn: '1h',
    })
}

export const createRefreshToken = () => {
    return jwt.sign({}, getConfig().JWT_SECRET, {
        expiresIn: '1y',
    })
}

export const verifySecretToken = (token: string) => {
    return jwt.verify(token, getConfig().JWT_SECRET) as JwtPayload
}
