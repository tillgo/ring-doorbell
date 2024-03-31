import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { refreshTokens, users } from '../db/schema'
import { undefined, z } from 'zod'

const UserSchema = createSelectSchema(users).omit({ passwordHash: true })
export type User = z.infer<typeof UserSchema>

const UserWithPasswordSchema = createSelectSchema(users)
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

const CreateUserSchema = createInsertSchema(users)
export type CreateUserData = z.infer<typeof CreateUserSchema>

export const UsernameSchema = createSelectSchema(users).pick({ username: true })
export type Username = z.infer<typeof UsernameSchema>

export const RefreshTokenSchema = z.object({
    userId: z.string().uuid(),
    refreshToken: z.string().max(255),
})
export type RefreshTokenData = z.infer<typeof RefreshTokenSchema>

const SaveRefreshTokenSchema = createInsertSchema(refreshTokens)
export type SaveRefreshTokenData = z.infer<typeof SaveRefreshTokenSchema>
