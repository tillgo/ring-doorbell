import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, z, ZodError, ZodObject } from 'zod'

type Schema = {
    body?: AnyZodObject
    query?: AnyZodObject
    params?: AnyZodObject
}

const createCombinedSchema = (schema: {
    body?: AnyZodObject
    query?: AnyZodObject
    params?: AnyZodObject
}) => {
    return z.object({
        body: schema.body ? schema.body : z.any(), // Optional body schema
        query: schema.query ? schema.query : z.any(), // Optional query schema
        params: schema.params ? schema.params : z.any(), // Optional params schema
    })
}

export const validate =
    (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const zodSchema = createCombinedSchema(schema)
            await zodSchema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            return next()
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: error,
                    message: 'Validation errors occurred',
                })
            } else {
                console.error('Unexpected error:', error)
                next(error)
            }
        }
    }
