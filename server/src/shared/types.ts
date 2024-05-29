import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { device, refreshToken, user } from '../db/schema'
import { z } from 'zod'
import { JwtPayload } from 'jsonwebtoken'

export type JWTPayload = JwtPayload & { id: string; name: string; type: 'USER' | 'DEVICE' }

const UserSchema = createSelectSchema(user).omit({ passwordHash: true })
export type User = z.infer<typeof UserSchema>

const UserWithPasswordSchema = createSelectSchema(user)
export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>

export const LoginSchema = z.object({
    username: z
        .string()
        .describe('Username')
        .max(50, "Username can't be longer than 50 characters")
        .min(3, 'Username must be at least 3 characters long')
        .regex(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
    password: z
        .string()
        .describe('Password')
        .max(64, "Password can't be longer than 50 characters")
        .min(6, 'Password must be at least 6 characters long'),
})
export type LoginData = z.infer<typeof LoginSchema>

const CreateUserSchema = createInsertSchema(user)
export type CreateUserData = z.infer<typeof CreateUserSchema>

export const UsernameSchema = createSelectSchema(user).pick({ username: true })
export type Username = z.infer<typeof UsernameSchema>

export const DeviceLoginSchema = z.object({
    identifier: z
        .string({ message: 'Device identifier required' })
        .min(1, 'Device identifier required'),
    secret: z.string({ message: 'Device secret required' }).min(1, 'Device secret required'),
})
export type DeviceLoginData = z.infer<typeof DeviceLoginSchema>

export const DeviceRegisterSchema = z.object({
    identifier: z
        .string({ message: 'Device identifier required' })
        .min(1, 'Device identifier required'),
    password: z.string({ message: 'Device password required' }).min(1, 'Device password required'),
    nickname: z.string().optional(),
})
export type DeviceRegisterData = z.infer<typeof DeviceRegisterSchema>

const DeviceSchema = createSelectSchema(device).omit({
    secretHash: true,
    passwordHash: true,
})
export type Device = z.infer<typeof DeviceSchema>

export const DeviceIdentifierSchema = createSelectSchema(device).pick({ identifier: true })
export type DeviceIdentifier = z.infer<typeof DeviceIdentifierSchema>

export const DeviceIdSchema = createSelectSchema(device).pick({ id: true })
export type DeviceId = z.infer<typeof DeviceIdSchema>

export const RefreshTokenSchema = z.object({
    userId: z.string().uuid(),
    refreshToken: z.string().max(255),
})
export type RefreshTokenData = z.infer<typeof RefreshTokenSchema>

const SaveRefreshTokenSchema = createInsertSchema(refreshToken)
export type SaveRefreshTokenData = z.infer<typeof SaveRefreshTokenSchema>

export const AddHouseholdMemberSchema = z.object({
    deviceId: z.string({ message: 'Device ID required' }).uuid(),
    userId: z.string({ message: 'User ID required' }).min(1, 'User required'),
    nickname: z.string().optional(),
})
export type AddHouseholdMemberData = z.infer<typeof AddHouseholdMemberSchema>

// handcrafted types ----------------------------------------------------------------------------
export type HouseholdMember = {
    userId: string
    userNickname: string | null
    deviceId: string
    user: User
}
