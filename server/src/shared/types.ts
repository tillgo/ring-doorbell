import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from '../db/schema'
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
        .min(6, 'Password must be at least 6 characters long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
})
export type LoginData = z.infer<typeof LoginSchema>

export const CreateUserSchema = createInsertSchema(users)
export type CreateUserData = z.infer<typeof CreateUserSchema>

export const GetUserSchema = createSelectSchema(users).pick({ username: true })
export type GetUserData = z.infer<typeof GetUserSchema>
