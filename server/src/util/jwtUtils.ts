import jwt, { JwtPayload } from 'jsonwebtoken'

export const createSecretToken = (id: string, username: string) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET ?? '', {
        expiresIn: '1h',
    })
}

export const createRefreshToken = () => {
    return jwt.sign({}, process.env.JWT_SECRET ?? '', {
        expiresIn: '1y',
    })
}

export const verifySecretToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload
}
