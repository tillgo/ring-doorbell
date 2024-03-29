import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from '../db/schema'
import { z } from 'zod'

// User Schemas -------------------------------------------------------------------------------------------------------

const userSchema = createSelectSchema(users)
export type User = z.infer<typeof userSchema>

export const createUserSchema = createInsertSchema(users)
export type CreateUser = z.infer<typeof createUserSchema>

export const getUserSchema = createSelectSchema(users).pick({ username: true })
export type GetUser = z.infer<typeof getUserSchema>

// ... ------------------------------------------------------------------------------------------------------
