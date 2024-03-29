import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from '../db/schema'
import { z } from 'zod'

// User Schemas -------------------------------------------------------------------------------------------------------

const userSchema = createSelectSchema(users)
export type User = z.infer<typeof userSchema>

export const createUserSchema = createInsertSchema(users, {
    username: z
        .string()
        .max(50, "Username can't be longer than 50 characters")
        .min(3, 'Username must be at least 3 characters long')
        .regex(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
})
export type CreateUser = z.infer<typeof createUserSchema>

export const getUserSchema = createSelectSchema(users).pick({ username: true })
export type GetUser = z.infer<typeof getUserSchema>

// ... ------------------------------------------------------------------------------------------------------
