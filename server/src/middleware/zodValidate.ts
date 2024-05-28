import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, z, ZodError } from 'zod'

type Schema<T extends AnyZodObject, K extends AnyZodObject, J extends AnyZodObject> = {
    body?: T
    query?: K
    params?: J
}

const createCombinedSchema = <
    T extends AnyZodObject,
    K extends AnyZodObject,
    J extends AnyZodObject,
>(
    schema: Schema<T, K, J>
) => {
    return z.object({
        body: schema.body ? schema.body : z.any(), // Optional body schema
        query: schema.query ? schema.query : z.any(), // Optional query schema
        params: schema.params ? schema.params : z.any(), // Optional params schema
    })
}

export const validate =
    <T extends AnyZodObject, K extends AnyZodObject, J extends AnyZodObject>(
        schema: Schema<T, K, J>
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const zodSchema = createCombinedSchema(schema)
            await zodSchema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            return next()
        } catch (error) {
            next(error)
        }
    }
