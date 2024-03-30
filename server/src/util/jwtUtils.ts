import jwt, { JwtPayload } from 'jsonwebtoken'

export const createSecretToken = (id: string, username: string) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET ?? '', {
        expiresIn: '7d',
    })
}

export const verifySecretToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload
}
