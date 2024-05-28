import { NextFunction, Request, Response } from 'express'
import { ThrowableProblem } from '../util/errors'
import { ZodError } from 'zod'

/**
 * Error handler middleware.
 * This middleware catches errors thrown in the application and sends an appropriate response.
 *
 * @param err error object, that was caught
 * @param req
 * @param res
 * @param next
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ThrowableProblem) {
        // Handle custom problems
        console.log('Custom problem caught:', err)
        return res.status(err.status).send({ message: err.message })
    } else if (err instanceof ZodError) {
        // Handle Zod validation errors
        console.log('Zod validation error:', err.issues)
        const allErrors = err.issues.map((issue) => issue.message) // Extract all error messages
        return res
            .status(400)
            .send({ message: 'Invalid request data', validationErrors: allErrors })
    }

    // Handle unexpected errors
    console.error('Unexpected error:', err)
    res.status(500).send({ message: 'Unexpected server error' })
}
